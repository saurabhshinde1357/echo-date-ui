
import { ChatRoom, Message } from '../contexts/ChatContext';
import { authService } from './authService';
import { User } from '../contexts/AuthContext';
import { generateMockMessages } from '../utils/mockData';

// Mock data
let mockChatRooms: ChatRoom[] = [];

export const chatService = {
  getChatRooms: async (): Promise<ChatRoom[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!currentUser || !currentUser.id) {
      return [];
    }
    
    // Get all users that the current user has matched with
    const allUsers = authService.getAllUsers();
    const matches = allUsers.filter(u => 
      currentUser.matches.includes(u.id)
    );
    
    // Create chat rooms based on matches if they don't exist yet
    if (mockChatRooms.length === 0) {
      mockChatRooms = matches.map(match => {
        const mockMessages = generateMockMessages(currentUser.id, match.id, 5);
        const lastMessage = mockMessages.length > 0 ? 
          mockMessages[mockMessages.length - 1] : null;
          
        return {
          id: `chat-${currentUser.id}-${match.id}`,
          participants: [currentUser.id, match.id],
          lastMessage,
          unreadCount: Math.floor(Math.random() * 3) // Random unread count for demo
        };
      });
    }
    
    return mockChatRooms;
  },
  
  getMessages: async (chatId: string): Promise<Message[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!currentUser || !currentUser.id) {
      return [];
    }
    
    const chatRoom = mockChatRooms.find(room => room.id === chatId);
    
    if (!chatRoom) {
      return [];
    }
    
    // Find the other participant in the chat
    const otherUserId = chatRoom.participants.find(id => id !== currentUser.id);
    
    if (!otherUserId) {
      return [];
    }
    
    // Generate mock messages if they don't exist
    return generateMockMessages(currentUser.id, otherUserId, 15);
  },
  
  sendMessage: async (messageData: { chatId: string, text: string, senderId: string }): Promise<Message> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { chatId, text, senderId } = messageData;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      text,
      timestamp: new Date().toISOString()
    };
    
    // Update last message in the chat room
    mockChatRooms = mockChatRooms.map(room => 
      room.id === chatId 
        ? { ...room, lastMessage: newMessage } 
        : room
    );
    
    return newMessage;
  }
};
