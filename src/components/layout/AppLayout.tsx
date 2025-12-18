import React from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, ChevronsUpDown, LifeBuoy } from "lucide-react";
import { useAuthStore } from "@/lib/mock-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
type AppLayoutProps = {
  children: React.ReactNode;
  className?: string;
};
export function AppLayout({ children, className }: AppLayoutProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const currentWorkspace = useAuthStore((state) => state.currentWorkspace);
  const workspaces = useAuthStore((state) => state.workspaces);
  const switchWorkspace = useAuthStore((state) => state.switchWorkspace);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={className}>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b-4 border-black bg-background px-4 sm:px-6">
          <SidebarTrigger className="border-2 border-black hover:bg-orange-50" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-between border-2 border-black font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {currentWorkspace?.name || "SELECT WORKSPACE"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[240px] border-2 border-black shadow-brutalist p-1">
              <DropdownMenuLabel className="uppercase font-black text-xs px-2 py-1.5">Workspaces</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black h-[2px]" />
              {workspaces.map(ws => (
                <DropdownMenuItem 
                  key={ws.id} 
                  onSelect={() => switchWorkspace(ws.id)}
                  className="uppercase font-bold text-xs focus:bg-orange-500 focus:text-white cursor-pointer"
                >
                  {ws.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              aria-label="Search"
              onFocus={() => setOpen(true)}
              onClick={() => setOpen(true)}
              placeholder="SEARCH (CMD+K)"
              className="w-full brutalist-input pl-10 md:w-[200px] lg:w-[320px] h-10 uppercase font-bold text-xs"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-orange-500 hover:text-white transition-all" 
            onClick={() => navigate('/app/help')}
          >
            <LifeBuoy className="h-5 w-5" />
          </Button>
        </header>
        <main className="flex-1 overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
          {children}
        </main>
        <Toaster richColors closeButton />
        <CommandDialog open={open} onOpenChange={setOpen}>
          <div className="border-4 border-black overflow-hidden">
            <CommandInput placeholder="TYPE A COMMAND..." className="uppercase font-bold border-b-2 border-black" />
            <CommandList>
              <CommandEmpty className="p-4 font-bold uppercase text-center">No results found.</CommandEmpty>
              <CommandGroup heading="SUGGESTIONS" className="p-2">
                <CommandItem className="uppercase font-bold cursor-pointer focus:bg-orange-500 focus:text-white">Dashboard</CommandItem>
                <CommandItem className="uppercase font-bold cursor-pointer focus:bg-orange-500 focus:text-white">Contacts</CommandItem>
                <CommandItem className="uppercase font-bold cursor-pointer focus:bg-orange-500 focus:text-white">Settings</CommandItem>
              </CommandGroup>
            </CommandList>
          </div>
        </CommandDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}