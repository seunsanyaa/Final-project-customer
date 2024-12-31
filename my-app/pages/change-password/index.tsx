import AuthLayout from "@/components/general/auth/layout";
import { type GetServerSideProps } from "next";
import Head from "next/head";


export default function ChangePassword() {

  return (
    <>
      <Head>
        <title>Change Password</title>
        <meta name="description" content="car rental" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
      
<AuthLayout/>

 
      </main>
    </>
  );
}



export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // if there is no token query redirect to login
  if (!ctx.query.token) {
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }
 
  return { props: {token:ctx.query.token } };
};