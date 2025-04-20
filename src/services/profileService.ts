
import { User } from '../contexts/AuthContext';
import { authService } from './authService';

export const profileService = {
  getProfile: async (userId: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const allUsers = authService.getAllUsers();
    const user = allUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  },
  
  updateProfile: async (userId: string, profileData: Partial<User>): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allUsers = authService.getAllUsers();
    const userIndex = allUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user
    const updatedUser = {
      ...allUsers[userIndex],
      ...profileData,
      // Don't allow updating certain fields through this method
      id: allUsers[userIndex].id,
      email: allUsers[userIndex].email,
    };
    
    // Update in our mock database
    authService.updateUsers([
      ...allUsers.slice(0, userIndex),
      updatedUser,
      ...allUsers.slice(userIndex + 1)
    ]);
    
    return updatedUser;
  }
};
