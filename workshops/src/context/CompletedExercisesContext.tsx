import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface CompletedExercisesContextType {
  completedExercises: Set<string>;
  markCompleted: (exerciseId: string) => void;
  isCompleted: (exerciseId: string) => boolean;
  clearAll: () => void;
  lastCompletedId: string | null;
  clearLastCompleted: () => void;
}

const STORAGE_KEY = 'myspot-workshop-completed';

const CompletedExercisesContext = createContext<CompletedExercisesContextType | null>(null);

export function CompletedExercisesProvider({ children }: { children: ReactNode }) {
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
    return new Set();
  });
  const [lastCompletedId, setLastCompletedId] = useState<string | null>(null);

  // Persist to localStorage whenever completedExercises changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedExercises]));
    } catch {
      // Ignore localStorage errors
    }
  }, [completedExercises]);

  const markCompleted = useCallback((exerciseId: string) => {
    setCompletedExercises((prev) => {
      if (prev.has(exerciseId)) {
        return prev; // Already completed, don't trigger popup
      }
      const next = new Set(prev);
      next.add(exerciseId);
      return next;
    });
    setLastCompletedId((prev) => {
      // Only set if not already completed
      if (!completedExercises.has(exerciseId)) {
        return exerciseId;
      }
      return prev;
    });
  }, [completedExercises]);

  const isCompleted = useCallback((exerciseId: string) => {
    return completedExercises.has(exerciseId);
  }, [completedExercises]);

  const clearAll = useCallback(() => {
    setCompletedExercises(new Set());
    setLastCompletedId(null);
  }, []);

  const clearLastCompleted = useCallback(() => {
    setLastCompletedId(null);
  }, []);

  return (
    <CompletedExercisesContext.Provider
      value={{ completedExercises, markCompleted, isCompleted, clearAll, lastCompletedId, clearLastCompleted }}
    >
      {children}
    </CompletedExercisesContext.Provider>
  );
}

export function useCompletedExercises() {
  const context = useContext(CompletedExercisesContext);
  if (!context) {
    throw new Error('useCompletedExercises must be used within a CompletedExercisesProvider');
  }
  return context;
}
