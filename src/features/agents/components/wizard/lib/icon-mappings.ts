import {
  // Education & Learning
  GraduationCap, Languages, Code, Calculator, Beaker, Target, BookOpen,
  // Business & Career
  Briefcase, TrendingUp, DollarSign, Users, Shield,
  // Health & Wellness
  Heart, Dumbbell, ChefHat,
  // Creative Arts
  Palette, Music, Camera, PenTool,
  // Home & Living
  Home, Hammer, TreePine,
  // Entertainment
  Gamepad2, MonitorPlay,
  // Science & Research
  Microscope, Lightbulb, Rocket, Award, Brain, Wrench,
  // Communication
  MessageSquare, Mic, FileText, Globe,
  // Others
  Star, Sparkles, Zap, Scale, Coffee
} from "lucide-react";

import type { IconComponent, MappingRule, IconResolver, IconConfig } from "../types/mappings";

// Define mapping rules with keywords for automatic icon selection
const ICON_MAPPING_RULES: MappingRule[] = [
  // Language & Communication
  { keywords: ["language", "communication", "english", "speaking", "writing"], icon: Languages, colorCategory: "blue" },
  { keywords: ["ielts", "toefl", "cambridge", "test", "exam", "certification"], icon: Award, colorCategory: "red" },
  { keywords: ["business english", "professional writing", "email"], icon: Briefcase, colorCategory: "blue" },
  { keywords: ["creative writing", "literature", "poetry"], icon: PenTool, colorCategory: "pink" },
  { keywords: ["public speaking", "presentation"], icon: Mic, colorCategory: "orange" },
  { keywords: ["conversation", "speaking"], icon: MessageSquare, colorCategory: "cyan" },
  { keywords: ["grammar", "pronunciation"], icon: Languages, colorCategory: "blue" },
  { keywords: ["writing", "email"], icon: FileText, colorCategory: "slate" },
  
  // Mathematics & Sciences
  { keywords: ["algebra", "calculus", "statistics", "math"], icon: Calculator, colorCategory: "purple" },
  { keywords: ["physics", "quantum"], icon: Lightbulb, colorCategory: "yellow" },
  { keywords: ["chemistry", "organic", "biochemistry"], icon: Beaker, colorCategory: "cyan" },
  { keywords: ["biology", "genetics", "ecology"], icon: Microscope, colorCategory: "green" },
  { keywords: ["astronomy", "astrophysics"], icon: Star, colorCategory: "indigo" },
  { keywords: ["engineering", "materials"], icon: Wrench, colorCategory: "orange" },
  
  // Programming & Technology
  { keywords: ["programming", "coding", "development"], icon: Code, colorCategory: "green" },
  { keywords: ["data", "analysis", "statistics"], icon: TrendingUp, colorCategory: "blue" },
  { keywords: ["artificial intelligence", "machine learning", "ai"], icon: Brain, colorCategory: "violet" },
  
  // Health & Fitness
  { keywords: ["strength training", "workout", "fitness"], icon: Dumbbell, colorCategory: "red" },
  { keywords: ["yoga", "pilates", "meditation", "wellness"], icon: Heart, colorCategory: "pink" },
  { keywords: ["nutrition", "diet", "meal"], icon: Heart, colorCategory: "green" },
  { keywords: ["cooking", "culinary", "recipe"], icon: ChefHat, colorCategory: "orange" },
  
  // Business & Finance
  { keywords: ["business", "entrepreneur", "startup"], icon: Briefcase, colorCategory: "blue" },
  { keywords: ["finance", "investment", "trading"], icon: DollarSign, colorCategory: "green" },
  { keywords: ["marketing", "sales", "brand"], icon: TrendingUp, colorCategory: "purple" },
  { keywords: ["leadership", "management", "team"], icon: Users, colorCategory: "amber" },
  
  // Home & Living
  { keywords: ["home", "house", "interior"], icon: Home, colorCategory: "blue" },
  { keywords: ["repair", "diy", "construction"], icon: Hammer, colorCategory: "orange" },
  { keywords: ["garden", "landscaping", "plant"], icon: TreePine, colorCategory: "green" },
  
  // Creative Arts
  { keywords: ["music", "instrument", "piano"], icon: Music, colorCategory: "purple" },
  { keywords: ["art", "painting", "drawing"], icon: Palette, colorCategory: "pink" },
  { keywords: ["design", "graphic", "ui"], icon: PenTool, colorCategory: "blue" },
  { keywords: ["photo", "camera", "video"], icon: Camera, colorCategory: "indigo" },
  
  // Entertainment & Gaming
  { keywords: ["game", "gaming", "esports"], icon: Gamepad2, colorCategory: "violet" },
  { keywords: ["streaming", "content", "media"], icon: MonitorPlay, colorCategory: "red" },
  
  // Legal & Research
  { keywords: ["legal", "law", "court"], icon: Scale, colorCategory: "indigo" },
  { keywords: ["research", "methodology", "analysis"], icon: Microscope, colorCategory: "cyan" },
  { keywords: ["ethics", "compliance", "safety"], icon: Shield, colorCategory: "green" },
  
  // Learning Levels
  { keywords: ["fundamental", "basic", "introduction"], icon: BookOpen, colorCategory: "emerald" },
  { keywords: ["advanced", "expert", "master"], icon: Rocket, colorCategory: "purple" },
  { keywords: ["practical", "application", "hands-on"], icon: Wrench, colorCategory: "orange" },
  { keywords: ["theory", "concept", "principle"], icon: Brain, colorCategory: "indigo" },
];

// Color schemes for different categories
const COLOR_SCHEMES = {
  blue: { selected: "text-blue-600", default: "text-blue-500", hover: "group-hover:text-blue-500" },
  green: { selected: "text-green-600", default: "text-green-500", hover: "group-hover:text-green-500" },
  purple: { selected: "text-purple-600", default: "text-purple-500", hover: "group-hover:text-purple-500" },
  red: { selected: "text-red-600", default: "text-red-500", hover: "group-hover:text-red-500" },
  yellow: { selected: "text-yellow-600", default: "text-yellow-500", hover: "group-hover:text-yellow-500" },
  pink: { selected: "text-pink-600", default: "text-pink-500", hover: "group-hover:text-pink-500" },
  indigo: { selected: "text-indigo-600", default: "text-indigo-500", hover: "group-hover:text-indigo-500" },
  cyan: { selected: "text-cyan-600", default: "text-cyan-500", hover: "group-hover:text-cyan-500" },
  orange: { selected: "text-orange-600", default: "text-orange-500", hover: "group-hover:text-orange-500" },
  emerald: { selected: "text-emerald-600", default: "text-emerald-500", hover: "group-hover:text-emerald-500" },
  violet: { selected: "text-violet-600", default: "text-violet-500", hover: "group-hover:text-violet-500" },
  amber: { selected: "text-amber-600", default: "text-amber-500", hover: "group-hover:text-amber-500" },
  slate: { selected: "text-slate-600", default: "text-slate-500", hover: "group-hover:text-slate-500" },
};

// Default fallback icons
const DEFAULT_ICONS = {
  category: GraduationCap,
  subcategory: BookOpen,
  specific: Lightbulb,
  rule: Users,
};

/**
 * Resolves icon and color based on content matching
 */
const resolveIconFromContent = (content: string): { icon: IconComponent; colorCategory: string } => {
  const contentLower = content.toLowerCase();
  
  for (const rule of ICON_MAPPING_RULES) {
    for (const keyword of rule.keywords) {
      if (contentLower.includes(keyword)) {
        return { icon: rule.icon, colorCategory: rule.colorCategory };
      }
    }
  }
  
  return { icon: DEFAULT_ICONS.subcategory, colorCategory: "slate" };
};

/**
 * Generic icon resolver for any content type
 */
export const createIconResolver = (defaultIcon: IconComponent = DEFAULT_ICONS.subcategory): IconResolver => {
  return (id: string, name: string, isSelected: boolean = false): IconConfig => {
    const { icon, colorCategory } = resolveIconFromContent(name);
    const colorScheme = COLOR_SCHEMES[colorCategory as keyof typeof COLOR_SCHEMES] || COLOR_SCHEMES.slate;
    
    return {
      component: icon,
      color: isSelected ? colorScheme.selected : `${colorScheme.default} ${colorScheme.hover}`
    };
  };
};

// Specific resolvers for different contexts
export const categoryIconResolver = createIconResolver(DEFAULT_ICONS.category);
export const subcategoryIconResolver = createIconResolver(DEFAULT_ICONS.subcategory);
export const specificOptionIconResolver = createIconResolver(DEFAULT_ICONS.specific);
export const customRuleIconResolver = createIconResolver(DEFAULT_ICONS.rule);

// Convenience function to get icon config
export const getIconConfig = (
  type: 'category' | 'subcategory' | 'specific' | 'rule',
  id: string,
  name: string,
  isSelected?: boolean
): IconConfig => {
  const resolvers = {
    category: categoryIconResolver,
    subcategory: subcategoryIconResolver,
    specific: specificOptionIconResolver,
    rule: customRuleIconResolver,
  };
  
  return resolvers[type](id, name, isSelected);
};

// Export specific icons for manual use
export const MANUAL_ICONS = {
  // Communication styles
  supportive: Heart,
  direct: Target,
  enthusiastic: Zap,
  analytical: Brain,
  collaborative: Users,
  professional: Shield,
  creative: Lightbulb,
  conversational: MessageSquare,
  // Learning approaches
  beginner: BookOpen,
  advanced: Rocket,
  theory: Brain,
  practical: Wrench,
  quick: Zap,
  comprehensive: Microscope,
  interactive: Users,
  visual: Camera,
};
