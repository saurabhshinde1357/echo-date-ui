
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatService } from '../services/chatService';

const ChatContext = createContext(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export function ChatProvider({ children }) {
  const [activeChat, setActiveChat] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
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

  const loadMessages = async (chatId) => {
    try {
      const messagesList = await chatService.getMessages(chatId);
      setMessages(messagesList);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (text) => {
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
