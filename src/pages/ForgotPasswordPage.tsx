import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: any) {
      setError('Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Flame className="w-12 h-12 text-fire-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 flame-text">Reset Password</h1>
          <p className="text-ash-300">Enter your email to reset your password</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-flame-500/10 border border-flame-500 text-flame-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="bg-fire-500/10 border border-fire-500 text-fire-500 p-4 rounded-lg mb-6">
                Check your email for password reset instructions
              </div>
              <Button as={Link} to="/signin" variant="secondary" className="w-full">
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <div className="text-center">
                <Link to="/signin" className="text-fire-500 hover:text-fire-400">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}