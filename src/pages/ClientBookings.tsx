import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, MapPin, User, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ClientBookings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const activeJobs = [
    {
      id: 1,
      title: "House Cleaning",
      provider: "Sarah Johnson",
      date: "Today, 2:00 PM",
      location: "123 Main St",
      price: 75,
      status: "confirmed"
    },
    {
      id: 2,
      title: "Lawn Mowing",
      provider: "Mike Chen",
      date: "Tomorrow, 10:00 AM",
      location: "123 Main St", 
      price: 50,
      status: "in-progress"
    }
  ];

  const pendingJobs = [
    {
      id: 3,
      title: "Furniture Assembly",
      applications: 3,
      date: "This Weekend",
      location: "123 Main St",
      price: 60,
      status: "pending"
    }
  ];

  const completedJobs = [
    {
      id: 4,
      title: "Deep Cleaning",
      provider: "Emma Rodriguez",
      date: "Last Week",
      location: "123 Main St",
      price: 120,
      status: "completed",
      rating: 5
    },
    {
      id: 5,
      title: "Garden Maintenance",
      provider: "John Smith",
      date: "2 weeks ago",
      location: "123 Main St",
      price: 80,
      status: "completed",
      rating: 4
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "in-progress": return "secondary";
      case "pending": return "outline";
      case "completed": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/client-home")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('navigation.back')}
            </Button>
            <h1 className="text-xl font-semibold ml-4">{t('clientBookings.title')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">{t('clientBookings.activeJobs')}</TabsTrigger>
            <TabsTrigger value="pending">{t('clientBookings.pendingJobs')}</TabsTrigger>
            <TabsTrigger value="completed">{t('clientBookings.completedJobs')}</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {activeJobs.map((job) => (
              <Card key={job.id} className="shadow-[var(--shadow-card)]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-muted-foreground">with {job.provider}</p>
                    </div>
                    <Badge variant={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-semibold text-lg">${job.price}</span>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/chat/${job.id}`)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Navigate to job details page
                            console.log(`View details for job ${job.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingJobs.map((job) => (
              <Card key={job.id} className="shadow-[var(--shadow-card)]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-muted-foreground">{job.applications} applications received</p>
                    </div>
                    <Badge variant={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-semibold text-lg">${job.price}</span>
                      <div className="space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => {
                            // For now, navigate to job requests page since job applications doesn't exist yet
                            navigate('/job-requests');
                          }}
                        >
                          View Applications
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/new-job')}
                        >
                          Edit Job
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedJobs.map((job) => (
              <Card key={job.id} className="shadow-[var(--shadow-card)]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-muted-foreground">with {job.provider}</p>
                    </div>
                    <Badge variant={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-semibold text-lg">${job.price}</span>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/rating-review')}
                        >
                          Rate & Review
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // For demo purposes, using mock service and provider IDs
                            const providerId = "550e8400-e29b-41d4-a716-446655440001"; // Mock provider ID
                            const serviceId = "660e8400-e29b-41d4-a716-446655440001"; // Mock service ID
                            navigate(`/booking-payment?serviceId=${serviceId}&providerId=${providerId}`);
                          }}
                        >
                          Hire Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientBookings;