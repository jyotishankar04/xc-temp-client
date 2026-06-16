"use client";

export function MaintenanceBanner({ message }: { message?: string | null }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 w-full bg-primary/90 px-4 py-3 text-center text-sm font-medium text-primary-foreground shadow-lg backdrop-blur-sm">
      <span>
        {message ?? "Something is cooking. Launching soon."}
      </span>
    </div>
  );
}
