import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./scenes/login/Login";
import Game from "./scenes/game/Game";
import Home from "./scenes/home/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
