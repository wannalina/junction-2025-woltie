import { useNavigate } from 'react-router-dom';

export function NextPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          欢迎来到新页面
        </h1>
        <p className="text-gray-300 mb-8">
          这是一个空白页面，你可以在这里添加任何内容
        </p>
        
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg flex items-center gap-2 mx-auto"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          返回主页
        </button>
      </div>
    </div>
  );
}

