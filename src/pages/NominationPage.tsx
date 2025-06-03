import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, UserPlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface FormData {
  name: string;
  email: string;
  nominatedBy: string;
  nominatorEmail: string;
  reason?: string;
}

const NominationPage = () => {
  const navigate = useNavigate();
  const { currentUser, addNomination, getUserNominations, setCurrentUser } = useStore();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    nominatedBy: currentUser?.name || '',
    nominatorEmail: currentUser?.email || '',
    reason: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const nominations = getUserNominations();
  const canNominate = !currentUser || nominations.length < 3;

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.nominatedBy) newErrors.nominatedBy = 'Your name is required';
    if (!formData.nominatorEmail) newErrors.nominatorEmail = 'Your email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!currentUser) {
      setCurrentUser({
        id: crypto.randomUUID(),
        name: formData.nominatedBy,
        email: formData.nominatorEmail,
        hasVoted: false,
        nominations: [],
      });
    }

    addNomination({
      name: formData.name,
      email: formData.email,
      nominatedBy: formData.nominatedBy,
      reason: formData.reason,
    });

    navigate('/nominations');
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-fire-500/10">
                <UserPlus className="w-6 h-6 text-fire-500" />
              </div>
              <h1 className="text-2xl font-bold">Nominate a Leader</h1>
            </div>

            {!canNominate ? (
              <div className="text-center py-8">
                <Flame className="w-12 h-12 text-fire-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Maximum Nominations Reached</h2>
                <p className="text-ash-300 mb-4">
                  You have already nominated three leaders, which is the maximum allowed.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/nominations')}
                >
                  View Your Nominations
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    label="Nominee's Name"
                    placeholder="Enter the nominee's name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                  />
                  <Input
                    label="Nominee's Email"
                    type="email"
                    placeholder="Enter the nominee's email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                  />
                  <Input
                    label="Your Name"
                    placeholder="Enter your name"
                    value={formData.nominatedBy}
                    onChange={(e) => setFormData({ ...formData, nominatedBy: e.target.value })}
                    error={errors.nominatedBy}
                  />
                  <Input
                    label="Your Email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.nominatorEmail}
                    onChange={(e) => setFormData({ ...formData, nominatorEmail: e.target.value })}
                    error={errors.nominatorEmail}
                  />
                  <div>
                    <label htmlFor="reason" className="label">
                      Reason for Nomination (Optional)
                    </label>
                    <textarea
                      id="reason"
                      className="input min-h-[100px]"
                      placeholder="Why would they make a great leader?"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Nomination
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NominationPage;