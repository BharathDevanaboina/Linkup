
import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Category, Post, User } from './types';
import { MOCK_POSTS, MOCK_CHATS, CURRENT_USER, MOCK_IMAGES, TRENDING_TAGS } from './constants';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { ChatInterface } from './components/ChatInterface';
import { RadarView } from './components/RadarView';

// Router States
type Tab = 'EVENTS' | 'TASKS' | 'CHALLENGES' | 'SECRET';
type View = 'feed' | 'chats' | 'profile' | 'earn' | 'explore';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>('EVENTS');
  const [currentView, setCurrentView] = useState<View>('feed'); 
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEventCategory, setSelectedEventCategory] = useState<string>('All');
  const [isPaidChatActive, setIsPaidChatActive] = useState(false);
  const [profileTab, setProfileTab] = useState<'signals' | 'joined'>('signals');
  const [isRadarMode, setIsRadarMode] = useState(false);

  // --- ACTIONS ---
  const handleLogin = () => {
      // In a real app, this would be: await supabase.auth.signInWithOAuth(...)
      setIsAuthenticated(true);
  };

  const handleCreatePost = (newPostData: any) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: CURRENT_USER.id,
      user: newPostData.isAnonymous ? { ...CURRENT_USER, name: 'Anonymous', avatar: '' } : CURRENT_USER,
      ...newPostData,
      timestamp: 'Just now',
      attendees: 0
    };
    setPosts([newPost, ...posts]);
    
    // Auto switch to correct tab
    if (newPostData.isAnonymous) setCurrentTab('SECRET');
    else if (newPostData.category === Category.CHALLENGE) setCurrentTab('CHALLENGES');
    else if ([Category.SERVICE, Category.EDUCATION, Category.RENTAL, Category.COMPANION].includes(newPostData.category)) setCurrentTab('TASKS');
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
        filtered = filtered.filter(p => [Category.SERVICE, Category.EDUCATION, Category.RENTAL, Category.COMPANION].includes(p.category));
    } else if (currentTab === 'CHALLENGES') {
        filtered = filtered.filter(p => p.category === Category.CHALLENGE);
    } else if (currentTab === 'SECRET') {
        filtered = filtered.filter(p => p.category === Category.ANONYMOUS || p.category === Category.CHAT || p.isAnonymous);
    }

    // 2. Sub-Category Filtering (Story Bubbles)
    if (selectedEventCategory !== 'All') {
        filtered = filtered.filter(p => p.category === selectedEventCategory);
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  // --- HELPERS ---
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
          case Category.CHALLENGE: return { icon: <Trophy className="w-5 h-5" />, color: 'from-yellow-500 to-amber-600' };
          case Category.ANONYMOUS: return { icon: <Ghost className="w-5 h-5" />, color: 'from-pink-500 to-rose-600' };
          case Category.CHAT: return { icon: <MessageSquare className="w-5 h-5" />, color: 'from-indigo-500 to-purple-600' };
          case Category.OTHERS: return { icon: <Dna className="w-5 h-5" />, color: 'from-gray-400 to-gray-200' };
          default: return { icon: <Sparkles className="w-5 h-5" />, color: 'from-gray-400 to-gray-500' };
      }
  };

  // --- RENDERERS ---

  const renderLandingPage = () => (
      <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-500/10 rounded-full blur-[120px]"></div>
              <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                      backgroundSize: '40px 40px'
                  }}
              ></div>
          </div>

          {/* Nav */}
          <div className="relative z-10 p-6 flex justify-between items-center">
             <h1 className="text-2xl font-black italic tracking-tighter flex items-center">
                <span className="bg-violet-600 w-8 h-8 flex items-center justify-center rounded mr-2">L</span>
                LinkUp
             </h1>
             <button onClick={handleLogin} className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Login</button>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 text-center max-w-4xl mx-auto">
              <span className="px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
                  The Social Marketplace
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
                  The World is <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">Your Lobby.</span>
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                  Connect, Compete, and Earn in the real world. 
                  From underground parties to high-stakes challenges, find your tribe in the first social marketplace for the unscripted life.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                  <button 
                    onClick={handleLogin}
                    className="flex-1 flex items-center justify-center py-4 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                     <img src="https://www.google.com/favicon.ico" className="w-5 h-5 mr-3" alt="G" />
                     Continue with Google
                  </button>
                  <button 
                    onClick={handleLogin}
                    className="flex-1 flex items-center justify-center py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                     <Github className="w-5 h-5 mr-3" />
                     Github
                  </button>
              </div>
          </div>

          {/* Feature Tickers */}
          <div className="relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-sm">
              <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                      <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                      <h3 className="font-bold text-white mb-1">The Gauntlet</h3>
                      <p className="text-xs text-zinc-500">Challenges & Bounties</p>
                  </div>
                  <div className="text-center">
                      <Ghost className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                      <h3 className="font-bold text-white mb-1">Ghost Protocol</h3>
                      <p className="text-xs text-zinc-500">Anonymous & Encrypted</p>
                  </div>
                  <div className="text-center">
                      <Radar className="w-8 h-8 text-green-500 mx-auto mb-3" />
                      <h3 className="font-bold text-white mb-1">The Radar</h3>
                      <p className="text-xs text-zinc-500">Hyper-local Scanner</p>
                  </div>
                  <div className="text-center">
                      <Wallet className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
                      <h3 className="font-bold text-white mb-1">Earn</h3>
                      <p className="text-xs text-zinc-500">Monetize your Skills</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderLeftSidebar = () => (
    <div className="hidden lg:flex flex-col w-[275px] h-screen fixed left-0 top-0 border-r border-zinc-800 bg-black p-4 z-50">
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
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-white text-black font-black py-4 rounded-full text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-6"
        >
            POST SIGNAL
        </button>

        {/* User Mini Profile */}
        <div className="flex items-center p-3 rounded-full hover:bg-zinc-900 cursor-pointer transition-colors" onClick={() => setCurrentView('profile')}>
            <img src={CURRENT_USER.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover mr-3" />
            <div className="flex-1">
                <p className="font-bold text-sm text-white">{CURRENT_USER.name}</p>
                <p className="text-xs text-zinc-500">@alex_doe</p>
            </div>
            <button onClick={() => setIsAuthenticated(false)} title="Logout">
                <LogOut className="w-5 h-5 text-zinc-500 hover:text-red-500" />
            </button>
        </div>
    </div>
  );

  const renderRightSidebar = () => (
      <div className="hidden lg:block w-[350px] h-screen fixed right-0 top-0 border-l border-zinc-800 bg-black p-6 z-40 overflow-y-auto">
          {/* Search */}
          <div className="relative mb-8">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
              <input 
                  type="text" 
                  placeholder="Search signals..." 
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
          categoriesToShow = [Category.SERVICE, Category.EDUCATION, Category.RENTAL, Category.COMPANION];
      } else if (currentTab === 'CHALLENGES') {
          categoriesToShow = [Category.CHALLENGE];
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
    <div className="p-4 border-b border-zinc-800">
        <div className="flex gap-3">
            <img src={CURRENT_USER.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover" />
            <div 
                onClick={() => setShowCreateModal(true)}
                className="flex-1 bg-zinc-900 rounded-2xl p-3 cursor-text hover:bg-zinc-800 transition-colors border border-zinc-800 flex items-center justify-between group"
            >
                <span className="text-zinc-500 font-medium">What's the move?</span>
                <PenTool className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
            </div>
        </div>
        <div className="flex gap-4 mt-3 ml-[52px]">
            <button onClick={() => { setCurrentTab('EVENTS'); setShowCreateModal(true); }} className="flex items-center text-xs font-bold text-violet-400 hover:text-violet-300">
                <Calendar className="w-4 h-4 mr-1.5" /> Event
            </button>
            <button onClick={() => { setCurrentTab('TASKS'); setShowCreateModal(true); }} className="flex items-center text-xs font-bold text-green-400 hover:text-green-300">
                <ClipboardList className="w-4 h-4 mr-1.5" /> Task
            </button>
            <button onClick={() => { setCurrentTab('CHALLENGES'); setShowCreateModal(true); }} className="flex items-center text-xs font-bold text-yellow-400 hover:text-yellow-300">
                <Trophy className="w-4 h-4 mr-1.5" /> Bounty
            </button>
        </div>
    </div>
  );

  const renderMainFeed = () => {
      return (
          <div className="w-full lg:max-w-[600px] lg:ml-[275px] border-r border-zinc-800 min-h-screen pb-24 lg:pb-0">
              {/* Mobile Top Bar */}
              <div className="lg:hidden sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-4 h-14 flex items-center justify-between">
                  <span className="font-black italic text-xl tracking-tighter text-white" onClick={() => setCurrentView('feed')}>LinkUp</span>
                  <div className="flex space-x-3">
                    <button onClick={() => setIsRadarMode(!isRadarMode)}><Radar className={`w-6 h-6 ${isRadarMode ? 'text-green-500 animate-pulse' : 'text-white'}`} /></button>
                    <button onClick={() => setCurrentView('profile')}><img src={CURRENT_USER.avatar} className="w-7 h-7 rounded-full border border-zinc-700" alt="me" /></button>
                  </div>
              </div>

              {/* View Switcher Logic */}
              {currentView === 'feed' && (
                  <>
                    {/* Top Tabs - The 4 Pillars */}
                    {!isRadarMode && (
                        <div className="flex border-b border-zinc-800 bg-black sticky top-14 lg:top-0 z-20">
                            {(['EVENTS', 'TASKS', 'CHALLENGES', 'SECRET'] as Tab[]).map((tab) => (
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

                    {!isRadarMode && renderStoryBubbles()}
                    {!isRadarMode && <QuickComposer />}

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
                                    <button onClick={() => setShowCreateModal(true)} className="mt-4 text-violet-500 font-bold text-sm">Create One</button>
                                </div>
                            )}
                        </div>
                    )}
                  </>
              )}

              {currentView === 'explore' && <ExploreView onSelect={handleStartChat} posts={posts} />}
              {currentView === 'chats' && <ChatsView onChatSelect={handleStartChat} />}
              {currentView === 'profile' && <ProfileView user={CURRENT_USER} posts={posts} />}
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
                <button onClick={() => setShowCreateModal(true)} className="bg-white text-black p-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]">
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
                initialTab={currentTab === 'SECRET' ? 'Anonymous' : undefined}
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

const ProfileView = ({ user, posts }: { user: User, posts: Post[] }) => (
    <div className="pb-24">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-violet-900 to-black"></div>
        <div className="px-4 -mt-16 mb-4 flex justify-between items-end">
            <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-black object-cover" alt="" />
            <button className="px-6 py-2 border border-zinc-700 rounded-full font-bold text-sm hover:bg-zinc-900 transition-colors">Edit Profile</button>
        </div>
        
        <div className="px-4 mb-6">
            <h2 className="text-2xl font-black text-white flex items-center">
                {user.name} 
                <span className="ml-2 text-blue-500"><Sparkles className="w-4 h-4 fill-current" /></span>
            </h2>
            <p className="text-zinc-500">@alex_doe • Member since 2024</p>
            <div className="flex gap-4 mt-4">
                <div><span className="font-bold text-white">142</span> <span className="text-zinc-500">Following</span></div>
                <div><span className="font-bold text-white">24.5K</span> <span className="text-zinc-500">Followers</span></div>
            </div>
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
