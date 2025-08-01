import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Mail, Phone, MapPin, CreditCard, Camera, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ClientProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { id } = useParams(); // Get user ID from URL params
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isViewingOther, setIsViewingOther] = useState(false); // Track if viewing another user's profile
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    avatarUrl: ""
  });

  useEffect(() => {
    checkUserAndFetchProfile();
    
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Check if we're viewing another user's profile
    if (id) {
      setIsViewingOther(true);
      setIsEditing(false); // Can't edit other users' profiles
    } else {
      setIsViewingOther(false);
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, id]);

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

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      // Use the ID from params if viewing another user, otherwise use current user's ID
      const targetUserId = id || user.id;
      
      const { data: profile, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
        return;
      }

      if (profile) {
        setProfileData({
          name: (profile as any).full_name || "",
          email: (profile as any).email || user.email || "",
          phone: (profile as any).phone || "",
          address: "", // Add address field to profiles table later if needed
          bio: (profile as any).bio || "",
          avatarUrl: (profile as any).avatar_url || ""
        });
      } else {
        setProfileData({
          name: "",
          email: user.email || "",
          phone: "",
          address: "",
          bio: "",
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
          avatar_url: profileData.avatarUrl
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {isViewingOther && (
        <header className="bg-card shadow-sm border-b p-4">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold ml-4">Client Profile</h1>
          </div>
        </header>
      )}
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative flex-shrink-0">
                    {profileData.avatarUrl ? (
                      <img 
                        src={profileData.avatarUrl} 
                        alt="Profile" 
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-xl sm:text-2xl">
                        {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    {!isViewingOther && (
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
                          className="absolute -bottom-2 -right-2 rounded-full w-7 h-7 sm:w-8 sm:h-8 p-0"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          disabled={uploading}
                        >
                          <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold">{profileData.name}</h2>
                  <p className="text-muted-foreground">Client</p>
                  {!isViewingOther && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">{isEditing ? "Cancel" : "Edit Profile"}</span>
                      <span className="sm:hidden">{isEditing ? "Cancel" : "Edit"}</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="pl-10"
                    disabled={!isEditing || isViewingOther}
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
                    disabled={!isEditing || isViewingOther}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="pl-10"
                    disabled={!isEditing || isViewingOther}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    className="pl-10"
                    disabled={!isEditing || isViewingOther}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={3}
                  disabled={!isEditing || isViewingOther}
                />
              </div>

              {isEditing && !isViewingOther && (
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>


          {/* Account Actions - Only show for own profile */}
          {!isViewingOther && (
            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm sm:text-base h-10 sm:h-11"
                    onClick={() => navigate("/settings")}
                  >
                    Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm sm:text-base h-10 sm:h-11"
                    onClick={() => navigate("/help")}
                  >
                    Help & Support
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full text-sm sm:text-base h-10 sm:h-11"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;