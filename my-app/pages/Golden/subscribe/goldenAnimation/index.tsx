import golden from "@/public/animations/golden.json";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,
  });

export default function GoldenAnimationPage() {
  const router=useRouter();
  const timer = setTimeout(() => {
    router.push("/Golden");
  }, 5000); // 1.5 seconds delay
  return (
    <div className="flex items-center justify-center h-screen">
        <Lottie
          animationData={golden}
          loop={true}
          className="w-full"
        />
      </div>
  );
  }