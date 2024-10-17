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
export function Homepage_v2() {
  const [ref1, inView1] = useInView({ threshold: 0.6, triggerOnce: true });
const [ref2, inView2] = useInView({ threshold: 0.6,triggerOnce: true  });
const [ref3, inView3] = useInView({ threshold: 0.3,triggerOnce: true });
const [ref4, inView4] = useInView({ threshold: 0.3,triggerOnce: true });

  const handleMouseMove = (event: React.MouseEvent) => {
    const carousel = event.currentTarget;
    const { clientX } = event;
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    const scrollPosition = (clientX / window.innerWidth) * scrollWidth;
    carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  return (
    (<div className="flex flex-col min-h-dvh">
      <Navi/>
      <main className="flex-1 top-0 mt-0">
      <section  ref={ref1}className={`relative top-0 md:py-16 w-full h-[610px] px-4 md:px-6 lg:px-10 bg-cover bg-center bg-no-repeat ${
        inView1 ? 'animate-fadeInUp' : 'opacity-0'
       }`}
       style={{ backgroundImage: `url(https://res.cloudinary.com/dbsxjsktb/image/upload/v1729108115/benjamin-child-7Cdw956mZ4w-unsplash_ted8ag.jpg)`, 
                backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Added dark overlay
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center"> {/* Center text within the div */}
          <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">Find your perfect ride</h1> 
          
          <form className="flex gap-4 justify-center">
            <input
              type="text"
              placeholder="Search by location or vehicle"
              className="flex-1 p-2 border border-gray-300 rounded-lg w-full max-w-[600px] text-gray-800 " /> {/* Increased width */}
            <Button type="submit" className="whitespace-nowrap p-4 text-lg">  
              Search
            </Button>
          </form>
        </div>
      </div>
    </section>

       
        <section ref={ref2} className={`relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-200 to-white ${ 
          inView2 ? 'animate-fadeInUp' : 'opacity-0'
        }`} onMouseMove={handleMouseMove}> {/* Add mouse move event */}
          <div className="w-full mx-auto space-y-6 pt-10 pb-5 md:space-y-8 lg:space-y-10 bg-muted"> 
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Special Offers</h2>
              <p className="text-gray-600 text-lg md:text-xl lg:text-2xl"> 
                Check out our latest deals and discounts on car rentals.
              </p>
            </div>
          </div>
          <Carousel interval={5000}>
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
                    <Link href="/Promotions">
                      <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition"> 
                        Book Now
                      </Button>
                    </Link>
                  </div>
                  <img
                    src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729195988/1714578868267_yicf3b.avif"
                    width="400"
                    height="300"
                    alt="Car"
                    className="w-[600px] h-[500px] object-cover shadow-lg" /> 
                </div>
              </CarouselItem>
              <CarouselItem>
                <div
                  className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                  <div className="space-y-4 md:space-y-6 lg:space-y-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Experience the Thrill of Driving</h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
                      Rent the car of your dreams and experience the bustling nightlife. 10% off on sports cars for a week.
                    </p>
                    <Link href="/Promotions">
                    <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition" >
                      Book Now
                    </Button></Link>
                  </div>
                  <img
                  src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729196318/1727199981315_ixilao.avif"
                  alt="Car"
                  className="w-[500px] h-[400px] object-cover"
                  />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div
                  className="flex flex-col md:flex-row items-center justify-between h-full px-4 md:px-6 lg:px-10">
                  <div className="space-y-4 md:space-y-6 lg:space-y-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Elevate Your Travel Experience</h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground">
                      Hop in with some friends for the long haul. 20% on travel vans when renting up to a month.
                    </p>
                    <Link href="/Promotions">
                    <Button className="bg-customyello text-primary-foreground border-2 border-black p-4 shadow-md hover:bg-orange-500 transition" >
                      Book Now
                    </Button></Link>
                  </div>
                  <img
                  src="https://res.cloudinary.com/dbsxjsktb/image/upload/v1729196547/1727199981443_oidgif.avif"
                  width="400"
                  height="300"
                  alt="Car"
                  className="w-[500px] h-[400px] object-cover"
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
            {/* Removed CarouselPrevious and CarouselNext */}
          </Carousel>
          
        </section>
        <section ref={ref3 }className={`relative py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-10 bg-primary ${ 
          inView3 ? 'animate-fadeInUp' : "opacity-0"}`}>
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 lg:space-y-10">
            <div className="space-y-6 md:space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-background">Explore our fleet</h2>
                <p className="text-background md:text-lg">
                  Choose from a wide range of vehicles to fit your needs.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                <Card className="rounded-xl  border-foreground hover:border-background transition-colors" >
                  <CardContent className=" rounded-xl bg-customgrey flex flex-col items-center justify-center gap-4 p-6  ">
                  <CarIcon className="w-[200px] h-[150px] rounded-lg  py-3"/>
                    <div className="text-center">
                      <h3 className="text-4xl font-bold text-background ">Sedans</h3>
                      <p className="text-background">Comfortable <br/>and efficient.</p>
                    </div>
                    <Link href="/Search"><Button variant="outline">Rent Now</Button></Link>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-foreground hover:border-background transition-colors " >
                  <CardContent className=" rounded-xl flex flex-col items-center justify-center gap-4 p-6 bg-customgrey ">
                  <SUVIcon className="w-[150px] h-[150px] rounded-lg  py-3"/>
                    <div className="text-center">
                      <h3 className="text-4xl font-semibold text-background">SUVs</h3>
                      <p className="text-background">Spacious <br/>and versatile.</p>
                    </div>
                    <Link href="/Search"><Button variant="outline">Rent Now</Button></Link>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-foreground hover:border-background transition-colors" >
                  <CardContent className=" rounded-xl flex flex-col items-center justify-center gap-4 p-6 bg-customgrey ">
                  <LimoIcon className="w-[150px] h-[150px]  py-3"/>
                    <div className="text-center">
                      <h3 className="text-4xl font-semibold text-background">Luxury </h3>
                      <p className="text-background">Indulge in style and comfort.</p>
                    </div>
                    <Link href="/Search"><Button variant="outline">Rent Now</Button></Link>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-foreground hover:border-background transition-colors" >
                  <CardContent className=" rounded-xl flex flex-col items-center justify-center gap-4 p-6 bg-customgrey ">
                  <CaravanIcon className="w-[200px] h-[150px] rounded-lg text- py-3"/>
                    <div className="text-center">
                      <h3 className="text-4xl font-semibold text-background">Vans</h3>
                      <p className=" text-background">Spacious and practical.</p>
                    </div>
                    <Link href="/Search"><Button variant="outline">Rent Now</Button></Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section ref={ref4 } className={`relative bg-muted py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-10 ${ 
          inView4 ? 'animate-fadeInUp' : "opacity-0"}`}>
          <div className="max-w-10xl mx-auto space-y-6 md:space-y-8 lg:space-y-10">
            <div className="space-y-6 md:space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">What our customers say</h2>
                <p className="text-muted-foreground md:text-lg">Hear from real people who have rented with us.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="border w-12 h-12">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="font-semibold">John Doe</div>
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                    &quot;I had a great experience renting with this company. The\n process was smooth and the car was in
                      excellent\n condition.&quot;
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="border w-12 h-12">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="font-semibold">Sarah Miller</div>
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                    &quot;I was impressed by the wide selection of vehicles and\n the competitive prices. I&apos;ll definitely
                      be renting from\n them again.&quot;
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="border w-12 h-12">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>MJ</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="font-semibold">Michael Johnson</div>
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                          <StarIcon className="w-4 h-4 fill-primary" />
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                    &quot;The rental process was quick and easy, and the staff\n was very helpful. I would definitely
                      recommend this\n company to anyone looking to rent a car.&quot;
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>)
  );
}




































