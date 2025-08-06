"use client";

import dynamic from "next/dynamic";
import { CallSkeleton } from "./shared/call-skeleton";
import type { CallUIProps } from "../types";

// Dynamically import the entire call UI to prevent SSR issues
const CallUIComponent = dynamic(
  () => import("./call-ui").then((mod) => ({ default: mod.CallUI })),
  {
    ssr: false,
    loading: () => <CallSkeleton />,
  }
);

export const CallWrapper = (props: CallUIProps) => {
  return <CallUIComponent {...props} />;
};