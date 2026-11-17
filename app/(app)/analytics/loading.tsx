export default function AnalyticsLoading() {
  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-y-auto rounded-3xl pb-6">
      <div className="flex shrink-0 items-end justify-between px-1">
        <div className="h-20 w-64 animate-pulse rounded-2xl bg-surface" />
        <div className="h-12 w-44 animate-pulse rounded-2xl bg-surface" />
      </div>

      <div className="grid w-full shrink-0 grid-cols-2 gap-6">
        <div className="h-52 animate-pulse rounded-3xl bg-surface" />
        <div className="h-52 animate-pulse rounded-3xl bg-surface" />
      </div>

      <div className="grid w-full shrink-0 grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between gap-6 rounded-3xl bg-surface p-6"
          >
            <div className="size-16 animate-pulse rounded-full bg-muted/10" />
            <div className="flex flex-col gap-2">
              <div className="h-5 w-32 animate-pulse rounded-lg bg-muted/10" />
              <div className="h-10 w-40 animate-pulse rounded-xl bg-muted/10" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid w-full shrink-0 grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between gap-6 rounded-3xl bg-surface p-6"
          >
            <div className="h-10 w-56 animate-pulse rounded-xl bg-muted/10" />
            <div className="h-64 w-full animate-pulse rounded-2xl bg-surface-container" />
          </div>
        ))}
      </div>

      <div className="flex w-full shrink-0 flex-col gap-6">
        <div className="ml-2 h-14 w-80 animate-pulse rounded-2xl bg-surface" />

        <div className="grid w-full grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex min-h-96 flex-col justify-between gap-6 rounded-3xl bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-48 animate-pulse rounded-xl bg-muted/10" />
                <div className="h-10 w-28 animate-pulse rounded-xl bg-muted/10" />
              </div>
              <div className="h-64 w-full animate-pulse rounded-2xl bg-surface-container" />
            </div>
          ))}
        </div>

        <div className="grid w-full grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col gap-4 rounded-3xl bg-surface p-6">
            <div className="h-10 w-52 animate-pulse rounded-xl bg-muted/10" />
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl bg-surface-container"
                />
              ))}
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-4 rounded-3xl bg-surface p-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-48 animate-pulse rounded-xl bg-muted/10" />
              <div className="h-10 w-24 animate-pulse rounded-xl bg-muted/10" />
            </div>
            <div className="flex flex-col gap-3.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-2xl bg-surface-container"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}