import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Footer } from '@/components/general/head/footer';
import { Navi } from '@/components/general/head/navi';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I make a car reservation?",
    answer: "Making a reservation is easy! Simply browse our available vehicles, select your desired dates and location, choose your preferred car, and follow the booking process. You'll need to provide your driver's license and payment information to complete the reservation."
  },
  {
    question: "What documents do I need to rent a car?",
    answer: "You'll need a valid driver's license, a credit card in the renter's name, and proof of insurance. International customers may need to provide a passport and international driving permit."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Reservations can be cancelled free of charge up to 48 hours before the pickup time. Cancellations made within 48 hours may be subject to a cancellation fee."
  },
  {
    question: "Is insurance included in the rental price?",
    answer: "Basic insurance coverage is included in the rental price. However, we offer additional insurance options for enhanced protection. We recommend reviewing our insurance options during the booking process."
  },
  {
    question: "What is your fuel policy?",
    answer: "Our vehicles are provided with a full tank of fuel and should be returned with a full tank. If the vehicle is not returned with a full tank, a refueling fee will be charged."
  },
  {
    question: "Can I add an additional driver?",
    answer: "Yes, additional drivers can be added to your rental agreement. They must meet our age requirements and present a valid driver's license. Additional fees may apply."
  },
  {
    question: "What happens if I return the car late?",
    answer: "Late returns may incur additional charges. If you expect to be late, please contact us as soon as possible to discuss your options and any applicable fees."
  },
  {
    question: "Do you offer child seats?",
    answer: "Yes, we offer child seats and booster seats for rent. These should be requested at the time of booking to ensure availability. Additional fees apply."
  },
  {
    question: "What is your minimum age requirement?",
    answer: "The minimum age to rent a car is 21 years old. Drivers under 25 may be subject to a young driver surcharge and may have restrictions on certain vehicle categories."
  },
  {
    question: "What should I do in case of an accident?",
    answer: "In case of an accident, ensure everyone's safety first, then contact local authorities if necessary. Document the incident with photos and contact our 24/7 emergency support line immediately. We'll guide you through the next steps."
  }
];

const FAQAccordionItem = ({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-4 px-6 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <span className="text-left font-medium text-lg">{item.question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 py-4' : 'max-h-0'
        }`}
      >
        <p className="px-6 text-gray-600">{item.answer}</p>
      </div>
    </div>
  );
};

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navi />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {faqData.map((item, index) => (
              <FAQAccordionItem
                key={index}
                item={item}
                isOpen={openItems.includes(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 