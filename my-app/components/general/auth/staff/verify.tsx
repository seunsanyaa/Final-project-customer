import { useRouter } from "next/router";
import { StaffOTPForm } from "../form/staff-otp";

export default function StaffVerifyComponent() {
  const router = useRouter();
  const { email } = router.query;

  return (
    <div className="flex h-screen w-full flex-row gap-10 p-4">
      {/* Left side - Image container */}
      <div className="w-full basis-1/2">
        <img
          className="h-full w-full rounded-xl object-cover"
          alt="Authentication background"
          src="https://res.cloudinary.com/seunsanyaa/image/upload/v1727820662/unnamed_1_u3udcb.png"
        />
      </div>

      {/* Right side - Form container */}
      <div className="flex basis-1/2 flex-col px-32 pt-24">
        <h2 className="paragraph-color pt-8 text-2xl font-semibold">
          Verify Staff Email
        </h2>
        <p className="paragraph-muted pb-4 text-base font-normal">
          We've sent a verification code to {email}
        </p>

        <StaffOTPForm />
      </div>
    </div>
  );
} 