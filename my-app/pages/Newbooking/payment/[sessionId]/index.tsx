'use client'
import { Payment_Page } from "@/components/general/payment/payment_page";
import { useConvexAuth } from "convex/react";
// import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { redirect } from 'next/navigation';
export default function PaymentPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  // const lottieRef = useRef<LottieRefCurrentProps>(null);
  // useEffect(() => {
  //   if (lottieRef.current) {
  //     lottieRef.current.setSpeed(1.5);
      
  //   }
  // }, []);
  if (isLoading) {
    return (
          <div className="flex items-center justify-center h-screen">
            {/* <Lottie
              lottieRef={lottieRef}
              animationData={loadingAnimation}
              loop={true}
              className="w-48 h-48"
            /> */}
          </div>
        );
  }

  if (!isAuthenticated) {
    redirect('/'); 
  }

  return <Payment_Page />;
}