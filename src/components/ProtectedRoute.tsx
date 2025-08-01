import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'provider';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [userRole, setUserRole] = useState<'client' | 'provider' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await (supabase as any)
            .from('profiles')
            .select('user_type')
            .eq('user_id', user.id)
            .single();
          
          if (!error && profile) {
            setUserRole((profile.user_type as 'client' | 'provider') || 'client');
          } else {
            setUserRole('client');
          }
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          getUserRole();
        } else {
          setUserRole(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to auth
  if (!userRole) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to appropriate home
  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = userRole === 'client' ? '/client-home' : '/provider-home';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}