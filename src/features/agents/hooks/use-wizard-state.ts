import { useState, useCallback } from 'react';

interface UseWizardStateReturn {
  showWizard: boolean;
  openWizard: () => void;
  closeWizard: () => void;
}

/**
 * Hook for managing wizard visibility state
 * Follows the established pattern for state management
 */
export const useWizardState = (): UseWizardStateReturn => {
  const [showWizard, setShowWizard] = useState(false);

  const openWizard = useCallback(() => {
    setShowWizard(true);
  }, []);

  const closeWizard = useCallback(() => {
    setShowWizard(false);
  }, []);

  return {
    showWizard,
    openWizard,
    closeWizard,
  };
};