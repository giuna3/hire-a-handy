import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Heart, Trash2, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SavedProviders = () => {
  const navigate = useNavigate();

  const savedProviders = [
    {
      id: 1,
      name: "Sarah Johnson",
      profession: "House Cleaner",
      rating: 4.8,
      reviews: 47,
      image: "SJ",
      hourlyRate: 25,
      bio: "Professional cleaning with 5+ years experience",
      lastHired: "2 weeks ago"
    },
    {
      id: 2,
      name: "Mike Chen",
      profession: "Handyman",
      rating: 4.9,
      reviews: 63,
      image: "MC",
      hourlyRate: 45,
      bio: "Home repairs and maintenance specialist",
      lastHired: "1 month ago"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      profession: "Tutor",
      rating: 5.0,
      reviews: 28,
      image: "ER",
      hourlyRate: 35,
      bio: "Math and science tutoring for all ages",
      lastHired: "3 weeks ago"
    }
  ];

  const removeFromSaved = (providerId: number) => {
    // In a real app, this would remove from saved list
    console.log("Removing provider:", providerId);
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
          <h1 className="text-xl font-semibold ml-4">Saved Providers</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {savedProviders.length > 0 ? (
          <div className="space-y-4">
            {savedProviders.map((provider) => (
              <Card key={provider.id} className="shadow-[var(--shadow-card)]">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                      {provider.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{provider.name}</h4>
                          <p className="text-muted-foreground">{provider.profession}</p>
                          <p className="text-sm text-muted-foreground mt-1">{provider.bio}</p>
                          <p className="text-xs text-muted-foreground mt-2">Last hired: {provider.lastHired}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${provider.hourlyRate}/hr</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromSaved(provider.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{provider.rating}</span>
                          <span className="text-muted-foreground text-sm">({provider.reviews} reviews)</span>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm">
                            Hire Again
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromSaved(provider.id)}
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Saved Providers</h3>
              <p className="text-muted-foreground mb-6">
                Save providers you like to easily hire them again later
              </p>
              <Button onClick={() => navigate("/client-home")}>
                Browse Providers
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedProviders;