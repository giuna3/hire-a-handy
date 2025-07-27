import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Bell, Lock, Globe, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold ml-4">Settings</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="job-alerts">Job Alerts</Label>
              <Switch id="job-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="messages">Messages</Label>
              <Switch id="messages" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="payments">Payment Updates</Label>
              <Switch id="payments" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                // Navigate to change password functionality
                console.log('Change password clicked');
              }}
            >
              Change Password
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                // Navigate to 2FA setup
                console.log('Two-factor auth clicked');
              }}
            >
              Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="w-5 h-5 mr-2 text-destructive" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => {
                // Show confirmation dialog before deleting account
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  console.log('Account deletion confirmed');
                  // Handle account deletion
                }
              }}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;