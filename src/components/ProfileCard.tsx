
import React from 'react';
import { User } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Heart, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileCardProps {
  user: User;
  onLike: () => void;
  onPass: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onLike, onPass }) => {
  return (
    <Card className="w-full max-w-md overflow-hidden relative h-[550px] bg-background glass-card glass-card-dark">
      <div className="absolute inset-0 rounded-md overflow-hidden">
        <img 
          src={user.photos[0] || "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop"} 
          alt={user.name} 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">{user.name}, {user.age}</h2>
            <p className="text-white/80">{user.location}</p>
          </div>
        </div>

        <p className="mt-3 text-white/90 line-clamp-3">{user.bio}</p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {user.interests.map((interest, index) => (
            <Badge key={index} className="bg-white/20 hover:bg-white/30">
              {interest}
            </Badge>
          ))}
        </div>

        <div className="flex justify-center mt-8 pb-2 gap-4">
          <button 
            onClick={onPass}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-lg transform transition-all hover:scale-110"
            aria-label="Pass"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          
          <button 
            onClick={onLike}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-lg transform transition-all hover:scale-110"
            aria-label="Like"
          >
            <Heart className="w-8 h-8 text-love-600 animate-pulse-heart" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
