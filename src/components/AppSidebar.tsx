import { Home, User, Calendar, MapPin, MessageCircle, Bell, Settings, HelpCircle, Star, Briefcase, DollarSign, Heart, Search, ClipboardList, Menu, X, Plus, Package } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const clientItems = [
  { title: "navigation.home", url: "/client-home", icon: Home },
  { title: "navigation.findProviders", url: "/client-map", icon: Search },
  { title: "navigation.createJobListing", url: "/new-job", icon: Plus },
  { title: "navigation.myBookings", url: "/client-bookings", icon: Calendar },
  { title: "navigation.savedProviders", url: "/saved-providers", icon: Heart },
  { title: "navigation.messages", url: "/client-chat-list", icon: MessageCircle },
  { title: "navigation.profile", url: "/client-profile", icon: User },
];

const providerItems = [
  { title: "navigation.home", url: "/provider-home", icon: Home },
  { title: "navigation.myServices", url: "/provider-services", icon: Package },
  { title: "navigation.findJobs", url: "/provider-map", icon: MapPin },
  { title: "navigation.jobRequests", url: "/job-requests", icon: ClipboardList },
  { title: "navigation.mySchedule", url: "/job-schedule", icon: Calendar },
  { title: "navigation.earnings", url: "/earnings", icon: DollarSign },
  { title: "navigation.messages", url: "/chat-list", icon: MessageCircle },
  { title: "navigation.profile", url: "/provider-profile", icon: User },
];

const commonItems = [
  { title: "navigation.notifications", url: "/notifications", icon: Bell },
  { title: "navigation.settings", url: "/settings", icon: Settings },
  { title: "navigation.helpSupport", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<'client' | 'provider' | null>(null);
  const location = useLocation();
  const { t } = useTranslation();
  const currentPath = location.pathname;

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Use any to bypass the empty types issue
          const { data: profile, error } = await (supabase as any)
            .from('profiles')
            .select('user_type')
            .eq('user_id', user.id)
            .single();
          
          if (!error && profile) {
            setUserRole((profile.user_type as 'client' | 'provider') || 'client');
          } else {
            setUserRole('client'); // Default to client if no profile found
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('client'); // Default to client on error
      }
    };

    getUserRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          getUserRole();
        } else {
          setUserRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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
              <SheetTitle>{t('navigation.navigationTitle')}</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">{t('navigation.mainNavigation')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {mainItems.map((item) => (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${getNavCls({ isActive })}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{t(item.title)}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Account */}
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">{t('navigation.account')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {commonItems.map((item) => (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg transition-colors ${getNavCls({ isActive })}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{t(item.title)}</span>
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