import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/public/animations/loadingAnimation.json";

export function Redirection() {
  const router = useRouter();
  const currentPath = router.asPath;
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Store the intended destination
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    
    // Set a timeout for the loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer);
  }, [router, currentPath]);

  if (isLoading) {
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

  return null;
}

export default Redirection;
