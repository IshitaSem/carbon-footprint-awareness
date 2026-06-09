import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "bordered" | "elevated";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: "border border-carbon-200 bg-white",
  bordered: "border border-earth-300 bg-white",
  elevated: "border border-carbon-100 bg-white shadow-lg shadow-carbon-900/10",
};

export function Card({
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn("rounded-2xl", variantClasses[variant], className)}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-0", className)} {...props} />;
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return (
    <h2
      className={cn("text-xl font-bold tracking-normal text-carbon-950", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}
