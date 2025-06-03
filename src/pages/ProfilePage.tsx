import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, GraduationCap, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import type { Database } from '../types/supabase';

type Nominee = Database['public']['Tables']['nominees']['Row'];
type Vote = {
  id: string;
  user_id: string;
  created_at: string;
  user_email: string;
  user_name: string;
};

const ProfilePage = () => {
  const { id } = useParams();
  const [nominee, setNominee] = useState<Nominee | null>(null);
  const [voters, setVoters] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNomineeAndVoters();
  }, [id]);

  const fetchNomineeAndVoters = async () => {
    try {
      // Fetch nominee details
      const { data: nomineeData, error: nomineeError } = await supabase
        .from('nominees')
        .select('*')
        .eq('id', id)
        .single();

      if (nomineeError) throw nomineeError;
      setNominee(nomineeData);

      // Fetch voters with their email addresses and names from auth.users
      const { data: votersData, error: votersError } = await supabase
        .rpc('get_voters_with_email', { nominee_uuid: id });

      if (votersError) throw votersError;
      setVoters(votersData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    if (!nominee || !voters.length) return;

    const exportData = voters.map(voter => ({
      'Voter Name': voter.user_name,
      'Email': voter.user_email,
      'Vote Date': new Date(voter.created_at).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Voters');

    XLSX.writeFile(wb, `${nominee.displayname}-voters.xlsx`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!nominee) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-flame-500">Nominee not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            as={Link}
            to="/leaderboard"
            variant="secondary"
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leaderboard
          </Button>

          {error && (
            <div className="bg-flame-500/10 border border-flame-500 text-flame-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="card p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-4">{nominee.displayname}</h1>
                <div className="space-y-2 text-ash-300">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    {nominee.department}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {nominee.location}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-fire-500">
                  {nominee.votes}
                </div>
                <div className="text-ash-400">total votes</div>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-fire-500/10">
                  <Users className="w-6 h-6 text-fire-500" />
                </div>
                <h2 className="text-2xl font-bold">Voters</h2>
              </div>
              {voters.length > 0 && (
                <Button
                  onClick={handleExportToExcel}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export to Excel
                </Button>
              )}
            </div>

            {voters.length === 0 ? (
              <div className="text-center py-8 text-ash-400">
                No votes yet
              </div>
            ) : (
              <div className="space-y-4">
                {voters.map((vote) => (
                  <div
                    key={vote.user_id}
                    className="flex items-center justify-between p-4 rounded-lg bg-ash-800/50 hover:bg-ash-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-fire-500/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-fire-500" />
                      </div>
                      <div>
                        <div className="font-medium">{vote.user_name}</div>
                        <div className="text-sm text-ash-400">{vote.user_email}</div>
                        <div className="text-xs text-ash-500">
                          {new Date(vote.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;