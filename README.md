<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<div align="center">

# ✨ Kikuo Fanbase

A fantastical and ethereal website celebrating Japanese composer **Kikuo** and his artistic universe.

[View Live Site](#) • [About Kikuo](#) • [Music Collection](#) • [Get Started](#getting-started)

</div>

---

## 🎨 Project Overview

**Kikuo Fanbase** is an immersive web experience dedicated to Kikuo, a renowned Japanese music producer known for his distinctive blend of dreamy, ethereal, and experimental electronic music. The site showcases his albums, music videos, artworks, and creative universe with beautiful animations and interactive elements.

### ✨ Highlights

- 🎵 **Music Player** - Stream and explore Kikuo's compositions
- 🎬 **Music Video Gallery** - Access to official MVs from YouTube
- 🖼️ **Gallery & Artwork** - Visual showcase of album covers and artwork
- ✨ **Smooth Animations** - Elegant scroll effects and transitions
- 📱 **Responsive Design** - Optimized for all devices
- 🎨 **Modern UI** - Built with Tailwind CSS and Framer Motion

---

## 🚀 Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) with TypeScript
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: Express.js
- **Environment**: Node.js

---

## 🎯 Features

### 🎵 Music Experience
- Interactive music player with play/pause controls
- Album collection with thematic descriptions
- Curated track lists with audio playback

### 🎬 Video Gallery  
- Music video links to YouTube
- Chronological MV showcase
- Video metadata (title, year)

### 🖼️ Visual Gallery
- High-quality album artwork display
- Image carousel with smooth scrolling
- Immersive album modal view

### ✨ Animation & Interactivity
- Parallax scroll effects on hero sections
- Smooth page transitions
- Hover effects and interactive panels
- Modal dialogs for detailed content

---

## 📋 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kikuo-fanbase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
kikuo-fanbase/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│
├── public/                  # Static assets
│   ├── *.png               # Album covers and images
│   └── *.mp3               # Audio files
│
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

---

## 🎵 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run clean` | Remove dist folder |
| `npm run lint` | Type check with TypeScript |

---

## 🎨 Customization

### Adding Music
Update the `audios` object in `App.tsx` with your audio file paths:
```typescript
const [audios, setAudios] = useState({
  song1: "/path-to-audio.mp3",
  // ...
});
```

### Adding Albums
Modify the `albums` array with album information:
```typescript
const albums = [
  { 
    theme: "Album Theme",
    title: "Album Title",
    audioUrl: audios.songX,
    desc: "Album description",
    // ... other properties
  },
  // ...
];
```

### Adding Music Videos
Update the `mvList` array with video information:
```typescript
const mvList = [
  { 
    title: "MV Title",
    year: "2024",
    url: "https://youtube.com/...",
    img: "/cover-image.png"
  },
  // ...
];
```

---

## 🌐 Environment Variables

Create a `.env.local` file for environment-specific settings:
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🎭 About Kikuo

Kikuo is a Japanese music producer and artist known for his distinctive ethereal and experimental sound. His music often explores themes of emotion, alienation, and surrealism, creating immersive audio experiences that captivate listeners worldwide.

---

## 📜 License

This project is dedicated to celebrating Kikuo's artistic work. Please respect copyright and intellectual property rights.

---

## 💬 Feedback & Support

For issues, suggestions, or improvements, feel free to open an issue or contribute to the project.

---

<div align="center">

**Made with ✨ for Kikuo fans worldwide**

</div>
