import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./Landing";
import { LoadSave } from "./LoadSave";
import { PlanetMap } from "./PlanetMap"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/loadsave" element={<LoadSave />} />
        <Route path="/map" element={<PlanetMap />} />
      </Routes>
    </Router>
  );
};

export default App;
