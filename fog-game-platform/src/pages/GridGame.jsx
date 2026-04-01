/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

const GRID_SIZE = 10;

function GridGame() {
  const [grid, setGrid] = useState([]);
  const [lives, setLives] = useState(5);
  const [time, setTime] = useState(30);
  const [pattern, setPattern] = useState(1);
  const [status, setStatus] = useState("playing");
  const [blinkIndex, setBlinkIndex] = useState(null);

  // GENERATE GRID (OPTIMIZED)
  const generateGrid = (patternType = 1) => {
    const newGrid = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => {
      const rand = Math.random();

      if (patternType === 1) {
        if (rand < 0.2) return "blue";
        if (rand < 0.35) return "red";
        return "green";
      } else {
        if (rand < 0.3) return "blue";
        if (rand < 0.6) return "red";
        return "green";
      }
    });

    setGrid(newGrid);
  };

  //  INIT
  useEffect(() => {
    generateGrid(1);
  }, []);

  // ⏱ TIMER (OPTIMIZED)
  useEffect(() => {
    if (status !== "playing") return;

    if (time <= 0) {
      setStatus("lose");
      return;
    }

    const timer = setTimeout(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, status]);

  //  HANDLE CLICK (OPTIMIZED)
  const handleClick = (index) => {
    if (status !== "playing") return;

    const tile = grid[index];

    //  BLUE
    if (tile === "blue") {
      const newGrid = [...grid];
      newGrid[index] = "green";
      setGrid(newGrid);

      // check win after update
      const remainingBlue = newGrid.filter((t) => t === "blue").length;

      if (remainingBlue === 0) {
        if (pattern === 1) {
          setPattern(2);
          setTime(30);
          generateGrid(2);
        } else {
          setStatus("win");
        }
      }
    }

    //  RED
    if (tile === "red") {
      setBlinkIndex(index);
      setTimeout(() => setBlinkIndex(null), 250);

      setLives((prev) => {
        if (prev - 1 <= 0) {
          setStatus("lose");
          return 0;
        }
        return prev - 1;
      });
    }
  };

  // STYLE
  const getStyle = (tile, index) => {
    if (index === blinkIndex) return "bg-white";

    if (tile === "blue") return "bg-blue-500";
    if (tile === "red") return "bg-red-500";
    return "bg-green-500";
  };

  //  RESET
  const resetGame = () => {
    setLives(5);
    setTime(30);
    setPattern(1);
    setStatus("playing");
    generateGrid(1);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center 
                    bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden p-2">

      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl font-bold mt-2">
        🎮 Grid Game
      </h1>

      {/*  STATUS */}
      <div className="flex gap-6 text-sm sm:text-lg mt-2">
        <p>❤️ {lives}</p>
        <p>⏱ {time}s</p>
        <p>🎯 Level {pattern}</p>
      </div>

      {/* LEVEL MESSAGE */}
      {pattern === 2 && status === "playing" && (
        <p className="text-green-400 text-sm mt-1">
          🚀 Level 2 Started!
        </p>
      )}

      {/* GRID */}
      <div className="flex-1 flex items-center justify-center w-full">

        <div
          className="grid gap-1 sm:gap-2 
                     w-[85vmin] h-[85vmin] 
                     max-w-[500px] max-h-[500px]"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {grid.map((tile, index) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`aspect-square rounded cursor-pointer 
                          transition-transform duration-150 
                          active:scale-95 ${getStyle(tile, index)}`}
            />
          ))}
        </div>

      </div>

      {/*  RESULT */}
      {status !== "playing" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
          <h2 className="text-2xl sm:text-3xl mb-4">
            {status === "win" ? "🎉 YOU WIN!" : "❌ YOU LOSE!"}
          </h2>

          <button
            onClick={resetGame}
            className="bg-green-500 px-4 py-2 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default GridGame;