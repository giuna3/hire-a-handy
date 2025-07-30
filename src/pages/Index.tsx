import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        <p className="text-xl text-muted-foreground mb-8">Start building your amazing project here!</p>
        <Button onClick={() => navigate('/welcome')}>
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
