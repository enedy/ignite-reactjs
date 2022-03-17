import { GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount}</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  /// link api stripe
  /// https://stripe.com/docs/api/prices/retrieve
  const price = await stripe.prices.retrieve("price_1KdNHDJu1uIqTYiojtkEBt3l", {
    expand: ["product"], // RETORNA TODAS AS INFOS DO PRODUTO (POSSO TER VARIOS PRECOS POR EXEMPLO)
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product: product,
    },
  };
};

// export const getStaticProps: GetStaticProps = async () => {
//   /// link api stripe
//   /// https://stripe.com/docs/api/prices/retrieve
//   const price = await stripe.prices.retrieve("price_1KdNHDJu1uIqTYiojtkEBt3l", {
//     expand: ["product"], // RETORNA TODAS AS INFOS DO PRODUTO (POSSO TER VARIOS PRECOS POR EXEMPLO)
//   });

//   const product = {
//     priceId: price.id,
//     amount: new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(price.unit_amount / 100),
//   };

//   return {
//     props: {
//       product: product,
//     },
//     revalidate: 60 * 60 * 24, // 24 horas
//   };
// };
