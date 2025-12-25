import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import GamesPage from './components/GamesPage';
import RightPanel from './components/RightPanel';
import TeamPage from './components/TeamPage';
import NewsPage from './components/NewsPage';
import ArticleDetail from './components/ArticleDetail';
import SubscriptionPage from './components/SubscriptionPage';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import PlayersPage from './components/PlayersPage';
import { DarkModeProvider } from './contexts/DarkModeContext';

function App() {
  const [currentPage, setCurrentPage] = useState('accueil');
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [currentGame, setCurrentGame] = useState(0); // 0: Valorant, 1: CS, 2: COD, 3: Fortnite
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'

  const games = ['Valorant', 'Counter Strike', 'Call of Duty', 'Fortnite'];

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('accueil');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentPage('accueil');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('accueil');
  };

  const renderPage = () => {
    // Pages d'authentification
    if (currentPage === 'login' && !user) {
      return <LoginPage 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setCurrentPage('register')} 
      />;
    }
    
    if (currentPage === 'register' && !user) {
      return <RegisterPage 
        onRegister={handleRegister} 
        onSwitchToLogin={() => setCurrentPage('login')} 
      />;
    }

    if (currentPage === 'profile') {
      if (!user) {
        setCurrentPage('login');
        return null;
      }
      return <ProfilePage user={user} onLogout={handleLogout} />;
    }

    // Pages normales
    switch(currentPage) {
      case 'accueil':
        return <HomePage />;
      case 'jeux':
        return <GamesPage currentGame={games[currentGame]} />;
      case 'equipe':
        return <TeamPage currentGame={games[currentGame]} onGameChange={setCurrentGame} />;
      case 'joueurs':
        return <PlayersPage />;
      case 'news':
        return <NewsPage onArticleClick={(id) => {
          setSelectedArticleId(id);
          setCurrentPage('article');
        }} />;
      case 'article':
        return <ArticleDetail 
          articleId={selectedArticleId} 
          onBack={() => setCurrentPage('news')} 
        />;
      case 'abonnement':
        return <SubscriptionPage />;
      case 'dashboard':
        // Vérifier si l'utilisateur est admin
        if (!user || !user.roles?.includes('ROLE_ADMIN')) {
          setCurrentPage('accueil');
          return <HomePage />;
        }
        return <DashboardPage currentGame={games[currentGame]} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <DarkModeProvider>
      <div className="App">
        <div className="app-body">
          <div className="main-section">
            <Header 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage}
              user={user}
            />
            {renderPage()}
          </div>
          <RightPanel 
            currentGame={games[currentGame]} 
            onDashboardClick={() => setCurrentPage('dashboard')}
            user={user}
            onLogout={handleLogout}
            onLoginClick={() => setCurrentPage('login')}
          />
        </div>
      </div>
    </DarkModeProvider>
  );
}

export default App;
