import { useStore } from '../../../contexts/StoreContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { SocialLinks } from '../SocialLinks';

export function SocialLinksBlock() {
  const { store } = useStore();
  const { theme } = useTheme();

  if (!store || !theme) return null;

  return (
    <section className="creator-page__social-block">
      <h2 className="creator-page__section-title">Connect</h2>
      <SocialLinks theme={theme} handle={store.handle} />
    </section>
  );
}
