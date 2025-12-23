import { useCareerRecommendations } from '@/hooks/useCareerRecommendations';
import { SkillGapCard } from '@/components/dashboard/SkillGapCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SkillGap = () => {
  const { recommendations, loading } = useCareerRecommendations();

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const skillGaps = recommendations?.skill_gap_analysis || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl gradient-accent">
          <Target className="w-6 h-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Skill Gap Analysis</h1>
          <p className="text-muted-foreground">
            Compare your skills with career requirements
          </p>
        </div>
      </div>

      {/* Skill Gap Cards */}
      {skillGaps.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGaps.map((skillGap, index) => (
            <SkillGapCard key={skillGap.careerTitle} skillGap={skillGap} index={index} />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-lg text-center py-12">
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">No Skill Analysis Yet</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              Generate career recommendations first to see your skill gap analysis.
            </CardDescription>
            <Button asChild variant="hero">
              <Link to="/dashboard">
                Get Started
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkillGap;
