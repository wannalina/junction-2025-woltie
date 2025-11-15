import { useNavigate } from 'react-router-dom';

interface RestaurantCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
  time: string;
  rating: string;
  sponsored: boolean;
  badge?: string;
  image: string;
}

export function RestaurantCard({
  id,
  name,
  description,
  price,
  time,
  rating,
  sponsored,
  badge,
  image,
}: RestaurantCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="min-w-[260px] sm:min-w-[280px] bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer hover:bg-zinc-800 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
    >
      <div className="relative h-32 sm:h-36 bg-zinc-800">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {badge && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold">
            {badge}
          </div>
        )}
      </div>

      <div className="p-2.5 sm:p-3">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm sm:text-base font-semibold">{name}</h3>
        </div>
        <p className="text-gray-400 text-xs mb-1.5">
          {description}
          {sponsored && <span className="ml-1">• Sponsored</span>}
        </p>

        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400">
          <div className="flex items-center gap-0.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{price}</span>
          </div>
          <span>•</span>
          <span>{time}</span>
          <span>•</span>
          <div className="flex items-center gap-0.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

