import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm dark:bg-teal-900">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Choose the plan that works best for your eczema management needs.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-gray-500 dark:text-gray-400">Basic eczema tracking and analysis</p>
              <div className="flex items-baseline text-3xl font-bold">
                $0
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
              </div>
            </div>
            <ul className="my-6 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Basic symptom tracking</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Limited AI photo analysis</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Educational resources</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Community access</span>
              </li>
            </ul>
            <Button asChild className="mt-auto">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
          <div className="flex flex-col rounded-lg border-2 border-teal-500 bg-white p-6 shadow-sm dark:bg-gray-950">
            <div className="flex flex-col space-y-2">
              <div className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold">Premium</h3>
              <p className="text-gray-500 dark:text-gray-400">Advanced tracking and personalized insights</p>
              <div className="flex items-baseline text-3xl font-bold">
                $9.99
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
              </div>
            </div>
            <ul className="my-6 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Unlimited AI photo analysis</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Personalized treatment recommendations</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Advanced analytics and insights</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Trigger identification</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button
              asChild
              className="mt-auto bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
            >
              <Link href="/register">Get Premium</Link>
            </Button>
          </div>
          <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl font-bold">Professional</h3>
              <p className="text-gray-500 dark:text-gray-400">Complete care with doctor integration</p>
              <div className="flex items-baseline text-3xl font-bold">
                $19.99
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
              </div>
            </div>
            <ul className="my-6 space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Everything in Premium</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Direct messaging with dermatologists</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Monthly virtual consultations</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Prescription management</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>Family account (up to 5 members)</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-teal-500" />
                <span>VIP support</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="mt-auto">
              <Link href="/register">Get Professional</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

