"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type TextFieldProps = React.ComponentProps<"input"> & {
  id: string;
  label?: string;
  icon?: React.ReactNode;
};

export default function TextField({
  id,
  label,
  icon,
  className = "",
  type,
  ...props
}: TextFieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      {label && (
        <label htmlFor={id} className="text-lg">
          {label}
        </label>
      )}
      <div className="mt-1 group flex items-center gap-3 rounded-xl border-2 border-transparent bg-surface-container px-3 transition-colors focus-within:border-primary">
        {icon && (
          <>
            <span className="shrink-0 text-muted/75 transition-colors group-focus-within:text-primary">
              {icon}
            </span>
            <span className="h-8 px-px bg-muted/75 group-focus-within:bg-primary" />
          </>
        )}
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          className={`w-full bg-transparent py-3 outline-none placeholder:text-muted/50 ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="shrink-0 text-muted/75 transition-colors hover:text-primary focus-visible:text-primary outline-none"
          >
            {visible ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        )}
      </div>
    </div>
  );
}
