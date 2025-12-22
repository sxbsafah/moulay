import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  count: string;
  image: string;
}

function CategoryCard({ name, count, image }: CategoryCardProps) {
  return (
    <Link
      to={`/boutique?category=${name.toLowerCase()}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl ring-1 ring-border/50 hover:ring-primary/50 transition-all duration-500 hover:shadow-lg bg-card">
        <div className="aspect-square overflow-hidden relative bg-muted">
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-medium text-base md:text-lg mb-1 text-foreground group-hover:text-primary transition-colors duration-300">
            {name}
          </h4>
          <p className="text-sm text-muted-foreground">{count}</p>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;
