import { useTheme } from '../../../contexts/ThemeContext';

export function AboutMe() {
  const { theme } = useTheme();

  if (!theme?.aboutMeHtml) return null;

  return (
    <section className="creator-page__about-me">
      <h2 className="creator-page__section-title">About Me</h2>
      <div
        className="creator-page__about-me-content"
        dangerouslySetInnerHTML={{ __html: theme.aboutMeHtml }}
      />
    </section>
  );
}
