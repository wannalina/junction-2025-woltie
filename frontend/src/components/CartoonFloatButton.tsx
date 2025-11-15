import juhoIcon from '../assets/juho.svg';
import './CartoonFloatButton.css';

interface CartoonFloatButtonProps {
  onClick: () => void;
}

export function CartoonFloatButton({ onClick }: CartoonFloatButtonProps) {
  return (
    <div className="cartoon-float-button-wrapper" onClick={onClick}>
      <div className="cartoon-button">
        {/* Juho 卡通图标 */}
        <img 
          src={juhoIcon} 
          alt="Juho" 
          className="juho-icon"
        />
      </div>
      
      {/* 文字提示 */}
      <div className="tooltip-text">点我继续</div>
    </div>
  );
}

