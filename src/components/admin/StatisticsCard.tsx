import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type StatisticsCardProps = {
  title: string;
  value: string | number;
  caption?: string;
  trending?: "up" | "down";
  trendValue?: string;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
};

const variantStyles = {
  default: {
    gradient: "from-primary/10 via-primary/5 to-transparent",
    accentGradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  success: {
    gradient: "from-primary/10 via-primary/5 to-transparent",
    accentGradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  warning: {
    gradient: "from-primary/10 via-primary/5 to-transparent",
    accentGradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  danger: {
    gradient: "from-destructive/10 via-destructive/5 to-transparent",
    accentGradient: "from-destructive/20 to-destructive/5",
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
};

const StatisticsCard = ({
  title,
  value,
  caption,
  trending,
  trendValue,
  icon,
  variant = "default",
}: StatisticsCardProps) => {
  const styles = variantStyles[variant];

  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-border bg-card">
      <div
        className={cn("absolute inset-0 bg-gradient-to-br", styles.gradient)}
      />

      <div
        className={cn(
          "absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br opacity-60 blur-2xl group-hover:opacity-80 transition-opacity duration-500",
          styles.accentGradient,
        )}
      />

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>

            <p className="text-3xl  font-medium tracking-tight text-primary ">
              {value}
            </p>

            <div className="flex items-center gap-2 pt-0.5">
              {trending && trendValue && (
                <div
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium",
                    trending === "up" ? "text-primary" : "text-destructive",
                  )}
                >
                  {trending === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{trendValue}</span>
                </div>
              )}
              {caption && (
                <span className="text-xs text-muted-foreground">{caption}</span>
              )}
            </div>
          </div>

          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              "group-hover:scale-105 transition-transform duration-300",
              "bg-gradient-to-br",
              styles.accentGradient,
              styles.iconColor,
            )}
          >
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatisticsCard;
