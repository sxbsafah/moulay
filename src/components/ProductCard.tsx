import { Link } from "react-router";
import { Heart, Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  reviews: number;
  colors: string[];
  sizes: string[];
}

interface ProductCardProps {
  product: Product;
  className?: string;
  onFavorite?: (productId: number) => void;
  onQuickView?: (productId: number) => void;
}

export default function ProductCard({
  product,
  className,
  onFavorite,
  onQuickView,
}: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div
      className={cn(
        "group bg-card rounded-xl overflow-hidden ring-1 ring-border/50 hover:ring-primary/30 hover:shadow-xl transition-all duration-500",
        className,
      )}
    >
      <Link to={`/produit/${product.id}`} className="block">
        <div className="relative aspect-3/4 bg-muted overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge === "Nouveau" && (
              <Badge className="bg-primary text-primary-foreground text-[9px] tracking-widest px-2.5 py-1 border-0">
                NOUVEAU
              </Badge>
            )}
            {discountPercent && (
              <Badge className="bg-destructive text-destructive-foreground text-[9px] tracking-widest px-2.5 py-1 border-0">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Hover Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <Button
              variant="secondary"
              size="icon"
              className="w-8 h-8 rounded-full bg-background/95 backdrop-blur shadow-md hover:bg-primary hover:text-primary-foreground"
              onClick={(e) => {
                e.preventDefault();
                onFavorite?.(product.id);
              }}
            >
              <Heart className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="w-8 h-8 rounded-full bg-background/95 backdrop-blur shadow-md hover:bg-primary hover:text-primary-foreground"
              onClick={(e) => {
                e.preventDefault();
                onQuickView?.(product.id);
              }}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Primary color overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
            {product.category}
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-[10px] text-muted-foreground">
              ({product.reviews})
            </span>
          </div>
        </div>

        <Link to={`/produit/${product.id}`}>
          <h3 className="text-sm font-medium leading-tight line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-primary">
            {product.price} €
          </p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {product.originalPrice} €
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full ring-1 ring-border/50"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-muted-foreground ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {product.sizes.length} tailles
          </p>
        </div>
      </div>
    </div>
  );
}
