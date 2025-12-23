import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CareerPath } from '@/hooks/useCareerRecommendations';
import { BookOpen, Award, Briefcase, TrendingUp } from 'lucide-react';

interface CareerCardProps {
  career: CareerPath;
  index: number;
}

export function CareerCard({ career, index }: CareerCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">{career.title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {career.description}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary" className="gradient-primary text-primary-foreground">
              {career.matchScore}% Match
            </Badge>
            <div className="w-20">
              <Progress value={career.matchScore} className="h-1.5" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Required Skills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Briefcase className="w-4 h-4 text-primary" />
            Required Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {career.requiredSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <TrendingUp className="w-4 h-4 text-primary" />
            Recommended Next Steps
          </div>
          
          <div className="grid gap-3">
            {/* Courses */}
            {career.nextSteps.courses.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5" />
                  Courses
                </div>
                <ul className="text-sm space-y-1 pl-5">
                  {career.nextSteps.courses.map((course, i) => (
                    <li key={i} className="list-disc text-muted-foreground">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {career.nextSteps.certifications.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Award className="w-3.5 h-3.5" />
                  Certifications
                </div>
                <ul className="text-sm space-y-1 pl-5">
                  {career.nextSteps.certifications.map((cert, i) => (
                    <li key={i} className="list-disc text-muted-foreground">
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practice Areas */}
            {career.nextSteps.practiceAreas.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5" />
                  Practice Areas
                </div>
                <ul className="text-sm space-y-1 pl-5">
                  {career.nextSteps.practiceAreas.map((area, i) => (
                    <li key={i} className="list-disc text-muted-foreground">
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
