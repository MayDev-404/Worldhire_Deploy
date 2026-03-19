import Header from "@/components/landing/header"
import HeroSection from "@/components/landing/hero-section"
import CompanyLogos from "@/components/landing/company-logos"
import FeaturedCompanies from "@/components/landing/featured-companies"
import PopularCategory from "@/components/landing/popular-category"
import DiscoverJobs from "@/components/landing/discover-jobs"
import FeaturesSection from "@/components/landing/features-section"
import StatsSection from "@/components/landing/stats-section"
import TestimonialsSection from "@/components/landing/testimonials-section"
import CTASection from "@/components/landing/cta-section"
import Footer from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CompanyLogos />
      <FeaturedCompanies />
      <PopularCategory />
      <DiscoverJobs />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
