import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "XecureCode docs",
    },
    links: [
      {
        text: "Platform",
        url: "/docs",
        active: "nested-url",
      },
      {
        text: "Dashboard",
        url: "/app/dashboard",
      },
    ],
  };
}
