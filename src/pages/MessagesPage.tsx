import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat, ChatProvider } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, formatDistanceToNow } from 'date-fns';
import { Heart, Send } from 'lucide-react';
import { authService } from '@/services/authService';
import { User } from '@/contexts/AuthContext';

// Chat list component
const ChatList = ({ onSelectChat }: { onSelectChat: (chatId: string, user: User) => void }) => {
  const { chatRooms } = useChat();
  const { user: currentUser } = useAuth();
  const [chatPartners, setChatPartners] = useState<Record<string, User>>({});
  
  useEffect(() => {
    const loadChatPartners = async () => {
      if (!currentUser) return;
      
      const allUsers = authService.getAllUsers();
      const partners: Record<string, User> = {};
      
      chatRooms.forEach(room => {
        const partnerId = room.participants.find(id => id !== currentUser.id);
        if (partnerId) {
          const partner = allUsers.find(u => u.id === partnerId);
          if (partner) {
            partners[room.id] = partner;
          }
        }
      });
      
      setChatPartners(partners);
    };
    
    loadChatPartners();
  }, [chatRooms, currentUser]);

  return (
    <div className="border-r h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-xl">Messages</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-13rem)]">
        <div className="divide-y">
          {chatRooms.length > 0 ? (
            chatRooms.map((room) => {
              const partner = chatPartners[room.id];
              if (!partner) return null;
              
              return (
                <button
                  key={room.id}
                  className="w-full text-left p-4 hover:bg-muted transition-colors flex items-center space-x-3"
                  onClick={() => onSelectChat(room.id, partner)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={partner.photos[0]} />
                      <AvatarFallback className="bg-gradient-love text-white">
                        {partner.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {room.unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{partner.name}</span>
                      {room.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(room.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    {room.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {room.lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                        {room.lastMessage.text}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No conversations yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

// Chat window component
const ChatWindow = ({ selectedUser }: { selectedUser: User | null }) => {
  const { messages, sendMessage } = useChat();
  const { user: currentUser } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    try {
      await sendMessage(inputMessage);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Your messages</h3>
          <p className="text-muted-foreground mt-1">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={selectedUser.photos[0]} />
          <AvatarFallback className="bg-gradient-love text-white">
            {selectedUser.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{selectedUser.name}</h2>
          <p className="text-sm text-muted-foreground">{selectedUser.location}</p>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-2xl p-3 max-w-[80%] ${
                    isCurrentUser
                      ? 'bg-gradient-love text-white rounded-br-none'
                      : 'bg-muted rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-xs ${isCurrentUser ? 'text-white/80' : 'text-muted-foreground'} block mt-1`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Input
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" className="bg-gradient-love hover:opacity-90">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

// Helper function to format message timestamps
const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // If it's today, show the time
  if (date.toDateString() === now.toDateString()) {
    return format(date, 'h:mm a');
  }
  
  // If it's within the last week, show the day
  if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return format(date, 'EEEE');
  }
  
  // Otherwise show the date
  return format(date, 'MM/dd/yyyy');
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return format(date, 'h:mm a');
};

// Main messages page component
const MessagesPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const handleSelectChat = (chatId: string, user: User) => {
    setActiveChat(chatId);
    setSelectedUser(user);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center text-center p-4">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4">You need to be logged in</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your messages</p>
        </div>
      </div>
    );
  }
  
  // We wrap our actual content with the ChatProvider to get chat context
  return (
    <ChatProvider>
      <ChatContent 
        activeChat={activeChat}
        selectedUser={selectedUser}
        handleSelectChat={handleSelectChat}
        setActiveChat={setActiveChat}
      />
    </ChatProvider>
  );
};

// Separate component to access the chat context
const ChatContent = ({ 
  activeChat, 
  selectedUser, 
  handleSelectChat,
  setActiveChat
}: { 
  activeChat: string | null;
  selectedUser: User | null; 
  handleSelectChat: (chatId: string, user: User) => void;
  setActiveChat: (chatId: string | null) => void;
}) => {
  const { setActiveChat: setChatContextActiveChat } = useChat();
  
  useEffect(() => {
    setChatContextActiveChat(activeChat);
  }, [activeChat, setChatContextActiveChat]);
  
  return (
    <div className="container py-4">
      <div className="bg-background border rounded-lg overflow-hidden h-[calc(100vh-10rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          <div className="md:col-span-1 border-r h-full">
            <ChatList onSelectChat={handleSelectChat} />
          </div>
          <div className="md:col-span-2 h-full">
            <ChatWindow selectedUser={selectedUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
