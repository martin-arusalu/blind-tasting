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
    <div className="container mx-auto px-6 py-20 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide uppercase bg-purple-100 text-purple-700 rounded-full">
            Premium Experience
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Wine <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Blind Tasting</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Elevate your wine tasting events with real-time scoring, guest management, and interactive leaderboards.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Link
            to="/host/setup"
            className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)] transition-all duration-500 transform hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500 text-8xl">🎯</div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
                🍷
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Host Event</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                Create a professional tasting event, manage your wine list, and invite guests to compete.
              </p>
              <div className="flex items-center text-purple-600 font-bold group-hover:translate-x-2 transition-transform">
                Get Started <span className="ml-2">→</span>
              </div>
            </div>
          </Link>
          
          <Link
            to="/join"
            className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(219,39,119,0.12)] transition-all duration-500 transform hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500 text-8xl">🥂</div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg shadow-pink-200 group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Join Event</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                Connect with a host, rate wines blindly, and see how your palate compares to others.
              </p>
              <div className="flex items-center text-pink-600 font-bold group-hover:translate-x-2 transition-transform">
                Join Now <span className="ml-2">→</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-20 flex justify-center items-center gap-8 text-slate-400 font-medium overflow-hidden whitespace-nowrap opacity-60">
          <span>REAL-TIME SCORING</span>
          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
          <span>PEER-TO-PEER</span>
          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
          <span>INTERACTIVE BOARDS</span>
        </div>
      </div>
    </div>
  );
}

export default App;
