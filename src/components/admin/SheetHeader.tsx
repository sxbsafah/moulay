type AdminTitleCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};





const SheetHeader = ({ title, description, icon }: AdminTitleCardProps) => {
  return (
    <div className="relative bg-linear-to-br from-primary via-primary/95 to-primary/90 border-b border-primary/20 px-6 py-6 shrink-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
      <div className="relative flex items-center gap-3">
        <div className="w-12 h-12 bg-primary-foreground/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
          {icon}
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-primary-foreground">
            {title}
          </h2>
          <p className="text-sm text-primary-foreground/80">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SheetHeader;
