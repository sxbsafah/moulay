import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CollectionCardProps {
  title: string;
  description: string;
  badge: string;
  image: string;
  cta: string;
  eager?: boolean;
}

function CollectionCard({
  title,
  description,
  badge,
  image,
  cta,
  eager = false,
}: CollectionCardProps) {
  return (
    <Link
      to={`/boutique?collection=${title.toLowerCase().replace(" ", "-")}`}
      className="group block relative"
    >
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ring-1 ring-border/50 hover:ring-primary/40">
        <div className="relative aspect-4/5 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/5" />

          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="absolute top-5 left-5 md:top-6 md:left-6">
            <Badge className="bg-primary text-primary-foreground backdrop-blur-sm shadow-lg border-0 px-3 py-1.5">
              <Sparkles className="h-3 w-3 mr-1.5" />
              {badge}
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 transition-transform duration-500 group-hover:-translate-y-2">
            <p className="text-primary-foreground/80 text-xs md:text-sm tracking-widest mb-2 uppercase font-light">
              {description}
            </p>
            <h3 className="text-white font-serif text-2xl md:text-3xl lg:text-4xl font-medium mb-4 tracking-tight">
              {title}
            </h3>
            <Button
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl group/btn border-0"
            >
              {cta}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CollectionCard;
