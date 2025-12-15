import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DecorativeBackgroundProps {
  className?: string;
  variant?: "dots" | "grid";
  showAccents?: boolean;
  accentPosition?: "corners" | "sides" | "both";
}

export function DecorativeBackground({
  className,
  variant = "dots",
  showAccents = true,
  accentPosition = "corners",
}: DecorativeBackgroundProps) {
  return (
    <>
      {/* Decorative blur circles */}
      {showAccents &&
        (accentPosition === "corners" || accentPosition === "both") && (
          <>
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          </>
        )}

      {/* Side accents */}
      {showAccents &&
        (accentPosition === "sides" || accentPosition === "both") && (
          <>
            <div className="absolute top-0 left-0 w-px h-32 bg-linear-to-b from-primary to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-px h-32 bg-linear-to-b from-primary to-transparent pointer-events-none" />
          </>
        )}

      {/* Pattern */}
      <div
        className={cn(
          "absolute inset-0 opacity-[0.06] pointer-events-none",
          className,
        )}
        style={{
          backgroundImage:
            variant === "dots"
              ? "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)"
              : "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: variant === "dots" ? "32px 32px" : "32px 32px",
        }}
      />
    </>
  );
}

interface AnimatedLineProps {
  className?: string;
  direction?: "horizontal" | "vertical";
  length?: number;
  delay?: number;
}

export function AnimatedLine({
  className,
  direction = "horizontal",
  length = 48,
  delay = 0.2,
}: AnimatedLineProps) {
  const isHorizontal = direction === "horizontal";

  return (
    <motion.div
      initial={isHorizontal ? { width: 0 } : { height: 0 }}
      whileInView={isHorizontal ? { width: length } : { height: length }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={cn(
        "bg-primary rounded-full",
        isHorizontal ? "h-1" : "w-1",
        className,
      )}
    />
  );
}
