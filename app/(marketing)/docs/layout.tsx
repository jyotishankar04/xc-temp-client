import type { ReactNode } from "react";

import { baseOptions } from "@/lib/layout.shared";
import { DocsLayoutClient } from "@/components/docs/docs-layout-client";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayoutClient {...baseOptions()} tree={source.getPageTree()}>
      {children}
    </DocsLayoutClient>
  );
}
