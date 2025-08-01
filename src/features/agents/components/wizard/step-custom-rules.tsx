import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, CheckCircle2, Users, BookOpen, Sparkles } from "lucide-react";
import { CUSTOM_RULE_OPTIONS } from "@/constants/agent-categories";
import { type WizardState } from "../../hooks/use-agent-wizard";

interface StepCustomRulesProps {
  wizardState: WizardState;
  updateWizardState: (updates: Partial<WizardState>) => void;
}

export const StepCustomRules = ({ wizardState, updateWizardState }: StepCustomRulesProps) => {
  const handleRule1Select = (ruleId: string) => {
    updateWizardState({ customRule1: ruleId });
  };

  const handleRule2Select = (ruleId: string) => {
    updateWizardState({ customRule2: ruleId });
  };

  const getSelectedRule1 = () => {
    return CUSTOM_RULE_OPTIONS.interaction_style.options.find(opt => opt.id === wizardState.customRule1);
  };

  const getSelectedRule2 = () => {
    return CUSTOM_RULE_OPTIONS.content_focus.options.find(opt => opt.id === wizardState.customRule2);
  };

  return (
    <div className="w-full">
      <Card className="w-full mx-auto matrix-card border-primary/20 backdrop-blur-md">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative matrix-glow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center matrix-border">
                <Settings className="w-6 h-6 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold quantrix-gradient matrix-text-glow mb-2">
            Neural Personality Matrix
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Configure your AI companion's behavioral patterns and cognitive approach
          </CardDescription>
          <div className="flex justify-center mt-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-sm px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Final Step: 5 of 5
            </Badge>
          </div>
        </CardHeader>

        <Separator className="bg-primary/20 mb-6" />

        <CardContent className="space-y-8 pb-6">
          {/* Interaction Style */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-primary matrix-text-glow">
                  {CUSTOM_RULE_OPTIONS.interaction_style.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {CUSTOM_RULE_OPTIONS.interaction_style.description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {CUSTOM_RULE_OPTIONS.interaction_style.options.map((option) => (
                <Button
                  key={option.id}
                  variant="ghost"
                  className={`h-auto p-0 transition-all duration-300 group ${
                    wizardState.customRule1 === option.id 
                      ? "matrix-border matrix-glow bg-primary/10" 
                      : "border border-primary/10 hover:border-primary/30 hover:bg-primary/5"
                  }`}
                  onClick={() => handleRule1Select(option.id)}
                >
                  <div className="p-4 w-full text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        wizardState.customRule1 === option.id 
                          ? "bg-primary/20 matrix-glow" 
                          : "bg-muted/50 group-hover:bg-primary/10"
                      }`}>
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          wizardState.customRule1 === option.id ? "bg-primary animate-pulse" : "bg-muted-foreground"
                        }`} />
                      </div>
                      {wizardState.customRule1 === option.id && (
                        <CheckCircle2 className="w-4 h-4 text-primary animate-in zoom-in duration-300 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <div className={`font-semibold mb-1 transition-all duration-300 break-words ${
                        wizardState.customRule1 === option.id 
                          ? "quantrix-gradient matrix-text-glow" 
                          : "text-foreground group-hover:text-primary"
                      }`}>
                        {option.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Content Focus */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-primary matrix-text-glow">
                  {CUSTOM_RULE_OPTIONS.content_focus.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {CUSTOM_RULE_OPTIONS.content_focus.description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {CUSTOM_RULE_OPTIONS.content_focus.options.map((option) => (
                <Button
                  key={option.id}
                  variant="ghost"
                  className={`h-auto p-0 transition-all duration-300 group ${
                    wizardState.customRule2 === option.id 
                      ? "matrix-border matrix-glow bg-primary/10" 
                      : "border border-primary/10 hover:border-primary/30 hover:bg-primary/5"
                  }`}
                  onClick={() => handleRule2Select(option.id)}
                >
                  <div className="p-4 w-full text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        wizardState.customRule2 === option.id 
                          ? "bg-primary/20 matrix-glow" 
                          : "bg-muted/50 group-hover:bg-primary/10"
                      }`}>
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          wizardState.customRule2 === option.id ? "bg-primary animate-pulse" : "bg-muted-foreground"
                        }`} />
                      </div>
                      {wizardState.customRule2 === option.id && (
                        <CheckCircle2 className="w-4 h-4 text-primary animate-in zoom-in duration-300 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <div className={`font-semibold mb-1 transition-all duration-300 break-words ${
                        wizardState.customRule2 === option.id 
                          ? "quantrix-gradient matrix-text-glow" 
                          : "text-foreground group-hover:text-primary"
                      }`}>
                        {option.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {wizardState.customRule1 && wizardState.customRule2 && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg matrix-border animate-in fade-in duration-500">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                <h4 className="font-bold text-base sm:text-lg text-primary matrix-text-glow">Neural Personality Configuration Complete</h4>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-primary mb-2">Interaction Protocol</h5>
                    <div className="p-3 bg-primary/5 rounded-lg matrix-border">
                      <div className="font-medium quantrix-gradient text-base break-words">
                        {getSelectedRule1()?.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {getSelectedRule1()?.description}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-primary mb-2">Learning Methodology</h5>
                    <div className="p-3 bg-primary/5 rounded-lg matrix-border">
                      <div className="font-medium quantrix-gradient text-base break-words">
                        {getSelectedRule2()?.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {getSelectedRule2()?.description}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
                  <div className="flex items-center mb-3">
                    <Sparkles className="w-4 h-4 text-primary mr-2" />
                    <h6 className="font-semibold text-primary">Personality Matrix Features</h6>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>Consistent behavioral patterns across all interactions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>Adaptive communication style based on context</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>Optimized learning approach for your preferences</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>Seamless integration with specialized knowledge base</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg border border-primary/30">
                <div className="flex items-center justify-center space-x-2 text-center">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
                  <span className="text-sm font-medium text-primary">
                    Your AI companion is ready for neural initialization
                  </span>
                  <Sparkles className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 