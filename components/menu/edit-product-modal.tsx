"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  Banknote,
  ChevronDown,
  ImagePlus,
  Loader2,
  Percent,
  Trash2,
  X,
} from "lucide-react";
import type { categories, products } from "@/db/schema";
import { deleteProduct, updateProduct } from "./actions";
import { createClient } from "@/utils/supabase/client";
import TextField from "../text-field";

type Category = typeof categories.$inferSelect;
type Product = typeof products.$inferSelect;

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  categories: Category[];
}

export default function EditProductModal({
  isOpen,
  ...props
}: EditProductModalProps) {
  if (!isOpen) return null;
  return <ModalContent key={props.product.id} {...props} />;
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
  product,
  categories,
}: Omit<EditProductModalProps, "isOpen">) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [name, setName] = useState(product.name);
  const [categoryId, setCategoryId] = useState(String(product.categoryId));
  const [description, setDescription] = useState(product.description ?? "");
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [discount, setDiscount] = useState(
    product.discount != null ? String(product.discount) : ""
  );
  const [availability, setAvailability] = useState(product.availability);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    product.imageUrl ?? null
  );
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasCategories = categories.length > 0;

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

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== product.imageUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, product.imageUrl]);

  function handleFile(file: File) {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be 2MB or smaller.");
      return;
    }

    setSelectedFile(file);
    setIsImageRemoved(false);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleRemoveImage() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsImageRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      try {
        if (product.imageUrl) {
          const supabase = createClient();
          const fileName = product.imageUrl.split("/").pop();
          if (fileName) {
            await supabase.storage.from("products").remove([fileName]);
          }
        }

        await deleteProduct(product.id);
        setIsDeleteDialogOpen(false);
        onClose();
      } catch {
        setError("Failed to delete the item. Please try again.");
        setIsDeleteDialogOpen(false);
      }
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const priceValue = Number(price);
    const stockValue = Number(stock);
    const discountValue = discount === "" ? 0 : Number(discount);

    if (
      !name.trim() ||
      !categoryId ||
      !price ||
      !(priceValue > 0) ||
      stock === "" ||
      !Number.isInteger(stockValue) ||
      stockValue < 0
    ) {
      return setError("Please input all required fields.");
    }

    if (discountValue < 0 || discountValue > 100) {
      return setError("Discount must be between 0 and 100.");
    }

    startTransition(async () => {
      const supabase = createClient();
      let uploadedPath: string | null = null;

      try {
        let finalImageUrl: string | null | undefined = product.imageUrl;

        if (selectedFile) {
          const ext = selectedFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
          const path = `${crypto.randomUUID()}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(path, selectedFile, { contentType: selectedFile.type });

          if (uploadError) {
            setError("Image upload failed. Please try again.");
            return;
          }

          uploadedPath = path;
          finalImageUrl = supabase.storage.from("products").getPublicUrl(path).data
            .publicUrl;
        } else if (isImageRemoved) {
          if (product.imageUrl) {
            const fileName = product.imageUrl.split("/").pop();
            if (fileName) {
              await supabase.storage.from("products").remove([fileName]);
            }
          }
          finalImageUrl = null;
        }

        await updateProduct(product.id, {
          name: name.trim(),
          categoryId: Number(categoryId),
          description: description.trim() || null,
          price: priceValue,
          stock: stockValue,
          discount: discountValue > 0 ? discountValue : 0,
          availability,
          imageUrl: finalImageUrl,
        });

        onClose();
      } catch {
        if (uploadedPath) {
          await supabase.storage.from("products").remove([uploadedPath]);
        }
        setError("Failed to update the item. Please try again.");
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
        <div className="flex max-h-[90dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-surface">
          <div className="flex items-start justify-between gap-4 px-10 pb-4 pt-8">
            <div>
              <h2 className="font-serif text-3xl font-bold">Edit Menu Item</h2>
              <p className="text-muted">Update product details and availability.</p>
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
            <div className="grid flex-1 gap-10 overflow-y-auto px-10 py-2 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <Field label="Product Image" htmlFor="image">
                  <input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                      e.target.value = "";
                    }}
                  />

                  {previewUrl ? (
                    <div className="relative h-64 overflow-hidden rounded-xl bg-surface-container">
                      <Image
                        src={previewUrl}
                        alt="Preview of the product image"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-xl bg-tertiary text-background transition-opacity hover:opacity-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors *:pointer-events-none ${
                        isDragging
                          ? "border-primary bg-primary/10"
                          : "border-muted/30 bg-surface-container hover:border-primary/60"
                      }`}
                    >
                      <ImagePlus className="size-14 stroke-[1.5] text-muted" />
                      <span className="text-xl font-extrabold">Upload New Image</span>
                      <span className="text-sm font-medium text-muted">
                        PNG, JPG or WebP, up to 2MB.
                      </span>
                    </button>
                  )}
                </Field>

                <Field label="Description" htmlFor="description" className="flex-1">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of the item..."
                    className="min-h-32 w-full flex-1 resize-none rounded-xl bg-surface-container px-4 py-3 font-medium outline-none placeholder:text-muted/60 focus:ring-2 focus:ring-primary"
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-5">
                <Field label="Item Name" htmlFor="name" required>
                  <TextField
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Milk Tea Frappe"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Category" htmlFor="category" required>
                    <div className="relative">
                      <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        disabled={!hasCategories}
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

                  <Field label="Price" htmlFor="price" required>
                    <TextField
                      id="price"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      icon={<Banknote size={18} />}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Stock" htmlFor="stock" required>
                    <TextField
                      id="stock"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step="1"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="10"
                    />
                  </Field>

                  <Field label="Discount" htmlFor="discount">
                    <TextField
                      id="discount"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="100"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="0"
                      icon={<Percent size={18} />}
                    />
                  </Field>
                </div>

                <label
                  htmlFor="availability"
                  className="flex h-12 cursor-pointer items-center justify-between rounded-xl bg-surface-container px-4"
                >
                  <span className="font-bold">Available for sale</span>
                  <input
                    id="availability"
                    type="checkbox"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="relative h-6 w-11 rounded-full bg-muted/30 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-background after:transition-transform peer-checked:bg-primary peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary" />
                </label>

                {error && <p className="text-primary">{error}</p>}
              </div>
            </div>

            <div className="flex px-10 pb-8 pt-4">
              <div className="flex w-full items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 rounded-xl bg-tertiary/20 px-5 py-3 font-bold text-tertiary transition-colors hover:bg-tertiary hover:text-background disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Delete Item
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
                    disabled={isPending || !hasCategories}
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

      {isDeleteDialogOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isPending) {
              setIsDeleteDialogOpen(false);
            }
          }}
        >
          <div className="flex w-full max-w-md flex-col gap-6 rounded-3xl bg-surface p-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-3xl font-bold">Delete Menu Item?</h3>
              <p className="text-muted font-medium">
                Are you sure you want to delete <span className="font-bold text-foreground">"{product.name}"</span>? This action cannot be undone.
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
                  "Delete Item"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}