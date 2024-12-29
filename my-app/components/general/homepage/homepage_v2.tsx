'use client'
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useInView } from 'react-intersection-observer';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import carImage from '@/components/ui/car.png';
import StarIcon from '@/svgs/StarIcon';
import CarIcon from '@/svgs/Caricon';
import SUVIcon from '@/svgs/SUVIcon';
import LimoIcon from '@/svgs/LimoIcon';
import CaravanIcon from '@/svgs/CaravainIcon';
import ChevronLeftIcon from '@/svgs/ChevronLeftIcon';
import ChevronRightIcon from '@/svgs/ChevronRightIcon';
import { Navi } from "../head/navi";
import { Footer } from "../head/footer";
import { useEffect, useRef, useState } from 'react'; // Added for font loading
import dynamic from 'next/dynamic';
import loadingAnimation from "@/public/animations/intro.json";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from "next/image";
import { LottieRefCurrentProps } from "lottie-react";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "convex/react";
// Add dynamic import for Lottie
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

export function Homepage_v2() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [ref1, inView1] = useInView({ threshold: 0.6, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.6, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref4, inView4] = useInView({ threshold: 0.3, triggerOnce: true });
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchSuggestions = useQuery(api.analytics.searchCarsByTerm, { 
    searchTerm: searchTerm 
  });

  const reviews = useQuery(api.review.getTopReviews);
  const userIds = Array.from(new Set(reviews?.map(review => review.userId) ?? []));
  const usersData = useQuery(api.users.getManyUsers, { userIds }) ?? [];
  const userMap = new Map(usersData.map(user => [user.userId, user]));
  const shuffledReviews = reviews?.filter(review => review.numberOfStars >= 4)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const carousel = event.currentTarget;
    const { clientX } = event;
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    const scrollPosition = (clientX / window.innerWidth) * scrollWidth;
    carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const queryParams = new URLSearchParams();
    
    if (searchSuggestions?.maker) {
      queryParams.append('maker', searchSuggestions.maker);
    }
    if (searchSuggestions?.model) {
      queryParams.append('model', searchSuggestions.model);
    }
    
    router.push(`/vehicles?${queryParams.toString()}`);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/vehicles?category=${category}`);
  };

  // Add categories constant
  const categories = ["SUV", "Sedan", "Luxury", "Van", "Truck", "Convertible"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie
          lottieRef={lottieRef}
          animationData={loadingAnimation}
          loop={true}
          className="w-[1500px] h-[1500px] mr-20"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh font-roboto">
      <Navi className="bg-gradient-to-r from-gray-800 to-gray-600"/>
      <main className="flex-1 top-0 mt-0">
        <section ref={ref1} className={`relative top-0 md:py-16 w-full h-[610px] px-4 md:px-6 lg:px-10 bg-cover bg-center bg-no-repeat ${
          inView1 ? 'animate-fadeInUp' : 'opacity-0'
         }`}
         style={{ backgroundImage: `url(https://res.cloudinary.com/dbsxjsktb/image/upload/v1729108115/benjamin-child-7Cdw956mZ4w-unsplash_ted8ag.jpg)`, 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="bg-white p-8 rounded-5 shadow-2xl backdrop-blur-md bg-opacity-90" style={{ zIndex: 50 }}>
              <div className="text-center w-full max-w-[600px]">
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent drop-shadow-xl font-poppins">
                  Find your perfect ride
                </h1>
                
                <form className="flex gap-4 justify-center mt-5" onSubmit={handleSearch}>
                  <div className="relative w-full max-w-[600px]">
                    <input
                      type="text"
                      placeholder="Search by make or model (e.g., Toyota prius)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="p-5 border-2 border-gray-800 rounded-lg w-full text-gray-800 placeholder:text-gray-500 shadow-lg focus:ring-4 focus:ring-blue-500 transition-transform ease-in-out duration-300 transform hover:scale-105 h-5"
                    />          
                    <button type="submit" className="absolute inset-y-0 right-3 flex items-center bg-blue-500 hover:bg-blue-700 text-white p-2 transition-transform ease-in-out duration-300 transform hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5">
                        <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </section>
        <section ref={ref2} className={`relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-200 to-white ${ 
          inView2 ? 'animate-fadeInUp' : 'opacity-0'
        }`} onMouseMove={handleMouseMove}> 
          <div className="max-w-full mx-auto h-full"> 
            <div className="w-full mx-auto pt-5 md:pt-8 lg:pt-10 bg-muted"> 
              <div className="text-center bg-muted p-4"> 
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Special Offers</h2>
                <p className="text-gray-600 text-lg md:text-xl lg:text-2xl"> 
                  Check out our latest deals and discounts on car rentals.
                </p>
              </div>
            </div>
            <Carousel> 
              <CarouselContent>
                <CarouselItem className='h-full'>
                  <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                    <div className="space-y-4 md:space-y-6 lg:space-y-8">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold"> 
                        Discover the Perfect Car for Your Next Adventure
                      </h1>
                      <p className="text-lg md:text-xl lg:text-2xl text-gray-500"> 
                        Rent the car of your dreams and explore the wilderness. 15% off for the summer season on choice* cars.
                      </p>
                      <Link href="/User_Account/User_Promotions">
                        <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition"> 
                          View Promotions
                        </Button>
                      </Link>
                    </div>
                    <Image
                      src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729195988/1714578868267_yicf3b.avif"
                      width={600}
                      height={500}
                      alt="Car"
                      className="w-[600px] h-[500px] object-cover"
                      priority
                    /> 
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                    <div className="space-y-4 md:space-y-6 lg:space-y-8">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Experience the Thrill of Driving</h1>
                      <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
                        Rent the car of your dreams and experience the bustling nightlife. 10% off on sports cars for a week.
                      </p>
                      <Link href="/User_Account/User_Promotions">
                      <Button className="bg-customyello text-primary-foreground border-2 border-black" >
                        View Promotions
                      </Button></Link>
                    </div>
                    <Image
                      src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729196318/1727199981315_ixilao.avif"
                      alt="Car"
                      width={500}
                      height={400}
                      className="w-[500px] h-[400px] object-cover"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                    <div className="space-y-4 md:space-y-6 lg:space-y-8">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Elevate Your Travel Experience</h1>
                      <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
                        Hop in with some friends for the long haul. 20% on travel vans when renting up to a month.
                      </p>
                      <Link href="/User_Account/User_Promotions">
                      <Button className="bg-customyello text-primary-foreground border-2 border-black" >
                       View Promotions
                      </Button></Link>
                    </div>
                    <Image
                      src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729196547/1727199981443_oidgif.avif"
                      width={500}
                      height={400}
                      alt="Car"
                      className="w-[500px] h-[400px] object-cover"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </section>
        
        <section ref={ref3} className={`relative w-full h-auto overflow-hidden bg-gradient-to-b from-gray-200 to-white ${ 
          inView3 ? 'animate-fadeInUp' : "opacity-0"}`} > 
          <div className="max-w-full mx-auto h-full"> 
            <div className="w-full mx-auto pt-5 md:pt-8 lg:pt-10 bg-muted"> 
              <div className="text-center bg-muted p-4"> 
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">Explore our fleet</h2> 
                <p className="text-gray-600 text-lg md:text-xl lg:text-2xl leading-relaxed"> 
                  Choose from a wide range of vehicles to fit your needs.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-20 mx-14 mb-20 relative z-0"> 
              <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500 hover:z-50"> 
                <Image
                  src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/2021-toyota-camry-se-sedan-white_featured_yakvxp.avif"
                  alt="Sedan"
                  width={300}
                  height={220}
                  className="w-[300px] h-[220px] rounded-lg"
                /> 
                <div className="text-center mb-0 mt-0">
                  <h3 className="text-4xl font-semibold text-black mt-0">Sedans</h3>
                  <p className="text-black font-semibold">Comfortable and efficient.</p> 
                  <p className="text-black">Starting from $45/day</p> 
                </div>
                <Button 
                  onClick={() => handleCategoryClick("Sedan")} 
                  className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg mt-0 hover:bg-muted"
                >
                  Rent Now
                </Button>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500 hover:z-50"> 
                <Image
                  src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522583/2022-chevrolet-tahoe-lt-4wd-suv-beige_featured_bsxp0g.avif"
                  alt="SUV"
                  width={300}
                  height={220}
                  className="w-[300px] h-[220px] rounded-lg"
                /> 
                <div className="text-center mb-0 mt-0">
                  <h3 className="text-4xl font-semibold text-black">SUVs</h3>
                  <p className="text-black font-semibold">Spacious and versatile.</p> 
                  <p className="text-black">Starting from $50/day</p> 
                </div>
                <Button 
                  onClick={() => handleCategoryClick("SUV")} 
                  className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted"
                >
                  Rent Now
                </Button>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500 hover:z-50"> 
                <Image
                  src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729527582/2022-genesis-g80-4wd-sedan-white_featured_e84fej.avif"
                  alt="Luxury"
                  width={300}
                  height={220}
                  className="w-[300px] h-[220px] rounded-lg"
                /> 
                <div className="text-center mb-0 mt-0">
                  <h3 className="text-4xl font-semibold text-black mt-1">Luxury</h3>
                  <p className="text-black font-semibold">Indulge in style and comfort.</p> 
                  <p className="text-black">Starting from $70/day</p> 
                </div>
                <Button 
                  onClick={() => handleCategoryClick("Luxury")} 
                  className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted"
                >
                  Rent Now
                </Button>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500 hover:z-50"> 
                <Image
                  src="https://res.cloudinary.com/dihvudxbt/image/upload/v1729200173/JKAR_22_Compact_Cargo_Van_AngularFront_US_ENG_280x210_wsqbrx.avif"
                  alt="Van"
                  width={300}
                  height={220}
                  className="w-[300px] h-[220px] rounded-lg"
                /> 
                <div className="text-center mb-0 mt-0">
                  <h3 className="text-4xl font-semibold text-black">Vans</h3>
                  <p className="text-black font-semibold mb-0">Spacious and practical.</p> 
                  <p className="text-black">Starting from $30/day</p> 
                </div>
                <Button 
                  onClick={() => handleCategoryClick("Van")} 
                  className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted"
                >
                  Rent Now
                </Button>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500 hover:z-50"> 
                <Image
                  src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729522582/2020-ford-mustang-ecoboost-premium-convertible-white_featured_c4qsq5.avif"
                  alt="Convertible"
                  width={300}
                  height={220}
                  className="w-[300px] h-[220px] rounded-lg"
                /> 
                <div className="text-center mb-0 mt-0">
                  <h3 className="text-4xl font-semibold text-black">Convertible</h3>
                  <p className="text-black font-semibold mb-0">Spacious and practical.</p> 
                  <p className="text-black">Starting from $300/day</p> 
                </div>
                <Button 
                  onClick={() => handleCategoryClick("Convertible")} 
                  className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted"
                >
                  Rent Now
                </Button>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 p-6 transition-transform transform hover:scale-105 hover:shadow-lg bg-card hover:bg-gradient-to-r from-blue-500 to-green-500 hover:z-50"> 
                <Image
                  src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729527063/2022-ram-1500-limited-swb-crew-pick-up-silver_featured_x2xwqj.avif"
                  alt="Pickup Truck"
                  width={300}
                  height={220}
                  className="w-[300px] h-[220px] rounded-lg"
                /> 
                <div className="text-center mb-0 mt-0">
                  <h3 className="text-4xl font-semibold text-black">Pickup Truck</h3>
                  <p className="text-black font-semibold mb-0">Spacious and practical.</p> 
                  <p className="text-black">Starting from $120/day</p> 
                </div>
                <Button 
                  onClick={() => handleCategoryClick("Truck")} 
                  className="hover:bg-blue-500 hover:shadow-lg transition-all duration-300 rounded-lg hover:bg-muted"
                >
                  Rent Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section ref={ref4 } className={`relative bg-white py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-10 h-full ${ 
          inView4 ? 'animate-fadeInUp' : "opacity-0"}`}>
          <div className="max-w-10xl mx-auto space-y-6 md:space-y-8 lg:space-y-10 h-full">
            <div className="space-y-6 md:space-y-8">
              <div className="text-center w-full mx-auto pt-5 md:pt-8 lg:pt-10 mb-14 pb-14">
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight leading-tight">What our customers say</h2>
                <p className="text-gray-600 text-lg md:text-xl lg:text-2xl leading-relaxed">Hear from real people who have rented with us.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {shuffledReviews?.map((review) => {
                  // Get user details from the map
                  const user = userMap.get(review.userId);
                  
                  return (
                    <Card key={review._id} className="bg-muted">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="border w-12 h-12">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="font-semibold">
                              {user?.firstName} {user?.lastName}
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium">
                              {[...Array(review.numberOfStars)].map((_, i) => (
                                <StarIcon key={i} className="w-4 h-4 text-customyello fill-customyello" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-muted-black">
                          &quot;{review.comment}&quot;
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/> 
    </div>)
  
}
