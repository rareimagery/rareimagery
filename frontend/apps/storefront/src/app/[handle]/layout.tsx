import { Suspense } from 'react';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12 text-gray-400">
          Loading store...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
