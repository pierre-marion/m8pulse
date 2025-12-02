import React from 'react';
import Calendar from './Calendar';
import './RightPanel.css';

function RightPanel() {
  return (
    <div className="right-panel">
      <div className="panel-section profils-section">
        <h2 className="panel-title">PROFILS</h2>
      </div>
      
      <div className="panel-section stats-section">
        <h2 className="panel-title-center">STATS<br/>JOUEUR<br/>PAR<br/>JOUEUR</h2>
      </div>
      
      <div className="panel-section planning-section">
        <h2 className="panel-title">PLANNING</h2>
        <Calendar />
      </div>
    </div>
  );
}

export default RightPanel;
