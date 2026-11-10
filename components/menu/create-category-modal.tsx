"use client";

import { useEffect, useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { createCategory } from "./actions";
import CategoryIconPicker from "../category-icon-picker";
import TextField from "../text-field";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCategoryModal({
  isOpen,
  ...props
}: CreateCategoryModalProps) {
  if (!isOpen) return null;
  return <ModalContent {...props} />;
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-bold text-muted">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
      {hint && <p className="text-sm text-muted">{hint}</p>}
    </div>
  );
}

function ModalContent({ onClose }: Omit<CreateCategoryModalProps, "isOpen">) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("CookingPot");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) onClose();
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isPending, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !selectedIcon) {
      return setError("Please input all required fields.");
    }

    startTransition(async () => {
      try {
        await createCategory({
          name: name.trim(),
          icon: selectedIcon,
        });
        onClose();
      } catch {
        setError("Failed to create the category. Please try again.");
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
    >
      <div className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-surface">
        <div className="flex items-start justify-between gap-4 px-8 pb-4 pt-8">
          <div>
            <h2 id="create-category-title" className="font-serif text-3xl font-bold">
              Create Category
            </h2>
            <p className="text-muted">Add a new product category.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container text-muted transition-colors hover:text-primary disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-8 py-2">
            <Field label="Category Name" htmlFor="category-name" required>
              <TextField
                id="category-name"
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Beverages, Desserts"
              />
            </Field>

            <div className="flex flex-col gap-1.5">
              <span id="category-icon-label" className="text-sm font-bold text-muted">
                Category Icon<span className="text-primary"> *</span>
              </span>
              <CategoryIconPicker value={selectedIcon} onChange={setSelectedIcon} />
            </div>

            {error && (
              <p className="text-primary">
                {error}
              </p>
            )}
          </div>

          <div className="flex px-8 pb-8 pt-4">
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="btn-muted flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary flex flex-1 items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}