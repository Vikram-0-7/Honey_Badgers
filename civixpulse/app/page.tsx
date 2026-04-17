import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import FeatureHighlight from "@/components/FeatureHighlight";
import Footer from "@/components/Footer";
import Complaints from "./Complaints/page";


export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center">
        <Hero />
        <Services />
        <Process />
        <FeatureHighlight />
        <Complaints />
      </main>
      <Footer />
    </>
  );
}
