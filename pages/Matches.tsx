import React, { useState, useEffect } from 'react';
import { getMatches } from '../utils/storage';
import { Match } from '../types';

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[] | null>(null);

  useEffect(() => {
    const storedMatches = getMatches();
    setMatches(storedMatches);
  }, []);

  if (matches === null || matches.length === 0) {
    return (
      <div className="text-center max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">search_off</span>
        <h1 className="text-2xl font-bold text-slate-700">Aucun Match Trouvé</h1>
        <p className="text-slate-500 mt-2">
          Il semble qu'aucun match n'ait encore été généré. Veuillez vous rendre sur la page "Tirage" pour en créer.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">Matchs Finaux</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.map(({ senior, freshmen }) => (
          <div key={senior.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="bg-sky-500 p-4 text-white">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-3xl mr-3">workspace_premium</span>
                <div>
                  <h2 className="text-xl font-bold">{senior.name} {senior.surname}</h2>
                  <p className="text-sm opacity-90">Mentor Ancien</p>
                </div>
              </div>
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-md font-semibold text-slate-600 mb-3">Nouveaux Assignés :</h3>
              <ul className="space-y-3">
                {freshmen.map(freshman => (
                  <li key={freshman.id} className="flex items-center text-slate-700">
                    <span className="material-symbols-outlined text-indigo-500 mr-3">school</span>
                    <span>{freshman.name} {freshman.surname}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;