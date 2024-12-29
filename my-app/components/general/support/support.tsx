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
import { Send, Loader2 } from "lucide-react"

export function Support() {
  const { user, isSignedIn } = useUser();
  const [message, setMessage] = useState("");
  const [ref1, inView1] = useInView({ threshold: 0.1, triggerOnce: true });
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
    user?.id ? { userId: user.id } : "skip"
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

  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id || isSending) return;
    
    try {
      setIsSending(true);
      await sendMessage({
        userId: user.id,
        message: message.trim(),
        isAdmin: false,
        timestamp: new Date().toISOString(),
      });
      setMessage("");
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
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
        {/* Chat Section - Only visible for logged-in users */}
        {isSignedIn && user && (
          <section ref={ref1} className={`mb-12 ${inView1 ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <Card className="max-w-4xl mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
                  Live Support Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={chatContainerRef}
                  className="h-[400px] border rounded-lg p-4 mb-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-6 shadow-2xl" style={{ border: "none" }}
                >
                  {messages?.slice().reverse().map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col gap-1.5 ${msg.isAdmin ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-end gap-2">
                        {msg.isAdmin && (
                          <div className="w-8 h-8 rounded-full bg-chat-admin-bg flex items-center justify-center text-chat-admin-text font-medium">
                            S
                          </div>
                        )}
                        <div 
                          className={`relative max-w-[80%] p-3.5 ${
                            msg.isAdmin 
                              ? 'bg-chat-admin-bg text-chat-admin-text rounded-[20px] rounded-bl-none hover:bg-chat-admin-hover' 
                              : 'bg-chat-user-bg text-chat-user-text rounded-[20px] rounded-br-none hover:bg-chat-user-hover'
                          } shadow-md transition-all duration-200 hover:shadow-lg`}
                        >
                          <p className="break-words text-[15px] leading-relaxed">{msg.message}</p>
                          <span className={`text-[11px] block mt-1.5 ${
                            msg.isAdmin ? 'text-chat-admin-timestamp' : 'text-chat-user-timestamp'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {!msg.isAdmin && (
                          <div className="w-8 h-8 rounded-full bg-chat-user-bg flex items-center justify-center text-chat-user-text font-medium">
                            {user?.firstName?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {messages?.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                      <Send className="h-12 w-12 stroke-[1.5] opacity-40" />
                      <p className="text-sm">No messages yet. Start a conversation!</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <Input 
                    placeholder="Type your message here..." 
                    className="flex-1 focus-visible:ring-blue-500 shadow-xl"
                    style={{ border: "none" }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    disabled={isSending}
                  />
                  <Button 
                    className={`bg-blue-500 hover:bg-muted transition-all duration-200 ${
                      isSending ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    onClick={handleSendMessage}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Complaint Form Section - Always visible */}
        <section ref={ref2} className={`${inView2 ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <Card className="max-w-4xl mx-auto mt-1 rounded-lg p-1 bg-white shadow-xl" style={{ border: "none" }}>
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
                      className="shadow-xl"
                      style={{ border: "none" }}  
                      placeholder="Enter your first name"
                      value={complaintForm.firstName}
                      onChange={handleComplaintInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <Input 
                      name="lastName"
                      className="shadow-xl"
                      style={{ border: "none" }}
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
                    className="shadow-xl"
                    style={{ border: "none" }}
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
                    className="h-[200px] shadow-xl"
                    style={{ border: "none" }}
                    value={complaintForm.complaint}
                    onChange={handleComplaintInputChange}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-2xl"
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