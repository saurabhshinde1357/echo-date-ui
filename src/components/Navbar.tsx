
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, User, Settings, Search, X } from 'lucide-react';
import { ModeToggle } from './ModeToggle';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { name: 'Home', path: '/', icon: <Heart className="w-5 h-5" />, authRequired: true },
    { name: 'Explore', path: '/explore', icon: <Search className="w-5 h-5" />, authRequired: true },
    { name: 'Messages', path: '/messages', icon: <MessageSquare className="w-5 h-5" />, authRequired: true },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" />, authRequired: true },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" />, authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <nav className="container flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="text-2xl font-bold text-gradient">LoveMeet</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {isAuthenticated && (
            <>
              {navigationItems.filter(item => !item.authRequired || isAuthenticated).map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActivePath(item.path) ? "default" : "ghost"} 
                    className={`flex items-center gap-1 transition-all ${
                      isActivePath(item.path) 
                        ? "bg-gradient-love text-white" 
                        : ""
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Button>
                </Link>
              ))}
            </>
          )}
          
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-love hover:opacity-90 transition-opacity">Register</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center ml-4 gap-3">
              <ModeToggle />
              <Button onClick={logout} variant="ghost" size="sm">Logout</Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.photos?.[0] || ""} />
                <AvatarFallback className="bg-gradient-love text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <div className="w-4 h-0.5 bg-foreground"></div>
                <div className="w-4 h-0.5 bg-foreground"></div>
                <div className="w-4 h-0.5 bg-foreground"></div>
              </div>
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-background z-40 animate-fade-in">
          <div className="flex flex-col p-4 space-y-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-4 p-4 border-b">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.photos?.[0] || ""} />
                    <AvatarFallback className="bg-gradient-love text-white">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user?.location}
                    </div>
                  </div>
                </div>
                
                {navigationItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 p-4 rounded-lg ${
                      isActivePath(item.path) 
                        ? "bg-gradient-love text-white" 
                        : "hover:bg-muted"
                    }`}
                  >
                    {item.icon}
                    <span className="text-lg">{item.name}</span>
                  </Link>
                ))}
                
                <Button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }} 
                  className="w-full mt-4"
                  variant="outline"
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-4 p-4">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button className="w-full bg-gradient-love hover:opacity-90 transition-opacity">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
