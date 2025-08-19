import React from "react";
import type { FeatureItemProps } from "../../types";

export const FeatureItem = ({ label, icon: Icon }: FeatureItemProps) => {
  return (
    <li className="flex items-center gap-3">
      <div className="rounded-md bg-primary/10 p-1.5">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span>{label}</span>
      </div>
    </li>
  );
};
