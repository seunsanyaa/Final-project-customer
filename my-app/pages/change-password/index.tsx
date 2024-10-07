import AuthLayout from "@/components/general/auth/layout";
import { type GetServerSideProps } from "next";
import Head from "next/head";

// Component for the Change Password page
export default function ChangePassword() {
  return (
    <>
      <Head>
        <title>Change Password</title>
        <meta name="description" content="Change your account password" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
        {/* TODO: Pass the token as a prop to AuthLayout */}
        <AuthLayout />
      </main>
    </>
  );
}

// Server-side props to handle token validation
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.query;

  // If there is no token query, redirect to login
  if (!token || typeof token !== 'string') {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
 
  // Pass the token as a prop to the component
  return { props: { token } };
};