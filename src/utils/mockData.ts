
import { User } from '../contexts/AuthContext';
import { Message } from '../contexts/ChatContext';

// List of possible user interests
const interests = [
  'Travel', 'Fitness', 'Cooking', 'Reading', 'Photography',
  'Music', 'Art', 'Gaming', 'Hiking', 'Movies', 'Dancing',
  'Coffee', 'Wine', 'Yoga', 'Surfing', 'Tech', 'Cycling'
];

// List of possible locations
const locations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
  'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Seattle, WA'
];

// Mock user photos (placeholder URLs)
const malePhotos = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop'
];

const femalePhotos = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=800&auto=format&fit=crop'
];

// Helper function to get random items from an array
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a random user
const generateRandomUser = (id: number, gender: 'male' | 'female'): User => {
  const firstName = gender === 'male' 
    ? ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles'][Math.floor(Math.random() * 10)]
    : ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'][Math.floor(Math.random() * 10)];
    
  const lastName = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'][Math.floor(Math.random() * 10)];
  
  // Bios for male and female profiles
  const maleBios = [
    "Adventure seeker and coffee enthusiast. Love exploring new hiking trails on weekends.",
    "Software developer by day, amateur chef by night. Looking for someone to taste test my creations.",
    "Passionate about fitness, photography, and finding the perfect pizza place.",
    "Music lover and concert-goer. Let's talk about our favorite bands and maybe catch a show together.",
    "Outdoorsy type who enjoys camping and stargazing. Can name most constellations (but might make some up too)."
  ];
  
  const femaleBios = [
    "Travel addict with a passport full of stamps and a head full of stories.",
    "Bookworm and tea lover. Always looking for recommendations for both.",
    "Yoga instructor who enjoys hiking and quiet evenings with good conversation.",
    "Art museum enthusiast and amateur painter. Looking for someone to share gallery days with.",
    "Dog lover and beach volleyball player. My golden retriever approves all my dates."
  ];
  
  const photos = gender === 'male' ? getRandomItems(malePhotos, 1) : getRandomItems(femalePhotos, 1);
  
  return {
    id: `user-${id}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}@example.com`,
    age: Math.floor(Math.random() * 15) + 25, // 25-40
    gender,
    bio: gender === 'male' 
      ? maleBios[Math.floor(Math.random() * maleBios.length)]
      : femaleBios[Math.floor(Math.random() * femaleBios.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    photos,
    interests: getRandomItems(interests, Math.floor(Math.random() * 5) + 2), // 2-6 interests
    likes: [],
    matches: []
  };
};

// Generate a list of mock users
export const generateMockUsers = (count: number): User[] => {
  const users: User[] = [];
  
  // Create half male, half female
  for (let i = 0; i < count / 2; i++) {
    users.push(generateRandomUser(i, 'male'));
  }
  
  for (let i = count / 2; i < count; i++) {
    users.push(generateRandomUser(i, 'female'));
  }
  
  // Add a special test user
  users.push({
    id: 'test-user',
    name: 'Test User',
    email: 'test@example.com',
    age: 30,
    gender: 'male',
    bio: 'This is a test account for demo purposes. Login with test@example.com and password123.',
    location: 'San Francisco, CA',
    photos: [malePhotos[0]],
    interests: ['Tech', 'Travel', 'Cooking'],
    likes: [],
    matches: []
  });
  
  return users;
};

// Mock conversation messages
const conversationStarters = [
  "Hey there! How's your day going?",
  "I noticed you like [interest]. What got you into that?",
  "Your profile made me smile. What brings you to this app?",
  "Hi! What's the story behind your profile picture?",
  "If you could travel anywhere right now, where would you go?"
];

const conversationReplies = [
  "Hey! Pretty good, thanks for asking. How about you?",
  "I've been into it since college. It's been a passion ever since!",
  "Just looking to meet new people. Your profile caught my eye!",
  "That was taken during my trip to [location] last year. One of my favorite memories!",
  "Definitely Japan! It's been on my bucket list forever. How about you?"
];

const followUpMessages = [
  "I'm doing well! Any exciting plans for the weekend?",
  "That's awesome! I'm actually pretty new to it myself.",
  "Thanks! What are you looking for on here?",
  "That sounds amazing! I love traveling too.",
  "I'd choose Italy for the food alone. Are you a foodie too?"
];

// Generate mock messages for a conversation
export const generateMockMessages = (userId1: string, userId2: string, count: number): Message[] => {
  const messages: Message[] = [];
  const now = new Date();
  
  // Start with conversation opener
  const starter = conversationStarters[Math.floor(Math.random() * conversationStarters.length)];
  messages.push({
    id: `msg-${Date.now()}-1`,
    senderId: userId1,
    text: starter,
    timestamp: new Date(now.getTime() - 1000000).toISOString()
  });
  
  // Add reply
  const reply = conversationReplies[Math.floor(Math.random() * conversationReplies.length)];
  messages.push({
    id: `msg-${Date.now()}-2`,
    senderId: userId2,
    text: reply,
    timestamp: new Date(now.getTime() - 900000).toISOString()
  });
  
  // Add follow-up
  const followUp = followUpMessages[Math.floor(Math.random() * followUpMessages.length)];
  messages.push({
    id: `msg-${Date.now()}-3`,
    senderId: userId1,
    text: followUp,
    timestamp: new Date(now.getTime() - 800000).toISOString()
  });
  
  // Generate additional random messages
  const messageTemplates = [
    "What do you think about [topic]?",
    "Have you ever been to [location]?",
    "I just watched [movie]. Have you seen it?",
    "Do you have any recommendations for [activity] in [location]?",
    "Tell me more about your interest in [interest].",
    "That's interesting! I also enjoy [activity].",
    "What's your favorite [category]?",
    "How long have you been [activity]?",
    "I'd love to hear more about that!",
    "That sounds like a great experience.",
    "Have you tried [restaurant/place] in your area?",
    "What do you usually do on weekends?",
    "I'm thinking of taking up [hobby]. Any tips?",
    "Do you prefer [option1] or [option2]?",
    "What's your ideal date?"
  ];
  
  for (let i = 3; i < count; i++) {
    const sender = Math.random() > 0.5 ? userId1 : userId2;
    const message = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
    const timestamp = new Date(now.getTime() - (count - i) * 100000);
    
    messages.push({
      id: `msg-${Date.now()}-${i+1}`,
      senderId: sender,
      text: message,
      timestamp: timestamp.toISOString()
    });
  }
  
  return messages.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};
