import { HowItWorksHero } from "@/components/marketing/how-it-works/hero";
import { StepByStep } from "@/components/marketing/how-it-works/step-by-step";
import { FAQ } from "@/components/marketing/how-it-works/faq";
import { ProductCTA } from "@/components/marketing/product/product-cta";

export default function HowItWorksPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HowItWorksHero />
      <StepByStep />
      <FAQ />
      <ProductCTA />
    </main>
  );
}
