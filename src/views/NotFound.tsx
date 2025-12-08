import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="bg-gradient-card border-border/50 shadow-card max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="p-3 bg-gradient-primary rounded-full shadow-magical animate-float">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Spell Not Found
          </h2>
          
          <p className="text-muted-foreground mb-6">
            The magical page you're looking for seems to have vanished into the ethereal realm.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="gap-2 shadow-gold hover:animate-magical-glow">
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </Link>
            
            <Link to="/spells">
              <Button variant="outline" className="gap-2">
                <Search className="w-4 h-4" />
                Browse Spells
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
