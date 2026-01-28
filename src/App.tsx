import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EventSetup from './components/host/EventSetup';
import HostDashboard from './components/host/HostDashboard';
import JoinEvent from './components/participant/JoinEvent';
import ParticipantView from './components/participant/ParticipantView';

function App() {
  return (
    <BrowserRouter basename="/blind-tasting">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Routes>
          <Route path="/" element={<HostDashboard />} />
          <Route path="/host/setup" element={<EventSetup />} />
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="/join/:hostPeerId" element={<JoinEvent />} />
          <Route path="/participate" element={<ParticipantView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Root now serves the host dashboard directly; Home page removed.

export default App;
