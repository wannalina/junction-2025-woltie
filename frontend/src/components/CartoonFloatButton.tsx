import { useNavigate } from 'react-router-dom';
import woltyIcon from '../assets/wolty.svg';
import './CartoonFloatButton.css';

export function CartoonFloatButton() {
  const navigate = useNavigate();

  return (
    <div className="cartoon-float-button-wrapper" onClick={() => navigate('/next')}>
      <div className="cartoon-button">
        {/* Wolty 卡通图标 */}
        <img 
          src={woltyIcon} 
          alt="Wolty" 
          className="wolty-icon"
        />
      </div>
      
      {/* 文字提示 */}
      <div className="tooltip-text">点我继续</div>
    </div>
  );
}

