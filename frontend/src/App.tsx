import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { NextPage } from './pages/NextPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/next" element={<NextPage />} />
    </Routes>
  );
}

export default App
