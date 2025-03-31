import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Smart Eczema Management with AI
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Track, analyze, and manage your eczema with personalized insights and treatment recommendations powered
                by artificial intelligence.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
              >
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px] lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-100 to-emerald-200 dark:from-teal-900/30 dark:to-emerald-900/30 blur-3xl opacity-70"></div>
              <div className="relative h-full w-full rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/50 dark:to-emerald-950/50"></div>
                <div className="relative h-full w-full p-4">
                  <div className="h-full w-full rounded-lg bg-white shadow-md dark:bg-gray-900">
                    <div className="h-12 w-full rounded-t-lg bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center px-4">
                      <div className="flex space-x-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700 mb-4"></div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="h-24 rounded bg-teal-100 dark:bg-teal-900/30"></div>
                        <div className="h-24 rounded bg-emerald-100 dark:bg-emerald-900/30"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

