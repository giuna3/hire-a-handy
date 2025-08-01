import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, MapPin, User, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const JobRequests = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const availableJobs: any[] = []; // Empty array - no mock data

  const categories = ["All", "Cleaning", "Handyman", "Tutoring", "Gardening", "Pet Care"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/provider-home")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('navigation.back')}
            </Button>
            <h1 className="text-xl font-semibold ml-4">{t('jobRequests.title')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('jobRequests.searchJobs')}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-4">
            <Select defaultValue="All">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select defaultValue="newest">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-high">Highest Pay</SelectItem>
                <SelectItem value="price-low">Lowest Pay</SelectItem>
                <SelectItem value="distance">Closest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {availableJobs.map((job) => (
            <Card key={job.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                          {job.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              {t('jobRequests.urgent')}
                            </Badge>
                          )}
                      <Badge variant="outline" className="text-xs">
                        {job.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {job.applications} {job.applications === 1 ? t('jobRequests.application') : t('jobRequests.applications')} {t('jobRequests.soFar')}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-success">${job.price}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-muted-foreground">{job.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
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
                  
                  <div className="flex items-center justify-between pt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Navigate to job details or show more information
                        console.log(`View details for job: ${job.title}`);
                        // For now, we could navigate to a job details page or show a modal
                        // Since we don't have a job details page yet, we'll log for now
                      }}
                      >
                        {t('jobRequests.viewDetails')}
                      </Button>
                    <Button 
                      size="sm" 
                      className="px-6"
                      onClick={() => {
                        // Apply to the job - show success message or navigate to application form
                        alert(`Successfully applied for: ${job.title}!\n\nClient: ${job.client}\nPay: $${job.price}\n\nYou will be notified if selected.`);
                      }}
                      >
                        {t('jobRequests.applyNow')}
                      </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button 
            variant="outline"
            onClick={() => {
              // Load more jobs functionality
              console.log("Loading more jobs...");
              // Could fetch more jobs from API or show more from a larger dataset
            }}
          >
            {t('jobRequests.loadMoreJobs')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobRequests;