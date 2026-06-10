import Image from "next/image";

export const Logo = ({ className }: { className?: string }) => (
  <Image
    className={`${className ?? ""} rounded-full ring-1 ring-black/[0.08] dark:ring-white/[0.08]`}
    src="/xc.jpeg"
    alt="XecureCode Logo"
    width={96}
    height={96}
    priority
  />
);
