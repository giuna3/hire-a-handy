import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Calendar, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CategorySelector from "@/components/CategorySelector";

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
      profession: t('categories.houseCleaning'),
      category: "cleaning",
      rating: 4.8,
      reviews: 47,
      distance: "0.5 miles",
      image: "SJ",
      hourlyRate: 25,
      bio: t('clientHome.cleaningBio')
    },
    {
      id: 2,
      name: "Mike Chen",
      profession: t('categories.handyman'),
      category: "handyman",
      rating: 4.9,
      reviews: 63,
      distance: "1.2 miles",
      image: "MC",
      hourlyRate: 45,
      bio: t('clientHome.handymanBio')
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      profession: t('subcategories.math'),
      category: "math",
      rating: 5.0,
      reviews: 28,
      distance: "0.8 miles",
      image: "ER",
      hourlyRate: 35,
      bio: t('clientHome.tutoringBio')
    },
    {
      id: 4,
      name: "Lisa Parker",
      profession: t('categories.petcare'),
      category: "petcare",
      rating: 4.7,
      reviews: 35,
      distance: "1.5 miles",
      image: "LP",
      hourlyRate: 20,
      bio: t('clientHome.petcareBio')
    },
    {
      id: 5,
      name: "David Wilson",
      profession: t('categories.gardening'),
      category: "gardening",
      rating: 4.6,
      reviews: 52,
      distance: "2.0 miles",
      image: "DW",
      hourlyRate: 30,
      bio: t('clientHome.gardeningBio')
    },
    {
      id: 6,
      name: "Maria Santos",
      profession: t('categories.childcare'),
      category: "childcare",
      rating: 4.9,
      reviews: 41,
      distance: "0.7 miles",
      image: "MS",
      hourlyRate: 18,
      bio: t('clientHome.childcareBio')
    },
    {
      id: 7,
      name: "Giorgi Beridze", 
      profession: t('subcategories.physics'),
      category: "physics",
      rating: 4.9,
      reviews: 33,
      distance: "1.1 miles",
      image: "GB",
      hourlyRate: 40,
      bio: t('clientHome.physicsBio')
    },
    {
      id: 8,
      name: "Ana Maisuradze",
      profession: t('subcategories.georgian'),
      category: "georgian", 
      rating: 5.0,
      reviews: 22,
      distance: "0.6 miles",
      image: "AM",
      hourlyRate: 30,
      bio: t('clientHome.georgianBio')
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
                           provider.category === selectedCategory ||
                           // Also match main category (e.g., "tutoring" matches "math", "physics", etc.)
                           (selectedCategory === "tutoring" && ["math", "physics", "georgian", "english", "russian", "otherLanguage", "biology", "chemistry", "geography", "history", "elementary"].includes(provider.category)) ||
                           (selectedCategory === "cleaning" && ["houseCleaning", "deepCleaning", "officeCleaning"].includes(provider.category)) ||
                           (selectedCategory === "handyman" && ["plumbing", "electrical", "generalRepairs"].includes(provider.category));
    
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
    setSelectedCategory(category);
    // Clear search when clicking category
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">
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
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t('clientHome.welcomeBack')}</h2>
          <p className="text-muted-foreground text-base sm:text-lg">{t('clientHome.findPerfect')}</p>
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
                  {t('clientHome.found')} {filteredProviders.length} {filteredProviders.length !== 1 ? t('clientHome.providers') : t('clientHome.provider')} {t('clientHome.for')} "{searchQuery}"
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  {t('clientHome.clearSearch')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Filters */}
        <CategorySelector 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryClick}
          onClearFilter={() => setSelectedCategory("")}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
            onClick={() => navigate('/client-map')}
          >
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t('clientHome.browseMap')}</h3>
              <p className="text-muted-foreground text-sm">{t('clientHome.browseMapDesc')}</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-[var(--shadow-card)] transition-shadow"
            onClick={() => navigate('/new-job')}
          >
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t('clientHome.postJob')}</h3>
              <p className="text-muted-foreground text-sm">{t('clientHome.postJobDesc')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Nearby Providers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              {searchQuery || selectedCategory ? t('clientHome.searchResults') : t('clientHome.providersNearYou')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredProviders.length} {filteredProviders.length !== 1 ? t('clientHome.providers') : t('clientHome.provider')} found
            </p>
          </div>
          <div className="space-y-4">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
              <Card key={provider.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary font-semibold text-lg mx-auto sm:mx-0">
                      {provider.image}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h4 className="font-semibold text-lg">{provider.name}</h4>
                          <p className="text-muted-foreground">{provider.profession}</p>
                          <p className="text-sm text-muted-foreground mt-1">{provider.bio}</p>
                        </div>
                        <div className="text-center sm:text-right mb-4 sm:mb-0">
                          <p className="font-semibold text-lg">${provider.hourlyRate}/hr</p>
                          <p className="text-sm text-muted-foreground">{provider.distance}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0">
                        <div className="flex items-center justify-center sm:justify-start space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{provider.rating}</span>
                           <span className="text-muted-foreground text-sm">({provider.reviews} {t('clientHome.reviews')})</span>
                        </div>
                        <div className="flex space-x-2 justify-center sm:justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => navigate(`/provider-profile/${provider.id}`)}
                          >
                            {t('clientHome.viewProfile')}
                          </Button>
                          <Button 
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => navigate('/new-job')}
                          >
                            {t('clientHome.hireNow')}
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
                    {t('clientHome.noProviders')}
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                    }}
                  >
                    {t('clientHome.clearAllFilters')}
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