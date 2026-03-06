import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Store',
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create Your Store
        </h1>
        <p className="text-gray-500 mt-2">
          Import your X profile and start selling in minutes
        </p>
      </header>
      {children}
    </div>
  );
}
