import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Search, Plus, Minus, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { CartoonFloatButton } from '../components/CartoonFloatButton';
import { ScanningAnimation } from '../components/ScanningAnimation';

export function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedOption, setSelectedOption] = useState('full');
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef<number | null>(null);

  // Mock data - in a real app, you would fetch this from an API based on the id
  const restaurantData: Record<string, any> = {
    'kund-food-panda': {
      name: 'Kund Food Panda Entresse',
      description: 'Authentic Asian cuisine',
      price: '€1.99',
      time: '20-30 min',
      rating: '8.2',
      image: '/kung-food-panda.jpeg',
      fullDescription: 'Experience authentic Asian flavors with our carefully crafted dishes. Fresh ingredients and traditional cooking methods.',
      address: 'Entresse Shopping Center, Espoo',
      phone: '+358 40 123 4567',
    },
    'ravintola-nepal': {
      name: 'Ravintola Nepal',
      description: 'Real taste from Himalaya',
      price: '€1.99',
      time: '15-25 min',
      rating: '9.0',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=300&fit=crop',
      fullDescription: 'Authentic Nepalese cuisine bringing the taste of Himalaya to Helsinki. Traditional spices and cooking methods.',
      address: '456 Nepal Street, Helsinki',
      phone: '+358 40 987 6543',
    },
    'tokyo-sushi': {
      name: 'Tokyo Sushi Bar',
      description: 'Authentic Japanese sushi & ramen',
      price: '€2.49',
      time: '25-35 min',
      rating: '8.8',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop',
      fullDescription: 'Fresh sushi and authentic Japanese cuisine prepared by experienced chefs. Premium ingredients imported directly from Japan.',
      address: '789 Sushi Street, Helsinki',
      phone: '+358 40 111 2222',
    },
    'golden-dragon': {
      name: 'Golden Dragon',
      description: 'Traditional Chinese cuisine',
      price: '€1.99',
      time: '30-40 min',
      rating: '8.5',
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&h=300&fit=crop',
      fullDescription: 'Authentic Chinese restaurant offering traditional dishes from different regions of China. Family recipes passed down through generations.',
      address: '321 Dragon Avenue, Helsinki',
      phone: '+358 40 333 4444',
    },
    'burger-house': {
      name: 'American Burger House',
      description: 'Classic American burgers & fries',
      price: '€2.99',
      time: '15-20 min',
      rating: '9.2',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=300&fit=crop',
      fullDescription: 'Premium American-style burgers made with 100% beef patties. Crispy fries and classic milkshakes to complete your meal.',
      address: '555 Burger Boulevard, Helsinki',
      phone: '+358 40 555 6666',
    },
    'pizza-palace': {
      name: 'Pizza Palace Helsinki',
      description: 'Italian pizza & pasta',
      price: '€2.49',
      time: '25-30 min',
      rating: '9.1',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop',
      fullDescription: 'Authentic Italian pizzas baked in a traditional wood-fired oven. Fresh ingredients and homemade pasta daily.',
      address: '123 Pizza Street, Helsinki',
      phone: '+358 40 777 8888',
    },
    'veggie-delight': {
      name: 'Veggie Delight',
      description: 'Healthy vegan & vegetarian',
      price: '€1.79',
      time: '20-25 min',
      rating: '8.9',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
      fullDescription: 'Plant-based paradise offering delicious vegan and vegetarian dishes. Organic ingredients and sustainable practices.',
      address: '789 Green Avenue, Helsinki',
      phone: '+358 40 999 0000',
    },
    'mediterranean-grill': {
      name: 'Mediterranean Grill',
      description: 'Greek & Turkish specialties',
      price: '€2.29',
      time: '30-35 min',
      rating: '8.7',
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&h=300&fit=crop',
      fullDescription: 'Experience the flavors of the Mediterranean with our grilled meats, fresh salads, and traditional mezze.',
      address: '456 Mediterranean Way, Helsinki',
      phone: '+358 40 111 3333',
    },
    'thai-house': {
      name: 'Thai House Espoo',
      description: 'Authentic Thai cuisine',
      price: '€1.99',
      time: '25-30 min',
      rating: '9.3',
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500&h=300&fit=crop',
      fullDescription: 'Traditional Thai flavors with perfectly balanced sweet, sour, salty, and spicy notes. Chef-prepared with imported spices.',
      address: '321 Thai Street, Espoo',
      phone: '+358 40 222 4444',
    },
    'seoul-kitchen': {
      name: 'Seoul Kitchen',
      description: 'Korean BBQ & kimchi',
      price: '€2.99',
      time: '35-40 min',
      rating: '8.6',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&h=300&fit=crop',
      fullDescription: 'Authentic Korean cuisine featuring BBQ, bibimbap, and traditional banchan. Family recipes from Seoul.',
      address: '654 Korean Avenue, Helsinki',
      phone: '+358 40 333 5555',
    },
  };

  const restaurant = restaurantData[id || ''];

  const mostOrderedItems = [
    {
      id: 1,
      name: 'Zhong Quan-kanaa',
      image: '/dish.jpeg',
      price: 15.90,
      description: 'kana, suola, sokeri, sambal chili, soja kastike, inkivääri, Perunajauhe.',
      shortDescription: 'kana, suola ,sokeri, sambal chili, soja kastike, inkivääri , Perunajauhe.',
      ingredients: 'Chicken, Salt, Sugar, Sambal Chili, soya sauce, Ginger, Potato flour'
    },
    {
      id: 2,
      name: 'Crispy chili -kanaa 🌶 (G)',
      image: '/chicken.jpeg',
      price: 16.90,
      description: 'Marinoidut kana palat kermainen tomaatti kastike, intialaiset mausteet.',
      shortDescription: 'Friteerattua kanaa, sweet chili- kastiketta',
      ingredients: 'Chicken, Yogurt, Tomato, Cream, Garam Masala, Cumin, Coriander'
    }
  ];

  const handleItemClick = (item: any) => {
    // Scroll to top to show search bar
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedItem(item);
    setQuantity(1);
    setSelectedOption('full');
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setQuantity(1);
    setSelectedOption('full');
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Added ${quantity} x ${selectedItem.name} to cart`);
    handleCloseModal();
  };

  const handleLongPressStart = () => {
    setIsPressed(true);
    longPressTimer.current = window.setTimeout(() => {
      setIsScanning(true);
      // Navigate to AI scanner after 3 seconds of scanning
      setTimeout(() => {
        navigate('/ai-scanner');
        setIsScanning(false);
        setIsPressed(false);
      }, 3000);
    }, 500); // Long press duration
  };

  const handleLongPressEnd = () => {
    setIsPressed(false);
    if (longPressTimer.current && !isScanning) {
      clearTimeout(longPressTimer.current);
    }
  };

  if (!restaurant) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-cyan-400 text-black rounded-full font-medium hover:bg-cyan-500 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center relative">
      {/* Main content with conditional blur when scanning in modal */}
      <div className={`w-full min-h-screen bg-black relative pb-24 transition-all duration-300 ${selectedItem && isScanning ? 'blur-sm' : ''}`}>
        
        {/* Hero Image with Search Bar */}
        <div className="relative h-[200px]">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-3 flex items-center gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-full bg-zinc-900/90 backdrop-blur flex items-center justify-center hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="flex-1 bg-zinc-800/90 backdrop-blur rounded-full px-3.5 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Search</span>
            </div>
            
            <button className="w-9 h-9 rounded-full bg-zinc-900/90 backdrop-blur flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Restaurant Info Section */}
        <div className="bg-black px-4 py-4 rounded-t-[32px] -mt-10 relative z-10">
          <h1 className="text-xl font-bold mb-2 text-center">{restaurant.name}</h1>
          
          {/* Rating and Status */}
          <div className="flex items-center justify-center gap-2 text-xs mb-2">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                <path d="M7 9C7 9 8 7 9.5 7C11 7 12 9 12 9C12 9 13 7 14.5 7C16 7 17 9 17 9" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7 15C7 15 9 17 12 17C15 17 17 15 17 15" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-white font-medium">{restaurant.rating}</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">Closed</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">Opens at 11:00 tomorrow</span>
          </div>
          
          {/* Min Order and Delivery Fee */}
          <div className="flex items-center justify-center gap-2 text-[11px] mb-3">
            <span className="text-gray-400">Min. order €10.00</span>
            <span className="text-gray-500">•</span>
            <span className="flex items-center gap-1">
              <span>🚴</span>
              <span className="text-cyan-400 font-medium">{restaurant.price}</span>
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-cyan-400 font-medium">More</span>
          </div>

          {/* Schedule Order Button with Action Buttons */}
          <div className="flex items-center gap-2 mb-3">
            <button className="flex-1 border-2 border-cyan-400 text-cyan-400 py-2.5 rounded-xl font-medium bg-black hover:bg-cyan-400/10 transition-colors flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule order
            </button>
            
            <button className="w-11 h-11 rounded-xl bg-cyan-950 flex items-center justify-center hover:bg-cyan-900 transition-colors text-cyan-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            <button className="w-11 h-11 rounded-xl bg-cyan-950 flex items-center justify-center hover:bg-cyan-900 transition-colors text-cyan-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {/* Promotion Card */}
          <div className="bg-gradient-to-r from-orange-900/40 to-orange-800/40 rounded-xl p-3 mb-5 border border-orange-700/30">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
                🎯
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-xs mb-0.5">
                  Place 2 restaurant orders above 16 €
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 font-bold text-xs">+200</span>
                  <span className="text-[10px] text-gray-400">0 / 2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Most Ordered Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Most ordered</h2>
              <button className="text-cyan-400 text-xs font-medium px-3 py-1.5 bg-cyan-400/10 rounded-full">
                See all
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {mostOrderedItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative bg-zinc-900 rounded-xl overflow-hidden cursor-pointer hover:bg-zinc-800 transition-colors"
                  onClick={() => handleItemClick(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-24 object-cover"
                  />
                  {/* Small curved background with plus button */}
                  <div className="absolute top-0 right-0 w-10 h-10 rounded-bl-[64px] flex items-center justify-center" style={{ backgroundColor: '#133842' }}>
                    <button 
                      className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform -translate-y-0.5 translate-x-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                    >
                      <Plus className="w-5 h-5" style={{ color: '#009FE6' }} strokeWidth={2.5} />
                    </button>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-medium">{item.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">€{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Schedule Button */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] z-50">
          <button className="w-full text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-2xl" style={{ backgroundColor: '#009FE6' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0088CC'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009FE6'}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-left">
              <p className="text-xs font-bold">Schedule order</p>
              <p className="text-[10px] opacity-80">From 11:45 am tomorrow</p>
            </div>
          </button>
        </div>

        {/* Bottom Sheet Modal */}
        {selectedItem && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300"
              style={{ animation: 'fadeIn 0.3s ease-out' }}
              onClick={handleCloseModal}
            ></div>
            
            {/* Bottom Sheet */}
            <div 
              className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-[20px] z-50 h-[calc(100vh-60px)] overflow-y-auto shadow-2xl"
              style={{ animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <div className="w-full mx-auto">
                {/* Handle Bar */}
                <div className={`flex justify-center pt-3 pb-2 transition-all duration-300 ${isScanning ? 'blur-sm' : ''}`}>
                  <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
                </div>

                {/* Close Button */}
                <div className={`absolute top-4 right-4 z-10 transition-all duration-300 ${isScanning ? 'blur-sm' : ''}`}>
                  <button 
                    onClick={handleCloseModal}
                    className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Dish Image */}
                <div className="px-4 pb-4 relative">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className={`w-full h-48 object-cover rounded-[20px] cursor-pointer transition-all duration-300 ${isScanning ? 'blur-sm' : ''}`}
                    onMouseDown={handleLongPressStart}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    onTouchStart={handleLongPressStart}
                    onTouchEnd={handleLongPressEnd}
                  />
                  
                  {/* Visual feedback for press */}
                  {isPressed && !isScanning && (
                    <motion.div
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.05, opacity: 0.4 }}
                      className="absolute top-6 left-8 right-8 bottom-12 rounded-[20px] bg-cyan-400 blur-sm pointer-events-none"
                    />
                  )}
                  
                  {/* Cartoon Float Button on image */}
                  <div className={`absolute bottom-[-50px] right-[5px] scale-[1] transition-all duration-300 ${isScanning ? 'blur-sm' : ''}`}>
                    <CartoonFloatButton showTooltip={true} />
                  </div>
                </div>

                {/* Dish Info */}
                <div className={`px-6 pb-4 text-left transition-all duration-300 ${isScanning ? 'blur-sm' : ''}`}>
                  <h2 className="text-[24px] font-bold mb-3 text-white text-left">{selectedItem.name}</h2>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-xl font-bold text-left" style={{ color: '#009FE6' }}>
                      {selectedItem.price.toFixed(2).replace('.', ',')} €
                    </p>
                    <button className="w-8 h-8 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-2 leading-relaxed text-left">{selectedItem.description}</p>
                  
                  {/* Ingredients */}
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed text-left">{selectedItem.ingredients}</p>

                  {/* Options Section */}
                  <div className="mb-6 text-left">
                    <h3 className="text-base font-bold mb-1 text-white text-left">Lisuke samaan boksiin?</h3>
                    <p className="text-[11px] text-gray-400 mb-3 text-left">Valitse vähintään yksi</p>
                    
                    {/* Option 1 */}
                    <button
                      onClick={() => setSelectedOption('full')}
                      className="w-full flex items-center justify-between p-4 mb-3 rounded-xl bg-[#242424] hover:bg-[#2a2a2a] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center transition-colors">
                        </div>
                        <span className="text-[13px] text-white text-left">Koko boksi täyteen pääruokaa</span>
                      </div>
                      <span className="text-[13px] text-white text-left">+ 1,00 €</span>
                    </button>

                    {/* Option 2 */}
                    <button
                      onClick={() => setSelectedOption('half')}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-[#242424] hover:bg-[#2a2a2a] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedOption === 'half' 
                            ? 'border-[#009FE6] bg-[#009FE6]' 
                            : 'border-gray-500'
                        }`}>
                          {selectedOption === 'half' && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[13px] text-white text-left">50% / 50% pääruokaa ja lisuketta</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className={`sticky bottom-0 bg-[#1a1a1a] px-3 py-2 transition-all duration-300 ${isScanning ? 'blur-sm' : ''}`}>
                  <div className="flex items-stretch gap-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-[#1e3a47] rounded-lg px-3 py-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-white hover:opacity-80 transition-opacity disabled:opacity-30"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3 h-3" strokeWidth={2.5} />
                      </button>
                      <span className="text-xs font-bold text-white min-w-[18px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-white hover:opacity-80 transition-opacity"
                      >
                        <Plus className="w-3 h-3" strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-2 rounded-lg font-bold text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg"
                      style={{ backgroundColor: '#009FE6' }}
                    >
                      <span className="text-xs">Lisää tilaukseen</span>
                      <span className="text-xs ml-2">{((selectedItem.price + (selectedOption === 'full' ? 1 : 0)) * quantity).toFixed(2).replace('.', ',')} €</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </>
        )}
      </div>
      
      {/* Scanning animation - outside all blur effects, in outermost container */}
      {selectedItem && isScanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-[100] pointer-events-none"
          style={{ 
            top: '100px',
            left: '50%',
            transform: 'translate(-50%, 0)'
          }}
        >
          <div className="scale-75">
            <ScanningAnimation dishImage={selectedItem.image} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

