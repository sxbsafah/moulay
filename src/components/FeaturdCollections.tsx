import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle, SectionDescription } from "@/components/ui/section-title";
import { DecorativeBackground, AnimatedLine } from "@/components/ui/decorative";
import {
  AnimatedContainer,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated";

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
      <DecorativeBackground variant="dots" accentPosition="both" />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedContainer className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <AnimatedLine length={48} />
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
        </AnimatedContainer>

        <StaggerContainer className="grid md:grid-cols-2 gap-5 lg:gap-6 mb-14">
          {collections.map((collection, index) => (
            <StaggerItem key={index}>
              <Link
                to={`/boutique?collection=${collection.title
                  .toLowerCase()
                  .replace(" ", "-")}`}
                className="group block relative"
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-border/50 hover:ring-primary/40">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {/* Optimized image with CSS transitions */}
                    <img
                      src={collection.image}
                      alt={collection.title}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="absolute top-5 left-5 md:top-6 md:left-6">
                      <Badge className="bg-primary text-primary-foreground backdrop-blur-sm shadow-lg border-0 px-3 py-1.5">
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        {collection.badge}
                      </Badge>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 transition-transform duration-500 group-hover:-translate-y-2">
                      <p className="text-primary-foreground/80 text-xs md:text-sm tracking-widest mb-2 uppercase font-light">
                        {collection.description}
                      </p>
                      <h3 className="text-white font-serif text-2xl md:text-3xl lg:text-4xl font-medium mb-4 tracking-tight">
                        {collection.title}
                      </h3>
                      <Button
                        size="lg"
                        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl group/btn border-0"
                      >
                        {collection.cta}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedContainer>
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <SectionTitle size="sm" highlight="Catégorie" animate={false}>
                Explorer par
              </SectionTitle>
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-primary rounded-full" />
                <p className="text-muted-foreground text-sm">
                  Trouvez exactement ce que vous cherchez
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {categories.map((cat, i) => (
              <AnimatedContainer
                key={i}
                delay={i * 0.1}
              >
                <Link
                  to={`/boutique?category=${cat.name.toLowerCase()}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-xl ring-1 ring-border/50 hover:ring-primary/50 transition-all duration-500 hover:shadow-lg bg-card">
                    <div className="aspect-square overflow-hidden relative bg-muted">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-base md:text-lg mb-1 text-foreground group-hover:text-primary transition-colors duration-300">
                        {cat.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {cat.count}
                      </p>
                    </div>
                  </div>
                </Link>
              </AnimatedContainer>
            ))}
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}

export default FeaturedCollections;
