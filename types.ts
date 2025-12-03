
export enum Category {
  EVENT = 'Event',
  TASK = 'Task',
  BOUNTY = 'Bounty',
  SECRET = 'Secret'
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
  rating: number;
  bio?: string;
  joinedDate?: string;
  isPremium?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  category: Category;
  title: string;
  description: string;
  location: string;
  price?: string; 
  reward?: string; 
  tags: string[];
  timestamp: string | any; // allow Firestore Timestamp
  attendees: number;
  
  // Safety & Privacy
  isAnonymous?: boolean;
  isLocationPrivate?: boolean; 
  minRating?: number; 
  
  // Bounty Specific
  expiresAt?: number; 
  difficulty?: number; 
  isHighStakes?: boolean;
  
  // Media
  mediaUrl?: string | null;
  
  // Monetization
  isBoosted?: boolean;
  entryFee?: string;
  createdAt?: any;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isSystem?: boolean;
  type?: 'text' | 'location_share' | 'rating_request';
}

export interface ChatSession {
  id: string;
  participant: User;
  lastMessage: string;
  unreadCount: number;
  isEncrypted: boolean;
}

export interface Report {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  timestamp: string;
}
