import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Search, Plus } from 'lucide-react';

export function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data - in a real app, you would fetch this from an API based on the id
  const restaurantData: Record<string, any> = {
    'kiven-grilli': {
      name: 'Kiven Grilli',
      description: 'Delicious grilled delicacies',
      price: '€1.99',
      time: '20-30 min',
      rating: '8.2',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop',
      fullDescription: 'Experience the best grilled food in town. Our signature dishes are prepared with fresh ingredients and traditional recipes.',
      address: '123 Main Street, Helsinki',
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
  };

  const restaurant = restaurantData[id || ''];

  const mostOrderedItems = [
    {
      id: 1,
      name: 'Butter Chicken',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop',
      price: '€12.50'
    },
    {
      id: 2,
      name: 'Tikka Masala',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop',
      price: '€11.90'
    }
  ];

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
    <div className="w-full min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md lg:max-w-lg min-h-screen bg-black relative lg:shadow-2xl pb-24">
        
        {/* Hero Image with Search Bar */}
        <div className="relative h-[240px]">
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
        <div className="bg-black px-4 py-5 rounded-t-[40px] -mt-12 relative z-10">
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
                <div key={item.id} className="relative bg-zinc-900 rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-28 object-cover"
                  />
                  <button className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center hover:scale-110 transition-transform" style={{ backgroundColor: '#009FE6' }}>
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                  <div className="p-2.5">
                    <p className="text-xs font-medium">{item.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Schedule Button */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[calc(28rem-2rem)] lg:max-w-[calc(32rem-2rem)] z-50">
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
      </div>
    </div>
  );
}

