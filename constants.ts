
import { Category, Post, User, ChatSession } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Alex Doe',
  handle: '@alex_doe',
  avatar: 'https://picsum.photos/200/200?random=99',
  isVerified: true,
  rating: 4.8,
  bio: 'Digital nomad. Always looking for the next adventure. ⚡',
  isPremium: true
};

// Helper to set future time
const minutesFromNow = (mins: number) => Date.now() + mins * 60 * 1000;

export const MOCK_POSTS: Post[] = [
  // EVENTS
  {
    id: '1',
    userId: 'u1',
    user: { id: 'u1', name: 'Sarah Chen', handle: '@sarahc', avatar: 'https://picsum.photos/200/200?random=1', isVerified: true, rating: 4.9, isPremium: true },
    category: Category.EVENT,
    title: 'KDrama Dress-up & Watch Party',
    description: 'Hosting a massive KDrama marathon at a rented villa. Dress code: Joseon Dynasty Hanbok or Modern Chaebol.',
    location: 'Beverly Hills, LA',
    price: '$50 Entry',
    tags: ['Party', 'Social'],
    timestamp: '2h ago',
    attendees: 12,
    isBoosted: true
  },
  {
    id: '10',
    userId: 'me',
    user: CURRENT_USER,
    category: Category.EVENT,
    title: 'Project X Style House Party',
    description: 'Throwing a huge party. Free drinks. Need a DJ though. DM me if you can mix.',
    location: 'Hidden Location',
    price: 'Free',
    tags: ['Wild', 'Music'],
    timestamp: '5h ago',
    attendees: 24,
    isLocationPrivate: true
  },
  
  // TASKS
  {
    id: '3',
    userId: 'u3',
    user: { id: 'u3', name: 'Emily Blunt', handle: '@emilyb', avatar: 'https://picsum.photos/200/200?random=3', isVerified: false, rating: 4.5 },
    category: Category.TASK,
    title: 'Stand in line for Sneakers',
    description: 'The new drop is happening tomorrow at 6 AM. I need someone to hold my spot for 3 hours.',
    location: 'Downtown Mall',
    price: '$30/hr',
    tags: ['Line Waiting', 'Easy Money'],
    timestamp: '30m ago',
    attendees: 2
  },
  {
    id: '20',
    userId: 'u20',
    user: { id: 'u20', name: 'Prof. X', handle: '@professor', avatar: 'https://picsum.photos/200/200?random=20', isVerified: true, rating: 5.0 },
    category: Category.TASK,
    title: 'Advanced Quantum Physics Tutor',
    description: 'Offering private tuition for advanced physics students.',
    location: 'University Library',
    price: '$100/hr',
    tags: ['Tuition', 'Education'],
    timestamp: '1d ago',
    attendees: 3
  },

  // BOUNTIES
  {
    id: '5',
    userId: 'u5',
    user: { id: 'u5', name: 'Jake Paul', handle: '@jakepaul', avatar: 'https://picsum.photos/200/200?random=5', isVerified: true, rating: 4.2 },
    category: Category.BOUNTY,
    title: '10km Run Challenge: Beat 45 Mins',
    description: 'I bet 100 Rs that nobody here can beat my time. Offer expires soon.',
    location: 'City Stadium',
    reward: '100 Rs',
    tags: ['Fitness', 'Bet'],
    timestamp: '15m ago',
    attendees: 5,
    expiresAt: minutesFromNow(45),
    isHighStakes: true,
    difficulty: 85
  },

  // SECRETS
  {
    id: '6',
    userId: 'u6',
    user: { id: 'u6', name: 'Anonymous', handle: 'anonymous', avatar: '', isVerified: false, rating: 0 },
    category: Category.SECRET,
    title: 'Need unbiased advice',
    description: 'I have a situation at work and need a third-party perspective. No names, just chat.',
    location: 'Encrypted Space',
    price: 'Free',
    tags: ['Advice', 'Personal'],
    timestamp: '5m ago',
    attendees: 0,
    isAnonymous: true
  }
];

export const MOCK_CHATS: ChatSession[] = [
  {
    id: 'c1',
    participant: { id: 'u5', name: 'Jessica V.', handle: '@jess_v', avatar: 'https://picsum.photos/200/200?random=5', isVerified: true, rating: 4.9 },
    lastMessage: 'Are you available for the chat session?',
    unreadCount: 2,
    isEncrypted: true
  },
  {
    id: 'c2',
    participant: { id: 'u1', name: 'Sarah Chen', handle: '@sarahc', avatar: 'https://picsum.photos/200/200?random=1', isVerified: true, rating: 4.9 },
    lastMessage: 'The address is 123 Maple Drive.',
    unreadCount: 0,
    isEncrypted: true
  }
];

export const TRENDING_TAGS = [
    { tag: 'EasyMoney', count: '1.2k' },
    { tag: 'NightLife', count: '850' },
    { tag: 'Fitness', count: '540' },
    { tag: 'Confessions', count: '320' },
];
