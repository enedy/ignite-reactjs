import { GetStaticProps } from "next";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";

type Post = {
  slug: string;
  title: string;
  resume: string;
  text: string;
  time: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <title>Posts | Ignews</title>
      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <a key={post.slug} href="#">
              <time>{post.time}</time>
              <strong>{post.title}</strong>
              <p>{post.resume}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const posts = prismic.map((post) => {
    return {
      slug: post.uid,
      title: post.title,
      resume: post.resume,
      text: post.text,
      time: new Date(post.time).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
