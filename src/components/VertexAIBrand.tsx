import { cn } from "@/lib/utils";

export function VertexAIBrand({
  aiClassName,
  className,
  logoClassName = "h-9 w-fit",
}: {
  aiClassName?: string;
  className?: string;
  logoClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label="VertexAI">
      <img className={logoClassName} src="/vertex-horizontal.svg" alt="" aria-hidden="true" />
      <span className={cn("text-2xl font-semibold tracking-normal text-primary", aiClassName)}>AI</span>
    </div>
  );
}
