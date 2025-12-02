import React from 'react';
import './Calendar.css';

function Calendar() {
  const days = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
  
  // Novembre 2025 - génération des jours
  const generateDays = () => {
    const daysInMonth = [];
    // Novembre 2025 commence un samedi (jour 6)
    // Ajouter des jours vides pour l'alignement
    for (let i = 0; i < 5; i++) {
      daysInMonth.push({ day: null, isEmpty: true });
    }
    // Ajouter les jours du mois (1-30)
    for (let i = 1; i <= 30; i++) {
      daysInMonth.push({ 
        day: i, 
        isEmpty: false,
        isHighlighted: i === 1 || i === 2, // Exemple: 1er et 2 décembre
        isToday: i === 29 || i === 30 // Exemple: dates rouges
      });
    }
    return daysInMonth;
  };

  const daysInMonth = generateDays();

  return (
    <div className="calendar">
      <div className="calendar-header">
        <span className="calendar-month">NOVEMBRE</span>
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
            className={`calendar-day ${item.isEmpty ? 'empty' : ''} ${item.isHighlighted ? 'highlighted' : ''} ${item.isToday ? 'today' : ''}`}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
