import { useState, useRef } from "react";
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

function Home() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);

  const startX = useRef(0);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);

  const navigate = useNavigate();

  const next = () => {
    setIndex((prev) => (prev + 1) % games.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? games.length - 1 : prev - 1
    );
  };

  // 🖱 START
  const handleMouseDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
  };

  // 🖱 MOVE
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const diff = e.clientX - startX.current;

    if (Math.abs(diff) > 5) {
      hasDragged.current = true;
    }

    setDragX(diff);
  };

  // 🖱 END
  const handleMouseUp = () => {
    if (!isDragging.current) return;

    if (hasDragged.current) {
      if (dragX > 300) next();
      else if (dragX < -300) prev();
    }

    setDragX(0);
    isDragging.current = false;
    hasDragged.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    setDragX(0);
    hasDragged.current = false;
  };

  // 📱 TOUCH
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    hasDragged.current = false;
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - startX.current;

    if (Math.abs(diff) > 5) {
      hasDragged.current = true;
    }

    setDragX(diff);
  };

  const handleTouchEnd = () => {
    if (hasDragged.current) {
      if (dragX > 300) next();
      else if (dragX < -300) prev();
    }

    setDragX(0);
    hasDragged.current = false;
  };

  // 🎬 VIDEO SCREEN
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
      className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
        style={{ backgroundImage: `url(${games[index].image})` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center">

        {/* DRAG CARDS */}
        <div
          className="flex items-center gap-6 transition-transform duration-200"
          style={{ transform: `translateX(${dragX * 0.50}px)` }}
        >

          {/* LEFT */}
          <div className="scale-75 opacity-40">
            <GameCard
              game={games[(index - 1 + games.length) % games.length]}
              onClick={(game) => {
                if (!hasDragged.current) setSelectedGame(game);
              }}
            />
          </div>

          {/* CENTER */}
          <div className="scale-100">
            <GameCard
              game={games[index]}
              onClick={(game) => {
                if (!hasDragged.current) setSelectedGame(game);
              }}
            />
          </div>

          {/* RIGHT */}
          <div className="scale-75 opacity-40">
            <GameCard
              game={games[(index + 1) % games.length]}
              onClick={(game) => {
                if (!hasDragged.current) setSelectedGame(game);
              }}
            />
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex justify-between w-[300px] mt-6">
          <button
            onClick={next}
            className="bg-white/20 w-12 h-12 rounded-full"
          >
            ⬅
          </button>

          <button
            onClick={prev}
            className="bg-white/20 w-12 h-12 rounded-full"
          >
            ➡
          </button>
        </div>

        {/* START */}
        <button className="mt-6 px-10 py-3 bg-blue-500 rounded-xl"
          onClick={() => navigate("/game")}
        >

          START GAME
        </button>

      </div>
    </div>
  );
}

export default Home;