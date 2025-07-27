import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Star, MapPin, Shield } from "lucide-react";
import heroImage from "@/assets/skillconnect-hero.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light to-accent-light">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-8">
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-4">
                Skill<span className="text-primary">Connect</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Connect with skilled professionals in your area. 
                <br />Find help when you need it, earn money with your skills.
              </p>
            </div>
            
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-12 py-6 rounded-xl"
            >
              Get Started
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-elegant)]">
              <img 
                src={heroImage} 
                alt="SkillConnect - Connecting Skills and Opportunities"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 rounded-xl bg-card shadow-[var(--shadow-card)]">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Find Skilled People</h3>
            <p className="text-muted-foreground">Connect with verified professionals in your area</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card shadow-[var(--shadow-card)]">
            <div className="w-16 h-16 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Trusted Reviews</h3>
            <p className="text-muted-foreground">Read reviews and ratings from real customers</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card shadow-[var(--shadow-card)]">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Local Services</h3>
            <p className="text-muted-foreground">Find help nearby or offer services in your area</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card shadow-[var(--shadow-card)]">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
            <p className="text-muted-foreground">Safe and secure payment processing</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users connecting skills and opportunities
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-4"
          >
            Join SkillConnect
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;