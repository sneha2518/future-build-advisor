import { useCareerRecommendations } from '@/hooks/useCareerRecommendations';
import { useProfile } from '@/hooks/useProfile';
import { CareerCard } from '@/components/dashboard/CareerCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Compass, Sparkles, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Careers = () => {
  const { recommendations, loading, generating, generateRecommendations } = useCareerRecommendations();
  const { profile } = useProfile();

  const handleRegenerate = () => {
    if (profile) {
      generateRecommendations(profile);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const careers = recommendations?.recommendations || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-primary">
            <Compass className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Career Suggestions</h1>
            <p className="text-muted-foreground">
              AI-powered career paths based on your profile
            </p>
          </div>
        </div>
        
        {careers.length > 0 && (
          <Button 
            onClick={handleRegenerate}
            variant="outline"
            disabled={generating}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        )}
      </div>

      {/* Career Cards */}
      {careers.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {careers.map((career, index) => (
            <CareerCard key={career.title} career={career} index={index} />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-lg text-center py-12">
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">No Recommendations Yet</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              Complete your profile and click "Get AI Recommendations" to receive personalized career suggestions.
            </CardDescription>
            <Button asChild variant="hero">
              <Link to="/dashboard">
                Complete Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Careers;
