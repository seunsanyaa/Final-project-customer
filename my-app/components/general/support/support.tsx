'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navi } from "../head/navi"
import { Footer } from "../head/footer"
import { useInView } from 'react-intersection-observer'

export function Support() {
  const [ref1, inView1] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <div className="flex flex-col min-h-dvh font-roboto">
      <Navi className="bg-gradient-to-r from-gray-800 to-gray-600"/>
      <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-gray-200 to-white">
        {/* Chat-like Support Section */}
        <section ref={ref1} className={`mb-12 ${inView1 ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                Live Support Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] border rounded-lg p-4 mb-4 overflow-y-auto bg-white">
                {/* Example messages */}
                <div className="flex flex-col gap-4">
                  <div className="ml-auto max-w-[80%] bg-blue-500 text-white p-3 rounded-lg">
                    Hello, I need help with my booking.
                  </div>
                  <div className="mr-auto max-w-[80%] bg-gray-200 p-3 rounded-lg">
                    Hi! I'd be happy to help. What seems to be the issue?
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Type your message here..." 
                  className="flex-1"
                />
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Complaint Form Section */}
        <section ref={ref2} className={`${inView2 ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                Submit a Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <Input placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Your Complaint</label>
                  <Textarea 
                    placeholder="Please describe your issue in detail..." 
                    className="h-[200px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                >
                  Submit Complaint
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  )
}
