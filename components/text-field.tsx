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
  ...props
}: TextFieldProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block mb-1 text-lg">
          {label}
        </label>
      )}
      <div className="group flex items-center gap-3 rounded-xl border-2 border-transparent bg-surface-container px-3 transition-colors focus-within:border-primary">
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
          className={`w-full bg-transparent py-3 outline-none placeholder:text-muted/50 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}