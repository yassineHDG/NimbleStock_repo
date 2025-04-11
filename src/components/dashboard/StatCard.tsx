
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  footer?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  footer, 
  trend = "neutral",
  className, 
  valuePrefix = "",
  valueSuffix = ""
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="w-4 h-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {valuePrefix}{value}{valueSuffix}
        </div>
      </CardContent>
      {footer && (
        <CardFooter className="py-2">
          <p className={cn(
            "text-xs",
            trend === "up" && "text-success",
            trend === "down" && "text-destructive"
          )}>
            {footer}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
