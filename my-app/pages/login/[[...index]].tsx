import { SignUp, useUser } from "@clerk/nextjs";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Login() {

  const { user } = useUser();

  if (!user) {
    return <div className="flex justify-center items-center pt-20">
      <SignUp /></div>;
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      

    </main>
  );
}


