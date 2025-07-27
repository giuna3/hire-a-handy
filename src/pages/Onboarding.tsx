import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import { User, MapPin, Phone, Upload, ArrowLeft, Camera } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = location.state?.role || "client";
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skillOptions = [
    "House Cleaning",
    "Deep Cleaning", 
    "Lawn Care",
    "Gardening",
    "Handyman Services",
    "Plumbing",
    "Electrical Work",
    "Painting",
    "Furniture Assembly",
    "Pet Care",
    "Dog Walking",
    "Pet Sitting",
    "Babysitting",
    "Child Care",
    "Tutoring",
    "Music Lessons",
    "Cooking",
    "Personal Shopping",
    "Moving Help",
    "Delivery Services"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate profile creation
    setTimeout(() => {
      setIsLoading(false);
      if (userRole === "client") {
        navigate("/client-home");
      } else {
        navigate("/provider-home");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light to-accent-light p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/role-selection")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Role Selection
        </Button>

        <Card className="shadow-[var(--shadow-elegant)]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>
              {userRole === "client" 
                ? "Help us set up your client profile"
                : "Set up your provider profile to start getting jobs"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {profileImage ? "Change Photo" : "Upload Photo"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Provider-specific fields */}
              {userRole === "provider" && (
                <>
                  <div className="space-y-4">
                    <Label>Skills & Services</Label>
                    <p className="text-sm text-muted-foreground">Select all services you can provide:</p>
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                      {skillOptions.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <Label 
                            htmlFor={skill} 
                            className="text-sm cursor-pointer"
                          >
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {selectedSkills.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedSkills.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell clients about yourself and your experience"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {/* Client-specific fields */}
              {userRole === "client" && (
                <div className="space-y-2">
                  <Label htmlFor="preferences">Service Preferences (Optional)</Label>
                  <Textarea
                    id="preferences"
                    placeholder="What types of services do you need help with most often?"
                    rows={3}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Profile..." : "Complete Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;