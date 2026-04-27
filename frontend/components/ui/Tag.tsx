"use client";
import { HTMLAttributes } from "react";

type TagVariant = "yellow"|"blue"|"green";
interface TagProps extends HTMLAttributes<HTMLDivElement> { variant?: TagVariant; label: string; }
const tagBg: Record<TagVariant,string> = { yellow:"bg-[#FFF3BF]", blue:"bg-[#E0ECFF]", green:"bg-[#E0F7EC]" };

export function IconTile({ variant="yellow", children, className="" }: { variant?: TagVariant; children: React.ReactNode; className?: string }) {
  return <div className={["w-10 h-10 flex items-center justify-center text-[#111111] flex-shrink-0", tagBg[variant], className].join(" ")}>{children}</div>;
}

export default function Tag({ variant="yellow", label, className="", ...props }: TagProps) {
  return (
    <div className={["inline-flex items-center font-mono font-bold text-[0.56rem] tracking-[0.08em] uppercase px-2.5 py-1 text-[#3A3A3C]", tagBg[variant], className].join(" ")} {...props}>
      {label}
    </div>
  );
}
