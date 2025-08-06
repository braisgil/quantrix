import { useState } from "react";
import { MessageSquare, Calendar, Clock, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { WizardLayout } from "../shared/wizard-layout";
import type { StepProps } from "../../types/wizard";

interface ExtendedStepProps extends StepProps {
  sessionId: string;
  sessionName: string;
  agentId: string;
}

export const StepConversationDetailsSession = ({ 
  wizardState, 
  updateWizardState,
  sessionName
}: ExtendedStepProps) => {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [hour, setHour] = useState(wizardState.scheduledTime ? wizardState.scheduledTime.split(':')[0] : '');
  const [minute, setMinute] = useState(wizardState.scheduledTime ? wizardState.scheduledTime.split(':')[1] : '');

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateWizardState({ scheduledDate: date });
      setIsDatePopoverOpen(false);
    }
  };

  const handleTimeChange = (newHour: string, newMinute: string) => {
    setHour(newHour);
    setMinute(newMinute);
    
    if (newHour && newMinute) {
      const timeString = `${newHour.padStart(2, '0')}:${newMinute.padStart(2, '0')}`;
      updateWizardState({ scheduledTime: timeString });
    }
  };

  return (
    <WizardLayout
      title="Conversation Details"
      description="Set up your conversation within this session"
      icon={MessageSquare}
    >
      <div className="space-y-6">
        {/* Session Info */}
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <FolderOpen className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Session:</span>
            <span className="font-medium">{sessionName}</span>
          </div>
        </div>

        {/* Conversation Name */}
        <div className="space-y-2">
          <Label htmlFor="conversation-name" className="text-sm font-medium text-primary">
            Conversation Name
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10">
              <MessageSquare className="w-4 h-4 text-primary" strokeWidth={2} />
            </div>
            <Input
              id="conversation-name"
              type="text"
              placeholder="e.g., Phrasal Verbs Practice"
              value={wizardState.name}
              onChange={(e) => updateWizardState({ name: e.target.value })}
              className="pl-10 matrix-border bg-background/50 backdrop-blur-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Give your conversation a descriptive name related to the session topic
          </p>
        </div>

        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">
              Scheduled Date
            </Label>
            <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal matrix-border bg-background/50 backdrop-blur-sm hover:bg-accent/50"
                >
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  {wizardState.scheduledDate ? (
                    format(wizardState.scheduledDate, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 matrix-card border-primary/20 backdrop-blur-md" align="start">
                <CalendarComponent
                  mode="single"
                  selected={wizardState.scheduledDate || undefined}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="matrix-border bg-background/50 backdrop-blur-sm"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">
              Scheduled Time
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10">
                  <Clock className="w-4 h-4 text-primary" strokeWidth={2} />
                </div>
                <Input
                  type="number"
                  placeholder="00"
                  min="0"
                  max="23"
                  value={hour}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 23)) {
                      handleTimeChange(value, minute);
                    }
                  }}
                  className="pl-10 text-center matrix-border bg-background/50 backdrop-blur-sm"
                />
              </div>
              <span className="text-lg font-medium text-primary">:</span>
              <div className="relative flex-1">
                <Input
                  type="number"
                  placeholder="00"
                  min="0"
                  max="59"
                  value={minute}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
                      handleTimeChange(hour, value);
                    }
                  }}
                  className="text-center matrix-border bg-background/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">24-hour format (00:00 - 23:59)</p>
          </div>
        </div>

        {/* Preview Section */}
        {(wizardState.name || wizardState.scheduledDate) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-3">Conversation Preview</h4>
            <div className="space-y-2 text-sm">
              {wizardState.name && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span><strong>Name:</strong> {wizardState.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-primary" />
                <span><strong>Session:</strong> {sessionName}</span>
              </div>
              {wizardState.scheduledDate && wizardState.scheduledTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    <strong>Scheduled:</strong> {format(wizardState.scheduledDate, "PPP")} at {wizardState.scheduledTime}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </WizardLayout>
  );
};