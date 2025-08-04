import { AGENT_CATEGORIES } from '@/constants/agent-categories';
import type { AgentCategoryId } from '@/constants/agent-categories';

/**
 * Formats a dash-separated category name to proper case
 */
export const formatCategoryName = (category: string) => {
  return category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

/**
 * Gets the description for a given category
 */
export const getCategoryDescription = (categoryId: string): string => {
  const category = AGENT_CATEGORIES[categoryId as AgentCategoryId];
  return category?.description || '';
};

/**
 * Gets the description for a given subcategory within a category
 */
export const getSubcategoryDescription = (categoryId: string, subcategoryId: string): string => {
  const category = AGENT_CATEGORIES[categoryId as AgentCategoryId];
  const subcategories = category?.subcategories;
  if (!subcategories || !(subcategoryId in subcategories)) {
    return '';
  }
  return (subcategories as Record<string, { description?: string }>)[subcategoryId]?.description || '';
};

/**
 * Gets the formatted name for a sub-subcategory
 */
export const getSubSubcategoryName = (categoryId: string, subcategoryId: string, subSubcategoryId: string): string => {
  const category = AGENT_CATEGORIES[categoryId as AgentCategoryId];
  const subcategories = category?.subcategories as Record<string, { subSubcategories?: Record<string, { name?: string }> }> | undefined;
  
  if (!subcategories || !(subcategoryId in subcategories)) {
    return formatCategoryName(subSubcategoryId);
  }
  
  const subcategory = subcategories[subcategoryId];
  const subSubcategories = subcategory?.subSubcategories;
  
  if (!subSubcategories || !(subSubcategoryId in subSubcategories)) {
    return formatCategoryName(subSubcategoryId);
  }
  
  return (subSubcategories as Record<string, { name?: string }>)[subSubcategoryId]?.name || formatCategoryName(subSubcategoryId);
};

/**
 * Gets all subcategory names for a given category
 */
export const getSubcategoryNames = (categoryId: string): string[] => {
  const category = AGENT_CATEGORIES[categoryId as AgentCategoryId];
  if (!category?.subcategories) {
    return [];
  }
  return Object.values(category.subcategories).map(sub => sub.name);
};

/**
 * Validates if a category exists
 */
export const isValidCategory = (categoryId: string): boolean => {
  return categoryId in AGENT_CATEGORIES;
};

/**
 * Validates if a subcategory exists within a category
 */
export const isValidSubcategory = (categoryId: string, subcategoryId: string): boolean => {
  const category = AGENT_CATEGORIES[categoryId as AgentCategoryId];
  return !!(category?.subcategories && subcategoryId in category.subcategories);
};