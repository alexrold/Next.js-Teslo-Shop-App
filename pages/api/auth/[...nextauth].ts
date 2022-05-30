import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from "next-auth/providers/credentials";
import { dbUser } from '../../../database';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    //* Custom Provider
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'Tu @Email' },
        password: { label: 'Password:', type: 'password', placeholder: 'Contraseña' },
      },

      async authorize(credentials) {
        return dbUser.checkUserEmailAndPassword(credentials!.email, credentials!.password);
      }
    }),

    //* Github Provider
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  //* Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  //* Callbacks

  session: {
    maxAge: 2592000, // 30 days
    strategy: 'jwt',
    updateAge: 86400, // 1 day
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.access_token = account.access_token;

        switch (account.type) {
          case 'oauth':
            token.user = await dbUser.oAuthToDbUser(user?.email || '', user?.name || '');
            break;

          case 'credentials':
            token.user = user;
            break;
        }
      }
      return token;
    },

    async session({ session, user, token }) {
      session.access_token = token.access_token;
      session.user = token.user as any;

      return session;
    }

  }
})