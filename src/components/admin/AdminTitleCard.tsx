



type AdminTitleCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};



const AdminTitleCard = ({ title, description, icon }: AdminTitleCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 shadow-xl border border-primary/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-16 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-serif font-bold text-primary-foreground">
              {title}
            </h1>
            <p className="text-primary-foreground/80 text-sm mt-0.5">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTitleCard;
