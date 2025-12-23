import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/hooks/useProfile';
import { X, Plus, Sparkles, Save } from 'lucide-react';

interface ProfileFormProps {
  profile: Profile | null;
  onSave: (updates: Partial<Profile>) => Promise<boolean>;
  onGenerate: () => void;
  generating: boolean;
  saving?: boolean;
}

const educationLevels = [
  'High School',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Other',
];

const suggestedSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Data Analysis',
  'Machine Learning', 'UI/UX Design', 'Project Management', 'Communication',
  'Leadership', 'Problem Solving', 'Critical Thinking', 'Teamwork',
  'Time Management', 'Excel', 'Public Speaking', 'Writing',
];

const suggestedInterests = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
  'Design', 'Research', 'Entrepreneurship', 'Sustainability', 'AI/ML',
  'Data Science', 'Cybersecurity', 'Cloud Computing', 'Mobile Development',
];

const suggestedIndustries = [
  'Technology', 'Healthcare', 'Finance & Banking', 'Education',
  'E-commerce', 'Consulting', 'Media & Entertainment', 'Manufacturing',
  'Real Estate', 'Automotive', 'Aerospace', 'Energy',
];

export function ProfileForm({ profile, onSave, onGenerate, generating, saving }: ProfileFormProps) {
  const [educationLevel, setEducationLevel] = useState(profile?.education_level || '');
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [industries, setIndustries] = useState<string[]>(profile?.preferred_industries || []);
  const [careerGoals, setCareerGoals] = useState(profile?.career_goals || '');
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setEducationLevel(profile.education_level || '');
      setSkills(profile.skills || []);
      setInterests(profile.interests || []);
      setIndustries(profile.preferred_industries || []);
      setCareerGoals(profile.career_goals || '');
    }
  }, [profile]);

  const addItem = (item: string, list: string[], setList: (items: string[]) => void) => {
    if (item.trim() && !list.includes(item.trim())) {
      setList([...list, item.trim()]);
    }
  };

  const removeItem = (item: string, list: string[], setList: (items: string[]) => void) => {
    setList(list.filter((i) => i !== item));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({
      education_level: educationLevel,
      skills,
      interests,
      preferred_industries: industries,
      career_goals: careerGoals,
    });
    setIsSaving(false);
  };

  const isProfileComplete = educationLevel && skills.length > 0 && interests.length > 0;

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Your Career Profile
        </CardTitle>
        <CardDescription>
          Tell us about yourself to get personalized career recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Education Level */}
        <div className="space-y-2">
          <Label>Education Level</Label>
          <Select value={educationLevel} onValueChange={setEducationLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select your education level" />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <Label>Skills</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem(newSkill, skills, setSkills);
                  setNewSkill('');
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                addItem(newSkill, skills, setSkills);
                setNewSkill('');
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeItem(skill, skills, setSkills)}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestedSkills
              .filter((s) => !skills.includes(s))
              .slice(0, 8)
              .map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addItem(skill, skills, setSkills)}
                  className="text-xs px-2 py-1 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  + {skill}
                </button>
              ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <Label>Interests</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add an interest..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem(newInterest, interests, setInterests);
                  setNewInterest('');
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                addItem(newInterest, interests, setInterests);
                setNewInterest('');
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="gap-1 pr-1">
                {interest}
                <button
                  type="button"
                  onClick={() => removeItem(interest, interests, setInterests)}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestedInterests
              .filter((i) => !interests.includes(i))
              .slice(0, 6)
              .map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => addItem(interest, interests, setInterests)}
                  className="text-xs px-2 py-1 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  + {interest}
                </button>
              ))}
          </div>
        </div>

        {/* Preferred Industries */}
        <div className="space-y-3">
          <Label>Preferred Industries</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add an industry..."
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem(newIndustry, industries, setIndustries);
                  setNewIndustry('');
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                addItem(newIndustry, industries, setIndustries);
                setNewIndustry('');
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <Badge key={industry} variant="secondary" className="gap-1 pr-1">
                {industry}
                <button
                  type="button"
                  onClick={() => removeItem(industry, industries, setIndustries)}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestedIndustries
              .filter((i) => !industries.includes(i))
              .slice(0, 6)
              .map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => addItem(industry, industries, setIndustries)}
                  className="text-xs px-2 py-1 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  + {industry}
                </button>
              ))}
          </div>
        </div>

        {/* Career Goals */}
        <div className="space-y-2">
          <Label>Career Goals (Optional)</Label>
          <Textarea
            placeholder="Describe your career aspirations, what kind of work environment you prefer, or any specific roles you're interested in..."
            value={careerGoals}
            onChange={(e) => setCareerGoals(e.target.value)}
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleSave}
            variant="outline"
            className="flex-1"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
          <Button
            onClick={onGenerate}
            variant="hero"
            className="flex-1"
            disabled={!isProfileComplete || generating}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {generating ? 'Generating...' : 'Get AI Recommendations'}
          </Button>
        </div>

        {!isProfileComplete && (
          <p className="text-sm text-muted-foreground text-center">
            Complete your education level, skills, and interests to get personalized recommendations
          </p>
        )}
      </CardContent>
    </Card>
  );
}
