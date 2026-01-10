import React, { useState, useEffect, lazy, Suspense } from 'react';
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
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { applyDesignSettings } from './utils/applyDesignSettings';

// Lazy loading pour les composants lourds (admin, editor...)
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const BlogEditorBlocks = lazy(() => import('./components/BlogEditorBlocks'));
const DatasetManager = lazy(() => import('./components/DatasetManager'));
const ThemeDesigner = lazy(() => import('./components/ThemeDesigner'));
const DesignPanel = lazy(() => import('./components/DesignPanel'));

function App() {
  const [currentPage, setCurrentPage] = useState('accueil');
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [currentGame, setCurrentGame] = useState(0); // 0: Valorant, 1: CS, 2: COD, 3: Fortnite
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'
  const [selectedCity, setSelectedCity] = useState(null);
  const [showDesignPanel, setShowDesignPanel] = useState(false);

  const games = ['Valorant', 'Counter Strike', 'Call of Duty', 'Fortnite'];

  // Gérer navigation par hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) setCurrentPage(hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

    // Appliquer les paramètres de design sauvegardés
    applyDesignSettings();
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
        // Utiliser Suspense pour la page Joueurs qui contient le Globe 3D lourd
        return (
          <Suspense fallback={<div className="loading-lazy">Chargement de la carte 3D...</div>}>
            <PlayersPage 
              user={user}
              onLogout={handleLogout}
              onLoginClick={() => setCurrentPage('login')}
              onDashboardClick={() => setCurrentPage('dashboard')}
              onDesignClick={() => setShowDesignPanel(true)}
              onCitySelect={setSelectedCity}
              onPlayerSelectFromPanel={setSelectedCity}
            />
          </Suspense>
        );
      case 'news':
        return <NewsPage 
          onArticleClick={(id) => {
            setSelectedArticleId(id);
            setCurrentPage('article');
          }}
          user={user}
          onNavigate={setCurrentPage}
        />;
      case 'article':
        return <ArticleDetail 
          articleId={selectedArticleId}
          user={user}
          onBack={() => setCurrentPage('news')}
          onEdit={(id) => {
            setSelectedArticleId(id);
            setCurrentPage('edit-article');
          }}
        />;
      case 'abonnement':
        return <SubscriptionPage />;
      case 'dashboard':
      case 'admin':
        if (!user || (!user.roles?.includes('ROLE_ADMIN') && 
                      !user.roles?.includes('ROLE_EDITOR') && 
                      !user.roles?.includes('ROLE_AUTHOR') && 
                      !user.roles?.includes('ROLE_DESIGNER') && 
                      !user.roles?.includes('ROLE_DATA_PROVIDER'))) {
          setCurrentPage('accueil');
          return <HomePage />;
        }
        return (
          <Suspense fallback={<div className="loading-lazy">Chargement...</div>}>
            <AdminDashboard user={user} onBack={() => setCurrentPage('accueil')} />
          </Suspense>
        );
      case 'blog-editor':
        if (!user || (!user.roles?.includes('ROLE_ADMIN') && !user.roles?.includes('ROLE_EDITOR'))) {
          setCurrentPage('accueil');
          return <HomePage />;
        }
        return (
          <Suspense fallback={<div className="loading-lazy">Chargement de l'éditeur...</div>}>
            <BlogEditorBlocks user={user} onBack={() => setCurrentPage('news')} />
          </Suspense>
        );
      case 'datasets':
        if (!user || !user.roles?.includes('ROLE_DATA_PROVIDER')) {
          setCurrentPage('accueil');
          return <HomePage />;
        }
        return (
          <Suspense fallback={<div className="loading-lazy">Chargement...</div>}>
            <DatasetManager />
          </Suspense>
        );
      case 'theme-designer':
        if (!user || !user.roles?.includes('ROLE_DESIGNER')) {
          setCurrentPage('accueil');
          return <HomePage />;
        }
        return (
          <Suspense fallback={<div className="loading-lazy">Chargement du designer...</div>}>
            <ThemeDesigner />
          </Suspense>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider>
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
            {/* Cacher le RightPanel sur la page Joueurs pour laisser le Globe en plein écran */}
            {currentPage !== 'joueurs' && (
              <RightPanel 
                currentGame={games[currentGame]} 
                onDashboardClick={() => setCurrentPage('dashboard')}
                onDesignClick={() => setShowDesignPanel(true)}
                user={user}
                onLogout={handleLogout}
                onLoginClick={() => setCurrentPage('login')}
                currentPage={currentPage}
                selectedCity={selectedCity}
                onPlayerClick={currentPage === 'joueurs' ? setSelectedCity : null}
              />
            )}
          </div>
        </div>

        {/* Popup Design pour les designers */}
        {showDesignPanel && (
          <Suspense fallback={null}>
            <DesignPanel onClose={() => setShowDesignPanel(false)} />
          </Suspense>
        )}
      </DarkModeProvider>
    </ThemeProvider>
  );
}

export default App;
