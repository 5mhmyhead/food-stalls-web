export default function HistoryLoading() {
  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-hidden">
      <div className="h-20 w-52 shrink-0 animate-pulse rounded-2xl bg-surface" />

      <div className="flex min-h-0 flex-1 gap-6">
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-3xl bg-surface p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex shrink-0 flex-col justify-between gap-3 rounded-2xl bg-surface-container p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="h-6 w-32 animate-pulse rounded-lg bg-muted/10" />
                <div className="h-7 w-20 animate-pulse rounded-xl bg-muted/10" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="h-4 w-44 animate-pulse rounded-md bg-muted/10" />
                <div className="h-5 w-24 animate-pulse rounded-lg bg-muted/10" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between gap-6 rounded-3xl bg-surface p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="h-9 w-48 animate-pulse rounded-xl bg-muted/10" />
                <div className="h-4 w-36 animate-pulse rounded-md bg-muted/10" />
              </div>
              <div className="h-9 w-24 animate-pulse rounded-xl bg-muted/10" />
            </div>

            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-surface-container p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-12 shrink-0 animate-pulse rounded-xl bg-muted/10" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-5 w-36 animate-pulse rounded-lg bg-muted/10" />
                      <div className="h-4 w-20 animate-pulse rounded-md bg-muted/10" />
                    </div>
                  </div>
                  <div className="h-5 w-20 animate-pulse rounded-lg bg-muted/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-surface-container p-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded-md bg-muted/10" />
              <div className="h-4 w-20 animate-pulse rounded-md bg-muted/10" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-6 w-20 animate-pulse rounded-lg bg-muted/10" />
              <div className="h-7 w-28 animate-pulse rounded-lg bg-muted/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}