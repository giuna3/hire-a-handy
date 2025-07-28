import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, MapPin, Clock, User, Menu, TrendingUp, Calendar, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ProviderHome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [urgentOnly, setUrgentOnly] = useState(false);
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
      category: "cleaning",
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
      category: "handyman",
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
      category: "tutoring",
      urgent: false
    },
    {
      id: 4,
      title: "Garden Maintenance",
      client: "Robert Davis",
      description: "Lawn mowing and hedge trimming needed",
      price: 80,
      time: "Next week",
      distance: "1.8 miles",
      category: "gardening",
      urgent: false
    },
    {
      id: 5,
      title: "Pet Sitting",
      client: "Sarah Wilson",
      description: "Need someone to watch my dog for the weekend",
      price: 100,
      time: "This weekend",
      distance: "0.5 miles",
      category: "petcare",
      urgent: true
    }
  ];

  // Filter jobs based on search and filters
  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
    
    const matchesDistance = distanceFilter === "all" || 
                           (distanceFilter === "1" && parseFloat(job.distance) <= 1) ||
                           (distanceFilter === "3" && parseFloat(job.distance) <= 3) ||
                           (distanceFilter === "5" && parseFloat(job.distance) <= 5);
    
    const matchesPrice = priceFilter === "all" ||
                        (priceFilter === "low" && job.price < 50) ||
                        (priceFilter === "medium" && job.price >= 50 && job.price < 100) ||
                        (priceFilter === "high" && job.price >= 100);
    
    const matchesUrgent = !urgentOnly || job.urgent;
    
    return matchesSearch && matchesCategory && matchesDistance && matchesPrice && matchesUrgent;
  });

  const stats = {
    todayEarnings: 0,
    thisWeekEarnings: 0,
    totalJobs: 0,
    rating: 0
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
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold mb-2">{t('providerHome.goodMorning')}</h2>
          <p className="text-muted-foreground text-lg">{t('providerHome.readyToEarn')}</p>
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

        {/* Job Search and Filters */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Find Jobs
            </CardTitle>
            <CardDescription>Search and filter available jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title, description, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="handyman">Handyman</SelectItem>
                    <SelectItem value="tutoring">Tutoring</SelectItem>
                    <SelectItem value="gardening">Gardening</SelectItem>
                    <SelectItem value="petcare">Pet Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Distance</label>
                <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Distance</SelectItem>
                    <SelectItem value="1">Within 1 mile</SelectItem>
                    <SelectItem value="3">Within 3 miles</SelectItem>
                    <SelectItem value="5">Within 5 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="low">Under $50</SelectItem>
                    <SelectItem value="medium">$50 - $100</SelectItem>
                    <SelectItem value="high">$100+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant={urgentOnly ? "default" : "outline"}
                  onClick={() => setUrgentOnly(!urgentOnly)}
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {urgentOnly ? "Urgent Only" : "All Jobs"}
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} of {availableJobs.length} jobs
            </div>
          </CardContent>
        </Card>

        {/* Available Jobs */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Available Jobs Near You</CardTitle>
            <CardDescription>Apply to jobs that match your skills</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
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
                          <Badge variant="secondary" className="text-xs capitalize">
                            {job.category}
                          </Badge>
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
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No jobs match your current filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setDistanceFilter("all");
                    setPriceFilter("all");
                    setUrgentOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderHome;