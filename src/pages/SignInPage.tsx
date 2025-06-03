import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      navigate('/');
    } catch (error: any) {
      setError('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Flame className="w-12 h-12 text-fire-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 flame-text">Welcome Back</h1>
          <p className="text-ash-300">Sign in to continue to Goblet of Fire</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-flame-500/10 border border-flame-500 text-flame-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-fire-500 hover:text-fire-400 text-sm transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-ash-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-fire-500 hover:text-fire-400">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}