import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@rareimagery/api';
import { drupalClient } from '@rareimagery/api';
import { LoadingSpinner } from '@rareimagery/ui';
import { ProductForm } from '../components/ProductForm';
import type { ProductType } from '@rareimagery/types';

export function ProductEditPage() {
  const { productUuid } = useParams();
  const navigate = useNavigate();
  const isEdit = !!productUuid;

  // For edit mode, load existing product
  const { data: product, isLoading } = useProduct(
    'physical_pod', // TODO: determine type from product data
    productUuid ?? '',
  );

  if (isEdit && isLoading) {
    return <LoadingSpinner message="Loading product..." />;
  }

  const handleSubmit = async (data: {
    title: string;
    type: ProductType;
    status: boolean;
  }) => {
    if (isEdit && productUuid) {
      await drupalClient.patch(
        `/jsonapi/commerce-product/${data.type}/${productUuid}`,
        {
          data: {
            type: `commerce_product--${data.type}`,
            id: productUuid,
            attributes: {
              title: data.title,
              status: data.status,
            },
          },
        },
      );
    } else {
      await drupalClient.post(`/jsonapi/commerce-product/${data.type}`, {
        data: {
          type: `commerce_product--${data.type}`,
          attributes: {
            title: data.title,
            status: data.status,
          },
        },
      });
    }

    navigate('/dashboard/products');
  };

  return (
    <div>
      <h1>{isEdit ? 'Edit Product' : 'New Product'}</h1>
      <ProductForm
        defaultValues={
          product
            ? {
                title: product.title,
                type: product.type,
                status: product.status,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        isEdit={isEdit}
      />
    </div>
  );
}
