import AuthLayout from "@/components/general/auth/layout";
import Head from "next/head";

// import Link from "next/link";
// import { Button } from "~/components/ui/button";

// import { api } from "~/utils/api";

export default function ResetPassword() {

  return (
    <>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="Revolutionize your blockchain project management " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
      
<AuthLayout/>

 
      </main>
    </>
  );
}

