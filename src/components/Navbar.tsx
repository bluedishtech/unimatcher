import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { name: 'Accueil', path: '/', icon: 'home' },
  { name: 'Nouveaux', path: '/freshmen', icon: 'school' },
  { name: 'Anciens', path: '/seniors', icon: 'workspace_premium' },
  { name: 'Tirage', path: '/randomize', icon: 'shuffle' },
  { name: 'Matchs', path: '/matches', icon: 'groups' },
];

const Navbar: React.FC = () => {
  // --- Styling for NavLink active/inactive states ---

  // Desktop (top bar) link styling
  const getDesktopLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-700 text-white"
        : "text-indigo-100 hover:bg-indigo-500 hover:bg-opacity-75"
    }`;

  // Mobile (bottom bar) link styling
  const getMobileLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center w-full h-full transition-colors text-xs ${
      isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'
    }`;

  return (
    <>
      {/* --- Top Navigation (Header) --- */}
      <nav className="bg-indigo-600 shadow-lg sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-xl font-bold flex items-center">
                  <span className="material-symbols-outlined mr-2">diversity_3</span>
                  Uni Matcher
                </span>
              </div>
              {/* Desktop Links - hidden on mobile */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={getDesktopLinkClassName}
                      end={link.path === '/'}
                    >
                      <span className="material-symbols-outlined !text-xl">{link.icon}</span>
                      <span>{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Bottom Navigation (Mobile Only) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-1px_4px_rgba(0,0,0,0.08)] z-50">
        <div className="flex justify-around items-stretch h-16">
          {navLinks.map((link) => (
            <NavLink
              key={`mobile-${link.name}`}
              to={link.path}
              className={getMobileLinkClassName}
              end={link.path === '/'}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="mt-1">{link.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
