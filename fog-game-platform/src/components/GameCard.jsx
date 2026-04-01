function GameCard({ game, onClick }) {
  return (
    <div
      onClick={() => onClick(game)}
      className="cursor-pointer rounded-2xl overflow-hidden border border-white/20 shadow-xl select-none"
    >
      <img
        src={game.image}
        alt={game.title}
        draggable="false"
        className="h-[450px] w-[400px] object-cover"
      />

      <div className="bg-black/70 p-2 text-center">
        <h2 className="text-sm font-semibold">{game.title}</h2>
      </div>
    </div>
  );
}

export default GameCard;