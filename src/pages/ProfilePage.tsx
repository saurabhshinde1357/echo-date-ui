
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type EditableUserFields = {
  name: string;
  age: number;
  bio: string;
  location: string;
  interests: string[];
};

const ProfilePage = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState<EditableUserFields>({
    name: user?.name || '',
    age: user?.age || 18,
    bio: user?.bio || '',
    location: user?.location || '',
    interests: user?.interests || []
  });
  const [newInterest, setNewInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEditOpen = () => {
    setEditableUser({
      name: user?.name || '',
      age: user?.age || 18,
      bio: user?.bio || '',
      location: user?.location || '',
      interests: user?.interests || []
    });
    setIsEditing(true);
  };
  
  const handleEditClose = () => {
    setIsEditing(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value, 10) : value
    }));
  };
  
  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (editableUser.interests.includes(newInterest.trim())) {
      toast({
        title: "Interest already exists",
        description: "This interest is already in your profile",
        variant: "destructive"
      });
      return;
    }
    
    setEditableUser(prev => ({
      ...prev,
      interests: [...prev.interests, newInterest.trim()]
    }));
    setNewInterest('');
  };
  
  const handleRemoveInterest = (interest: string) => {
    setEditableUser(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const updatedUser = await profileService.updateProfile(user.id, editableUser);
      updateUser(updatedUser);
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center text-center p-4">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4">You need to be logged in</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your profile</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 max-w-4xl">
      <Card className="glass-card glass-card-dark">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-40 h-40 border-4 border-primary/20">
                <AvatarImage src={user.photos[0] || ""} />
                <AvatarFallback className="text-4xl bg-gradient-love text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleEditOpen}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{user.name}, {user.age}</h1>
                <p className="text-muted-foreground">{user.location}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">About Me</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{user.bio || "No bio yet."}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                  {user.interests.length === 0 && (
                    <p className="text-muted-foreground">No interests added yet.</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-muted-foreground text-sm">Matches</p>
                    <p className="text-2xl font-bold">{user.matches.length}</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-muted-foreground text-sm">Likes Given</p>
                    <p className="text-2xl font-bold">{user.likes.length}</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-muted-foreground text-sm">Profile Views</p>
                    <p className="text-2xl font-bold">{Math.floor(Math.random() * 100)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={editableUser.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min={18}
                value={editableUser.age}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="City, State"
                value={editableUser.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                placeholder="Tell us about yourself"
                value={editableUser.bio}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editableUser.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 hover:text-destructive focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add interest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddInterest} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleEditClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProfile} 
              className="bg-gradient-love hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
