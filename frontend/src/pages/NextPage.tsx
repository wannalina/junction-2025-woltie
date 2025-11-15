import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarIcon from '../assets/avatar.svg';
import juhoIcon from '../assets/juho.svg';
import cloudIcon from '../assets/cloud.png';
import dumplingHouseImg from '../assets/dumping-house.png';
import supportIcon from '../assets/support.png';
import './NextPage.css';

interface NextPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NextPage({ isOpen, onClose }: NextPageProps) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);

  // 处理关闭动画
  const handleClose = () => {
    setIsClosing(true);
    // 等待动画完成后再真正关闭
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // 动画持续时间
  };

  // 当抽屉关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      setMessage('');
      setIsFocused(false);
    }
  }, [isOpen]);

  const suggestions = [
    'Vegan Options near me',
    'Where to buy karjalanpiirakka',
    'Restaurants open in Helsinki'
  ];

  const recentSearches = [
    'Malai Kofta near me',
    'Best authentic pizza in Helsinki'
  ];


  // 发送消息 - 展开动画后导航到全屏聊天页面
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const currentMessage = message;
      // 触发展开动画
      setIsExpanding(true);
      // 等待展开动画完成后导航
      setTimeout(() => {
        navigate('/chat', { state: { initialMessage: currentMessage } });
      }, 800); // 等待展开动画完成（800ms）
    }
  };

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div className={`drawer-backdrop ${isClosing ? 'closing' : ''} ${isExpanding ? 'expanding' : ''}`} onClick={handleClose} />
      
      {/* 抽屉内容 */}
      <div className={`chat-assistant-page drawer ${isClosing ? 'closing' : ''} ${isExpanding ? 'expanding' : ''} ${isFocused ? 'input-focused' : ''}`}>
        {/* 抽屉顶部把手 */}
        <div className="drawer-header">
          <div className="drawer-handle" />
          <button className="drawer-close-button" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* 主内容区 */}
        <div className={`chat-content ${isFocused ? 'focused' : ''}`} ref={chatContentRef}>
          {/* 主页视图 */}
          <>
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
              <img src={juhoIcon} alt="Juho" className="juho-mascot" />
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
          </>
        </div>

        {/* 底部输入框 */}
        <div className="message-input-container">
          <form onSubmit={handleSendMessage} style={{ width: '100%', position: 'relative' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              if (!message.trim()) {
                setIsFocused(false);
              }
            }}
            placeholder="Send message..."
            className="message-input"
          />
          <button type="button" className="voice-button" aria-label="Voice input">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
        </form>
      </div>
      </div>
    </>
  );
}

