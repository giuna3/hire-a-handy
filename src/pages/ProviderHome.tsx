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
  const todayJobs = [];

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
    <div className="min-h-screen subtle-gradient">
      {/* Language Switcher */}
      <div className="fixed top-4 right-16 z-50">
        <LanguageSwitcher />
      </div>
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Enhanced Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl hero-gradient p-8 sm:p-12 text-white shadow-[var(--shadow-hero)] animate-fade-in-up">
          <div className="absolute inset-0 glow-effect opacity-30"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {t('providerHome.goodMorning')}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto">
              {t('providerHome.readyToEarn')}
            </p>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
          <Card className="group border-0 bg-gradient-to-br from-white to-success/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center">
              <div className="mb-3 p-3 rounded-full bg-success/10 group-hover:bg-success/20 transition-colors duration-300 mx-auto w-fit">
                <DollarSign className="w-8 h-8 text-success group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                ${stats.todayEarnings}
              </p>
              <p className="text-sm text-muted-foreground">Today's Earnings</p>
            </CardContent>
          </Card>
          
          <Card className="group border-0 bg-gradient-to-br from-white to-primary/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center">
              <div className="mb-3 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mx-auto w-fit">
                <TrendingUp className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                ${stats.thisWeekEarnings}
              </p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </CardContent>
          </Card>
          
          <Card className="group border-0 bg-gradient-to-br from-white to-accent/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center">
              <div className="mb-3 p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 mx-auto w-fit">
                <Calendar className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                {stats.totalJobs}
              </p>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </CardContent>
          </Card>
          
          <Card className="group border-0 bg-gradient-to-br from-white to-yellow-500/10 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 text-center">
              <div className="mb-3 p-3 rounded-full bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-300 mx-auto w-fit">
                <User className="w-8 h-8 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                {stats.rating || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Today's Schedule */}
        <Card className="border-0 bg-gradient-to-br from-white via-white to-muted/20 shadow-[var(--shadow-card)] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-muted/30">
            <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your confirmed and pending jobs for today</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {todayJobs.length > 0 ? (
              <div className="space-y-4">
                {todayJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/40 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-muted-foreground text-sm">Client: {job.client}</p>
                        <p className="text-sm text-muted-foreground">{job.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-success">${job.price}</p>
                        <Badge variant={job.status === "confirmed" ? "default" : "secondary"}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 p-4 rounded-full bg-muted/50 w-20 h-20 flex items-center justify-center mx-auto">
                  <Calendar className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No jobs scheduled for today</p>
                <p className="text-sm text-muted-foreground mt-2">Great time to find new opportunities!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
          <Card 
            className="group cursor-pointer hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02] overflow-hidden border-0 bg-gradient-to-br from-white to-primary/10"
            onClick={() => navigate('/provider-map')}
          >
            <CardContent className="p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mb-4 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mx-auto w-fit">
                  <MapPin className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">Browse Jobs Map</h3>
                <p className="text-muted-foreground text-sm">Find jobs near you on the map</p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="group cursor-pointer hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02] overflow-hidden border-0 bg-gradient-to-br from-white to-accent/10"
            onClick={() => navigate('/job-schedule')}
          >
            <CardContent className="p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mb-4 p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 mx-auto w-fit">
                  <Calendar className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors duration-300">My Schedule</h3>
                <p className="text-muted-foreground text-sm">View your complete schedule</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Job Search Section */}
        <Card className="border-0 bg-gradient-to-br from-white via-white to-muted/20 shadow-[var(--shadow-card)] animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-muted/30">
            <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              <Search className="w-5 h-5 mr-2 text-primary" />
              Find Jobs
            </CardTitle>
            <CardDescription>Search and filter available jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Enhanced Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, clients, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm text-base"
              />
            </div>

            {/* Enhanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 border border-muted/30">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm">
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
                  <SelectTrigger className="border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm">
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
                  <SelectTrigger className="border-muted/40 focus:border-primary/50 bg-white/80 backdrop-blur-sm">
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
                  className={`w-full h-10 font-medium transition-all duration-300 ${
                    urgentOnly 
                      ? "bg-gradient-to-r from-primary to-primary-hover shadow-[var(--shadow-button)]" 
                      : "border-muted/40 hover:bg-primary/10"
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {urgentOnly ? "Urgent Only" : "All Jobs"}
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground p-3 rounded-lg bg-primary/5 border border-primary/20">
              Showing <span className="font-semibold text-primary">{filteredJobs.length}</span> of <span className="font-semibold">{availableJobs.length}</span> available jobs
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Available Jobs */}
        <Card className="border-0 bg-gradient-to-br from-white via-white to-muted/20 shadow-[var(--shadow-card)] animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-muted/30">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Available Jobs Near You
            </CardTitle>
            <CardDescription>Apply to jobs that match your skills</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <div 
                    key={job.id} 
                    className="group border-0 rounded-xl p-4 bg-gradient-to-r from-white to-muted/20 hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.01] animate-fade-in-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-bold text-base group-hover:text-primary transition-colors duration-300">{job.title}</h4>
                          {job.urgent && (
                            <Badge variant="destructive" className="text-xs animate-pulse">
                              🔥 Urgent
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs capitalize bg-primary/10 text-primary">
                            {job.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3 text-sm">{job.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1 text-primary" />
                            {job.client}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-accent" />
                            {job.time}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-success" />
                            {job.distance}
                          </span>
                        </div>
                      </div>
                      <div className="text-center sm:text-right flex-shrink-0 sm:ml-6">
                        <p className="font-bold text-2xl text-success mb-2">${job.price}</p>
                        <Button 
                          className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-semibold rounded-xl shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105"
                          onClick={() => navigate('/job-requests')}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 p-4 rounded-full bg-muted/50 w-20 h-20 flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No jobs match your filters</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search criteria to find more opportunities</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setDistanceFilter("all");
                    setPriceFilter("all");
                    setUrgentOnly(false);
                  }}
                  className="bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/30"
                >
                  Clear All Filters
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