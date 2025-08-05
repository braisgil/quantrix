import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Zap } from "lucide-react";
import { WizardLayout } from "../shared/wizard-layout";
import type { StepProps } from "../../types/wizard";
import { useSelectionState } from "../../hooks/use-selection-state";

export const StepBasicInfo = ({ wizardState, updateWizardState }: StepProps) => {
  const { updateName, updateDescription } = useSelectionState({ wizardState, updateWizardState });

  return (
    <WizardLayout
      title="Create Your Companion"
      description="Give your AI assistant a meaningful name that reflects how you'd like to work together"
      icon={Bot}
    >
      <div className="space-y-6">
        {/* Name Input Section */}
        <div className="space-y-3">
          <Label htmlFor="agent-name" className="text-base font-semibold text-primary matrix-text-glow">
            Companion Name
          </Label>
          <Input
            id="agent-name"
            type="text"
            placeholder="e.g., Alex - My Programming Tutor, Sarah - IELTS Coach, Career Guide..."
            value={wizardState.name}
            onChange={(e) => updateName(e.target.value)}
            className="text-base p-3 h-12 border-primary/30 focus:border-primary focus:ring-primary/50 bg-background/50 backdrop-blur-sm matrix-border transition-all duration-300"
          />
          <p className="text-sm text-muted-foreground">
            Choose a name that feels personal and reflects the kind of help you&apos;re looking for
          </p>
        </div>

        {/* Description Input Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="agent-description" className="text-base font-semibold text-primary matrix-text-glow">
              Agent Purpose
            </Label>
            <span className={`text-xs ${wizardState.description.length > 70 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {wizardState.description.length}/70
            </span>
          </div>
            <Input
              id="agent-description"
              type="text"
              placeholder="Define the specific purpose this AI companion serves..."
              value={wizardState.description}
              onChange={(e) => updateDescription(e.target.value)}
              maxLength={70}
              className="text-base p-3 h-12 border-primary/30 focus:border-primary focus:ring-primary/50 bg-background/50 backdrop-blur-sm matrix-border transition-all duration-300"
            />
            <p className="text-sm text-muted-foreground">
              Define their purpose clearly - this appears in your agent list to help you identify your companions
            </p>
        </div>

        {/* Guidelines and Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Side - Naming Guidelines */}
          <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
            <div className="flex items-center mb-3">
              <Zap className="w-4 h-4 text-primary mr-2" />
              <h4 className="font-semibold text-primary">Naming Guidelines</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Choose something that feels personal and approachable",
                "Include the main area where you need help",
                "Consider using a friendly human name or title",
                "Make it something you'll be comfortable using regularly"
              ].map((guideline, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 p-3 bg-background/30 rounded border border-primary/20">
              <h5 className="font-medium text-primary mb-2">Example Names:</h5>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {[
                  "Alex - My React Tutor",
                  "Emma - IELTS Study Buddy",
                  "Mike - Career Coach",
                  "Code Helper"
                ].map((example, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">→</span>
                    <span>&quot;{example}&quot;</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side - Description Guidelines */}
          <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
            <div className="flex items-center mb-3">
              <Zap className="w-4 h-4 text-primary mr-2" />
              <h4 className="font-semibold text-primary">Description Guidelines</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Define the specific purpose this agent serves",
                "Focus on what problems or tasks they'll help solve",
                "Use action words to describe their core function",
                "Keep it concise but clear and specific"
              ].map((guideline, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 p-3 bg-background/30 rounded border border-primary/20">
              <h5 className="font-medium text-primary mb-2">Example Descriptions:</h5>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {[
                  "Solves React development problems and debugging issues",
                  "Prepares students for IELTS exams with targeted practice",
                  "Guides career transitions and interview success",
                  "Teaches programming concepts through code review"
                ].map((example, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">→</span>
                    <span>&quot;{example}&quot;</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
};
