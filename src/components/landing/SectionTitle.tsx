import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: React.ReactNode;
  highlight?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  as?: "h1" | "h2" | "h3" | "h4";
  animate?: boolean;
}

const sizeClasses = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-4xl lg:text-5xl",
  lg: "text-4xl md:text-5xl lg:text-6xl",
  xl: "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
};

export default function SectionTitle({
  children,
  highlight,
  className,
  size = "lg",
  as: Component = "h2",
  animate = true,
}: SectionTitleProps) {
  const content = (
    <Component
      className={cn(
        "font-serif font-medium tracking-tight text-foreground",
        sizeClasses[size],
        className,
      )}
    >
      {highlight ? (
        <>
          {children} <span className="text-primary">{highlight}</span>
        </>
      ) : (
        children
      )}
    </Component>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {content}
    </motion.div>
  );
}
