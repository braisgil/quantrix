import Link from "next/link";
import { LogInIcon, ArrowLeft } from "lucide-react";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "@stream-io/video-react-sdk/dist/css/styles.css";

interface CallLobbyProps {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          //image: 
            //data?.user.image ??
            //generateAvatarUri({
              //seed: data?.user.name ?? "",
              //variant: "initials",
            //}),
        } as StreamVideoParticipant
      }
    />
  )
}

const AllowBrowserPermissions = () => {
  return (
    <div className="text-center p-4">
      <p className="text-sm text-muted-foreground">
        Please grant your browser permission to access your camera and microphone.
      </p>
    </div>
  );
};

export const CallLobby = ({ onJoin }: CallLobbyProps) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  return (
    <div className="flex flex-col items-center justify-center h-full matrix-bg p-4">
      <Card className="matrix-card border-primary/20 backdrop-blur-md max-w-lg w-full">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center gap-y-6">
            <div className="flex flex-col gap-y-2 text-center">
              <h2 className="text-2xl font-bold matrix-text-glow">Ready to join?</h2>
              <p className="text-muted-foreground">Set up your call before joining</p>
            </div>
            
            <div className="w-full max-w-sm">
              <VideoPreview
                DisabledVideoPreview={
                  hasBrowserMediaPermission
                    ? DisabledVideoPreview
                    : AllowBrowserPermissions 
                }
              />
            </div>
            
            <div className="flex gap-x-3">
              <ToggleAudioPreviewButton />
              <ToggleVideoPreviewButton />
            </div>
            
            <div className="flex gap-x-3 justify-between w-full">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/conversations" className="inline-flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Link>
              </Button>
              <Button
                onClick={onJoin}
                className="flex-1"
                disabled={!hasBrowserMediaPermission}
              >
                <LogInIcon className="h-4 w-4 mr-2" />
                Join Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}