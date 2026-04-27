"use client";
import { HTMLAttributes } from "react";

type BadgeVariant = "yellow"|"blue"|"green"|"grey"|"black";
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> { variant?: BadgeVariant; dot?: boolean; }

const badgeStyles: Record<BadgeVariant,string> = {
  yellow:"bg-[#FFF3BF] text-[#3A3A3C]", blue:"bg-[#E0ECFF] text-[#3A3A3C]",
  green:"bg-[#E0F7EC] text-[#3A3A3C]",  grey:"bg-[#F7F3E8] text-[#6E6E73]", black:"bg-[#111111] text-white",
};
const dotColors: Record<BadgeVariant,string> = {
  yellow:"bg-[#F5B800]", blue:"bg-blue-400", green:"bg-green-400", grey:"bg-[#C7C7CC]", black:"bg-[#FFD54A]",
};

export default function Badge({ variant="yellow", dot=false, children, className="", ...props }: BadgeProps) {
  return (
    <span className={["inline-flex items-center gap-1.5 font-mono font-bold text-[0.56rem] tracking-[0.08em] uppercase px-2 py-1", badgeStyles[variant], className].join(" ")} {...props}>
      {dot && <span className={["w-1.5 h-1.5 rounded-full flex-shrink-0", dotColors[variant]].join(" ")} />}
      {children}
    </span>
  );
}

export function LiveBadge({ label="Live", className="" }: { label?: string; className?: string }) {
  return (
    <Badge variant="green" className={className}>
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-[blink_1.8s_infinite] flex-shrink-0" />
      {label}
    </Badge>
  );
}
