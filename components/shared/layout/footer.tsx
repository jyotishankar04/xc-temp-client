import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { ROUTES, SOCIAL_LINKS } from "@/lib/constants";
import { Logo } from "@/components/shared/branding/logo";

const FOOTER_LINKS = {
  product: [
    { label: "Features", href: ROUTES.PRODUCT },
    { label: "How it Works", href: ROUTES.HOW_IT_WORKS },
    { label: "Solutions", href: ROUTES.SOLUTIONS },
    { label: "Pricing", href: "#" },
  ],
  company: [
    { label: "About", href: ROUTES.ABOUT },
    { label: "Blog", href: ROUTES.BLOG },
    { label: "Careers", href: "#" },
    { label: "Contact", href: ROUTES.CONTACT },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <Logo className="w-8 h-8" />
              <span className="font-semibold text-lg">XecureCode</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered reliability for production systems. Making failures
              understandable, predictable, and recoverable.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link,index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} XecureCode. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.icon];
              if (!Icon) return null;
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
