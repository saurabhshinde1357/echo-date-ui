
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, Search, User } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  
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
  
  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-[90vh] flex flex-col items-center justify-center text-center p-4">
          <div className="max-w-3xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Find Your <span className="text-gradient animate-pulse">Perfect Match</span>
            </motion.h1>
            <motion.p 
              className="text-xl mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Join millions of singles discovering meaningful connections every day. 
              Start your dating journey with LoveMeet.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link to="/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-hover-effect"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-love hover:opacity-90 transition-all btn-hover-effect"
                >
                  Create Account
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item}>
                <Card className="glass-card glass-card-dark hover:translate-y-[-10px]">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-4">
                      <Heart className="h-12 w-12 text-primary animate-pulse-heart" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Match Algorithm</h3>
                    <p className="text-muted-foreground">Our smart matching system helps you find compatible partners based on your preferences.</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={item}>
                <Card className="glass-card glass-card-dark hover:translate-y-[-10px]">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-4">
                      <User className="h-12 w-12 text-secondary animate-float" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Verified Profiles</h3>
                    <p className="text-muted-foreground">All profiles are thoroughly reviewed to ensure a safe and authentic dating experience.</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={item}>
                <Card className="glass-card glass-card-dark hover:translate-y-[-10px]">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center mb-4">
                      <MessageSquare className="h-12 w-12 text-accent animate-wiggle" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Instant Messaging</h3>
                    <p className="text-muted-foreground">Connect directly with your matches through our secure and intuitive messaging platform.</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container py-8 px-4">
        {/* Welcome Section */}
        <motion.section 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-love text-white rounded-2xl p-8 animated-gradient">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3 
                }}
              >
                <Avatar className="w-24 h-24 border-4 border-white glow-effect">
                  <AvatarImage src={user?.photos?.[0] || ""} alt={user?.name} />
                  <AvatarFallback className="bg-white text-primary text-2xl">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              <div className="flex-1">
                <motion.h1 
                  className="text-3xl font-bold mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Welcome back, {user?.name?.split(' ')[0]}!
                </motion.h1>
                
                <motion.div 
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {user?.matches?.length ? (
                    <p className="text-white/90">
                      You have {user.matches.length} match{user.matches.length !== 1 ? 'es' : ''}. Continue exploring to find more!
                    </p>
                  ) : (
                    <p className="text-white/90">
                      Start swiping to find your perfect match!
                    </p>
                  )}
                </motion.div>
                
                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link to="/explore">
                    <Button variant="secondary" className="gap-2 btn-hover-effect">
                      <Search className="w-4 h-4" />
                      Explore
                    </Button>
                  </Link>
                  <Link to="/messages">
                    <Button variant="secondary" className="gap-2 btn-hover-effect">
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-card glass-card-dark">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary animate-pulse-heart" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Matches</h3>
                  <p className="text-2xl font-bold">{user?.matches?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-card glass-card-dark">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="rounded-full w-12 h-12 bg-secondary/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-secondary animate-float" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Messages</h3>
                  <p className="text-2xl font-bold">{matches.length || 0}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="glass-card glass-card-dark">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="rounded-full w-12 h-12 bg-accent/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-accent animate-wiggle" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Profile Views</h3>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 100)}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Recent Matches */}
        <motion.section 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
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
              recentMatches.map((match, index) => (
                <motion.div 
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 * (index + 1) }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Card className="glass-card glass-card-dark overflow-hidden">
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
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center p-10 bg-muted rounded-lg animate-appear">
                <p className="text-muted-foreground mb-4">No matches yet. Start exploring to find your perfect match!</p>
                <Link to="/explore">
                  <Button className="bg-gradient-love hover:opacity-90 btn-hover-effect">Start Exploring</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </PageTransition>
  );
};

export default HomePage;
