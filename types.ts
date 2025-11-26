
export enum Category {
  SOCIAL = 'Project X', // Was Social Party
  RIDE = 'Getaway', // Was Ride Share
  WELLNESS = 'Zen Mode', // Was Morning Walk
  EVENT = 'Main Event', // Was Themed Event
  EDUCATION = 'Skill Tree', // Was Tuition
  CHALLENGE = 'The Gauntlet', // Was Challenge
  SERVICE = 'Side Quest', // Was Stand in Line
  RENTAL = 'Safe House', // Was Rent a Place
  COMPANION = 'NPC Rental', // Was Rent a Friend
  CHAT = 'Confessional', // Was Paid Chat
  ANONYMOUS = 'Ghost Protocol', // Was Anonymous
  OTHERS = 'Glitch / Wildcard' // NEW
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  rating: number;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  category: Category;
  title: string;
  description: string;
  location: string;
  price?: string; // e.g. "$20/hr" or "Free"
  reward?: string; // e.g. "100 Rs" or "My Bike"
  tags: string[];
  timestamp: string;
  attendees: number;
  isAnonymous?: boolean;
  expiresAt?: number; // Timestamp for when the post self-destructs
  minRating?: number; // Minimum rating required to view/join
  isLocationPrivate?: boolean; // If true, location is hidden until shared in chat
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
