export function BrandPartners() {
  const brands = [
    { name: "Barbie", style: "font-serif italic text-2xl md:text-3xl" },
    { name: "George", style: "font-sans text-xl md:text-2xl tracking-wider", hasIcon: true },
    { name: "Gucci", style: "font-serif italic text-2xl md:text-3xl" },
    { name: "Iconic", style: "font-sans font-bold text-xl md:text-2xl tracking-tight", subtitle: "MENSWEAR" },
    { name: "natural", style: "font-sans font-light text-xl md:text-2xl tracking-wide", subtitle: "FASHION" },
    { name: "Smile", style: "font-serif italic text-2xl md:text-3xl" },
  ]

  const duplicatedBrands = [...brands, ...brands]

  return (
    <section className="py-10 md:py-12 border-y border-border bg-background overflow-hidden">
      <div className="relative">
        <div className="flex animate-slide">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex flex-col items-center justify-center px-10 md:px-16 lg:px-20"
            >
              <span
                className={`${brand.style} text-foreground whitespace-nowrap opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
              >
                {brand.hasIcon && <span className="inline-block mr-1 font-serif italic">L</span>}
                {brand.name}
              </span>
              {brand.subtitle && (
                <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-muted-foreground mt-0.5">
                  {brand.subtitle}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandPartners