import Footer from "@/components/custom/marketing/landing/footer";
import Navbar from "@/components/custom/marketing/landing/navbar";
// 
function layout({
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

export default layout;