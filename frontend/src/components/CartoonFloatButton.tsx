import juhoIcon from '../assets/juho.svg';
import './CartoonFloatButton.css';

interface CartoonFloatButtonProps {
  onClick?: () => void;
  showTooltip?: boolean;
}

export function CartoonFloatButton({ onClick, showTooltip = false }: CartoonFloatButtonProps) {
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
      {showTooltip && <div className="tooltip-text">Press the photo!</div>}
    </div>
  );
}

