import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Search, Vote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import type { Database } from '../types/supabase';

type Nominee = Database['public']['Tables']['nominees']['Row'];

const VotingPage = () => {
  const navigate = useNavigate();
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [filteredNominees, setFilteredNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);
  const [remainingVotes, setRemainingVotes] = useState<number>(5);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkUser();
    fetchNominees();

    const subscription = supabase
      .channel('any_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'votes' },
        () => {
          fetchNominees();
          fetchUserVotes();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserVotes();
    }
  }, [user]);

  useEffect(() => {
    const filtered = nominees.filter(nominee => 
      nominee.displayname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nominee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nominee.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNominees(filtered);
  }, [searchTerm, nominees]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchUserVotes = async () => {
    if (!user) return;
    
    try {
      const { data: votes, error } = await supabase
        .from('votes')
        .select('nominee_id')
        .eq('user_id', user.id);

      if (error) throw error;

      if (votes) {
        setUserVotes(new Set(votes.map(vote => vote.nominee_id)));
        setRemainingVotes(5 - votes.length);
      }
    } catch (err) {
      console.error('Error fetching user votes:', err);
    }
  };

  const fetchNominees = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('nominees')
        .select(`
          id,
          displayname,
          department,
          location,
          imageurl,
          votes:votes(count)
        `)
        .order('displayname');

      if (error) throw error;

      if (!data) {
        throw new Error('No nominees found');
      }

      const processedNominees = data.map(nominee => ({
        ...nominee,
        votes: nominee.votes[0]?.count || 0
      }));

      setNominees(processedNominees);
      setFilteredNominees(processedNominees);
    } catch (err: any) {
      console.error('Error fetching nominees:', err);
      setError(err.message || 'Failed to load nominees');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (nomineeId: string) => {
    if (!user) {
      setError('Please sign in to vote');
      return;
    }

    if (remainingVotes <= 0) {
      setError('You have reached your maximum of 5 votes');
      return;
    }

    try {
      setVoting(true);
      setError(null);
      
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          nominee_id: nomineeId,
          user_id: user.id,
        });

      if (voteError) {
        if (voteError.code === '23505') {
          throw new Error('You have already voted for this nominee');
        }
        throw voteError;
      }

      await Promise.all([
        fetchNominees(),
        fetchUserVotes()
      ]);
    } catch (err: any) {
      console.error('Error voting:', err);
      setError(err.message || 'Failed to submit vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading nominees...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-fire-500/10">
                <Vote className="w-6 h-6 text-fire-500" />
              </div>
              <h1 className="text-2xl font-bold">Cast Your Vote</h1>
            </div>
            <div className="text-ash-300">
              Remaining votes: <span className="text-fire-500 font-bold">{remainingVotes}</span>
            </div>
          </div>

          {remainingVotes <= 0 && (
            <div className="bg-fire-500/10 border border-fire-500 text-fire-500 p-4 rounded-lg mb-6">
              You've used all your voting power! Thank you for participating.
            </div>
          )}

          <div className="mb-8">
            <div className="relative">
              <Input
                placeholder="Search by name, department, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ash-400" />
            </div>
          </div>

          {error && (
            <div className="bg-flame-500/10 border border-flame-500 text-flame-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid gap-4">
            {filteredNominees.length === 0 ? (
              <div className="text-center py-12">
                <Flame className="w-12 h-12 text-fire-500/50 mx-auto mb-4" />
                <p className="text-ash-400">No nominees found matching your search.</p>
              </div>
            ) : (
              filteredNominees.map((nominee) => (
                <div
                  key={nominee.id}
                  className="card p-6 flex items-center justify-between hover:border-fire-500/30 transition-colors"
                >
                  <div>
                    <h3 className="text-xl font-bold mb-1">{nominee.displayname}</h3>
                    <p className="text-ash-400 text-sm">
                      {nominee.department} • {nominee.location}
                    </p>
                    <p className="text-ash-300 mt-1">{nominee.votes} votes</p>
                  </div>
                  <Button
                    onClick={() => handleVote(nominee.id)}
                    disabled={voting || remainingVotes <= 0 || userVotes.has(nominee.id)}
                    variant={userVotes.has(nominee.id) ? 'secondary' : remainingVotes <= 0 ? 'secondary' : 'primary'}
                  >
                    {userVotes.has(nominee.id) 
                      ? 'Voted' 
                      : remainingVotes <= 0 
                        ? 'No Votes Left' 
                        : 'Vote'
                    }
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;