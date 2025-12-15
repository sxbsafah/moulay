import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";

function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <section className="relative min-h-[calc(100vh-5rem)] bg-background overflow-hidden">

      <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center"
        >
          <div className="order-2 lg:order-1 lg:pr-6">
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-3 mb-4"
            >
              <motion.span
                className="h-px bg-primary"
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <span className="text-xs tracking-[0.2em] text-primary font-medium uppercase">
                Nouvelle Saison 2025
              </span>
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.15] mb-4 md:mb-5 tracking-tight"
            >
              Redéfinissez Votre{" "}
              <span className=" md:inline">
                Élégance{" "}
                <span className="relative">
                  <span className="text-primary">Moderne</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-1 bg-primary/30 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </span>
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed max-w-full"
            >
              Mode masculine premium confectionnée pour l'homme moderne.
              Découvrez des pièces intemporelles qui subliment votre quotidien.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                asChild
                size="lg"
                className="text-sm tracking-wider h-11 md:h-12 px-6 md:px-8 rounded-full group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Link to="/boutique">
                  DÉCOUVRIR LA COLLECTION
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-sm tracking-wider h-11 md:h-12 px-6 md:px-8 rounded-full group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                onClick={() => console.log("Open lookbook modal")}
              >
                <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                VOIR LE LOOKBOOK
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="order-1 lg:order-2 relative"
          >
            <div className="grid grid-cols-12 grid-rows-6 gap-2 md:gap-3 h-[400px] md:h-[500px] lg:h-[550px]">
              <motion.div
                variants={imageVariants}
                className="col-span-8 row-span-6 relative rounded-xl md:rounded-2xl overflow-hidden bg-secondary group cursor-pointer ring-1 ring-border/50 hover:ring-primary/30 transition-all duration-500"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-secondary" />
                )}
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/handsome-male-model-wearing-premium-charcoal-suit--VzMtgCRuKyMJV3wtsKAtVRXLXST5eo.jpg"
                  alt="Homme portant un costume en laine charbon de la collection Moulay, style élégant et moderne"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 bg-background/95 backdrop-blur-sm p-3 md:p-5 rounded-lg md:rounded-xl border-l-2 border-l-primary border border-border/50"
                >
                  <p className="text-[10px] md:text-xs text-muted-foreground tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    BESTSELLER
                  </p>
                  <p className="text-sm md:text-lg font-medium">
                    Costume Laine Charbon
                  </p>
                  <div className="flex items-center justify-between mt-1 md:mt-2">
                    <p className="text-primary font-semibold text-base md:text-lg">
                      895 €
                    </p>
                    <span className="text-[10px] md:text-xs text-muted-foreground">
                      ★ 4.9 (234 avis)
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.button
                variants={imageVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.3 }}
                className="col-span-4 row-span-3 relative rounded-xl md:rounded-2xl overflow-hidden bg-secondary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:outline-none cursor-pointer group ring-1 ring-border/30 hover:ring-primary/40"
                onClick={() => console.log("Navigate to shirts")}
                aria-label="Voir les chemises premium"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/premium-white-dress-shirt-menswear-folded-clean-RQcowcyTq1plNuHKQCbeVtiFtF6trj.jpg"
                  alt="Chemise blanche premium pliée, collection homme"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent group-hover:opacity-0 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 text-background text-xs md:text-sm font-medium">
                  Chemises
                </div>
              </motion.button>

              <motion.button
                variants={imageVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.3 }}
                className="col-span-4 row-span-3 relative rounded-xl md:rounded-2xl overflow-hidden bg-secondary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:outline-none cursor-pointer group ring-1 ring-border/30 hover:ring-primary/40"
                onClick={() => console.log("Navigate to shoes")}
                aria-label="Voir les chaussures premium"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/luxury-leather-oxford-shoes-menswear-elegant-black-sqr7ebfP3iDu8sQUc4GueumXjBnocR.jpg"
                  alt="Chaussures Oxford en cuir noir, collection luxe homme"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent group-hover:opacity-0 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 text-background text-xs md:text-sm font-medium">
                  Chaussures
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-border/50"
      >
        {[
          { value: "15+", label: "Ans d'Excellence" },
          { value: "10K+", label: "Clients Fidèles" },
          { value: "200+", label: "Modèles Exclusifs" },
          { value: "30+", label: "Pays Livrés" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + i * 0.08 }}
            className="text-center group"
          >
            <p className="font-serif text-2xl md:text-3xl font-medium text-primary group-hover:scale-105 transition-transform">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Hero;
