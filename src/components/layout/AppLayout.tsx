import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Search } from "lucide-react";
type AppLayoutProps = {
  children: React.ReactNode;
  className?: string;
};
export function AppLayout({ children, className }: AppLayoutProps): JSX.Element {
  const [open, setOpen] = React.useState(false)
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
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger />
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <CommandInput 
              onClick={() => setOpen(true)} 
              placeholder="Search..." 
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
        <Toaster richColors closeButton />
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Dashboard</CommandItem>
              <CommandItem>Contacts</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </SidebarInset>
    </SidebarProvider>
  );
}