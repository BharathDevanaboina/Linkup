
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
  // --- HIGHLIGHTS ---
  {
    id: '1',
    userId: 'u1',
    user: { id: 'u1', name: 'Sarah Chen', handle: '@sarahc', avatar: 'https://picsum.photos/200/200?random=1', isVerified: true, rating: 4.9, isPremium: true },
    category: Category.EVENT,
    title: 'KDrama Dress-up & Watch Party',
    description: 'Hosting a massive KDrama marathon at a rented villa. Dress code: Joseon Dynasty Hanbok or Modern Chaebol. Soju provided!',
    location: 'Beverly Hills, LA',
    price: '$50 Entry',
    tags: ['Party', 'Social', 'K-Pop'],
    timestamp: '2h ago',
    attendees: 12,
    isBoosted: true
  },
  {
    id: '5',
    userId: 'u5',
    user: { id: 'u5', name: 'Jake Paul', handle: '@jakepaul', avatar: 'https://picsum.photos/200/200?random=5', isVerified: true, rating: 4.2 },
    category: Category.BOUNTY,
    title: '10km Run Challenge: Beat 45 Mins',
    description: 'I bet 100 Rs that nobody here can beat my time. Offer expires soon. Proof required via Strava link.',
    location: 'City Stadium',
    reward: '100 Rs',
    tags: ['Fitness', 'Bet', 'Running'],
    timestamp: '15m ago',
    attendees: 5,
    expiresAt: minutesFromNow(45),
    isHighStakes: true,
    difficulty: 85
  },

  // --- EVENTS ---
  {
    id: '10',
    userId: 'me',
    user: CURRENT_USER,
    category: Category.EVENT,
    title: 'Project X Style House Party',
    description: 'Throwing a huge party. Free drinks. Need a DJ though. DM me if you can mix. No narcs.',
    location: 'Hidden Location',
    price: 'Free',
    tags: ['Wild', 'Music', 'Nightlife'],
    timestamp: '5h ago',
    attendees: 24,
    isLocationPrivate: true
  },
  {
    id: '11',
    userId: 'u11',
    user: { id: 'u11', name: 'Midnight Rider', handle: '@rider_x', avatar: 'https://picsum.photos/200/200?random=11', isVerified: false, rating: 4.7 },
    category: Category.EVENT,
    title: 'Late Night Motorcycle Cruise',
    description: 'Meeting at the old gas station at midnight. Cruising down the coastal highway. All bikes welcome. Safe ride, no stunts.',
    location: 'Shell Station, Route 66',
    price: 'Free',
    tags: ['Bikes', 'Cruise', 'Late Night'],
    timestamp: '1h ago',
    attendees: 8
  },
  {
    id: '12',
    userId: 'u12',
    user: { id: 'u12', name: 'Emma Watson', handle: '@emma_reads', avatar: 'https://picsum.photos/200/200?random=12', isVerified: true, rating: 5.0 },
    category: Category.EVENT,
    title: 'Silent Book Club',
    description: 'Bring your own book, read in silence for an hour, then socialize (optional). Coffee is on me.',
    location: 'Central Park, West Bench',
    price: 'Free',
    tags: ['Chill', 'Books', 'Introvert Friendly'],
    timestamp: '3h ago',
    attendees: 15
  },

  // --- TASKS ---
  {
    id: '3',
    userId: 'u3',
    user: { id: 'u3', name: 'Emily Blunt', handle: '@emilyb', avatar: 'https://picsum.photos/200/200?random=3', isVerified: false, rating: 4.5 },
    category: Category.TASK,
    title: 'Stand in line for Sneakers',
    description: 'The new drop is happening tomorrow at 6 AM. I need someone to hold my spot for 3 hours. Will bring you coffee.',
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
    description: 'Offering private tuition for advanced physics students. I can help with thesis preparation.',
    location: 'University Library',
    price: '$100/hr',
    tags: ['Tuition', 'Education', 'Stem'],
    timestamp: '1d ago',
    attendees: 3
  },
  {
    id: '21',
    userId: 'u21',
    user: { id: 'u21', name: 'Dave Build', handle: '@dave_gym', avatar: 'https://picsum.photos/200/200?random=21', isVerified: false, rating: 4.1 },
    category: Category.TASK,
    title: 'Help Moving a Couch',
    description: 'Need one strong person to help me lift a couch up 3 flights of stairs. Should take 20 mins max.',
    location: 'Northside Apartments',
    price: '$40 Flat',
    tags: ['Labor', 'Moving'],
    timestamp: '10m ago',
    attendees: 0
  },
  {
    id: '22',
    userId: 'u22',
    user: { id: 'u22', name: 'Lisa Lens', handle: '@lisa_photo', avatar: 'https://picsum.photos/200/200?random=22', isVerified: true, rating: 4.9 },
    category: Category.TASK,
    title: 'Tinder Profile Photographer',
    description: 'I will take 5 high-quality candid photos for your dating profile. Guaranteed to get you more matches.',
    location: 'City Center',
    price: '$50 Session',
    tags: ['Photography', 'Dating', 'Service'],
    timestamp: '4h ago',
    attendees: 6
  },

  // --- BOUNTIES ---
  {
    id: '30',
    userId: 'u30',
    user: { id: 'u30', name: 'Gamer God', handle: '@faker_fan', avatar: 'https://picsum.photos/200/200?random=30', isVerified: false, rating: 3.8 },
    category: Category.BOUNTY,
    title: '1v1 Mid Lane - SF6',
    description: 'Best of 3. Street Fighter 6. If you beat me, I pay. If I win, you buy me a skin.',
    location: 'Arcade Bar',
    reward: '$20 Skin',
    tags: ['Gaming', 'Street Fighter', 'Esports'],
    timestamp: '45m ago',
    attendees: 1,
    difficulty: 60
  },
  {
    id: '31',
    userId: 'u31',
    user: { id: 'u31', name: 'Spicy Mike', handle: '@hot_ones', avatar: 'https://picsum.photos/200/200?random=31', isVerified: true, rating: 4.6 },
    category: Category.BOUNTY,
    title: 'Ghost Pepper Challenge',
    description: 'Eat a whole Ghost Pepper without drinking milk for 5 minutes. I will film it for my vlog.',
    location: 'Chili Fest Main Stage',
    reward: '$100 Cash',
    tags: ['Food', 'Challenge', 'Extreme'],
    timestamp: '2h ago',
    attendees: 10,
    difficulty: 95,
    isHighStakes: true
  },

  // --- SECRETS ---
  {
    id: '6',
    userId: 'u6',
    user: { id: 'u6', name: 'Anonymous', handle: 'anonymous', avatar: '', isVerified: false, rating: 0 },
    category: Category.SECRET,
    title: 'Need unbiased advice',
    description: 'I have a situation at work and need a third-party perspective. No names, just chat. I think my boss is laundering money.',
    location: 'Encrypted Space',
    price: 'Free',
    tags: ['Advice', 'Personal'],
    timestamp: '5m ago',
    attendees: 0,
    isAnonymous: true
  },
  {
    id: '40',
    userId: 'u40',
    user: { id: 'u40', name: 'Anonymous', handle: 'anonymous', avatar: '', isVerified: false, rating: 0 },
    category: Category.SECRET,
    title: 'I regret my major',
    description: 'I am in my final year of med school and I hate it. I want to drop out and become a carpenter. Talk me out of it or into it.',
    location: 'Encrypted Space',
    price: 'Free',
    tags: ['Career', 'Venting'],
    timestamp: '1h ago',
    attendees: 4,
    isAnonymous: true
  },
  {
    id: '41',
    userId: 'u41',
    user: { id: 'u41', name: 'Anonymous', handle: 'anonymous', avatar: '', isVerified: false, rating: 0 },
    category: Category.SECRET,
    title: 'Found a lost wallet',
    description: 'I found a wallet with $500 cash. No ID inside. I really need the money for rent. Should I keep it?',
    location: 'Encrypted Space',
    price: 'Free',
    tags: ['Ethics', 'Money'],
    timestamp: '20m ago',
    attendees: 12,
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
    { tag: 'Gaming', count: '210' },
    { tag: 'Foodie', count: '180' },
];
