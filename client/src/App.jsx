import { Route, Routes } from 'react-router-dom';
import { EpisodesProvider } from './context/EpisodesContext.jsx';
import Header from './components/Header.jsx';
import EpisodeList from './pages/EpisodeList.jsx';
import EpisodeDetail from './pages/EpisodeDetail.jsx';
import Shootout from './pages/Shootout.jsx';
import Rankings from './pages/Rankings.jsx';

export default function App() {
  return (
    <EpisodesProvider>
      <div className="grain-bg relative min-h-screen">
        <div className="relative z-10">
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
            <Routes>
              <Route path="/" element={<EpisodeList />} />
              <Route path="/folge/:nummer" element={<EpisodeDetail />} />
              <Route path="/shootout" element={<Shootout />} />
              <Route path="/rangliste" element={<Rankings />} />
            </Routes>
          </main>
        </div>
      </div>
    </EpisodesProvider>
  );
}
