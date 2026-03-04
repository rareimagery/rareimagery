import { useForm } from 'react-hook-form';
import type { ProductType } from '@rareimagery/types';

interface ProductFormData {
  title: string;
  type: ProductType;
  status: boolean;
}

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isEdit?: boolean;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isEdit = false,
}: ProductFormProps) {
  const { register, handleSubmit, formState } = useForm<ProductFormData>({
    defaultValues: {
      title: '',
      type: 'physical_pod',
      status: true,
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="dashboard__product-form"
    >
      <label>
        Product Title
        <input {...register('title', { required: true })} />
      </label>

      {!isEdit && (
        <label>
          Product Type
          <select {...register('type')}>
            <option value="physical_pod">Print on Demand</option>
            <option value="physical_custom">Custom / Handmade</option>
            <option value="digital_download">Digital Download</option>
          </select>
        </label>
      )}

      <label className="dashboard__checkbox">
        <input type="checkbox" {...register('status')} />
        Published
      </label>

      <button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting
          ? 'Saving...'
          : isEdit
            ? 'Update Product'
            : 'Create Product'}
      </button>
    </form>
  );
}
