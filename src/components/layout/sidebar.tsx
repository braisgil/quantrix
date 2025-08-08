"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Code, 
  Bot, 
  Zap,
  LayoutDashboard,
  FolderOpen,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DashboardTrial } from "../../features/dashboard/components/dashboard-trial";
import { DashboardUserButton } from "../user-button";

const neuralSections = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/overview",
  },
  {
    icon: Bot,
    label: "Agents",
    href: "/agents",
  },
  {
    icon: FolderOpen,
    label: "Sessions",
    href: "/sessions",
  },
];

const quantumSections = [
  {
    icon: Zap,
    label: "Upgrade",
    href: "/upgrade",
  },
];

// Custom Link component that closes mobile sidebar on click
const MobileAwareLink = ({ href, children, className, ...props }: React.ComponentProps<typeof Link>) => {
  const { setOpenMobile } = useSidebar();
  
  const handleClick = () => {
    // Close mobile sidebar when link is clicked
    setOpenMobile(false);
  };

  return (
    <Link href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </Link>
  );
};

export const SidebarCustom = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-primary/20 bg-background/95 backdrop-blur-md">
      <SidebarHeader className="text-sidebar-accent-foreground p-4">
        <MobileAwareLink href="/" className="flex items-center space-x-3">
          <div className="relative matrix-glow">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center matrix-border">
              <Code className="w-6 h-6 text-black" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          </div>
          <span className="text-2xl font-bold quantrix-gradient matrix-text-glow">
            Quantrix
          </span>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
            BETA
          </Badge>
        </MobileAwareLink>
      </SidebarHeader>
      
      <div className="px-4">
        <Separator className="bg-primary/20" />
      </div>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {neuralSections.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-12 mx-2 mb-1 rounded-lg transition-all duration-300 hover:matrix-border hover:bg-primary/10 border border-transparent",
                      pathname === item.href && "matrix-border bg-primary/10 matrix-glow"
                    )}
                    isActive={pathname === item.href}
                  >
                    <MobileAwareLink href={item.href} className="flex items-center space-x-3 p-3">
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        pathname === item.href 
                          ? "bg-primary/20 matrix-glow" 
                          : "bg-muted/50 hover:bg-primary/10"
                      )}>
                        <item.icon className={cn(
                          "size-5 transition-colors",
                          pathname === item.href ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <span className={cn(
                        "text-sm font-medium tracking-tight transition-colors",
                        pathname === item.href 
                          ? "text-primary matrix-text-glow" 
                          : "text-foreground"
                      )}>
                        {item.label}
                      </span>
                    </MobileAwareLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="px-4 py-2">
          <Separator className="bg-primary/20" />
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {quantumSections.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-12 mx-2 mb-1 rounded-lg transition-all duration-300 hover:matrix-border hover:bg-primary/10 border border-transparent",
                      pathname === item.href && "matrix-border bg-primary/10 matrix-glow"
                    )}
                    isActive={pathname === item.href}
                  >
                    <MobileAwareLink href={item.href} className="flex items-center space-x-3 p-3">
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        pathname === item.href 
                          ? "bg-primary/20 matrix-glow" 
                          : "bg-muted/50 hover:bg-primary/10"
                      )}>
                        <item.icon className={cn(
                          "size-5 transition-colors",
                          pathname === item.href ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <span className={cn(
                        "text-sm font-medium tracking-tight transition-colors",
                        pathname === item.href 
                          ? "text-primary matrix-text-glow" 
                          : "text-foreground"
                      )}>
                        {item.label}
                      </span>
                    </MobileAwareLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 space-y-4">
        <DashboardTrial />
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};