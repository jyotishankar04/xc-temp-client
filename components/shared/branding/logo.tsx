import Image from "next/image";

export const Logo = ({ className }: { className?: string }) => (
  <Image
    className={`${className ?? ""} rounded-full`}
    src="/xc.jpeg"
    alt="Logo"
    width={96}
    height={96}
    priority
  />
);
