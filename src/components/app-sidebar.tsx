import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Workflow, BarChart, Settings, LifeBuoy, LogOut, Mail, MessageSquare, FileText, Calendar } from "lucide-react";
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
  { href: "/app/campaigns", icon: Mail, label: "Campaigns" },
  { href: "/app/automations", icon: Workflow, label: "Automations" },
  { href: "/app/funnels", icon: FileText, label: "Funnels & Pages" },
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500" />
          <span className="text-xl font-bold font-display">OrionHub</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={location.pathname.startsWith(item.href)}>
                  <NavLink to={item.href}>
                    <item.icon className="h-5 w-5" /> <span>{item.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/app/support"><LifeBuoy className="h-5 w-5" /> <span>Support</span></NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/app/settings"><Settings className="h-5 w-5" /> <span>Settings</span></NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="border-t border-border my-4" />
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
              <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{user?.name}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}