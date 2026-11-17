export default function MenuLoading() {
  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-hidden rounded-3xl">
      <div className="h-20 w-48 shrink-0 animate-pulse rounded-2xl bg-surface" />

      <div className="flex min-h-0 w-full flex-1 flex-col gap-6">
        <div className="flex w-full shrink-0 flex-col gap-4 rounded-3xl bg-surface p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="h-12 flex-1 animate-pulse rounded-2xl bg-surface-container" />
            <div className="h-12 w-36 shrink-0 animate-pulse rounded-2xl bg-muted/10" />
          </div>

          <div className="flex items-center gap-2 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 shrink-0 animate-pulse rounded-xl bg-muted/10"
              />
            ))}
          </div>
        </div>

        <div className="min-h-0 w-full flex-1 overflow-hidden rounded-3xl bg-surface p-6">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl bg-surface-container"
              >
                <div className="h-44 w-full animate-pulse bg-muted/10" />

                <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3.5 w-20 animate-pulse rounded-md bg-muted/10" />
                    <div className="h-6 w-36 animate-pulse rounded-lg bg-muted/10" />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="h-6 w-20 animate-pulse rounded-lg bg-muted/10" />
                    <div className="h-5 w-16 animate-pulse rounded-md bg-muted/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}