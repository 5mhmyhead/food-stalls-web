"use client";

import { useState } from "react";
import Image from "next/image";
import { getCategoryIcon } from "@/lib/product-ui";

export default function HistoryThumbnail({ imgUrl }: { imgUrl?: string }) {
  const [hasError, setHasError] = useState(false);
  const FallbackIcon = getCategoryIcon();

  return (
    <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-surface-container bg-background">
      {imgUrl && !hasError ? (
        <Image
          src={imgUrl}
          alt="Ordered product thumbnail"
          fill
          className="object-cover transition-transform duration-300"
          onError={() => setHasError(true)}
        />
      ) : (
        <FallbackIcon className="size-8 text-muted/50 transition-colors duration-300 group-hover:text-muted" />
      )}
    </div>
  );
}