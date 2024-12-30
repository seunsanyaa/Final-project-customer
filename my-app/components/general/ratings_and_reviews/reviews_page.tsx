import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen, StarHalf } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { useUser } from '@clerk/nextjs'
import { Navi } from '../head/navi'
import MainPage from './mainPage'  // Importing the MainPage component
import AllRatings from './all_ratings'  // Importing the AllRatings component
import { Footer } from '../head/footer'

export function Reviews_Page() {
  const { user } = useUser();
  const userId = user?.id || '';

  // Add state for sidebar dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State to manage active view
  const [activeView, setActiveView] = useState<'myRatings' | 'allRatings'>('myRatings');

  if (!user) {
    return <p>Please log in to view your reviews and bookings.</p>;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'myRatings':
        return <MainPage userId={userId} />;
      case 'allRatings':
        return <AllRatings />;
      default:
        return <MainPage userId={userId} />;
    }
  };

  return (
    <>
      <Navi />
      <Separator/>
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <div className="sticky top-0 h-screen w-25 p-4 border-r bg-primary">
          <div className="space-y-2">
            <div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full p-2 text-left text-primary-foreground hover:bg-muted-foreground/10 rounded-md text-sm"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Reviews & Ratings</span>
                </div>
                {isDropdownOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {isDropdownOpen && (
                <div className="ml-4 space-y-1 mt-1 bg-primary text-primary-foreground">
                  <button
                    onClick={() => setActiveView('myRatings')}
                    className="flex items-center gap-2 p-2 text-xs hover:bg-muted-foreground/10 rounded-md w-full text-left"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>My Ratings</span>
                  </button>
                  <button
                    onClick={() => setActiveView('allRatings')}
                    className="flex items-center gap-2 p-2 text-xs hover:bg-muted-foreground/10 rounded-md w-full text-left"
                  >
                    <StarHalf className="w-3 h-3" />
                    <span>All Ratings</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        {renderActiveView()}
        
      </div>
      <Footer />
    </>
  )
}
