import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignInOAuthButtons } from "../social_buttons";

export default function StaffSignup() {
  const { signUp, setActive } = useSignUp();
  const router = useRouter();
  const { email, token } = router.query;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const updateStaffUserId = useMutation(api.staff.updateStaffUserId);
  const createStaffUser = useMutation(api.users.createStaffUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !token || typeof email !== 'string' || typeof token !== 'string' || !signUp) {
      setError("Invalid signup link or initialization error");
      return;
    }

    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value;
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value;

    try {
      // Start the signup process with Clerk
      const signUpAttempt = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName
      });

      // Complete email verification (since we trust the token)
      await signUpAttempt.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      
      const response = await signUpAttempt.attemptEmailAddressVerification({
        code: token,
      });

      if (response.status === "complete" && setActive) {
        await setActive({ session: response.createdSessionId });
        
        // Create staff user in Convex
        await createStaffUser({
          userId: response.createdUserId || '',
          email,
          firstName,
          lastName
        });

        // Update staff table with the userId
        await updateStaffUserId({
          email,
          userId: response.createdUserId || ''
        });

        // Redirect to dashboard or appropriate page
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

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
          Create Staff Account
        </h2>
        <p className="paragraph-muted text-base font-normal">
          Complete your staff account registration
        </p>

        <SignInOAuthButtons />

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email || ''}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
} 