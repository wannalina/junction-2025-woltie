import { CartoonFloatButton } from '../components/CartoonFloatButton';

export function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img 
        src="/home.png" 
        alt="Wolt Home" 
        className="w-full h-full object-cover" 
      />
      
      {/* 卡通悬浮按钮 */}
      <CartoonFloatButton />
    </div>
  );
}

