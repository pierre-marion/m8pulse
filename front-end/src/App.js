import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import GamesPage from './components/GamesPage';
import RightPanel from './components/RightPanel';
import TeamPage from './components/TeamPage';
import NewsPage from './components/NewsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('accueil');
  const [currentGame, setCurrentGame] = useState(0); // 0: Valorant, 1: CS, 2: COD, 3: Fortnite

  const games = ['Valorant', 'Counter Strike', 'Call of Duty', 'Fortnite'];

  const renderPage = () => {
    switch(currentPage) {
      case 'accueil':
        return <HomePage />;
      case 'jeux':
        return <GamesPage currentGame={games[currentGame]} />;
      case 'equipe':
        return <TeamPage currentGame={games[currentGame]} onGameChange={setCurrentGame} />;
      case 'news':
        return <NewsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      <div className="app-body">
        <div className="left-section">
          <div className="app-logo">
            <img src="/m8logo.png" alt="M8 Logo" className="app-logo-image" />
          </div>
          <Sidebar currentGame={currentGame} />
        </div>
        <div className="main-section">
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {renderPage()}
        </div>
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
