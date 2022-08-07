import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

// eslint-disable-next-line import/no-cycle
import { signOut } from '../contexts/AuthContext';

let isRefreshing = false;
let failedRequestsQueue: {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError<unknown, any>) => void;
}[] = [];

export function setupAPIClient(ctx: any = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`,
    },
  });

  const internalApi = axios.create({
    baseURL: 'api/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      const { 'nextauth.refreshToken': refreshToken } = cookies;
      console.log('refreshToken', refreshToken);
      if (
        error.response !== undefined &&
        error.response.status === 403 &&
        refreshToken
      ) {
        console.log('dentro do if', refreshToken);
        cookies = parseCookies(ctx);

        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post('/user/refresh', {
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
            })
            .then((response) => {
              console.log('=============response=============', response);
              const token = response.data;

              setCookie(ctx, 'nextauth.token', token.newToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
              });

              setCookie(ctx, 'nextauth.refreshToken', token.newRefreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
              });

              // api.defaults.headers.Authorization = `Bearer ${token}`;

              api.defaults.headers.common.Authorization = `Bearer ${token.newToken}`;

              failedRequestsQueue.forEach((request) =>
                request.onSuccess(token.newToken)
              );
              failedRequestsQueue = [];
            })
            .catch((err) => {
              failedRequestsQueue.forEach((request) => request.onFailure(err));
              failedRequestsQueue = [];

              if (process.browser) {
                signOut();
              }
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              if (originalConfig.headers !== undefined)
                originalConfig.headers.Authorization = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
        // if (process.browser) {
        //   signOut();
        // } else {
        //   return Promise.reject(new AuthTokenError());
        // }
      }

      return Promise.reject(error);
    }
  );
  return { api, internalApi };
}
