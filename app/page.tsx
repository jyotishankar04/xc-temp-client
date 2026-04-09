import BusinessBenefits from "@/components/marketing/landing/business-benefits";
import CTA from "@/components/marketing/landing/cta";
import Footer from "@/components/marketing/landing/footer";
import Hero from "@/components/marketing/landing/hero";
import HowItWorks from "@/components/marketing/landing/how-it-works";
import IncubationTrust from "@/components/marketing/landing/incubation-trust";
import Navbar from "@/components/marketing/common/navbar";
import ProductPositioning from "@/components/marketing/landing/positioning";
import Problem from "@/components/marketing/landing/problem-section";
import SupportedTechnologies from "@/components/marketing/landing/supported-technologies";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Problem />
      <ProductPositioning />
      <HowItWorks />
      <SupportedTechnologies />
      <BusinessBenefits />
      <IncubationTrust />
      <CTA />
      <Footer />
    </>
  )
}