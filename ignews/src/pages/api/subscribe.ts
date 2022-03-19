import { query } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
    ref: {
        id: string;
    },
    data: {
        stripe_customer_id: string
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === 'POST') {
        // PASSO A REQUEST PARA O getSession, POIS NA REQUEST TEM OS COOKIES DO NEXT AUX,
        // E A PARTIR DELES EU CONSIGO PEGAR AS INFOS DA SESSION DO NEXT-AUTH
        // OBS.: API ROUTES (back) NAO CONSEGUE PEGAR AS INFOS DO LOCAL STORAGE, POR ISSO, ARMAZENAR SEMPRE NOS COOKIES
        const session = await getSession({ req: request })

        const user = await fauna.query<User>(
            query.Get(
                query.Match(
                    query.Index("user_by_email"),
                    query.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id
        if (!customerId) {
            // CRIA O USUARIO NO STRIPE
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email
            });

            customerId = stripeCustomer.id;

            await fauna.query(
                query.Update(
                    query.Ref(query.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: customerId
                        }
                    }
                )
            )
        }

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1KdNHDJu1uIqTYiojtkEBt3l', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return response.status(200).json({ sessionId: stripeCheckoutSession.id });
    } else {
        response.setHeader('Allow', 'POST') // informando que o método que aceita é POST
        response.status(405).end('Method not alowed');
    }
}