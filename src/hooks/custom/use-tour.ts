import { useState, useEffect, useMemo, useRef } from "react";

const TOUR_STORAGE_PREFIX = "linkaiil_tour_completed_";
const DEFAULT_TOUR_KEY = "default";

const getInitialTourState = (tourKey: string) => {
  if (typeof window === "undefined") return { completed: true, open: false };
  const storageKey = `${TOUR_STORAGE_PREFIX}${tourKey}`;
  const tourCompleted = localStorage.getItem(storageKey);
  // If tourCompleted is null, it means first-time user (tour not completed)
  // If tourCompleted is "true", it means tour was completed
  return {
    completed: tourCompleted === "true",
    open: false,
  };
};

interface UseTourOptions {
  isAuthenticated?: boolean; // true if user is logged in (not anonymous)
  userId?: string; // user ID for user-specific tour keys (required for authenticated users)
  tourKey?: string; // unique key for page-specific tours
  autoStart?: boolean; // whether to auto-start the tour
  delay?: number; // delay before starting tour in ms
}

export const useTour = (options?: UseTourOptions) => {
  const {
    isAuthenticated = false,
    userId,
    tourKey = DEFAULT_TOUR_KEY,
    autoStart = true,
    delay = 100,
  } = options || {};

  // For authenticated users, use user-specific keys to ensure each user gets their own tour state
  // For anonymous users, use the tourKey as-is
  const finalTourKey =
    isAuthenticated && userId ? `${userId}_${tourKey}` : tourKey;

  const storageKey = `${TOUR_STORAGE_PREFIX}${finalTourKey}`;

  // Compute completed state from localStorage - this will update when finalTourKey changes
  const hasCompletedTour = useMemo(() => {
    if (typeof window === "undefined") return true;
    const tourCompleted = localStorage.getItem(storageKey);
    return tourCompleted === "true";
  }, [storageKey]);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const prevTourKeyRef = useRef(finalTourKey);

  useEffect(() => {
    // If tour key changed, close any open tour (user switched or context changed)
    if (prevTourKeyRef.current !== finalTourKey) {
      prevTourKeyRef.current = finalTourKey;
      setTimeout(() => {
        setIsTourOpen(false);
      }, 0);
    }

    // Auto-start tour only if:
    // 1. User is authenticated (signed in)
    // 2. Not completed yet
    // 3. Auto-start is enabled
    // 4. userId is available (for authenticated users) - wait for userId to be available
    const canStartTour = isAuthenticated
      ? !hasCompletedTour && autoStart && !!userId
      : !hasCompletedTour && autoStart;

    if (canStartTour) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [
    isAuthenticated,
    hasCompletedTour,
    autoStart,
    delay,
    userId,
    finalTourKey,
  ]);

  const startTour = () => {
    setIsTourOpen(true);
  };

  const completeTour = () => {
    localStorage.setItem(storageKey, "true");
    setIsTourOpen(false);
  };

  const skipTour = () => {
    localStorage.setItem(storageKey, "true");
    setIsTourOpen(false);
  };

  const resetTour = () => {
    localStorage.removeItem(storageKey);
    setIsTourOpen(true);
  };

  return {
    isTourOpen,
    hasCompletedTour,
    startTour,
    completeTour,
    skipTour,
    resetTour,
  };
};
