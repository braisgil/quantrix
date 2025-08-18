import { AGENT_CATEGORIES, type AgentCategoryId } from "../../../constants/agent-categories";

type CategoryType = typeof AGENT_CATEGORIES[keyof typeof AGENT_CATEGORIES];
type SubcategoryType = { 
  name: string; 
  description: string; 
  subSubcategories?: Record<string, SubSubcategoryType> 
};
type SubSubcategoryType = { 
  name: string; 
  options?: string[] 
};

export interface CategorySearchResult {
  categoryId: AgentCategoryId;
  category: CategoryType;
  relevantBadges: string[];
  matchType: 'category' | 'subcategory' | 'subSubcategory' | 'option';
  matchedTerms: string[];
}

/**
 * Searches through the entire AGENT_CATEGORIES structure and returns categories that contain the search term
 * @param searchTerm - The term to search for
 * @returns Array of CategorySearchResult objects
 */
export function searchCategories(searchTerm: string): CategorySearchResult[] {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return Object.entries(AGENT_CATEGORIES).map(([categoryId, category]) => ({
      categoryId: categoryId as AgentCategoryId,
      category,
      relevantBadges: Object.values(category.subcategories).map(sub => (sub as SubcategoryType).name),
      matchType: 'category' as const,
      matchedTerms: []
    }));
  }

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  const results: CategorySearchResult[] = [];

  for (const [categoryId, category] of Object.entries(AGENT_CATEGORIES)) {
    const typedCategory = category as CategoryType;
    const relevantBadges: string[] = [];
    const matchedTerms: string[] = [];
    let matchType: CategorySearchResult['matchType'] = 'category';

    // Check if category name or description matches
    const categoryMatches = 
      typedCategory.name.toLowerCase().includes(normalizedSearchTerm) ||
      typedCategory.description.toLowerCase().includes(normalizedSearchTerm);

    if (categoryMatches) {
      relevantBadges.push(...Object.values(typedCategory.subcategories).map(sub => (sub as SubcategoryType).name));
      if (typedCategory.name.toLowerCase().includes(normalizedSearchTerm)) {
        matchedTerms.push(typedCategory.name);
      }
      results.push({
        categoryId: categoryId as AgentCategoryId,
        category: typedCategory,
        relevantBadges,
        matchType: 'category',
        matchedTerms
      });
      continue;
    }

    // Check subcategories
    for (const [_subcategoryId, subcategory] of Object.entries(typedCategory.subcategories)) {
      const typedSubcategory = subcategory as SubcategoryType;
      const subcategoryMatches = 
        typedSubcategory.name.toLowerCase().includes(normalizedSearchTerm) ||
        typedSubcategory.description.toLowerCase().includes(normalizedSearchTerm);

      if (subcategoryMatches) {
        relevantBadges.push(typedSubcategory.name);
        if (typedSubcategory.name.toLowerCase().includes(normalizedSearchTerm)) {
          matchedTerms.push(typedSubcategory.name);
        }
        matchType = 'subcategory';
      }

      // Check subSubcategories
      if (typedSubcategory.subSubcategories) {
        for (const [_subSubcategoryId, subSubcategory] of Object.entries(typedSubcategory.subSubcategories)) {
          const typedSubSubcategory = subSubcategory as SubSubcategoryType;
          const subSubcategoryMatches = 
            typedSubSubcategory.name?.toLowerCase().includes(normalizedSearchTerm);

          if (subSubcategoryMatches) {
            relevantBadges.push(typedSubSubcategory.name);
            if (!matchedTerms.includes(typedSubSubcategory.name)) {
              matchedTerms.push(typedSubSubcategory.name);
            }
            matchType = 'subSubcategory';
          }

          // Check options within subSubcategories
          if (typedSubSubcategory.options) {
            for (const option of typedSubSubcategory.options) {
              if (option.toLowerCase().includes(normalizedSearchTerm)) {
                relevantBadges.push(typedSubSubcategory.name);
                if (!matchedTerms.includes(option)) {
                  matchedTerms.push(option);
                }
                matchType = 'option';
              }
            }
          }
        }
      }
    }

    // If we found matches in this category, add it to results
    if (relevantBadges.length > 0 && matchedTerms.length > 0) {
      // Remove duplicates and limit badges
      const uniqueBadges = Array.from(new Set(relevantBadges));
      results.push({
        categoryId: categoryId as AgentCategoryId,
        category: typedCategory,
        relevantBadges: uniqueBadges,
        matchType,
        matchedTerms: Array.from(new Set(matchedTerms))
      });
    }
  }

  // Sort results by relevance (category matches first, then subcategory, etc.)
  return results.sort((a, b) => {
    const matchTypeOrder = { category: 0, subcategory: 1, subSubcategory: 2, option: 3 };
    return matchTypeOrder[a.matchType] - matchTypeOrder[b.matchType];
  });
}

/**
 * Highlights search terms in text
 * @param text - The text to highlight
 * @param searchTerm - The term to highlight
 * @returns Text with highlighted portions
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  const regex = new RegExp(`(${normalizedSearchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-primary/20 text-primary">$1</mark>');
}

/**
 * Gets search match summary for display
 * @param result - CategorySearchResult
 * @returns Human-readable description of what matched
 */
export function getSearchMatchSummary(result: CategorySearchResult, searchTerm: string): string {
  const { matchType, matchedTerms } = result;
  
  switch (matchType) {
    case 'category':
      return `Category matches "${searchTerm}"`;
    case 'subcategory':
      return `Contains: ${matchedTerms.slice(0, 2).join(', ')}${matchedTerms.length > 2 ? ` +${matchedTerms.length - 2} more` : ''}`;
    case 'subSubcategory':
      return `Contains: ${matchedTerms.slice(0, 2).join(', ')}${matchedTerms.length > 2 ? ` +${matchedTerms.length - 2} more` : ''}`;
    case 'option':
      return `Has options like: ${matchedTerms.slice(0, 2).join(', ')}${matchedTerms.length > 2 ? ` +${matchedTerms.length - 2} more` : ''}`;
    default:
      return 'Relevant match found';
  }
}
