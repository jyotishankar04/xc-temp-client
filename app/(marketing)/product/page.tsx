import { ArchitectureOverview } from "@/components/custom/marketing/product/architecture-overview";
import { KeyCapabilities } from "@/components/custom/marketing/product/key-capabilities";
import { ProductCTA } from "@/components/custom/marketing/product/product-cta";
import { ProductHero } from "@/components/custom/marketing/product/product-hero";
import { SafetyTrust } from "@/components/custom/marketing/product/safety-trust";
import { ValueProposition } from "@/components/custom/marketing/product/value-proposition";

export default function ProductPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ProductHero />
      <ValueProposition />
      <KeyCapabilities />
      <ArchitectureOverview />
      <SafetyTrust />
      <ProductCTA />
    </main>
  );
}
