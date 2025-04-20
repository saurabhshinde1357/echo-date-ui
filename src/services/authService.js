
import { generateMockUsers } from '../utils/mockData';

// Mock users for demo purposes
const mockUsers = generateMockUsers(20);
let registeredUsers = [...mockUsers];

// In a real app, these functions would make API calls
export const authService = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }
    
    return user;
  },
  
  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (registeredUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('Email already in use');
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      age: userData.age,
      gender: userData.gender,
      bio: userData.bio || '',
      location: userData.location || '',
      photos: userData.photos || [],
      interests: userData.interests || [],
      likes: [],
      matches: []
    };
    
    registeredUsers = [...registeredUsers, newUser];
    return newUser;
  },
  
  // For development purposes - to access mock data from other services
  getAllUsers: () => registeredUsers,
  updateUsers: (users) => {
    registeredUsers = users;
  }
};
