"use client";
interface BrandRowProps { name?: string; className?: string; }

export default function BrandRow({ name="SocialSync", className="" }: BrandRowProps) {
  return (
    <div className={["inline-flex items-center gap-2 border border-black/10 px-3 py-1.5 bg-white/80", className].join(" ")}>
      <div className="w-2.5 h-2.5 bg-[#FFD54A] border border-black/15 flex-shrink-0" />
      <span className="font-mono font-bold text-[0.7rem] tracking-[0.1em] uppercase text-[#3A3A3C]">{name}</span>
    </div>
  );
}
