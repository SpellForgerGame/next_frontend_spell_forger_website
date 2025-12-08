import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-3 bg-gradient-primary rounded-full shadow-magical animate-magical-glow">
                <Sparkles className="w-6 h-6 text-primary-foreground animate-spin" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Checking magical credentials...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we verify your access
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;