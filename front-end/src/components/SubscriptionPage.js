import React, { useState } from 'react';
import './SubscriptionPage.css';

function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // monthly or yearly

  const plans = {
    basic: {
      name: 'Basic',
      icon: '📊',
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: '#6C757D',
      features: [
        { name: 'Statistiques de base', included: true },
        { name: 'KD, ACS, Rating', included: true },
        { name: 'Classements', included: true },
        { name: 'Historique des matchs', included: true },
        { name: 'Profil joueur basique', included: true },
        { name: 'Stats avancées', included: false },
        { name: 'Timeline des kills', included: false },
        { name: 'Analyse tactique', included: false },
        { name: 'Heatmaps', included: false },
        { name: 'Comparaison joueurs', included: false },
        { name: 'Support prioritaire', included: false },
        { name: 'Badge exclusif', included: false }
      ]
    },
    pro: {
      name: 'Pro',
      icon: '⚡',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      color: '#7D3CFF',
      popular: true,
      features: [
        { name: 'Statistiques de base', included: true },
        { name: 'KD, ACS, Rating', included: true },
        { name: 'Classements', included: true },
        { name: 'Historique des matchs', included: true },
        { name: 'Profil joueur basique', included: true },
        { name: 'Stats avancées', included: true },
        { name: 'Timeline des kills', included: true },
        { name: 'Analyse tactique', included: true },
        { name: 'Heatmaps', included: true },
        { name: 'Comparaison joueurs', included: true },
        { name: 'Support prioritaire', included: false },
        { name: 'Badge exclusif', included: false }
      ]
    },
    elite: {
      name: 'Elite',
      icon: '👑',
      monthlyPrice: 24.99,
      yearlyPrice: 249.99,
      color: '#FFD700',
      features: [
        { name: 'Statistiques de base', included: true },
        { name: 'KD, ACS, Rating', included: true },
        { name: 'Classements', included: true },
        { name: 'Historique des matchs', included: true },
        { name: 'Profil joueur basique', included: true },
        { name: 'Stats avancées', included: true },
        { name: 'Timeline des kills', included: true },
        { name: 'Analyse tactique', included: true },
        { name: 'Heatmaps', included: true },
        { name: 'Comparaison joueurs', included: true },
        { name: 'Support prioritaire', included: true },
        { name: 'Badge exclusif', included: true }
      ]
    }
  };

  const getPrice = (plan) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    if (billingPeriod === 'yearly' && plan.monthlyPrice > 0) {
      const monthlyTotal = plan.monthlyPrice * 12;
      const savings = monthlyTotal - plan.yearlyPrice;
      return Math.round(savings);
    }
    return 0;
  };

  return (
    <div className="subscription-page">
      <div className="subscription-header">
        <h1 className="subscription-title">Abonnements</h1>
        <p className="subscription-subtitle">
          Choisissez le plan qui correspond à vos besoins
        </p>
      </div>

      <div className="billing-toggle">
        <button
          className={`billing-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
          onClick={() => setBillingPeriod('monthly')}
        >
          Mensuel
        </button>
        <button
          className={`billing-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
          onClick={() => setBillingPeriod('yearly')}
        >
          Annuel
          <span className="save-badge">Économisez jusqu'à 17%</span>
        </button>
      </div>

      <div className="plans-container">
        {Object.entries(plans).map(([key, plan]) => (
          <div
            key={key}
            className={`plan-card ${selectedPlan === key ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
            onClick={() => setSelectedPlan(key)}
            style={{ '--plan-color': plan.color }}
          >
            {plan.popular && <div className="popular-badge">Le plus populaire</div>}
            
            <div className="plan-header">
              <div className="plan-icon">{plan.icon}</div>
              <h2 className="plan-name">{plan.name}</h2>
              <div className="plan-price">
                {plan.monthlyPrice === 0 ? (
                  <span className="price-free">Gratuit</span>
                ) : (
                  <>
                    <span className="price-amount">{getPrice(plan)}€</span>
                    <span className="price-period">/{billingPeriod === 'monthly' ? 'mois' : 'an'}</span>
                  </>
                )}
              </div>
              {getSavings(plan) > 0 && (
                <div className="savings-info">
                  Économisez {getSavings(plan)}€/an
                </div>
              )}
            </div>

            <ul className="features-list">
              {plan.features.map((feature, index) => (
                <li key={index} className={`feature-item ${feature.included ? 'included' : 'excluded'}`}>
                  <span className="feature-icon">
                    {feature.included ? '✓' : '✗'}
                  </span>
                  <span className="feature-name">{feature.name}</span>
                </li>
              ))}
            </ul>

            <button className="subscribe-btn" style={{ backgroundColor: plan.color }}>
              {plan.monthlyPrice === 0 ? 'Commencer gratuitement' : 'S\'abonner'}
            </button>
          </div>
        ))}
      </div>

      <div className="features-explanation">
        <h2 className="explanation-title">Fonctionnalités détaillées</h2>
        
        <div className="features-grid">
          <div className="feature-detail">
            <div className="feature-detail-icon">📊</div>
            <h3>Statistiques de base</h3>
            <p>Accédez aux statistiques essentielles : KD, ACS, Rating, classements et historique des matchs.</p>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-icon">📈</div>
            <h3>Stats avancées</h3>
            <p>Débloquez des métriques détaillées : KAST, ADR, HS%, First Kills, Clutch Rate et plus encore.</p>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-icon">⏱️</div>
            <h3>Timeline des kills</h3>
            <p>Visualisez la timeline des éliminations par round, identifiez les moments clés des matchs.</p>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-icon">🎯</div>
            <h3>Analyse tactique</h3>
            <p>Analysez les stratégies d'équipe, les rotations, le positionnement et les tendances tactiques.</p>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-icon">🗺️</div>
            <h3>Heatmaps</h3>
            <p>Cartes de chaleur interactives pour visualiser les positions, les kills et les zones de contrôle.</p>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-icon">⚖️</div>
            <h3>Comparaison joueurs</h3>
            <p>Comparez les performances de plusieurs joueurs côte à côte avec des graphiques détaillés.</p>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-icon">💬</div>
            <h3>Support prioritaire</h3>
            <p>Assistance dédiée avec temps de réponse rapide et support technique prioritaire.</p>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-icon">👑</div>
            <h3>Badge exclusif</h3>
            <p>Badge Elite affiché sur votre profil, reconnaissable par toute la communauté.</p>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h2 className="faq-title">Questions fréquentes</h2>
        
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Puis-je changer de plan ?</h3>
            <p>Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment. Les changements prennent effet immédiatement.</p>
          </div>

          <div className="faq-item">
            <h3>Comment annuler ?</h3>
            <p>Vous pouvez annuler votre abonnement à tout moment depuis les paramètres. Vous garderez l'accès jusqu'à la fin de votre période payée.</p>
          </div>

          <div className="faq-item">
            <h3>Modes de paiement ?</h3>
            <p>Nous acceptons les cartes bancaires, PayPal et les paiements par virement. Tous les paiements sont sécurisés.</p>
          </div>

          <div className="faq-item">
            <h3>Garantie de remboursement ?</h3>
            <p>Nous offrons une garantie satisfait ou remboursé de 14 jours sur tous nos plans payants.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
