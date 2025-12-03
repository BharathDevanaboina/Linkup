
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { 
  Zap, 
  MapPin, 
  Shield, 
  Lock, 
  Star, 
  Activity, 
  ChevronRight, 
  Ghost, 
  Trophy, 
  Calendar,
  ArrowRight,
  Download
} from 'lucide-react';

// --- SHARED COMPONENTS ---

// Magnetic Button Component for premium feel
const MagneticButton = ({ children, className, onClick, variant = 'primary' }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.25); // Increased magnetic strength slightly for better feel
    y.set((clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const baseStyles = "relative px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 overflow-hidden group";
  
  const variants = {
    primary: "bg-white text-black hover:bg-violet-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]",
    secondary: "bg-zinc-900 text-white border border-zinc-700 hover:border-violet-500/50 hover:bg-zinc-800 hover:shadow-[0_0_20px_rgba(106,76,255,0.1)]",
    outline: "bg-transparent text-white border border-white/20 hover:border-white hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

// 3D Tilt Card for Pillars
const TiltCard = ({ title, sub, icon: Icon, delay }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x);
  const mouseY = useSpring(y);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative h-96 w-full rounded-3xl bg-zinc-900/50 border border-white/5 p-8 flex flex-col justify-end overflow-hidden group hover:border-violet-500/30 transition-colors"
    >
      <div 
        style={{ transform: "translateZ(50px)" }} 
        className="absolute top-8 left-8 p-4 bg-zinc-800/50 rounded-2xl border border-white/10 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-500"
      >
        <Icon className="w-8 h-8" />
      </div>
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
        <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-lg group-hover:text-zinc-200 transition-colors">{sub}</p>
      </div>
      
      {/* Background Gradient Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, rgba(106, 76, 255, 0.15), transparent 80%)`
        }}
      />
    </motion.div>
  );
};

// --- SECTIONS ---

const HeroSection = ({ onEnter }: { onEnter: () => void }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[#050505]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <motion.div 
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
        ></motion.div>
      </div>

      <motion.div style={{ y: y1, opacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Live Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 mb-8 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">LIVE: 542 signals nearby</span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-6 mix-blend-difference">
          THE LIMITLESS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">LIFE.</span>
        </h1>

        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-xl md:text-2xl text-zinc-400 mb-10 font-light tracking-wide max-w-2xl mx-auto"
        >
            Don't just scroll. Do something. <br className="hidden md:block"/>
            The real world action network is waiting.
        </motion.p>

        {/* CTAs */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <MagneticButton onClick={onEnter}>
            Enter the Network <ArrowRight className="w-5 h-5" />
          </MagneticButton>
          <MagneticButton variant="secondary">
            Get the App <Download className="w-5 h-5" />
          </MagneticButton>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-600"
      >
        <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center p-2">
            <div className="w-1 h-1 bg-zinc-500 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

const PillarsSection = () => {
  return (
    <section className="py-32 px-4 bg-[#050505] relative z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Choose your protocol.</h2>
          <p className="text-zinc-500 text-xl max-w-xl">Three ways to engage with reality. No ads. No algorithms. Just action.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <TiltCard 
            title="Events" 
            sub="Find action near you. Parties, rides, meetups." 
            icon={Calendar} 
            delay={0.1}
          />
          <TiltCard 
            title="Tasks" 
            sub="Get paid to help. Line-standing, tuition, rentals." 
            icon={Zap} 
            delay={0.2} 
          />
          <TiltCard 
            title="Challenges" 
            sub="Win real rewards. High stakes, high glory." 
            icon={Trophy} 
            delay={0.3} 
          />
        </div>
      </div>
    </section>
  );
};

const FeedPreviewSection = () => {
  const cards = [
    { user: 'Sarah Chen', action: 'Hosting Rooftop Party', loc: 'Downtown, LA', time: '2m ago', type: 'EVENT' },
    { user: 'Mike Ross', action: 'Needs Line Stander', loc: 'Supreme Store, NYC', time: '5m ago', type: 'TASK' },
    { user: 'Jake Paul', action: '10km Run Challenge', loc: 'City Park', time: '12m ago', type: 'BOUNTY' },
    { user: 'Anonymous', action: 'Secret Confession', loc: 'Encrypted', time: '1m ago', type: 'SECRET' },
    { user: 'Emma W.', action: 'Study Group', loc: 'Library', time: '15m ago', type: 'EVENT' },
  ];

  return (
    <section className="py-24 bg-[#09090b] overflow-hidden border-y border-white/5">
       <div className="max-w-7xl mx-auto px-4 mb-12">
           <h2 className="text-2xl font-bold text-zinc-400 uppercase tracking-widest">Live Feed Preview</h2>
       </div>
       
       {/* Infinite Marquee */}
       <div className="flex gap-6 w-full marquee-track hover:pause-animation">
          {[...cards, ...cards, ...cards].map((card, i) => (
            <div key={i} className="flex-shrink-0 w-80 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-violet-500/50 hover:bg-zinc-800 transition-all cursor-default group">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-full ${card.type === 'SECRET' ? 'bg-pink-500/20 text-pink-500' : 'bg-zinc-700'} flex items-center justify-center`}>
                        {card.type === 'SECRET' ? <Ghost size={14} /> : <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800"></div>}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white">{card.user}</p>
                        <p className="text-xs text-zinc-500">{card.time}</p>
                     </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded text-zinc-400 border border-white/5">{card.type}</span>
               </div>
               <h4 className="text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">{card.action}</h4>
               <div className="flex items-center text-xs text-zinc-500">
                  <MapPin size={12} className="mr-1" /> {card.loc}
               </div>
            </div>
          ))}
       </div>
    </section>
  );
};

const SafetySection = () => {
  const items = [
    { icon: Shield, title: "Verified Identities", desc: "Blue ticks mean real people. ID verification required for high stakes." },
    { icon: Lock, title: "Encrypted Secrets", desc: "Ghost Protocol ensures your chats stay between you and the recipient." },
    { icon: Star, title: "Reputation System", desc: "5-star rating system holds everyone accountable." },
    { icon: MapPin, title: "Location Privacy", desc: "Blur your exact location until you accept a request." }
  ];

  return (
    <section className="py-32 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-20">
         <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for the real world.</h2>
         <p className="text-zinc-500 max-w-2xl mx-auto text-lg">Safety isn't an afterthought. It's the foundation of the network.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900 hover:border-violet-500/20 transition-all text-center md:text-left"
          >
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 mx-auto md:mx-0 text-white">
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  return (
    <section className="py-32 bg-zinc-900 relative overflow-hidden">
       {/* Background noise */}
       <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

       <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                  From scrolling <br/> to <span className="text-violet-500">doing.</span>
                </h2>
                <div className="space-y-12">
                   {[
                     { step: '01', title: 'Discover', desc: 'Open the radar. See 500+ signals around you instantly.' },
                     { step: '02', title: 'Join', desc: 'Tap to join a party, accept a task, or take a challenge.' },
                     { step: '03', title: 'Earn', desc: 'Complete tasks or win bounties to get paid instantly.' }
                   ].map((item, i) => (
                     <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="flex gap-6"
                     >
                        <span className="text-4xl font-black text-zinc-800">{item.step}</span>
                        <div>
                           <h4 className="text-2xl font-bold text-white mb-2">{item.title}</h4>
                           <p className="text-zinc-500">{item.desc}</p>
                        </div>
                     </motion.div>
                   ))}
                </div>
             </div>
             
             {/* Abstract Visual - Just a placeholder for the app phone or graphic */}
             <div className="relative h-[600px] bg-black rounded-3xl border border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent"></div>
                <div className="w-64 h-64 bg-violet-600 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
                <div className="relative z-10 text-center">
                   <Activity className="w-24 h-24 text-white mx-auto mb-4 opacity-80" />
                   <p className="text-zinc-500 font-mono text-sm tracking-widest">SYSTEM ACTIVE</p>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="py-32 px-4 max-w-5xl mx-auto text-center">
       <h2 className="text-2xl font-bold text-zinc-700 mb-16 uppercase tracking-widest">Network Activity</h2>
       <div className="grid md:grid-cols-3 gap-8">
          {[
            { q: "Finally an app that gets me out of the house. Made $200 last week doing tasks.", u: "@alex_d" },
            { q: "The anonymous chat is actually safe. Best place to vent without drama.", u: "@ghost_99" },
            { q: "Hosted a watch party and 15 people showed up. Vibe was insane.", u: "@sarah_c" }
          ].map((t, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2 }}
               className="p-8 bg-zinc-900/30 rounded-2xl border border-white/5"
            >
               <p className="text-lg text-zinc-300 mb-6 font-light">"{t.q}"</p>
               <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-zinc-800 rounded-full"></div>
                  <span className="text-sm font-mono text-zinc-500">{t.u}</span>
               </div>
            </motion.div>
          ))}
       </div>
    </section>
  );
};

const FooterSection = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <footer className="py-24 px-4 bg-black border-t border-zinc-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                Ready to enter <br/> the network?
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
                <MagneticButton onClick={onEnter} className="w-full md:w-auto justify-center">Enter the Network</MagneticButton>
                <MagneticButton variant="outline" className="w-full md:w-auto justify-center">Download for iOS</MagneticButton>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-zinc-500 text-sm mb-12">
                <a href="#" className="hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-white transition-colors">Safety Protocol</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
            
            <p className="text-zinc-700 text-xs">© 2024 LinkUp Inc. All rights reserved.</p>
        </div>
        
        {/* Footer Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-violet-900/20 blur-[120px] pointer-events-none"></div>
    </footer>
  );
};

export const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-violet-500/30 selection:text-white">
      <HeroSection onEnter={onEnter} />
      <PillarsSection />
      <FeedPreviewSection />
      <SafetySection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FooterSection onEnter={onEnter} />
    </div>
  );
};
