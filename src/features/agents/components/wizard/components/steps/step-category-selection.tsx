import { Target, Search } from "lucide-react";
import { WizardLayout } from "../shared/wizard-layout";
import { SelectionGrid } from "../shared/selection-grid";
import { OptionCard } from "../shared/option-card";
import { Input } from "@/components/ui/input";
import type { StepProps } from "../../types/wizard";
import { useSelectionState } from "../../hooks/use-selection-state";
import { categoryIconResolver } from "../../lib/icon-mappings";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { getSearchMatchSummary, CategorySearchResult, searchCategories } from "@/features/agents/utils/category-search";

  // Import search functions and types


export const StepCategorySelection = ({ wizardState, updateWizardState }: StepProps) => {
  const { selectCategory, isSelected } = useSelectionState({ wizardState, updateWizardState });
  const { search, debouncedSearch, setSearch, isSearching } = useDebouncedSearch();

  // Get search results or all categories if no search
  const searchResults = searchCategories(debouncedSearch);
  
  return (
    <WizardLayout
      title="Choose Your Support Area"
      description="Select the main area where you'd like your AI companion to help you"
      icon={Target}
    >
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center border border-border/60 rounded-lg bg-gradient-to-r from-background/95 via-primary/5 to-background/95 backdrop-blur-sm px-4 py-3 transition-all duration-300 hover:border-primary/30 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
            <div className="flex items-center space-x-3 flex-1">
              {isSearching ? (
                <div className="relative">
                  <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-0 h-5 w-5 rounded-full bg-primary/20 animate-ping" />
                </div>
              ) : (
                <Search className="h-5 w-5 text-primary drop-shadow-sm" />
              )}
              <Input
                type="text"
                placeholder="Search categories, topics, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 focus:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground text-base transition-all duration-200 focus:placeholder:text-muted-foreground/60 flex-1 shadow-none focus-visible:border-transparent focus-visible:ring-0"
                style={{ 
                  outline: 'none',
                  '--tw-ring-shadow': 'none',
                  boxShadow: 'none'
                } as React.CSSProperties & Record<`--${string}`, string>}
              />
            </div>
          </div>
        </div>

        {/* Search Results Count */}
        {debouncedSearch && (
          <div className="text-sm text-muted-foreground">
            {searchResults.length === 0 
              ? `No categories found for "${debouncedSearch}"` 
              : `Found ${searchResults.length} ${searchResults.length === 1 ? 'category' : 'categories'} matching "${debouncedSearch}"`
            }
          </div>
        )}

        {/* Category Selection Grid */}
        <SelectionGrid columns="2">
          {searchResults.map((result: CategorySearchResult) => {
            const { categoryId, category, relevantBadges } = result;
            const selected = isSelected.category(categoryId);
            const iconConfig = categoryIconResolver(categoryId, category.name, selected);
            
            // Use relevantBadges from search results, or all subcategories if no search
            const badgesToShow = debouncedSearch 
              ? relevantBadges.slice(0, 4) // Limit to prevent overcrowding
              : Object.values(category.subcategories).map(sub => (sub as { name: string }).name);

            // Add search match summary as additional context if searching
            const enhancedDescription = debouncedSearch
              ? `${category.description}\n\n✨ ${getSearchMatchSummary(result, debouncedSearch)}`
              : category.description;

            return (
              <OptionCard
                key={categoryId}
                id={categoryId}
                name={category.name}
                description={enhancedDescription}
                isSelected={selected}
                onClick={() => selectCategory(categoryId)}
                icon={iconConfig.component}
                iconColor={iconConfig.color}
                badges={badgesToShow}
              />
            );
          })}
        </SelectionGrid>

        {/* No Results State */}
        {searchResults.length === 0 && debouncedSearch && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try searching with different keywords like &ldquo;learning&rdquo;, &ldquo;creative&rdquo;, &ldquo;health&rdquo;, or &ldquo;business&rdquo;.
            </p>
          </div>
        )}
      </div>
    </WizardLayout>
  );
};
