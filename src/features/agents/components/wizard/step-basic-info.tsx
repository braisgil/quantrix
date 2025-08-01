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
            Create Your Companion
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Give your AI assistant a meaningful name that reflects how you&apos;d like to work together
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
              Companion Name
            </Label>
            <Input
              id="agent-name"
              type="text"
              placeholder="e.g., Alex - My Programming Tutor, Sarah - IELTS Coach, Career Guide..."
              value={wizardState.name}
              onChange={(e) => updateWizardState({ name: e.target.value })}
              className="text-base p-3 h-12 border-primary/30 focus:border-primary focus:ring-primary/50 bg-background/50 backdrop-blur-sm matrix-border transition-all duration-300"
            />
            <p className="text-sm text-muted-foreground">
              Choose a name that feels personal and reflects the kind of help you&apos;re looking for
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
              <div className="flex items-center mb-3">
                <Zap className="w-4 h-4 text-primary mr-2" />
                <h4 className="font-semibold text-primary">Naming Guidelines</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>Choose something that feels personal and approachable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>Include the main area where you need help</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>Consider using a friendly human name or title</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>Make it something you&apos;ll be comfortable using regularly</span>
                </li>
              </ul>
            </div>

            <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
              <div className="flex items-center mb-3">
                <Bot className="w-4 h-4 text-primary mr-2" />
                <h4 className="font-semibold text-primary">Example Names</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">→</span>
                  <span>"Alex - My React Tutor"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">→</span>
                  <span>"Emma - IELTS Study Buddy"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">→</span>
                  <span>"Mike - Career Coach"</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">→</span>
                  <span>"Code Helper"</span>
                </li>
              </ul>
            </div>
          </div>

          {wizardState.name && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg matrix-border animate-in fade-in duration-300">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                <h4 className="font-medium text-primary">Name Preview</h4>
              </div>
              <p className="text-lg font-semibold quantrix-gradient break-words">
                {wizardState.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This is how your companion will be identified
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 