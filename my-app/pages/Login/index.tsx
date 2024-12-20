import { useRouter } from "next/router";
import AuthLayout from "@/components/general/auth/layout";
import StaffSignup from "@/components/general/auth/staff/signup";

export default function Login() {
  const router = useRouter();
  const { email, token } = router.query;

  // If email and token are present in the URL, show staff signup
  if (email && token) {
    return <StaffSignup />;
  }

  // Otherwise show regular login layout
  return <AuthLayout />;
}
