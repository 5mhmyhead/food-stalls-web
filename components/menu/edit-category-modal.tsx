"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown, Loader2, Trash2, X } from "lucide-react";
import type { categories } from "@/db/schema";
import { deleteCategory, updateCategory } from "./actions";
import CategoryIconPicker from "../category-icon-picker";
import TextField from "../text-field";

type Category = typeof categories.$inferSelect;

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategoryId?: number | null;
}

export default function EditCategoryModal({
  isOpen,
  ...props
}: EditCategoryModalProps) {
  if (!isOpen || props.categories.length === 0) return null;
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

function ModalContent({
  onClose,
  categories,
  selectedCategoryId,
}: Omit<EditCategoryModalProps, "isOpen">) {
  const defaultCategory =
    categories.find((c) => c.id === selectedCategoryId) ?? categories[0];

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [activeCategoryId, setActiveCategoryId] = useState<number>(
    defaultCategory.id
  );
  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) ?? defaultCategory;

  const [name, setName] = useState(activeCategory.name);
  const [selectedIcon, setSelectedIcon] = useState<string>(activeCategory.icon);

  // Sync state when picking a different category from dropdown
  function handleCategorySelect(id: number) {
    const picked = categories.find((c) => c.id === id);
    if (picked) {
      setActiveCategoryId(picked.id);
      setName(picked.name);
      setSelectedIcon(picked.icon);
      setError(null);
    }
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        if (isDeleteDialogOpen) {
          setIsDeleteDialogOpen(false);
        } else {
          onClose();
        }
      }
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isPending, isDeleteDialogOpen, onClose]);

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteCategory(activeCategory.id);
        setIsDeleteDialogOpen(false);
        onClose();
      } catch {
        setError("Failed to delete the category. Make sure it has no items assigned.");
        setIsDeleteDialogOpen(false);
      }
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !selectedIcon) {
      return setError("Please input all required fields.");
    }

    startTransition(async () => {
      try {
        await updateCategory(activeCategory.id, {
          name: name.trim(),
          icon: selectedIcon,
        });
        onClose();
      } catch {
        setError("Failed to update the category. Please try again.");
      }
    });
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget && !isPending) onClose();
        }}
      >
        <div className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-surface">
          <div className="flex items-start justify-between gap-4 px-8 pb-4 pt-8">
            <div>
              <h2 className="font-serif text-3xl font-bold">Edit Category</h2>
              <p className="text-muted">Update category name and icon.</p>
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
              <Field label="Select Category" htmlFor="select-category" required>
                <div className="relative">
                  <select
                    id="select-category"
                    value={activeCategoryId}
                    onChange={(e) => handleCategorySelect(Number(e.target.value))}
                    disabled={isPending}
                    className="input-control appearance-none pr-11"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={20}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                </div>
              </Field>

              <Field label="Category Name" htmlFor="category-name" required>
                <TextField
                  id="category-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Beverages, Desserts"
                />
              </Field>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-bold text-muted">
                  Category Icon<span className="text-primary"> *</span>
                </span>
                <CategoryIconPicker value={selectedIcon} onChange={setSelectedIcon} />
              </div>

              {error && <p className="text-primary">{error}</p>}
            </div>

            <div className="flex px-8 pb-8 pt-4">
              <div className="flex w-full items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 rounded-xl bg-tertiary/20 px-5 py-3 font-bold text-tertiary transition-colors hover:bg-tertiary hover:text-background disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Delete
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    className="btn-muted px-6"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="btn-primary flex items-center justify-center gap-2 px-6"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isPending) {
              setIsDeleteDialogOpen(false);
            }
          }}
        >
          <div className="flex w-full max-w-md flex-col gap-6 rounded-3xl bg-surface p-8 shadow-2xl">
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-3xl font-bold">Delete Category?</h3>
              <p className="text-muted font-medium">
                Are you sure you want to delete <span className="font-bold text-foreground">"{activeCategory.name}"</span>? Products belonging to this category will need to be updated.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isPending}
                className="btn-muted px-5 py-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isPending}
                className="flex items-center gap-2 rounded-xl bg-tertiary px-5 py-3 font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Category"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}