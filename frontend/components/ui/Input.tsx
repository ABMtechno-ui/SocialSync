"use client";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; hint?: string; error?: string; icon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, icon, className="", id, ...props }, ref) => {
    const uid = useId(); const inputId = id ?? uid;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label htmlFor={inputId} className="font-mono font-bold text-[0.6rem] tracking-[0.09em] uppercase text-[#3A3A3C]">{label}</label>}
        <div className="relative">
          {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6E73] pointer-events-none">{icon}</span>}
          <input ref={ref} id={inputId}
            className={["w-full bg-white text-[#111111] font-sans text-[0.9rem]",
              "border-2 border-[#111111] px-3 py-2 min-h-[40px]",
              "placeholder:text-[#C7C7CC] outline-none",
              "transition-all duration-[240ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
              "focus:shadow-[4px_4px_0px_#FFD54A]",
              error ? "border-red-500 focus:shadow-[4px_4px_0px_#ef4444]" : "",
              icon ? "pl-9" : "",
              "disabled:bg-[#F7F3E8] disabled:text-[#6E6E73] disabled:cursor-not-allowed",
              className].filter(Boolean).join(" ")} {...props} />
        </div>
        {hint && !error && <p className="font-mono text-[0.58rem] tracking-wide text-[#6E6E73]">{hint}</p>}
        {error && <p className="font-mono text-[0.58rem] tracking-wide text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; hint?: string; error?: string; maxCount?: number;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, maxCount, className="", id, value, ...props }, ref) => {
    const uid = useId(); const textareaId = id ?? uid;
    const currentLen = typeof value === "string" ? value.length : 0;
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label htmlFor={textareaId} className="font-mono font-bold text-[0.6rem] tracking-[0.09em] uppercase text-[#3A3A3C]">{label}</label>}
        <div className="relative">
          <textarea ref={ref} id={textareaId} value={value}
            className={["w-full bg-white text-[#111111] font-sans text-[0.9rem]",
              "border-2 border-[#111111] px-3 py-2 resize-none",
              "placeholder:text-[#C7C7CC] outline-none",
              "transition-all duration-[240ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
              "focus:shadow-[4px_4px_0px_#FFD54A]",
              error ? "border-red-500" : "", className].filter(Boolean).join(" ")} {...props} />
          {maxCount && (
            <span className="absolute bottom-2 right-3 font-mono text-[0.56rem] font-bold tracking-wide text-[#C7C7CC]">
              {currentLen.toLocaleString()}/{maxCount.toLocaleString()}
            </span>
          )}
        </div>
        {hint && !error && <p className="font-mono text-[0.58rem] tracking-wide text-[#6E6E73]">{hint}</p>}
        {error && <p className="font-mono text-[0.58rem] tracking-wide text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
