import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import DropboxProvider from "next-auth/providers/dropbox";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.readonly",
        },
      },
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? "",
      tenantId: process.env.AZURE_AD_TENANT_ID ?? "common",
      authorization: {
        params: {
          scope: "openid email profile User.Read Files.Read",
        },
      },
    }),
    DropboxProvider({
      clientId: process.env.DROPBOX_CLIENT_ID ?? "",
      clientSecret: process.env.DROPBOX_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "files.metadata.read files.content.read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }: any) {
      session.provider = token.provider;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
