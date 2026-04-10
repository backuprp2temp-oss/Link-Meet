import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MeetingRoom from './pages/MeetingRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meet/:roomId" element={<MeetingRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
