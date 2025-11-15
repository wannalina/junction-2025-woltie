import { useState } from 'react';
import { RestaurantCard } from '../components/RestaurantCard';
import { PromotionBanner } from '../components/PromotionBanner';
import { CartoonFloatButton } from '../components/CartoonFloatButton';
import { Compass, Utensils, Store, Search, User } from 'lucide-react';

export function Home() {
  const [activeCategory, setActiveCategory] = useState('Restaurants');

  const categories = ['Restaurants', 'Groceries', 'Market', 'Pharmacy'];
  
  const promotionSlides = [
    {
      title: 'Enjoy €0 delivery fee',
      subtitle: 'Applies to eligible orders from selected stores.',
      subtitle2: 'Enjoy shopping!',
      badge: 'Free delivery',
      color: 'bg-cyan-400'
    },
    {
      title: 'New! Wolt+ Membership',
      subtitle: 'Unlimited free delivery for just €9.99/month.',
      subtitle2: 'Try it now!',
      badge: 'W+ Special',
      color: 'bg-blue-500'
    },
    {
      title: 'Fresh Groceries Delivered',
      subtitle: 'Get your groceries delivered in under 30 minutes.',
      subtitle2: 'Shop now!',
      badge: 'Fast & Fresh',
      color: 'bg-green-500'
    },
    {
      title: '20% Off First Order',
      subtitle: 'New to Wolt? Get 20% off your first order.',
      subtitle2: 'Limited time offer!',
      badge: 'New User',
      color: 'bg-purple-500'
    },
    {
      title: 'Late Night Cravings?',
      subtitle: 'Order from restaurants open late near you.',
      subtitle2: 'Available 24/7!',
      badge: 'Open Late',
      color: 'bg-orange-500'
    }
  ];

  const restaurants = [
    {
      id: 'kiven-grilli',
      name: 'Kiven Grilli',
      description: 'Delicious grilled delicacies...',
      price: '€1.99',
      time: '20-30 min',
      rating: '8.2',
      sponsored: true,
      badge: 'W+',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop'
    },
    {
      id: 'ravintola-nepal',
      name: 'Ravintola Nepal',
      description: 'Real taste from Himalaya...',
      price: '€1.99',
      time: '15-25 min',
      rating: '9.0',
      sponsored: false,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=300&fit=crop'
    },
    {
      id: 'tokyo-sushi',
      name: 'Tokyo Sushi Bar',
      description: 'Authentic Japanese sushi & ramen...',
      price: '€2.49',
      time: '25-35 min',
      rating: '8.8',
      sponsored: false,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop'
    },
    {
      id: 'golden-dragon',
      name: 'Golden Dragon',
      description: 'Traditional Chinese cuisine...',
      price: '€1.99',
      time: '30-40 min',
      rating: '8.5',
      sponsored: true,
      badge: 'W+',
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&h=300&fit=crop'
    },
    {
      id: 'burger-house',
      name: 'American Burger House',
      description: 'Classic American burgers & fries...',
      price: '€2.99',
      time: '15-20 min',
      rating: '9.2',
      sponsored: false,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=300&fit=crop'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white flex justify-center items-start">
      <div className="w-full max-w-md lg:max-w-lg min-h-screen bg-black relative pb-20 lg:shadow-2xl">
      
      <div className="sticky top-0 z-40 bg-black px-4 pt-2 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-900 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="7" strokeWidth="2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M22 12h-4M6 12H2" />
              </svg>
            </button>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs sm:text-sm font-medium truncate">Your current location</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-900 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-900 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-amber-700 text-white'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <PromotionBanner slides={promotionSlides} />

      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg sm:text-xl font-bold">Fastest delivery</h2>
          <button className="text-cyan-400 text-xs sm:text-sm font-medium">See all</button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              description={restaurant.description}
              price={restaurant.price}
              time={restaurant.time}
              rating={restaurant.rating}
              sponsored={restaurant.sponsored}
              badge={restaurant.badge}
              image={restaurant.image}
            />
          ))}
        </div>
      </div>

      {/* All Restaurant Section */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg sm:text-xl font-bold">All Restaurant</h2>
          <button className="text-cyan-400 text-xs sm:text-sm font-medium">See all</button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              description={restaurant.description}
              price={restaurant.price}
              time={restaurant.time}
              rating={restaurant.rating}
              sponsored={restaurant.sponsored}
              badge={restaurant.badge}
              image={restaurant.image}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[calc(28rem-2rem)] lg:max-w-[calc(32rem-2rem)]">
        <div className="bg-zinc-900/95 backdrop-blur-lg rounded-xl px-1.5 py-1 shadow-2xl">
          <div className="flex items-center justify-around">
            {/* Discovery */}
            <button className="flex flex-col items-center gap-0.5 text-cyan-400 min-w-[45px] py-0.5">
              <Compass className="w-4 h-4" />
              <span className="text-[8px] font-medium">Discovery</span>
            </button>
            
            {/* Restaurants */}
            <button className="flex flex-col items-center gap-0.5 text-gray-400 min-w-[45px] py-0.5 hover:text-gray-300 transition-colors">
              <Utensils className="w-4 h-4" />
              <span className="text-[8px]">Restaurants</span>
            </button>
            
            {/* Stores */}
            <button className="flex flex-col items-center gap-0.5 text-gray-400 min-w-[45px] py-0.5 hover:text-gray-300 transition-colors">
              <Store className="w-4 h-4" />
              <span className="text-[8px]">Stores</span>
            </button>
            
            {/* Search */}
            <button className="flex flex-col items-center gap-0.5 text-gray-400 min-w-[45px] py-0.5 hover:text-gray-300 transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-[8px]">Search</span>
            </button>
            
            {/* Profile */}
            <button className="flex flex-col items-center gap-0.5 text-gray-400 min-w-[45px] py-0.5 hover:text-gray-300 transition-colors">
              <User className="w-4 h-4" />
              <span className="text-[8px]">Profile</span>
            </button>
            
          </div>
        </div>
      </div>

      {/* Cartoon Float Button */}
      <CartoonFloatButton />
      </div>
    </div>
  );
}

