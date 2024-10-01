import Image from "next/image";
import { useRouter } from "next/router";
import ChangePasswordComponent from "./change-password";
import LoginComponent from "./login";
// import OnboardComponent from "./onboard";
import ResetComponent from "./password_reset";
import VerifyComponent from "./verify_code";


export default function AuthLayout({}) {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full flex-row gap-10 p-4 px-4">
     <div className="w-full basis-1/2 ">
        <Image
          className="h-full w-full rounded-xl  object-cover"
          objectFit="cover"
          alt="image"
          src={
            "https://res.cloudinary.com/seunsanyaa/image/upload/v1727820662/unnamed_1_u3udcb.png"
          }
          width={686}
          height={992}
        />
      </div>{" "}
      <div className="no-scrollbar w-2/4 overflow-scroll overflow-x-hidden">
        {router.pathname === "/onboarding" ? (
        
        <></>
          // <OnboardComponent />
        ) : router.pathname === "/reset-password" ? (
          <ResetComponent />
        )  : router.pathname === "/change-password" ? (
          <ChangePasswordComponent />
        ): router.pathname === "/verify-account" ? (
          <VerifyComponent />
        ) : (
          <LoginComponent />
        )}
      </div>
      {/* i want to o make this fixed to 100vh  */}
 
    </div>
  );
}
