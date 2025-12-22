import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionDescriptionProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export default function SectionDescription({
  children,
  className,
  animate = true,
}: SectionDescriptionProps) {
  const content = (
    <p
      className={cn(
        "text-muted-foreground text-base md:text-lg leading-relaxed",
        className,
      )}
    >
      {children}
    </p>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {content}
    </motion.div>
  );
}
