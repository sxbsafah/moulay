import { motion, Variants } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const testimonials = [
  {
    name: "Jean-Pierre Martin",
    role: "Directeur Créatif",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    text: "Moulay a complètement transformé ma garde-robe. La qualité est inégalée, et chaque pièce semble avoir été faite sur mesure pour moi.",
    rating: 5,
  },
  {
    name: "Thomas Dubois",
    role: "Entrepreneur",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    text: "Je porte les costumes Moulay depuis 3 ans maintenant. L'attention aux détails et le savoir-faire sont vraiment exceptionnels.",
    rating: 5,
  },
  {
    name: "Marc Leroy",
    role: "Architecte",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    text: "Du casual au formel, Moulay a tout ce dont j'ai besoin. Les tissus sont luxueux et les coupes sont parfaites.",
    rating: 5,
  },
];

const stats = [
  { value: "100%", label: "Tissus Premium" },
  { value: "30 Jours", label: "Retours Gratuits" },
  { value: "Gratuit", label: "Livraison Mondiale" },
  { value: "24/7", label: "Service Client" },
];

function WhyMoulay() {
  return (
    <section
      id="about"
      className="py-16 md:py-20 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center mb-16 md:mb-20"
        >
          <div className="relative">
            <div className="aspect-4/5 rounded-xl md:rounded-2xl overflow-hidden ring-1 ring-border/50">
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
                alt="Moulay editorial"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 md:w-32 h-24 md:h-32 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="lg:pl-8">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-muted-foreground mb-4 md:mb-6 uppercase">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 24 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-px bg-primary"
              />
              Notre Histoire
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium mb-4 md:mb-6 leading-tight">
              Confectionné pour
              <br />
              <span className="text-primary">l'Homme Moderne</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4 md:mb-6">
              Depuis plus de 15 ans, Moulay est synonyme de mode masculine
              raffinée. Chaque couture, chaque tissu, chaque détail est
              soigneusement pensé pour créer des pièces qui transcendent les
              saisons.
            </p>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 md:mb-8">
              Nous sélectionnons les matières les plus nobles auprès des
              filatures italiennes et françaises, en collaboration avec des
              maîtres artisans partageant notre obsession de la perfection.
            </p>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="space-y-1"
                >
                  <p className="font-serif text-2xl md:text-3xl font-medium text-primary">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="pt-12 md:pt-16 border-t border-border">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-8 md:mb-12"
          >
            <h3 className="font-serif text-2xl md:text-4xl font-medium mb-3 md:mb-4">
              Ce Que Disent Nos Clients
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Rejoignez des milliers de gentlemen satisfaits dans le monde
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={staggerItem}>
                <TestimonialCard
                  name={testimonial.name}
                  role={testimonial.role}
                  image={testimonial.image}
                  text={testimonial.text}
                  rating={testimonial.rating}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default WhyMoulay;
