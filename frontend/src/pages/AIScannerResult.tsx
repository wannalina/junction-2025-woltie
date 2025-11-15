import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function AIAvatar() {
  return (
    <div className="w-6 h-6 rounded-full bg-[#00819C] flex items-center justify-center">
      <span className="text-white text-sm">🤖</span>
    </div>
  );
}

function UserAvatar() {
  return (
    <motion.div 
      className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
    >
      <span className="text-white text-sm">👤</span>
    </motion.div>
  );
}

function AIMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex gap-3 items-end w-full"
    >
      <AIAvatar />
      <div className="bg-[#07171c] rounded-3xl p-4 max-w-[280px]" style={{ border: '0.5px solid #00c1e8' }}>
        <p className="text-white text-sm mb-3">
          <span>I can see this is a delicious serving of </span>
          <span className="font-bold text-[#00c1e8]">Malai Kofta!</span>
          <span> This is a popular North Indian dish featuring soft dumplings made from paneer and potatoes, served in a rich, creamy tomato-based curry.</span>
        </p>
        
        <div className="bg-[#051216] rounded-xl p-3 mb-2">
          <p className="text-[#d7d7d7] text-[10px] mb-1">Main Ingredients</p>
          <p className="text-white text-xs font-bold">Paneer, Potato, Cream, Tomatoes, Spices</p>
        </div>

        <div className="bg-[#051216] rounded-xl p-3">
          <p className="text-[#d7d7d7] text-[10px] mb-1">Similar to:</p>
          <p className="text-white text-xs font-bold">It's somewhat similar to meatballs in gravy!</p>
        </div>
      </div>
    </motion.div>
  );
}

function UserMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-3 items-end justify-end w-full"
    >
      <div className="bg-[#001924] px-4 py-2 rounded-xl max-w-[200px]">
        <p className="text-[#00c1e8] text-sm font-medium text-right">
          Find locations near me
        </p>
      </div>
      <UserAvatar />
    </motion.div>
  );
}

function RestaurantCards() {
  const navigate = useNavigate();
  
  const restaurants = [
    {
      id: 'ravintola-nepal',
      name: 'Momo House Espoo',
      distance: '1.5km',
      price: '$',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop'
    },
    {
      id: 'ravintola-nepal',
      name: 'Ravintola Nepal',
      distance: '3km',
      price: '$$',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop'
    },
    {
      id: 'tokyo-sushi',
      name: 'Himali Flavours',
      distance: '3.5km',
      price: '$',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full pl-9"
    >
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {restaurants.map((restaurant, index) => (
          <motion.div 
            key={index}
            className="relative min-w-[100px] h-[120px] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index, type: "spring", stiffness: 100 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
          >
            <img 
              src={restaurant.image} 
              alt={restaurant.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-white text-xs font-bold mb-1 line-clamp-2">{restaurant.name}</p>
              <div className="flex items-center justify-between text-[10px] text-white">
                <span>{restaurant.distance}</span>
                <span>{restaurant.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="flex items-center gap-1 mt-2 cursor-pointer hover:opacity-80 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <p className="text-white text-[10px] underline">View on map</p>
      </motion.div>
    </motion.div>
  );
}

export function AIScannerResult() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<string[]>(['ai-message']);
  const [showButtons, setShowButtons] = useState(true);

  const handleFindLocations = () => {
    setShowButtons(false);
    setMessages(prev => [...prev, 'user-message']);
    
    setTimeout(() => {
      setMessages(prev => [...prev, 'restaurant-cards']);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center">
      <div className="w-full min-h-screen bg-black relative pb-24">
        
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-zinc-800">
          <div className="px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">AI Food Scanner</h1>
          </div>
        </div>

        {/* Messages Container */}
        <motion.div 
          className="px-5 py-6 flex flex-col gap-4"
          animate={{ 
            marginTop: messages.length === 1 ? '60px' : 
                       messages.length === 2 ? '20px' : 
                       '0px'
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence>
            {messages.includes('ai-message') && <AIMessage key="ai" />}
            {messages.includes('user-message') && <UserMessage key="user" />}
            {messages.includes('restaurant-cards') && <RestaurantCards key="cards" />}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <AnimatePresence>
          {showButtons && (
            <motion.div 
              className="px-5 flex gap-2 items-center mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.button 
                className="bg-[#001924] px-4 py-2 rounded-xl hover:bg-[#002a3a] transition-colors"
                onClick={handleFindLocations}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-[#00c1e8] text-sm font-medium whitespace-nowrap">
                  Find locations near me
                </p>
              </motion.button>

              <motion.button 
                className="bg-[#001924] px-4 py-2 rounded-xl hover:bg-[#002a3a] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-[#00c1e8] text-sm font-medium">
                  Learn more
                </p>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)]">
          <div className="relative">
            <input
              type="text"
              placeholder="Send message..."
              className="w-full bg-transparent border border-white rounded-full px-5 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#00c1e8]"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

