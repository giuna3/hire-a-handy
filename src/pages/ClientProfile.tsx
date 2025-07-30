import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Phone, MapPin, CreditCard, Camera, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ClientProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001"
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to backend
  };

  const handleLogout = () => {
    // In a real app, this would clear auth state
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-xl sm:text-2xl">
                    JS
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-7 h-7 sm:w-8 sm:h-8 p-0"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold">{profileData.name}</h2>
                  <p className="text-muted-foreground">Client</p>
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
                <Label htmlFor="phone">Phone Number</Label>
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
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm sm:text-base">**** **** **** 1234</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">Edit</Button>
                </div>
                <Button variant="outline" className="w-full text-sm sm:text-base">
                  Add New Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
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
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;