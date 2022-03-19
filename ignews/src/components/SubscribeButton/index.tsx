import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscriptButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscriptButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;

      const stripe = getStripeJs();
      (await stripe).redirectToCheckout({sessionId: sessionId});
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <>
      <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
        Subscribe Now
      </button>
    </>
  );
}
