import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react"
import { Navi } from "@/components/general/head/navi"
import { Footer } from "@/components/general/head/footer"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData)
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
    alert("Thank you for your message. We'll get back to you soon!")
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navi />
      <div className="flex-grow">
        <div className="max-w-3xl mx-auto p-6 space-y-8">
          <div className="space-y-8">
            <div className="bg-background shadow-xl rounded-lg p-8 space-y-4">
              <h2 className="text-2xl font-bold text-primary">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>+90 533 853 03 79</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p>rentacompanyhq@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p>Esrif bitlis Cd Famagusta, CY, 29500</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <p className="font-medium">Follow Us:</p>
                  <a href="#" className="text-primary hover:text-primary/80">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-primary hover:text-primary/80">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/company/renta-car-rental-system" className="text-primary hover:text-primary/80">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-background shadow-xl rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Input
                    placeholder="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Textarea
                    placeholder="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full min-h-[150px]"
                  />
                </div>

                <Button type="submit" className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors hover:bg-muted shadow-xl">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 