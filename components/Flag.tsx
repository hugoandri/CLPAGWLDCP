import Image from "next/image";
import { cn } from "@/lib/utils";

type FlagProps = {
  isoCode: string;
  alt?: string;
  className?: string;
  width?: number;
  priority?: boolean;
};

const FLAG_BASE = "https://flagcdn.com";

export default function Flag({ isoCode, alt = "", className = "", width = 40, priority = false }: FlagProps) {
  const height = Math.round(width * 3 / 4);

  return (
    <Image
      src={`${FLAG_BASE}/${width}x${height}/${isoCode}.png`}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? undefined : "lazy"}
      priority={priority}
      className={cn("block shrink-0 bg-transparent", className)}
      style={{ width, height, objectFit: "contain" }}
    />
  );
}
