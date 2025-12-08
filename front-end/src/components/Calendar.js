import React, { useState } from 'react';
import './Calendar.css';

function Calendar({ currentGame }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  // Données des matchs par jeu (format: jour/mois)
  const matchDates = {
    'Valorant': ['28/11', '25/11', '22/11', '19/11', '15/11', '01/12', '05/12'],
    'Counter Strike': ['27/11', '24/11', '21/11', '18/11', '14/11', '03/12', '08/12'],
    'Call of Duty': ['26/11', '23/11', '20/11', '17/11', '13/11', '02/12', '07/12'],
    'Fortnite': ['29/11', '26/11', '23/11', '20/11', '16/11', '04/12', '09/12']
  };

  const getGameColor = () => {
    switch(currentGame) {
      case 'Valorant': return '#FF4655';
      case 'Counter Strike': return '#FF9F1C';
      case 'Call of Duty': return '#8A2BE2';
      case 'Fortnite': return '#00AEEF';
      default: return '#7D3CFF';
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
      daysArray.push({ day: null, isEmpty: true });
    }
    
    // Ajouter les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${i.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}`;
      const hasMatch = matchDates[currentGame]?.includes(dateStr) || false;
      
      // Vérifier si c'est aujourd'hui
      const today = new Date();
      const isToday = i === today.getDate() && 
                      month === today.getMonth() && 
                      year === today.getFullYear();
      
      daysArray.push({
        day: i,
        isEmpty: false,
        hasMatch: hasMatch,
        isToday: isToday
      });
    }
    
    return daysArray;
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
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
            className={`calendar-day ${item.isEmpty ? 'empty' : ''} ${item.isToday ? 'today' : ''} ${item.hasMatch ? 'has-match' : ''}`}
            style={item.hasMatch ? { borderColor: getGameColor() } : {}}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
