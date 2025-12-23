import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Profile } from './useProfile';

export interface CareerPath {
  title: string;
  description: string;
  requiredSkills: string[];
  nextSteps: {
    courses: string[];
    certifications: string[];
    practiceAreas: string[];
  };
  matchScore: number;
}

export interface SkillGapItem {
  careerTitle: string;
  missingSkills: string[];
  presentSkills: string[];
}

export interface RoadmapStage {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  estimatedTime: string;
  description: string;
}

export interface CareerRecommendations {
  id: string;
  user_id: string;
  recommendations: CareerPath[];
  skill_gap_analysis: SkillGapItem[];
  learning_roadmap: RoadmapStage[];
  created_at: string;
  updated_at: string;
}

export function useCareerRecommendations() {
  const [recommendations, setRecommendations] = useState<CareerRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('career_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setRecommendations({
          ...data,
          recommendations: (data.recommendations as unknown as CareerPath[]) || [],
          skill_gap_analysis: (data.skill_gap_analysis as unknown as SkillGapItem[]) || [],
          learning_roadmap: (data.learning_roadmap as unknown as RoadmapStage[]) || [],
        });
      }
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async (profile: Profile) => {
    if (!user) return;

    try {
      setGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-career-recommendations', {
        body: {
          profile: {
            educationLevel: profile.education_level,
            skills: profile.skills,
            interests: profile.interests,
            preferredIndustries: profile.preferred_industries,
            careerGoals: profile.career_goals,
          },
        },
      });

      if (error) throw error;

      // Save to database
      const { error: saveError } = await supabase
        .from('career_recommendations')
        .upsert({
          user_id: user.id,
          recommendations: data.recommendations,
          skill_gap_analysis: data.skillGapAnalysis,
          learning_roadmap: data.learningRoadmap,
        });

      if (saveError) throw saveError;

      await fetchRecommendations();
      
      toast({
        title: 'Success',
        description: 'Career recommendations generated!',
      });
    } catch (error: any) {
      console.error('Error generating recommendations:', error);
      
      // Handle rate limiting
      if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
        toast({
          title: 'Rate Limited',
          description: 'Please wait a moment and try again.',
          variant: 'destructive',
        });
      } else if (error.message?.includes('402')) {
        toast({
          title: 'Credits Required',
          description: 'Please add credits to continue using AI features.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to generate recommendations. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  return { recommendations, loading, generating, generateRecommendations, refetch: fetchRecommendations };
}
