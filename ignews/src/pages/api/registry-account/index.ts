import { NextApiRequest, NextApiResponse } from 'next';

import { stripe } from "../../../services/stripe";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST') {
    // https://stripe.com/docs/connect/express-accounts

    const account = await stripe.accounts.create({
      country: 'BR',
      type: 'express',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: process.env.NEXT_STRIPE_SUCCESS_URL as string,
      return_url: process.env.NEXT_STRIPE_SUCCESS_URL as string,
      type: 'account_onboarding',
    });

    console.log(accountLink);
    console.log(account.id);

    return response.status(200).json({ url: accountLink.url });
  }

  response.setHeader('Allow', 'POST'); // informando que o método que aceita é POST
  response.status(405).end('Method not alowed');

  return response;
};
