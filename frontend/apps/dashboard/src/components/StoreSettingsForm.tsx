import { useForm } from 'react-hook-form';
import { drupalClient } from '@rareimagery/api';
import type { CreatorStore } from '@rareimagery/types';
import { useState } from 'react';

interface SettingsFormData {
  tagline: string;
  bio: string;
  about: string;
  brandColor: string;
}

interface StoreSettingsFormProps {
  store: CreatorStore;
}

export function StoreSettingsForm({ store }: StoreSettingsFormProps) {
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState } = useForm<SettingsFormData>({
    defaultValues: {
      tagline: store.tagline,
      bio: store.bio,
      about: store.about,
      brandColor: store.brandColor,
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setSaved(false);
    await drupalClient.patch(
      `/jsonapi/node/x_creator_store/${store.uuid}`,
      {
        data: {
          type: 'node--x_creator_store',
          id: store.uuid,
          attributes: {
            field_x_tagline: data.tagline,
            field_x_bio: data.bio,
            field_about: data.about,
            field_x_brand_color: data.brandColor,
          },
        },
      },
    );
    setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="dashboard__settings-form">
      <label>
        Tagline
        <input {...register('tagline')} />
      </label>

      <label>
        Bio
        <textarea {...register('bio')} rows={4} />
      </label>

      <label>
        About
        <textarea {...register('about')} rows={6} placeholder="Tell customers about your store..." />
      </label>

      <label>
        Brand Color
        <input {...register('brandColor')} type="color" />
      </label>

      <button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? 'Saving...' : 'Save Settings'}
      </button>

      {saved && <p className="dashboard__save-success">Settings saved!</p>}
    </form>
  );
}
