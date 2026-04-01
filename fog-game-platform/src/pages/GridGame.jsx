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

  //  GRID GENERATOR
  const generateGrid = (patternType = pattern) => {
    let newGrid = [];

    for (let i = 0; i < rows * cols; i++) {
      let rand = Math.random();

      if (patternType === 1) {
        if (rand < 0.2) newGrid.push("blue");
        else if (rand < 0.35) newGrid.push("red");
        else newGrid.push("green");
      } else {
        // Pattern 2 harder 
        if (rand < 0.3) newGrid.push("blue");
        else if (rand < 0.6) newGrid.push("red");
        else newGrid.push("green");
      }
    }

    setGrid(newGrid);
  };

  // INIT
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

  //  CLICK TILE
  const handleClick = (index) => {
    if (status !== "playing") return;

    const tile = grid[index];

    // BLUE → collect
    if (tile === "blue") {
      const newGrid = [...grid];
      newGrid[index] = "green";
      setGrid(newGrid);
    }

    // RED → blink + lose life
    if (tile === "red") {
      setBlinkIndex(index);

      setTimeout(() => {
        setBlinkIndex(null);
      }, 400);

      setLives((prev) => {
        if (prev - 1 <= 0) {
          setStatus("lose");
          return 0;
        }
        return prev - 1;
      });
    }

    // CHECK WIN
    const remainingBlue = grid.filter((t) => t === "blue").length;

    if (remainingBlue === 1) {
      if (pattern === 1) {
        //  AUTO MOVE TO PATTERN 2
        setPattern(2);
        setTime(30);
        generateGrid(2);
      } else {
        setStatus("win");
      }
    }
  };

  //  COLOR
  const getColor = (tile, index) => {
    if (index === blinkIndex) return "bg-white"; // blink effect

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">

      {/*  INPUTS */}
      <div className="flex gap-4 mb-6">
        <input
          type="number"
          min="10"
          value={rows}
          onChange={(e) => setRows(+e.target.value)}
          className="p-2 text-black"
          placeholder="Rows"
        />
        <input
          type="number"
          min="10"
          value={cols}
          onChange={(e) => setCols(+e.target.value)}
          className="p-2 text-black"
          placeholder="Cols"
        />
        <button
          onClick={() => generateGrid()}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Generate
        </button>
      </div>

      {/*  STATUS */}
      <div className="flex gap-10 mb-4 text-lg">
        <p>❤️ Lives: {lives}</p>
        <p>⏱ Time: {time}s</p>
        <p>🎯 Pattern: {pattern}</p>
      </div>

      {/*  GRID */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, 40px)`
        }}
      >
        {grid.map((tile, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`w-10 h-10 cursor-pointer rounded transition-all duration-200 ${getColor(tile, index)}`}
          />
        ))}
      </div>

      {/*  RESULT */}
      {status !== "playing" && (
        <div className="mt-6 text-center">
          <h2 className="text-3xl mb-4">
            {status === "win" ? "🎉 YOU WIN!" : "❌ YOU LOSE!"}
          </h2>

          <button
            onClick={resetGame}
            className="bg-green-500 px-6 py-2 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default GridGame;