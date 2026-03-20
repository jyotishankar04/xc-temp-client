import {
  ArrowUpRight,
  DribbbleIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

const footerColumns = [
  {
    title: "Product",
    links: [
      { title: "Product", href: "/product" },
      { title: "Solutions", href: "/solutions" },
      { title: "How It Works", href: "/how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Blog", href: "/blogs" },
      { title: "Contact", href: "/contact" },
    ],
  },
  // {
  //   title: "Legal",
  //   links: [
  //     { title: "Privacy Policy", href: "#" },
  //     { title: "Terms", href: "#" },
  //   ],
  // },
];

const Footer = () => {
  return (
    <div className="flex  flex-col">
      <footer className="border-t border-border">
        <div className="mx-auto max-w-(--breakpoint-xl)">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 py-12 lg:flex-row xl:px-0">
            {/* Footer Columns */}
            <div className="grid grid-cols-2 gap-8 gap-x-12 sm:grid-cols-3 lg:gap-x-16">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h6 className="font-semibold text-foreground">{column.title}</h6>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.title}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >

                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Early Access with waitlist button */}
            <div className="w-full max-w-xs flex flex-col gap-2">
              <h6 className="font-semibold text-foreground">Early Access</h6>
              <p className="mt-2 text-sm text-muted-foreground">
                Get early access to our product
              </p>
              <Link href="/waitlist" passHref legacyBehavior>
                <Button className="w-full">
                  Join Early Access
                  <ArrowUpRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
            </div>
            

         </div>
          <Separator />

          {/* Bottom Bar */}
          <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 px-6 py-8 sm:flex-row xl:px-0">
            {/* Copyright */}
            <span className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Xecurecode AI. All rights reserved.
            </span>

            {/* Social Links */}
            <div className="flex items-center gap-5 text-muted-foreground">
              <a href="https://x.com/xecurecode" target="_blank" className="transition-colors hover:text-foreground">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/xecurecode/" target="_blank" className="transition-colors hover:text-foreground">
                <LinkedinIcon className="h-5 w-5" />
                </a>
              <a href="https://www.instagram.com/xecurecode/" target="_blank" className="transition-colors hover:text-foreground">
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <TextHoverEffect text="XECURECODE" />
        </div>
      </footer>
    </div>
  );
};

export default Footer;