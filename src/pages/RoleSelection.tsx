import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, Wrench, ArrowRight } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();

  const selectRole = (role: "client" | "provider") => {
    // In a real app, this would save the role to user context/state
    navigate("/onboarding", { state: { role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light to-accent-light flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
          <p className="text-xl text-muted-foreground">
            How would you like to use SkillConnect?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Client Card */}
          <Card className="relative overflow-hidden shadow-[var(--shadow-elegant)] hover:shadow-xl transition-all duration-300 cursor-pointer group" 
                onClick={() => selectRole("client")}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="text-center pb-6">
              <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <User className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">I'm a Client</CardTitle>
              <CardDescription className="text-lg">
                I need help with tasks and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-primary mr-2" />
                  Find skilled professionals near you
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-primary mr-2" />
                  Post jobs and get quotes
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-primary mr-2" />
                  Hire trusted service providers
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-primary mr-2" />
                  Rate and review completed work
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground"
              >
                Continue as Client
              </Button>
            </CardContent>
          </Card>

          {/* Provider Card */}
          <Card className="relative overflow-hidden shadow-[var(--shadow-elegant)] hover:shadow-xl transition-all duration-300 cursor-pointer group" 
                onClick={() => selectRole("provider")}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="text-center pb-6">
              <div className="w-24 h-24 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="w-12 h-12 text-accent" />
              </div>
              <CardTitle className="text-2xl">I'm a Provider</CardTitle>
              <CardDescription className="text-lg">
                I offer services and want to earn money
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-accent mr-2" />
                  Showcase your skills and experience
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-accent mr-2" />
                  Find jobs that match your skills
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-accent mr-2" />
                  Set your own rates and schedule
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-accent mr-2" />
                  Build your reputation and earn more
                </li>
              </ul>
              <Button 
                variant="accent" 
                className="w-full mt-6"
              >
                Continue as Provider
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;