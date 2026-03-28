import Hero from "@/components/marketing/landing/hero";
import ProblemSection from "@/components/marketing/landing/problem-section";
import ProductPositioning from "@/components/marketing/landing/positioning";
import HowItWorks from "@/components/marketing/landing/how-it-works";
import SupportedTechnologies from "@/components/marketing/landing/supported-technologies";
import BusinessBenefits from "@/components/marketing/landing/business-benefits";
import IncubationTrust from "@/components/marketing/landing/incubation-trust";
import CTA from "@/components/marketing/landing/cta";
import { Navbar, Footer } from "@/components/shared/layout";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <ProductPositioning />
        <HowItWorks />
        <SupportedTechnologies />
        <BusinessBenefits />
        <IncubationTrust />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
