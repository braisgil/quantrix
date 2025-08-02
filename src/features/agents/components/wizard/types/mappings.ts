import type { LucideIcon } from "lucide-react";

export type IconComponent = LucideIcon;

export interface IconMapping {
  [key: string]: IconComponent;
}

export interface ColorMapping {
  [key: string]: {
    selected: string;
    default: string;
    hover: string;
  };
}

export interface IconConfig {
  component: IconComponent;
  color: string;
}

export type IconResolver = (
  id: string, 
  name: string, 
  isSelected?: boolean
) => IconConfig;

export interface MappingRule {
  keywords: string[];
  icon: IconComponent;
  colorCategory: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}
