import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-16">
        <div className="max-w-xl">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
            Coming soon
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Adding soon
          </h1>
          <p className="mt-4 max-w-lg text-pretty text-base leading-7 text-muted-foreground">
            Blog posts are temporarily removed while we rework the publishing
            experience. We’ll bring back articles, guides, and updates once the
            new flow is ready.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/subscribe">
                <Mail className="mr-2 size-4" />
                Subscribe for updates
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Back home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
