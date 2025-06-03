import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
import { Flame, Trophy, Vote, Crown, Medal, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Nominee = Database['public']['Tables']['nominees']['Row'];

const Feature = ({ icon: Icon, title, description }: {
  icon: typeof Flame;
  title: string;
  description: string;
}) => (
  <div className="card p-6 flex flex-col items-center text-center gap-4 card-hover group">
    <div className="p-3 rounded-full bg-fire-500/10 group-hover:bg-fire-500/20 transition-colors">
      <Icon className="w-8 h-8 text-fire-500" />
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-ash-300">{description}</p>
  </div>
);

const LeaderBar = ({ nominee, rank, maxVotes }: { 
  nominee: Nominee; 
  rank: number;
  maxVotes: number;
}) => {
  const icons = [Crown, Medal, Award, Trophy, Vote];
  const Icon = icons[rank] || Vote;
  const colors = [
    'from-ember-400 to-fire-500',
    'from-ash-300 to-ash-500',
    'from-ember-600 to-ember-800',
    'from-fire-400 to-flame-600',
    'from-ash-400 to-ash-600'
  ];
  const percentage = maxVotes > 0 ? (nominee.votes / maxVotes) * 100 : 0;
  const animations = [
    'animate-bounce',
    'animate-pulse',
    'animate-bounce',
    'animate-pulse',
    'animate-bounce'
  ];

  return (
    <Link 
      to={`/profile/${nominee.id}`}
      className="flex items-start gap-6 mb-8 group hover:opacity-90 transition-opacity"
    >
      <div className="w-16 flex-shrink-0 flex flex-col items-center">
        <div className={`relative p-3 rounded-full bg-fire-500/10 mb-2 ${animations[rank]}`}>
          <Icon className={`w-8 h-8 ${rank === 0 ? 'text-ember-400' : rank === 1 ? 'text-ash-300' : rank === 2 ? 'text-ember-600' : 'text-fire-500'}`} />
          {rank === 0 && (
            <div className="absolute -inset-2 bg-gradient-to-t from-fire-500/0 via-fire-500/30 to-ember-400/50 animate-pulse rounded-full -z-10" />
          )}
        </div>
        <span className="text-2xl font-bold text-fire-500">#{rank + 1}</span>
      </div>
      <div className="flex-1 pt-2">
        <div className="flex justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg mb-1">{nominee.displayname}</h3>
            <p className="text-sm text-ash-400">{nominee.department}</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-fire-500">{nominee.votes}</span>
            <p className="text-sm text-ash-400">votes</p>
          </div>
        </div>
        <div className="relative h-8 bg-ash-800/50 rounded-lg overflow-hidden group">
          <div 
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[rank]} transition-all duration-1000 ease-out group-hover:brightness-110`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [topNominees, setTopNominees] = useState<Nominee[]>([]);
  const [maxVotes, setMaxVotes] = useState(0);
  const [countdownDate, setCountdownDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchTopNominees();
    fetchCountdownDate();

    const subscription = supabase
      .channel('nominees_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'nominees' },
        fetchTopNominees
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCountdownDate = async () => {
    const { data, error } = await supabase
      .from('config')
      .select('value')
      .eq('key', 'countdown')
      .single();

    if (!error && data) {
      setCountdownDate(new Date(data.value.end_date));
    }
  };

  const fetchTopNominees = async () => {
    const { data } = await supabase
      .from('nominees')
      .select('*')
      .order('votes', { ascending: false })
      .order('displayname', { ascending: true })
      .limit(5);

    if (data) {
      setTopNominees(data);
      const maxVotes = Math.max(...data.map(n => n.votes || 0));
      setMaxVotes(maxVotes);
    }
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  const handleVoteClick = () => {
    navigate('/vote');
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-fire-500/20 via-ash-950 to-ash-950" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative inline-block mb-6">
              <Flame className="w-16 h-16 text-fire-500 mx-auto animate-flame-flicker" />
              <div className="absolute inset-0 bg-gradient-to-t from-fire-500/0 via-fire-500/30 to-ember-400/50 animate-pulse rounded-full blur-xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 flame-text animate-flame-flicker">
              Goblet of Fire
            </h1>
            <p className="text-xl text-ash-300 mb-8">
              Vote for the person who you want to see as captain in the Annual day Tournament. 
              The top 5 nominees will emerge victorious from the Goblet of Fire and will lead 
              teams to victory and glory.
            </p>
            <div className="mb-12">
              {mounted && countdownDate && (
                <Countdown
                  date={countdownDate}
                  renderer={({ days, hours, minutes, seconds }) => (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { value: days, label: 'Days' },
                        { value: hours, label: 'Hours' },
                        { value: minutes, label: 'Minutes' },
                        { value: seconds, label: 'Seconds' },
                      ].map(({ value, label }) => (
                        <div key={label} className="card p-4">
                          <div className="text-3xl md:text-4xl font-bold flame-text">
                            {value}
                          </div>
                          <div className="text-ash-400">{label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                />
              )}
            </div>
            <Button
              onClick={handleVoteClick}
              size="lg"
              className="animate-glow-pulse"
            >
              Vote Now
            </Button>
          </div>
        </div>
      </section>

      {/* Top 5 Section */}
      <section className="py-20 bg-ash-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-fire-500/10">
                  <Trophy className="w-6 h-6 text-fire-500" />
                </div>
                <h2 className="text-2xl font-bold">Current Leaders</h2>
              </div>
              <Button onClick={handleViewLeaderboard} variant="secondary">
                View Full Leaderboard
              </Button>
            </div>
            
            <div className="card p-8">
              {topNominees.map((nominee, index) => (
                <LeaderBar 
                  key={nominee.id} 
                  nominee={nominee} 
                  rank={index}
                  maxVotes={maxVotes}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-ash-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon={Vote}
              title="Cast Your Vote"
              description="Choose your champion from Hogwarts' finest students."
            />
            <Feature
              icon={Trophy}
              title="Track Progress"
              description="Watch the leaderboard as champions rise to glory."
            />
            <Feature
              icon={Flame}
              title="Witness Glory"
              description="See who emerges victorious from the Goblet of Fire."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;