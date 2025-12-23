import { useCareerRecommendations } from '@/hooks/useCareerRecommendations';
import { RoadmapSection } from '@/components/dashboard/RoadmapSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Map, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Roadmap = () => {
  const { recommendations, loading } = useCareerRecommendations();

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const roadmap = recommendations?.learning_roadmap || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {roadmap.length > 0 ? (
        <RoadmapSection roadmap={roadmap} />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-info/10">
              <Map className="w-6 h-6 text-info" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Learning Roadmap</h1>
              <p className="text-muted-foreground">
                Your personalized path to career success
              </p>
            </div>
          </div>

          <Card className="border-0 shadow-lg text-center py-12">
            <CardContent className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">No Roadmap Yet</CardTitle>
              <CardDescription className="max-w-md mx-auto">
                Generate career recommendations to receive a personalized learning roadmap.
              </CardDescription>
              <Button asChild variant="hero">
                <Link to="/dashboard">
                  Get Started
                </Link>
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Roadmap;
