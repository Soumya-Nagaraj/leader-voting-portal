import { useEffect, useState } from 'react';
import { Trophy, MapPin, GraduationCap, Search, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

type Nominee = Database['public']['Tables']['nominees']['Row'];

const getLeaderStyle = (index: number) => {
  const styles = [
    'bg-gradient-to-r from-ember-400/10 to-fire-500/10 border-ember-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]',
    'bg-gradient-to-r from-ash-300/10 to-ash-500/10 border-ash-300 shadow-[0_0_15px_rgba(203,213,225,0.3)]',
    'bg-gradient-to-r from-ember-600/10 to-ember-800/10 border-ember-600 shadow-[0_0_15px_rgba(217,119,6,0.3)]',
    'bg-gradient-to-r from-fire-400/10 to-flame-600/10 border-fire-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]',
    'bg-gradient-to-r from-ash-400/10 to-ash-600/10 border-ash-400 shadow-[0_0_15px_rgba(148,163,184,0.3)]'
  ];
  return styles[index] || '';
};

const LeaderboardPage = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [filteredNominees, setFilteredNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const { data, error } = await supabase
          .from('nominees')
          .select('*')
          .order('votes', { ascending: sortOrder === 'asc' })
          .order('displayname', { ascending: true });

        if (error) throw error;
        setNominees(data);
        setFilteredNominees(data);
      } catch (err) {
        console.error('Error fetching nominees:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchNominees();
    
    const subscription = supabase
      .channel('nominees_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'nominees' },
        fetchNominees
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [sortOrder]);

  useEffect(() => {
    const filtered = nominees.filter(nominee => 
      nominee.displayname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nominee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nominee.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNominees(filtered);
  }, [searchTerm, nominees]);

  const toggleSortOrder = () => {
    setSortOrder(current => current === 'desc' ? 'asc' : 'desc');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-ash-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-fire-500/10">
                <Trophy className="w-6 h-6 text-fire-500" />
              </div>
              <h1 className="text-2xl font-bold">Leaderboard</h1>
            </div>
            <Button
              variant="secondary"
              onClick={toggleSortOrder}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === 'desc' ? 'Highest to Lowest' : 'Lowest to Highest'}
            </Button>
          </div>

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

          {filteredNominees.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-fire-500/50 mx-auto mb-4" />
              <p className="text-ash-400">No nominees found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredNominees.map((nominee, index) => (
                <Link
                  key={nominee.id}
                  to={`/profile/${nominee.id}`}
                  className={`block card overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                    index < 5 && nominee.votes > 0 ? getLeaderStyle(index) : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-2xl font-bold ${
                            index < 5 && nominee.votes > 0
                              ? index === 0 
                                ? 'text-ember-400'
                                : index === 1
                                ? 'text-ash-300'
                                : index === 2
                                ? 'text-ember-600'
                                : index === 3
                                ? 'text-fire-400'
                                : 'text-ash-400'
                              : 'text-fire-500'
                          }`}>
                            #{index + 1}
                          </span>
                          <h3 className="text-xl font-bold">
                            {nominee.displayname}
                          </h3>
                        </div>
                        <div className="space-y-1 text-sm text-ash-300">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            {nominee.department}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {nominee.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${
                          index < 5 && nominee.votes > 0
                            ? index === 0 
                              ? 'text-ember-400'
                              : index === 1
                              ? 'text-ash-300'
                              : index === 2
                              ? 'text-ember-600'
                              : index === 3
                              ? 'text-fire-400'
                              : 'text-ash-400'
                            : 'text-fire-500'
                        }`}>
                          {nominee.votes}
                        </div>
                        <div className="text-sm text-ash-400">votes</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;