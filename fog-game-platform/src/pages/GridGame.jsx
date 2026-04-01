/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

function GridGame() {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [grid, setGrid] = useState([]);
  const [lives, setLives] = useState(5);
  const [time, setTime] = useState(30);
  const [pattern, setPattern] = useState(1);
  const [status, setStatus] = useState("playing");
  const [blinkIndex, setBlinkIndex] = useState(null);

  // 🎯 GRID GENERATOR
  const generateGrid = (patternType = pattern) => {
    let newGrid = [];

    for (let i = 0; i < rows * cols; i++) {
      let rand = Math.random();

      if (patternType === 1) {
        if (rand < 0.2) newGrid.push("blue");
        else if (rand < 0.35) newGrid.push("red");
        else newGrid.push("green");
      } else {
        if (rand < 0.3) newGrid.push("blue");
        else if (rand < 0.6) newGrid.push("red");
        else newGrid.push("green");
      }
    }

    setGrid(newGrid);
  };

  useEffect(() => {
    generateGrid(1);
  }, []);

  // ⏱ TIMER
  useEffect(() => {
    if (status !== "playing") return;

    if (time === 0) {
      setStatus("lose");
      return;
    }

    const timer = setTimeout(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, status]);

  // 🎮 CLICK TILE
  const handleClick = (index) => {
    if (status !== "playing") return;

    const tile = grid[index];

    if (tile === "blue") {
      const newGrid = [...grid];
      newGrid[index] = "green";
      setGrid(newGrid);
    }

    if (tile === "red") {
      setBlinkIndex(index);
      setTimeout(() => setBlinkIndex(null), 300);

      setLives((prev) => {
        if (prev - 1 <= 0) {
          setStatus("lose");
          return 0;
        }
        return prev - 1;
      });
    }

    const remainingBlue = grid.filter((t) => t === "blue").length;

    if (remainingBlue === 1) {
      if (pattern === 1) {
        setPattern(2);
        setTime(30);
        generateGrid(2);
      } else {
        setStatus("win");
      }
    }
  };

  // 🎨 TILE STYLE
  const getStyle = (tile, index) => {
    if (index === blinkIndex) return "bg-white";

    if (tile === "blue")
      return "bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.8)]";
    if (tile === "red")
      return "bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.8)]";
    return "bg-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.8)]";
  };

  const resetGame = () => {
    setLives(5);
    setTime(30);
    setPattern(1);
    setStatus("playing");
    generateGrid(1);
  };

 return (
  <div className="h-screen w-screen flex items-center justify-center 
                  bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">

    {/* GLASS PANEL */}
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 
                    rounded-2xl shadow-xl 
                    w-full h-full max-h-screen 
                    flex flex-col p-3 sm:p-5">

      {/* TITLE */}
      <h1 className="text-lg sm:text-xl font-bold text-center mb-2">
        🎮 Grid Game
      </h1>

      {/* INPUTS */}
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        <input
          type="number"
          min="5"
          value={rows}
          onChange={(e) => setRows(+e.target.value)}
          className="bg-white/20 p-1 rounded text-white w-14 text-sm"
        />
        <input
          type="number"
          min="5"
          value={cols}
          onChange={(e) => setCols(+e.target.value)}
          className="bg-white/20 p-1 rounded text-white w-14 text-sm"
        />
        <button
          onClick={() => generateGrid()}
          className="bg-blue-500 px-2 py-1 rounded text-sm"
        >
          Generate
        </button>
      </div>

      {/* STATUS */}
      <div className="flex justify-between px-2 text-xs sm:text-sm mb-2">
        <p>❤️ {lives}</p>
        <p>⏱ {time}s</p>
        <p>🎯 {pattern}</p>
      </div>

      {/* GRID (AUTO FIT HEIGHT 🔥) */}
     {/* GRID */}
<div className="flex-1 flex items-center justify-center">

  <div
    className="grid gap-1 sm:gap-2 
               w-[85vmin] h-[85vmin] 
               max-w-[500px] max-h-[500px]"
    style={{
      gridTemplateColumns: `repeat(${cols}, 1fr)`
    }}
  >
    {grid.map((tile, index) => (
      <div
        key={index}
        onClick={() => handleClick(index)}
        className={`aspect-square rounded cursor-pointer 
                    transition-all duration-150 
                    hover:scale-105 ${getStyle(tile, index)}`}
      />
    ))}
  </div>

</div>

      {/* RESULT */}
      {status !== "playing" && (
        <div className="text-center mt-2">
          <h2 className="text-lg sm:text-xl mb-2">
            {status === "win" ? "🎉 WIN" : "❌ LOSE"}
          </h2>

          <button
            onClick={resetGame}
            className="bg-green-500 px-3 py-1 rounded text-sm"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  </div>
);

}

export default GridGame;