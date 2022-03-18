import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { query as q } from 'faunadb'
import { fauna } from '../../../services/fauna';

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'read:user' // acessos que o usuario tera (read:user é mais limitado)
                }
            },
        }),
        // ...add more providers here
    ],
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        async signIn({ user, account, profile, credentials }) {
            const { email } = user;

            try {
                await fauna.query(
                    q.Create(
                        q.Collection('users'),
                        { data: { email } }
                    )
                )
            } catch (error) {
                return false;
            }

            return true
        },
    }
})