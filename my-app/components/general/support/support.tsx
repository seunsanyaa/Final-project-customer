'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navi } from "../head/navi"
import { Footer } from "../head/footer"
import { useInView } from 'react-intersection-observer'
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useRef, useEffect } from "react"

export function Support() {
  const { user, isSignedIn } = useUser();
  const [message, setMessage] = useState("");
  const [ref1, inView1] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.3, triggerOnce: true });
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Queries and mutations
  const customer = useQuery(api.customers.getCustomerByUserId, 
    user?.id ? { userId: user.id } : "skip"
  );
  const userDetails = useQuery(api.users.getFullUser,
    user?.id ? { userId: user.id } : "skip"
  );
  const messages = useQuery(api.chat.getMessagesByCustomerId,
    customer ? { customerId: customer.userId } : "skip"
  );
  const sendMessage = useMutation(api.chat.sendMessage);

  // Form states for complaint section
  const [complaintForm, setComplaintForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    complaint: ""
  });

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !customer) return;
    
    await sendMessage({
      customerId: customer.userId,
      message: message.trim(),
      isAdmin: false,
      timestamp: new Date().toISOString(),
    });
    
    setMessage("");
  };

  const handleComplaintSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your complaint submission logic here
    console.log("Complaint submitted:", complaintForm);
    // Reset form after submission
    setComplaintForm({
      firstName: "",
      lastName: "",
      email: "",
      complaint: ""
    });
  };

  const handleComplaintInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setComplaintForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col min-h-dvh font-roboto">
      <Navi className="bg-gradient-to-r from-gray-800 to-gray-600"/>
      <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-gray-200 to-white">
        {/* Chat Section - Only visible for logged-in customers */}
        {isSignedIn && customer && (
          <section ref={ref1} className={`mb-12 ${inView1 ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                  Live Support Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={chatContainerRef}
                  className="h-[400px] border rounded-lg p-4 mb-4 overflow-y-auto bg-white"
                >
                  {messages?.slice().reverse().map((msg, index) => (
                    <div key={index} className={`flex flex-col gap-4 ${msg.isAdmin ? 'items-start' : 'items-end'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.isAdmin ? 'bg-gray-200' : 'bg-blue-500 text-white'
                      }`}>
                        <p>{msg.message}</p>
                        <span className="text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type your message here..." 
                    className="flex-1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={handleSendMessage}
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Complaint Form Section - Always visible */}
        <section ref={ref2} className={`${inView2 ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                Submit a Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleComplaintSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <Input 
                      name="firstName"
                      placeholder="Enter your first name"
                      value={complaintForm.firstName}
                      onChange={handleComplaintInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <Input 
                      name="lastName"
                      placeholder="Enter your last name"
                      value={complaintForm.lastName}
                      onChange={handleComplaintInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={complaintForm.email}
                    onChange={handleComplaintInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Your Complaint</label>
                  <Textarea 
                    name="complaint"
                    placeholder="Please describe your issue in detail..." 
                    className="h-[200px]"
                    value={complaintForm.complaint}
                    onChange={handleComplaintInputChange}
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
  );
}