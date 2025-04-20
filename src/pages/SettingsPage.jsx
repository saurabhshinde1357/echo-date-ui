
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ModeToggle } from '@/components/ModeToggle';
import { useToast } from '@/components/ui/use-toast';
import { Moon, Bell, Lock, User, AlertTriangle } from 'lucide-react';

const SettingsPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  
  const handleDeleteAccount = () => {
    // In a real app, this would call an API
    toast({
      title: "Account deleted",
      description: "Your account has been successfully deleted.",
    });
    
    setTimeout(() => {
      logout();
      navigate('/');
    }, 1000);
  };
  
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center text-center p-4">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4">You need to be logged in</h1>
          <p className="text-muted-foreground mb-6">Please log in to access settings</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8">
        {/* Account Settings */}
        <Card className="glass-card glass-card-dark">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Account Settings</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => navigate('/profile')}>
                  Edit Profile
                </Button>
                
                <Button variant="outline" onClick={() => navigate('/change-password')}>
                  Change Password
                </Button>
              </div>
              
              <div className="pt-4">
                <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Delete Account</AlertTitle>
                  <AlertDescription>
                    This will permanently delete your account and all your data. This action cannot be undone.
                    
                    <div className="mt-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Delete My Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account
                              and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notification Settings */}
        <Card className="glass-card glass-card-dark">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-muted-foreground text-sm">Receive emails about new matches and messages</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                    <p className="text-muted-foreground text-sm">Get alerts for matches, messages, and likes</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy Settings */}
        <Card className="glass-card glass-card-dark">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Privacy Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility" className="text-base">Profile Visibility</Label>
                    <p className="text-muted-foreground text-sm">Make your profile visible to other users</p>
                  </div>
                  <Switch
                    id="profile-visibility"
                    checked={profileVisibility}
                    onCheckedChange={setProfileVisibility}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="location-sharing" className="text-base">Location Sharing</Label>
                    <p className="text-muted-foreground text-sm">Allow the app to access and share your location</p>
                  </div>
                  <Switch
                    id="location-sharing"
                    checked={locationSharing}
                    onCheckedChange={setLocationSharing}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Appearance Settings */}
        <Card className="glass-card glass-card-dark">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Moon className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Appearance Settings</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-muted-foreground text-sm">Switch between light and dark themes</p>
                </div>
                <ModeToggle />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
