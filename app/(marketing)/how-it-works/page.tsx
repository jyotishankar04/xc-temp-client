// app/how-it-works/page.tsx


import { HowItWorksHero } from "@/components/custom/marketing/how-it-works/hero";
import { StepByStep } from "@/components/custom/marketing/how-it-works/step-by-step";
import { FAQ } from "@/components/custom/marketing/how-it-works/faq";
import { ProductCTA } from "@/components/custom/marketing/product/product-cta";



export default function HowItWorksPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HowItWorksHero />
      <StepByStep />
      {/* <TechnicalSpecs /> */}
      <FAQ />
      <ProductCTA />
    </main>
  );
}