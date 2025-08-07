import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import { User, MapPin, Phone, Upload, ArrowLeft, Camera, Building, GraduationCap, Users } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const userRole = location.state?.role || "client";
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    phone: '',
    bio: '',
    preferences: '',
    clientType: 'client'
  });

  useEffect(() => {
    // Check if user is authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate("/auth");
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Create or update profile
      const profileData: any = {
        user_id: user.id,
        full_name: formData.fullName,
        email: user.email,
        phone: formData.phone,
        user_type: userRole
      };

      // Add client_type for clients
      if (userRole === "client") {
        profileData.client_type = formData.clientType;
      }

      // Add skills for providers
      if (userRole === "provider" && selectedSkills.length > 0) {
        profileData.skills = selectedSkills;
        profileData.bio = formData.bio;
      }

      const { error } = await (supabase as any)
        .from('profiles')
        .upsert(profileData);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile created successfully!",
        description: "Welcome to SkillConnect",
      });

      // Navigate to appropriate home page
      if (userRole === "client") {
        navigate("/client-home");
      } else {
        navigate("/provider-home");
      }
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error creating profile",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                    name="fullName"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.fullName}
                    onChange={handleInputChange}
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
                    name="city"
                    placeholder="Enter your city"
                    className="pl-10"
                    value={formData.city}
                    onChange={handleInputChange}
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
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={formData.phone}
                    onChange={handleInputChange}
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
                      name="bio"
                      placeholder="Tell clients about yourself and your experience"
                      rows={4}
                      value={formData.bio}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

               {/* Client-specific fields */}
              {userRole === "client" && (
                <>
                  {/* Client Type Selection */}
                  <div className="space-y-4">
                    <Label>Client Type</Label>
                    <RadioGroup
                      value={formData.clientType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, clientType: value }))}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="client" id="client" />
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-primary" />
                          <div>
                            <Label htmlFor="client" className="font-medium cursor-pointer">Individual Client</Label>
                            <p className="text-sm text-muted-foreground">Personal services for yourself or family</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="student" id="student" />
                        <div className="flex items-center space-x-3">
                          <GraduationCap className="w-5 h-5 text-primary" />
                          <div>
                            <Label htmlFor="student" className="font-medium cursor-pointer">Student</Label>
                            <p className="text-sm text-muted-foreground">Student looking for affordable services</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="business" id="business" />
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-primary" />
                          <div>
                            <Label htmlFor="business" className="font-medium cursor-pointer">Business</Label>
                            <p className="text-sm text-muted-foreground">Commercial services for your business</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences">Service Preferences (Optional)</Label>
                    <Textarea
                      id="preferences"
                      name="preferences"
                      placeholder="What types of services do you need help with most often?"
                      rows={3}
                      value={formData.preferences}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
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