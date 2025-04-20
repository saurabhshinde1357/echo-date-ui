
import React from 'react';
import { User } from '@/contexts/AuthContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedUser: User | null;
  currentUser: User | null;
}

const MatchModal: React.FC<MatchModalProps> = ({ 
  isOpen, 
  onClose, 
  matchedUser,
  currentUser
}) => {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    if (matchedUser) {
      // In a real app, navigate to the specific chat
      navigate('/messages');
      onClose();
    }
  };

  if (!matchedUser || !currentUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background border-none">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-love opacity-90"></div>
          
          <div className="relative p-6 flex flex-col items-center">
            <div className="py-6">
              <h2 className="text-3xl font-bold text-white text-center mb-2">It's a Match!</h2>
              <p className="text-white/90 text-center">You and {matchedUser.name} like each other</p>
            </div>
            
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                <img 
                  src={currentUser.photos[0] || "https://via.placeholder.com/150"} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="relative">
                <Heart className="text-white w-8 h-8 animate-pulse-heart" />
              </div>
              
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                <img 
                  src={matchedUser.photos[0] || "https://via.placeholder.com/150"} 
                  alt={matchedUser.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex gap-4 w-full">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={onClose}
              >
                Keep Swiping
              </Button>
              <Button 
                className="flex-1 bg-white text-love-600 hover:bg-white/90"
                onClick={handleMessageClick}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchModal;
