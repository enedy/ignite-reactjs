import styles from "./styles.module.scss";

interface SubscriptButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscriptButtonProps) {
  return (
    <>
      <button type="button" className={styles.subscribeButton}>
        Subscribe Now
      </button>
    </>
  );
}
