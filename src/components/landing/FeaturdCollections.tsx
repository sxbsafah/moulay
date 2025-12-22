import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionTitle from "./SectionTitle";
import SectionDescription from "./SectionDescription";
import CollectionCard from "./CollectionCard";
import CategoryCard from "./CategoryCard";

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

const collections = [
  {
    title: "Élégance Classique",
    description: "Intemporel et raffiné",
    badge: "Nouveauté",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/young-man-wearing-grey-mandarin-collar-short-sleev-x1QCM2UTSo65crOSEjGvZw1nRDGVMl.jpg",
    cta: "DÉCOUVRIR",
  },
  {
    title: "Style Formel",
    description: "Sophistication assurée",
    badge: "Tendance",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/man-wearing-navy-blue-tailored-blazer-with-white-s-JcsQpszxLZyuyvsoxIDRgUff37wPBD.jpg",
    cta: "DÉCOUVRIR",
  },
];

const categories = [
  {
    name: "Casual",
    count: "45 articles",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/casual-polo-shirt-on-grey-background--product-phot-HBCRz5RJwjzKTXzt0B8N4q7QBE9Cy9.jpg",
  },
  {
    name: "Costumes",
    count: "28 articles",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/black-formal-suit-on-grey-background--product-phot-wtcsCcOcycYoq5iJ2VT7iHvpg6Otdw.jpg",
  },
  {
    name: "Accessoires",
    count: "62 articles",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/leather-belt-and-watch-on-grey-background--product-jPBan5HAFM6diay6q8LcEFn8TmsLQt.jpg",
  },
  {
    name: "Chaussures",
    count: "34 articles",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/brown-leather-oxford-shoes-on-grey-background--pro-q14PBWphpnGDWzJP5QoMBZC0aWwept.jpg",
  },
];

function FeaturedCollections() {
  return (
    <section
      id="collections"
      className="py-16 md:py-20 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1 bg-primary rounded-full"
              />
              <Badge className="text-xs tracking-wider bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                EXCLUSIF
              </Badge>
            </div>
            <SectionTitle highlight="Phares" animate={false}>
              Collections
            </SectionTitle>
            <SectionDescription className="max-w-xl" animate={false}>
              Sélections raffinées pour l'homme moderne qui ne fait aucun
              compromis sur l'élégance
            </SectionDescription>
          </div>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group rounded-full self-start md:self-auto border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <Link to="/boutique" className="flex items-center gap-2">
              TOUT VOIR
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-5 lg:gap-6 mb-14"
        >
          {collections.map((collection, index) => (
            <motion.div key={index} variants={staggerItem}>
              <CollectionCard
                title={collection.title}
                description={collection.description}
                badge={collection.badge}
                image={collection.image}
                cta={collection.cta}
                eager={index === 0}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <SectionTitle size="sm" highlight="Catégorie" animate={false}>
                Explorer par
              </SectionTitle>
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-0.5 bg-primary rounded-full"
                />
                <p className="text-muted-foreground text-sm">
                  Trouvez exactement ce que vous cherchez
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                transition={{ delay: i * 0.1 }}
              >
                <CategoryCard
                  name={cat.name}
                  count={cat.count}
                  image={cat.image}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedCollections;
