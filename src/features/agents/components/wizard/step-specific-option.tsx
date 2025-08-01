import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, CheckCircle2, Layers, Sparkles } from "lucide-react";
import { AGENT_CATEGORIES } from "@/constants/agent-categories";
import { type WizardState } from "../../hooks/use-agent-wizard";

interface StepSpecificOptionProps {
  wizardState: WizardState;
  updateWizardState: (updates: Partial<WizardState>) => void;
}

export const StepSpecificOption = ({ wizardState, updateWizardState }: StepSpecificOptionProps) => {
  if (!wizardState.category || !wizardState.subcategory || !wizardState.subSubcategory) return null;

  const categoryData = AGENT_CATEGORIES[wizardState.category];
  const subcategoryData = categoryData.subcategories[wizardState.subcategory];
  const subSubcategoryData = subcategoryData.subSubcategories[wizardState.subSubcategory];

  const handleOptionSelect = (option: string) => {
    updateWizardState({ specificOption: option });
  };

  return (
    <div className="w-full">
      <Card className="w-full mx-auto matrix-card border-primary/20 backdrop-blur-md">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative matrix-glow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center matrix-border">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold quantrix-gradient matrix-text-glow mb-2">
            Neural Specialization Matrix
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Activate your AI companion's core expertise within {subSubcategoryData.name}
          </CardDescription>
          <div className="flex justify-center mt-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-sm px-3 py-1">
              <Layers className="w-3 h-3 mr-1" />
              Step 4 of 5
            </Badge>
          </div>
        </CardHeader>

        <Separator className="bg-primary/20 mb-6" />

        <CardContent className="space-y-6 pb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-3 py-2 rounded-lg matrix-border">
              <span className="text-sm text-muted-foreground">Configuring neural pathways for:</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary break-words">
                {subSubcategoryData.name}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {subSubcategoryData.options.map((option, index) => (
              <Button
                key={option}
                variant="ghost"
                className={`h-auto p-0 transition-all duration-300 group ${
                  wizardState.specificOption === option 
                    ? "matrix-border matrix-glow bg-primary/10" 
                    : "border border-primary/10 hover:border-primary/30 hover:bg-primary/5"
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="p-4 sm:p-6 w-full text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        wizardState.specificOption === option 
                          ? "bg-primary/20 matrix-glow" 
                          : "bg-muted/50 group-hover:bg-primary/10"
                      }`}>
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          wizardState.specificOption === option ? "bg-primary animate-pulse" : "bg-muted-foreground"
                        }`} />
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full transition-all duration-300 ${
                        wizardState.specificOption === option
                          ? "bg-primary/20 text-primary"
                          : "bg-muted/20 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}>
                        #{String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                    {wizardState.specificOption === option && (
                      <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in duration-300 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <div className={`text-base sm:text-lg font-bold mb-2 transition-all duration-300 break-words ${
                      wizardState.specificOption === option 
                        ? "quantrix-gradient matrix-text-glow" 
                        : "text-foreground group-hover:text-primary"
                    }`}>
                      {option}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Specialized neural processing for {option.toLowerCase()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Sparkles className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Advanced AI specialization</span>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {wizardState.specificOption && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg matrix-border animate-in fade-in duration-500">
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                <h4 className="font-semibold text-primary matrix-text-glow">Neural Specialization Activated</h4>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-bold text-lg sm:text-xl quantrix-gradient mb-2 break-words">
                    {wizardState.specificOption}
                  </h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your AI companion will operate as an elite specialist in this domain, 
                    providing targeted, expert-level assistance with deep domain knowledge.
                  </p>
                  
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30 mr-2">
                      Expert Knowledge Base
                    </Badge>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30 mr-2">
                      Contextual Understanding
                    </Badge>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
                      Adaptive Learning
                    </Badge>
                  </div>
                </div>
                
                <div className="matrix-card border-primary/10 p-3 rounded-lg bg-primary/5">
                  <div className="flex items-center mb-2">
                    <Zap className="w-4 h-4 text-primary mr-2" />
                    <h6 className="font-medium text-primary">Neural Capabilities</h6>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>Deep expertise in {wizardState.specificOption.toLowerCase()}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>Context-aware problem solving</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>Personalized learning pathways</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>Real-time adaptive responses</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 