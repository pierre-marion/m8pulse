import React, { useRef } from 'react';
import './PlayersPage.css';
import Globe from './Globe';

function PlayersPage() {
  const globeRef = useRef(null);

  return (
    <div className="players-page">
      <Globe ref={globeRef} />
    </div>
  );
}

export default PlayersPage;
