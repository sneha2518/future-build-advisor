import { useProfile } from '@/hooks/useProfile';
import { useCareerRecommendations } from '@/hooks/useCareerRecommendations';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { CareerCard } from '@/components/dashboard/CareerCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, Target, Map, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { recommendations, loading: recsLoading, generating, generateRecommendations } = useCareerRecommendations();

  const handleGenerate = () => {
    if (profile) {
      generateRecommendations(profile);
    }
  };

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-muted-foreground">
          Let's discover your ideal career path together.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Form - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <ProfileForm
            profile={profile}
            onSave={updateProfile}
            onGenerate={handleGenerate}
            generating={generating}
          />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Career Paths Card */}
          <Link to="/careers" className="block">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg gradient-primary group-hover:scale-110 transition-transform">
                    <Compass className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Career Paths</CardTitle>
                    <CardDescription>
                      {recommendations?.recommendations?.length || 0} suggestions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Skill Gap Card */}
          <Link to="/skill-gap" className="block">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg gradient-accent group-hover:scale-110 transition-transform">
                    <Target className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Skill Gap</CardTitle>
                    <CardDescription>
                      {recommendations?.skill_gap_analysis?.length || 0} analyses
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Roadmap Card */}
          <Link to="/roadmap" className="block">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10 group-hover:scale-110 transition-transform">
                    <Map className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Learning Roadmap</CardTitle>
                    <CardDescription>
                      {recommendations?.learning_roadmap?.length || 0} stages
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* Top Career Recommendations Preview */}
      {recommendations?.recommendations && recommendations.recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Top Career Matches</h2>
                <p className="text-sm text-muted-foreground">Based on your profile</p>
              </div>
            </div>
            <Link 
              to="/careers" 
              className="text-sm text-primary hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.recommendations.slice(0, 3).map((career, index) => (
              <CareerCard key={career.title} career={career} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
