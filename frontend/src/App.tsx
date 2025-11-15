import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { AIScannerResult } from './pages/AIScannerResult';
import { ChatPage } from './pages/ChatPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/ai-scanner" element={<AIScannerResult />} />
    </Routes>
  );
}

export default App
