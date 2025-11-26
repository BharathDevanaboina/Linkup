
import { Category, Post, User, ChatSession } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Alex Doe',
  handle: '@alex_doe',
  avatar: 'https://picsum.photos/200/200?random=99',
  isVerified: true,
  rating: 4.8,
  bio: 'Digital nomad. Always looking for the next adventure or a quick side quest. ⚡'
};

// Helper to set future time
const minutesFromNow = (mins: number) => Date.now() + mins * 60 * 1000;

export const MOCK_POSTS: Post[] = [
  // EVENTS
  {
    id: '1',
    userId: 'u1',
    user: { id: 'u1', name: 'Sarah Chen', handle: '@sarahc', avatar: 'https://picsum.photos/200/200?random=1', isVerified: true, rating: 4.9 },
    category: Category.EVENT,
    title: 'KDrama Dress-up & Watch Party',
    description: 'Hosting a massive KDrama marathon at a rented villa. Dress code: Joseon Dynasty Hanbok or Modern Chaebol. Looking for 10 more people!',
    location: 'Beverly Hills Estate, LA',
    price: '$50 Entry',
    tags: ['KDrama', 'Cosplay', 'Social'],
    timestamp: '2h ago',
    attendees: 12
  },
  {
    id: '10',
    userId: 'me',
    user: CURRENT_USER,
    category: Category.SOCIAL,
    title: 'My House Party: Project X Style',
    description: 'Throwing a huge party. Free drinks. Need a DJ though. DM me if you can mix.',
    location: 'Hidden Location',
    price: 'Free',
    tags: ['Party', 'Music', 'Wild'],
    timestamp: '5h ago',
    attendees: 24,
    isLocationPrivate: true
  },
  {
    id: '11',
    userId: 'u11',
    user: { id: 'u11', name: 'Neo', handle: '@theone', avatar: 'https://picsum.photos/200/200?random=11', isVerified: false, rating: 5.0 },
    category: Category.OTHERS,
    title: 'UFO Spotting in Desert',
    description: 'Driving out to the coordinates I found on the dark web. I need a co-pilot who isn\'t afraid of abduction. Bring your own tinfoil.',
    location: 'Mojave Outpost',
    price: 'Gas Split',
    tags: ['Aliens', 'Adventure', 'Weird'],
    timestamp: '10m ago',
    attendees: 1
  },
  {
    id: '8',
    userId: 'u8',
    user: { id: 'u8', name: 'The Dealer', handle: '@highstakes', avatar: 'https://picsum.photos/200/200?random=8', isVerified: true, rating: 5.0 },
    category: Category.SOCIAL,
    title: 'Underground Poker Night',
    description: 'High stakes, private location. Verification required. You must have a reputation score of 4.9+ to unlock the location.',
    location: 'Secret Location',
    price: '$500 Buy-in',
    tags: ['Exclusive', 'Poker', 'High Stakes'],
    timestamp: '1h ago',
    attendees: 4,
    minRating: 4.9
  },
  {
    id: '2',
    userId: 'u2',
    user: { id: 'u2', name: 'Mike Ross', handle: '@lawyer_mike', avatar: 'https://picsum.photos/200/200?random=2', isVerified: true, rating: 4.7 },
    category: Category.RIDE,
    title: 'Roadtrip to Grand Canyon',
    description: 'Leaving this Friday. Have 2 seats open in my SUV. Split gas costs. Good vibes and music required.',
    location: 'Phoenix -> Grand Canyon',
    price: '$40 Gas',
    tags: ['Travel', 'Ride Share'],
    timestamp: '4h ago',
    attendees: 2
  },
  
  // TASKS (Service, Education, Rental, Companion)
  {
    id: '3',
    userId: 'u3',
    user: { id: 'u3', name: 'Emily Blunt', handle: '@emilyb', avatar: 'https://picsum.photos/200/200?random=3', isVerified: false, rating: 4.5 },
    category: Category.SERVICE,
    title: 'Need someone to stand in line for Sneakers',
    description: 'The new drop is happening tomorrow at 6 AM. I need someone to hold my spot for 3 hours.',
    location: 'Downtown Mall',
    price: '$30/hr',
    tags: ['Task', 'Easy Money'],
    timestamp: '30m ago',
    attendees: 0
  },
  {
    id: '20',
    userId: 'u20',
    user: { id: 'u20', name: 'Prof. X', handle: '@professor', avatar: 'https://picsum.photos/200/200?random=20', isVerified: true, rating: 5.0 },
    category: Category.EDUCATION,
    title: 'Teaching Advanced Quantum Physics',
    description: 'Offering private tuition for advanced physics students. I can help you crack the toughest exams.',
    location: 'University Library',
    price: '$100/hr',
    tags: ['Tuition', 'Physics', 'Study'],
    timestamp: '1d ago',
    attendees: 3
  },
  {
    id: '21',
    userId: 'u21',
    user: { id: 'u21', name: 'Host Master', handle: '@host_pro', avatar: 'https://picsum.photos/200/200?random=21', isVerified: true, rating: 4.6 },
    category: Category.RENTAL,
    title: 'Renting my Gaming Basement',
    description: 'Full setup with 5 PCs, PS5, and VR. Available for 12 hours. Perfect for LAN parties.',
    location: 'North District',
    price: '$200/night',
    tags: ['Rental', 'Gaming', 'Party'],
    timestamp: '3h ago',
    attendees: 0
  },
  {
    id: '22',
    userId: 'u22',
    user: { id: 'u22', name: 'Lonely Boy', handle: '@drake_fan', avatar: 'https://picsum.photos/200/200?random=22', isVerified: false, rating: 4.0 },
    category: Category.COMPANION,
    title: 'Need a +1 for a Wedding',
    description: 'My ex is going to be there. I need someone to pretend to be my date. Free food and drinks.',
    location: 'Grand Hotel',
    price: 'Free + Expenses',
    tags: ['Date', 'Companion', 'Wedding'],
    timestamp: '6h ago',
    attendees: 5
  },
  {
    id: '29',
    userId: 'u29',
    user: { id: 'u29', name: 'Lazy Cat', handle: '@cat_mom', avatar: 'https://picsum.photos/200/200?random=29', isVerified: false, rating: 4.2 },
    category: Category.TASK_OTHER,
    title: 'Help me assemble IKEA furniture',
    description: 'I bought a huge wardrobe and I have no idea how to build it. I have the tools, just need hands and a brain.',
    location: 'Westside Apts',
    price: '$50 flat',
    tags: ['Task', 'Help', 'Furniture'],
    timestamp: '2h ago',
    attendees: 1
  },

  // BOUNTIES (Challenges)
  {
    id: '5',
    userId: 'u5',
    user: { id: 'u5', name: 'Jake Paul', handle: '@jakepaul', avatar: 'https://picsum.photos/200/200?random=5', isVerified: true, rating: 4.2 },
    category: Category.BOUNTY,
    title: 'FLASH: 10km Run Challenge in 45 mins',
    description: 'I bet 100 Rs that nobody here can beat my time. Offer expires in 45 minutes.',
    location: 'City Stadium',
    reward: '100 Rs',
    tags: ['Bounty', 'Running', 'Bet'],
    timestamp: '15m ago',
    attendees: 5,
    expiresAt: minutesFromNow(45),
    isHighStakes: true,
    difficulty: 85
  },
  {
    id: '7',
    userId: 'u7',
    user: { id: 'u7', name: 'Fit Beast', handle: '@fit_beast', avatar: 'https://picsum.photos/200/200?random=7', isVerified: true, rating: 5.0 },
    category: Category.BOUNTY,
    title: '100 Pushups in 2 Minutes',
    description: 'If you can beat me in a pushup contest, I will give you my spare gym membership for a month. Let\'s go!',
    location: 'Gold\'s Gym',
    reward: 'Gym Pass',
    tags: ['Fitness', 'Competition'],
    timestamp: '1h ago',
    attendees: 8,
    difficulty: 60
  },

  // SECRET
  {
    id: '6',
    userId: 'u6',
    user: { id: 'u6', name: 'Anonymous', handle: 'anonymous', avatar: '', isVerified: false, rating: 0 },
    category: Category.ANONYMOUS,
    title: 'Confession: Looking for unbiased advice',
    description: 'I need to talk to someone completely unconnected to my life. I have a situation at work and need a third-party perspective. No names, just chat.',
    location: 'Encrypted Space',
    price: 'Free',
    tags: ['Secret', 'Advice', 'Anonymous'],
    timestamp: '5m ago',
    attendees: 0,
    isAnonymous: true
  },
  {
    id: '9',
    userId: 'u9',
    user: { id: 'u9', name: 'Anonymous', handle: 'anonymous', avatar: '', isVerified: false, rating: 0 },
    category: Category.ANONYMOUS,
    title: 'Flash Mob: Silent Disco',
    description: 'Meet at the fountain in 20 mins. Bring headphones. We dance for 10 mins then disperse like nothing happened.',
    location: 'Central Plaza',
    price: 'Free',
    tags: ['Chaos', 'Fun'],
    timestamp: '1m ago',
    attendees: 15,
    isAnonymous: true,
    expiresAt: minutesFromNow(19)
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
    { tag: 'ProjectX', count: '1.2k' },
    { tag: 'EasyMoney', count: '850' },
    { tag: 'NightRiders', count: '540' },
    { tag: 'Cosplay', count: '320' },
    { tag: 'SilentDisco', count: '210' },
];

export const MOCK_IMAGES = [
    'https://picsum.photos/300/300?random=101',
    'https://picsum.photos/300/400?random=102',
    'https://picsum.photos/300/250?random=103',
    'https://picsum.photos/300/350?random=104',
    'https://picsum.photos/300/300?random=105',
    'https://picsum.photos/300/400?random=106',
    'https://picsum.photos/300/300?random=107',
    'https://picsum.photos/300/250?random=108',
    'https://picsum.photos/300/350?random=109',
];
