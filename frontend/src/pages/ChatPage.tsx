import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import avatarIcon from '../assets/avatar.svg';
import juhoIcon from '../assets/juho.svg';
import dumplingHouseImg from '../assets/dumping-house.png';
import breadImg from '../assets/bread.png';
import { apiService, ApiError } from '../services';
import './ChatPage.css';

interface Message {
  id: number;
  text?: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'image';
  imageUrl?: string;
}

export function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMessage = location.state?.initialMessage as string | undefined;
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

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

  // 处理初始消息
  useEffect(() => {
    if (initialMessage && !hasInitialized.current) {
      hasInitialized.current = true;
      
      const userMessage: Message = {
        id: Date.now(),
        text: initialMessage,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages([userMessage]);
      setIsTyping(true);
      
      // 异步处理AI回复
      (async () => {
        try {
          const aiResponse = await getAIResponse(initialMessage);
          const aiMessage: Message = {
            id: Date.now() + 1,
            ...aiResponse,
            sender: 'ai',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error getting AI response:', error);
          // 显示错误消息
          const errorMessage: Message = {
            id: Date.now() + 1,
            type: 'text',
            text: 'Sorry, I encountered an error. Please try again.',
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsTyping(false);
        }
      })();
    }
  }, [initialMessage]);

  // AI回复（支持API调用）
  const getAIResponse = async (userMessage: string): Promise<Omit<Message, 'id' | 'sender' | 'timestamp'>> => {
    const lowerMessage = userMessage.toLowerCase();
    console.log('🔍 Lower message:', lowerMessage);

    // 如果包含 "remember" 或 "help" 关键词，调用 dish recognition API
    if (lowerMessage.includes('remember') || lowerMessage.includes('help')) {
      try {
        console.log('🔍 Calling dish recognition API...');
        const result = await apiService.recognizeDish({
          description: userMessage,
          location: 'Helsinki' // 可以根据实际情况获取用户位置
        });
        
        console.log('✅ Dish recognition result:', result);
        
        // 构建回复文本
        let responseText = '';
        
        // 根据触发词选择开场白
        if (lowerMessage.includes('remember')) {
          responseText = `I remember! You're thinking of **${result.dish_name}**. `;
        } else if (lowerMessage.includes('help')) {
          responseText = `I can help! That sounds like **${result.dish_name}**. `;
        } else {
          responseText = `That's **${result.dish_name}**! `;
        }
        
        if (result.dish_description) {
          responseText += `${result.dish_description}\n\n`;
        }
        
        if (result.confidence !== undefined) {
          responseText += `(${(result.confidence * 100).toFixed(0)}% confident)\n\n`;
        }
        
        if (result.restaurants && result.restaurants.length > 0) {
          responseText += `Here are some places where you can find it:\n`;
          result.restaurants.slice(0, 3).forEach((restaurant, index) => {
            responseText += `\n${index + 1}. **${restaurant.name}**`;
            if (restaurant.distance) {
              responseText += ` - ${restaurant.distance}`;
            }
            if (restaurant.address) {
              responseText += `\n   ${restaurant.address}`;
            }
          });
        }
        
        return {
          type: 'text',
          text: responseText
        };
      } catch (error) {
        console.error('❌ Dish recognition error:', error);
        
        // 根据触发词选择错误提示
        let errorText = '';
        if (lowerMessage.includes('remember')) {
          errorText = "I'm trying to remember, but I'm having trouble connecting to my memory. ";
        } else if (lowerMessage.includes('help')) {
          errorText = "I'd love to help, but I'm having trouble accessing the information right now. ";
        } else {
          errorText = "I'm having trouble processing your request. ";
        }
        
        if (error instanceof ApiError) {
          if (error.statusCode === 400) {
            errorText += "Could you describe the dish in more detail?";
          } else if (error.statusCode === 500) {
            errorText += "My systems are experiencing some issues. Please try again in a moment.";
          } else if (error.statusCode === 408) {
            errorText += "The request is taking too long. Please try again.";
          } else {
            errorText += "Please try again.";
          }
        } else {
          errorText += "Please check your connection and try again.";
        }
        
        return {
          type: 'text',
          text: errorText
        };
      }
    }
    
    // 如果询问位置、地图或附近，返回图片
    if (lowerMessage.includes('near') || lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('map')) {
      return {
        type: 'image',
        text: "Here are some locations near you:",
        imageUrl: dumplingHouseImg
      };
    }
    
    // 文本回复
    const responses = [
      "That sounds like karjalanpiirakka! It's a traditional Finnish pastry with rice filling. Would you like me to find places nearby where you can buy it?",
      "Based on your description, I believe you're looking for karjalanpiirakka (Karelian pastries). They're delicious! Let me help you find some.",
      "I'd be happy to help! That oval-shaped pastry with creamy rice filling is a Finnish specialty. Shall I search for bakeries near you?",
      "Sounds delicious! For restaurant recommendations in Helsinki, I can show you the top-rated options. What type of cuisine are you interested in?",
      "I found several great vegan options near your location. Would you like me to show you the closest ones?"
    ];
    
    let responseText: string;
    if (lowerMessage.includes('karjalan') || lowerMessage.includes('finnish') || lowerMessage.includes('pastry')) {
      responseText = responses[0];
    } else if (lowerMessage.includes('restaurant') || lowerMessage.includes('helsinki')) {
      responseText = responses[3];
    } else if (lowerMessage.includes('vegan')) {
      responseText = responses[4];
    } else {
      responseText = responses[Math.floor(Math.random() * 3)];
    }
    
    return {
      type: 'text',
      text: responseText
    };
  };

  // 发送消息
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };
      
      const currentMessage = message;
      setMessages([...messages, userMessage]);
      setMessage('');
      
      // 显示"正在输入"动画
      setIsTyping(true);
      
      // 异步处理AI回复
      (async () => {
        try {
          const aiResponse = await getAIResponse(currentMessage);
          const aiMessage: Message = {
            id: Date.now() + 1,
            ...aiResponse,
            sender: 'ai',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
          console.error('Error getting AI response:', error);
          // 显示错误消息
          const errorMessage: Message = {
            id: Date.now() + 1,
            type: 'text',
            text: 'Sorry, I encountered an error. Please try again.',
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsTyping(false);
        }
      })();
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
    <div className="chat-page">
      {/* 聊天头部 */}
      <div className="chat-page-header">
        <button className="back-button" onClick={() => navigate('/')}>
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
      <div className="chat-page-content" ref={chatContentRef}>
        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender} ${msg.type === 'image' ? 'image-message' : ''}`}>
              {msg.sender === 'ai' && (
                <img src={juhoIcon} alt="Juho" className="message-avatar ai-avatar" />
              )}
              {msg.type === 'text' ? (
                <div className="message-content">
                  {msg.text}
                </div>
              ) : (
                <div className="message-content image-content">
                  {msg.text && <div className="image-message-text">{msg.text}</div>}
                  {msg.imageUrl && (
                    <img 
                      src={msg.imageUrl} 
                      alt="Message image" 
                      className="message-image"
                    />
                  )}
                </div>
              )}
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
      </div>

      {/* 底部输入框 */}
      <div className="message-input-container">
        {/* 操作按钮 */}
        {messages.length > 0 && (
          <div className="action-buttons">
            <button 
              className="action-button"
              onClick={() => {
                setIsTyping(true);
                setTimeout(() => {
                  const aiMessage: Message = {
                    id: Date.now(),
                    type: 'image',
                    text: "Here are some locations near you:",
                    imageUrl: dumplingHouseImg,
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, aiMessage]);
                  setIsTyping(false);
                }, 1000);
              }}
            >
              Find locations near me
            </button>
            <button 
              className="action-button"
              onClick={() => {
                setIsTyping(true);
                setTimeout(() => {
                  const aiMessage: Message = {
                    id: Date.now(),
                    type: 'image',
                    text: "Karjalanpiirakka is a traditional Finnish pastry filled with rice porridge. It's a beloved national dish, typically served with egg butter (munavoi). These oval-shaped pastries have a thin rye crust and are perfect for breakfast or as a snack!",
                    imageUrl: breadImg,
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, aiMessage]);
                  setIsTyping(false);
                }, 1000);
              }}
            >
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

