import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import JobRequests from "./pages/JobRequests";
import JobSchedule from "./pages/JobSchedule";
import ProviderProfile from "./pages/ProviderProfile";
import Earnings from "./pages/Earnings";
import ChatList from "./pages/ChatList";
import ChatDetail from "./pages/ChatDetail";
import RatingReview from "./pages/RatingReview";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/client-home" element={<ClientHome />} />
          <Route path="/client-map" element={<ClientMap />} />
          <Route path="/new-job" element={<NewJob />} />
          <Route path="/client-bookings" element={<ClientBookings />} />
          <Route path="/saved-providers" element={<SavedProviders />} />
          <Route path="/client-profile" element={<ClientProfile />} />
          <Route path="/provider-home" element={<ProviderHome />} />
          <Route path="/provider-map" element={<ProviderMap />} />
          <Route path="/job-requests" element={<JobRequests />} />
          <Route path="/job-schedule" element={<JobSchedule />} />
          <Route path="/provider-profile" element={<ProviderProfile />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/chat-list" element={<ChatList />} />
          <Route path="/chat/:id" element={<ChatDetail />} />
          <Route path="/rating-review" element={<RatingReview />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
