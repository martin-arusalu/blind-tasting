import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EventSetup from './components/host/EventSetup';
import HostDashboard from './components/host/HostDashboard';
import JoinEvent from './components/participant/JoinEvent';
import ParticipantView from './components/participant/ParticipantView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host/setup" element={<EventSetup />} />
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="/join/:hostPeerId?" element={<JoinEvent />} />
          <Route path="/participate" element={<ParticipantView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-purple-900 mb-6">
          🍷 Wine Blind Tasting
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Host interactive blind tasting events with real-time scoring
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/host/setup"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-8 shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">Host Event</h2>
            <p className="text-purple-100">
              Create and manage a wine tasting event
            </p>
          </Link>
          
          <Link
            to="/join"
            className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl p-8 shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-4">🥂</div>
            <h2 className="text-2xl font-bold mb-2">Join Event</h2>
            <p className="text-pink-100">
              Participate in a tasting as a guest
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
