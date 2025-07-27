import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, MapPin, Clock, User, Menu, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProviderHome = () => {
  const navigate = useNavigate();
  const todayJobs = [
    {
      id: 1,
      title: "House Cleaning",
      client: "Jennifer Smith",
      time: "2:00 PM - 5:00 PM",
      price: 75,
      status: "confirmed"
    },
    {
      id: 2,
      title: "Lawn Mowing",
      client: "Robert Davis",
      time: "10:00 AM - 12:00 PM",
      price: 50,
      status: "pending"
    }
  ];

  const availableJobs = [
    {
      id: 1,
      title: "Apartment Deep Clean",
      client: "Maria Garcia",
      description: "Need a thorough cleaning of 2-bedroom apartment",
      price: 120,
      time: "Tomorrow, 1:00 PM",
      distance: "1.2 miles",
      urgent: false
    },
    {
      id: 2,
      title: "Furniture Assembly",
      client: "John Wilson",
      description: "IKEA wardrobe assembly required",
      price: 60,
      time: "Today, 6:00 PM",
      distance: "0.8 miles",
      urgent: true
    },
    {
      id: 3,
      title: "Math Tutoring",
      client: "Lisa Thompson",
      description: "High school algebra help needed",
      price: 40,
      time: "This weekend",
      distance: "2.1 miles",
      urgent: false
    }
  ];

  const stats = {
    todayEarnings: 125,
    thisWeekEarnings: 425,
    totalJobs: 47,
    rating: 4.8
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Skill<span className="text-primary">Connect</span>
            </h1>
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold mb-2">Good morning, Alex!</h2>
          <p className="text-muted-foreground text-lg">Ready to earn money with your skills?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold">${stats.todayEarnings}</p>
              <p className="text-sm text-muted-foreground">Today's Earnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">${stats.thisWeekEarnings}</p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.totalJobs}</p>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <User className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.rating}</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your confirmed and pending jobs for today</CardDescription>
          </CardHeader>
          <CardContent>
            {todayJobs.length > 0 ? (
              <div className="space-y-4">
                {todayJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-muted-foreground">Client: {job.client}</p>
                      <p className="text-sm text-muted-foreground">{job.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">${job.price}</p>
                      <Badge variant={job.status === "confirmed" ? "default" : "secondary"}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No jobs scheduled for today</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
            onClick={() => navigate('/provider-map')}
          >
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Browse Jobs Map</h3>
              <p className="text-muted-foreground text-sm">Find jobs near you on the map</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
            onClick={() => navigate('/job-schedule')}
          >
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">My Schedule</h3>
              <p className="text-muted-foreground text-sm">View your complete schedule</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Jobs */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Available Jobs Near You</CardTitle>
            <CardDescription>Apply to jobs that match your skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-[var(--shadow-card)] transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{job.title}</h4>
                        {job.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">{job.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {job.client}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.distance}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-xl text-success">${job.price}</p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => {
                          // Navigate to job requests page where they can see more details
                          navigate('/job-requests');
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderHome;