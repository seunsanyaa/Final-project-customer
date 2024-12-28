import { Footer } from "@/components/general/head/footer";
import { Navi } from "@/components/general/head/navi";

export default function Legal() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navi />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Privacy Policy Section */}
            <section id="privacy-policy" className="bg-white rounded-2xl p-8 shadow-lg">
              <h1 className="text-4xl font-bold mb-8 text-primary">Privacy Policy</h1>
              
              <div className="space-y-6 text-gray-600">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Collection</h2>
                  <p className="leading-relaxed">
                    At Renta, we collect various types of information to provide you with the best car rental experience. This includes personal information such as your name, contact details, driver's license information, payment details, and rental history. We may also collect information about your vehicle preferences and usage patterns to improve our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use of Information</h2>
                  <p className="leading-relaxed">
                    We use your information to process bookings, verify your identity, communicate about rentals, and improve our services. Your data helps us personalize your experience and comply with legal requirements. We may also use it to send relevant offers and updates about our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Protection</h2>
                  <p className="leading-relaxed">
                    We implement robust security measures to protect your personal information. This includes encryption, secure servers, and regular security audits. Access to your data is strictly limited to authorized personnel who need it to perform their duties.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
                  <p className="leading-relaxed">
                    Your privacy is paramount to us. We only share your information with trusted partners necessary for providing our services, such as payment processors and insurance providers. We never sell your personal information to third parties for marketing purposes.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
                  <p className="leading-relaxed">
                    You have the right to access, correct, or delete your personal information at any time. You can request a copy of your data or opt out of marketing communications. Contact our support team to exercise any of these rights.
                  </p>
                </div>
              </div>
            </section>

            {/* Terms of Service Section */}
            <section id="terms-of-service" className="bg-white rounded-2xl p-8 shadow-lg">
              <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Service</h1>
              
              <div className="space-y-6 text-gray-600">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
                  <p className="leading-relaxed">
                    By using Renta's services, you agree to these terms and conditions. We reserve the right to modify these terms at any time, and your continued use of our services constitutes acceptance of any modifications. We will notify you of significant changes to these terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rental Requirements</h2>
                  <p className="leading-relaxed">
                    To rent a vehicle, you must be at least 21 years old, possess a valid driver's license, and have a valid form of payment. Additional requirements may apply based on the vehicle type and rental location. We reserve the right to refuse service to anyone who doesn't meet these requirements.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vehicle Usage</h2>
                  <p className="leading-relaxed">
                    All vehicles must be used in accordance with our rental agreement. This includes returning the vehicle in the same condition, not smoking in the vehicle, and following all traffic laws and regulations. Unauthorized use may result in additional charges or termination of the rental agreement.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payments and Fees</h2>
                  <p className="leading-relaxed">
                    You agree to pay all rental fees, including base rates, insurance, fuel charges, and any additional fees incurred during your rental period. Late returns or damage to the vehicle may result in additional charges. All fees will be clearly communicated before the rental period begins.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Liability and Insurance</h2>
                  <p className="leading-relaxed">
                    You are responsible for any damage to the vehicle during your rental period. While we provide basic insurance coverage, you may be liable for deductibles or damages not covered by our insurance policies. Additional insurance options are available for purchase to provide enhanced protection.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 