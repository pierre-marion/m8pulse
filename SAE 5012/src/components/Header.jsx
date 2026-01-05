import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [activeTab, setActiveTab] = useState('JOUEURS');
  const tabs = ['JOUEURS', '', '', '', ''];

  return (
    <div className="header">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`nav-item ${tab === activeTab ? 'active' : ''}`}
          onClick={() => tab && setActiveTab(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default Header;
