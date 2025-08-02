"use client";

import { useEffect, useState } from "react";
import { PanelLeftCloseIcon, PanelLeftIcon, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

import { DashboardCommand } from "../search-command";

export const Navbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [commandOpen, setCommandOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-6 gap-x-4 items-center py-4 border-b border-primary/20 bg-background/95 backdrop-blur-md">
        <Button 
          className="size-10 matrix-border hover:matrix-glow transition-all duration-300 hover:bg-primary/10" 
          variant="outline" 
          onClick={toggleSidebar}
        >
          {(state === "collapsed" || isMobile) 
            ?  <PanelLeftIcon className="size-4 text-primary" /> 
            : <PanelLeftCloseIcon className="size-4 text-primary" />
          }
        </Button>
        
        <Button
          className="h-10 w-[280px] justify-start font-normal text-muted-foreground hover:text-primary matrix-border hover:matrix-glow hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm"
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen((open) => !open)}
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="p-1 bg-primary/10 rounded">
              <Search className="size-4 text-primary" />
            </div>
            <span className="flex-1 text-left">Search companions...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2 font-mono text-[10px] font-medium text-primary">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </Button>
        
        {!isMobile && <div className="flex-1" />}
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleTheme}
            className="size-10 matrix-border hover:matrix-glow transition-all duration-300 hover:bg-primary/10"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-foreground" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-foreground" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </nav>
    </>
  );
};
