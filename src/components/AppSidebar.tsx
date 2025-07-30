import { Home, User, Calendar, MapPin, MessageCircle, Bell, Settings, HelpCircle, Star, Briefcase, DollarSign, Heart, Search, ClipboardList } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// Mock user role - in real app this would come from auth context
const getUserRole = () => {
  // Simple logic based on current path - in real app use proper auth
  return window.location.pathname.includes('provider') ? 'provider' : 'client';
};

const clientItems = [
  { title: "Home", url: "/client-home", icon: Home },
  { title: "Find Providers", url: "/client-map", icon: Search },
  { title: "My Bookings", url: "/client-bookings", icon: Calendar },
  { title: "Saved Providers", url: "/saved-providers", icon: Heart },
  { title: "Messages", url: "/chat-list", icon: MessageCircle },
  { title: "Profile", url: "/client-profile", icon: User },
];

const providerItems = [
  { title: "Home", url: "/provider-home", icon: Home },
  { title: "Find Jobs", url: "/provider-map", icon: MapPin },
  { title: "Job Requests", url: "/job-requests", icon: ClipboardList },
  { title: "My Schedule", url: "/job-schedule", icon: Calendar },
  { title: "Earnings", url: "/earnings", icon: DollarSign },
  { title: "Messages", url: "/chat-list", icon: MessageCircle },
  { title: "Profile", url: "/provider-profile", icon: User },
];

const commonItems = [
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useTranslation();
  const currentPath = location.pathname;
  const userRole = getUserRole();

  const mainItems = userRole === 'provider' ? providerItems : clientItems;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50";

  // Don't show sidebar on auth/welcome pages
  if (currentPath === '/' || currentPath === '/welcome' || currentPath === '/role-selection' || currentPath === '/auth' || currentPath === '/onboarding') {
    return null;
  }

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent className="p-2">
        <div className="mb-4 px-3 py-2">
          <h2 className={`font-bold text-lg transition-opacity duration-200 ${state === 'collapsed' ? 'opacity-0 sr-only' : 'opacity-100'}`}>
            SkillConnect
          </h2>
          {state === 'collapsed' && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              SC
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={state === 'collapsed' ? 'sr-only' : 'block'}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls({ isActive })}
                      title={state === 'collapsed' ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state === 'expanded' && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={state === 'collapsed' ? 'sr-only' : 'block'}>
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls({ isActive })}
                      title={state === 'collapsed' ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state === 'expanded' && <span className="ml-2">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}