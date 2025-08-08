import Link from "next/link";
import { Home, Phone } from "lucide-react";
import {
  CallControls,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";

interface CallActiveProps {
  onLeave: () => void;
  conversationName: string;
}

export const CallActive = ({ onLeave, conversationName }: CallActiveProps) => {
  return (
    <div className="flex flex-col justify-between p-4 h-full matrix-bg">
      {/* Header */}
      <div className="matrix-card border-primary/20 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md">
        <Link 
          href="/" 
          className="flex items-center justify-center p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
          title="Go to homepage"
        >
          <Home className="h-5 w-5 text-primary" />
        </Link>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          <h4 className="text-lg font-semibold matrix-text-glow truncate">
            {conversationName}
          </h4>
        </div>
      </div>

      {/* Video Layout */}
      <div className="flex-1 py-4">
        <SpeakerLayout />
      </div>

      {/* Controls */}
      <div className="matrix-card border-primary/20 rounded-2xl px-4 backdrop-blur-md">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
