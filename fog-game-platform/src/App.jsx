import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GridGame from "./pages/GridGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GridGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;