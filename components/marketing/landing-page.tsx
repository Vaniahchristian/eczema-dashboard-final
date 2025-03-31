import LandingHeader from "./landing-header"
import HeroSection from "./hero-section"
import FeaturesSection from "./features-section"
import HowItWorksSection from "./how-it-works-section"
import TestimonialsSection from "./testimonials-section"
import PricingSection from "./pricing-section"
import CtaSection from "./cta-section"
import LandingFooter from "./landing-footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}

