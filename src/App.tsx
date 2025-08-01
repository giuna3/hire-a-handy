import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import RoleSelection from "./pages/RoleSelection";
import Onboarding from "./pages/Onboarding";
import ClientHome from "./pages/ClientHome";
import ProviderHome from "./pages/ProviderHome";
import ClientMap from "./pages/ClientMap";
import NewJob from "./pages/NewJob";
import ClientBookings from "./pages/ClientBookings";
import SavedProviders from "./pages/SavedProviders";
import ClientProfile from "./pages/ClientProfile";
import ProviderMap from "./pages/ProviderMap";
import ProviderServices from "./pages/ProviderServices";
import JobRequests from "./pages/JobRequests";
import JobSchedule from "./pages/JobSchedule";
import ProviderProfile from "./pages/ProviderProfile";
import Earnings from "./pages/Earnings";
import ChatList from "./pages/ChatList";
import ChatDetail from "./pages/ChatDetail";
import ClientChatList from "./pages/ClientChatList";
import ClientChatDetail from "./pages/ClientChatDetail";
import RatingReview from "./pages/RatingReview";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import BookingPayment from "./pages/BookingPayment";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancelled from "./pages/BookingCancelled";
import JobListings from "./pages/JobListings";
import AvailableJobs from "./pages/AvailableJobs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen w-full">
          <AppSidebar />
          
          <main className="pt-16">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Client-only routes */}
              <Route path="/client-home" element={<ProtectedRoute requiredRole="client"><ClientHome /></ProtectedRoute>} />
              <Route path="/client-map" element={<ProtectedRoute requiredRole="client"><ClientMap /></ProtectedRoute>} />
              <Route path="/new-job" element={<ProtectedRoute requiredRole="client"><NewJob /></ProtectedRoute>} />
              <Route path="/client-bookings" element={<ProtectedRoute requiredRole="client"><ClientBookings /></ProtectedRoute>} />
              <Route path="/saved-providers" element={<ProtectedRoute requiredRole="client"><SavedProviders /></ProtectedRoute>} />
              <Route path="/client-profile/:id" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
              <Route path="/client-profile" element={<ProtectedRoute requiredRole="client"><ClientProfile /></ProtectedRoute>} />
              <Route path="/client-chat-list" element={<ProtectedRoute requiredRole="client"><ClientChatList /></ProtectedRoute>} />
              <Route path="/client-chat/:id" element={<ProtectedRoute requiredRole="client"><ClientChatDetail /></ProtectedRoute>} />
              <Route path="/job-listings" element={<ProtectedRoute requiredRole="client"><JobListings /></ProtectedRoute>} />
              
              {/* Provider-only routes */}
              <Route path="/provider-home" element={<ProtectedRoute requiredRole="provider"><ProviderHome /></ProtectedRoute>} />
              <Route path="/provider-services" element={<ProtectedRoute requiredRole="provider"><ProviderServices /></ProtectedRoute>} />
              <Route path="/provider-map" element={<ProtectedRoute requiredRole="provider"><ProviderMap /></ProtectedRoute>} />
              <Route path="/job-requests" element={<ProtectedRoute requiredRole="provider"><JobRequests /></ProtectedRoute>} />
              <Route path="/job-schedule" element={<ProtectedRoute requiredRole="provider"><JobSchedule /></ProtectedRoute>} />
              <Route path="/provider-profile/:id" element={<ProtectedRoute><ProviderProfile /></ProtectedRoute>} />
              <Route path="/provider-profile" element={<ProtectedRoute requiredRole="provider"><ProviderProfile /></ProtectedRoute>} />
              <Route path="/earnings" element={<ProtectedRoute requiredRole="provider"><Earnings /></ProtectedRoute>} />
              <Route path="/chat-list" element={<ProtectedRoute requiredRole="provider"><ChatList /></ProtectedRoute>} />
              <Route path="/chat/:id" element={<ProtectedRoute requiredRole="provider"><ChatDetail /></ProtectedRoute>} />
              <Route path="/available-jobs" element={<ProtectedRoute requiredRole="provider"><AvailableJobs /></ProtectedRoute>} />
              
              {/* Shared protected routes */}
              <Route path="/rating-review" element={<ProtectedRoute><RatingReview /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
              <Route path="/booking-payment" element={<ProtectedRoute><BookingPayment /></ProtectedRoute>} />
              <Route path="/booking-success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
              <Route path="/booking-cancelled" element={<ProtectedRoute><BookingCancelled /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
