import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import styles from './post.module.scss';

type Post = {
  slug: string;
  title: string;
  resume: string;
  text: string;
  time: string;
};

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.time}</time>
          <div className={styles.postContent}>{post.text}</div>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  // PASSO A REQUEST PARA O getSession, POIS NA REQUEST TEM OS COOKIES DO NEXT AUX,
  // E A PARTIR DELES EU CONSIGO PEGAR AS INFOS DA SESSION DO NEXT-AUTH
  // OBS.: API ROUTES (back) NAO CONSEGUE PEGAR AS INFOS DO LOCAL STORAGE, POR ISSO, ARMAZENAR SEMPRE NOS COOKIES
  const session = await getSession({ req: req });
  const { slug } = params;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient();

  const postPrismic = prismic.filter((p) => p.slug == slug)[0];
  const post = {
    slug: postPrismic.slug,
    title: postPrismic.title,
    resume: postPrismic.resume,
    text: postPrismic.text,
    time: new Date(postPrismic.time).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  return {
    props: { post },
  };
};
