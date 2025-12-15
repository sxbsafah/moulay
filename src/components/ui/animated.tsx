import { motion, Variants } from "framer-motion";

// Animation variants used internally
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeInUpLarge: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Animated container component
interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  viewportMargin?: string;
}

export function AnimatedContainer({
  children,
  className,
  variants = fadeInUp,
  delay = 0,
  viewportMargin = "-100px",
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered children container
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  viewportMargin?: string;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.15,
  viewportMargin = "-100px",
}: StaggerContainerProps) {
  const customVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={customVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual staggered item
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={fadeInUpLarge} className={className}>
      {children}
    </motion.div>
  );
}
