
import { User } from '../contexts/AuthContext';
import { authService } from './authService';

export const matchService = {
  getProfiles: async (userId: string): Promise<User[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allUsers = authService.getAllUsers();
    const currentUser = allUsers.find(u => u.id === userId);
    
    if (!currentUser) {
      throw new Error('User not found');
    }
    
    // Filter out users that the current user has already liked or matched with
    // Also filter out users of the same gender if we're simulating a straight dating app
    // In a real app, this would be based on user preferences
    return allUsers.filter(u => 
      u.id !== userId && 
      !currentUser.likes.includes(u.id) &&
      !currentUser.matches.includes(u.id) &&
      u.gender !== currentUser.gender
    );
  },
  
  likeUser: async (userId: string, likedUserId: string): Promise<{ match: boolean, user?: User }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allUsers = authService.getAllUsers();
    const currentUser = allUsers.find(u => u.id === userId);
    const likedUser = allUsers.find(u => u.id === likedUserId);
    
    if (!currentUser || !likedUser) {
      throw new Error('User not found');
    }
    
    // Add liked user to current user's likes
    currentUser.likes = [...currentUser.likes, likedUserId];
    
    // Check if this creates a match (if the liked user has already liked the current user)
    const isMatch = likedUser.likes.includes(userId);
    
    if (isMatch) {
      // Add to matches for both users
      currentUser.matches = [...currentUser.matches, likedUserId];
      likedUser.matches = [...likedUser.matches, userId];
    }
    
    // Update the users in our mock database
    authService.updateUsers(
      allUsers.map(u => 
        u.id === userId ? currentUser :
        u.id === likedUserId ? likedUser : u
      )
    );
    
    return {
      match: isMatch,
      user: likedUser
    };
  },
  
  passUser: async (userId: string, passedUserId: string): Promise<void> => {
    // In a real app, you might want to store this info
    // For this demo, we just return without doing anything
    await new Promise(resolve => setTimeout(resolve, 300));
    return;
  }
};
