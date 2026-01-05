import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Globe from './components/Globe';
import SidePanel from './components/SidePanel';
import './App.css';

export default function App() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const globeRef = React.useRef(null);

  const handlePlayerClick = (cityName) => {
    if (globeRef.current) {
      globeRef.current.animateToCapital(cityName);
    }
  };

  const handleClose = () => {
    setSelectedPlayer(null);
    if (globeRef.current) {
      globeRef.current.resetCamera();
    }
  };

  return (
    <div className="container">
      <Sidebar />
      
      <div className="main-content">
        <Header />
        
        <div className="content-area">
          <Globe ref={globeRef} onPlayerSelect={setSelectedPlayer} selectedPlayer={selectedPlayer} />
          <SidePanel selectedPlayer={selectedPlayer} onClose={handleClose} onPlayerClick={handlePlayerClick} />
        </div>
      </div>
    </div>
  );
}
