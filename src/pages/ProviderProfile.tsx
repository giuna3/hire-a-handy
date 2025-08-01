import { useState } from "react";
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

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([
    "House Cleaning", "Deep Cleaning", "Lawn Care", "Handyman Services"
  ]);
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
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 987-6543",
    city: "New York, NY",
    bio: "Professional service provider with 5+ years of experience. I take pride in delivering quality work and building lasting relationships with my clients.",
    hourlyRate: 25
  });

  const reviews = [
    {
      id: 1,
      client: "Sarah M.",
      rating: 5,
      comment: "Excellent work! Very professional and thorough.",
      date: "2 weeks ago",
      service: "House Cleaning"
    },
    {
      id: 2,
      client: "Mike R.",
      rating: 5,
      comment: "Great job on the lawn care. Will hire again!",
      date: "1 month ago", 
      service: "Lawn Care"
    },
    {
      id: 3,
      client: "Emma L.",
      rating: 4,
      comment: "Good work overall, very punctual.",
      date: "1 month ago",
      service: "Deep Cleaning"
    }
  ];

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save to backend
  };

  const handleSaveProvider = () => {
    setIsSaved(!isSaved);
  };

  const avgRating = 4.8;
  const totalReviews = 47;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Picture and Basic Info */}
            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-xl sm:text-2xl">
                      AJ
                    </div>
                    {!isClientView && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-7 h-7 sm:w-8 sm:h-8 p-0"
                      >
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                      <h2 className="text-xl sm:text-2xl font-bold">{profileData.name}</h2>
                      {!isClientView && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">{isEditing ? "Cancel" : "Edit"}</span>
                          <span className="sm:hidden">{isEditing ? "Cancel" : "Edit"}</span>
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold text-sm sm:text-base">{avgRating}</span>
                        <span className="text-muted-foreground text-sm">({totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Provider</Badge>
                        {isClientView && (
                          <Badge variant="outline" className="text-xs">${profileData.hourlyRate}/hr</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base">{profileData.bio}</p>
                    {isClientView && (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button 
                          onClick={() => {
                            // For demo purposes, using mock service and provider IDs
                            const providerId = id || "550e8400-e29b-41d4-a716-446655440001";
                            const serviceId = "660e8400-e29b-41d4-a716-446655440001"; // Mock service ID
                            navigate(`/booking-payment?serviceId=${serviceId}&providerId=${providerId}`);
                          }} 
                          className="w-full sm:w-auto"
                        >
                          Hire Now
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/chat-list')} className="w-full sm:w-auto">
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
                <CardTitle className="text-lg sm:text-xl">Skills & Services</CardTitle>
                {!isClientView && (
                  <CardDescription>Select the services you provide</CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
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
                    {selectedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Reviews */}
          <div className="space-y-6">
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