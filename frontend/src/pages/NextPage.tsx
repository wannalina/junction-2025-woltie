import { useState } from 'react';
import avatarIcon from '../assets/avatar.svg';
import woltyIcon from '../assets/wolty.svg';
import cloudIcon from '../assets/cloud.png';
import dumplingHouseImg from '../assets/dumping-house.png';
import supportIcon from '../assets/support.png';
import './NextPage.css';

export function NextPage() {
  const [message, setMessage] = useState('');

  const suggestions = [
    'Vegan Options near me',
    'Where to buy karjalanpiirakka',
    'Restaurants open in Helsinki'
  ];

  const recentSearches = [
    'Malai Kofta near me',
    'Best authentic pizza in Helsinki'
  ];

  return (
    <div className="chat-assistant-page">
      {/* 状态栏 */}
      <div className="status-bar">
        <div className="status-left">
          <div className="signal-bars">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <svg className="wifi-icon" width="20" height="16" viewBox="0 0 20 16" fill="white">
            <path d="M10 13c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4-2c1.11 0 2.12.45 2.83 1.17L10 13.34l1.17-1.17C11.88 11.45 12.89 11 14 11c1.11 0 2.12.45 2.83 1.17l-1.41 1.41C14.79 13.21 14.42 13 14 13s-.79.21-1.42.58L10 16.17l-2.58-2.59C6.79 13.21 6.42 13 6 13s-.79.21-1.42.58L3.17 12.17C3.88 11.45 4.89 11 6 11zm4-4c1.85 0 3.54.76 4.76 1.97L16.17 10l-1.41 1.41C13.54 10.21 11.85 9.5 10 9.5s-3.54.71-4.76 1.91L3.83 10 5.24 8.97C6.46 7.76 8.15 7 10 7zm0-4c2.76 0 5.26 1.12 7.07 2.93L18.49 7.34C16.37 5.23 13.33 4 10 4S3.63 5.23 1.51 7.34L3.93 9.93C5.74 8.12 8.24 7 10 7z"/>
          </svg>
        </div>
        <div className="status-right">
          <span className="battery-percentage">100%</span>
          <div className="battery-icon">
            <div className="battery-level"></div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="chat-content">
        {/* 头部问候 */}
        <div className="greeting-header">
          <h1 className="greeting-text">Hello, <span className="user-name">Peggy</span></h1>
          <img src={avatarIcon} alt="User Avatar" className="user-avatar" />
        </div>

        {/* 卡片网格 */}
        <div className="cards-grid">
          {/* 天气卡片 */}
          <div className="card weather-card">
            <div className="weather-header">
              <div className="temperature">2° C</div>
              <img src={cloudIcon} alt="Weather" className="weather-icon" />
            </div>
            <p className="weather-subtitle">Brrr! Warm up with...</p>
            <div className="restaurant-preview">
              <img src={dumplingHouseImg} alt="Dumpling House" className="restaurant-image" />
            </div>
          </div>

          {/* Rewards 卡片 */}
          <div className="card rewards-card">
            <div className="card-header">
              <h2 className="card-title">Rewards</h2>
              <img src={woltyIcon} alt="Wolty" className="wolty-mascot" />
            </div>
            <p className="card-subtitle">Find deals and steals with Juho</p>
          </div>

          {/* Support 卡片 */}
          <div className="card support-card">
            <div className="card-header">
              <h2 className="card-title">Support</h2>
              <img src={supportIcon} alt="Support" className="support-icon" />
            </div>
            <p className="card-subtitle">Get help</p>
          </div>
        </div>

        {/* 搜索建议 */}
        <div className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <button key={index} className="suggestion-item">
              <span className="suggestion-text">{suggestion}</span>
              <svg className="edit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
              </svg>
            </button>
          ))}
        </div>

        {/* 最近搜索 */}
        <div className="recent-section">
          <h3 className="recent-title">Recent</h3>
          <div className="recent-items">
            {recentSearches.map((search, index) => (
              <button key={index} className="recent-item">
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 底部输入框 */}
      <div className="message-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send message..."
          className="message-input"
        />
        <button className="voice-button" aria-label="Voice input">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

