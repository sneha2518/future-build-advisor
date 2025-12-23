import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Save, Briefcase, GraduationCap, Heart, Building } from 'lucide-react';

const Profile = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { user } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({ full_name: fullName });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl gradient-primary">
          <User className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={user?.email || ''}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Member Since</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Career Profile Summary */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Career Profile Summary</CardTitle>
            <CardDescription>Your career preferences at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Education */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <GraduationCap className="w-4 h-4 text-primary" />
                Education Level
              </div>
              <Badge variant="secondary">
                {profile?.education_level || 'Not set'}
              </Badge>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Briefcase className="w-4 h-4 text-primary" />
                Skills ({profile?.skills?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1">
                {profile?.skills?.slice(0, 5).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {(profile?.skills?.length || 0) > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{profile!.skills.length - 5} more
                  </Badge>
                )}
                {(!profile?.skills || profile.skills.length === 0) && (
                  <span className="text-sm text-muted-foreground">No skills added</span>
                )}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Heart className="w-4 h-4 text-primary" />
                Interests ({profile?.interests?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1">
                {profile?.interests?.slice(0, 5).map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {(profile?.interests?.length || 0) > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{profile!.interests.length - 5} more
                  </Badge>
                )}
                {(!profile?.interests || profile.interests.length === 0) && (
                  <span className="text-sm text-muted-foreground">No interests added</span>
                )}
              </div>
            </div>

            {/* Industries */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Building className="w-4 h-4 text-primary" />
                Preferred Industries ({profile?.preferred_industries?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1">
                {profile?.preferred_industries?.slice(0, 4).map((industry) => (
                  <Badge key={industry} variant="outline" className="text-xs">
                    {industry}
                  </Badge>
                ))}
                {(profile?.preferred_industries?.length || 0) > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{profile!.preferred_industries.length - 4} more
                  </Badge>
                )}
                {(!profile?.preferred_industries || profile.preferred_industries.length === 0) && (
                  <span className="text-sm text-muted-foreground">No industries selected</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
