import BrandPartners from "@/components/landing/BrandPartners";
import Hero from "@/components/landing/Hero";
import FeaturedCollections from "@/components/landing/FeaturdCollections";
import { ProductGrid } from "@/components/ProductGrid";
import WhyMoulay from "@/components/landing/WhyMoulay";

const Home = () => {
  return (
    <>
      <section>
        <Hero />
        <BrandPartners />
        <FeaturedCollections />
        <ProductGrid />
        <WhyMoulay />
      </section>
    </>
  );
};

export default Home;
