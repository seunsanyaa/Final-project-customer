import Link from "next/link"

export function Footer() {
  return (
    <>
      <footer
        className="flex flex-col items-center justify-between h-fit px-4 md:px-6 border-b bg-primary text-primary-foreground py-6 md:py-12">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">Company</h3>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              About Us
            </Link>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              Our Team
            </Link>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              Careers
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Products</h3>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              Cars
            </Link>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              Vans
            </Link>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              Accessibility Vehicles
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Resources</h3>
            <Link href="#" prefetch={false} className="hover:text-muted-foreground rounded-md transition-colors">
              FAQ
            </Link>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              Ratings and reviews
            </Link>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              Support
            </Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Legal</h3>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-muted-foreground rounded-md transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
        <h3 className="mt-8 text-center">©2024 Renta, Rent A Car Services</h3>
      </footer>
    </>
  )
}