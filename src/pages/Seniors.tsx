import React, { useMemo } from 'react';
import { seniors } from '../data';
import { User } from '../types';

const UserCard: React.FC<{ user: User }> = ({ user }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
    <span className="material-symbols-outlined text-3xl text-sky-500 mr-4">workspace_premium</span>
    <div>
      <p className="font-semibold text-lg text-slate-800">{user.name} {user.surname}</p>
      <p className="text-sm text-slate-500">ID : {user.id}</p>
    </div>
  </div>
);

const Seniors: React.FC = () => {
  const groupedUsers = useMemo(() => {
    const groups: { [date: string]: User[] } = {};
    const sortedUsers = [...seniors].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    sortedUsers.forEach(user => {
      const dateKey = user.createdAt.split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(user);
    });
    return groups;
  }, []);

  let lastRenderedYear = '';
  let lastRenderedMonth = '';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-sky-600">Anciens Disponibles</h1>
        <p className="text-slate-600 mt-2">Une chronologie de tous les anciens disponibles.</p>
      </div>
       {Object.keys(groupedUsers).length > 0 ? (
        Object.entries(groupedUsers).map(([dateKey, usersOnDay]) => {
          const date = new Date(dateKey + 'T00:00:00');
          const year = date.getFullYear().toString();
          const month = date.toLocaleString('fr-FR', { month: 'long' });
          const dayAndDate = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' });

          const yearHeader = year !== lastRenderedYear ? (
            <h2 className="text-4xl font-bold text-slate-800 my-8 pt-4 text-center">{year}</h2>
          ) : null;

          const monthHeader = (year !== lastRenderedYear || month !== lastRenderedMonth) ? (
            <h3 className="text-2xl font-semibold text-slate-700 mt-8 mb-6 pb-2 border-b capitalize">{month}</h3>
          ) : null;
          
          lastRenderedYear = year;
          lastRenderedMonth = month;

          return (
            <React.Fragment key={dateKey}>
              {yearHeader}
              {monthHeader}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-slate-500 mb-4 capitalize">{dayAndDate}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {usersOnDay.map(user => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            </React.Fragment>
          );
        })
      ) : (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <span className="material-symbols-outlined text-5xl text-slate-400 mb-4">person_off</span>
            <p className="text-slate-500">Aucun ancien n'est disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default Seniors;
