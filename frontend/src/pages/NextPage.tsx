import { useState, useRef, useEffect } from 'react';
import avatarIcon from '../assets/avatar.svg';
import juhoIcon from '../assets/juho.svg';
import cloudIcon from '../assets/cloud.png';
import dumplingHouseImg from '../assets/dumping-house.png';
import supportIcon from '../assets/support.png';
import './NextPage.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function NextPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChatView, setShowChatView] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Vegan Options near me',
    'Where to buy karjalanpiirakka',
    'Restaurants open in Helsinki'
  ];

  const recentSearches = [
    'Malai Kofta near me',
    'Best authentic pizza in Helsinki'
  ];

  // 滚动到底部的函数
  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTo({
        top: chatContentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // 当消息更新或正在输入状态改变时滚动到底部
  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  // 模拟AI回复
  const getAIResponse = (userMessage: string): string => {
    const responses = [
      "That sounds like karjalanpiirakka! It's a traditional Finnish pastry with rice filling. Would you like me to find places nearby where you can buy it?",
      "Based on your description, I believe you're looking for karjalanpiirakka (Karelian pastries). They're delicious! Let me help you find some.",
      "I'd be happy to help! That oval-shaped pastry with creamy rice filling is a Finnish specialty. Shall I search for bakeries near you?",
      "Sounds delicious! For restaurant recommendations in Helsinki, I can show you the top-rated options. What type of cuisine are you interested in?",
      "I found several great vegan options near your location. Would you like me to show you the closest ones?"
    ];
    
    // 简单的关键词匹配
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('karjalan') || lowerMessage.includes('finnish') || lowerMessage.includes('pastry')) {
      return responses[0];
    } else if (lowerMessage.includes('restaurant') || lowerMessage.includes('helsinki')) {
      return responses[3];
    } else if (lowerMessage.includes('vegan')) {
      return responses[4];
    }
    
    // 默认随机回复
    return responses[Math.floor(Math.random() * 3)];
  };

  // 发送消息
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      };
      
      const currentMessage = message;
      setMessages([...messages, userMessage]);
      setMessage('');
      setShowChatView(true);
      
      // 显示"正在输入"动画
      setIsTyping(true);
      
      // 1秒后显示AI回复
      setTimeout(() => {
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: getAIResponse(currentMessage),
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className={`chat-assistant-page ${showChatView ? 'chat-view' : ''}`}>
      {/* 主内容区 */}
      <div className="chat-content" ref={chatContentRef}>
        {showChatView ? (
          /* 聊天视图 */
          <>
            {/* 聊天头部 */}
            <div className="chat-header">
              <button className="back-button" onClick={() => setShowChatView(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <img src={juhoIcon} alt="Juho" className="chat-avatar" />
              <div className="chat-info">
                <h2 className="chat-name">Juho</h2>
                <p className="chat-subtitle">Your AI Companion</p>
              </div>
              <button className="menu-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="5" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="12" cy="19" r="2"/>
                </svg>
              </button>
            </div>

            {/* 消息列表 */}
            <div className="messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                  {msg.sender === 'ai' && (
                    <img src={juhoIcon} alt="Juho" className="message-avatar ai-avatar" />
                  )}
                  <div className="message-content">
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <img src={avatarIcon} alt="User" className="message-avatar" />
                  )}
                </div>
              ))}
              
              {/* 正在输入指示器 */}
              {isTyping && (
                <div className="message-bubble ai typing-indicator">
                  <img src={juhoIcon} alt="Juho" className="message-avatar ai-avatar" />
                  <div className="typing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* 主页视图 */
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
        )}
      </div>

      {/* 底部输入框 */}
      <div className="message-input-container">
        {/* 操作按钮 */}
        {showChatView && messages.length > 0 && (
          <div className="action-buttons">
            <button className="action-button">
              Find locations near me
            </button>
            <button className="action-button">
              Learn more
            </button>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} style={{ width: '100%', position: 'relative' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
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
  );
}

