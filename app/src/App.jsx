import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./scenes/login/Login";
import Game from "./scenes/game/Game";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
