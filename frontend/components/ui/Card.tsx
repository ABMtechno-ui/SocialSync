"use client";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean; shadow?: "none"|"yellow"|"black"|"soft"; padding?: "sm"|"md"|"lg";
}
const shadowMap = {
  none:"", yellow:"shadow-[4px_4px_0px_#FFD54A]",
  black:"shadow-[4px_4px_0px_#111111]", soft:"shadow-[0_10px_28px_rgba(15,23,42,0.06)]",
};
const paddingMap = { sm:"p-4", md:"p-6", lg:"p-8" };

export default function Card({ hoverable=false, shadow="soft", padding="md", children, className="", ...props }: CardProps) {
  return (
    <div className={["bg-white border border-[#E5E5EA]", shadowMap[shadow], paddingMap[padding],
      hoverable && "cursor-pointer transition-all duration-[240ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[#FFFCF0] hover:border-[#E0D7B2] hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]",
      className].filter(Boolean).join(" ")} {...props}>{children}</div>
  );
}

export function CardHeader({ children, className="", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={["flex items-start justify-between gap-2 mb-3", className].join(" ")} {...props}>{children}</div>;
}
export function CardTitle({ children, className="", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={["font-mono font-bold text-[0.68rem] tracking-[0.09em] uppercase text-[#111111] leading-snug", className].join(" ")} {...props}>{children}</h3>;
}
export function CardDescription({ children, className="", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["font-sans text-[0.8rem] text-[#6E6E73] leading-relaxed", className].join(" ")} {...props}>{children}</p>;
}
