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

const NewJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const categories = [
    "House Cleaning", "Deep Cleaning", "Lawn Care", "Gardening", 
    "Handyman Services", "Plumbing", "Electrical Work", "Painting",
    "Pet Care", "Babysitting", "Tutoring", "Moving Help"
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services.",
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
              title: "Location found",
              description: "Current location has been set successfully.",
            });
          } else {
            throw new Error("No address found");
          }
        } catch (error) {
          // Fallback to coordinates if reverse geocoding fails
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast({
            title: "Location set",
            description: "Location set using coordinates.",
          });
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Location error",
          description: "Unable to get your location. Please check permissions.",
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
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/client-bookings");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/client-home")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold ml-4">Post New Job</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="shadow-[var(--shadow-elegant)]">
          <CardHeader>
            <CardTitle>Create Job Posting</CardTitle>
            <CardDescription>
              Fill out the details for your job posting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., House cleaning needed"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you need help with..."
                  rows={4}
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {date ? format(date, "PPP") : "Pick a date"}
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
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter address or click to use current location"
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
                <Label htmlFor="budget">Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Enter your budget"
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
                {isLoading ? "Posting Job..." : "Post Job"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewJob;