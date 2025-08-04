import { useRouter } from "next/navigation";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon, User } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { data, isPending } = authClient.useSession();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        }
      }
    })
  }

  if (isPending || !data?.user) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="matrix-card rounded-lg border border-primary/20 p-3 w-full flex items-center justify-between hover:matrix-border hover:matrix-glow transition-all duration-300 overflow-hidden gap-x-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
              <User className="size-4 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-medium truncate w-full text-foreground">
                {data.user.name}
              </p>
              <p className="text-xs truncate w-full text-muted-foreground">
                {data.user.email}
              </p>
            </div>
          </div>
          <ChevronDownIcon className="size-4 shrink-0 text-primary" />
        </DrawerTrigger>
        <DrawerContent className="matrix-card border-primary/20">
          <DrawerHeader>
            <DrawerTitle className="text-foreground">{data.user.name}</DrawerTitle>
            <DrawerDescription className="text-muted-foreground">{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="space-y-2">
            <Button
              variant="outline"
              className="matrix-border hover:matrix-glow hover:bg-primary/10 transition-all duration-300"
              // onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className="size-4 text-primary mr-2" />
              Neural Billing
            </Button>
            <Button
              variant="outline"
              className="matrix-border hover:matrix-glow hover:bg-primary/10 transition-all duration-300"
              onClick={onLogout}
            >
              <LogOutIcon className="size-4 text-primary mr-2" />
              Exit Matrix
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="matrix-card rounded-lg border border-primary/20 p-3 w-full flex items-center justify-between hover:matrix-border hover:matrix-glow transition-all duration-300 overflow-hidden gap-x-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg matrix-glow">
            <User className="size-4 text-primary" />
          </div>
          <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-medium truncate w-full text-foreground">
              {data.user.name}
            </p>
            <p className="text-xs truncate w-full text-muted-foreground">
              {data.user.email}
            </p>
          </div>
        </div>
        <ChevronDownIcon className="size-4 shrink-0 text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        side="right" 
        className="w-72 matrix-card border-primary/20 backdrop-blur-md"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate text-foreground">{data.user.name}</span>
            <span className="text-sm font-normal text-muted-foreground truncate">{data.user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/20" />
        <DropdownMenuItem
          // onClick={() => authClient.customer.portal()}
          className="cursor-pointer flex items-center justify-between hover:bg-primary/10 focus:bg-primary/10 transition-colors"
        >
          <span className="text-foreground">Neural Billing</span>
          <CreditCardIcon className="size-4 text-primary" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between hover:bg-primary/10 focus:bg-primary/10 transition-colors"
        >
          <span className="text-foreground">Exit Matrix</span>
          <LogOutIcon className="size-4 text-primary" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
