import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Settings2, X, Play, Pause, Eye, Hand, Moon, Skull, CircleDashed, TriangleAlert, Youtube, ArrowUp, MonitorPlay } from "lucide-react";

export default function App() {
  // 1. Image Paths - Fixed absolute paths for stability
  const [images, setImages] = useState({
    avatar: "/kikuotouxiang.png",
    vinylCover1: "/1.png",
    vinylCover2: "/2.png",
    gallery1: "/nishui.png",
    gallery2: "/3.png",
    gallery3: "/4.png",
    album1: "/1.png",
    album2: "/2.png",
    album3: "/3.png",
    album4: "/4.png",
    album5: "/1.png",
    album6: "/2.png",
    album7: "/nishui.png",
    album8: "/3.png",
    album9: "/4.png",
  });

  const [audios, setAudios] = useState({
    song1: "/kikuo-chansheng.mp3",
    song2: "/wobuzaixuexiaoderizi.mp3",
    song3: "/haohaizihehuxian.mp3",
    song4: "/dongxueshenghuo.mp3",
    song5: "/wobuzaixuexiaoderizi.mp3",
    song6: "/haohaizihehuxian.mp3",
  });

  const [activeSongIdx, setActiveSongIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGlobalTrack, setActiveGlobalTrack] = useState<{ title: string; audioUrl: string } | null>(null);
  const [selectedAlbumModal, setSelectedAlbumModal] = useState<number | null>(null);
  const [immersiveAlbumId, setImmersiveAlbumId] = useState<number | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showMVPanel, setShowMVPanel] = useState(false);
  const [isDraggingSinger, setIsDraggingSinger] = useState(false);
  const [singerTrail, setSingerTrail] = useState<Array<{ id: number; x: number; y: number; img: string; rotate: number }>>([]);
  const [activeTheaterMV, setActiveTheaterMV] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const mvList = [
    { title: "Love Me, Love Me, Love Me", year: "2015", url: "https://www.youtube.com/watch?v=NTrm_idbhUk", img: "/1.png" },
    { title: "I'm Sorry, I'm Sorry", year: "2013", url: "https://www.youtube.com/watch?v=I1mOeAtPkgk", img: "/2.png" },
    { title: "You're a Useless Child", year: "2013", url: "https://www.youtube.com/watch?v=nPF7lit7Z00", img: "/3.png" },
    { title: "Corpse Dance", year: "2015", url: "https://www.youtube.com/watch?v=O9eHRiaTuL4", img: "/4.png" },
    { title: "Hole-Dwelling", year: "2018", url: "https://www.youtube.com/watch?v=I15sK7dNMOM", img: "/nishui.png" },
  ];

  // Hide browser media controls from system notification area
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      // Disable previous/next track buttons in OS
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }
  }, []);

  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroTextY = useTransform(scrollY, [0, 1000], [0, 800]);

  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const isTouchpad = Math.abs(e.deltaX) !== 0 || Math.abs(e.deltaY) < 15;
      if (!isTouchpad && horizontalScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = horizontalScrollRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        const canScrollHorizontal = (e.deltaY > 0 && scrollLeft < maxScrollLeft) || (e.deltaY < 0 && scrollLeft > 0);
        
        if (canScrollHorizontal) {
          e.preventDefault();
          horizontalScrollRef.current.scrollBy({ left: e.deltaY * 2, behavior: 'smooth' });
        }
      }
    };
    
    const el = horizontalScrollRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (el) el.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const albums = [
    { theme: "怪诞童话", title: "愛して愛して愛して", enTheme: "Grotesque Fairy Tale", audioUrl: audios.song6, coverKey: "vinylCover1", accent: "text-candy-pink", border: "border-candy-pink", desc: "甜美外表下的不安感，极致扭曲的爱意渴求", lyrics: "遥远的远方 遥远的远方\n在这个不可思议的国度\n谁都不爱的 谁都不爱的\n只有我一个人\n爱我吧 爱我吧 爱我吧" },
    { theme: "天真诡异", title: "塵塵呪詛", enTheme: "Innocent Horror", audioUrl: audios.song2, coverKey: "vinylCover2", accent: "text-candy-orange", border: "border-candy-orange", desc: "儿童涂鸦感与暗黑内涵的冲突，纯真诅咒", lyrics: "那孩子是如此的不幸\n因为被诅咒所以才变得不幸\n谁都不爱的 谁都不爱的\n只有我一个人\n所以说 没用吧 没用吧" },
    { theme: "狂气空灵", title: "暗叫", enTheme: "Manic Ethereal", audioUrl: audios.song1, coverKey: "vinylCover1", accent: "text-candy-lime", border: "border-candy-lime", desc: "既狂躁又虚无的情绪张力，深渊中呼喊", lyrics: "在黑暗之中 在黑暗之中\n寻找着那一丝光明\n就算挣扎 就算哭喊\n谁也听不到 谁也看不到\n所以就让一切 毁灭吧" },
    { theme: "宗教仪式感", title: "産声", enTheme: "Ritualistic Sacredness", audioUrl: audios.song3, coverKey: "vinylCover2", accent: "text-cyan-400", border: "border-cyan-400", desc: "庄严神秘的氛围，生命伊始的空灵与迷惘", lyrics: "最初的一声 最初的一声\n宣告着降临于世的喜悦与恐惧" }
  ];

  useEffect(() => {
    if (audioRef.current) {
      const targetUrl = activeGlobalTrack ? activeGlobalTrack.audioUrl : albums[activeSongIdx].audioUrl;
      if (!audioRef.current.src.endsWith(targetUrl)) {
        audioRef.current.src = targetUrl;
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.warn("Play prevented:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [activeSongIdx, activeGlobalTrack, isPlaying, albums]);

  const handleTrackClick = (idx: number) => {
    setActiveGlobalTrack(null);
    if (activeSongIdx === idx) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSongIdx(idx);
      setIsPlaying(true);
    }
  };

  const handleGlobalTrackClick = (track: { title: string; audioUrl: string }, albumId: number) => {
    if (activeGlobalTrack?.title === track.title) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveGlobalTrack(track);
      setImmersiveAlbumId(albumId);
      setIsPlaying(true);
    }
  };

  const { scrollXProgress } = useScroll({
    container: horizontalScrollRef
  });

  const bgElements = useMemo(() => Array.from({ length: 30 }).map((_, i) => {
    const size = Math.random() * 60 + 20;
    const type = Math.floor(Math.random() * 4); 
    const colors = ['text-candy-pink', 'text-candy-lime', 'text-candy-yellow', 'text-candy-orange', 'text-cyan-400'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      size,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: Math.random() * 30 + 15,
      delay: Math.random() * -20,
      type,
      color
    };
  }), []);

  const activeSong = albums[activeSongIdx];
  const activeCoverUrl = images[activeSong.coverKey as keyof typeof images];
  const singerTrailImages = ["/kikuo1.jpg", "/kikuo2.jpg", "/kikuo3.jpg", "/kikuo4.jpg", "/kikuo5.jpg", "/kikuo6.jpg", "/kikuo7.jpg"];
  const playDreamCardSound = (tone: number) => {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(tone, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(tone * 0.52, ctx.currentTime + 0.28);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.36);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.38);
    window.setTimeout(() => ctx.close(), 520);
  };
  const goToYouTube = (url: string) => {
    window.open(url, "_self");
    window.setTimeout(() => {
      window.location.assign(url);
    }, 80);
  };
  const addSingerTrailImage = (x: number, y: number) => {
    const id = Date.now() + Math.random();
    setSingerTrail(prev => [
      ...prev.slice(-26),
      {
        id,
        x,
        y,
        img: singerTrailImages[Math.floor(Math.random() * singerTrailImages.length)],
        rotate: Math.random() * 34 - 17
      }
    ]);
    window.setTimeout(() => {
      setSingerTrail(prev => prev.filter(spot => spot.id !== id));
    }, 1400);
  };

  const allAlbums = [
    { 
      id: 1, 
      title: "Kikuo Miku", 
      color: "bg-candy-pink", 
      textColor: "text-candy-pink", 
      imgKey: "album1", 
      year: "2011", 
      releaseDate: "2011年08月14日", 
      artists: "きくお / Si_ku", 
      thoughts: "Kikuo Miku系列的起点。充满了初期冲动与实验色彩。", 
      desc: "初代疯狂，怪诞童话开端", 
      tracks: [
        { title: "僕をそんな目で見ないで", audioUrl: audios.song1 },
        { title: "暗叫", audioUrl: audios.song1 }
      ] 
    },
    { id: 2, title: "Kikuo Miku 2", color: "bg-candy-lime", textColor: "text-candy-lime", imgKey: "album2", year: "2012", releaseDate: "2012年07月08日", artists: "きくお / Si_ku", thoughts: "深化了暗黑童话风格。", desc: "儿童游乐园的崩溃边缘", tracks: [{ title: "塵塵呪詛", audioUrl: audios.song2 }, { title: "ごめんね ごめんね", audioUrl: audios.song3 }] },
    { id: 3, title: "Kikuo Miku 3", color: "bg-candy-yellow", textColor: "text-candy-yellow", imgKey: "album3", year: "2013", releaseDate: "2013年08月12日", artists: "きくお / Si_ku", thoughts: "捕捉深渊中闪烁的、脆弱的美感。", desc: "深渊底部的星光与呼唤", tracks: [{ title: "産声", audioUrl: audios.song3 }, { title: "君はできない子", audioUrl: audios.song4 }] },
    { id: 4, title: "Kikuo Miku 4", color: "bg-candy-orange", textColor: "text-candy-orange", imgKey: "album4", year: "2014", releaseDate: "2014年12月30日", artists: "きくお / Si_ku", thoughts: "祭典般的狂热。", desc: "狂气爆发，无法停止的舞步", tracks: [{ title: "あなぐらぐらし", audioUrl: audios.song4 }, { title: "UFO", audioUrl: audios.song5 }] },
    { id: 5, title: "Kikuo Miku 5", color: "bg-cyan-500", textColor: "text-cyan-500", imgKey: "album5", year: "2015", releaseDate: "2015年12月31日", artists: "きくお / Si_ku", thoughts: "充满了宗教般的庄严感与神圣感。", desc: "宗教迷幻的神圣殿堂", tracks: [{ title: "O Light", audioUrl: audios.song5 }, { title: "愛して愛して愛して", audioUrl: audios.song6 }] },
    { id: 6, title: "Kikuo Miku 6", color: "bg-candy-pink", textColor: "text-candy-pink", imgKey: "album6", year: "2019", releaseDate: "2019年03月11日", artists: "きくお / Si_ku", thoughts: "时隔多年的回归之作。", desc: "漫长等待后的沉重回归", tracks: [{ title: "カラカラカラのカラ", audioUrl: audios.song6 }] },
    { id: 7, title: "Kikuo Miku 7", color: "bg-candy-lime", textColor: "text-candy-lime", imgKey: "album7", year: "2023", releaseDate: "2023年12月29日", artists: "きくお / Si_ku", thoughts: "宇宙规模的探索。", desc: "宇宙级别的孤独与绚烂", tracks: [{ title: "星くずの掃除婦", audioUrl: audios.song2 }, { title: "産声", audioUrl: audios.song3 }] },
    { id: 8, title: "KikuoHana", color: "bg-candy-yellow", textColor: "text-candy-yellow", imgKey: "album8", year: "2016", releaseDate: "2016年03月21日", artists: "きくお / 花たん", thoughts: "与花たん的深度合作。", desc: "双曲共振，迷幻的剧场", tracks: [{ title: "のぼれ！すすめ！高い塔", audioUrl: audios.song4 }] },
    { id: 9, title: "KikuoHana 2", color: "bg-candy-orange", textColor: "text-candy-orange", imgKey: "album9", year: "2017", releaseDate: "2017年09月15日", artists: "きくお / 花たん", thoughts: "情感的表达变得更加直接有力。", desc: "第二幕的诡异仪式", tracks: [{ title: "光よ", audioUrl: audios.song5 }] },
  ];

  const timelineEvents = [
    { id: 1, date: "2024.11.15", title: "Kikuo Live 2024 in Tokyo", desc: "Zepp Shinjuku - 狂气的祭典再临", location: "日本 · 东京", setlist: "愛して愛して愛して / ごめんね ごめんね", isPast: false, link: "#", imgKey: "gallery1" },
    { id: 2, date: "", title: "", desc: "", location: "", setlist: "", isPast: true, imgKey: "none" }, // empty gap
    { id: 3, date: "2024.08.10", title: "SUMMER SONIC 2024", desc: "幕张展览馆 - 午夜电子舞台", location: "日本 · 千叶", setlist: "塵塵呪詛 / 君はできない子", isPast: true, imgKey: "gallery2" },
    { id: 4, date: "", title: "", desc: "", location: "", setlist: "", isPast: true, imgKey: "none" }, // empty gap
    { id: 5, date: "2023.12.24", title: "Kikuoland Winter Special", desc: "在线虚拟演唱会 - 圣诞噩梦", location: "Global / Online", setlist: "暗叫 / 幽体離脱", isPast: true, imgKey: "gallery3" },
    { id: 6, date: "", title: "", desc: "", location: "", setlist: "", isPast: true, imgKey: "none" }, // empty gap
    { id: 7, date: "2023.05.05", title: "VOCALOID Fes", desc: "NicoNico 超会议 - 特别演出环节", location: "日本 · 幕张", setlist: "カラカラカラのカラ", isPast: true, imgKey: "album1" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden relative selection:bg-candy-pink selection:text-black">
      
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      
      {/* Background Dark Wash */}
      <motion.div 
        animate={{ 
          x: ['-20vw', '100vw', '-20vw'],
          y: ['-20vh', '100vh', '-20vh']
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="fixed w-[50vw] h-[50vw] bg-candy-pink/10 mix-blend-screen blur-[100px] rounded-full pointer-events-none z-0" 
      />

      {/* Crayon Filter Definition */}
      <svg className="hidden">
        <filter id="crayon">
          <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Geometry and Crayon Lines Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40" style={{ filter: 'url(#crayon)' }}>
        {bgElements.map((el, i) => {
          return (
            <motion.div
              key={i}
              className={`absolute ${el.color}`}
              style={{ left: `${el.x}%`, top: `${el.y}%` }}
              animate={{
                y: [0, Math.random() * 100 - 50, 0],
                rotate: [el.rotation, el.rotation + 360],
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                ease: "linear",
                delay: el.delay,
              }}
            >
              {el.type === 0 && <div className="rounded-full border-[3px] border-current" style={{ width: el.size, height: el.size }} />}
              {el.type === 1 && <div className="border-[3px] border-current" style={{ width: el.size, height: el.size }} />}
              {el.type === 2 && (
                <div className="border-b-[3px] border-l-[3px] border-current transform -rotate-45" style={{ width: el.size, height: el.size, borderTop: 'none', borderRight: 'none' }} />
              )}
              {el.type === 3 && (
                <svg width={el.size * 2} height={el.size} viewBox={`0 0 ${el.size * 2} ${el.size}`} className="overflow-visible">
                  <path d={`M0,${el.size/2} Q${el.size/2},0 ${el.size},${el.size/2} T${el.size*2},${el.size/2}`} fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
              )}
            </motion.div>
          );
        })}
      </div>





      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Navigation */}
        <nav className="py-8 px-6 md:px-12 flex justify-between items-center sticky top-0 bg-black/30 backdrop-blur-3xl z-40">
          <div className="font-display font-bold text-3xl tracking-widest text-candy-pink hover-glitch cursor-pointer">KIKUO</div>
          <div className="flex gap-12 text-xs font-bold tracking-widest uppercase font-mono">
            <a href="#about" className="text-gray-400 hover:text-white link-underline">简介</a>
            <a href="#works" className="text-gray-400 hover:text-white link-underline">作品</a>
            <a href="#albums" className="text-gray-400 hover:text-white link-underline">典藏</a>
            <a href="#events" className="text-gray-400 hover:text-white link-underline">演出</a>
            <a href="#gallery" className="text-gray-400 hover:text-white link-underline">画廊</a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-40 pb-64 px-6 md:px-12 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: [0.95, 1.02, 1], opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="mb-12 relative"
          >
            {/* Hero Image Container */}
            <motion.div style={{ y: heroImgY }} className="w-56 h-56 md:w-80 md:h-80 rounded-full overflow-hidden relative z-10 mx-auto">
              <img 
                src={images.avatar} 
                alt="Colorful abstract representation of Kikuo" 
                className="w-full h-full object-cover transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            {/* Minimalist decorations behind image */}
            <motion.div 
              style={{ y: heroImgY }}
              animate={{ rotate: 360 }} 
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 border border-white/20 rounded-full -z-10"
            />
            <motion.div 
              style={{ y: heroImgY }}
              animate={{ rotate: -360 }} 
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-16 border border-zinc-800 rounded-full -z-10"
            />
          </motion.div>

          <motion.div style={{ y: heroTextY }}>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="text-7xl md:text-[10rem] font-handwriting font-light tracking-widest mb-12 text-white/90 leading-none hover-glitch relative cursor-crosshair"
            >
              きくお
            </motion.h1>
          </motion.div>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="flex flex-wrap justify-center gap-8 font-mono text-sm tracking-widest uppercase text-zinc-500"
          >
            {[
              { tag: '怪诞童话' },
              { tag: '天真诡异' },
              { tag: '狂气空灵' },
              { tag: '宗教仪式' },
              { tag: '甜蜜的腐烂' }
            ].map(({tag}, i) => (
              <span key={i} className="px-2 hover:text-white transition-colors cursor-crosshair">
                {tag}
              </span>
            ))}
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-48 px-6 md:px-12 relative bg-black backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mr-auto ml-12"
          >
            <div className="flex items-center gap-6 mb-20 hover-glitch">
              <Moon className="w-8 h-8 text-candy-lime/70" />
              <h2 className="text-3xl md:text-5xl font-handwriting font-bold tracking-widest text-white/90">
                异世界神明与顽童
              </h2>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="text-lg md:text-xl font-mono leading-loose text-gray-400 max-w-3xl space-y-12 pl-12 border-l border-zinc-800"
            >
              <p>
                Kikuo (きくお) 是一位极具视觉与听觉冲击力的日本电子音乐制作人。他以其标志性的
                <strong className="text-candy-pink font-handwriting text-2xl mx-1">“彩虹色拖把头”星君（Hoshi-kun）</strong>
                形象示人，仿佛是从怪诞图画中走出的畸形角色。
              </p>
              <p className="ml-12">
                他的音乐呈现出一种极致的冲突美感：表面上是欢快、跳跃、充满童真的祭典旋律与游乐园般的声效，但在这些空灵的糖衣之下，包裹着病态、绝望的深渊。这种
                <strong className="text-candy-lime font-handwriting text-2xl mx-1 px-2 border-b border-candy-lime">“暗黑童话”</strong>
                风格，赋予了Kikuo极高的辨识度，也让他在众神林立的殿堂中占据了不可替代的狂悖位置。
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Works Section - The Vinyl Player Layout */}
        <section id="works" className="py-48 px-6 md:px-12">
          <div className="mb-32 text-left ml-12 hover-glitch">
            <h2 className="text-5xl md:text-7xl font-handwriting font-bold mb-6 tracking-widest text-white/90">绝望童话交响</h2>
            <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Click on a track to play the magic</p>
          </div>

          <div className="flex flex-col-reverse lg:flex-row justify-between relative mt-24">
             {/* Left: Tracks List */}
            <div className="w-full lg:w-5/12 flex flex-col gap-12 mt-32 z-10 p-6">
              <AnimatePresence>
                {albums.map((album, i) => {
                  const isActive = activeSongIdx === i;
                  return (
                    <motion.div
                      key={i}
                      onClick={() => handleTrackClick(i)}
                      whileHover={{ x: 10 }}
                      animate={isActive ? { x: 30 } : { x: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={`
                        cursor-crosshair rounded-none p-8 transition-colors duration-300 flex gap-6 items-center group relative
                        ${isActive ? 'bg-zinc-900/40 border-l border-white/20' : 'hover:bg-zinc-900/20'}
                      `}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                           <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase">{album.enTheme}</span>
                        </div>
                        <h3 className={`text-2xl md:text-3xl font-light font-handwriting mb-3 transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                          {album.title}
                        </h3>
                        <p className="text-xs text-zinc-500 font-mono tracking-widest">{album.desc}</p>
                      </div>
                      
                      <div className={`
                        w-12 h-12 flex shrink-0 items-center justify-center transition-all bg-transparent
                      `}>
                        {isActive && isPlaying ? <Pause className={`w-5 h-5 text-white animate-pulse`} /> : <Play className={`w-5 h-5 ml-1 ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-white'}`} />}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Right: Vinyl Player */}
            <div className="w-full lg:w-6/12 flex justify-end lg:pr-12 md:-mt-24 relative lg:sticky lg:top-1/4">
               <div className="relative">
                 {/* Floating Particles when playing */}
                 <AnimatePresence>
                   {isPlaying && (
                     Array.from({ length: 32 }).map((_, i) => {
                       const startX = (Math.random() - 0.5) * 450;
                       const startY = (Math.random() - 0.5) * 450;
                       return (
                         <motion.div
                           key={`particle-${i}`}
                           initial={{ 
                             x: `calc(-50% + ${startX}px)`, 
                             y: `calc(-50% + ${startY}px)`, 
                             opacity: 0, 
                             scale: 0 
                           }}
                           animate={{ 
                             y: `calc(-50% + ${startY - 180}px)`, 
                             opacity: [0, 1, 0],
                             scale: [0.6, 1.5, 0.6],
                           }}
                           transition={{ 
                             duration: Math.random() * 5 + 5,
                             repeat: Infinity,
                             ease: "linear",
                             delay: Math.random() * 5
                           }}
                           className="absolute top-1/2 left-1/2 z-0 w-1.5 h-1.5 rounded-full bg-candy-yellow mix-blend-screen pointer-events-none"
                           style={{
                               boxShadow: '0 0 15px 5px rgba(255, 230, 0, 0.5)'
                           }}
                         />
                       )
                     })
                   )}
                 </AnimatePresence>

                 <motion.div 
                   animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                   transition={
                     isPlaying 
                       ? { duration: 4, repeat: Infinity, ease: "linear" } 
                       : { duration: 0.5, ease: "easeOut" }
                   }
                   className={`w-72 h-72 md:w-[32rem] md:h-[32rem] rounded-full border border-zinc-800 bg-black flex items-center justify-center relative transition-shadow duration-700 z-10 overflow-hidden`}
                   style={{ 
                     boxShadow: isPlaying ? `0 0 100px rgba(255, 215, 0, 0.15), 0 0 40px rgba(255, 215, 0, 0.1)` : 'none'
                   }}
                 >
                   {/* Blurred Album Cover Background */}
                   <div 
                     className="absolute inset-0 opacity-40 transition-opacity duration-1000"
                     style={{ 
                       backgroundImage: `url(${activeCoverUrl})`,
                       backgroundSize: 'cover',
                       backgroundPosition: 'center',
                       filter: 'blur(10px) brightness(70%)',
                     }}
                   />

                   {/* Water Ripple Effect when playing */}
                   {isPlaying && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={`ripple-${i}`}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [0.5, 1.5], opacity: [0, 0.2, 0] }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              delay: i * 1.3,
                              ease: "easeOut"
                            }}
                            className="absolute border border-candy-yellow/30 rounded-full"
                            style={{ 
                              width: '100%', 
                              height: '100%',
                              boxShadow: 'inset 0 0 20px rgba(255, 215, 0, 0.1)'
                            }}
                          />
                        ))}
                     </div>
                   )}

                   {/* Groove lines */}
                   <div className="absolute inset-[5%] border border-zinc-900 rounded-full mix-blend-screen opacity-50"></div>
                   <div className="absolute inset-[15%] border border-zinc-800/60 rounded-full mix-blend-screen opacity-50"></div>
                   <div className="absolute inset-[25%] border border-zinc-900 rounded-full mix-blend-screen opacity-50"></div>
                   <div className="absolute inset-[35%] border border-zinc-800/40 rounded-full mix-blend-screen opacity-50"></div>
                   <div className="absolute inset-[40%] border border-zinc-900 rounded-full mix-blend-screen opacity-50"></div>
                   <div className="absolute inset-[45%] border border-zinc-800/30 rounded-full mix-blend-screen opacity-50"></div>

                   {/* Inner Label / Album Cover */}
                   <motion.div 
                     className="w-32 h-32 md:w-56 md:h-56 rounded-full overflow-hidden relative z-10 group border border-zinc-900 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                     whileHover={{ scale: 1.02 }}
                   >
                     <AnimatePresence mode="popLayout">
                        <motion.img 
                          key={activeCoverUrl}
                          initial={{ opacity: 0, rotate: -30 }}
                          animate={{ opacity: 1, rotate: 0, scale: isPlaying ? 1.2 : 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          src={activeCoverUrl} 
                          alt="Album Cover"
                          className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                     </AnimatePresence>
                     {/* Spindle hole */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-950 rounded-full shadow-inner border border-zinc-800 z-20"></div>
                   </motion.div>
                   
                 </motion.div>
               </div>
            </div>
          </div>
        </section>


        {/* Albums Collection Section */}
        <section id="albums" className="py-48 px-6 md:px-12 bg-black relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="text-right mb-32 hover-glitch mr-12">
              <h2 className="text-5xl md:text-7xl font-display font-light mb-6 tracking-widest text-white/90">典藏纪实</h2>
              <p className="text-zinc-500 font-sans text-sm tracking-widest">九重疯狂的实体收容物</p>
              
              {/* Horizontal Progress Bar */}
              <div className="mt-12 h-1 w-full max-w-xs ml-auto bg-zinc-900 overflow-hidden relative">
                <motion.div 
                  style={{ scaleX: scrollXProgress }}
                  className="absolute inset-0 bg-candy-lime origin-left"
                />
              </div>
            </div>

            <div 
              ref={horizontalScrollRef}
              className="flex gap-x-12 gap-y-32 overflow-x-auto pb-24 snap-x snap-mandatory hide-scrollbar" 
              style={{ paddingLeft: '50px', paddingRight: '50px' }}
            >
              {allAlbums.map((album, i) => (
                <motion.div 
                  key={album.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.1 }}
                  className={`relative group cursor-crosshair shrink-0 snap-center w-[85%] sm:w-[45%] lg:w-[28%] ${i % 2 === 1 ? 'lg:mt-32' : ''}`}
                  onClick={() => setSelectedAlbumModal(album.id)}
                >
                  {/* Album Frame */}
                  <div className={`aspect-square rounded-none overflow-hidden relative z-10 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}>
                    {/* Hover Arrow Indicator */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full group-hover:translate-y-2 transition-transform duration-500 z-50 pointer-events-none">
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-candy-lime p-2 rounded-full shadow-[0_0_20px_#A3E635]"
                      >
                         <ArrowUp className="w-6 h-6 text-black" />
                      </motion.div>
                    </div>

                    <img 
                      src={images[album.imgKey as keyof typeof images]} 
                      alt={album.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover Info Overlay with Play Button */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-white/10"
                      >
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </motion.div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] p-8 flex flex-col justify-end">
                      <p className="text-xs font-mono text-candy-yellow tracking-widest mb-2 animate-pulse uppercase">View Tracks & Listen</p>
                    </div>
                  </div>

                  {/* Album Info Text (Below) */}
                  <div className="mt-8 space-y-6 group-hover:translate-x-2 transition-transform duration-500">
                    <div>
                      <h3 className="text-3xl font-handwriting font-bold text-white tracking-widest hover-glitch">{album.title}</h3>
                      <p className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase mt-1">RELEASED: {album.releaseDate}</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase border-b border-zinc-800 pb-1">Included Tracks</p>
                      <ul className="text-[11px] text-zinc-300 font-mono space-y-1 opacity-80">
                        {album.tracks.map((t, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-candy-pink rounded-full"></span>
                            {t.title}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase border-b border-zinc-800 pb-1">Kikuo's Thoughts</p>
                      <p className="text-sm font-sans text-white/90 leading-relaxed font-light italic">
                        "{album.thoughts}"
                      </p>
                    </div>

                    <div className="pt-2">
                       <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Artist/Art: <span className="text-zinc-300">{album.artists}</span></p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Timeline Section */}
        <section id="events" className="py-48 px-6 md:px-12 bg-black relative">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-32 hover-glitch">
              <h2 className="text-5xl md:text-7xl font-display font-light mb-6 tracking-widest text-white/90">活动纪行</h2>
              <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">降临于现世的疯狂集会</p>
            </div>

            <div className="relative pl-8 md:pl-0">
              {/* Vertical line connecting nodes */}
              <div className="absolute left-[39px] md:left-1/2 md:-ml-[1px] top-4 bottom-4 w-[2px] bg-zinc-800" />
              
              {timelineEvents.map((ev, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-center md:items-start ${ev.date === "" ? "my-16" : "my-24"} w-full group`}
                >
                  {ev.date !== "" && (
                     <>
                        {/* Node circle */}
                        <div className={`absolute left-[32px] md:left-1/2 md:-ml-2 w-4 h-4 rounded-full border-2 bg-black z-10 transition-colors duration-300 ${!ev.isPast ? "border-candy-pink group-hover:bg-candy-pink shadow-[0_0_10px_#FF007F]" : "border-zinc-500 group-hover:bg-zinc-500"}`} />
                        
                        {/* Desktop layout: Left Date, Right Content */}
                        <div className={`hidden md:flex w-full items-start flex-row`}>
                            {/* Left Date */}
                            <div className="w-1/2 pr-16 text-right relative flex flex-col items-end">
                               <p className={`font-bold text-3xl tracking-widest transition-colors duration-300 ${!ev.isPast ? "text-candy-pink drop-shadow-[2px_2px_0_white]" : "text-zinc-500 group-hover:text-white"}`}>{ev.date}</p>
                               <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-right max-w-[250px]">
                                  {ev.location && <p className="text-zinc-400 font-mono text-xs tracking-widest uppercase mb-2 flex items-center justify-end gap-2"><span className="w-1 h-1 rounded-full bg-candy-pink"></span>{ev.location}</p>}
                                  {ev.setlist && <p className="text-zinc-500 font-mono text-xs leading-relaxed opacity-80">{ev.setlist}</p>}
                               </div>
                            </div>
                            
                            {/* Right Content */}
                            <div className="w-1/2 pl-16 relative flex flex-col items-start pr-32">
                               <h3 className={`font-handwriting font-light text-4xl mb-3 transition-colors duration-300 ${!ev.isPast ? "text-white" : "text-zinc-500 group-hover:text-white"}`}>{ev.title}</h3>
                               <p className={`font-light text-lg tracking-wider transition-colors duration-300 ${!ev.isPast ? "text-zinc-300" : "text-zinc-600 group-hover:text-zinc-300"}`}>{ev.desc}</p>
                               
                               {/* Image thumbnail offset */}
                               {ev.imgKey !== "none" && (
                                 <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] w-32 h-24 overflow-hidden border border-zinc-800 rounded pointer-events-none">
                                     <img src={images[ev.imgKey as keyof typeof images]} className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" alt="" referrerPolicy="no-referrer" />
                                 </div>
                               )}
                            </div>
                        </div>

                        {/* Mobile layout: Content is always on the right */}
                        <div className="md:hidden flex w-full">
                           <div className="pl-20 pr-4 py-2 relative flex flex-col items-start w-full">
                               <p className={`font-bold text-xl tracking-widest mb-1 transition-colors duration-300 ${!ev.isPast ? "text-candy-pink" : "text-zinc-500 group-hover:text-white"}`}>{ev.date}</p>
                               <h3 className={`font-handwriting font-light text-2xl mb-1 transition-colors duration-300 ${!ev.isPast ? "text-white" : "text-zinc-500 group-hover:text-white"}`}>{ev.title}</h3>
                               <p className={`font-light text-sm tracking-wider transition-colors duration-300 ${!ev.isPast ? "text-zinc-300" : "text-zinc-600 group-hover:text-zinc-300"}`}>{ev.desc}</p>
                               
                               <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 duration-500 -translate-y-2 group-hover:translate-y-0">
                                  {ev.location && <p className="text-zinc-400 font-mono text-xs tracking-widest flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-candy-pink"></span>{ev.location}</p>}
                                  {ev.setlist && <p className="text-zinc-500 font-mono text-[10px] leading-relaxed">{ev.setlist}</p>}
                               </div>
                               
                               {/* Mobile Image thumbnail*/}
                               {ev.imgKey !== "none" && (
                                 <div className="mt-4 opacity-50 group-hover:opacity-100 transition-opacity duration-[600ms] w-full h-32 overflow-hidden border border-zinc-800 rounded pointer-events-none">
                                     <img src={images[ev.imgKey as keyof typeof images]} className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" alt="" referrerPolicy="no-referrer" />
                                 </div>
                               )}
                           </div>
                        </div>
                     </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-48 px-6 md:px-12 bg-black text-white relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="mb-32 pl-12 hover-glitch">
              <h2 className="text-5xl md:text-7xl font-handwriting font-light mb-6 tracking-widest text-white/90">幻境掠影</h2>
              <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">诡诞与神圣交织的视觉纪实</p>
            </div>

            <div className="flex flex-col md:flex-row gap-16 md:gap-24 h-auto md:h-[800px] items-center">
              {/* Image 1 (Large) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: [0.95, 1.02, 1] }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full md:w-7/12 h-[500px] md:h-[90%] overflow-hidden group relative"
              >
                <img 
                  src={images.gallery1} 
                  alt="Gallery large view" 
                  className="w-full h-full object-cover md:object-[center_20%] group-hover:scale-[1.02] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] mix-blend-color pointer-events-none" />
                <div className="absolute bottom-8 left-8 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-4">
                  <p className="font-handwriting text-xl text-white/80 tracking-widest">色彩爆破与混沌神格</p>
                </div>
              </motion.div>

              {/* Sidebar with two smaller images */}
              <div className="w-full md:w-4/12 h-full flex flex-col justify-center gap-16 md:gap-32">
                {/* Image 2 */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 50 }}
                  whileInView={{ opacity: 1, scale: [0.95, 1.02, 1], y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="w-4/5 ml-auto aspect-[4/5] overflow-hidden group relative"
                >
                  <img 
                    src={images.gallery2} 
                    alt="Gallery view 2" 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] sepia group-hover:sepia-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] pointer-events-none" />
                </motion.div>

                {/* Image 3 */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -50 }}
                  whileInView={{ opacity: 1, scale: [0.95, 1.02, 1], y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  className="w-3/4 mr-auto aspect-square overflow-hidden group relative"
                >
                  <img 
                    src={images.gallery3} 
                    alt="Gallery view 3" 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] saturate-0 group-hover:saturate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms] pointer-events-none" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Immersive Background Player Overlay */}
        <AnimatePresence mode="wait">
          {immersiveAlbumId && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[100] flex text-white overflow-hidden bg-black"
            >
              {/* Blurred Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-2xl brightness-50"
                style={{ backgroundImage: `url(${images[allAlbums.find(a => a.id === immersiveAlbumId)?.imgKey as keyof typeof images]})` }}
              />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
              
              {/* Close button */}
              <button 
                onClick={() => setImmersiveAlbumId(null)}
                className="absolute top-8 right-8 z-50 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-10 h-10" />
              </button>

              <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center p-8 md:p-12 gap-12 max-w-7xl mx-auto">
                {/* Left Side: Tracklist (shrunk to left) */}
                <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  className="w-full md:w-5/12 max-h-[85vh] overflow-y-auto space-y-4 pr-4 border-r border-white/10 custom-scrollbar"
                >
                  <div className="mb-12 sticky top-0 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <h2 className="text-4xl font-handwriting font-bold tracking-widest text-candy-lime drop-shadow-[4px_4px_0_#000]">
                      {allAlbums.find(a => a.id === immersiveAlbumId)?.title}
                    </h2>
                    <p className="text-white/40 font-mono mt-4 text-xs tracking-[0.2em] uppercase leading-relaxed font-bold">
                       {allAlbums.find(a => a.id === immersiveAlbumId)?.desc}
                    </p>
                  </div>
                  
                  <div className="space-y-3 pb-24">
                    {allAlbums.find(a => a.id === immersiveAlbumId)?.tracks?.map((track, idx) => {
                      const isGlobalActive = activeGlobalTrack?.title === track.title;
                      return (
                        <motion.div 
                          key={idx} 
                          whileHover={{ x: 5 }}
                          className={`group flex items-center justify-between p-5 border transition-all cursor-crosshair rounded-[20px] backdrop-blur-md
                            ${isGlobalActive 
                              ? 'bg-white/10 border-white/40 shadow-2xl' 
                              : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'}`
                          }
                          onClick={() => handleGlobalTrackClick(track, immersiveAlbumId)}
                        >
                          <div className="flex items-center gap-6">
                            <span className={`font-mono text-xs ${isGlobalActive ? 'text-candy-lime' : 'text-white/20 group-hover:text-white/60'}`}>
                              {(idx + 1).toString().padStart(2, '0')}
                            </span>
                            <span className={`text-lg md:text-xl font-bold font-handwriting tracking-widest ${isGlobalActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                              {track.title}
                            </span>
                          </div>
                          {isGlobalActive && isPlaying && (
                             <div className="flex items-end gap-1 h-4">
                                {[1, 2, 3, 4].map(i => (
                                  <motion.div 
                                    key={i}
                                    animate={{ height: ["20%", "100%", "20%"] }}
                                    transition={{ duration: 0.4 + Math.random(), repeat: Infinity }}
                                    className="w-1 bg-white rounded-full"
                                  />
                                ))}
                             </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Right Side: Visualizer Area */}
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="w-full md:w-7/12 flex flex-col items-center justify-center relative"
                >
                  {/* Large Spinning Cover with decorative rings */}
                  <div className="relative group">
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-12 border border-white/5 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-24 border border-white/5 rounded-full border-dashed"
                    />
                    
                    <motion.div
                      animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                      transition={isPlaying ? { duration: 12, repeat: Infinity, ease: "linear" } : { duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      className={`w-72 h-72 md:w-[32rem] md:h-[32rem] rounded-full border-[10px] shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden relative z-10 transition-all duration-1000
                        ${allAlbums.find(a => a.id === immersiveAlbumId)?.color.replace('bg-', 'border-').replace('cyan-500', 'cyan-400')}
                      `}
                      style={{ filter: isPlaying ? 'none' : 'grayscale(0.5) contrast(1.2)' }}
                    >
                       <div className="absolute inset-0 border-[30px] border-black/90 rounded-full z-10 pointer-events-none" />
                       <div className="absolute inset-[33%] bg-black/90 rounded-full z-20 flex items-center justify-center shadow-inner border border-zinc-800 backdrop-blur-md">
                          <div className="w-6 h-6 bg-zinc-950 rounded-full border-2 border-zinc-700 shadow-inner flex items-center justify-center">
                             <div className="w-1.5 h-1.5 bg-candy-lime rounded-full animate-pulse" />
                          </div>
                       </div>
                       <img 
                         src={images[allAlbums.find(a => a.id === immersiveAlbumId)?.imgKey as keyof typeof images]} 
                         alt="Album Art" 
                         className="w-full h-full object-cover mix-blend-screen opacity-90 scale-110"
                       />
                       {/* Subtle Vinyl Grooves */}
                       <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(255,255,255,0.03)_41%,transparent_42%)] bg-[length:20px_20px]" />
                    </motion.div>
                  </div>

                  {/* Current track info & Controls */}
                  <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center w-full max-w-xl"
                  >
                     <motion.div 
                       key={activeGlobalTrack?.title}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="bg-white/5 backdrop-blur-2xl p-10 rounded-[32px] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
                     >
                       <h3 className="text-4xl md:text-6xl font-handwriting font-bold tracking-widest text-white drop-shadow-[4px_4px_0_#FF007F] mb-12">
                         {activeGlobalTrack?.title}
                       </h3>
                       
                       <div className="flex items-center justify-center gap-12">
                         <button 
                           onClick={() => {
                             const tracks = allAlbums.find(a => a.id === immersiveAlbumId)?.tracks;
                             if (tracks) {
                               const currIdx = tracks.findIndex(t => t.title === activeGlobalTrack?.title);
                               if (currIdx > 0) handleGlobalTrackClick(tracks[currIdx - 1], immersiveAlbumId);
                               else handleGlobalTrackClick(tracks[tracks.length - 1], immersiveAlbumId);
                             }
                           }} 
                           className="text-white/30 hover:text-white hover:scale-125 transition-all p-4 active:scale-95"
                         >
                           <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20" fill="currentColor"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                         </button>

                         <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-28 h-28 rounded-3xl bg-white text-black flex items-center justify-center shadow-[0_15px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_25px_60px_rgba(255,255,255,0.4)] transition-all bg-gradient-to-br from-white to-zinc-200"
                         >
                           {isPlaying ? <Pause className="w-12 h-12 fill-black" /> : <Play className="w-12 h-12 fill-black ml-2" />}
                         </motion.button>

                         <button 
                           onClick={() => {
                             const tracks = allAlbums.find(a => a.id === immersiveAlbumId)?.tracks;
                             if (tracks) {
                               const currIdx = tracks.findIndex(t => t.title === activeGlobalTrack?.title);
                               if (currIdx < tracks.length - 1) handleGlobalTrackClick(tracks[currIdx + 1], immersiveAlbumId);
                               else handleGlobalTrackClick(tracks[0], immersiveAlbumId);
                             }
                           }} 
                           className="text-white/30 hover:text-white hover:scale-125 transition-all p-4 active:scale-95"
                         >
                           <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4" fill="currentColor"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                         </button>
                       </div>

                       {/* Timeline visualizer dummy */}
                       <div className="mt-12 h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                         <motion.div 
                           animate={{ x: isPlaying ? ["-100%", "100%"] : "0%" }}
                           transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-0 bg-gradient-to-r from-transparent via-candy-pink to-transparent w-1/3"
                         />
                       </div>
                     </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedAlbumModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedAlbumModal(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-zinc-950 border border-white/20 shadow-2xl w-full max-w-4xl overflow-hidden relative rounded-3xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex flex-col md:flex-row h-full">
                  {/* Modal Sidebar (Album Info) */}
                  <div className="w-full md:w-5/12 p-8 border-b md:border-b-0 md:border-r border-white/10 bg-zinc-900/50">
                    <img 
                      src={images[allAlbums.find(a => a.id === selectedAlbumModal)?.imgKey as keyof typeof images]} 
                      className="w-full aspect-square object-cover rounded-xl shadow-2xl mb-8"
                      alt=""
                    />
                    <h3 className="text-4xl font-handwriting font-bold tracking-widest text-white mb-2">
                       {allAlbums.find(a => a.id === selectedAlbumModal)?.title}
                    </h3>
                    <p className="text-candy-lime font-mono text-xs tracking-widest uppercase mb-6">
                      {allAlbums.find(a => a.id === selectedAlbumModal)?.year} • {allAlbums.find(a => a.id === selectedAlbumModal)?.artists}
                    </p>
                    <p className="text-zinc-400 font-light text-sm leading-relaxed mb-8">
                       {allAlbums.find(a => a.id === selectedAlbumModal)?.thoughts}
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          const album = allAlbums.find(a => a.id === selectedAlbumModal);
                          if (album && album.tracks.length > 0) {
                            handleGlobalTrackClick(album.tracks[0], album.id);
                            setSelectedAlbumModal(null);
                          }
                        }}
                        className="flex-1 py-3 bg-white text-black font-bold font-mono text-sm rounded-full flex items-center justify-center gap-2 hover:bg-candy-lime transition-colors"
                      >
                        <Play className="w-4 h-4 fill-black" /> PLAY ALL
                      </button>
                    </div>
                  </div>

                  {/* Modal Tracks List */}
                  <div className="w-full md:w-7/12 p-8 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="text-sm font-mono tracking-widest text-zinc-500 uppercase">Tracklist</h4>
                      <button onClick={() => setSelectedAlbumModal(null)} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {allAlbums.find(a => a.id === selectedAlbumModal)?.tracks?.map((track, idx) => {
                        const isGlobalActive = activeGlobalTrack?.title === track.title;
                        const isPlayingNow = isGlobalActive && isPlaying;
                        return (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`group flex items-center justify-between p-4 transition-all cursor-crosshair rounded-xl
                              ${isGlobalActive 
                                ? 'bg-candy-pink/20 border border-candy-pink/50' 
                                : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/20'}`
                            }
                            onClick={() => handleGlobalTrackClick(track, selectedAlbumModal!)}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isGlobalActive ? 'bg-candy-pink text-white' : 'bg-black/40 text-zinc-600'}`}>
                                {isPlayingNow ? (
                                  <div className="flex items-end gap-0.5 h-3">
                                    {[1, 2, 3].map(i => (
                                      <motion.div 
                                        key={i}
                                        animate={{ height: ["20%", "100%", "20%"] }}
                                        transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                                        className="w-1 bg-white"
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <span className="font-mono text-xs">{idx + 1}</span>
                                )}
                              </div>
                              <span className={`text-base font-bold font-handwriting tracking-widest transition-colors ${isGlobalActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                                {track.title}
                              </span>
                            </div>
                            <div className={`transition-all ${isGlobalActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                               {isPlayingNow ? <Pause className="w-4 h-4 text-candy-pink" /> : <Play className="w-4 h-4 text-white" />}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Manager Panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-zinc-950 border-l border-white/10 z-[200] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-candy-lime rounded-lg">
                      <Settings2 className="w-6 h-6 text-black" />
                    </div>
                    <h2 className="text-2xl font-handwriting font-bold tracking-widest">Media Manager</h2>
                  </div>
                  <button onClick={() => setShowPanel(false)} className="text-zinc-500 hover:text-white bg-zinc-900 p-2 rounded-xl border border-white/5 transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-10">
                  {/* Images Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-mono tracking-[0.4em] uppercase text-zinc-500 border-l-2 border-candy-lime pl-4">Visual Assets</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(images).map(([key, val]) => (
                        <div key={key} className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2 ml-1">{key}</label>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-white/5">
                              <img src={val} className="w-full h-full object-cover" alt="" />
                            </div>
                            <input 
                              type="text" 
                              value={val}
                              onChange={(e) => setImages(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-zinc-300 focus:outline-none focus:border-candy-lime transition-colors"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audio Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-mono tracking-[0.4em] uppercase text-zinc-500 border-l-2 border-candy-pink pl-4">Audio Streams</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(audios).map(([key, val]) => (
                        <div key={key} className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2 ml-1">{key}</label>
                          <input 
                            type="text" 
                            value={val}
                            onChange={(e) => setAudios(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-zinc-300 focus:outline-none focus:border-candy-pink transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                   <p className="text-[10px] font-mono text-zinc-600 leading-relaxed uppercase tracking-tighter">
                     * All changes are reflected instantly in the UI. 
                     Make sure to use relative paths like /myimg.png or external URLs.
                   </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Manager Trigger Button */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPanel(true)}
          className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl transition-colors hover:bg-candy-lime group"
        >
          <Settings2 className="w-6 h-6 group-hover:animate-spin-slow" />
        </motion.button>

        {/* MV Panel Trigger Button */}
        <motion.button 
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowMVPanel(true)}
          className="fixed bottom-28 right-8 z-[150] w-14 h-14 bg-zinc-900 border border-white/10 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-colors hover:border-candy-pink hover:text-candy-pink group"
        >
          <Youtube className="w-6 h-6" />
        </motion.button>

        {/* MV Sidebar Panel */}
        <AnimatePresence>
          {showMVPanel && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-zinc-950 border-l border-white/10 z-[200] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-xl">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-candy-pink rounded-lg">
                      <MonitorPlay className="w-6 h-6 text-black" />
                    </div>
                    <h2 className="text-2xl font-handwriting font-bold tracking-widest">MV Gallery</h2>
                  </div>
                  <button onClick={() => setShowMVPanel(false)} className="text-zinc-500 hover:text-white bg-zinc-800 p-2 rounded-xl border border-white/5 transition-all">
                    <X className="w-6 h-6" />
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="space-y-6">
                  {mvList.map((mv, idx) => (
                    <motion.a
                      key={idx}
                      href={mv.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="block group bg-zinc-900/40 border border-white/5 rounded-[24px] overflow-hidden hover:border-candy-pink transition-all h-32 flex"
                    >
                      <div className="w-32 shrink-0 relative overflow-hidden">
                        <img 
                          src={mv.img.startsWith('/') ? mv.img : images[mv.img as keyof typeof images]} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          alt="" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                           <Youtube className="w-8 h-8 text-white/50 group-hover:text-candy-pink transition-colors" />
                        </div>
                      </div>
                      <div className="p-6 flex flex-col justify-center gap-1">
                        <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">{mv.year}</span>
                        <h4 className="text-lg font-handwriting font-bold tracking-wide group-hover:text-white transition-colors">{mv.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[9px] font-mono text-candy-pink/50 group-hover:text-candy-pink uppercase tracking-tighter transition-colors">WATCH ON YOUTUBE →</span>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-zinc-900/30">
                 <p className="text-[10px] font-mono text-zinc-600 leading-relaxed uppercase tracking-tighter text-center">
                   * Redirects to YouTube. Supports 4K/8K viewing if available.
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="py-12 text-center bg-black border-t-4 border-dashed border-white text-gray-400 font-mono font-bold tracking-widest text-sm relative overflow-hidden">
          <Moon className="absolute top-1/2 left-10 -translate-y-1/2 w-32 h-32 text-white/5 rotate-45" />
          <Skull className="absolute top-1/2 right-10 -translate-y-1/2 w-32 h-32 text-white/5 -rotate-12" />
          <p className="flex items-center justify-center gap-2 hover-glitch cursor-crosshair">
            MADLY MADE WITH <Skull className="w-5 h-5 text-candy-pink animate-bounce" /> FOR KIKUO.
          </p>
        </footer>

        {/* Added Page 1: MV Theater */}
        <section className="min-h-screen bg-black text-white relative overflow-hidden border-t-4 border-candy-pink">
          <div className="absolute inset-0 opacity-25" style={{ filter: 'url(#crayon)' }}>
            <div className="absolute top-16 left-8 w-40 h-40 border-[18px] border-candy-pink rounded-full rotate-12" />
            <div className="absolute bottom-20 right-12 w-52 h-52 border-[14px] border-candy-lime clip-triangle rotate-45" />
            <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-candy-yellow mix-blend-screen rotate-12" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
              <div>
                <p className="font-mono text-candy-pink tracking-[0.5em] text-xs uppercase mb-5">MV PAGE / DARK FAIRY TALE SCREENING</p>
                <h2 className="font-display text-5xl md:text-8xl leading-tight text-white hover-glitch">MV THEATER</h2>
              </div>
              <p className="max-w-xl text-zinc-400 font-handwriting text-2xl leading-relaxed">
                用黑底、噪声、霓虹色和失控童话感，把 Kikuo 的影像作品放进一间午夜放映厅。
              </p>
            </div>

            <div className="grid lg:grid-cols-[1.45fr_0.75fr] gap-6">
              <div className="relative aspect-video bg-zinc-950 border-2 border-candy-pink shadow-[0_0_60px_rgba(255,0,127,0.18)] overflow-hidden">
                <img
                  key={mvList[activeTheaterMV].img}
                  src={mvList[activeTheaterMV].img.startsWith('/') ? mvList[activeTheaterMV].img : images[mvList[activeTheaterMV].img as keyof typeof images]}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  alt=""
                />
                <div className="absolute inset-0 bg-black/45 mix-blend-multiply" />
                <div className="absolute inset-0" style={{ filter: 'url(#crayon)' }}>
                  <div className="absolute left-10 top-10 w-40 h-40 border-[14px] border-candy-lime rounded-full rotate-12 opacity-80" />
                  <div className="absolute right-12 bottom-12 w-32 h-32 bg-candy-yellow mix-blend-screen rotate-45 opacity-70" />
                </div>
                <div className="absolute left-6 right-6 bottom-24 md:bottom-20">
                  <p className="font-mono text-candy-lime text-xs tracking-[0.4em] uppercase mb-3">{mvList[activeTheaterMV].year}</p>
                  <h3 className="font-handwriting text-4xl md:text-6xl text-white leading-tight max-w-3xl hover-glitch">
                    {mvList[activeTheaterMV].title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => goToYouTube(mvList[activeTheaterMV].url)}
                  className="absolute left-6 bottom-6 z-30 inline-flex items-center gap-3 bg-candy-pink text-black px-5 py-4 font-mono text-xs font-bold tracking-[0.25em] uppercase hover:bg-white transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  PLAY ON YOUTUBE
                </button>
              </div>
              <div className="grid gap-4">
                {mvList.slice(0, 4).map((mv, idx) => (
                  <div
                    key={mv.title}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveTheaterMV(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setActiveTheaterMV(idx);
                    }}
                    className={`group grid grid-cols-[96px_1fr] gap-4 bg-zinc-950/80 border p-3 transition-all text-left ${
                      activeTheaterMV === idx ? 'border-candy-pink' : 'border-white/10 hover:border-candy-pink'
                    }`}
                  >
                    <div className="relative h-24 overflow-hidden bg-black">
                      <img src={mv.img.startsWith('/') ? mv.img : images[mv.img as keyof typeof images]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <Youtube className="absolute inset-0 m-auto w-8 h-8 text-white/70 group-hover:text-candy-pink transition-colors" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] text-candy-lime tracking-[0.35em] font-mono uppercase">NO.{idx + 1} / {mv.year}</span>
                      <h3 className="mt-2 font-handwriting text-xl text-white leading-tight">{mv.title}</h3>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToYouTube(mv.url);
                        }}
                        className="mt-3 inline-flex w-fit text-[9px] font-mono text-candy-pink tracking-[0.25em] uppercase hover:text-white transition-colors"
                      >
                        YouTube 外链
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Added Page 2: Drag Singer Reveal */}
        <section
          className="min-h-screen bg-black text-white relative overflow-hidden cursor-grab active:cursor-grabbing border-t border-white/10 select-none"
          onPointerDown={(e) => {
            setIsDraggingSinger(true);
            addSingerTrailImage(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (isDraggingSinger) addSingerTrailImage(e.clientX, e.clientY);
          }}
          onPointerUp={() => setIsDraggingSinger(false)}
          onPointerLeave={() => setIsDraggingSinger(false)}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,127,0.12),transparent_45%)]" />
          {singerTrail.map((spot) => (
            <motion.img
              key={spot.id}
              src={spot.img}
              initial={{ opacity: 0, scale: 0.55, rotate: spot.rotate }}
              animate={{ opacity: 1, scale: 1, rotate: spot.rotate }}
              exit={{ opacity: 0 }}
              className="fixed z-[90] w-28 h-28 md:w-40 md:h-40 object-cover border-2 border-white shadow-[0_0_35px_rgba(57,255,20,0.25)] pointer-events-none"
              style={{ left: spot.x, top: spot.y, transform: `translate(-50%, -50%) rotate(${spot.rotate}deg)` }}
            />
          ))}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
            <p className="font-mono text-candy-lime tracking-[0.5em] text-xs uppercase mb-6">DRAG TO REVEAL / KIKUO IMAGE RITUAL</p>
            <h2 className="font-display text-5xl md:text-8xl leading-tight text-white hover-glitch">BLACK ROOM</h2>
            <p className="max-w-2xl mt-8 text-zinc-400 font-handwriting text-2xl md:text-3xl leading-relaxed">
              按住鼠标拖动，黑色底幕会留下歌手影像。像把照片从噪声里一张张拖出来。
            </p>
            <div className="mt-12 flex items-center gap-4 text-candy-pink font-mono text-xs tracking-[0.35em] uppercase">
              <Hand className="w-5 h-5" />
              hold and drag
            </div>
          </div>
        </section>

        {/* Added Page 3: Freeform Dream Index */}
        <section className="min-h-screen bg-zinc-950 text-white relative overflow-hidden border-t-4 border-dashed border-candy-lime">
          <div className="absolute inset-0 opacity-20" style={{ filter: 'url(#crayon)' }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`absolute border-4 ${i % 2 ? 'border-candy-yellow' : 'border-candy-orange'} rounded-full`}
                style={{
                  width: `${120 + i * 60}px`,
                  height: `${120 + i * 60}px`,
                  left: `${8 + i * 14}%`,
                  top: `${10 + (i % 3) * 24}%`
                }}
              />
            ))}
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
            <div className="mb-16">
              <p className="font-mono text-candy-yellow tracking-[0.5em] text-xs uppercase mb-5">FREE PAGE / GROTESQUE FAIRY TALE INDEX</p>
              <h2 className="font-display text-5xl md:text-8xl leading-tight text-white hover-glitch">DREAM INDEX</h2>
              <p className="max-w-3xl mt-8 text-zinc-400 font-handwriting text-2xl md:text-3xl leading-relaxed">
                一个自由发挥的主题索引页，把“暗黑童话、电子狂气、怪诞可爱、宗教仪式感、迷幻音乐档案”拆成五个可凝视的入口。
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {[
                ["暗黑童话", "BLACK FAIRY TALE", "bg-candy-pink", "甜美外壳下藏着不安的回声。", 180],
                ["电子狂气", "ELECTRIC MANIA", "bg-candy-lime", "节拍像坏掉的游乐设施一样旋转。", 260],
                ["怪诞可爱", "CUTE GROTESQUE", "bg-candy-yellow", "糖果色、手写字和危险的笑脸并置。", 340],
                ["宗教仪式感", "RITUAL LIGHT", "bg-cyan-500", "像从黑色教堂里升起的合成器光。", 430],
                ["迷幻档案", "PSYCHE ARCHIVE", "bg-candy-orange", "把歌曲、影像、记忆和噪声封存。", 520]
              ].map(([title, en, color, desc, tone]) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -12, rotate: -2 }}
                  whileTap={{ scale: 0.96, rotate: 1 }}
                  role="button"
                  tabIndex={0}
                  onClick={() => playDreamCardSound(Number(tone))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") playDreamCardSound(Number(tone));
                  }}
                  className="min-h-[360px] bg-black border border-white/10 hover:border-white p-5 flex flex-col justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <div className={`w-12 h-12 ${color} rounded-full mb-8`} />
                    <h3 className="font-handwriting text-3xl text-white leading-tight">{title}</h3>
                    <p className="font-mono text-[10px] tracking-[0.35em] text-zinc-500 mt-3 uppercase">{en}</p>
                  </div>
                  <p className="text-zinc-400 font-mono text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
