import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function SkeletonRows({ count, className }: { count: number; className?: string }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonBlock key={index} className={className} />
      ))}
    </>
  );
}

export function CommandCenterPageSkeleton() {
  return (
    <main className="h-svh overflow-hidden bg-[linear-gradient(135deg,oklch(0.985_0.006_247),oklch(0.955_0.015_240))] p-0 text-foreground lg:p-5">
      <div className="workspace-shadow relative grid h-full overflow-hidden border bg-card lg:grid-cols-[72px_minmax(0,1fr)] lg:rounded-xl">
        <aside className="hidden min-h-0 flex-col items-center gap-3 bg-sidebar px-2 py-5 lg:flex">
          <SkeletonBlock className="mb-4 size-10 bg-white/80" />
          <SkeletonRows count={4} className="size-12 bg-white/15" />
          <div className="flex-1" />
          <SkeletonBlock className="size-10 rounded-full bg-white/15" />
        </aside>
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-background">
          <header className="grid min-h-16 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b bg-card px-3 lg:min-h-19.5 lg:grid-cols-[minmax(220px,1fr)_minmax(260px,360px)_auto] lg:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <SkeletonBlock className="size-10 lg:hidden" />
              <SkeletonBlock className="hidden h-7 w-40 sm:block" />
              <SkeletonBlock className="h-6 w-52" />
            </div>
            <SkeletonBlock className="hidden h-9 lg:block" />
            <div className="flex items-center gap-2">
              <SkeletonBlock className="size-9" />
              <SkeletonBlock className="hidden h-9 w-24 md:block" />
            </div>
          </header>
          <section className="shrink-0 border-b bg-card px-3 py-3 lg:px-5">
            <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex overflow-hidden rounded-md border">
                  <SkeletonRows count={3} className="h-9 w-28 rounded-none" />
                </div>
                <SkeletonBlock className="h-4 w-48" />
              </div>
              <SkeletonBlock className="h-9 w-64" />
            </div>
          </section>
          <div className="grid min-h-0 flex-1 bg-card lg:grid-cols-[260px_minmax(430px,1fr)_minmax(320px,380px)] xl:grid-cols-[280px_minmax(520px,1fr)_390px]">
            <ProjectNavSkeleton />
            <WorkspaceMainSkeleton />
            <DetailPanelSkeleton />
          </div>
        </section>
      </div>
    </main>
  );
}

export function ProjectNavSkeleton() {
  return (
    <aside className="scrollbar-thin hidden min-h-0 overflow-auto border-r bg-muted/40 p-3 lg:block">
      <div className="mb-3 flex items-center justify-between px-2">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="size-7" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-2">
            <SkeletonBlock className="h-9 w-full" />
            <div className="ml-4 space-y-1 border-l pl-3">
              <SkeletonBlock className="h-8 w-11/12" />
              <SkeletonBlock className="h-8 w-9/12" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between px-2">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="size-7" />
      </div>
      <div className="mt-2 space-y-1">
        <SkeletonRows count={3} className="h-9 w-full" />
      </div>
    </aside>
  );
}

export function WorkspaceMainSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <section className="shrink-0 border-b bg-card px-4 py-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-4 w-48" />
          </div>
          <SkeletonBlock className="h-9 w-20" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          <SkeletonRows count={3} className="h-24 min-w-56 flex-1" />
        </div>
      </section>
      <div className="flex shrink-0 gap-1 border-b bg-card px-3 py-2">
        <SkeletonRows count={6} className="h-9 w-24" />
      </div>
      <section className="min-h-0 flex-1 overflow-hidden p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="h-7 w-64" />
          </div>
          <SkeletonBlock className="h-9 w-28" />
        </div>
        <div className="space-y-3">
          <SkeletonBlock className="h-11 w-full" />
          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="grid grid-cols-4 gap-3 border-b p-3">
              <SkeletonRows count={4} className="h-4" />
            </div>
            <div className="space-y-3 p-3">
              <SkeletonRows count={6} className="h-12" />
            </div>
          </div>
        </div>
      </section>
      <div className="mx-3 mb-3 grid shrink-0 grid-cols-[minmax(0,1fr)_38px_38px_44px] gap-2 rounded-xl border bg-card/95 p-3 shadow-[0_18px_60px_rgb(15_23_42/0.22)] lg:mx-4">
        <SkeletonBlock className="col-span-4 h-7" />
        <SkeletonBlock className="h-9" />
        <SkeletonBlock className="size-9" />
        <SkeletonBlock className="size-9" />
        <SkeletonBlock className="size-9" />
      </div>
    </div>
  );
}

export function DetailPanelSkeleton() {
  return (
    <aside className="scrollbar-thin hidden min-h-0 overflow-auto bg-muted/35 p-4 lg:block">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="h-4 w-44" />
        </div>
        <SkeletonBlock className="h-9 w-20" />
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <SkeletonRows count={4} className="h-28" />
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="mb-4 flex items-start gap-3">
          <SkeletonBlock className="size-10" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-6 w-full" />
          </div>
        </div>
        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-10/12" />
          <SkeletonBlock className="h-20 w-full" />
        </div>
      </div>
    </aside>
  );
}

export function CategoryTablePageSkeleton() {
  return (
    <section className="scrollbar-thin min-h-0 overflow-auto bg-background p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-7 w-72" />
        </div>
        <SkeletonBlock className="h-9 w-28" />
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <SkeletonRows count={4} className="h-28" />
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border bg-card">
        <div className="grid grid-cols-5 gap-3 border-b p-3">
          <SkeletonRows count={5} className="h-4" />
        </div>
        <div className="space-y-3 p-3">
          <SkeletonRows count={8} className="h-12" />
        </div>
      </div>
    </section>
  );
}
