export default function HomeLoading() {
  return (
    <section className="flex h-full w-full flex-col gap-6 overflow-hidden rounded-3xl">
      <div className="h-20 w-48 shrink-0 animate-pulse rounded-2xl bg-surface" />

      <div className="grid w-full shrink-0 grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col justify-between gap-6 rounded-3xl bg-surface p-8">
          <div className="flex flex-col gap-3">
            <div className="h-10 w-72 animate-pulse rounded-xl bg-muted/10" />
            <div className="h-5 w-96 animate-pulse rounded-lg bg-muted/10" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-36 animate-pulse rounded-xl bg-muted/10" />
            <div className="h-10 w-36 animate-pulse rounded-xl bg-muted/10" />
          </div>
        </div>

        <div className="col-span-1 flex flex-col justify-between gap-4 rounded-3xl bg-surface p-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-36 animate-pulse rounded-xl bg-muted/10" />
            <div className="h-8 w-20 animate-pulse rounded-xl bg-muted/10" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="h-8 animate-pulse rounded-lg bg-surface-container"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-175 w-full shrink-0 gap-6">
        <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-surface p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="h-10 w-52 animate-pulse rounded-xl bg-muted/10" />
            <div className="h-10 w-24 animate-pulse rounded-xl bg-muted/10" />
          </div>

          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col justify-between gap-3 rounded-2xl bg-surface-container p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="h-6 w-32 animate-pulse rounded-lg bg-muted/10" />
                  <div className="h-7 w-24 animate-pulse rounded-xl bg-muted/10" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="h-4 w-44 animate-pulse rounded-md bg-muted/10" />
                  <div className="h-5 w-20 animate-pulse rounded-lg bg-muted/10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6 rounded-3xl bg-surface p-6">
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
                  <div className="flex flex-col gap-1.5">
                    <div className="h-5 w-36 animate-pulse rounded-lg bg-muted/10" />
                    <div className="h-4 w-20 animate-pulse rounded-md bg-muted/10" />
                  </div>
                  <div className="h-5 w-20 animate-pulse rounded-lg bg-muted/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-2xl bg-surface-container p-4">
              <div className="h-6 w-20 animate-pulse rounded-lg bg-muted/10" />
              <div className="h-8 w-28 animate-pulse rounded-lg bg-muted/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 animate-pulse rounded-2xl bg-muted/10" />
              <div className="h-12 animate-pulse rounded-2xl bg-muted/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-4 rounded-3xl bg-surface p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="h-10 w-44 animate-pulse rounded-xl bg-muted/10" />
          <div className="h-10 w-24 animate-pulse rounded-xl bg-muted/10" />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 rounded-2xl bg-surface-container p-4"
            >
              <div className="size-16 shrink-0 animate-pulse rounded-2xl bg-muted/10" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="h-3.5 w-20 animate-pulse rounded-md bg-muted/10" />
                <div className="h-5 w-28 animate-pulse rounded-lg bg-muted/10" />
                <div className="h-4 w-16 animate-pulse rounded-md bg-muted/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}