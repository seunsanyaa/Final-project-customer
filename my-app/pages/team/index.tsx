import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import { Navi } from "@/components/general/head/navi"
import { Footer } from "@/components/general/head/footer"

interface TeamMember {
  name: string
  role: string
  image: string
  description: string
  linkedin?: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Allam Ghareebi",
    role: "Customer side lead developer",
    image: "/team/ceo.jpg",
    description: "Leading the customer-facing development with expertise in React and Next.js. Focused on creating seamless user experiences and intuitive interfaces for our car rental platform.",
    linkedin: "https://linkedin.com/in/allam-ghareebi"
  },
  {
    name: "Mohammed Abdullah",
    role: "Team lead developer",
    image: "/team/cto.jpg",
    description: "Orchestrating the development team with strong technical leadership. Specializes in system architecture and ensuring best practices in our development workflow.",
    linkedin: "https://linkedin.com/in/mohammed-abdullah"
  },
  {
    name: "Mohammed Osman",
    role: "Backend Developer",
    image: "/team/customer-director.jpg",
    description: "Expert in backend development, focusing on database optimization and API development. Ensures robust and scalable server-side solutions for our platform.",
    linkedin: "https://linkedin.com/in/mohammed-osman"
  },
  {
    name: "Oluwaseun Sanyaolu",
    role: "Admin lead developer",
    image: "/team/operations.jpg",
    description: "Leads the development of administrative systems and dashboards. Specializes in creating efficient management tools and data visualization interfaces.",
    linkedin: "https://linkedin.com/in/oluwaseun-sanyaolu"
  },
  {
    name: "Naif Al-Shawkhi",
    role: "Review blog Manager",
    image: "/team/review-blog.jpg",
    description: "Manages the review system and blog content. Focuses on enhancing user engagement through meaningful content and maintaining high-quality customer reviews.",
    linkedin: "https://linkedin.com/in/naif-alshawkhi"
  }
]

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  return (
    <div className="flex flex-col min-h-screen">
      <Navi className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg"/>
      <main className="flex-1 bg-background">
        <div className="py-12">
          <Container>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
                Meet Our Team
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our dedicated team of professionals works tirelessly to provide you with the best car rental experience possible.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1800px] mx-auto px-4">
              {teamMembers.map((member) => (
                <Card 
                  key={member.name} 
                  className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-none bg-white/50 backdrop-blur-sm group cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="aspect-[4/5] relative flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                    <h2 className="text-2xl font-bold text-primary text-center px-4">
                      {member.name}
                    </h2>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-primary/90 font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                      {member.description}
                    </p>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors duration-200 hover:translate-x-1 transform"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        Connect on LinkedIn
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </div>
      </main>
      <Footer />

      {/* Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"  onClick={() => setSelectedMember(null)}>
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl transform transition-all" style={{ backgroundColor: '#ffffff' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary">{selectedMember.name}</h2>
                <p className="text-lg text-primary/80 font-medium">{selectedMember.role}</p>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                className="bg-white text-black hover:bg-muted"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex gap-6 flex-col md:flex-row">
              <div className="relative w-full md:w-1/3 aspect-[3/4]">
                <Image
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {selectedMember.description}
                </p>
                <div className="flex gap-4">
                  {selectedMember.linkedin && (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#0077b5]/90 transition-colors"
                    >
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      View LinkedIn Profile
                    </a>
                  )}
                  <a
                    href={`mailto:rentacompanyhq@gmail.com?subject=Message for ${selectedMember.name} - ${selectedMember.role}&body=Hello ${selectedMember.name},%0D%0A%0D%0A`}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact via Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 