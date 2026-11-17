export default function SettingsLoading() {
  return (
    <section className="h-full w-full overflow-hidden rounded-3xl">
      <div className="h-20 w-56 shrink-0 animate-pulse rounded-2xl bg-surface" />

      <div className="flex flex-col gap-4 pt-6">
        <div className="flex flex-col gap-5 rounded-3xl bg-surface p-6">
          <div className="h-9 w-48 animate-pulse rounded-xl bg-muted/10" />

          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-2xl bg-surface-container p-4"
              >
                <div className="h-4 w-24 animate-pulse rounded-md bg-muted/10" />
                <div className="h-6 w-40 animate-pulse rounded-lg bg-muted/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-3xl bg-surface p-6">
          <div className="h-9 w-32 animate-pulse rounded-xl bg-muted/10" />

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface-container p-4">
            <div className="flex flex-col gap-1.5">
              <div className="h-5 w-40 animate-pulse rounded-lg bg-muted/10" />
              <div className="h-4 w-64 animate-pulse rounded-md bg-muted/10" />
            </div>
            <div className="h-11 w-36 shrink-0 animate-pulse rounded-xl bg-muted/10" />
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-3xl bg-surface p-6">
          <div className="h-9 w-40 animate-pulse rounded-xl bg-muted/10" />

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface-container p-4">
            <div className="flex flex-col gap-1.5">
              <div className="h-5 w-48 animate-pulse rounded-lg bg-muted/10" />
              <div className="h-4 w-72 animate-pulse rounded-md bg-muted/10" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-11 w-24 animate-pulse rounded-xl bg-muted/10" />
              <div className="h-11 w-24 animate-pulse rounded-xl bg-muted/10" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-3xl bg-surface p-6">
          <div className="h-9 w-52 animate-pulse rounded-xl bg-muted/10" />

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface-container p-4">
            <div className="flex flex-col gap-1.5">
              <div className="h-5 w-36 animate-pulse rounded-lg bg-muted/10" />
              <div className="h-4 w-80 animate-pulse rounded-md bg-muted/10" />
            </div>
            <div className="h-11 w-36 shrink-0 animate-pulse rounded-xl bg-muted/10" />
          </div>
        </div>
      </div>
    </section>
  );
}