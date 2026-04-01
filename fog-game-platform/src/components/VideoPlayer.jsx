import { useNavigate } from "react-router-dom";

function VideoPlayer({ game, onBack }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center text-white z-50">

      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="absolute top-5 left-5 px-4 py-2 bg-white/20 rounded"
      >
        ⬅ Back
      </button>

      {/* 🔥 CENTER BOX */}
      <div className="w-[900px] max-w-[90%] bg-black rounded-xl shadow-2xl p-4 flex flex-col items-center">

        {/* TITLE */}
        <h2 className="mb-4 text-xl font-bold">{game.title}</h2>

        {/* VIDEO FIXED */}
        <video
          src={game.video}
          autoPlay
          controls
          className="w-full h-[450px] object-cover rounded-lg"
        />

        {/* START BUTTON */}
        <button
          onClick={() => navigate("/game")}
          className="mt-6 px-6 py-3 bg-blue-500 rounded-xl"
        >
          Start Game
        </button>

      </div>

    </div>
  );
}

export default VideoPlayer;