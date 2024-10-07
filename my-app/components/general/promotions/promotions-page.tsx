import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CalendarDaysIcon from "@/svgs/CalendarDaysIcon";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; // Assuming this is imported correctly from your components
import { Navi } from "../head/navi";
import { Footer } from "../head/footer";

// TODO: Create an interface for promotion data
interface Promotion {
  id: string;
  title: string;
  description: string;
  expirationDate: string;
  type: 'Discount' | 'Upgrade' | 'Free Rental';
  terms: string;
  imageUrl: string;
}

// TODO: Move this data to a separate file or fetch from an API
const promotions: Promotion[] = [
  // ... Add promotion objects here
];

export function PromotionsPage() {
  // TODO: Implement state management for filtering and sorting
  // const [filter, setFilter] = useState('all');
  // const [sort, setSort] = useState('newest');

  // TODO: Implement filtering and sorting logic
  // const filteredAndSortedPromotions = useMemo(() => {
  //   return promotions.filter(...).sort(...);
  // }, [promotions, filter, sort]);

  return (
    <>
      <Navi />
      <Separator />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Promotion Section */}
        <div className="bg-primary rounded-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Get 20% Off Your Next Rental
              </h2>
              <p className="text-primary-foreground mb-6">
                New members can save big on their next car rental. Offer ends
                soon, so don't miss out!
              </p>
              <Button size="lg" variant="secondary">
                Redeem Offer
              </Button>
            </div>
            <div className="hidden md:block">
              <img
                src="/placeholder.svg"
                width={500}
                height={300}
                alt="Featured Promotion"
                className="object-cover"
                style={{ aspectRatio: "500/300", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        {/* Promotions List Section */}
        <div className="mb-8">
          {/* Filter and Sort Controls */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Current Promotions</h2>
            <div className="flex items-center gap-4">
              <Label htmlFor="filter">Filter by:</Label>
              <Select name="filter" defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Promotions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Promotions</SelectItem>
                  <SelectItem value="discount">Discount Offers</SelectItem>
                  <SelectItem value="upgrade">Upgrade Offers</SelectItem>
                  <SelectItem value="free-rental">Free Rental Offers</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="sort">Sort by:</Label>
              <Select name="sort" defaultValue="newest">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="discount-amount">
                    Discount Amount
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Promotion Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO: Replace this with a map function over filteredAndSortedPromotions */}
            {promotions.map((promotion) => (
              <Card key={promotion.id}>
                <img
                  src={promotion.imageUrl}
                  width={400}
                  height={200}
                  alt={`${promotion.title} Image`}
                  className="rounded-t-lg object-cover"
                  style={{ aspectRatio: "400/200", objectFit: "cover" }}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{promotion.title}</h3>
                  <p className="text-muted-foreground mb-4">{promotion.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="mr-2 h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        Expires: {promotion.expirationDate}
                      </span>
                    </div>
                    <Badge variant="secondary">{promotion.type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{promotion.terms}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Separator />
      <Footer />
    </>
  );
}