import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import loadingAnimation from "@/public/animations/loadingAnimation.json";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

export function Redirection() {
  const router = useRouter();
  const currentPath = router.asPath;
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    // Store the intended destination
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    
    // Set a timeout for the loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push("/Login");
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer);
  }, [router, currentPath]);

  if (!isMounted || !isLoading) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        autoplay={true}
        className="w-48 h-48"
      />
    </div>
  );
}

export default Redirection;
