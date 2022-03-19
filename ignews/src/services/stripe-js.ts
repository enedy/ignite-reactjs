import { loadStripe } from '@stripe/stripe-js';

export async function getStripeJs() {
    // VARIAVEL COMECANDO COM NEXT_PUBLIC É UTILIZADA PARA QUE O FRONT TENHA ACESSO A ELA, E NAO SÓ O BACK
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

    return stripeJs;
}