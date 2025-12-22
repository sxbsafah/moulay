import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}

function TestimonialCard({
  name,
  role,
  image,
  text,
  rating,
}: TestimonialCardProps) {
  return (
    <div className="bg-secondary/50 p-5 md:p-8 rounded-xl md:rounded-2xl border border-border relative group hover:border-primary/30 transition-colors">
      <Quote className="absolute top-4 right-4 md:top-6 md:right-6 w-6 md:w-8 h-6 md:h-8 text-primary/20" />

      <div className="flex items-center gap-0.5 md:gap-1 mb-3 md:mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star
            key={i}
            className="w-3 md:w-4 h-3 md:h-4 fill-primary text-primary"
          />
        ))}
      </div>

      <p className="text-sm md:text-base text-foreground/90 leading-relaxed mb-4 md:mb-6">
        "{text}"
      </p>

      <div className="flex items-center gap-3 md:gap-4">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover bg-muted"
        />
        <div>
          <p className="font-medium text-xs md:text-sm">{name}</p>
          <p className="text-[10px] md:text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
