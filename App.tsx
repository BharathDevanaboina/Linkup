import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  User as UserIcon, 
  LogOut,
  Radar
} from 'lucide-react';

// STRICT RELATIVE IMPORTS - DO NOT USE ALIASES
import { Category, Post, User } from './types';
import { MOCK_CHATS, CURRENT_USER } from './constants';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { ChatInterface } from './components/ChatInterface';
import { RadarView } from './components/RadarView';
import { OnboardingScreens } from './components/OnboardingScreens';
import { VerifiedBadge } from './components/VerifiedBadge';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';

// Auth & DB imports (Relative paths)
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { createPost, subscribeToPosts } from './services/db';

type View = 'home' | 'search' | 'messages' | 'profile';
type Tab = 'Event' | 'Task' | 'Bounty' | 'Secret';

const MainApp = () => {
  const { user: authUser, logout } = useAuth();
  
  // State
  const [hasEntered, setHasEntered] = useState(false); // Controls Landing Page -> App flow
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentTab, setCurrentTab] = useState<Tab>('Event');
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showRadar, setShowRadar] = useState(false);

  // Load User Data
  const userProfile: User = authUser ? {
    id: authUser.uid,
    name: authUser.displayName || 'User',
    handle: `@${authUser.email?.split('@')[0] || 'user'}`,
    avatar: authUser.photoURL || `https://ui-avatars.com/api/?name=${authUser.email}&background=0D8ABC&color=fff`,
    isVerified: false,
    rating: 0
  } : CURRENT_USER;

  // Effects
  useEffect(() => {
    const onboarded = localStorage.getItem('linkup_v2_onboarded');
    if (onboarded) setHasOnboarded(true);

    // Subscribe to Firestore Posts
    const unsubscribe = subscribeToPosts((fetchedPosts) => {
        setPosts(fetchedPosts);
    });
    return () => unsubscribe();
  }, []);

  const completeOnboarding = () => {
      localStorage.setItem('linkup_v2_onboarded', 'true');
      setHasOnboarded(true);
  };
  
  const handlePostSubmit = async (data: any) => {
      if (!authUser) return;
      
      const success = await createPost({
          category: data.category,
          title: data.title,
          description: data.description,
          location: data.location,
          price: data.price,
          isBoosted: data.isBoosted,
          tags: data.tags || [],
          isAnonymous: data.isAnonymous,
          difficulty: data.difficulty,
          isLocationPrivate: data.isLocationPrivate
      }, authUser);

      if (success) {
          setCurrentTab(data.category);
          setCurrentView('home');
      }
  };

  // --- SUB-COMPONENTS ---

  const HomeView = () => (
      <div className="w-full max-w-2xl min-h-screen pb-24">
          <div className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-zinc-800">
             <div className="p-4 flex justify-between items-center">
                 <h1 className="text-2xl font-black italic tracking-tighter text-white">Link<span className="text-violet-600">Up</span></h1>
                 <img src={userProfile.avatar} className="w-8 h-8 rounded-full border border-zinc-700 cursor-pointer" onClick={() => setCurrentView('profile')} alt="Profile" />
             </div>
             
             <div className="bg-violet-900/10 border-y border-violet-500/10 px-4 py-2 text-center">
                 <p className="text-[10px] uppercase font-bold text-violet-400 tracking-widest">Real-World Action Network</p>
             </div>

             <div className="flex w-full overflow-x-auto scrollbar-hide">
                 {(['Event', 'Task', 'Bounty', 'Secret'] as Tab[]).map(tab => (
                     <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${currentTab === tab ? 'border-violet-600 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                     >
                         {tab}
                     </button>
                 ))}
             </div>
          </div>

          <div className="p-4 space-y-4">
              {posts.filter(p => p.category === Category[currentTab.toUpperCase() as keyof typeof Category]).map(post => (
                  <PostCard key={post.id} post={post} onChat={() => setActiveChatUser(post.user)} />
              ))}
              {posts.length === 0 && (
                  <div className="text-center py-20 text-zinc-500">
                      <p>No active signals in this sector.</p>
                      <button onClick={() => setShowCreateModal(true)} className="text-violet-500 font-bold mt-2">Start a Signal</button>
                  </div>
              )}
          </div>
      </div>
  );

  const SearchView = () => (
      <div className="w-full max-w-2xl min-h-screen pb-24 p-4">
          <h2 className="text-3xl font-black text-white mb-6">Explore</h2>
          <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Search signals..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-violet-600 outline-none"
              />
              <button 
                onClick={() => setShowRadar(!showRadar)}
                className={`px-4 rounded-xl border flex items-center ${showRadar ? 'bg-green-500 text-black border-green-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
              >
                  <Radar className={showRadar ? 'animate-spin-slow' : ''} />
              </button>
          </div>

          {showRadar ? (
              <RadarView posts={posts} onPostSelect={(p) => setActiveChatUser(p.user)} />
          ) : (
             <div className="space-y-4">
                 <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Recent Activity</h3>
                 {posts.map(p => <PostCard key={p.id} post={p} onChat={() => setActiveChatUser(p.user)} />)}
             </div>
          )}
      </div>
  );

  const MessagesView = () => (
      <div className="w-full max-w-2xl min-h-screen pb-24 p-4">
          <h2 className="text-3xl font-black text-white mb-6">Messages</h2>
          <div className="space-y-2">
              {MOCK_CHATS.map(chat => (
                  <div key={chat.id} onClick={() => setActiveChatUser(chat.participant)} className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 flex items-center gap-4 cursor-pointer hover:bg-zinc-800 transition-colors">
                      <div className="relative">
                        <img src={chat.participant.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                        {chat.participant.isVerified && <div className="absolute -bottom-1 -right-1"><VerifiedBadge /></div>}
                      </div>
                      <div className="flex-1">
                          <h4 className="font-bold text-white">{chat.participant.name}</h4>
                          <p className="text-sm text-zinc-400 truncate">{chat.lastMessage}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const ProfileView = () => (
      <div className="w-full max-w-2xl min-h-screen pb-24">
          <div className="h-40 bg-gradient-to-b from-violet-900/20 to-zinc-900 border-b border-zinc-800"></div>
          <div className="px-6 -mt-12">
              <div className="flex justify-between items-end mb-4">
                   <img src={userProfile.avatar} className="w-24 h-24 rounded-full border-4 border-[#050505] object-cover" alt="" />
                   <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200">Edit Profile</button>
              </div>
              <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-black text-white">{userProfile.name}</h2>
              </div>
              <p className="text-zinc-500 mb-4">{userProfile.handle}</p>
              
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">My Signals</h3>
              <div>{posts.filter(p => p.userId === userProfile.id).map(p => <PostCard key={p.id} post={p} onChat={()=>{}} />)}</div>
          </div>
      </div>
  );

  // --- RENDER LOGIC ---
  
  // 1. Landing Page (Public)
  if (!hasEntered && !authUser) {
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  // 2. Auth Page (Public but triggered)
  if (!authUser) {
      return <AuthPage />;
  }

  // 3. Onboarding (New User)
  if (!hasOnboarded) {
      return <OnboardingScreens onComplete={completeOnboarding} />;
  }

  // 4. Chat Overlay
  if (activeChatUser) {
      return (
          <div className="flex justify-center bg-[#050505] min-h-screen">
              <div className="w-full max-w-2xl h-screen flex flex-col border-x border-zinc-800">
                  <ChatInterface participant={activeChatUser} onBack={() => setActiveChatUser(null)} />
              </div>
          </div>
      );
  }

  // 5. Main App
  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center font-sans">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-zinc-800 p-6 z-50">
            <div className="flex items-center gap-2 mb-10 text-2xl font-black italic tracking-tighter cursor-pointer" onClick={() => setCurrentView('home')}>
                Link<span className="text-violet-600">Up</span>
            </div>
            
            <nav className="space-y-2 flex-1">
                <NavBtn icon={Home} label="Home" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
                <NavBtn icon={Search} label="Search" active={currentView === 'search'} onClick={() => setCurrentView('search')} />
                <NavBtn icon={MessageSquare} label="Messages" active={currentView === 'messages'} onClick={() => setCurrentView('messages')} />
                <NavBtn icon={UserIcon} label="Profile" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
            </nav>

            <button 
                onClick={() => setShowCreateModal(true)}
                className="w-full py-3 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 mb-6"
            >
                <PlusCircle className="w-5 h-5" /> POST SIGNAL
            </button>
            
            <button onClick={logout} className="flex items-center gap-2 text-zinc-600 hover:text-white text-sm font-bold">
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex justify-center w-full lg:border-r lg:border-zinc-800 bg-[#050505]">
            {currentView === 'home' && <HomeView />}
            {currentView === 'search' && <SearchView />}
            {currentView === 'messages' && <MessagesView />}
            {currentView === 'profile' && <ProfileView />}
        </main>

        {/* Mobile Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#050505]/95 backdrop-blur border-t border-zinc-800 flex justify-around items-center p-3 z-50 pb-safe">
            <MobileBtn icon={Home} active={currentView === 'home'} onClick={() => setCurrentView('home')} />
            <MobileBtn icon={Search} active={currentView === 'search'} onClick={() => setCurrentView('search')} />
            <div className="relative -top-5">
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform"
                >
                    <PlusCircle className="w-6 h-6 stroke-[3px]" />
                </button>
            </div>
            <MobileBtn icon={MessageSquare} active={currentView === 'messages'} onClick={() => setCurrentView('messages')} />
            <MobileBtn icon={UserIcon} active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
        </div>

        {showCreateModal && (
            <CreatePostModal 
                onClose={() => setShowCreateModal(false)} 
                onSubmit={handlePostSubmit}
                initialCategory={currentTab as Category} 
            />
        )}
    </div>
  );
};

const NavBtn = ({ icon: Icon, label, active, onClick }: any) => (
    <button 
        onClick={onClick} 
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}
    >
        <Icon className={`w-5 h-5 ${active ? 'stroke-[3px]' : ''}`} />
        <span className="font-bold">{label}</span>
    </button>
);

const MobileBtn = ({ icon: Icon, active, onClick }: any) => (
    <button onClick={onClick} className={`p-2 ${active ? 'text-white' : 'text-zinc-600'}`}>
        <Icon className={`w-6 h-6 ${active ? 'stroke-[3px]' : ''}`} />
    </button>
);

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}