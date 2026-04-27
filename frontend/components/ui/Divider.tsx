export default function Divider({ className="" }: { className?: string }) {
  return <hr className={["border-0 border-t border-[#E5E5EA]", className].join(" ")} />;
}
