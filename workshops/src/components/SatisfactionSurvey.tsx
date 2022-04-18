import { useLanguage } from '../context/LanguageContext';
import styles from './SatisfactionSurvey.module.css';

interface SatisfactionSurveyProps {
  show: boolean;
  onClose: () => void;
}

const GOOGLE_FORM_URL = 'https://forms.gle/3d6qFMMdfR8jbarn6';

export function SatisfactionSurvey({ show, onClose }: SatisfactionSurveyProps) {
  const { isPolish } = useLanguage();

  if (!show) return null;

  const handleOpenForm = () => {
    window.open(GOOGLE_FORM_URL, '_blank');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.icon}>🎓</span>
            <h3 className={styles.title}>
              {isPolish
                ? 'Podziel się opinią!'
                : 'Share Your Feedback!'}
            </h3>
            <p className={styles.subtitle}>
              {isPolish
                ? 'Twoja opinia pomoże nam ulepszyć przyszłe warsztaty'
                : 'Your feedback will help us improve future workshops'}
            </p>
          </div>

          <div className={styles.formInfo}>
            <p className={styles.formDescription}>
              {isPolish
                ? 'Wypełnienie ankiety zajmie tylko minutę. Odpowiesz na pytania dotyczące:'
                : "The survey takes just a minute. You'll answer questions about:"}
            </p>
            <ul className={styles.formTopics}>
              <li>{isPolish ? 'Ocena warsztatów' : 'Workshop rating'}</li>
              <li>{isPolish ? 'Ocena materiałów' : 'Materials rating'}</li>
              <li>{isPolish ? 'Ocena prowadzących' : 'Trainers rating'}</li>
              <li>{isPolish ? 'Dodatkowe uwagi' : 'Additional comments'}</li>
            </ul>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.skipButton}
              onClick={onClose}
            >
              {isPolish ? 'Może później' : 'Maybe Later'}
            </button>
            <button
              className={styles.submitButton}
              onClick={handleOpenForm}
            >
              {isPolish ? 'Otwórz ankietę' : 'Open Survey'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function checkSurveySubmitted(): boolean {
  // With Google Forms, we don't track submission locally
  // The form handles its own "already submitted" logic
  return false;
}
