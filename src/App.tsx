import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Settings2, X, Play, Pause, Eye, Hand, Moon, Skull, CircleDashed, TriangleAlert } from "lucide-react";

export default function App() {
  // 1. Image State Control Let user modify images dynamically
  const [images, setImages] = useState({
    avatar: "/kikuoworld1.jpg",
    vinylCover1: "/kikuo1.jpg",
    vinylCover2: "/kikuo2.jpg",
    gallery1: "/kikuoworld1.jpg",
    gallery2: "/kikuoworld3.jpg",
    gallery3: "/kikuo3.jpg",
    album1: "/kikuo1.jpg",
    album2: "/kikuo2.jpg",
    album3: "/kikuo3.jpg",
    album4: "/kikuo4.jpg",
    album5: "/kikuo5.jpg",
    album6: "/kikuo6.jpg",
    album7: "/kikuo7.jpg",
    album8: "/kikuo1.jpg",
    album9: "/kikuo2.jpg",
  });

  const [audios, setAudios] = useState({
    song1: "/kikuo-chansheng.mp3",
    song2: "/wobuzaixuexiaoderizi.mp3",
    song3: "/haohaizihehuxian.mp3",
    song4: "/kikuo-chansheng.mp3",
    song5: "/wobuzaixuexiaoderizi.mp3",
    song6: "/haohaizihehuxian.mp3",
  });

  const [editImages, setEditImages] = useState(images);
  const [editAudios, setEditAudios] = useState(audios);
  const [showPanel, setShowPanel] = useState(false);
  const [activeSongIdx, setActiveSongIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    { theme: "宗教仪式感", title: "産声", enTheme: "Ritualistic Sacredness", audioUrl: audios.song3, coverKey: "vinylCover2", accent: "text-cyan-400", border: "border-cyan-400", desc: "庄严神秘的氛围，生命伊始的空灵与迷惘", lyrics: "最初的一声 最初的一声\n宣告着降临于世的瞬间\n在这神圣的仪式之中\n接受着所有人的注目\n却又如此的 如此的迷惘" },
    { theme: "甜蜜的腐烂", title: "あなぐらぐらし", enTheme: "Saccharine Decay", audioUrl: audios.song4, coverKey: "vinylCover1", accent: "text-candy-yellow", border: "border-candy-yellow", desc: "表面甜蜜与内部崩塌，洞穴里的孤独狂欢", lyrics: "在这个小小的洞穴里\n只有我一个人在跳舞\n虽然很狭窄 虽然很阴暗\n但是这里 却是最安全的避风港" },
  ];

  const [activeGlobalTrack, setActiveGlobalTrack] = useState<{ title: string, audioUrl: string } | null>(null);
  const [selectedAlbumModal, setSelectedAlbumModal] = useState<number | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      const targetUrl = activeGlobalTrack ? activeGlobalTrack.audioUrl : albums[activeSongIdx].audioUrl;
      // Only change src if it's different to avoid reloading audio
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
  }, [activeSongIdx, activeGlobalTrack, isPlaying]);

  const handleTrackClick = (idx: number) => {
    if (activeSongIdx === idx && !activeGlobalTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveGlobalTrack(null);
      setActiveSongIdx(idx);
      setIsPlaying(true);
    }
  };

  const [immersiveAlbumId, setImmersiveAlbumId] = useState<number | null>(null);

  const handleGlobalTrackClick = (track: {title: string, audioUrl: string}, albumId?: number) => {
    if (activeGlobalTrack?.title === track.title) {
      setIsPlaying(!isPlaying);
      if (albumId && immersiveAlbumId !== albumId) {
        setImmersiveAlbumId(albumId);
        setSelectedAlbumModal(null);
      }
    } else {
      setActiveGlobalTrack(track);
      setIsPlaying(true);
      if (albumId) {
        setImmersiveAlbumId(albumId);
        setSelectedAlbumModal(null);
      }
    }
  };

  // Random floating shapes with creepy icons and dopamine/dark colors
  const bgElements = useMemo(() => Array.from({ length: 30 }).map((_, i) => {
    const size = Math.random() * 60 + 20;
    const type = Math.floor(Math.random() * 4); // 0: circle, 1: rect, 2: triangle, 3: squiggly line
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

  const allAlbums = [
    { id: 1, title: "Kikuo Miku", color: "bg-candy-pink", textColor: "text-candy-pink", imgKey: "album1", year: "2011", desc: "初代疯狂，怪诞童话开端", tracks: [
      { title: "僕をそんな目で見ないで", audioUrl: audios.song1 },
      { title: "暗叫", audioUrl: audios.song1 },
      { title: "ぽっかんカラー", audioUrl: audios.song2 }
    ] },
    { id: 2, title: "Kikuo Miku 2", color: "bg-candy-lime", textColor: "text-candy-lime", imgKey: "album2", year: "2012", desc: "儿童游乐园的崩溃边缘", tracks: [
      { title: "塵塵呪詛", audioUrl: audios.song2 },
      { title: "ごめんね ごめんね", audioUrl: audios.song3 }
    ] },
    { id: 3, title: "Kikuo Miku 3", color: "bg-candy-yellow", textColor: "text-candy-yellow", imgKey: "album3", year: "2013", desc: "深渊底部的星光与呼唤", tracks: [
      { title: "産声", audioUrl: audios.song3 },
      { title: "君はできない子", audioUrl: audios.song4 }
    ] },
    { id: 4, title: "Kikuo Miku 4", color: "bg-candy-orange", textColor: "text-candy-orange", imgKey: "album4", year: "2014", desc: "狂气爆发，无法停止的舞步", tracks: [
      { title: "あなぐらぐらし", audioUrl: audios.song4 },
      { title: "UFO", audioUrl: audios.song5 }
    ] },
    { id: 5, title: "Kikuo Miku 5", color: "bg-cyan-500", textColor: "text-cyan-500", imgKey: "album5", year: "2015", desc: "宗教迷幻的神圣殿堂", tracks: [
      { title: "O Light", audioUrl: audios.song5 },
      { title: "愛して愛して愛して", audioUrl: audios.song6 }
    ] },
    { id: 6, title: "Kikuo Miku 6", color: "bg-candy-pink", textColor: "text-candy-pink", imgKey: "album6", year: "2019", desc: "漫长等待后的沉重回归", tracks: [
      { title: "カラカラカラのカラ", audioUrl: audios.song6 },
      { title: "暗叫", audioUrl: audios.song1 }
    ] },
    { id: 7, title: "Kikuo Miku 7", color: "bg-candy-lime", textColor: "text-candy-lime", imgKey: "album7", year: "2023", desc: "宇宙级别的孤独与绚烂", tracks: [
      { title: "星くずの掃除婦", audioUrl: audios.song2 },
      { title: "産声", audioUrl: audios.song3 }
    ] },
    { id: 8, title: "KikuoHana", color: "bg-candy-yellow", textColor: "text-candy-yellow", imgKey: "album8", year: "2016", desc: "双曲共振，迷幻的剧场", tracks: [
      { title: "のぼれ！すすめ！高い塔", audioUrl: audios.song4 }
    ] },
    { id: 9, title: "KikuoHana 2", color: "bg-candy-orange", textColor: "text-candy-orange", imgKey: "album9", year: "2017", desc: "第二幕的诡异仪式", tracks: [
      { title: "光よ", audioUrl: audios.song5 }
    ] },
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

      {/* Control Panel Toggle Button */}
      <button 
        onClick={() => setShowPanel(true)} 
        className="fixed top-24 right-6 z-50 bg-candy-pink text-black p-3 rounded-full shadow-[0_0_15px_#FF007F] border-2 border-candy-pink hover:bg-black hover:text-candy-pink hover:scale-[1.1] btn-hover-swap"
        title="Settings"
      >
        <Settings2 className="w-6 h-6" />
      </button>

      {/* Control Panel Sidebar */}
      <AnimatePresence>
        {showPanel && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowPanel(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 border-l border-zinc-800 p-6 z-50 overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-candy-lime font-handwriting tracking-wider">🌟 媒体控制台</h3>
                <button onClick={() => setShowPanel(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <div className="border-b border-zinc-800 pb-2 mb-2">
                  <h4 className="text-sm font-bold text-candy-pink tracking-widest uppercase">🖼️ 图像设置</h4>
                </div>
                {[
                  { key: 'avatar', label: '歌手头像' },
                  { key: 'vinylCover1', label: '代表专辑封面 1' },
                  { key: 'vinylCover2', label: '代表专辑封面 2' },
                  { key: 'gallery1', label: '画廊图片 1 (大图)' },
                  { key: 'gallery2', label: '画廊图片 2' },
                  { key: 'gallery3', label: '画廊图片 3' },
                  { key: 'album1', label: '专辑 1 封面' },
                  { key: 'album2', label: '专辑 2 封面' },
                  { key: 'album3', label: '专辑 3 封面' },
                  { key: 'album4', label: '专辑 4 封面' },
                  { key: 'album5', label: '专辑 5 封面' },
                  { key: 'album6', label: '专辑 6 封面' },
                  { key: 'album7', label: '专辑 7 封面' },
                  { key: 'album8', label: '专辑 8 封面' },
                  { key: 'album9', label: '专辑 9 封面' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-widest">{label}</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-candy-pink focus:ring-1 focus:ring-candy-pink transition-all"
                      value={editImages[key as keyof typeof editImages]} 
                      onChange={(e) => setEditImages({...editImages, [key]: e.target.value})} 
                    />
                  </div>
                ))}
                
                <div className="border-b border-zinc-800 pb-2 mb-2 mt-4">
                  <h4 className="text-sm font-bold text-candy-yellow tracking-widest uppercase">🎵 音乐流链接设置 (MP3)</h4>
                </div>
                {[
                  { key: 'song1', label: '《暗叫》MP3链接' },
                  { key: 'song2', label: '《塵塵呪詛》MP3链接' },
                  { key: 'song3', label: '《産声》MP3链接' },
                  { key: 'song4', label: '《あなぐらぐらし》MP3链接' },
                  { key: 'song5', label: '《イイコと妖狐》MP3链接' },
                  { key: 'song6', label: '《愛して愛して愛して》MP3链接' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-widest">{label}</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-candy-yellow focus:ring-1 focus:ring-candy-yellow transition-all"
                      value={editAudios[key as keyof typeof editAudios]} 
                      onChange={(e) => setEditAudios({...editAudios, [key]: e.target.value})} 
                    />
                  </div>
                ))}

                <button 
                  onClick={() => {
                    setImages(editImages);
                    setAudios(editAudios);
                    setShowPanel(false);
                  }} 
                  className="mt-6 w-full bg-candy-pink text-black border-2 border-candy-pink hover:bg-black hover:text-candy-pink font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,0,127,0.3)] hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] font-handwriting text-lg btn-hover-swap"
                >
                  应用修改！
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
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
                  <div className={`aspect-square rounded-none overflow-hidden relative z-10 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-4`}>
                    <img 
                      src={images[album.imgKey as keyof typeof images]} 
                      alt={album.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] p-8 flex flex-col justify-end">
                      <div>
                        <p className={`text-3xl font-handwriting font-light text-white tracking-widest mb-3`}>{album.title}</p>
                        <p className="text-[10px] font-mono text-zinc-400 tracking-[0.2em] uppercase mb-4">RELEASED {album.year}</p>
                        <p className="text-sm font-sans text-zinc-300 italic">{album.desc}</p>
                      </div>
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

              <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center p-8 md:p-12 gap-12">
                {/* Left Side: Tracklist (shrunk to left) */}
                <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  className="w-full md:w-1/3 max-w-sm h-full max-h-[80vh] overflow-y-auto space-y-4 pr-4 border-r border-white/20 custom-scrollbar"
                >
                  <div className="mb-8 sticky top-0 bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <h2 className="text-3xl font-handwriting font-bold tracking-widest text-candy-lime drop-shadow-[2px_2px_0_#000]">
                      {allAlbums.find(a => a.id === immersiveAlbumId)?.title}
                    </h2>
                    <p className="text-white/60 font-mono mt-2 text-sm">{allAlbums.find(a => a.id === immersiveAlbumId)?.desc}</p>
                  </div>
                  
                  <div className="space-y-2 pb-12">
                    {allAlbums.find(a => a.id === immersiveAlbumId)?.tracks?.map((track, idx) => {
                      const isGlobalActive = activeGlobalTrack?.title === track.title;
                      return (
                        <div 
                          key={idx} 
                          className={`group flex items-center justify-between p-3 border transition-all cursor-crosshair rounded-lg backdrop-blur-sm
                            ${isGlobalActive 
                              ? 'bg-candy-yellow/20 border-candy-yellow shadow-[0_0_15px_rgba(255,230,0,0.3)]' 
                              : 'border-transparent hover:bg-white/10 hover:border-white/20'}`
                          }
                          onClick={() => handleGlobalTrackClick(track, immersiveAlbumId)}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-sm ${isGlobalActive ? 'text-candy-yellow' : 'text-white/30 group-hover:text-white/80'}`}>
                              {(idx + 1).toString().padStart(2, '0')}
                            </span>
                            <span className={`text-sm md:text-base font-bold font-handwriting tracking-wider ${isGlobalActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>
                              {track.title}
                            </span>
                          </div>
                          {isGlobalActive && isPlaying && <div className="w-2 h-2 rounded-full bg-candy-yellow animate-pulse shadow-[0_0_5px_#FFE600]" />}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Right/Center Side: Player Area */}
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-full md:w-2/3 flex flex-col items-center justify-center -mt-10"
                >
                  {/* Large Spinning Cover */}
                  <motion.div
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={isPlaying ? { duration: 15, repeat: Infinity, ease: "linear" } : { duration: 0 }}
                    className={`w-64 h-64 md:w-[28rem] md:h-[28rem] rounded-full border-[12px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative
                      ${allAlbums.find(a => a.id === immersiveAlbumId)?.color.replace('bg-', 'border-')}
                    `}
                  >
                     <div className="absolute inset-0 border-[20px] border-black/80 rounded-full z-10 pointer-events-none" />
                     <div className="absolute inset-[35%] bg-black rounded-full z-20 flex items-center justify-center shadow-inner border border-zinc-800">
                        <div className="w-4 h-4 bg-zinc-900 rounded-full border border-zinc-700" />
                     </div>
                     <img 
                       src={images[allAlbums.find(a => a.id === immersiveAlbumId)?.imgKey as keyof typeof images]} 
                       alt="Album Art" 
                       className="w-full h-full object-cover"
                     />
                  </motion.div>

                  {/* Current track info */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center max-w-2xl bg-black/30 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl"
                  >
                     <h3 className="text-4xl md:text-5xl font-handwriting font-bold tracking-widest text-white drop-shadow-[2px_2px_0_#FF007F]">
                       {activeGlobalTrack?.title}
                     </h3>
                     <div className="flex items-center justify-center gap-8 mt-10">
                       <button onClick={() => {
                         const tracks = allAlbums.find(a => a.id === immersiveAlbumId)?.tracks;
                         if (tracks) {
                           const currIdx = tracks.findIndex(t => t.title === activeGlobalTrack?.title);
                           if (currIdx > 0) handleGlobalTrackClick(tracks[currIdx - 1], immersiveAlbumId);
                         }
                       }} className="text-white/40 hover:text-white hover:scale-110 transition-all">
                         <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                       </button>

                       <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]"
                       >
                         {isPlaying ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 ml-2" />}
                       </button>

                       <button onClick={() => {
                         const tracks = allAlbums.find(a => a.id === immersiveAlbumId)?.tracks;
                         if (tracks) {
                           const currIdx = tracks.findIndex(t => t.title === activeGlobalTrack?.title);
                           if (currIdx < tracks.length - 1) handleGlobalTrackClick(tracks[currIdx + 1], immersiveAlbumId);
                         }
                       }} className="text-white/40 hover:text-white hover:scale-110 transition-all">
                         <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                       </button>
                     </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Album Modal */}
        <AnimatePresence>
          {selectedAlbumModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedAlbumModal(null)}
            >
              <div 
                className="bg-black border-4 border-white shadow-[12px_12px_0_#FF007F] w-full max-w-2xl overflow-hidden relative"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b-4 border-white bg-candy-pink">
                  <h3 className="text-2xl font-bold font-handwriting tracking-widest text-black">
                    {allAlbums.find(a => a.id === selectedAlbumModal)?.title || 'Tracks'}
                  </h3>
                  <button onClick={() => setSelectedAlbumModal(null)} className="text-black hover:text-white transition-colors">
                    <X className="w-8 h-8" />
                  </button>
                </div>
                
                <div className="p-6 md:p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                  {allAlbums.find(a => a.id === selectedAlbumModal)?.tracks?.map((track, idx) => {
                    const isGlobalActive = activeGlobalTrack?.title === track.title;
                    return (
                      <div 
                        key={idx} 
                        className={`group flex items-center justify-between p-4 border-2 transition-all cursor-crosshair
                          ${isGlobalActive 
                            ? 'border-candy-yellow bg-candy-yellow/20 shadow-[4px_4px_0_#FFE600]' 
                            : 'border-zinc-700 bg-zinc-900/50 hover:border-candy-lime hover:bg-candy-lime/10 hover:shadow-[4px_4px_0_#FFE600]'}`
                        }
                        onClick={() => handleGlobalTrackClick(track, selectedAlbumModal!)}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`font-mono text-xl font-bold ${isGlobalActive ? 'text-candy-yellow' : 'text-zinc-500 group-hover:text-candy-lime'}`}>
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <span className={`text-lg font-bold font-handwriting tracking-widest ${isGlobalActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                            {track.title}
                          </span>
                        </div>
                        <div className={`w-10 h-10 border-2 flex items-center justify-center rounded-full transition-all
                          ${isGlobalActive && isPlaying 
                            ? 'border-candy-yellow bg-candy-yellow text-black' 
                            : 'border-zinc-600 bg-transparent text-zinc-400 group-hover:border-candy-lime group-hover:text-candy-lime'}`}>
                          {isGlobalActive && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
      </div>
    </div>
  );
}

