import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-site mx-auto px-4 text-center py-24">
      <h2 className="text-2xl font-bold mb-2">Page not found</h2>
      <p className="text-gray-500 mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Back to catalog
      </Link>
    </div>
  );
}
