import welcomeText from "@/public/animations/welcome-text.json";
import confetti from "@/public/animations/confetti.json";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,
});

export default function GoldenAnimationPage() {
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/Golden");
    }, 8000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[800px] z-20">
        <Lottie
          animationData={welcomeText}
          loop={false}
          className="w-full"
        />
      </div>

      <div className="absolute inset-0 z-10">
        <Lottie
          animationData={confetti}
          loop={true}
          className="w-full h-full"
        />
      </div>

      <h1 className="text-4xl font-bold text-golden mb-8 z-30 absolute top-10">
        Welcome to Golden Membership!
      </h1>
    </div>
  );
}