import BrandPartners from "@/components/BrandPartners";
import Hero from "@/components/Hero.tsx";
import FeaturedCollections from "@/components/FeaturdCollections";


const Home = () => {
  return (
    <>
      <section>
        <Hero />
        <BrandPartners />
        <FeaturedCollections />
      </section>
    </>
  )
}

export default Home