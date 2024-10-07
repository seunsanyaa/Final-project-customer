import Link from "next/link"

export function Footer() {
  return (
    <footer className="flex items-center justify-between h-fit px-4 md:px-6 border-b bg-primary text-primary-foreground py-6 md:py-12">
      {/* Main content container */}
      <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm">
        {/* Company section */}
        <FooterSection title="Company" links={[
          { href: "/about", text: "About Us" },
          { href: "/team", text: "Our Team" },
          { href: "/careers", text: "Careers" },
        ]} />

        {/* Products section */}
        <FooterSection title="Products" links={[
          { href: "/cars", text: "Cars" },
          { href: "/vans", text: "Vans" },
          { href: "/accessibility", text: "Accessibility Vehicles" },
        ]} />

        {/* Resources section */}
        <FooterSection title="Resources" links={[
          { href: "/faq", text: "FAQ", prefetch: false },
          { href: "/reviews", text: "Ratings and Reviews" },
          { href: "/support", text: "Support" },
        ]} />

        {/* Legal section */}
        <FooterSection title="Legal" links={[
          { href: "/privacy", text: "Privacy Policy" },
          { href: "/terms", text: "Terms of Service" },
          { href: "/cookies", text: "Cookie Policy" },
        ]} />
      </div>

      {/* Copyright notice */}
      <div className="mt-8 text-center text-sm">
        &copy; {new Date().getFullYear()} Renta, Rent A Car Services
      </div>
    </footer>
  )
}

// FooterSection component for reusable footer sections
interface FooterLink {
  href: string;
  text: string;
  prefetch?: boolean;
}

interface FooterSectionProps {
  title: string;
  links: FooterLink[];
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div className="grid gap-2">
      <h3 className="font-semibold">{title}</h3>
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          prefetch={link.prefetch}
          className="hover:text-muted-foreground rounded-md transition-colors"
        >
          {link.text}
        </Link>
      ))}
    </div>
  )
}