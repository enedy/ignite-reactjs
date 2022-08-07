import decode from 'jwt-decode';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';

export function withSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (cookies['nextauth.token']) {
      const user = decode<{ role: string }>(cookies['nextauth.token']);

      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return fn(ctx);
  };
}
