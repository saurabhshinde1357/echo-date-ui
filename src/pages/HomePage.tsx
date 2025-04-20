
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Search, User } from 'lucide-react';
import { authService } from '@/services/authService';
import { User as UserType } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<UserType[]>([]);
  const [recentMatches, setRecentMatches] = useState<UserType[]>([]);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      // Get the user's matches
      const fetchMatches = async () => {
        try {
          const allUsers = authService.getAllUsers();
          const userMatches = allUsers.filter(u => user.matches.includes(u.id));
          setMatches(userMatches);
          
          // Show only the most recent matches for the welcome section
          setRecentMatches(userMatches.slice(0, 3));
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      };
      
      fetchMatches();
    }
  }, [isAuthenticated, user]);
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your <span className="text-gradient">Perfect Match</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join millions of singles discovering meaningful connections every day. 
            Start your dating journey with LoveMeet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="lg" className="bg-gradient-love hover:opacity-90 transition-all">
                Create Account
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card glass-card-dark">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <Heart className="h-12 w-12 text-primary animate-pulse-heart" />
                </div>
                <h3 className="text-xl font-bold mb-2">Match Algorithm</h3>
                <p className="text-muted-foreground">Our smart matching system helps you find compatible partners based on your preferences.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card glass-card-dark">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <User className="h-12 w-12 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verified Profiles</h3>
                <p className="text-muted-foreground">All profiles are thoroughly reviewed to ensure a safe and authentic dating experience.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card glass-card-dark">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <MessageSquare className="h-12 w-12 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Messaging</h3>
                <p className="text-muted-foreground">Connect directly with your matches through our secure and intuitive messaging platform.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      {/* Welcome Section */}
      <section className="mb-10">
        <div className="bg-gradient-love text-white rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src={user?.photos?.[0] || ""} alt={user?.name} />
              <AvatarFallback className="bg-white text-primary text-2xl">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              
              <div className="mb-4">
                {user?.matches?.length ? (
                  <p className="text-white/90">
                    You have {user.matches.length} match{user.matches.length !== 1 ? 'es' : ''}. Continue exploring to find more!
                  </p>
                ) : (
                  <p className="text-white/90">
                    Start swiping to find your perfect match!
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link to="/explore">
                  <Button variant="secondary" className="gap-2">
                    <Search className="w-4 h-4" />
                    Explore
                  </Button>
                </Link>
                <Link to="/messages">
                  <Button variant="secondary" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Messages
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <Card className="glass-card glass-card-dark">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Matches</h3>
              <p className="text-2xl font-bold">{user?.matches?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card glass-card-dark">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full w-12 h-12 bg-secondary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Messages</h3>
              <p className="text-2xl font-bold">{matches.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card glass-card-dark">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full w-12 h-12 bg-accent/10 flex items-center justify-center">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Profile Views</h3>
              <p className="text-2xl font-bold">{Math.floor(Math.random() * 100)}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Matches */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">Recent Matches</h2>
          <Link to="/explore">
            <Button variant="ghost" className="gap-2">
              View All <Search className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {recentMatches.length > 0 ? (
            recentMatches.map((match) => (
              <Card key={match.id} className="glass-card glass-card-dark overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={match.photos[0] || "https://via.placeholder.com/300"} 
                    alt={match.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white">{match.name}, {match.age}</h3>
                    <p className="text-white/80">{match.location}</p>
                  </div>
                </div>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {match.interests.slice(0, 2).map((interest, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                    {match.interests.length > 2 && (
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        +{match.interests.length - 2}
                      </span>
                    )}
                  </div>
                  <Link to="/messages">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center p-10 bg-muted rounded-lg">
              <p className="text-muted-foreground mb-4">No matches yet. Start exploring to find your perfect match!</p>
              <Link to="/explore">
                <Button className="bg-gradient-love hover:opacity-90">Start Exploring</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
