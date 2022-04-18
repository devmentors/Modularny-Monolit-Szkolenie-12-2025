import { useState, useEffect } from 'react';
import type { Exercise } from './types/Exercise';
import { exercises } from './data/exercises';
import { LanguageProvider } from './context/LanguageContext';
import { CompletedExercisesProvider, useCompletedExercises } from './context/CompletedExercisesContext';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseDetail } from './components/ExerciseDetail';
import { EmptyState } from './components/EmptyState';
import { SuccessPopup } from './components/SuccessPopup';
import { SatisfactionSurvey, checkSurveySubmitted } from './components/SatisfactionSurvey';
import './styles/global.css';

function AppContent() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const { completedExercises, lastCompletedId, clearLastCompleted } = useCompletedExercises();

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  // Show success popup when an exercise is completed
  useEffect(() => {
    if (lastCompletedId) {
      setShowSuccessPopup(true);
    }
  }, [lastCompletedId]);

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    clearLastCompleted();

    // Check if all exercises are completed and survey not yet submitted
    if (completedExercises.size === exercises.length && !checkSurveySubmitted()) {
      // Small delay before showing survey
      setTimeout(() => setShowSurvey(true), 500);
    }
  };

  return (
    <>
      <Header />
      <Layout
        sidebar={
          <ExerciseList
            exercises={exercises}
            selectedId={selectedExercise?.id}
            onSelect={handleSelectExercise}
            onSurveyClick={() => setShowSurvey(true)}
          />
        }
      >
        {selectedExercise ? (
          <ExerciseDetail exercise={selectedExercise} />
        ) : (
          <EmptyState />
        )}
      </Layout>

      <SuccessPopup show={showSuccessPopup} onClose={handleCloseSuccessPopup} />
      <SatisfactionSurvey show={showSurvey} onClose={() => setShowSurvey(false)} />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <CompletedExercisesProvider>
        <AppContent />
      </CompletedExercisesProvider>
    </LanguageProvider>
  );
}

export default App;
