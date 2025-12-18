import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Workflow, BarChart, Settings, LifeBuoy, LogOut, Mail, MessageSquare, FileText, Calendar, AreaChart, FolderKanban } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/mock-auth";
import { Button } from "./ui/button";
const navItems = [
  { href: "/app/dashboard", icon: Home, label: "Dashboard" },
  { href: "/app/inbox", icon: MessageSquare, label: "Inbox" },
  { href: "/app/contacts", icon: Users, label: "Contacts" },
  { href: "/app/pipeline", icon: BarChart, label: "Pipeline" },
  { href: "/app/calendar", icon: Calendar, label: "Calendar" },
  { href: "/app/projects", icon: FolderKanban, label: "Projects" },
  { href: "/app/campaigns", icon: Mail, label: "Campaigns" },
  { href: "/app/automations", icon: Workflow, label: "Automations" },
  { href: "/app/funnels", icon: FileText, label: "Funnels" },
  { href: "/app/reporting", icon: AreaChart, label: "Reporting" },
  { href: "/app/help", icon: LifeBuoy, label: "Support" },
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  return (
    <Sidebar className="border-r-4 border-black">
      <SidebarHeader className="p-4 border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-orange-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          <span className="text-2xl font-display font-black uppercase tracking-tighter">OrionHub</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname.startsWith(item.href)}
                  className="h-10 px-3 border-2 border-transparent data-[active=true]:border-black data-[active=true]:bg-orange-500 data-[active=true]:text-white hover:bg-orange-50 transition-all"
                >
                  <NavLink to={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" /> 
                    <span className="font-black uppercase text-xs tracking-widest">{item.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t-4 border-black bg-muted/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-orange-50 border-2 border-transparent hover:border-black">
              <NavLink to="/app/settings" className="flex items-center gap-3">
                <Settings className="h-5 w-5" /> 
                <span className="font-black uppercase text-xs tracking-widest">Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-4 p-3 border-2 border-black bg-white flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-8 w-8 border-2 border-black">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
              <AvatarFallback className="bg-black text-white font-bold">{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-black uppercase truncate">{user?.name}</span>
              <span className="text-[8px] font-mono truncate opacity-60">{user?.email}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 hover:bg-orange-500 hover:text-white">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}