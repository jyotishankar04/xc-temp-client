"use client";

import { useEffect, useState } from "react";
import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";

export function DocsLayoutClient(props: DocsLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <DocsLayout {...props} />;
}
