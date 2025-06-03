import { Flame } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Header = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ash-900/80 backdrop-blur-sm border-b border-ash-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Flame className="w-8 h-8 text-fire-500 animate-flame-flicker" />
          <span className="font-heading text-xl font-bold flame-text">
            Goblet of Fire
          </span>
        </Link>
        
        <nav className="flex items-center gap-4">
          {location.pathname !== '/vote' && (
            <Button as={Link} to="/vote" variant="primary">
              Vote Now
            </Button>
          )}
          <Link
            to="/leaderboard"
            className="text-ash-300 hover:text-white transition-colors"
          >
            Leaderboard
          </Link>
          <Button
            variant="secondary"
            onClick={signOut}
          >
            Sign Out
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;