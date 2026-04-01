import { useState, useRef, useEffect, memo } from "react";
import GameCard from "../components/GameCard";
import VideoPlayer from "../components/VideoPlayer";
import { useNavigate } from "react-router-dom";

// images
import lava from "../assets/images/escape_the_lava.jpg";
import color from "../assets/images/find_the_color.jpg";
import redGreen from "../assets/images/red_light_green_light.jpg";
import shooter from "../assets/images/shooter.jpg";

// videos
import video1 from "../assets/videos/game_selection_ui.mp4";
import video2 from "../assets/videos/que_01_pattern_01.mp4";
import video3 from "../assets/videos/que_01_pattern_02.mp4";

const games = [
  { id: 1, title: "Escape The Lava", image: lava, video: video1 },
  { id: 2, title: "Find The Color", image: color, video: video2 },
  { id: 3, title: "Red Light Green Light", image: redGreen, video: video3 },
  { id: 4, title: "Shooter", image: shooter, video: video1 },
];

// 🔥 prevent unnecessary re-renders
const MemoGameCard = memo(GameCard);

function Home() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const dragRef = useRef(0);
  const frame = useRef(null);
  const containerRef = useRef(null);

  const startX = useRef(0);
  const isDragging = useRef(false);

  const navigate = useNavigate();

  //  responsive detect
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const threshold = isMobile ? 70 : 180;

  const next = () => {
    setIndex((prev) => (prev + 1) % games.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? games.length - 1 : prev - 1
    );
  };

  //  ULTRA SMOOTH TRANSFORM
  const updatePosition = (value) => {
    if (!containerRef.current) return;

    containerRef.current.style.transform =
      `translate3d(${value * 0.4}px, 0, 0)`;
  };

  const animate = () => {
    updatePosition(dragRef.current);
    frame.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  //  START
  const start = (x) => {
    isDragging.current = true;
    startX.current = x;
  };

  // MOVE
  const move = (x) => {
    if (!isDragging.current) return;
    dragRef.current = x - startX.current;
  };

  // END
  const end = () => {
    if (!isDragging.current) return;

    if (dragRef.current > threshold) prev();
    else if (dragRef.current < -threshold) next();

    dragRef.current = 0;
    isDragging.current = false;
  };

  //  VIDEO
  if (selectedGame) {
    return (
      <VideoPlayer
        game={selectedGame}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden select-none"
      onMouseDown={(e) => start(e.clientX)}
      onMouseMove={(e) => move(e.clientX)}
      onMouseUp={end}
      onMouseLeave={end}
      onTouchStart={(e) => start(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchEnd={end}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 will-change-transform"
        style={{ backgroundImage: `url(${games[index].image})` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center w-full px-4">

        {/*  SUPER SMOOTH CAROUSEL */}
        <div
          ref={containerRef}
          className="flex items-center justify-center gap-4 md:gap-6 will-change-transform"
        >

          {/* LEFT */}
          <div className="scale-75 opacity-40 hidden sm:block">
            <MemoGameCard
              game={games[(index - 1 + games.length) % games.length]}
              onClick={(g) => setSelectedGame(g)}
            />
          </div>

          {/* CENTER */}
          <div className="scale-100 w-[220px] sm:w-[260px] md:w-[300px]">
            <MemoGameCard
              game={games[index]}
              onClick={(g) => setSelectedGame(g)}
            />
          </div>

          {/* RIGHT */}
          <div className="scale-75 opacity-40 hidden sm:block">
            <MemoGameCard
              game={games[(index + 1) % games.length]}
              onClick={(g) => setSelectedGame(g)}
            />
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex justify-between w-full max-w-[250px] mt-6">
          <button
            onClick={next}
            className="bg-white/20 w-10 h-10 sm:w-12 sm:h-12 rounded-full"
          >
            ⬅
          </button>

          <button
            onClick={prev}
            className="bg-white/20 w-10 h-10 sm:w-12 sm:h-12 rounded-full"
          >
            ➡
          </button>
        </div>

        {/* START */}
        <button
          className="mt-6 px-6 sm:px-10 py-3 bg-blue-500 rounded-xl text-sm sm:text-lg"
          onClick={() => navigate("/game")}
        >
          START GAME
        </button>

      </div>
    </div>
  );
}

export default Home;