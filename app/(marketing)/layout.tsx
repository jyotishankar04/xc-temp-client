import { Footer, Navbar } from "@/components/shared/layout";

function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default PublicLayout;
