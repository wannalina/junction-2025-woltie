import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import avatarIcon from '../assets/avatar.svg';
import juhoIcon from '../assets/juho.svg';
import dumplingHouseImg from '../assets/dumping-house.png';
import breadImg from '../assets/bread.png';
import bake1Img from '../assets/bake1.jpeg';
import bake2Img from '../assets/bake2.jpeg';
import bake3Img from '../assets/bake3.jpeg';
import dishImg from '../assets/dish.jpeg';
import chinaImg from '../assets/china.jpg';
import { apiService, ApiError } from '../services';
import { FormattedText } from '../components/FormattedText';
import './ChatPage.css';

interface Message {
  id: number;
  text?: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'image' | 'dish-card';
  imageUrl?: string;
  dishData?: any; // 用于存储菜品分析数据
}

export function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMessage = location.state?.initialMessage as string | undefined;
  const analysisData = location.state?.analysisData;
  
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

  // 处理从 restaurant 页面跳转过来的菜品分析
  useEffect(() => {
    if (analysisData && !hasInitialized.current) {
      hasInitialized.current = true;
      setIsTyping(true);
      
      // 处理菜品分析数据
      handleDishAnalysis(analysisData);
    }
  }, [analysisData]);

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
      handleApiResponse(initialMessage);
    }
  }, [initialMessage]);

  // 处理菜品分析数据（从 restaurant 页面跳转过来）
  const handleDishAnalysis = async (data: any) => {
    try {
      // 发送菜品卡片消息
      const message: Message = {
        id: Date.now(),
        type: 'dish-card',
        sender: 'ai',
        timestamp: new Date(),
        dishData: data
      };
      
      setMessages([message]);
      setIsTyping(false);
      
      // 1.5秒后发送 Ingredient Origins (食材来源 - 第二条消息)
      if (data.ingredient_origins) {
        setTimeout(() => {
          setIsTyping(true);
          
          setTimeout(() => {
            const originsMessage: Message = {
              id: Date.now() + 1,
              type: 'image',
              text: `🌍 **Where does it come from?**\n\n${data.ingredient_origins}`,
              imageUrl: chinaImg,
              sender: 'ai',
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, originsMessage]);
            setIsTyping(false);
            
            // 1.5秒后发送历史背景
            if (data.historical_background) {
              setTimeout(() => {
                setIsTyping(true);
                
                setTimeout(() => {
                  const historyMessage: Message = {
                    id: Date.now() + 2,
                    type: 'text',
                    text: `📜 **A bit of history...**\n\n${data.historical_background}`,
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  
                  setMessages(prev => [...prev, historyMessage]);
                  setIsTyping(false);
                  
                  // 1.5秒后发送 Fun Facts
                  if (data.fun_facts && data.fun_facts.length > 0) {
                    setTimeout(() => {
                      setIsTyping(true);
                      
                      setTimeout(() => {
                        let funFactsText = '💡 **Want to hear some fun facts?**\n\n';
                        data.fun_facts.forEach((fact: string, index: number) => {
                          funFactsText += `${index + 1}. ${fact}\n\n`;
                        });
                        
                        const funFactsMessage: Message = {
                          id: Date.now() + 3,
                          type: 'text',
                          text: funFactsText,
                          sender: 'ai',
                          timestamp: new Date()
                        };
                        
                        setMessages(prev => [...prev, funFactsMessage]);
                        setIsTyping(false);
                      }, 1000);
                    }, 1500);
                  }
                }, 1000);
              }, 1500);
            }
          }, 1000);
        }, 1500);
      }
      
    } catch (error) {
      console.error('❌ Error displaying dish analysis:', error);
      
      const errorMessage: Message = {
        id: Date.now(),
        type: 'text',
        text: "I received the analysis, but I'm having trouble displaying it. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages([errorMessage]);
      setIsTyping(false);
    }
  };

  // 处理 API 响应并分步发送消息
  const handleApiResponse = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // 检查是否需要调用 API
    if (lowerMessage.includes('remember') || lowerMessage.includes('help')) {
      try {
        const result = await apiService.recognizeDish({
          description: userMessage,
          location: 'Helsinki'
        });
        
        console.log('✅ Dish recognition result:', result);
        
        // 第一条消息：菜品名称和描述
        let firstMessage = '';
        if (lowerMessage.includes('remember')) {
          firstMessage = `I remember! You're thinking of **${result.dish_name}**. `;
        } else if (lowerMessage.includes('help')) {
          firstMessage = `I can help! That sounds like **${result.dish_name}**. `;
        } else {
          firstMessage = `That's **${result.dish_name}**! `;
        }
        
        if (result.dish_description) {
          firstMessage += `${result.dish_description}`;
        }
        
        const message1: Message = {
          id: Date.now(),
          type: 'text',
          text: firstMessage,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, message1]);
        
        // 1.5秒后发送第二条消息：图片
        setTimeout(() => {
          setIsTyping(true);
          
          setTimeout(() => {
            const message2: Message = {
              id: Date.now() + 1,
              type: 'image',
              text: `Here's what **${result.dish_name}** looks like:`,
              imageUrl: breadImg,
              sender: 'ai',
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, message2]);
            
            // 1.5秒后发送第三条消息：餐厅推荐引导
            setTimeout(() => {
              setIsTyping(true);
              
              setTimeout(() => {
                if (result.restaurants && result.restaurants.length > 0) {
                  // 先发送引导消息
                  const introMessage: Message = {
                    id: Date.now() + 2,
                    type: 'text',
                    text: `Here are some great places to try it:`,
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, introMessage]);
                  
                  // 餐厅图片数组
                  const restaurantImages = [bake1Img, bake2Img, bake3Img];
                  
                  // 依次发送每个餐厅的信息
                  const sendRestaurantMessages = (index: number) => {
                    if (index >= Math.min(result.restaurants.length, 3)) {
                      setIsTyping(false);
                      return;
                    }
                    
                    setTimeout(() => {
                      setIsTyping(true);
                      
                      setTimeout(() => {
                        const restaurant = result.restaurants[index];
                        let restaurantText = `**${index + 1}. ${restaurant.name}**\n`;
                        
                        if (restaurant.description) {
                          restaurantText += `${restaurant.description}\n`;
                        }
                        
                        if (restaurant.address) {
                          restaurantText += `📍 ${restaurant.address}`;
                        }
                        
                        const restaurantMessage: Message = {
                          id: Date.now() + 3 + index,
                          type: 'image',
                          text: restaurantText,
                          imageUrl: restaurantImages[index],
                          sender: 'ai',
                          timestamp: new Date()
                        };
                        
                        setMessages(prev => [...prev, restaurantMessage]);
                        setIsTyping(false);
                        
                        // 继续发送下一个餐厅
                        sendRestaurantMessages(index + 1);
                      }, 1000);
                    }, 1500);
                  };
                  
                  // 开始发送第一个餐厅
                  setIsTyping(false);
                  sendRestaurantMessages(0);
                } else {
                  const noRestaurantMessage: Message = {
                    id: Date.now() + 2,
                    type: 'text',
                    text: "I couldn't find any restaurants nearby at the moment.",
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, noRestaurantMessage]);
                  setIsTyping(false);
                }
              }, 1000);
            }, 1500);
            
            setIsTyping(false);
          }, 1000);
        }, 1500);
        
        setIsTyping(false);
        
      } catch (error) {
        console.error('❌ Dish recognition error:', error);
        
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
        
        const errorMessage: Message = {
          id: Date.now(),
          type: 'text',
          text: errorText,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }
    } else {
      // 非 API 调用的普通回复
      try {
        const response = await getAIResponse(userMessage);
        if (response) {
          const aiMessage: Message = {
            id: Date.now(),
            ...response,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  // AI回复（非API调用的普通回复）
  const getAIResponse = async (userMessage: string): Promise<Omit<Message, 'id' | 'sender' | 'timestamp'>> => {
    const lowerMessage = userMessage.toLowerCase();
    
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
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      
      // 显示"正在输入"动画
      setIsTyping(true);
      
      // 处理 API 响应
      handleApiResponse(currentMessage);
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
                  {msg.text && <FormattedText text={msg.text} />}
                </div>
              ) : msg.type === 'dish-card' && msg.dishData ? (
                <div className="message-content dish-card-content">
                  {/* 菜品名称 */}
                  {msg.dishData.dish_name && (
                    <div style={{ 
                      marginBottom: '12px',
                      fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#FFF'
                    }}>
                      {msg.dishData.dish_name}
                    </div>
                  )}
                  
                  {/* 菜品图片 */}
                  <div style={{ marginBottom: '12px' }}>
                    <img 
                      src={dishImg} 
                      alt={msg.dishData.dish_name || 'Dish'} 
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  
                  {/* 菜品描述 */}
                  {msg.dishData.dish_description && (
                    <div style={{ marginBottom: '12px' }}>
                      <FormattedText 
                        text={`A dish featuring ${msg.dishData.dish_description.replace(
                          /\b(chicken|Chicken)\b/gi,
                          '**$1**'
                        )}`}
                      />
                    </div>
                  )}
                  
                  {/* Main Ingredients 框 */}
                  {msg.dishData.ingredients && msg.dishData.ingredients.length > 0 && (
                    <div style={{
                      backgroundColor: '#051216',
                      borderRadius: '12px',
                      padding: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ 
                        fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: '12px',
                        color: '#D7D7D7',
                        marginBottom: '6px'
                      }}>
                        Main Ingredients
                      </div>
                      <div style={{ 
                        color: '#FFF',
                        fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: 'normal',
                        letterSpacing: '0.12px'
                      }}>
                        {msg.dishData.ingredients.join(', ')}
                      </div>
                    </div>
                  )}
                  
                  {/* Similar to 框 */}
                  {msg.dishData.similar_dishes && msg.dishData.similar_dishes.length > 0 && (
                    <div style={{
                      backgroundColor: '#051216',
                      borderRadius: '12px',
                      padding: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ 
                        fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: '12px',
                        color: '#D7D7D7',
                        marginBottom: '6px'
                      }}>
                        Similar to:
                      </div>
                      <div style={{ 
                        color: '#FFF',
                        fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: 'normal',
                        letterSpacing: '0.12px'
                      }}>
                        It's similar to {msg.dishData.similar_dishes[0].dish_name}!
                      </div>
                    </div>
                  )}
                  
                  {/* 过敏原警告 */}
                  {msg.dishData.allergens && msg.dishData.allergens.length > 0 && (
                    <div style={{
                      color: '#FFF',
                      fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '12px',
                      fontStyle: 'italic',
                      fontWeight: 700,
                      lineHeight: 'normal',
                      letterSpacing: '0.12px'
                    }}>
                      <span style={{ color: '#00C1E8' }}>!</span> This contains {msg.dishData.allergens.join(' and ').toLowerCase()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="message-content image-content">
                  {msg.text && (
                    <div className="image-message-text">
                      <FormattedText text={msg.text} />
                    </div>
                  )}
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

