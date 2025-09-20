import React, { useState, FormEvent } from 'react';

type Role = 'nouveau' | 'ancien';
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

const Home: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role>('nouveau');
  const [status, setStatus] = useState<SubmissionStatus>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const endpoints = {
      nouveau: 'https://formspree.io/f/xeolylnk',
      ancien: 'https://formspree.io/f/xzzanaor'
    };
    
    const endpoint = endpoints[selectedRole];

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto text-center bg-white p-8 rounded-xl shadow-lg">
        <span className="material-symbols-outlined text-6xl text-green-500 mb-4">
          check_circle
        </span>
        <h2 className="text-2xl font-bold text-slate-800">Merci !</h2>
        <p className="text-slate-600 mt-2">Votre inscription a été envoyée avec succès.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Inscrivez-vous</h1>
          <p className="text-slate-600 mt-2">Rejoignez le programme de mentorat en remplissant le formulaire ci-dessous.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* --- Sélecteur de Rôle --- */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Je suis un(e)...</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RoleCard 
                role="nouveau"
                title="Nouveau"
                icon="school"
                isSelected={selectedRole === 'nouveau'}
                onSelect={() => setSelectedRole('nouveau')}
              />
              <RoleCard 
                role="ancien"
                title="Ancien"
                icon="workspace_premium"
                isSelected={selectedRole === 'ancien'}
                onSelect={() => setSelectedRole('ancien')}
              />
            </div>
            <input type="hidden" name="role" value={selectedRole} />
          </div>

          {/* --- Champs Prénom et Nom --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-slate-700">Prénom</label>
              <input
                id="prenom"
                type="text"
                name="prenom"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-slate-700">Nom</label>
              <input
                id="nom"
                type="text"
                name="nom"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          {/* --- Erreurs et Bouton d'envoi --- */}
          {status === 'error' && (
             <div className="text-red-600 text-sm mb-4 text-center">
                <p>Une erreur est survenue. Veuillez réessayer.</p>
             </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors"
          >
            <span className="material-symbols-outlined mr-2">send</span>
            {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer mon inscription'}
          </button>
        </form>
      </div>
    </div>
  );
};


// --- Composant Carte de Rôle ---
interface RoleCardProps {
  role: Role;
  title: string;
  icon: string;
  isSelected: boolean;
  onSelect: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, title, icon, isSelected, onSelect }) => {
  const baseClasses = "flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all duration-200";
  const selectedClasses = "border-indigo-500 bg-indigo-50 shadow-inner";
  const notSelectedClasses = "border-slate-300 bg-slate-50 hover:border-slate-400";
  const iconColor = role === 'nouveau' ? 'text-indigo-500' : 'text-sky-500';

  return (
    <div
      onClick={onSelect}
      className={`${baseClasses} ${isSelected ? selectedClasses : notSelectedClasses}`}
    >
      <span className={`material-symbols-outlined text-4xl mb-2 ${iconColor}`}>{icon}</span>
      <p className={`font-semibold ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>{title}</p>
    </div>
  );
};


export default Home;