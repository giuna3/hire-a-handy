import { Home, User, Calendar, MapPin, MessageCircle, Bell, Settings, HelpCircle, Star, Briefcase, DollarSign, Heart, Search, ClipboardList, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const currentPath = location.pathname;
  const userRole = getUserRole();

  const mainItems = userRole === 'provider' ? providerItems : clientItems;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50";

  // Don't show navigation on auth/welcome pages
  if (currentPath === '/' || currentPath === '/welcome' || currentPath === '/role-selection' || currentPath === '/auth' || currentPath === '/onboarding') {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="font-bold text-lg">SkillConnect</h1>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="w-full h-auto max-h-[80vh] overflow-y-auto">
            <SheetHeader className="pb-4">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">Main Navigation</h3>
                <div className="grid grid-cols-2 gap-2">
                  {mainItems.map((item) => (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${getNavCls({ isActive })}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Account */}
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">Account</h3>
                <div className="grid grid-cols-2 gap-2">
                  {commonItems.map((item) => (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${getNavCls({ isActive })}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}