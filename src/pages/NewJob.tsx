import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, MapPin, DollarSign, Locate } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";

const NewJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    time: "",
    budget: ""
  });

  const categories = [
    { key: "houseCleaning", value: "House Cleaning" },
    { key: "deepCleaning", value: "Deep Cleaning" },
    { key: "lawnCare", value: "Lawn Care" },
    { key: "gardening", value: "Gardening" },
    { key: "handymanServices", value: "Handyman Services" },
    { key: "plumbing", value: "Plumbing" },
    { key: "electricalWork", value: "Electrical Work" },
    { key: "painting", value: "Painting" },
    { key: "petCare", value: "Pet Care" },
    { key: "babysitting", value: "Babysitting" },
    { key: "tutoring", value: "Tutoring" },
    { key: "movingHelp", value: "Moving Help" }
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t('location.notSupported'),
        description: t('location.browserNotSupported'),
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTNjeDR0NjcwY3NqMmpvaDNjaHM0OXIwIn0.HqlcRXnNrKHsHpLF7Q1D1A`
          );
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const address = data.features[0].place_name;
            setLocation(address);
            toast({
              title: t('location.locationFound'),
              description: t('location.locationSetSuccessfully'),
            });
          } else {
            throw new Error("No address found");
          }
        } catch (error) {
          // Fallback to coordinates if reverse geocoding fails
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast({
            title: t('location.locationSet'),
            description: t('location.locationSetCoordinates'),
          });
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: t('location.locationError'),
          description: t('location.unableToGetLocation'),
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to create a job",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Combine date and time
      const bookingDate = date && formData.time 
        ? new Date(`${format(date, 'yyyy-MM-dd')}T${formData.time}:00`)
        : null;

      // Create booking in database
      const { data, error } = await (supabase as any)
        .from('bookings')
        .insert({
          client_id: user.id,
          provider_id: null, // No provider assigned yet
          service_id: null, // No specific service selected
          amount: parseFloat(formData.budget) || 0,
          booking_date: bookingDate?.toISOString(),
          duration_minutes: 60, // Default duration
          status: 'pending',
          notes: `${formData.title} - ${formData.description}`,
          currency: 'gel'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        toast({
          title: "Error creating job",
          description: "Failed to create your job posting. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Job created successfully!",
        description: "Your job posting has been created and is now visible to providers.",
      });

      navigate("/client-bookings");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error creating job",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            <h1 className="text-lg sm:text-xl font-semibold ml-4">{t('jobPosting.title')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="shadow-[var(--shadow-elegant)]">
          <CardHeader>
            <CardTitle>{t('jobPosting.createJobPosting')}</CardTitle>
            <CardDescription>
              {t('jobPosting.fillOutDetails')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{t('jobPosting.jobTitle')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder={t('jobPosting.jobTitlePlaceholder')}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>{t('jobPosting.category')}</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t('jobPosting.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {categories.map((category) => (
                      <SelectItem key={category.key} value={category.value}>
                        {t(`categories.${category.key}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('jobPosting.jobDescription')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder={t('jobPosting.jobDescriptionPlaceholder')}
                  rows={4}
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('jobPosting.date')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {date ? format(date, "PPP") : t('jobPosting.pickDate')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background border shadow-lg z-50">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">{t('jobPosting.time')}</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">{t('jobPosting.location')}</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t('jobPosting.locationPlaceholder')}
                      className="pl-10"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="px-3"
                  >
                    {isGettingLocation ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Locate className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget">{t('jobPosting.budget')}</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder={t('jobPosting.budgetPlaceholder')}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? t('jobPosting.postingJob') : t('jobPosting.postJob')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewJob;