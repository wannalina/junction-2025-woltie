import { useNavigate } from 'react-router-dom';
import { FloatButton } from 'antd';
import { RightOutlined } from '@ant-design/icons';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img 
        src="/home.png" 
        alt="Wolt Home" 
        className="w-full h-full object-cover" 
      />
      
      {/* Ant Design 悬浮按钮 */}
      <FloatButton
        icon={<RightOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={() => navigate('/next')}
        tooltip="下一页"
      />
    </div>
  );
}

