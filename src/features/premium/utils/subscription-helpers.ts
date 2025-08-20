/**
 * Get display name for the current plan
 */
export const getPlanDisplayName = (currentPlanName: string | null | undefined): string => {
  return currentPlanName || "Free Plan";
};

/**
 * Check if user is on free plan
 */
export const isFreePlan = (currentPlanName: string | null | undefined): boolean => {
  return !currentPlanName;
};
