import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkillGapItem } from '@/hooks/useCareerRecommendations';
import { CheckCircle2, XCircle, Target } from 'lucide-react';

interface SkillGapCardProps {
  skillGap: SkillGapItem;
  index: number;
}

export function SkillGapCard({ skillGap, index }: SkillGapCardProps) {
  const totalSkills = skillGap.missingSkills.length + skillGap.presentSkills.length;
  const completionRate = totalSkills > 0 
    ? Math.round((skillGap.presentSkills.length / totalSkills) * 100) 
    : 0;

  return (
    <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {skillGap.careerTitle}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={completionRate >= 70 ? 'bg-success/10 text-success' : completionRate >= 40 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}
          >
            {completionRate}% Ready
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Skills You Have */}
        {skillGap.presentSkills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-success">
              <CheckCircle2 className="w-4 h-4" />
              Skills You Have ({skillGap.presentSkills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillGap.presentSkills.map((skill) => (
                <Badge key={skill} className="bg-success/10 text-success border-success/20">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills to Develop */}
        {skillGap.missingSkills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-accent">
              <XCircle className="w-4 h-4" />
              Skills to Develop ({skillGap.missingSkills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillGap.missingSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="border-accent/30 text-accent">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Skill Coverage</span>
            <span>{skillGap.presentSkills.length}/{totalSkills} skills</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
