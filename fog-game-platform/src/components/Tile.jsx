function Tile({ type, onClick }) {
  const getColor = () => {
    if (type === "blue") return "bg-blue-500";
    if (type === "red") return "bg-red-500";
    return "bg-green-500";
  };

  return (
    <div
      onClick={onClick}
      className={`w-10 h-10 cursor-pointer ${getColor()} rounded`}
    ></div>
  );
}

export default Tile;