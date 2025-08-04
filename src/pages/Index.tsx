import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Wheat, Building2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const jobCategories = [
    {
      title: "Client to Provider Jobs",
      description: "Regular service jobs between clients and providers",
      icon: Users,
      path: "/welcome",
      color: "text-primary"
    },
    {
      title: "Student Jobs",
      description: "Job opportunities for students from businesses",
      icon: GraduationCap,
      path: "/welcome",
      color: "text-secondary"
    },
    {
      title: "Agricultural Jobs",
      description: "Specialized agricultural and farming jobs",
      icon: Wheat,
      path: "/welcome",
      color: "text-accent"
    },
    {
      title: "Business to Provider",
      description: "Daily job postings from businesses to service providers",
      icon: Building2,
      path: "/welcome",
      color: "text-muted-foreground"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">SkillConnect</h1>
          <p className="text-xl text-muted-foreground mb-8">Choose your job category to get started</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {jobCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:scale-105"
                onClick={() => navigate(category.path)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <IconComponent className={`h-12 w-12 ${category.color}`} />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{category.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button onClick={() => navigate('/welcome')} size="lg">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
