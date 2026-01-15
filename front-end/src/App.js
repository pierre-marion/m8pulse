import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
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
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import ProfilePage from './components/ProfilePage';
import PlayersPage from './components/PlayersPage';
import ArticleManager from './components/ArticleManager';
import Datasets from './components/Datasets';
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const globeRef = useRef(null); // Ref partagée pour contrôler le Globe depuis n'importe où

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

  // Fonction pour zoomer vers une ville depuis la RightPanel
  const handlePlayerClickFromPanel = (cityName) => {
    setSelectedCity(cityName);
    if (globeRef.current && globeRef.current.zoomToCity) {
      globeRef.current.zoomToCity(cityName);
    }
  };

  const renderPage = () => {
    if (currentPage === 'profile') {
      if (!user) {
        setShowLoginModal(true);
        setCurrentPage('accueil');
        return null;
      }
      return <ProfilePage user={user} onLogout={handleLogout} />;
    }

    // Pages normales
    switch(currentPage) {
      case 'accueil':
        return <HomePage user={user} />;
      case 'jeux':
        return <GamesPage currentGame={games[currentGame]} />;
      case 'equipe':
        return <TeamPage currentGame={games[currentGame]} onGameChange={setCurrentGame} user={user} />;
      case 'joueurs':
        // Utiliser Suspense pour la page Joueurs qui contient le Globe 3D lourd
        return (
          <Suspense fallback={<div className="loading-lazy">Chargement de la carte 3D...</div>}>
            <PlayersPage 
              ref={globeRef}
              user={user}
              onLogout={handleLogout}
              onLoginClick={() => setCurrentPage('login')}
              onDashboardClick={() => setCurrentPage('dashboard')}
              onDesignClick={() => setShowDesignPanel(true)}
              onCitySelect={setSelectedCity}
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
        return <ArticleManager user={user} />;
      case 'datasets':
        if (!user || (!user.roles?.includes('ROLE_PROVIDER') && !user.roles?.includes('ROLE_ADMIN'))) {
          setCurrentPage('accueil');
          return <HomePage />;
        }
        return <Datasets user={user} />;
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
                onLogout={handleLogout}
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
              />
              {renderPage()}
            </div>
            <RightPanel 
              currentGame={games[currentGame]} 
              onDashboardClick={() => setCurrentPage('dashboard')}
              onDesignClick={() => setShowDesignPanel(true)}
              onDatasetsClick={() => setCurrentPage('datasets')}
              user={user}
              onLogout={handleLogout}
              onLoginClick={() => setShowLoginModal(true)}
              currentPage={currentPage}
              selectedCity={selectedCity}
              onPlayerClick={currentPage === 'joueurs' ? handlePlayerClickFromPanel : null}
            />
          </div>
        </div>

        {/* Modale de connexion */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
            onSwitchToRegister={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
          />
        )}

        {/* Modale d'inscription */}
        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            onRegister={handleRegister}
            onSwitchToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />
        )}

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
