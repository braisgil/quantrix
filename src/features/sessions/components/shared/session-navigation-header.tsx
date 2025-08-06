import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface SessionNavigationHeaderProps {
  onCancel?: () => void;
}

export const SessionNavigationHeader = ({ onCancel }: SessionNavigationHeaderProps) => {
  const router = useRouter();
  
  const handleBack = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/sessions");
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Sessions
      </Button>
    </div>
  );
};