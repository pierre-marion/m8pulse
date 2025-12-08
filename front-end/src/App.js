import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import GamesPage from './components/GamesPage';
import RightPanel from './components/RightPanel';
import TeamPage from './components/TeamPage';
import NewsPage from './components/NewsPage';
import SubscriptionPage from './components/SubscriptionPage';
import { DarkModeProvider } from './contexts/DarkModeContext';

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
      case 'abonnement':
        return <SubscriptionPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <DarkModeProvider>
      <div className="App">
        <div className="app-body">
          <div className="main-section">
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {renderPage()}
          </div>
          <RightPanel currentGame={games[currentGame]} />
        </div>
      </div>
    </DarkModeProvider>
  );
}

export default App;
