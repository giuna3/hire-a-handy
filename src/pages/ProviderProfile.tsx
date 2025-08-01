import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, User, Mail, Phone, MapPin, Star, Camera, Edit, MessageCircle, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Check if this is a client viewing a provider's profile (has id param)
  const isClientView = !!id;

  const skillOptions = [
    "House Cleaning", "Deep Cleaning", "Lawn Care", "Gardening",
    "Handyman Services", "Plumbing", "Electrical Work", "Painting",
    "Furniture Assembly", "Pet Care", "Dog Walking", "Pet Sitting",
    "Babysitting", "Child Care", "Tutoring", "Music Lessons"
  ];

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
    hourlyRate: 25,
    avatarUrl: ""
  });

  useEffect(() => {
    if (isClientView && id) {
      fetchProviderProfile(id);
    } else {
      checkUserAndFetchProfile();
      
      // Set up auth listener for own profile view
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!session?.user && !isClientView) {
          navigate("/auth");
        } else if (session?.user && !isClientView) {
          setUser(session.user);
        }
      });

      // Track provider presence when viewing own profile
      if (!isClientView) {
        const trackPresence = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const channel = supabase.channel('provider_presence');
          
          await channel.subscribe(async (status) => {
            if (status !== 'SUBSCRIBED') return;
            
            await channel.track({
              user_id: user.id,
              user_type: 'provider',
              online_at: new Date().toISOString(),
            });
          });

          return () => {
            channel.untrack();
            supabase.removeChannel(channel);
          };
        };

        trackPresence();
      }

      return () => subscription.unsubscribe();
    }
  }, [id, isClientView]);

  useEffect(() => {
    if (user && !isClientView) {
      fetchOwnProfile();
    }
  }, [user, isClientView]);

  const checkUserAndFetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    } catch (error) {
      console.error('Error checking session:', error);
      navigate("/auth");
    }
  };

  const fetchProviderProfile = async (providerId: string) => {
    try {
      const { data: profile, error } = await (supabase as any)
        .from('profiles')
        .select(`
          *,
          services:services(
            id,
            title,
            description,
            category,
            rate,
            rate_type,
            duration_minutes,
            is_active
          )
        `)
        .eq('user_id', providerId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching provider profile:', error);
        return;
      }

      if (profile) {
        setProfileData({
          name: (profile as any).full_name || "",
          email: (profile as any).email || "",
          phone: (profile as any).phone || "",
          city: "", // No city field in database yet
          bio: (profile as any).bio || "",
          hourlyRate: 0, // Will be calculated from services
          avatarUrl: (profile as any).avatar_url || ""
        });
        
        // Set skills from the database
        if ((profile as any).skills) {
          setSelectedSkills((profile as any).skills);
        }
        
        // Set services from the database
        if ((profile as any).services) {
          const activeServices = (profile as any).services.filter((s: any) => s.is_active);
          setServices(activeServices);
          
          // Set hourly rate to lowest service rate
          if (activeServices.length > 0) {
            const lowestRate = Math.min(...activeServices.map((s: any) => s.rate));
            setProfileData(prev => ({ ...prev, hourlyRate: lowestRate }));
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        setProfileData({
          name: (profile as any).full_name || "",
          email: (profile as any).email || user.email || "",
          phone: (profile as any).phone || "",
          city: "", // No city field in database yet
          bio: (profile as any).bio || "",
          hourlyRate: 0, // No hourly rate field in database yet
          avatarUrl: (profile as any).avatar_url || ""
        });
        
        // Set skills from the database
        if ((profile as any).skills) {
          setSelectedSkills((profile as any).skills);
        }
      } else {
        setProfileData({
          name: "",
          email: user.email || "",
          phone: "",
          city: "",
          bio: "",
          hourlyRate: 0, // No hourly rate field in database yet
          avatarUrl: ""
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      if (!user) return;

      const file = event.target.files[0];
      setUploading(true);

      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true 
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with avatar URL
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          bio: profileData.bio,
          avatar_url: publicUrl
        }, {
          onConflict: 'user_id'
        });

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setProfileData(prev => ({ ...prev, avatarUrl: publicUrl }));

      toast({
        title: "Success",
        description: "Profile picture updated successfully"
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const reviews: any[] = []; // Empty array - no mock data

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {

      const { error } = await (supabase as any)
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          bio: profileData.bio,
          avatar_url: profileData.avatarUrl,
          skills: selectedSkills
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to save profile",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    }
  };

  const handleSaveProvider = () => {
    setIsSaved(!isSaved);
  };

  const avgRating = 0;
  const totalReviews = 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen subtle-gradient">
      {/* Language Switcher */}
      <div className="fixed top-4 right-16 z-50">
        <LanguageSwitcher />
      </div>
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Enhanced Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="group hover:bg-primary/10 border-primary/30 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Enhanced */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Profile Header */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-white via-white to-primary/5 shadow-[var(--shadow-hero)] animate-fade-in-up">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 h-24"></div>
              <CardContent className="p-6 -mt-12 relative">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative flex-shrink-0">
                    {profileData.avatarUrl ? (
                      <img 
                        src={profileData.avatarUrl} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                        {profileData.name ? profileData.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : "U"}
                      </div>
                    )}
                    {!isClientView && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          disabled={uploading}
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        {profileData.name}
                      </h2>
                      {!isClientView && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                          className="group border-primary/30 hover:bg-primary/10 transition-all duration-300"
                        >
                          <Edit className="w-4 h-4 mr-1 group-hover:rotate-12 transition-transform duration-300" />
                          {isEditing ? "Cancel" : "Edit"}
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                      {totalReviews > 0 && (
                        <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-sm">{avgRating}</span>
                          <span className="text-muted-foreground text-sm">({totalReviews} reviews)</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Provider</Badge>
                        {isClientView && profileData.hourlyRate > 0 && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            ₾{profileData.hourlyRate}/hr
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">{profileData.bio}</p>
                    
                    {isClientView && (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        {services.length > 0 ? (
                          <Button 
                            onClick={() => {
                              document.querySelector('[data-services]')?.scrollIntoView({ behavior: 'smooth' });
                            }} 
                            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                          >
                            View Services
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            disabled
                            className="w-full sm:w-auto"
                          >
                            No Services Available
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            if (isClientView) {
                              navigate(`/client-chat/${id}`);
                            } else {
                              navigate('/chat-list');
                            }
                          }} 
                          className="w-full sm:w-auto border-accent/30 hover:bg-accent/10 transition-all duration-300"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            {!isClientView && (
              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
                </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={3}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <Button onClick={handleSave} className="w-full">
                    Save Changes
                  </Button>
                )}
              </CardContent>
              </Card>
            )}

            {/* Skills & Services */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  {isClientView ? "Services" : "Skills & Services"}
                </CardTitle>
                {!isClientView && (
                  <CardDescription>Select the services you provide</CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isClientView ? (
                  // Client view - show services with booking options
                  <div className="space-y-4">
                    {services.length > 0 ? (
                      services.map((service) => (
                        <Card key={service.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{service.title}</h4>
                                <p className="text-muted-foreground text-sm mb-2">{service.category}</p>
                                {service.description && (
                                  <p className="text-sm mb-2">{service.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>⏱️ {service.duration_minutes} minutes</span>
                                  <span className="font-semibold text-primary text-lg">
                                    ₾{service.rate} / {service.rate_type}
                                  </span>
                                </div>
                              </div>
                              <Button 
                                onClick={() => {
                                  navigate(`/booking-payment?serviceId=${service.id}&providerId=${id}`);
                                }}
                                className="w-full sm:w-auto"
                              >
                                Book This Service
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        This provider hasn't added any services yet.
                      </p>
                    )}
                  </div>
                ) : (
                  // Provider view - show skills editing
                  <>
                    {isEditing ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {skillOptions.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={skill}
                              checked={selectedSkills.includes(skill)}
                              onCheckedChange={() => handleSkillToggle(skill)}
                            />
                            <Label htmlFor={skill} className="text-sm cursor-pointer">
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.length > 0 ? (
                          selectedSkills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            Click Edit to add your skills and services
                          </p>
                        )}
                      </div>
                    )}
                    
                    {!isEditing && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">
                          Want to add detailed services with rates? 
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/provider-services')}
                        >
                          Manage Services
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Reviews */}
          <div className="space-y-6" data-services>
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Reviews</CardTitle>
                <CardDescription>What clients say about your work</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm mb-1">"{review.comment}"</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{review.client}</span>
                        <Badge variant="outline" className="text-xs">
                          {review.service}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;