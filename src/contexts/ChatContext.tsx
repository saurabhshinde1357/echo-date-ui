
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatService } from '../services/chatService';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage: Message | null;
  unreadCount: number;
}

interface ChatContextType {
  activeChat: string | null;
  chatRooms: ChatRoom[];
  messages: Message[];
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (text: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadChatRooms();
    } else {
      setChatRooms([]);
      setMessages([]);
      setActiveChat(null);
    }
  }, [user]);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat);
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  const loadChatRooms = async () => {
    try {
      const rooms = await chatService.getChatRooms();
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const messagesList = await chatService.getMessages(chatId);
      setMessages(messagesList);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!activeChat || !user) return;

    try {
      const newMessage = await chatService.sendMessage({
        chatId: activeChat,
        text,
        senderId: user.id
      });
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Update chat rooms with the new last message
      setChatRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === activeChat 
            ? { ...room, lastMessage: newMessage } 
            : room
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const loadMoreMessages = async () => {
    if (!activeChat) return;
    
    try {
      // In a real app, would implement pagination
      // For now, just a stub
      return Promise.resolve();
    } catch (error) {
      console.error('Error loading more messages:', error);
      throw error;
    }
  };

  const value = {
    activeChat,
    chatRooms,
    messages,
    setActiveChat,
    sendMessage,
    loadMoreMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
