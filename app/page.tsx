import dynamic from "next/dynamic";
import { Suspense } from "react";
import Footer from "@/components/marketing/landing/footer";
import Hero from "@/components/marketing/landing/hero";
import Navbar from "@/components/marketing/common/navbar";
import { AnnouncementBar } from "@/components/marketing/landing/announcement-bar";
import { BetaFreeCard } from "@/components/marketing/landing/beta-free-card";
import { Pricing } from "@/components/marketing/landing/pricing";
import { getPublicPlatformState } from "@/lib/api/platform";

const Problem = dynamic(() => import("@/components/marketing/landing/problem-section"));
const ProductPositioning = dynamic(() => import("@/components/marketing/landing/positioning"));
const HowItWorks = dynamic(() => import("@/components/marketing/landing/how-it-works"));
const SupportedTechnologies = dynamic(() => import("@/components/marketing/landing/supported-technologies"));
const BusinessBenefits = dynamic(() => import("@/components/marketing/landing/business-benefits"));
const IncubationTrust = dynamic(() => import("@/components/marketing/landing/incubation-trust"));
const CTA = dynamic(() => import("@/components/marketing/landing/cta"));

export default async function Page() {
  const platform = await getPublicPlatformState();

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
        {platform.settings.pricingVisible ? (
          platform.settings.betaMode ? <BetaFreeCard /> : <Pricing />
        ) : null}
        <CTA />
      </Suspense>
      <AnnouncementBar announcement={platform.announcement} activeLaunch={platform.activeLaunch} />
      <Footer />
    </>
  )
}
