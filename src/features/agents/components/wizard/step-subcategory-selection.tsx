import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Network, ArrowRight, CheckCircle2, Cpu } from "lucide-react";
import { AGENT_CATEGORIES } from "@/constants/agent-categories";
import { type WizardState } from "../../hooks/use-agent-wizard";

interface StepSubcategorySelectionProps {
  wizardState: WizardState;
  updateWizardState: (updates: Partial<WizardState>) => void;
}

export const StepSubcategorySelection = ({ wizardState, updateWizardState }: StepSubcategorySelectionProps) => {
  if (!wizardState.category) return null;

  const categoryData = AGENT_CATEGORIES[wizardState.category];
  const subcategoryData = wizardState.subcategory ? categoryData.subcategories[wizardState.subcategory] : null;

  const handleSubcategorySelect = (subcategoryId: string) => {
    updateWizardState({ 
      subcategory: subcategoryId,
      subSubcategory: null,
      specificOption: null
    });
  };

  const handleSubSubcategorySelect = (subSubcategoryId: string) => {
    updateWizardState({ 
      subSubcategory: subSubcategoryId,
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
                <Network className="w-6 h-6 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold quantrix-gradient matrix-text-glow mb-2">
            Neural Pathway Refinement
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Define the specific cognitive architecture within {categoryData.name}
          </CardDescription>
          <div className="flex justify-center mt-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-sm px-3 py-1">
              <Cpu className="w-3 h-3 mr-1" />
              Step 3 of 5
            </Badge>
          </div>
        </CardHeader>

        <Separator className="bg-primary/20 mb-6" />

        <CardContent className="space-y-8 pb-6">
          {/* Subcategory Selection */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-primary matrix-text-glow">Neural Focus Sector</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {Object.entries(categoryData.subcategories).map(([subcategoryId, subcategory]) => (
                <Button
                  key={subcategoryId}
                  variant="ghost"
                  className={`h-auto p-0 transition-all duration-300 group ${
                    wizardState.subcategory === subcategoryId 
                      ? "matrix-border matrix-glow bg-primary/10" 
                      : "border border-primary/10 hover:border-primary/30 hover:bg-primary/5"
                  }`}
                  onClick={() => handleSubcategorySelect(subcategoryId)}
                >
                  <div className="p-4 w-full text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        wizardState.subcategory === subcategoryId 
                          ? "bg-primary/20 matrix-glow" 
                          : "bg-muted/50 group-hover:bg-primary/10"
                      }`}>
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          wizardState.subcategory === subcategoryId ? "bg-primary animate-pulse" : "bg-muted-foreground"
                        }`} />
                      </div>
                      {wizardState.subcategory === subcategoryId && (
                        <CheckCircle2 className="w-4 h-4 text-primary animate-in zoom-in duration-300" />
                      )}
                    </div>
                    
                    <div>
                      <div className={`font-semibold transition-all duration-300 break-words ${
                        wizardState.subcategory === subcategoryId 
                          ? "quantrix-gradient matrix-text-glow" 
                          : "text-foreground group-hover:text-primary"
                      }`}>
                        {subcategory.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {subcategory.description}
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">
                      {Object.keys(subcategory.subSubcategories).length} specializations
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Sub-subcategory Selection */}
          {wizardState.subcategory && subcategoryData && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-primary matrix-text-glow">Cognitive Architecture</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {Object.entries(subcategoryData.subSubcategories).map(([subSubcategoryId, subSubcategory]) => (
                  <Button
                    key={subSubcategoryId}
                    variant="ghost"
                    className={`h-auto p-0 transition-all duration-300 group ${
                      wizardState.subSubcategory === subSubcategoryId 
                        ? "matrix-border matrix-glow bg-primary/10" 
                        : "border border-primary/10 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                    onClick={() => handleSubSubcategorySelect(subSubcategoryId)}
                  >
                    <div className="p-4 w-full text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          wizardState.subSubcategory === subSubcategoryId 
                            ? "bg-primary/20 matrix-glow" 
                            : "bg-muted/50 group-hover:bg-primary/10"
                        }`}>
                          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            wizardState.subSubcategory === subSubcategoryId ? "bg-primary animate-pulse" : "bg-muted-foreground"
                          }`} />
                        </div>
                        {wizardState.subSubcategory === subSubcategoryId && (
                          <CheckCircle2 className="w-4 h-4 text-primary animate-in zoom-in duration-300" />
                        )}
                      </div>
                      
                      <div>
                        <div className={`font-semibold transition-all duration-300 break-words ${
                          wizardState.subSubcategory === subSubcategoryId 
                            ? "quantrix-gradient matrix-text-glow" 
                            : "text-foreground group-hover:text-primary"
                        }`}>
                          {subSubcategory.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Advanced neural processing module
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="text-xs">
                        {subSubcategory.options.length} variants available
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Selection Summary */}
          {wizardState.subcategory && wizardState.subSubcategory && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg matrix-border animate-in fade-in duration-500">
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                <h4 className="font-semibold text-primary matrix-text-glow">Neural Architecture Defined</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
                    Domain
                  </Badge>
                  <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium break-words">{categoryData.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
                    Focus
                  </Badge>
                  <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium break-words">{categoryData.subcategories[wizardState.subcategory].name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
                    Architecture
                  </Badge>
                  <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium break-words">{categoryData.subcategories[wizardState.subcategory].subSubcategories[wizardState.subSubcategory].name}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 