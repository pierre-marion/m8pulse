import React, { useState } from 'react';
import './Calendar.css';

function Calendar({ currentGame }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Janvier 2026
  
  const days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  // Données des matchs sur toute l'année 2026 par jeu
  const matchDates = {
    'Valorant': [
      // 2-3 matchs par mois
      '10/01', '20/01', '28/01',
      '08/02', '18/02',
      '05/03', '15/03', '25/03',
      '10/04', '22/04',
      '08/05', '18/05', '28/05',
      '05/06', '15/06',
      '08/07', '18/07', '28/07',
      '05/08', '15/08',
      '10/09', '20/09', '28/09',
      '08/10', '18/10',
      '05/11', '15/11', '25/11',
      '05/12', '15/12'
    ],
    'Counter Strike': [
      // 8 matchs par mois (2 par semaine environ)
      '03/01', '07/01', '10/01', '14/01', '17/01', '21/01', '24/01', '28/01',
      '04/02', '07/02', '11/02', '14/02', '18/02', '21/02', '25/02', '28/02',
      '03/03', '07/03', '10/03', '14/03', '17/03', '21/03', '24/03', '28/03',
      '04/04', '07/04', '11/04', '14/04', '18/04', '21/04', '25/04', '28/04',
      '02/05', '06/05', '09/05', '13/05', '16/05', '20/05', '23/05', '27/05',
      '03/06', '06/06', '10/06', '13/06', '17/06', '20/06', '24/06', '27/06',
      '04/07', '07/07', '11/07', '14/07', '18/07', '21/07', '25/07', '28/07',
      '04/08', '07/08', '11/08', '14/08', '18/08', '21/08', '25/08', '28/08',
      '04/09', '08/09', '11/09', '15/09', '18/09', '22/09', '25/09', '29/09',
      '02/10', '06/10', '09/10', '13/10', '16/10', '20/10', '23/10', '27/10',
      '03/11', '06/11', '10/11', '13/11', '17/11', '20/11', '24/11', '27/11',
      '04/12', '08/12', '11/12', '15/12', '18/12', '22/12', '26/12', '29/12'
    ],
    'Call of Duty': [
      // 4+ matchs par mois, souvent vendredis et dimanches
      '03/01', '05/01', '10/01', '12/01', '17/01', '19/01',
      '07/02', '09/02', '14/02', '16/02', '21/02', '23/02',
      '07/03', '09/03', '14/03', '16/03', '21/03', '23/03',
      '04/04', '06/04', '11/04', '13/04', '18/04', '20/04',
      '02/05', '04/05', '09/05', '11/05', '16/05', '18/05',
      '06/06', '08/06', '13/06', '15/06', '20/06', '22/06',
      '04/07', '06/07', '11/07', '13/07', '18/07', '20/07',
      '07/08', '09/08', '14/08', '16/08', '21/08', '23/08',
      '04/09', '06/09', '11/09', '13/09', '18/09', '20/09',
      '02/10', '04/10', '09/10', '11/10', '16/10', '18/10',
      '06/11', '08/11', '13/11', '15/11', '20/11', '22/11',
      '04/12', '06/12', '11/12', '13/12', '18/12', '20/12'
    ],
    'Fortnite': []
  };

  const getGameColor = (game) => {
    switch(game) {
      case 'Valorant': return '#FF4655';
      case 'Counter Strike': return '#F5A623';
      case 'Call of Duty': return '#8A2BE2';
      case 'Fortnite': return '#00AEEF';
      default: return '#7D3CFF';
    }
  };

  const getGameAbbr = (game) => {
    switch(game) {
      case 'Valorant': return 'VAL';
      case 'Counter Strike': return 'CS2';
      case 'Call of Duty': return 'COD';
      case 'Fortnite': return 'FTN';
      default: return game;
    }
  };

  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Ajuster pour que Lundi soit 0 (au lieu de Dimanche)
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek === -1) firstDayOfWeek = 6;
    
    const daysArray = [];
    
    // Ajouter les jours vides au début
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push({ day: null, isEmpty: true, matches: [] });
    }
    
    // Ajouter les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${i.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}`;
      
      // Vérifier les matchs pour chaque jeu
      const matches = [];
      Object.keys(matchDates).forEach(game => {
        if (matchDates[game].includes(dateStr)) {
          matches.push(game);
        }
      });
      
      // Vérifier si c'est aujourd'hui
      const today = new Date();
      const isToday = i === today.getDate() && 
                      month === today.getMonth() && 
                      year === today.getFullYear();
      
      daysArray.push({
        day: i,
        isEmpty: false,
        matches: matches,
        isToday: isToday
      });
    }
    
    return daysArray;
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    // Rester dans l'année 2026
    if (newDate.getFullYear() === 2026) {
      setCurrentDate(newDate);
    }
  };

  const daysInMonth = generateDays();

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>‹</button>
        <span className="calendar-month">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>›</button>
      </div>
      <div className="calendar-days-header">
        {days.map((day, index) => (
          <div key={index} className="calendar-day-name">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {daysInMonth.map((item, index) => (
          <div 
            key={index} 
            className={`calendar-day ${item.isEmpty ? 'empty' : ''} ${item.isToday ? 'today' : ''} ${item.matches.length > 0 ? 'has-matches' : ''}`}
            title={item.matches.length > 0 ? item.matches.map(g => getGameAbbr(g)).join(' • ') : ''}
          >
            {item.day}
            {item.matches.length > 0 && (
              <div className="match-dots">
                {item.matches.map((game, idx) => (
                  <span 
                    key={idx} 
                    className="match-dot"
                    style={{ backgroundColor: getGameColor(game) }}
                  ></span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
