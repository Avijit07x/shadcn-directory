export default function AdminLoading() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-6 pt-8 sm:pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-border pb-8 w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-48 bg-muted animate-pulse" />
            </div>
            <div className="h-4 w-72 bg-muted animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-border p-6">
              <div className="h-3 w-16 bg-muted animate-pulse mb-3" />
              <div className="h-8 w-12 bg-muted animate-pulse" />
            </div>
          ))}
        </div>

        <div className="border border-border bg-background shadow-sm">
          <div className="border-b border-border p-4 flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-muted animate-pulse" />
            ))}
          </div>
          <div className="divide-y divide-border">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="h-4 w-4 bg-muted animate-pulse" />
                <div className="h-10 w-16 bg-muted animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-48 bg-muted animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-muted animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse" />
                <div className="h-8 w-8 bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
