import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, Target, CheckCircle2 } from "lucide-react";
import { AGENT_CATEGORIES } from "@/constants/agent-categories";
import { type WizardState, type AgentCategoryId } from "../../hooks/use-agent-wizard";

interface StepCategorySelectionProps {
  wizardState: WizardState;
  updateWizardState: (updates: Partial<WizardState>) => void;
}

export const StepCategorySelection = ({ wizardState, updateWizardState }: StepCategorySelectionProps) => {
  const handleCategorySelect = (categoryId: AgentCategoryId) => {
    updateWizardState({ 
      category: categoryId,
      subcategory: null,
      subSubcategory: null,
      specificOption: null
    });
  };

  return (
    <div className="w-full">
      <Card className="w-full mx-auto matrix-card border-primary/20 backdrop-blur-md">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative matrix-glow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center matrix-border">
                <Target className="w-6 h-6 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold quantrix-gradient matrix-text-glow mb-2">
            Choose Your Support Area
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Select the main area where you&apos;d like your AI companion to help you
          </CardDescription>
          <div className="flex justify-center mt-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-sm px-3 py-1">
              <Brain className="w-3 h-3 mr-1" />
              Step 2 of 5
            </Badge>
          </div>
        </CardHeader>

        <Separator className="bg-primary/20 mb-6" />

        <CardContent className="pb-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
            {Object.entries(AGENT_CATEGORIES).map(([categoryId, category]) => (
              <Button
                key={categoryId}
                variant="ghost"
                className={`h-auto p-0 transition-all duration-300 group ${
                  wizardState.category === categoryId 
                    ? "matrix-border matrix-glow bg-primary/10" 
                    : "border border-primary/10 hover:border-primary/30 hover:bg-primary/5"
                }`}
                onClick={() => handleCategorySelect(categoryId as AgentCategoryId)}
              >
                <div className="p-4 sm:p-6 w-full text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        wizardState.category === categoryId 
                          ? "bg-primary/20 matrix-glow" 
                          : "bg-muted/50 group-hover:bg-primary/10"
                      }`}>
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          wizardState.category === categoryId ? "bg-primary animate-pulse" : "bg-muted-foreground"
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-base sm:text-lg font-bold transition-all duration-300 break-words ${
                          wizardState.category === categoryId 
                            ? "quantrix-gradient matrix-text-glow" 
                            : "text-foreground group-hover:text-primary"
                        }`}>
                          {category.name}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </div>
                      </div>
                    </div>
                    {wizardState.category === categoryId && (
                      <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in duration-300 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Object.keys(category.subcategories).slice(0, 3).map((subcat) => (
                      <Badge
                        key={subcat}
                        variant="secondary"
                        className={`text-xs transition-all duration-300 ${
                          wizardState.category === categoryId
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        }`}
                      >
                        {category.subcategories[subcat].name}
                      </Badge>
                    ))}
                    {Object.keys(category.subcategories).length > 3 && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        +{Object.keys(category.subcategories).length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {wizardState.category && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg matrix-border animate-in fade-in duration-500">
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                <h4 className="font-semibold text-primary matrix-text-glow">Support Area Selected</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-base quantrix-gradient mb-2">
                    {AGENT_CATEGORIES[wizardState.category].name}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {AGENT_CATEGORIES[wizardState.category].description}
                  </p>
                </div>
                <div>
                  <h6 className="font-medium text-primary mb-2">Available Focus Areas:</h6>
                  <div className="flex flex-wrap gap-1">
                    {Object.values(AGENT_CATEGORIES[wizardState.category].subcategories).map((subcat, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-primary/5 text-primary border-primary/30"
                      >
                        {subcat.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 