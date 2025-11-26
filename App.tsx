
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MessageSquare, 
  PlusCircle, 
  User as UserIcon, 
  Search,
  Wallet,
  Menu,
  Ghost,
  Trophy,
  Calendar,
  Radar,
  Sparkles,
  Zap,
  Rocket,
  Flame,
  Clapperboard,
  BrainCircuit,
  Gamepad2,
  Tent,
  Bot,
  Dna,
  Bell,
  MoreHorizontal,
  LogOut,
  MapPin,
  TrendingUp,
  ShieldAlert,
  ClipboardList,
  Lock,
  Hash,
  ArrowUpRight,
  Image as ImageIcon,
  PenTool,
  Github,
  Mail,
  ArrowRight,
  Camera,
  Save,
  X,
  CheckCircle2,
  Eye,
  Smartphone
} from 'lucide-react';
import { Category, Post, User } from './types';
import { MOCK_POSTS, MOCK_CHATS, CURRENT_USER, MOCK_IMAGES, TRENDING_TAGS } from './constants';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { ChatInterface } from './components/ChatInterface';
import { RadarView } from './components/RadarView';

// Router States
type Tab = 'EVENTS' | 'TASKS' | 'BOUNTY' | 'SECRET';
type View = 'feed' | 'chats' | 'profile' | 'earn' | 'explore';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>('EVENTS');
  const [currentView, setCurrentView] = useState<View>('feed'); 
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [user, setUser] = useState<User>(CURRENT_USER); // Local user state for editing
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalCategory, setCreateModalCategory] = useState<Category | undefined>(undefined);
  const [selectedEventCategory, setSelectedEventCategory] = useState<string>('All');
  const [isPaidChatActive, setIsPaidChatActive] = useState(false);
  const [profileTab, setProfileTab] = useState<'signals' | 'joined'>('signals');
  const [isRadarMode, setIsRadarMode] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  
  // Rotating Text State
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const heroWords = ["UNSCRIPTED", "UNFILTERED", "LIMITLESS", "CHAOTIC", "REAL"];

  useEffect(() => {
    const interval = setInterval(() => {
        setHeroTextIndex((prev) => (prev + 1) % heroWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---
  const handleLogin = () => {
      // In a real app, this would be: await supabase.auth.signInWithOAuth(...)
      setIsAuthenticated(true);
  };

  const handleUpdateProfile = (updatedUser: User) => {
      setUser(updatedUser);
      // In a real app, update backend here
  };

  const openCreateModal = (category?: Category) => {
      setCreateModalCategory(category);
      setShowCreateModal(true);
  };

  const handleCreatePost = (newPostData: any) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      user: newPostData.isAnonymous ? { ...user, name: 'Anonymous', avatar: '', handle: '' } : user,
      ...newPostData,
      timestamp: 'Just now',
      attendees: 0
    };
    setPosts([newPost, ...posts]);
    
    // Auto switch to correct tab
    if (newPostData.isAnonymous) setCurrentTab('SECRET');
    else if (newPostData.category === Category.BOUNTY) setCurrentTab('BOUNTY');
    else if ([Category.SERVICE, Category.EDUCATION, Category.RENTAL, Category.COMPANION, Category.TASK_OTHER].includes(newPostData.category)) setCurrentTab('TASKS');
    else setCurrentTab('EVENTS');
  };

  const handleStartChat = (targetUser: User, isPaid: boolean = false) => {
    setActiveChatUser(targetUser);
    setIsPaidChatActive(isPaid);
    setCurrentView('chats'); 
  };
  
  const handleRadarSelect = (post: Post) => {
      handleStartChat(post.user, post.category === Category.CHAT);
  };

  // --- FILTERS ---
  const getFilteredPosts = () => {
    if (isRadarMode) return posts;

    let filtered = posts;

    // 1. Pillar Filtering
    if (currentTab === 'EVENTS') {
        filtered = filtered.filter(p => [Category.SOCIAL, Category.RIDE, Category.WELLNESS, Category.EVENT, Category.OTHERS].includes(p.category));
    } else if (currentTab === 'TASKS') {
        filtered = filtered.filter(p => [Category.SERVICE, Category.EDUCATION, Category.RENTAL, Category.COMPANION, Category.TASK_OTHER].includes(p.category));
    } else if (currentTab === 'BOUNTY') {
        filtered = filtered.filter(p => p.category === Category.BOUNTY);
    } else if (currentTab === 'SECRET') {
        filtered = filtered.filter(p => p.category === Category.ANONYMOUS || p.category === Category.CHAT || p.isAnonymous);
    }

    // 2. Sub-Category Filtering (Story Bubbles)
    if (selectedEventCategory !== 'All') {
        filtered = filtered.filter(p => p.category === selectedEventCategory);
    }

    // 3. Location Filtering
    if (locationSearch.trim()) {
        filtered = filtered.filter(p => p.location.toLowerCase().includes(locationSearch.toLowerCase()));
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  // --- HELPER FOR ICONS ---
  const getCategoryConfig = (cat: Category) => {
      switch(cat) {
          case Category.SOCIAL: return { icon: <Zap className="w-5 h-5" />, color: 'from-yellow-400 to-orange-500' };
          case Category.RIDE: return { icon: <Rocket className="w-5 h-5" />, color: 'from-blue-400 to-cyan-500' };
          case Category.WELLNESS: return { icon: <Flame className="w-5 h-5" />, color: 'from-emerald-400 to-teal-500' };
          case Category.EVENT: return { icon: <Clapperboard className="w-5 h-5" />, color: 'from-purple-400 to-pink-500' };
          case Category.EDUCATION: return { icon: <BrainCircuit className="w-5 h-5" />, color: 'from-indigo-400 to-violet-500' };
          case Category.SERVICE: return { icon: <ClipboardList className="w-5 h-5" />, color: 'from-orange-400 to-red-500' };
          case Category.RENTAL: return { icon: <Tent className="w-5 h-5" />, color: 'from-lime-400 to-green-500' };
          case Category.COMPANION: return { icon: <Bot className="w-5 h-5" />, color: 'from-pink-400 to-rose-500' };
          case Category.TASK_OTHER: return { icon: <Dna className="w-5 h-5" />, color: 'from-gray-400 to-zinc-500' };
          case Category.BOUNTY: return { icon: <Trophy className="w-5 h-5" />, color: 'from-yellow-500 to-amber-600' };
          case Category.ANONYMOUS: return { icon: <Ghost className="w-5 h-5" />, color: 'from-pink-500 to-rose-600' };
          case Category.CHAT: return { icon: <MessageSquare className="w-5 h-5" />, color: 'from-indigo-500 to-purple-600' };
          case Category.OTHERS: return { icon: <Dna className="w-5 h-5" />, color: 'from-gray-400 to-gray-200' };
          default: return { icon: <Sparkles className="w-5 h-5" />, color: 'from-gray-400 to-gray-500' };
      }
  };

  // --- RENDERERS ---

  const renderLandingPage = () => (
      <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] cyber-grid opacity-30 animate-grid-flow"></div>
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>

          {/* Header */}
          <div className="relative z-20 flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
             <div className="flex items-center space-x-2">
                 <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                     <span className="font-black italic text-2xl text-white">L</span>
                 </div>
                 <span className="font-black italic text-2xl tracking-tighter">LinkUp</span>
             </div>
             <button onClick={handleLogin} className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full font-bold text-sm transition-all backdrop-blur-md">
                 Log In
             </button>
          </div>

          {/* Hero Section */}
          <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 w-full gap-12 lg:gap-20">
              
              {/* Text Content */}
              <div className="flex-1 text-center lg:text-left pt-10 lg:pt-0">
                  <div className="inline-flex items-center px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Live: 542 Signals Nearby
                  </div>
                  
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
                      THE <span key={heroTextIndex} className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 neon-text animate-fade-in inline-block min-w-[300px]">{heroWords[heroTextIndex]}</span> <br/>
                      LIFE.
                  </h1>
                  
                  <p className="text-zinc-400 text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                      Don't just scroll. <span className="text-white font-bold">Do something.</span><br/>
                      Find a party. Hire a line-stander. Win a bet. Share a secret. The real world is waiting.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <button 
                        onClick={handleLogin}
                        className="px-8 py-4 bg-white text-black font-black text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                      >
                         ENTER THE NETWORK
                      </button>
                      <button className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold text-lg rounded-full hover:bg-zinc-800 transition-colors flex items-center justify-center">
                          <Smartphone className="w-5 h-5 mr-2" /> Get App
                      </button>
                  </div>
              </div>

              {/* 3D Phone Preview Animation */}
              <div className="flex-1 w-full max-w-sm lg:max-w-md relative animate-float hidden md:block">
                  <div className="relative z-10 bg-black border-4 border-zinc-800 rounded-[3rem] shadow-[0_0_50px_rgba(124,58,237,0.3)] overflow-hidden aspect-[9/19] transform rotate-y-12 rotate-x-6 perspective-1000">
                      
                      {/* Fake App Header */}
                      <div className="bg-black/80 backdrop-blur-md p-4 border-b border-zinc-800 flex justify-between items-center sticky top-0 z-20">
                          <span className="font-black italic text-white">LinkUp</span>
                          <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          </div>
                      </div>

                      {/* Fake Feed */}
                      <div className="p-4 space-y-3">
                          {/* Card 1 */}
                          <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-700/50">
                              <div className="flex justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                      <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                                      <span className="text-[10px] font-bold">Jake Paul</span>
                                  </div>
                                  <span className="text-[10px] text-zinc-500">2m ago</span>
                              </div>
                              <p className="text-xs font-bold text-white mb-2">FLASH: 10km Run Challenge in 45 mins. Reward: 100 Rs</p>
                              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-yellow-500 w-[70%]"></div>
                              </div>
                          </div>

                          {/* Card 2 */}
                          <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-700/50">
                              <div className="flex justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                      <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"><Ghost className="w-3 h-3 text-black" /></div>
                                      <span className="text-[10px] font-bold text-pink-500">Anonymous</span>
                                  </div>
                              </div>
                              <p className="text-xs text-zinc-300">Confession: Looking for unbiased advice on a work situation...</p>
                          </div>

                          {/* Card 3 */}
                          <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-700/50">
                               <div className="flex justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                      <div className="w-6 h-6 bg-violet-500 rounded-full"></div>
                                      <span className="text-[10px] font-bold">Sarah C.</span>
                                  </div>
                              </div>
                              <p className="text-xs font-bold text-white">KDrama Watch Party at my place! 🍿</p>
                          </div>

                           {/* Radar Simulation */}
                           <div className="bg-black border border-green-500/30 rounded-xl h-32 relative overflow-hidden flex items-center justify-center">
                               <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
                               <div className="w-20 h-20 border border-green-500/50 rounded-full flex items-center justify-center">
                                   <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                               </div>
                               <span className="absolute bottom-2 text-[10px] text-green-500 font-mono blink">SCANNING...</span>
                           </div>
                      </div>
                      
                      {/* Fake Bottom Bar */}
                      <div className="absolute bottom-0 w-full p-4 bg-black/90 border-t border-zinc-800 flex justify-around">
                          <div className="w-8 h-1 bg-white/20 rounded-full"></div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Value Props / 4 Pillars */}
          <div className="relative z-10 bg-zinc-950 py-20 border-t border-white/5">
              <div className="max-w-7xl mx-auto px-6">
                  <p className="text-center text-zinc-500 font-mono text-sm mb-12 uppercase tracking-widest">Everything you need in one app</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Events */}
                      <div className="group p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-violet-500/50 hover:bg-zinc-900 transition-all cursor-default">
                          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Clapperboard className="w-6 h-6 text-violet-500" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">Events</h3>
                          <p className="text-zinc-400 text-sm">Not your average meetup. Project X parties, KDrama marathons, and midnight drives.</p>
                      </div>

                      {/* Tasks */}
                      <div className="group p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-green-500/50 hover:bg-zinc-900 transition-all cursor-default">
                          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <ClipboardList className="w-6 h-6 text-green-500" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">Tasks</h3>
                          <p className="text-zinc-400 text-sm">Need a line-stander? A study buddy? Rent a skill or a person for a quick side quest.</p>
                      </div>

                       {/* Bounties */}
                       <div className="group p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/50 hover:bg-zinc-900 transition-all cursor-default">
                          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Trophy className="w-6 h-6 text-yellow-500" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">Bounties</h3>
                          <p className="text-zinc-400 text-sm">High stakes only. Bet on yourself, challenge others, and win real rewards.</p>
                      </div>

                       {/* Secret */}
                       <div className="group p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-pink-500/50 hover:bg-zinc-900 transition-all cursor-default">
                          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Ghost className="w-6 h-6 text-pink-500" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">Secret</h3>
                          <p className="text-zinc-400 text-sm">Ghost Protocol enabled. Anonymous confessions and encrypted chats.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderLeftSidebar = () => (
    <div className="hidden lg:flex flex-col w-[275px] h-screen sticky top-0 border-r border-zinc-800 bg-black p-4 z-50 shrink-0">
        {/* Logo */}
        <div className="mb-8 px-4 cursor-pointer" onClick={() => { setCurrentView('feed'); setCurrentTab('EVENTS'); }}>
            <h1 className="text-3xl font-black italic tracking-tighter text-white flex items-center">
                <span className="bg-violet-600 w-10 h-10 flex items-center justify-center rounded-lg mr-2 not-italic shadow-[0_0_15px_rgba(124,58,237,0.5)]">L</span>
                LinkUp
            </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
            <SidebarItem icon={Home} label="Home" isActive={currentView === 'feed'} onClick={() => { setCurrentView('feed'); setIsRadarMode(false); }} />
            <SidebarItem icon={Search} label="Explore" isActive={currentView === 'explore'} onClick={() => { setCurrentView('explore'); setIsRadarMode(false); }} />
            <SidebarItem icon={Radar} label="Radar" isActive={isRadarMode} onClick={() => { setIsRadarMode(!isRadarMode); setCurrentView('feed'); }} />
            <SidebarItem icon={Wallet} label="Earn" isActive={currentView === 'earn'} onClick={() => setCurrentView('earn')} />
            <SidebarItem icon={MessageSquare} label="Messages" isActive={currentView === 'chats'} onClick={() => setCurrentView('chats')} badge={MOCK_CHATS.reduce((acc, c) => acc + c.unreadCount, 0)} />
            <SidebarItem icon={UserIcon} label="Profile" isActive={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
        </nav>

        {/* Create Button */}
        <button 
            onClick={() => openCreateModal()}
            className="w-full bg-white text-black font-black py-4 rounded-full text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-6"
        >
            POST SIGNAL
        </button>

        {/* User Mini Profile */}
        <div className="flex items-center p-3 rounded-full hover:bg-zinc-900 cursor-pointer transition-colors" onClick={() => setCurrentView('profile')}>
            <img src={user.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover mr-3" />
            <div className="flex-1">
                <p className="font-bold text-sm text-white">{user.name}</p>
                <p className="text-xs text-zinc-500">{user.handle}</p>
            </div>
            <button onClick={() => setIsAuthenticated(false)} title="Logout">
                <LogOut className="w-5 h-5 text-zinc-500 hover:text-red-500" />
            </button>
        </div>
    </div>
  );

  const renderRightSidebar = () => (
      <div className="hidden xl:block w-[350px] h-screen sticky top-0 border-l border-zinc-800 bg-black p-6 z-40 overflow-y-auto shrink-0">
          {/* Search */}
          <div className="relative mb-4">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input 
                  type="text" 
                  placeholder="Search signals..." 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
          </div>

           {/* Location Filter */}
           <div className="relative mb-8">
              <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input 
                  type="text" 
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Filter by location..." 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
          </div>

          {/* Trending Bounties */}
          <div className="mb-8">
              <h3 className="font-black text-zinc-500 text-sm mb-4 tracking-widest uppercase flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" /> Live Bounties
              </h3>
              <div className="space-y-4">
                  {MOCK_POSTS.filter(p => p.reward).slice(0, 3).map(post => (
                      <div key={post.id} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-xs text-zinc-400 font-mono">{post.category}</span>
                              <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-2 py-0.5 rounded font-bold border border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                  {post.reward}
                              </span>
                          </div>
                          <p className="font-bold text-sm text-zinc-200 line-clamp-2 leading-snug group-hover:text-white">{post.title}</p>
                      </div>
                  ))}
              </div>
          </div>

          {/* Radar Mini */}
          <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800 relative overflow-hidden">
              <div className="flex justify-between items-center mb-2 relative z-10">
                  <h3 className="font-bold text-green-500 text-xs tracking-wider">RADAR ACTIVE</h3>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div className="h-32 w-full bg-black/50 rounded-lg border border-green-500/20 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-green-500/30 -translate-x-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 h-full w-[1px] bg-green-500/30 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"></div>
                  <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              <button 
                onClick={() => { setIsRadarMode(true); setCurrentView('feed'); }}
                className="w-full mt-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-lg transition-colors"
              >
                  FULL SCAN
              </button>
          </div>
      </div>
  );

  const renderStoryBubbles = () => {
      let categoriesToShow: Category[] = [];

      if (currentTab === 'EVENTS') {
          categoriesToShow = [Category.SOCIAL, Category.RIDE, Category.WELLNESS, Category.EVENT, Category.OTHERS];
      } else if (currentTab === 'TASKS') {
          categoriesToShow = [Category.SERVICE, Category.EDUCATION, Category.RENTAL, Category.COMPANION, Category.TASK_OTHER];
      } else if (currentTab === 'BOUNTY') {
          categoriesToShow = [Category.BOUNTY];
      } else if (currentTab === 'SECRET') {
          categoriesToShow = [Category.ANONYMOUS, Category.CHAT];
      }

      return (
        <div className="flex overflow-x-auto gap-3 py-4 px-4 scrollbar-hide border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-30">
            <StoryBubble label="All" active={selectedEventCategory === 'All'} onClick={() => setSelectedEventCategory('All')} icon={<Sparkles />} />
            {categoriesToShow.map(cat => {
                const config = getCategoryConfig(cat);
                return (
                    <StoryBubble 
                        key={cat} 
                        label={cat} 
                        active={selectedEventCategory === cat} 
                        onClick={() => setSelectedEventCategory(cat)}
                        icon={config.icon}
                        color={config.color}
                    />
                );
            })}
        </div>
      );
  };

  const QuickComposer = () => (
    <div className="p-4 border-b border-zinc-800 bg-black">
        <div className="flex gap-3">
            <img src={user.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover border border-zinc-800" />
            <div 
                onClick={() => openCreateModal()}
                className="flex-1 bg-zinc-900 rounded-full px-4 cursor-text hover:bg-zinc-800 transition-colors border border-zinc-800 flex items-center justify-between group"
            >
                <span className="text-zinc-500 font-medium text-sm">What's the move?</span>
                <PenTool className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
            </div>
        </div>
        <div className="flex gap-2 mt-3 ml-[52px]">
            <button onClick={() => { setCurrentTab('EVENTS'); openCreateModal(Category.SOCIAL); }} className="flex items-center text-[11px] font-bold text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full hover:bg-zinc-800 hover:text-white transition-colors">
                <Calendar className="w-3 h-3 mr-1.5 text-violet-500" /> Event
            </button>
            <button onClick={() => { setCurrentTab('TASKS'); openCreateModal(Category.SERVICE); }} className="flex items-center text-[11px] font-bold text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full hover:bg-zinc-800 hover:text-white transition-colors">
                <ClipboardList className="w-3 h-3 mr-1.5 text-green-500" /> Task
            </button>
            <button onClick={() => { setCurrentTab('BOUNTY'); openCreateModal(Category.BOUNTY); }} className="flex items-center text-[11px] font-bold text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full hover:bg-zinc-800 hover:text-white transition-colors">
                <Trophy className="w-3 h-3 mr-1.5 text-yellow-500" /> Bounty
            </button>
        </div>
    </div>
  );

  const renderMainFeed = () => {
      return (
          <div className="w-full max-w-[600px] border-r border-zinc-800 min-h-screen pb-24 lg:pb-0">
              {/* Mobile Top Bar */}
              <div className="lg:hidden sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-4 h-14 flex items-center justify-between">
                  <span className="font-black italic text-xl tracking-tighter text-white" onClick={() => setCurrentView('feed')}>LinkUp</span>
                  <div className="flex space-x-3">
                    <button onClick={() => setIsRadarMode(!isRadarMode)}><Radar className={`w-6 h-6 ${isRadarMode ? 'text-green-500 animate-pulse' : 'text-white'}`} /></button>
                    <button onClick={() => setCurrentView('profile')}><img src={user.avatar} className="w-7 h-7 rounded-full border border-zinc-700" alt="me" /></button>
                  </div>
              </div>

              {/* View Switcher Logic */}
              {currentView === 'feed' && (
                  <>
                    {/* Top Tabs - The 4 Pillars */}
                    {!isRadarMode && (
                        <div className="flex border-b border-zinc-800 bg-black sticky top-14 lg:top-0 z-20">
                            {(['EVENTS', 'TASKS', 'BOUNTY', 'SECRET'] as Tab[]).map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => { setCurrentTab(tab); setSelectedEventCategory('All'); }}
                                    className={`flex-1 py-4 text-xs font-black tracking-widest hover:bg-zinc-900/50 transition-colors relative ${currentTab === tab ? 'text-white' : 'text-zinc-500'}`}
                                >
                                    {tab}
                                    {currentTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>}
                                </button>
                            ))}
                        </div>
                    )}

                    {!isRadarMode && <QuickComposer />}
                    {!isRadarMode && renderStoryBubbles()}
                    
                    {isRadarMode ? (
                        <div className="p-4 animate-fade-in">
                            <RadarView posts={posts} onPostSelect={handleRadarSelect} />
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-800">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map(post => (
                                    <PostCard 
                                        key={post.id} 
                                        post={post} 
                                        onChat={() => handleStartChat(post.user, post.category === Category.CHAT)} 
                                    />
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <Ghost className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                    <p className="text-zinc-600">No signals found in {currentTab}.</p>
                                    <button onClick={() => openCreateModal()} className="mt-4 text-violet-500 font-bold text-sm">Create One</button>
                                </div>
                            )}
                        </div>
                    )}
                  </>
              )}

              {currentView === 'explore' && <ExploreView onSelect={handleStartChat} posts={posts} />}
              {currentView === 'chats' && <ChatsView onChatSelect={handleStartChat} />}
              {currentView === 'profile' && <ProfileView user={user} posts={posts} onUpdateProfile={handleUpdateProfile} />}
              {currentView === 'earn' && <EarnView />}
          </div>
      );
  };

  // --- MAIN LAYOUT ---

  // AUTH CHECK
  if (!isAuthenticated) {
      return renderLandingPage();
  }

  if (activeChatUser) {
      return (
          <div className="flex justify-center bg-black min-h-screen">
              <div className="w-full max-w-2xl h-screen flex flex-col">
                 <ChatInterface 
                    participant={activeChatUser} 
                    onBack={() => setActiveChatUser(null)} 
                    isPaidChat={isPaidChatActive}
                 />
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
        {renderLeftSidebar()}
        {renderMainFeed()}
        {renderRightSidebar()}

        {/* Mobile Bottom Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-zinc-800 flex justify-around items-center z-50 px-2 pb-safe">
            <MobileNavItem icon={Home} isActive={currentView === 'feed'} onClick={() => setCurrentView('feed')} />
            <MobileNavItem icon={Search} isActive={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
            <div className="relative -top-5">
                <button onClick={() => openCreateModal()} className="bg-white text-black p-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                    <PlusCircle className="w-6 h-6" />
                </button>
            </div>
            <MobileNavItem icon={MessageSquare} isActive={currentView === 'chats'} onClick={() => setCurrentView('chats')} />
            <MobileNavItem icon={UserIcon} isActive={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
        </div>

        {/* Create Modal */}
        {showCreateModal && (
            <CreatePostModal 
                onClose={() => setShowCreateModal(false)} 
                onSubmit={handleCreatePost} 
                initialTab={currentTab}
                initialCategory={createModalCategory}
            />
        )}
    </div>
  );
}

// --- SUB COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, isActive, onClick, badge }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center space-x-4 px-4 py-3.5 rounded-full text-xl transition-all w-full group ${isActive ? 'font-bold text-white' : 'text-zinc-400 hover:bg-zinc-900'}`}
    >
        <div className="relative">
            <Icon className={`w-7 h-7 ${isActive ? 'fill-white' : 'group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 2} />
            {badge > 0 && <span className="absolute -top-1 -right-1 bg-violet-600 text-[10px] w-4 h-4 flex items-center justify-center rounded-full text-white">{badge}</span>}
        </div>
        <span className={isActive ? '' : 'font-medium'}>{label}</span>
    </button>
);

const MobileNavItem = ({ icon: Icon, isActive, onClick }: any) => (
    <button onClick={onClick} className={`p-3 rounded-full transition-colors ${isActive ? 'text-white' : 'text-zinc-600'}`}>
        <Icon className="w-6 h-6" strokeWidth={isActive ? 3 : 2} />
    </button>
);

const StoryBubble = ({ label, active, onClick, icon, color = 'from-violet-500 to-fuchsia-500' }: any) => (
    <button onClick={onClick} className="flex flex-col items-center space-y-1 min-w-[70px]">
        <div className={`w-[68px] h-[68px] rounded-full p-[2px] ${active ? `bg-gradient-to-tr ${color}` : 'bg-zinc-800'}`}>
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center border-2 border-black">
                {React.cloneElement(icon, { className: `w-6 h-6 ${active ? 'text-white' : 'text-zinc-500'}` })}
            </div>
        </div>
        <span className={`text-[10px] text-center w-full truncate font-medium ${active ? 'text-white' : 'text-zinc-500'}`}>{label}</span>
    </button>
);

// --- VIEW COMPONENTS ---

const ExploreView = ({ onSelect, posts }: { onSelect: (u: User) => void, posts: Post[] }) => (
    <div className="pb-24">
        {/* Trending Tags Section */}
        <div className="p-4 border-b border-zinc-800">
            <h2 className="text-xl font-black mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-violet-500" /> Trending Now</h2>
            <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((t, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg w-[48%] hover:bg-zinc-800 cursor-pointer transition-colors">
                        <div>
                            <p className="text-sm font-bold text-white flex items-center"><Hash className="w-3 h-3 mr-1 text-zinc-500" />{t.tag}</p>
                            <p className="text-[10px] text-zinc-500">{t.count} Signals</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-zinc-600" />
                    </div>
                ))}
            </div>
        </div>

        {/* Hot Posts Feed */}
        <div className="p-4">
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4">Hot Signals</h3>
            <div className="space-y-4">
                {posts.slice(0, 5).map(post => (
                    <PostCard key={post.id} post={post} onChat={() => onSelect(post.user)} />
                ))}
            </div>
        </div>
    </div>
);

const ChatsView = ({ onChatSelect }: { onChatSelect: (u: User) => void }) => (
    <div className="p-4 pb-24">
        <h2 className="text-2xl font-black mb-6 px-2">Messages</h2>
        {MOCK_CHATS.map(chat => (
            <div key={chat.id} onClick={() => onChatSelect(chat.participant)} className="flex items-center p-4 hover:bg-zinc-900 rounded-2xl cursor-pointer transition-colors">
                <img src={chat.participant.avatar} className="w-14 h-14 rounded-full object-cover mr-4" alt="" />
                <div className="flex-1">
                    <div className="flex justify-between mb-1">
                        <h4 className="font-bold text-white">{chat.participant.name}</h4>
                        <span className="text-xs text-zinc-500">2m</span>
                    </div>
                    <p className="text-zinc-400 text-sm truncate">{chat.lastMessage}</p>
                </div>
            </div>
        ))}
    </div>
);

const ProfileView = ({ user, posts, onUpdateProfile }: { user: User, posts: Post[], onUpdateProfile: (u: User) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: user.name, handle: user.handle, bio: user.bio || '', avatar: user.avatar });

    const handleSave = () => {
        onUpdateProfile({ ...user, ...editData });
        setIsEditing(false);
    };

    return (
        <div className="pb-24">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-violet-900 to-black relative">
                {isEditing && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest pointer-events-none">Edit Mode Active</div>}
            </div>
            
            <div className="px-4 -mt-16 mb-4 flex justify-between items-end">
                <div className="relative group">
                     <img src={isEditing ? editData.avatar : user.avatar} className="w-32 h-32 rounded-full border-4 border-black object-cover" alt="" />
                     {isEditing && (
                         <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer">
                             <Camera className="w-8 h-8 text-white" />
                         </div>
                     )}
                </div>
                
                {isEditing ? (
                    <div className="flex gap-2">
                         <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-zinc-800 rounded-full font-bold text-sm text-white hover:bg-zinc-700 transition-colors flex items-center"><X className="w-4 h-4 mr-1" /> Cancel</button>
                         <button onClick={handleSave} className="px-4 py-2 bg-white rounded-full font-bold text-sm text-black hover:bg-zinc-200 transition-colors flex items-center"><Save className="w-4 h-4 mr-1" /> Save</button>
                    </div>
                ) : (
                    <button onClick={() => { setEditData({ name: user.name, handle: user.handle, bio: user.bio || '', avatar: user.avatar }); setIsEditing(true); }} className="px-6 py-2 border border-zinc-700 rounded-full font-bold text-sm hover:bg-zinc-900 transition-colors">Edit Profile</button>
                )}
            </div>
            
            <div className="px-4 mb-6">
                {isEditing ? (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase">Display Name</label>
                            <input 
                                type="text" 
                                value={editData.name} 
                                onChange={(e) => setEditData({...editData, name: e.target.value})}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white font-bold focus:border-violet-500 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase">Handle</label>
                            <input 
                                type="text" 
                                value={editData.handle} 
                                onChange={(e) => setEditData({...editData, handle: e.target.value})}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-400 focus:border-violet-500 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase">Bio</label>
                            <textarea 
                                value={editData.bio} 
                                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-300 text-sm focus:border-violet-500 outline-none resize-none h-20" 
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-black text-white flex items-center">
                            {user.name} 
                            <span className="ml-2 text-blue-500"><Sparkles className="w-4 h-4 fill-current" /></span>
                        </h2>
                        <p className="text-zinc-500">{user.handle} • Member since 2024</p>
                        {user.bio && <p className="text-zinc-300 text-sm mt-2 max-w-lg">{user.bio}</p>}
                        <div className="flex gap-4 mt-4">
                            <div><span className="font-bold text-white">142</span> <span className="text-zinc-500">Following</span></div>
                            <div><span className="font-bold text-white">24.5K</span> <span className="text-zinc-500">Followers</span></div>
                        </div>
                    </>
                )}
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-zinc-800 mb-2">
                <button className="flex-1 py-3 text-white font-bold border-b-2 border-white">Signals</button>
                <button className="flex-1 py-3 text-zinc-500 font-bold hover:text-zinc-300">Replies</button>
                <button className="flex-1 py-3 text-zinc-500 font-bold hover:text-zinc-300">Media</button>
            </div>

            {/* User Posts */}
            <div className="divide-y divide-zinc-800">
                {posts.filter(p => p.userId === 'me').map(post => (
                    <PostCard key={post.id} post={post} onChat={() => {}} />
                ))}
            </div>
        </div>
    );
};

const EarnView = () => (
    <div className="p-4 pb-24">
        <h2 className="text-2xl font-black mb-6">Opportunities</h2>
        <div className="bg-gradient-to-br from-indigo-900 to-black p-6 rounded-3xl border border-indigo-500/30 mb-8 relative overflow-hidden">
             <div className="relative z-10">
                 <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mb-2">Current Balance</p>
                 <h1 className="text-5xl font-mono font-black text-white mb-6">$420.69</h1>
                 <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">Withdraw Funds</button>
             </div>
             <Wallet className="absolute -right-6 -bottom-6 w-48 h-48 text-indigo-900/50 rotate-12" />
        </div>
        
        <h3 className="font-bold text-lg mb-4">Available Tasks</h3>
        <div className="space-y-3">
             {[1,2,3].map(i => (
                 <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 flex justify-between items-center">
                     <div>
                         <p className="font-bold text-white">Line Sitter @ Supreme Drop</p>
                         <p className="text-xs text-zinc-500">2 hours • $50 payout</p>
                     </div>
                     <button className="px-4 py-2 bg-zinc-800 text-white text-xs font-bold rounded-lg hover:bg-zinc-700">Apply</button>
                 </div>
             ))}
        </div>
    </div>
);
