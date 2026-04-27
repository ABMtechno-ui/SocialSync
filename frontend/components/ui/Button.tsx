"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; size?: Size; loading?: boolean;
  icon?: React.ReactNode; iconPosition?: "left" | "right";
}

const variantStyles: Record<Variant, string> = {
  primary:   "bg-[#111111] text-white border-2 border-[#111111] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] active:translate-y-0 disabled:bg-[#C7C7CC] disabled:border-[#C7C7CC] disabled:text-[#6E6E73] disabled:shadow-none disabled:cursor-not-allowed",
  secondary: "bg-white text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_#FFD54A] hover:shadow-[4px_4px_0px_#F5B800] hover:-translate-y-0.5 active:shadow-none active:translate-y-0",
  ghost:     "bg-transparent text-[#6E6E73] border border-[#E5E5EA] hover:bg-[#F7F3E8] hover:text-[#111111] hover:border-[#C7C7CC]",
  danger:    "bg-[#111111] text-[#FFD54A] border-2 border-[#111111] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]",
};
const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[0.62rem] min-h-[30px] gap-1.5",
  md: "px-4 py-2   text-[0.62rem] min-h-[36px] gap-2",
  lg: "px-6 py-2.5 text-[0.7rem]  min-h-[42px] gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant="primary", size="md", loading=false, icon, iconPosition="left",
     children, className="", disabled, ...props }, ref) => (
    <button ref={ref} disabled={disabled || loading}
      className={["inline-flex items-center justify-center cursor-pointer",
        "font-mono font-bold tracking-[0.1em] uppercase",
        "transition-all duration-[240ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        "focus-visible:outline-2 focus-visible:outline-[#F5B800] focus-visible:outline-offset-2",
        variantStyles[variant], sizeStyles[size], className].join(" ")} {...props}>
      {loading ? (
        <span className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:300ms]" />
        </span>
      ) : (
        <>
          {icon && iconPosition === "left"  && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  )
);
Button.displayName = "Button";
export default Button;
