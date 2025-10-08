import Image from "next/image"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

const plans = [
  {
    name: "Basic",
    price: "$7.99",
    features: [
      "Watch on one device at a time",
      "Standard definition (480p)",
      "Limited movie selection",
      "Ad-supported streaming",
      "Download on 1 device",
    ],
    recommended: false,
  },
  {
    name: "Standard",
    price: "$12.99",
    features: [
      "Watch on two devices at a time",
      "Full HD (1080p)",
      "Full movie library access",
      "Ad-free streaming",
      "Download on 2 devices",
    ],
    recommended: true,
  },
  {
    name: "Premium",
    price: "$18.99",
    features: [
      "Watch on four devices at a time",
      "Ultra HD (4K)",
      "Full movie library access + exclusive content",
      "Ad-free streaming",
      "Download on 4 devices",
      "Priority customer support",
    ],
    recommended: false,
  },
]

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Upgrade Your Experience</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Get unlimited access to our entire library of movies and TV shows with premium features.
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-gray-900 rounded-lg overflow-hidden border ${
                  plan.recommended ? "border-red-600" : "border-gray-800"
                }`}
              >
                {plan.recommended && (
                  <div className="bg-red-600 text-white text-center py-2 font-medium">MOST POPULAR</div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-4xl font-bold mb-6">
                    {plan.price}
                    <span className="text-sm text-gray-400">/month</span>
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.recommended ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    Choose Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Premium Features</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image src="/placeholder.svg?height=32&width=32" alt="4K" width={32} height={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">4K Ultra HD</h3>
                <p className="text-gray-400">Experience stunning clarity with 4K resolution and HDR support.</p>
              </div>

              <div className="text-center">
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image src="/placeholder.svg?height=32&width=32" alt="Download" width={32} height={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Offline Viewing</h3>
                <p className="text-gray-400">Download your favorite content to watch offline anytime, anywhere.</p>
              </div>

              <div className="text-center">
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image src="/placeholder.svg?height=32&width=32" alt="No Ads" width={32} height={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Ad-Free Experience</h3>
                <p className="text-gray-400">Enjoy uninterrupted streaming without any advertisements.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. Your benefits will continue until the end of your
                billing period.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">How many devices can I watch on?</h3>
              <p className="text-gray-400">
                Depending on your plan, you can watch on 1, 2, or 4 devices simultaneously.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Is there a free trial?</h3>
              <p className="text-gray-400">
                Yes, we offer a 7-day free trial for new subscribers. You can experience all premium features before
                committing.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

