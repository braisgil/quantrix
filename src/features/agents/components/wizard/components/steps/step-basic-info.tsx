import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Zap } from "lucide-react";
import { WizardLayout } from "../shared/wizard-layout";
import type { StepProps } from "../../types/wizard";
import { useSelectionState } from "../../hooks/use-selection-state";

export const StepBasicInfo = ({ wizardState, updateWizardState }: StepProps) => {
  const { updateName } = useSelectionState({ wizardState, updateWizardState });

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

        {/* Guidelines and Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Guidelines */}
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
          </div>

          {/* Examples */}
          <div className="matrix-card border-primary/10 p-4 rounded-lg bg-primary/5">
            <div className="flex items-center mb-3">
              <Bot className="w-4 h-4 text-primary mr-2" />
              <h4 className="font-semibold text-primary">Example Names</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
      </div>
    </WizardLayout>
  );
};
