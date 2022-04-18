import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import styles from './Header.module.css';

export function Header() {
  const { isPolish } = useLanguage();

  const title = isPolish ? 'Modular Monolith Workshop' : 'Modular Monolith Workshop';
  const subtitle = isPolish
    ? 'Interaktywne ćwiczenia do opanowania architektury modularnego monolitu z .NET'
    : 'Interactive exercises to master modular monolith architecture with .NET';

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <img
            src="https://devmentors.io/wp-content/uploads/2024/12/logo-dark.png"
            alt="DevMentors"
            className={styles.logo}
          />
          <div className={styles.languageToggleWrapper}>
            <LanguageToggle />
          </div>
        </div>
        <h1 className={styles.title}>
          <span className={styles.emoji}>🗂️</span>
          <span className={styles.gradient}>{title}</span>
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </header>
  );
}
