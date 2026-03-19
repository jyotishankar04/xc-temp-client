import BusinessBenefits from "@/components/custom/marketing/landing/business-benifits";
import CTA from "@/components/custom/marketing/landing/cta";
import Footer from "@/components/custom/marketing/landing/footer";
import Hero from "@/components/custom/marketing/landing/hero";
import HowItWorks from "@/components/custom/marketing/landing/how-it-works";
import IncubationTrust from "@/components/custom/marketing/landing/incubation-trust";
import Navbar from "@/components/custom/marketing/landing/navbar";
import ProductPositioning from "@/components/custom/marketing/landing/positioning";
import Problem from "@/components/custom/marketing/landing/problem-section";
import SupportedTechnologies from "@/components/custom/marketing/landing/supported-technologies";


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