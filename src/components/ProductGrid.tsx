import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { allProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/landing/SectionTitle";
import SectionDescription from "@/components/landing/SectionDescription";

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const categories = [
  "TOUS",
  "CHEMISES",
  "PANTALONS",
  "BLAZERS",
  "MAILLE",
  "CHAUSSURES",
  "ACCESSOIRES",
];

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("TOUS");
  const displayProducts = allProducts.slice(0, 8);

  const handleFavorite = (productId: number) => {
    console.log("Add to favorites:", productId);
  };

  const handleQuickView = (productId: number) => {
    console.log("Quick view:", productId);
  };

  return (
    <section
      id="nouveautes"
      className="py-16 md:py-20 bg-secondary/30 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 40 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1 bg-primary rounded-full"
              />
              <Badge className="text-xs tracking-wider bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                SÉLECTION RAFFINÉE
              </Badge>
            </div>
            <SectionTitle highlight="Exclusives" animate={false}>
              Nouveautés
            </SectionTitle>
          </div>
          <SectionDescription className="max-w-md" animate={false}>
            Les dernières additions à notre collection, sélectionnées avec soin
            pour l'homme moderne.
          </SectionDescription>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full text-xs tracking-wider transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 md:gap-5"
        >
          {displayProducts.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <ProductCard
                product={product}
                onFavorite={handleFavorite}
                onQuickView={handleQuickView}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="text-sm tracking-wider h-12 px-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground group"
          >
            <Link to="/boutique">
              VOIR TOUS LES PRODUITS
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
