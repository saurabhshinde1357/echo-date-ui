
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { matchService } from '@/services/matchService';
import { User } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ProfileCard from '@/components/ProfileCard';
import MatchModal from '@/components/MatchModal';
import { Button } from '@/components/ui/button';
import { Heart, X, Filter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

const ExplorePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<User[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);
  
  // Filter states
  const [ageRange, setAgeRange] = useState<number[]>([18, 50]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Animation refs
  const cardRef = useRef<HTMLDivElement>(null);
  const [animationClass, setAnimationClass] = useState('');
  
  // Available interests for filter
  const availableInterests = [
    'Travel', 'Fitness', 'Cooking', 'Reading', 'Photography',
    'Music', 'Art', 'Gaming', 'Hiking', 'Movies'
  ];
  
  useEffect(() => {
    fetchProfiles();
  }, []);
  
  const fetchProfiles = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const fetchedProfiles = await matchService.getProfiles(user.id);
      
      // Apply filters if any
      let filteredProfiles = fetchedProfiles;
      if (ageRange[0] !== 18 || ageRange[1] !== 50) {
        filteredProfiles = filteredProfiles.filter(
          p => p.age >= ageRange[0] && p.age <= ageRange[1]
        );
      }
      if (selectedInterests.length > 0) {
        filteredProfiles = filteredProfiles.filter(
          p => p.interests.some(i => selectedInterests.includes(i))
        );
      }
      
      setProfiles(filteredProfiles);
      setCurrentProfileIndex(0);
      setNoMoreProfiles(filteredProfiles.length === 0);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profiles. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || currentProfileIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentProfileIndex];
    setAnimationClass('animate-swipe-right');
    
    try {
      const result = await matchService.likeUser(user.id, currentProfile.id);
      
      if (result.match) {
        // We have a match!
        setMatchedUser(currentProfile);
        
        // Allow animation to complete before showing modal
        setTimeout(() => {
          setShowMatchModal(true);
        }, 500);
      } else {
        toast({
          title: "Liked!",
          description: `You liked ${currentProfile.name}.`,
        });
      }
      
      // Move to next profile after animation completes
      setTimeout(() => {
        setAnimationClass('');
        setCurrentProfileIndex(prevIndex => prevIndex + 1);
        
        if (currentProfileIndex === profiles.length - 1) {
          setNoMoreProfiles(true);
        }
      }, 500);
    } catch (error) {
      console.error('Error liking profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like profile. Please try again.",
      });
    }
  };
  
  const handlePass = async () => {
    if (!user || currentProfileIndex >= profiles.length) return;
    
    const currentProfile = profiles[currentProfileIndex];
    setAnimationClass('animate-swipe-left');
    
    try {
      await matchService.passUser(user.id, currentProfile.id);
      
      // Move to next profile after animation completes
      setTimeout(() => {
        setAnimationClass('');
        setCurrentProfileIndex(prevIndex => prevIndex + 1);
        
        if (currentProfileIndex === profiles.length - 1) {
          setNoMoreProfiles(true);
        }
      }, 500);
    } catch (error) {
      console.error('Error passing profile:', error);
    }
  };
  
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const applyFilters = () => {
    fetchProfiles();
  };
  
  const resetFilters = () => {
    setAgeRange([18, 50]);
    setSelectedInterests([]);
  };

  return (
    <div className="container py-8 min-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Explore</h1>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Customize your discovery preferences</SheetDescription>
            </SheetHeader>
            
            <div className="py-6 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Age Range</Label>
                  <span className="text-sm text-muted-foreground">
                    {ageRange[0]} - {ageRange[1]}
                  </span>
                </div>
                <Slider
                  value={ageRange}
                  min={18}
                  max={80}
                  step={1}
                  onValueChange={setAgeRange}
                  className="my-6"
                />
              </div>
              
              <div className="space-y-4">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={resetFilters}>
                  Reset
                </Button>
                <Button className="flex-1 bg-gradient-love" onClick={applyFilters}>
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <p>Finding profiles near you...</p>
          </div>
        ) : noMoreProfiles || profiles.length === 0 ? (
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No more profiles</h2>
            <p className="text-muted-foreground mb-6">
              We've run out of profiles to show you. Try adjusting your filters or check back later for new matches.
            </p>
            <Button onClick={fetchProfiles} className="bg-gradient-love hover:opacity-90">
              Refresh
            </Button>
          </div>
        ) : (
          <div className={`${animationClass} max-w-md w-full mx-auto`}>
            <div ref={cardRef}>
              <ProfileCard
                user={profiles[currentProfileIndex]}
                onLike={handleLike}
                onPass={handlePass}
              />
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <Button
                onClick={handlePass}
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-full"
                aria-label="Pass"
              >
                <X className="h-8 w-8 text-red-500" />
              </Button>
              
              <Button
                onClick={handleLike}
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-full"
                aria-label="Like"
              >
                <Heart className="h-8 w-8 text-love-600 animate-pulse-heart" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedUser={matchedUser}
        currentUser={user}
      />
    </div>
  );
};

export default ExplorePage;
