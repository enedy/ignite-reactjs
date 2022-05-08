import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";
import styles from "../../posts/post.module.scss";

type Post = {
  slug: string;
  title: string;
  resume: string;
  text: string;
  time: string;
};

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

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

// eslint-disable-next-line @next/next/no-typos
// getStaticPaths SÓ EXISTEM EM PAGINAS COM PARAMETROS DINAMICOS [slug].tsx
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      // JA CARREGA AS PAGINAS NO MOMENTO DO BUILD
      //{params: {slug: 'slug do artigo que quero carregar'}}
    ],
    fallback: "blocking", // TRUE, FALSE, BLOCKING
    // TRUE - POST Q AINDA NAO FOI GERADO DE FORMA ESTATICA, CARREGA O CONTEUDO PELO LADO DO CLIENTE
    // FALSE - NAO GERADO DE FORMA ESTATICO AINDA, GERA 404 E NAO TENTA BUSCAR UM NOVO POST
    // BLOCKING- SIMILAR AO TRUE, MAS CARREGA EM SSR E SO MOSTRA O HTML QUANDO ESTIVER PRONTO O ARTIGO
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

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
    redirect: 60 * 30 // 30 minutos
  }
};
