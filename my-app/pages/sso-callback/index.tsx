import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";

// Add type for props
interface SSOCallbackProps {
  initialUser: any; // You can replace 'any' with proper Clerk user type
}

// Update component to receive props
export default function SSOCallback({ initialUser }: SSOCallbackProps) {
  const { user, isLoaded } = useUser();
  const [redirectUrl, setRedirectUrl] = useState("/");
  
  // Use initialUser if user is not yet loaded from client-side
  const currentUser = user || initialUser;
  const userEmail = isLoaded && currentUser?.primaryEmailAddress?.emailAddress;
  
  // Check if user is staff - only query when we have an email
  const staffMember = useQuery(api.staff.getStaffByEmail, 
    userEmail ? { email: userEmail } : "skip"
  );

  // Check if user exists in users table - only query when we have an email
  const existingUser = useQuery(api.users.getUserByEmail,
    userEmail ? { email: userEmail } : "skip"
  );

  const generateToken = useMutation(api.verify.generateStaffToken);
  const createStaffUser = useMutation(api.users.createStaffUser);

  useEffect(() => {
    const handleRedirect = async () => {
      // Log user information
      console.log('User object:', {user});

      // If user is staff
      if (staffMember?.email) {
        try {
          // If staff user doesn't exist in users table yet, create it
          if (!existingUser) {
            await createStaffUser({
              userId: user?.id ?? "" ,
              email: userEmail ?? "",
              firstName: user?.firstName ?? "",
              lastName: user?.lastName ?? ""
            });
          }

          // Generate token and set redirect URL
          const result = await generateToken({ email: staffMember.email });
          if (result.success) {
            setRedirectUrl(`/dashboard`);
            return;
          }
        } catch (error) {
          console.error("Error handling staff redirect:", error);
        }
      }
      else {
        setRedirectUrl("/onboarding");
      }

    };

    handleRedirect();
  }, [isLoaded, user, userEmail, staffMember, existingUser, generateToken, createStaffUser]);

  // Show loading state while clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <AuthenticateWithRedirectCallback 
      afterSignInUrl={redirectUrl}
      afterSignUpUrl={redirectUrl}
    />
  );
}

// Add getServerSideProps
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
  
  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  // You can fetch more user data here if needed
  return {
    props: {
      initialUser: {
        id: userId,
        // Add other user properties you need
      },
    },
  };
};
