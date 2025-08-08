"use client";

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
import type { CallLobbyProps } from "../types";

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
    <div className="flex flex-col items-center justify-center h-screen matrix-bg p-3 sm:p-4">
      <Card className="matrix-card border-primary/20 backdrop-blur-md w-full max-w-md sm:max-w-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center gap-y-4 sm:gap-y-5">
            <div className="flex flex-col gap-y-1 text-center">
              <h2 className="text-lg sm:text-xl font-bold matrix-text-glow">Ready to join?</h2>
              <p className="text-sm text-muted-foreground">Set up your call before joining</p>
            </div>
            
            <div className="w-full stream-video-preview-wrapper">
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
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
              <Button asChild variant="outline" className="w-full sm:flex-1 order-2 sm:order-1 h-9 sm:h-10">
                <Link href="/conversations" className="inline-flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Link>
              </Button>
              <Button
                onClick={onJoin}
                className="w-full sm:flex-1 order-1 sm:order-2 h-9 sm:h-10"
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