import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoadmapStage } from '@/hooks/useCareerRecommendations';
import { Map, Clock, ChevronRight, Sparkles, BookOpen, Rocket } from 'lucide-react';

interface RoadmapSectionProps {
  roadmap: RoadmapStage[];
}

const levelIcons = {
  Beginner: BookOpen,
  Intermediate: Sparkles,
  Advanced: Rocket,
};

const levelColors = {
  Beginner: 'bg-info/10 text-info border-info/20',
  Intermediate: 'bg-warning/10 text-warning border-warning/20',
  Advanced: 'bg-success/10 text-success border-success/20',
};

export function RoadmapSection({ roadmap }: RoadmapSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg gradient-primary">
          <Map className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Your Learning Roadmap</h2>
          <p className="text-sm text-muted-foreground">
            A step-by-step guide to achieving your career goals
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-info via-warning to-success hidden md:block" />

        <div className="space-y-4">
          {roadmap.map((stage, index) => {
            const Icon = levelIcons[stage.level];
            const colorClass = levelColors[stage.level];

            return (
              <Card 
                key={stage.level} 
                className="border-0 shadow-lg md:ml-12 relative animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Timeline dot */}
                <div className={`absolute -left-[3.25rem] top-6 w-4 h-4 rounded-full border-2 ${colorClass} bg-card hidden md:block`} />
                
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {stage.level} Stage
                    </CardTitle>
                    <Badge variant="outline" className="self-start sm:self-auto gap-1">
                      <Clock className="w-3 h-3" />
                      {stage.estimatedTime}
                    </Badge>
                  </div>
                  <CardDescription>{stage.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Skills to Master:</p>
                    <div className="flex flex-wrap gap-2">
                      {stage.skills.map((skill) => (
                        <Badge key={skill} className={colorClass}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                {/* Arrow to next stage */}
                {index < roadmap.length - 1 && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:block">
                    <div className="p-1 rounded-full bg-card shadow-md">
                      <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
