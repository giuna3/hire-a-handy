import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Calendar, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const ClientHome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const nearbyProviders = [
    {
      id: 1,
      name: "Sarah Johnson",
      profession: "House Cleaner",
      category: "cleaning",
      rating: 4.8,
      reviews: 47,
      distance: "0.5 miles",
      image: "SJ",
      hourlyRate: 25,
      bio: "Professional cleaning with 5+ years experience"
    },
    {
      id: 2,
      name: "Mike Chen",
      profession: "Handyman",
      category: "handyman",
      rating: 4.9,
      reviews: 63,
      distance: "1.2 miles",
      image: "MC",
      hourlyRate: 45,
      bio: "Home repairs and maintenance specialist"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      profession: "Tutor",
      category: "tutoring",
      rating: 5.0,
      reviews: 28,
      distance: "0.8 miles",
      image: "ER",
      hourlyRate: 35,
      bio: "Math and science tutoring for all ages"
    },
    {
      id: 4,
      name: "Lisa Parker",
      profession: "Pet Sitter",
      category: "petcare",
      rating: 4.7,
      reviews: 35,
      distance: "1.5 miles",
      image: "LP",
      hourlyRate: 20,
      bio: "Loving pet care for dogs and cats"
    },
    {
      id: 5,
      name: "David Wilson",
      profession: "Gardener",
      category: "gardening",
      rating: 4.6,
      reviews: 52,
      distance: "2.0 miles",
      image: "DW",
      hourlyRate: 30,
      bio: "Professional landscaping and garden maintenance"
    },
    {
      id: 6,
      name: "Maria Santos",
      profession: "Childcare Provider",
      category: "childcare",
      rating: 4.9,
      reviews: 41,
      distance: "0.7 miles",
      image: "MS",
      hourlyRate: 18,
      bio: "Experienced childcare with early education background"
    }
  ];

  const categories = [
    t('categories.cleaning'), t('categories.handyman'), t('categories.tutoring'), 
    t('categories.petcare'), t('categories.gardening'), t('categories.childcare')
  ];

  // Filter providers based on search and category
  const filteredProviders = nearbyProviders.filter(provider => {
    const matchesSearch = searchQuery === "" || 
                         provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || 
                           provider.category === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // If searching, clear category filter to show all relevant results
    if (value && selectedCategory) {
      setSelectedCategory("");
    }
  };

  const handleCategoryClick = (category: string) => {
    const categoryKey = category.toLowerCase().replace(" ", "");
    setSelectedCategory(categoryKey);
    // Clear search when clicking category
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Skill<span className="text-primary">Connect</span>
            </h1>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold mb-2">{t('clientHome.welcomeBack')}</h2>
          <p className="text-muted-foreground text-lg">{t('clientHome.findPerfect')}</p>
        </div>

        {/* Search Bar */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t('clientHome.searchPlaceholder')}
                className="pl-10 text-lg py-6"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            {searchQuery && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Found {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Popular Categories</h3>
            {selectedCategory && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCategory("")}
              >
                Clear Filter
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant={selectedCategory === category.toLowerCase().replace(" ", "") ? "default" : "secondary"}
                className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
            onClick={() => navigate('/client-map')}
          >
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Browse Map</h3>
              <p className="text-muted-foreground text-sm">View providers near you on a map</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
            onClick={() => navigate('/new-job')}
          >
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Post a Job</h3>
              <p className="text-muted-foreground text-sm">Create a job and get quotes</p>
            </CardContent>
          </Card>
        </div>

        {/* Nearby Providers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              {searchQuery || selectedCategory ? 'Search Results' : 'Providers Near You'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="space-y-4">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
              <Card key={provider.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-shadow">
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
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">${provider.hourlyRate}/hr</p>
                          <p className="text-sm text-muted-foreground">{provider.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{provider.rating}</span>
                          <span className="text-muted-foreground text-sm">({provider.reviews} reviews)</span>
                        </div>
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/provider-profile/${provider.id}`)}
                          >
                            View Profile
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => navigate('/new-job')}
                          >
                            Hire Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            ) : (
              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No providers found matching your search criteria
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                    }}
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;