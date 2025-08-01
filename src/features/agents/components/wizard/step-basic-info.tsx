import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Sparkles, Zap } from "lucide-react";
import { type WizardState } from "../../hooks/use-agent-wizard";

interface StepBasicInfoProps {
  wizardState: WizardState;
  updateWizardState: (updates: Partial<WizardState>) => void;
}

export const StepBasicInfo = ({ wizardState, updateWizardState }: StepBasicInfoProps) => {
  return (
    <div className="w-full">
      <Card className="w-full mx-auto matrix-card border-primary/20 backdrop-blur-md">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative matrix-glow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center matrix-border">
                <Bot className="w-6 h-6 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold quantrix-gradient matrix-text-glow mb-2">
            Neural Agent Genesis
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Initialize your specialized AI companion with a distinctive neural signature
          </CardDescription>
          <div className="flex justify-center mt-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-sm px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Step 1 of 5
            </Badge>
          </div>
        </CardHeader>

        <Separator className="bg-primary/20 mb-6" />

        <CardContent className="space-y-6 pb-6">
          <div className="space-y-3">
            <Label htmlFor="agent-name" className="text-base font-semibold text-primary matrix-text-glow">
              Neural Designation
            </Label>
            <Input
              id="agent-name"
              type="text"
              placeholder="e.g., JavaScript Neural Mentor, IELTS Quantum Coach, Career Matrix Advisor..."
              value={wizardState.name}
              onChange={(e) => updateWizardState({ name: e.target.value })}
              className="text-base p-3 h-12 border-primary/30 focus:border-primary focus:ring-primary/50 bg-background/50 backdrop-blur-sm matrix-border transition-all duration-300"
            />
            <p className="text-sm text-muted-foreground">
              Define a unique identifier that reflects your agent's specialized neural pathways
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
              <div className="flex items-center mb-3">
                <Zap className="w-4 h-4 text-primary mr-2" />
                <h4 className="font-semibold text-primary">Neural Naming Protocol</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>Specify the agent's core intelligence domain</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>Include neural classification terms: "Mentor", "Coach", "Matrix", "Quantum"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>Reference the specialized knowledge substrate</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>Maintain professional designation standards</span>
                </li>
              </ul>
            </div>

            <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
              <div className="flex items-center mb-3">
                <Bot className="w-4 h-4 text-primary mr-2" />
                <h4 className="font-semibold text-primary">Example Neural Signatures</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">→</span>
                  <span>"React Neural Architect"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">→</span>
                  <span>"IELTS Quantum Strategist"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">→</span>
                  <span>"Leadership Matrix Guide"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">→</span>
                  <span>"Python Code Synthesizer"</span>
                </li>
              </ul>
            </div>
          </div>

          {wizardState.name && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg matrix-border animate-in fade-in duration-300">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                <h4 className="font-medium text-primary">Neural Signature Preview</h4>
              </div>
              <p className="text-lg font-semibold quantrix-gradient break-words">
                {wizardState.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Designation registered in neural network matrix
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 