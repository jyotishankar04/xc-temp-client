import dynamic from "next/dynamic";
import { Suspense } from "react";
import Footer from "@/components/marketing/landing/footer";
import Hero from "@/components/marketing/landing/hero";
import Navbar from "@/components/marketing/common/navbar";

const Problem = dynamic(() => import("@/components/marketing/landing/problem-section"));
const ProductPositioning = dynamic(() => import("@/components/marketing/landing/positioning"));
const HowItWorks = dynamic(() => import("@/components/marketing/landing/how-it-works"));
const SupportedTechnologies = dynamic(() => import("@/components/marketing/landing/supported-technologies"));
const BusinessBenefits = dynamic(() => import("@/components/marketing/landing/business-benefits"));
const IncubationTrust = dynamic(() => import("@/components/marketing/landing/incubation-trust"));
const CTA = dynamic(() => import("@/components/marketing/landing/cta"));

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <Problem />
        <ProductPositioning />
        <HowItWorks />
        <SupportedTechnologies />
        <BusinessBenefits />
        <IncubationTrust />
        <CTA />
      </Suspense>
      <Footer />
    </>
  )
}
