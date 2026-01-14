import React, { useState, useEffect } from 'react';
import './TeamPage.css';
import MatchDetailPage from './MatchDetailPage';
import Icon from './Icon';

function TeamPage({ currentGame, onGameChange, user }) {
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [livePlayersData, setLivePlayersData] = useState(null);
  const [liveMatchesData, setLiveMatchesData] = useState(null);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const gameIndex = ['Valorant', 'Counter Strike', 'Call of Duty', 'Fortnite'].indexOf(currentGame);

  // Vérifier le niveau d'abonnement
  const hasGoldAccess = user && (user.subscriptionLevel === 'gold' || user.roles?.includes('ROLE_ADMIN'));
  const hasSilverAccess = user && (user.subscriptionLevel === 'silver' || user.subscriptionLevel === 'gold' || user.roles?.includes('ROLE_ADMIN'));
  const isFreeUser = !user || user.subscriptionLevel === 'free';

  // IDs des Google Sheets
  const VALORANT_SHEET_ID = '1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg';
  const COD_SHEET_ID = '1semtK-pmRquxyF88CjpjwmNpwhYezCHaWRKFkX90WkY';
  // ID pour Counter-Strike (à remplacer par votre sheet ou laissez vide pour utiliser .env côté backend)
  const CS_SHEET_ID = '';

  // Charger les données depuis Google Sheets
  useEffect(() => {
    if (currentGame === 'Valorant') {
      fetchLivePlayersData('valorant', VALORANT_SHEET_ID);
      fetchLiveMatchesData('valorant', VALORANT_SHEET_ID);
    } else if (currentGame === 'Call of Duty') {
      fetchLivePlayersData('cod', COD_SHEET_ID);
      fetchLiveMatchesData('cod', COD_SHEET_ID);
    }
  }, [currentGame]);

  // Si Counter Strike, récupérer depuis l'API CS2 (Google Sheets backend)
  useEffect(() => {
    if (currentGame === 'Counter Strike') {
      fetchLivePlayersData('cs2', CS_SHEET_ID);
      fetchLiveMatchesData('cs2', CS_SHEET_ID);
    }
  }, [currentGame]);

  const fetchLivePlayersData = async (game, sheetId) => {
    try {
      setLoadingPlayers(true);
      let data = null;

      // Pour CS2/COD, privilégier les routes dédiées si elles existent
      if (game === 'cs2') {
        try {
          const resp = await fetch(`http://localhost:8000/api/cs2/players`);
          const json = await resp.json();
          data = json;
        } catch (e) {
          console.warn('[TeamPage] échec /api/cs2/players, fallback vers google-sheets', e);
        }
      }

      if (game === 'cod') {
        try {
          const resp = await fetch(`http://localhost:8000/api/cod/players`);
          const json = await resp.json();
          data = json;
        } catch (e) {
          console.warn('[TeamPage] échec /api/cod/players, fallback vers google-sheets', e);
        }
      }

      // Si pas de données encore, utiliser l'endpoint google-sheets générique
      if (!data) {
        const response = await fetch(
          `http://localhost:8000/api/google-sheets/players/${game}?spreadsheetId=${sheetId}`
        );
        data = await response.json();
      }

      // Normaliser les différents formats de réponse
      // PlayerController: { success:true, data: [...] }
      // GoogleSheetsController: { success:true, players: [...] }
      const players = data?.data || data?.players || data?.playersList || [];
      if (players && players.length >= 0) {
        console.log(`[TeamPage] Joueurs ${game} chargés:`, players.length, players);
        setLivePlayersData(players);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const fetchLiveMatchesData = async (game, sheetId) => {
    try {
      setLoadingMatches(true);
      // Pas d'endpoint dédié pour les matches CS2, on utilise google-sheets/matches
      const response = await fetch(
        `http://localhost:8000/api/google-sheets/matches/${game}?spreadsheetId=${sheetId}`
      );
      const data = await response.json();

      // Normaliser: { success:true, matches: [...] } ou { matches: [...] } ou { data: [...] }
      const matches = data?.matches || data?.data || [];
      if (matches && matches.length >= 0) {
        setLiveMatchesData(matches);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Normalize image field coming from Google Sheets (handles =IMAGE("url"), <img src="...">, Drive links)
  const normalizeImageUrl = (raw) => {
    if (!raw) return null;
    try {
      let s = String(raw).trim();
      // =IMAGE("url") formula
      const imageFormulaMatch = s.match(/=IMAGE\((["'])(.*?)\1\)/i);
      if (imageFormulaMatch) return imageFormulaMatch[2];
      // HTML img tag
      const imgTagMatch = s.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      if (imgTagMatch) return imgTagMatch[1];
      // Google Drive share links -> direct download
      const driveMatch = s.match(/drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+))/i);
      if (driveMatch) {
        const id = driveMatch[1] || driveMatch[2];
        return `https://drive.google.com/uc?export=download&id=${id}`;
      }
      // If already a URL or data URI
      if (/^https?:\/\//i.test(s) || /^data:/i.test(s)) return s;
      // otherwise return raw string (maybe already usable)
      return s;
    } catch (e) {
      return null;
    }
  };

  const gameData = {
    'Valorant': {
      title: 'Valorant - VCT',
      players: livePlayersData ? (() => {
        const filtered = livePlayersData.filter(player => (player.id || player.ID || player.Name) && String(player.id || player.ID || player.Name).trim() !== '');
        // Normalize fields and include `number` as jersey number (numero)
        const normalized = filtered.map(player => {
          const rawRating = player.Rating || player.rating || player.note || player.Note || player.Rate;
          const rawKDA = player.KDA || player.kda || player.kd;
          return ({
            // Prefer pseudo/id for display, fallback to Name
            displayId: player.id || player.ID || player.IDentifier || null,
            name: player.id || player.ID || player.Name || player.name || 'Unknown',
            role: player['Role Specific'] || player.roleSpecific || player.role || player.position || '',
            kd: rawKDA ? String(rawKDA) : '0.00',
            acs: (player.ACS || player.acs || player.acs_raw) ? String(player.ACS || player.acs || player.acs_raw) : '0',
            rating: rawRating ? String(rawRating) : '0.00',
            gamesPlayed: player.gamesPlayed,
            wins: player.wins,
            losses: player.losses,
            nationality: player.Nationality || player.nationality,
            number: player.Number || player.number || player.numero || player['Number'] || player['Numéro'] || '',
            image: player.image || player.avatar || player.photo,
            raw: player
          });
        });

        // Sort: IGL (role includes 'IGL' case-insensitive) first, then alphabetically by name
        normalized.sort((a, b) => {
          const aIsIGL = /igl/i.test(String(a.role || ''));
          const bIsIGL = /igl/i.test(String(b.role || ''));
          if (aIsIGL && !bIsIGL) return -1;
          if (!aIsIGL && bIsIGL) return 1;
          return String(a.name).localeCompare(String(b.name), 'fr', { sensitivity: 'base' });
        });

        return normalized;
      })() : [],
      region: '#8 EMEA',
      stats: {
        parties: livePlayersData ? livePlayersData.reduce((sum, p) => sum + p.gamesPlayed, 0) : 0,
        winRate: livePlayersData ? 
          `${Math.round((livePlayersData.reduce((sum, p) => sum + p.wins, 0) / 
          livePlayersData.reduce((sum, p) => sum + p.gamesPlayed, 0) * 100))}%` : '0%',
        formats: 12,
        earning: '$156,420'
      },
      additionalStats: {
        avgKDA: livePlayersData ? 
          (livePlayersData.reduce((sum, p) => sum + (p.kda || 0), 0) / livePlayersData.length).toFixed(2) : '0.00',
        avgACS: livePlayersData ? 
          Math.round(livePlayersData.reduce((sum, p) => sum + (p.acs || 0), 0) / livePlayersData.length) : 0,
        avgRating: livePlayersData ? 
          (livePlayersData.reduce((sum, p) => sum + (p.rating || 0), 0) / livePlayersData.length).toFixed(2) : '0.00',
        totalGames: livePlayersData ? 
          livePlayersData.reduce((sum, p) => sum + p.gamesPlayed, 0) : 0
      },
      matches: liveMatchesData && liveMatchesData.length > 0 ? liveMatchesData : [],
      ranking: [
        { pos: 1, team: 'Fnatic', points: 450, wins: 28, losses: 12, image: 'https://upload.wikimedia.org/wikipedia/fr/thumb/f/f4/Fnatic-Logo-2020.svg/1280px-Fnatic-Logo-2020.svg.png'},
        { pos: 2, team: 'Team Vitality', points: 425, wins: 26, losses: 14, image: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/86/Team_Vitalitylogo_square.png/revision/latest?cb=20230224142251'},
        { pos: 3, team: 'Team Liquid', points: 410, wins: 25, losses: 15, image: 'https://upload.wikimedia.org/wikipedia/en/f/f1/Team_Liquid_logo.svg' },
        { pos: 8, team: 'Gentle Mates', points: 340, wins: 21, losses: 19, highlight: true, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4tfPsDzgeiyBAajGZWsxVR_RTjGltwEkRyw&s'}
      ],
      performanceData: [
        { month: 'Août', winRate: 58 },
        { month: 'Sept', winRate: 62 },
        { month: 'Oct', winRate: 64 },
        { month: 'Nov', winRate: 66 },
        { month: 'Déc', winRate: 64 }
      ]
    },
    'Counter Strike': {
      title: 'Counter Strike 2 - ESL',
      players: livePlayersData && currentGame === 'Counter Strike' ? (() => {
        const filtered = livePlayersData.filter(player => (player.id || player.ID || player.Name) && String(player.id || player.ID || player.Name).trim() !== '');
        const normalized = filtered.map(player => ({
          // Preferer l'ID comme pseudo d'affichage
          displayId: player.id || player.ID || player.IDentifier || null,
          name: player.id || player.ID || player.Name || player.name || 'Unknown',
          role: player['Role Specific'] || player.roleSpecific || player.role || player.position || '',
          kd: player.KD?.toFixed ? player.KD.toFixed(2) : (player.kd || player.KDA || '0.00'),
          rating: player.Rating || player.rating || '0.00',
          gamesPlayed: player.gamesPlayed,
          wins: player.wins,
          losses: player.losses,
          nationality: player.Nationality || player.nationality,
          number: player.Number || player.number || player.numero || '',
          // Image renvoyée par le backend dans la colonne Image (M)
          image: player.image || player.Image || player.avatar || player.photo,
          raw: player
        }));
        normalized.sort((a,b) => {
          const aIsIGL = /igl/i.test(String(a.role || ''));
          const bIsIGL = /igl/i.test(String(b.role || ''));
          if (aIsIGL && !bIsIGL) return -1;
          if (!aIsIGL && bIsIGL) return 1;
          return String(a.name).localeCompare(String(b.name), 'fr', { sensitivity: 'base' });
        });
        return normalized;
      })() : [
        { name: 'JaCkz', role: 'AWPer', kd: '1.31', rating: '1.18' },
        { name: 'afro', role: 'Rifler', kd: '1.15', rating: '1.09' },
        { name: 'bodyy', role: 'Entry', kd: '1.08', rating: '1.04' },
        { name: 'Lucky', role: 'Support', kd: '0.96', rating: '0.98' },
        { name: 'JACKZ', role: 'IGL', kd: '1.02', rating: '1.01' }
      ],
      region: '#15 EU',
      stats: {
        parties: 189,
        winRate: '58%',
        formats: 9,
        earning: '$89,350'
      },
      additionalStats: {
        averageKills: '18.4',
        clutchWins: '34%',
        entrySuccess: '56%',
        headshot: '51%'
      },
      matches: liveMatchesData && currentGame === 'Counter Strike' && liveMatchesData.length > 0 ? liveMatchesData : [
        { date: '27/11', team: 'Gentle Mates', score: '16-14', opponent: 'G2 Esports', tournament: 'ESL Pro League', win: true },
        { date: '24/11', team: 'Gentle Mates', score: '10-16', opponent: 'FaZe Clan', tournament: 'ESL Pro League', win: false },
        { date: '21/11', team: 'Gentle Mates', score: '16-12', opponent: 'Vitality', tournament: 'ESL Pro League', win: true },
        { date: '18/11', team: 'Gentle Mates', score: '16-8', opponent: 'ENCE', tournament: 'ESL Pro League', win: true },
        { date: '14/11', team: 'Gentle Mates', score: '13-16', opponent: 'Navi', tournament: 'ESL Pro League', win: false }
      ],
      ranking: [
        { pos: 1, team: 'FaZe Clan', points: 1000, wins: 45, losses: 12 },
        { pos: 2, team: 'Natus Vincere', points: 950, wins: 42, losses: 15 },
        { pos: 3, team: 'Vitality', points: 920, wins: 40, losses: 17 },
        { pos: 15, team: 'Gentle Mates', points: 680, wins: 32, losses: 23, highlight: true }
      ],
      performanceData: [
        { month: 'Août', winRate: 52 },
        { month: 'Sept', winRate: 55 },
        { month: 'Oct', winRate: 58 },
        { month: 'Nov', winRate: 60 },
        { month: 'Déc', winRate: 58 }
      ]
    },
    'Call of Duty': {
      title: 'Call of Duty - CDL',
      players: livePlayersData && currentGame === 'Call of Duty' ? (() => {
        const filtered = livePlayersData.filter(player => (player.id || player.ID || player.Name) && String(player.id || player.ID || player.Name).trim() !== '');
        const normalized = filtered.map(player => ({
          // Afficher l'ID comme pseudo
          displayId: player.id || player.ID || player.IDentifier || null,
          name: player.id || player.ID || player.Name || player.name || 'Unknown',
          role: player['Role Specific'] || player.roleSpecific || player.role || player.position || '',
          kd: player.overallKD?.toFixed(2) || player.KDA || player.kda || player.kd ? (player.overallKD || player.KDA || player.kda || player.kd).toString() : '0.00',
          spm: 'N/A',
          gamesPlayed: player.gamesPlayed,
          wins: player.wins,
          losses: player.losses,
          nationality: player.Nationality || player.nationality,
          hpKD: player.hpKD?.toFixed(2) || '0.00',
          sndKD: player.sndKD?.toFixed(2) || '0.00',
          olKD: player.olKD?.toFixed(2) || '0.00',
          number: player.Number || player.number || player.numero || player['Number'] || player['Numéro'] || '',
          // Image renvoyée par le backend dans la colonne Image (N)
          image: player.image || player.Image || player.avatar || player.photo,
          raw: player
        }));
        normalized.sort((a,b) => {
          const aIsIGL = /igl/i.test(String(a.role || ''));
          const bIsIGL = /igl/i.test(String(b.role || ''));
          if (aIsIGL && !bIsIGL) return -1;
          if (!aIsIGL && bIsIGL) return 1;
          return String(a.name).localeCompare(String(b.name), 'fr', { sensitivity: 'base' });
        });
        return normalized;
      })() : [],
      region: '#10 International',
      stats: {
        parties: livePlayersData && currentGame === 'Call of Duty' ? 
          livePlayersData.reduce((sum, p) => sum + p.gamesPlayed, 0) : 0,
        winRate: livePlayersData && currentGame === 'Call of Duty' ? 
          `${Math.round((livePlayersData.reduce((sum, p) => sum + p.wins, 0) / 
          livePlayersData.reduce((sum, p) => sum + p.gamesPlayed, 0) * 100))}%` : '0%',
        formats: 7,
        earning: '$72,800'
      },
      additionalStats: {
        avgOverallKD: livePlayersData && currentGame === 'Call of Duty' ? 
          (livePlayersData.reduce((sum, p) => sum + (p.overallKD || 0), 0) / livePlayersData.length).toFixed(2) : '0.00',
        avgHpKD: livePlayersData && currentGame === 'Call of Duty' ? 
          (livePlayersData.reduce((sum, p) => sum + (p.hpKD || 0), 0) / livePlayersData.length).toFixed(2) : '0.00',
        avgSndKD: livePlayersData && currentGame === 'Call of Duty' ? 
          (livePlayersData.reduce((sum, p) => sum + (p.sndKD || 0), 0) / livePlayersData.length).toFixed(2) : '0.00',
        avgOlKD: livePlayersData && currentGame === 'Call of Duty' ? 
          (livePlayersData.reduce((sum, p) => sum + (p.olKD || 0), 0) / livePlayersData.length).toFixed(2) : '0.00'
      },
      matches: liveMatchesData && liveMatchesData.length > 0 && currentGame === 'Call of Duty' ? liveMatchesData : [],
      ranking: [
        { pos: 1, team: 'Atlanta FaZe', points: 850, wins: 38, losses: 10 },
        { pos: 2, team: 'OpTic Gaming', points: 820, wins: 36, losses: 12 },
        { pos: 3, team: 'LA Thieves', points: 780, wins: 34, losses: 14 },
        { pos: 10, team: 'Gentle Mates', points: 620, wins: 28, losses: 18, highlight: true }
      ],
      performanceData: [
        { month: 'Août', winRate: 56 },
        { month: 'Sept', winRate: 59 },
        { month: 'Oct', winRate: 61 },
        { month: 'Nov', winRate: 63 },
        { month: 'Déc', winRate: 61 }
      ]
    },
    'Fortnite': {
      title: 'Fortnite - FNCS',
      players: [
        { name: 'Kami', role: 'IGL', kills: '4.8', placement: '3.2' },
        { name: 'Vato', role: 'Fragger', kills: '5.6', placement: '3.2' },
        { name: 'Setty', role: 'Support', kills: '3.9', placement: '3.2' }
      ],
      region: '#6 EU',
      stats: {
        parties: 312,
        winRate: '68%',
        formats: 15,
        earning: '$203,560'
      },
      additionalStats: {
        avgPlacement: '3.2',
        victoriesRoyale: '48',
        avgElims: '14.3',
        top5Rate: '76%'
      },
      matches: [
        { date: '29/11', team: 'Gentle Mates', score: '1st', opponent: 'FNCS Finals', tournament: 'FNCS', win: true },
        { date: '26/11', team: 'Gentle Mates', score: '3rd', opponent: 'FNCS Semi-Finals', tournament: 'FNCS', win: true },
        { date: '23/11', team: 'Gentle Mates', score: '8th', opponent: 'FNCS Qualifiers', tournament: 'FNCS', win: false },
        { date: '20/11', team: 'Gentle Mates', score: '2nd', opponent: 'FNCS Heats', tournament: 'FNCS', win: true },
        { date: '16/11', team: 'Gentle Mates', score: '5th', opponent: 'FNCS Opens', tournament: 'FNCS', win: true }
      ],
      ranking: [
        { pos: 1, team: 'Team Falcons', points: 2450, wins: 68, losses: 12 },
        { pos: 2, team: 'XSET', points: 2380, wins: 65, losses: 15 },
        { pos: 3, team: 'NRG', points: 2320, wins: 62, losses: 18 },
        { pos: 6, team: 'Gentle Mates', points: 2180, wins: 58, losses: 22, highlight: true }
      ],
      news: [
        { date: '01/12', title: 'Kami rejoint Gentle Mates', category: 'Transfer', description: 'Le joueur star rejoint notre roster Fortnite pour la saison à venir.' },
        { date: '28/11', title: 'Victoire historique contre Vitality', category: 'Match', description: 'Belle performance de l\'équipe avec un 2-1 renversant en VCT EMEA.' },
        { date: '20/11', title: 'Qualification pour les playoffs', category: 'Tournoi', description: 'Gentle Mates se qualifie pour les playoffs du FNCS EU.' }
      ],
      achievements: [
        { title: 'FNCS Champion', date: '2024', icon: 'trophy' },
        { title: 'Top 5 EMEA', date: '2024', icon: 'star' },
        { title: '48 Victory Royales', date: 'Season 6', icon: 'star' }
      ],
      performanceData: [
        { month: 'Août', winRate: 62 },
        { month: 'Sept', winRate: 65 },
        { month: 'Oct', winRate: 68 },
        { month: 'Nov', winRate: 72 },
        { month: 'Déc', winRate: 68 }
      ],
      allMatches: [
        { date: '29/11', team: 'Gentle Mates', score: '1st', opponent: 'FNCS Finals', tournament: 'FNCS', win: true },
        { date: '26/11', team: 'Gentle Mates', score: '3rd', opponent: 'FNCS Semi-Finals', tournament: 'FNCS', win: true },
        { date: '23/11', team: 'Gentle Mates', score: '8th', opponent: 'FNCS Qualifiers', tournament: 'FNCS', win: false },
        { date: '20/11', team: 'Gentle Mates', score: '2nd', opponent: 'FNCS Heats', tournament: 'FNCS', win: true },
        { date: '16/11', team: 'Gentle Mates', score: '5th', opponent: 'FNCS Opens', tournament: 'FNCS', win: true },
        { date: '12/11', team: 'Gentle Mates', score: '1st', opponent: 'FNCS Week 4', tournament: 'FNCS', win: true },
        { date: '09/11', team: 'Gentle Mates', score: '4th', opponent: 'FNCS Week 3', tournament: 'FNCS', win: true },
        { date: '05/11', team: 'Gentle Mates', score: '7th', opponent: 'FNCS Week 2', tournament: 'FNCS', win: false },
        { date: '02/11', team: 'Gentle Mates', score: '2nd', opponent: 'FNCS Week 1', tournament: 'FNCS', win: true },
        { date: '28/10', team: 'Gentle Mates', score: '3rd', opponent: 'FNCS Trials', tournament: 'FNCS', win: true }
      ]
    }
  };

  const newsData = {
    'Valorant': [
      { date: '01/12', title: 'Starxo MVP du mois', category: 'Performance', description: 'Starxo termine le mois avec un KD exceptionnel de 1.45.' },
      { date: '28/11', title: 'Victoire contre Vitality 2-1', category: 'Match', description: 'Belle remontée de Gentle Mates dans le dernier match de la phase.' },
      { date: '20/11', title: 'Nouveau coach rejoint l\'équipe', category: 'Transfer', description: 'Un ancien pro rejoint le staff pour améliorer les stratégies.' }
    ],
    'Counter Strike': [
      { date: '30/11', title: 'JaCkz atteint 1000 kills', category: 'Record', description: 'JaCkz franchit la barre des 1000 kills avec Gentle Mates.' },
      { date: '27/11', title: 'Comeback fou contre G2', category: 'Match', description: 'De 10-14 à 16-14, Gentle Mates réalise un comeback mémorable.' },
      { date: '22/11', title: 'Bootcamp avant les Major', category: 'Préparation', description: 'L\'équipe part en bootcamp intensif de 2 semaines.' }
    ],
    'Call of Duty': [
      { date: '29/11', title: 'HyDra Top 3 SMG mondial', category: 'Classement', description: 'HyDra entre dans le top 3 des meilleurs SMG au monde.' },
      { date: '26/11', title: '3-1 contre OpTic Gaming', category: 'Match', description: 'Domination totale de Gentle Mates sur OpTic Gaming.' },
      { date: '18/11', title: 'Nouveau record de Hill Time', category: 'Record', description: 'L\'équipe établit un nouveau record avec 142s de Hill Time moyen.' }
    ],
    'Fortnite': [
      { date: '01/12', title: 'Kami rejoint Gentle Mates', category: 'Transfer', description: 'Le joueur star rejoint notre roster Fortnite pour la saison à venir.' },
      { date: '29/11', title: 'Champions FNCS Finals!', category: 'Victoire', description: 'Gentle Mates remporte les FNCS Finals EU avec une performance parfaite!' },
      { date: '20/11', title: 'Qualification pour les playoffs', category: 'Tournoi', description: 'Gentle Mates se qualifie pour les playoffs du FNCS EU.' }
    ]
  };

  const achievementsData = {
    'Valorant': [
      { title: 'VCT EMEA Finalist', date: '2024', icon: 'trophy' },
      { title: 'Top 8 EMEA', date: '2024', icon: 'star' },
      { title: 'Longest Win Streak: 12', date: 'Oct 2024', icon: 'fire' },
      { title: 'Player of Month: Starxo', date: 'Nov 2024', icon: 'star' }
    ],
    'Counter Strike': [
      { title: 'ESL Pro League Top 16', date: '2024', icon: 'trophy' },
      { title: 'JaCkz 1000 Kills', date: '2024', icon: 'star' },
      { title: 'Best Comeback: 10-14', date: 'Nov 2024', icon: 'trendingUp' },
      { title: 'Highest Team Rating: 1.18', date: '2024', icon: 'barChart' }
    ],
    'Call of Duty': [
      { title: 'CDL Major Top 10', date: '2024', icon: 'trophy' },
      { title: 'HyDra Top 3 SMG', date: '2024', icon: 'star' },
      { title: 'Record Hill Time: 142s', date: 'Nov 2024', icon: 'fire' },
      { title: 'S&D Win Rate: 67%', date: '2024', icon: 'target' }
    ],
    'Fortnite': [
      { title: 'FNCS Champion', date: '2024', icon: 'trophy' },
      { title: 'Top 6 EU Rankings', date: '2024', icon: 'star' },
      { title: '48 Victory Royales', date: 'Season 6', icon: 'fire' },
      { title: 'Highest Earnings: $203K', date: '2024', icon: 'trendingUp' }
    ]
  };

  const data = gameData[currentGame] || gameData['Valorant'];
  const news = newsData[currentGame] || newsData['Valorant'];
  const achievements = achievementsData[currentGame] || achievementsData['Valorant'];
  const matchesToShow = showAllMatches ? (data.allMatches || data.matches) : data.matches.slice(0, 3);

  // Déterminer le prochain match affiché — overrides par jeu si demandé
  const _baseNext = (matchesToShow && matchesToShow[0]) ? { ...matchesToShow[0] } : {};
  let nextMatchDisplay = { ..._baseNext };

  if (currentGame === 'Valorant') {
    nextMatchDisplay = {
      ..._baseNext,
      team: 'Gentle Mates',
      opponent: 'FUT Esport',
      date: '26/01',
      tournament: 'VCT EMEA KICKOFF',
      homeLogo: _baseNext.homeLogo || '/img/teams/gentle-mates.svg',
      awayLogo: _baseNext.awayLogo || '/img/teams/placeholder.svg'
    };
  } else if (currentGame === 'Call of Duty') {
    nextMatchDisplay = {
      ..._baseNext,
      team: 'Riyadh Falcons',
      opponent: 'Gentle Mates',
      date: '16/01',
      tournament: _baseNext.tournament || '',
      homeLogo: _baseNext.homeLogo || '/img/teams/placeholder.svg',
      awayLogo: _baseNext.awayLogo || '/img/teams/gentle-mates.svg'
    };
  } else {
    // For CS and other games, conserver le premier match existant
    nextMatchDisplay = { ..._baseNext };
  }

  // Si un match est sélectionné, afficher la page de détail
  if (selectedMatch) {
    return <MatchDetailPage matchData={selectedMatch} onBack={() => setSelectedMatch(null)} />;
  }

  return (
    <div className={`team-page ${currentGame.toLowerCase().replace(/\s+/g, '-')}-theme`}>
      
      <div className="team-content-wrapper">
        <div className="game-selector">
          <button 
            className={`game-btn valorant-btn ${gameIndex === 0 ? 'active' : ''}`}
            onClick={() => onGameChange(0)}
          >
            <span className="game-icon"></span>
            <span className="game-name">Valorant</span>
          </button>
          <button 
            className={`game-btn cs-btn ${gameIndex === 1 ? 'active' : ''}`}
            onClick={() => onGameChange(1)}
          >
            <span className="game-icon"></span>
            <span className="game-name">Counter Strike</span>
          </button>
          <button 
            className={`game-btn cod-btn ${gameIndex === 2 ? 'active' : ''}`}
            onClick={() => onGameChange(2)}
          >
            <span className="game-icon"></span>
            <span className="game-name">Call of Duty</span>
          </button>
        </div>

          <div className="team-header-section">
          <div className="team-region-badge">{data.region}</div>
          
          <div className="team-info-card">
            <div className="team-left-section">
              
              <div className="team-logo-wrapper">
                <svg className="valorant-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="30,20 50,60 30,80" fill="#FF4655"/>
                  <polygon points="50,60 70,20 70,80" fill="#FF4655"/>
                </svg>
              </div>
              
              <div className="team-info">
                <h2 className="team-name">{data.title}</h2>
                <div className="team-region-inline">{data.region}</div>
              </div>
            </div>
            
            <div className={`team-stats-card ${currentGame.toLowerCase().replace(' ', '-')}-game`}>
              <div className="stat-item">
                <div className="stat-value">{data.stats.parties}</div>
                <div className="stat-label">Parties</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.stats.winRate}</div>
                <div className="stat-label">Win Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.stats.formats}</div>
                <div className="stat-label">Formats</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.stats.earning}</div>
                <div className="stat-label">Earning</div>
              </div>
            </div>
          </div>
        </div>

        <div className="players-stats-section">
          <div className="section-header">
            <h2 className="section-title">Roster & Stats</h2>
            {currentGame === 'Valorant' && livePlayersData && (
              <span className="live-indicator">
                <span className="live-dot"></span>
                Données en direct
              </span>
            )}
          </div>
          {loadingPlayers ? (
            <div className="loading-players-styled">
              <div className="loading-animation">
                <div className="loading-logo">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="30,20 50,60 30,80" fill="#FF4655" className="logo-part-1"/>
                    <polygon points="50,60 70,20 70,80" fill="#FF4655" className="logo-part-2"/>
                  </svg>
                </div>
                <div className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
              <p className="loading-text">Récupération des stats depuis Google Sheets...</p>
            </div>
          ) : data.players.length === 0 ? (
            <div className="no-data-message">
              <div className="no-data-icon"><Icon name="barChart" size={48} color="#7D3CFF" /></div>
              <h3>Aucune donnée disponible</h3>
              <p>Les stats des joueurs {currentGame} seront chargées depuis Google Sheets.</p>
            </div>
          ) : (
            <div className="dark-grid-container">
              {data.players.map((player, index) => {
                // show pseudo/id first if present
                const name = player.displayId || player.name || 'Unknown';
                const jersey = player.number || '';
                // show player's role instead of data.title
                const team = player.role || data.title || '';
                const rawImg = player.image || player.avatar || player.photo || (player.raw && (player.raw.image || player.raw.Image));
                const imgUrl = normalizeImageUrl(rawImg) || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111827&color=ffffff&size=250`;
                const kda = player.kd || '0.00';
                const acs = player.acs || '0';
                const rating = player.rating || (player.raw && (player.raw.Rating || player.raw.rating || player.raw.note)) || '0.00';

                const gameClass = currentGame ? currentGame.toLowerCase().replace(/\s+/g, '-') + '-game' : '';
                return (
                  <div key={index} className={`neon-card ${gameClass}`}>
                    <div
                      className="card-top"
                      style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                    <div className="card-content">
                      <h3 className="neon-name">{name.toUpperCase()}{jersey ? `  #${jersey}` : ''}</h3>
                      <p className="neon-team">{team}</p>
                      <div className="data-grid">
                        <div className="data-item">
                          <span className="label">KDA</span>
                          <span className="value text-green">{kda}</span>
                        </div>
                        <div className="data-item">
                          <span className="label">ACS</span>
                          <span className="value">{acs}</span>
                        </div>
                        <div className="data-item">
                          <span className="label">Rating</span>
                          <span className="value text-blue">{rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="additional-stats-section">
          <h2 className="section-title">Statistiques Avancées</h2>
          <div className="stats-cards">
            {Object.entries(data.additionalStats).map(([key, value], index) => (
              <div key={index} className="advanced-stat-card">
                <div className="advanced-stat-value">{value}</div>
                <div className="advanced-stat-label">
                  {key === 'avgKDA' ? 'KDA Moyen' : 
                   key === 'avgACS' ? 'ACS Moyen' : 
                   key === 'avgRating' ? 'Rating Moyen' : 
                   key === 'totalGames' ? 'Matchs Totaux' : 
                   key === 'avgOverallKD' ? 'K/D Global Moyen' :
                   key === 'avgHpKD' ? 'K/D Hardpoint Moyen' :
                   key === 'avgSndKD' ? 'K/D SnD Moyen' :
                   key === 'avgOlKD' ? 'K/D Control Moyen' :
                   key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="split-container">
          <div className="ranking-section">
            <div className="section-header">
              <h2>Classement</h2>
              <span className="season-tag">2025/2026</span>
            </div>

            <table className="pro-table">
              <thead>
                <tr>
                  <th className="col-pos">#</th>
                  <th className="col-team">Équipe</th>
                  <th className="col-pts">Pts</th>
                </tr>
              </thead>
              <tbody>
                {data.ranking.map((team, i) => {
                  // Marquer les top-3 visuellement, sans label "Masters"
                  const rowClass = team.pos <= 3 ? 'row-ucl' : '';

                  // Générer un slug à partir du nom d'équipe pour chercher un logo local
                  const teamSlug = team.team ? String(team.team).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : 'team';
                  const localLogo = `/img/teams/${teamSlug}.svg`;
                  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.team || 'Team')}&background=eee&color=555`;

                  return (
                    <tr key={i} className={`${rowClass}`}>
                      <td className="pos">{team.pos}</td>
                      <td className="team">
                        {/* Utilise un logo local si présent dans /public/img/teams, sinon fallback vers team.image/team.logo puis ui-avatars */}
                        <img
                          src={localLogo}
                          onError={(e) => { e.target.onerror = null; e.target.src = team.image || team.logo || fallbackAvatar; }}
                          className="mini-logo"
                          alt={team.team}
                        />
                        {team.team}
                      </td>
                      <td className="pts">{team.points}</td>
                    </tr>
                  );
                })}
                
              </tbody>
            </table>

            <div className="table-footer">
              <a href="#">Classement complet →</a>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="next-game-card">
              <div className="next-label">À SUIVRE</div>
              <div className="game-flex">
                {nextMatchDisplay ? (
                  <>
                    <img src={nextMatchDisplay.homeLogo} className="lg-logo" alt="home" />
                    <div className="game-info">
                      <span className="date">{nextMatchDisplay.date || ''}</span>
                      <span className="versus" style={{ whiteSpace: 'nowrap' }}>{nextMatchDisplay.team || ''} <span className="v">vs</span> {nextMatchDisplay.opponent || ''}</span>
                      <span className="stadium">{nextMatchDisplay.stadium || nextMatchDisplay.tournament || ''}</span>
                    </div>
                    <img src={nextMatchDisplay.awayLogo} className="lg-logo" alt="away" />
                  </>
                ) : (
                  <div style={{width: '100%'}}>Aucun match à venir</div>
                )}
              </div>
            </div>

            <div className="history-block">
              <h3>Derniers résultats</h3>
              {matchesToShow.slice(0,3).map((m, idx) => {
                const resClass = m.win === true ? 'win' : (m.win === false ? 'loss' : 'draw');
                const score = m.score || m.result || (m.homeScore != null ? `${m.homeScore} - ${m.awayScore}` : '—');
                return (
                  <div key={idx} className={`hist-row results-row`}>
                    <div className="h-date">{m.date || ''}</div>
                    <div className="h-match">
                      <span className="h-team">{m.team || m.home || ''}</span>
                      <span className="score-box" style={{minWidth:56, display:'inline-block', textAlign:'center'}}>{score}</span>
                      <span className="h-team text-right">{m.opponent || m.away || ''}</span>
                    </div>
                    <div style={{marginLeft:8}}>
                      <div
                        className="result-pill"
                        style={{
                          backgroundColor: resClass === 'win' ? '#22c55e' : resClass === 'loss' ? '#ef4444' : '#6b7280',
                          color: '#ffffff',
                          borderRadius: 6,
                          padding: '4px 6px',
                          fontWeight: 700
                        }}
                      >
                        {resClass === 'win' ? 'V' : resClass === 'draw' ? 'N' : 'D'}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="hist-more">
                <a href="#">Voir le calendrier complet</a>
              </div>
            </div>
          </div>
        </div>

        <div className="achievements-section">
          <h2 className="section-title">Trophées & Achievements</h2>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
                <div key={index} className={`achievement-card ${currentGame.toLowerCase().replace(' ', '-')}-game`}>
                  <div className="achievement-icon">
                    <Icon name={achievement.icon} size={28} color="#7D3CFF" />
                  </div>
                  <div className="achievement-info">
                    <h3 className="achievement-title">{achievement.title}</h3>
                    <p className="achievement-date">{achievement.date}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="performance-chart-section">
          <h2 className="section-title">Évolution du Win Rate</h2>
          <div className="chart-container">
            {data.performanceData && data.performanceData.map((month, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div className="chart-bar-container">
                  <div 
                    className={`chart-bar ${currentGame.toLowerCase().replace(' ', '-')}-game`}
                    style={{ height: `${month.winRate}%` }}
                  >
                    <span className="bar-value">{month.winRate}%</span>
                  </div>
                </div>
                <div className="chart-label">{month.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Section - Timeline des Kills */}
        <div className="premium-section">
          <div className="section-header-premium">
            <h2 className="section-title">Timeline des Kills</h2>
            {!hasGoldAccess && (
              <div className="premium-badge">
                <span className="premium-icon">👑</span>
                Gold
              </div>
            )}
          </div>
          
          {hasGoldAccess ? (
            <div className="timeline-container">
              <div className="timeline-header">
                <span className="timeline-label">Round</span>
                <span className="timeline-label">1:00</span>
                <span className="timeline-label">0:45</span>
                <span className="timeline-label">0:30</span>
                <span className="timeline-label">0:15</span>
                <span className="timeline-label">0:00</span>
              </div>
              {[1, 2, 3, 4, 5].map((round) => (
                <div key={round} className="timeline-row">
                  <span className="timeline-round">R{round}</span>
                  <div className="timeline-bar">
                    <div className="kill-marker" style={{ left: '20%' }}>
                      <span className="kill-tooltip">Minny +1</span>
                    </div>
                    <div className="kill-marker" style={{ left: '45%' }}>
                      <span className="kill-tooltip">Dipzh +2</span>
                    </div>
                    <div className="kill-marker" style={{ left: '70%' }}>
                      <span className="kill-tooltip">Buys +1</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="locked-overlay">
              <div className="lock-content">
                <div className="lock-icon"><Icon name="lock" size={48} color="#7D3CFF" /></div>
                <h3>Fonctionnalité Premium Gold</h3>
                <p>Accédez à la timeline détaillée des éliminations par round pour analyser les moments clés.</p>
                <button className="unlock-btn" onClick={() => window.location.href = '#abonnement'}>
                  Débloquer avec Gold
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Premium Section - Heatmap Tactique */}
        <div className="premium-section">
          <div className="section-header-premium">
            <h2 className="section-title">Heatmap Tactique</h2>
            {!hasSilverAccess && (
              <div className="premium-badge">
                <span className="premium-icon">⚡</span>
                Silver
              </div>
            )}
          </div>
          
          {hasSilverAccess ? (
            <div className="heatmap-container">
              <div className="heatmap-grid">
                {Array.from({ length: 100 }).map((_, index) => {
                  const intensity = Math.random();
                  return (
                    <div
                      key={index}
                      className="heatmap-cell"
                      style={{
                        backgroundColor: intensity > 0.7 
                          ? 'rgba(255, 70, 85, 0.8)' 
                          : intensity > 0.4 
                          ? 'rgba(255, 159, 28, 0.6)' 
                          : 'rgba(125, 60, 255, 0.3)'
                      }}
                    />
                  );
                })}
              </div>
              <div className="heatmap-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'rgba(255, 70, 85, 0.8)' }}></span>
                  <span>Zone chaude</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'rgba(255, 159, 28, 0.6)' }}></span>
                  <span>Zone moyenne</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'rgba(125, 60, 255, 0.3)' }}></span>
                  <span>Zone froide</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="locked-overlay">
              <div className="lock-content">
                <div className="lock-icon"><Icon name="lock" size={48} color="#7D3CFF" /></div>
                <h3>Fonctionnalité Premium Pro</h3>
                <p>Visualisez les zones de contrôle et les positions les plus fréquentes avec des heatmaps interactives.</p>
                <button className="unlock-btn" onClick={() => window.location.href = '#abonnement'}>
                  Débloquer avec Pro
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="news-section">
          <h2 className="section-title">Dernières Actualités</h2>
          <div className="news-grid">
            {news.map((item, index) => (
              <div key={index} className="news-card">
                <div className={`news-category ${item.category.toLowerCase()}`}>
                  {item.category}
                </div>
                <div className="news-date">{item.date}</div>
                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
