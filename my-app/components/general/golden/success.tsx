'use client';

import Lottie from 'lottie-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import goldenAnimation from '@/public/animations/golden.json';
import { Button } from "@/components/ui/button";

export const SubscriptionSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-[600px] text-center">
        <Lottie
          animationData={goldenAnimation}
          loop={true}
          className="w-full h-[400px]"
        />
        
        <h1 className="text-4xl font-bold mb-4 text-primary">
          Subscription Successful!
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Thank you for joining our Elite Membership. You now have access to exclusive benefits.
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-primary hover:bg-primary/90"
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};