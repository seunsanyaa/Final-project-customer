import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

const RedirectionPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const email = isLoaded ? user?.emailAddresses[0]?.emailAddress : undefined;
  const staff = useQuery(api.staff.getStaffByEmail, 
    email ? { email } : "skip"
  );
  const customer = useQuery(api.customers.getCustomerByUserId,
    user?.id ? { userId: user.id } : "skip"
  );
  const updateStaffUserId = useMutation(api.staff.updateStaffUserId);
  const generateToken = useMutation(api.verify.generateStaffToken);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!isLoaded || !user) return;
      
      if (staff) {
        try {
          await generateToken({ email: email! });
          await updateStaffUserId({ email: email!, userId: user.id });
          router.push(`http://localhost:3000?token=${staff.token}`);
        } catch (error) {
          console.error('Error during staff redirect:', error);
          router.push('/');
        }
      } else if (staff === null) {
        if (customer === null) {
          router.push('/onboarding');
        } else {
          router.push('/vehicles');
        }
      }
    };

    handleRedirect();
  }, [isLoaded, user, staff, customer, email, router, updateStaffUserId, generateToken]);

  return null;
};

export default RedirectionPage;
