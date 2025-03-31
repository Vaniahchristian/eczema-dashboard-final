import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Start Managing Your Eczema Smarter Today
            </h2>
            <p className="max-w-[900px] text-teal-50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of users who have transformed their eczema management with EczemaAI.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild size="lg" className="bg-white text-teal-600 hover:bg-teal-50">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

