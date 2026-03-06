interface ProductPageProps {
  params: Promise<{ handle: string; productUuid: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { handle, productUuid } = await params;

  return (
    <div className="max-w-site mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-2">Product Detail</h1>
      <p className="text-gray-500">
        Store: @{handle} | Product: {productUuid}
      </p>
      <p className="text-sm text-gray-400 mt-8">Coming soon.</p>
    </div>
  );
}
