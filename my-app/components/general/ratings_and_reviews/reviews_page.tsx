
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Navi } from "../head/navi"
import { Separator } from "@/components/ui/separator"
import { StarIcon } from "lucide-react"
import { Footer } from "../head/footer";
export function ReviewsPage() {
  return (
    <>
    <Navi/>
    <Separator/>
    <div className="flex min-h-screen w-full bg-muted/40">
    
      <aside className="fixed inset-y-30 left-0 z-10 hidden w-64 flex-col border-r border-t bg-background p-4 sm:flex">
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search FAQs..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        <nav className="flex flex-col gap-4">
          <Link
            href="/Rating_Reviews/recentrev"
            className="flex items-center gap-2 rounded-lg bg-accent p-2 text-accent-foreground"
            prefetch={false}
          >
            <StarIcon className="h-5 w-5" />
            Recent Reviews
          </Link>
          <Link
            href="/Rating_Reviews/recentrating"
            className="flex items-center gap-2 rounded-lg bg-accent p-2 text-accent-foreground"
            prefetch={false}
          >
            <StarIcon className="h-5 w-5" />
            Recent Ratings
          </Link>
          <Link
            href="/Rating_Reviews/mostrated"
            className="flex items-center gap-2 rounded-lg bg-accent p-2 text-accent-foreground"
            prefetch={false}
          >
            <StarIcon className="h-5 w-5" />
            Most Rated
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col sm:pl-64">
        <main className="p-4 sm:p-6">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Top Rated Cars</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <img
                    src="/placeholder.svg"
                    alt="Car Image"
                    width={200}
                    height={150}
                    className="rounded-lg"
                    style={{ aspectRatio: "200/150", objectFit: "cover" }}
                  />
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
                  </div>
                  <div className="text-lg font-semibold">Toyota Camry</div>
                  <p className="text-muted-foreground">4.5 out of 5 stars</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <img
                    src="/placeholder.svg"
                    alt="Car Image"
                    width={200}
                    height={150}
                    className="rounded-lg"
                    style={{ aspectRatio: "200/150", objectFit: "cover" }}
                  />
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
                  </div>
                  <div className="text-lg font-semibold">Honda Civic</div>
                  <p className="text-muted-foreground">4.5 out of 5 stars</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <img
                    src="/placeholder.svg"
                    alt="Car Image"
                    width={200}
                    height={150}
                    className="rounded-lg"
                    style={{ aspectRatio: "200/150", objectFit: "cover" }}
                  />
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
                    <StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
                  </div>
                  <div className="text-lg font-semibold">Ford Mustang</div>
                  <p className="text-muted-foreground">3.5 out of 5 stars</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <img
                    src="/placeholder.svg"
                    alt="Car Image"
                    width={200}
                    height={150}
                    className="rounded-lg"
                    style={{ aspectRatio: "200/150", objectFit: "cover" }}
                  />
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                    <StarIcon className="h-5 w-5 fill-primary" />
                  </div>
                  <div className="text-lg font-semibold">Jeep Wrangler</div>
                  <p className="text-muted-foreground">5 out of 5 stars</p>
                </CardContent>
              </Card>
            </div>
          </section>
          <section>
            <h2 className="mb-4 text-2xl font-bold">Write a Review</h2>
            <Card>
              <CardContent className="p-6">
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="car">Car</Label>
                    <Select name="car">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a car" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toyota-camry">Toyota Camry</SelectItem>
                        <SelectItem value="honda-civic">Honda Civic</SelectItem>
                        <SelectItem value="ford-mustang">Ford Mustang</SelectItem>
                        <SelectItem value="jeep-wrangler">Jeep Wrangler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating</Label>
                    <RadioGroup id="rating" defaultValue="4">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="rating-1" value="1" />
                        <StarIcon className="h-5 w-5 fill-primary" />
                        <RadioGroupItem id="rating-2" value="2" />
                        <StarIcon className="h-5 w-5 fill-primary" />
                        <RadioGroupItem id="rating-3" value="3" />
                        <StarIcon className="h-5 w-5 fill-primary" />
                        <RadioGroupItem id="rating-4" value="4" />
                        <StarIcon className="h-5 w-5 fill-primary" />
                        <RadioGroupItem id="rating-5" value="5" />
                        <StarIcon className="h-5 w-5 fill-primary" />
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="review">Review</Label>
                    <Textarea id="review" rows={4} />
                  </div>
                  <Button type="submit" className="justify-self-end">
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
      <Footer/>
    </div></>)}


