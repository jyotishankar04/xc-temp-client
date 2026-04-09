import { ArchitectureOverview } from "@/components/marketing/product/architecture-overview";
import { KeyCapabilities } from "@/components/marketing/product/key-capabilities";
import { ProductCTA } from "@/components/marketing/product/product-cta";
import { ProductHero } from "@/components/marketing/product/product-hero";
import { SafetyTrust } from "@/components/marketing/product/safety-trust";
import { ValueProposition } from "@/components/marketing/product/value-proposition";

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
