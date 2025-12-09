"use client";

// Global error boundary for app router to avoid build-time _global-error crash
export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <div className="text-lg font-semibold">Something went wrong.</div>
          {error?.digest && (
            <p className="text-sm text-muted-foreground">Error digest: {error.digest}</p>
          )}
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-border"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
