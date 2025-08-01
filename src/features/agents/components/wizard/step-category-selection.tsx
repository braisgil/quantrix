import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, CheckCircle2, GraduationCap, Gamepad2, Briefcase, Heart, Palette, Home, Microscope } from "lucide-react";
import { AGENT_CATEGORIES } from "@/constants/agent-categories";
import { type WizardState, type AgentCategoryId } from "../../hooks/use-agent-wizard";

interface StepCategorySelectionProps {
  wizardState: WizardState;
  updateWizardState: (updates: Partial<WizardState>) => void;
}

// Icon mapping for each category
const categoryIcons = {
  "learning-education": GraduationCap,
  "creative-arts": Palette,
  "professional-career": Briefcase,
  "health-wellness": Heart,
  "lifestyle-practical": Home,
  "entertainment-social": Gamepad2,
  "specialized-knowledge": Microscope,
} as const;

// Category-specific colors
const categoryColors = {
  "learning-education": {
    icon: "text-yellow-500", // Golden yellow
    iconHover: "group-hover:text-yellow-500",
    iconSelected: "text-yellow-600",
  },
  "creative-arts": {
    icon: "text-pink-500", // Pink/Magenta
    iconHover: "group-hover:text-pink-500",
    iconSelected: "text-pink-600",
  },
  "professional-career": {
    icon: "text-blue-500", // Blue
    iconHover: "group-hover:text-blue-500",
    iconSelected: "text-blue-600",
  },
  "health-wellness": {
    icon: "text-red-500", // Red
    iconHover: "group-hover:text-red-500",
    iconSelected: "text-red-600",
  },
  "lifestyle-practical": {
    icon: "text-green-500", // Green
    iconHover: "group-hover:text-green-500",
    iconSelected: "text-green-600",
  },
  "entertainment-social": {
    icon: "text-purple-500", // Purple
    iconHover: "group-hover:text-purple-500",
    iconSelected: "text-purple-600",
  },
  "specialized-knowledge": {
    icon: "text-indigo-500", // Indigo
    iconHover: "group-hover:text-indigo-500",
    iconSelected: "text-indigo-600",
  },
} as const;

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
        <CardHeader className="text-center pb-4">
          {/* Compact Header - Icon and Title Inline */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="relative matrix-glow">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center matrix-border">
                <Target className="w-3 h-3 text-black" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            </div>
            <CardTitle className="text-lg sm:text-xl font-bold quantrix-gradient matrix-text-glow">
              Choose Your Support Area
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Select the main area where you&apos;d like your AI companion to help you
          </CardDescription>
        </CardHeader>

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
                <div className="p-4 sm:p-6 w-full text-left space-y-3 relative">
                  <div className="flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        wizardState.category === categoryId 
                          ? "bg-gradient-to-br from-primary to-primary/80 matrix-glow matrix-border transform scale-105" 
                          : "bg-muted/30 group-hover:bg-primary/10 group-hover:scale-105"
                      }`}>
                        {(() => {
                          const IconComponent = categoryIcons[categoryId as keyof typeof categoryIcons];
                          const colors = categoryColors[categoryId as keyof typeof categoryColors];
                          return IconComponent ? (
                            <IconComponent 
                              className={`transition-all duration-500 ${
                                wizardState.category === categoryId 
                                  ? `!w-8 !h-8 ${colors.iconSelected}` 
                                  : `!w-7 !h-7 ${colors.icon} ${colors.iconHover}`
                              }`} 
                            />
                          ) : (
                            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              wizardState.category === categoryId ? "bg-primary animate-pulse" : "bg-muted-foreground"
                            }`} />
                          );
                        })()}
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
                  </div>
                  
                  {wizardState.category === categoryId && (
                    <CheckCircle2 className="absolute bottom-2 right-4 w-6 h-6 text-primary animate-in zoom-in duration-500 matrix-glow" />
                  )}
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Object.values(category.subcategories).slice(0, 3).map((subcat, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`text-xs transition-all duration-300 ${
                          wizardState.category === categoryId
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        }`}
                      >
                        {subcat.name}
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