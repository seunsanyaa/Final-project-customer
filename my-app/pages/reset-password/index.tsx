import AuthLayout from "@/components/general/auth/layout";
import Head from "next/head";



export default function ResetPassword() {

  return (
    <>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="car rental" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
      
<AuthLayout/>

 
      </main>
    </>
  );
}

