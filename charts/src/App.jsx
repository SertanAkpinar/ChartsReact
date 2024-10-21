import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BundeslaenderMap from './BundeslaenderMap';
import KreiseMap from './KreiseMap';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/bundeslaender" element={<BundeslaenderMap />} />
          <Route path="/kreise/:bundesland" element={<KreiseMap />} />
          <Route path="/" element={<BundeslaenderMap />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;