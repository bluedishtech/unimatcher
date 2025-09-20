import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { seniors } from '../data';
import { freshmen } from '../data';
import { Match, User } from '../types';
import { saveMatches, getMatches, clearMatches } from '../utils/storage';
import { useNavigate } from 'react-router-dom';


// Fix: Per Gemini API guidelines, initialize with a named apiKey parameter from process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    description: "A list of matches, where each match assigns a group of freshmen to a senior.",
    items: {
        type: Type.OBJECT,
        properties: {
            seniorId: {
                type: Type.INTEGER,
                description: "The unique ID of the senior mentor."
            },
            freshmenIds: {
                type: Type.ARRAY,
                description: "An array of unique IDs for the freshmen assigned to this senior.",
                items: {
                    type: Type.INTEGER
                }
            }
        },
        required: ["seniorId", "freshmenIds"]
    }
};

const formatResultsForExport = (matches: Match[], format: 'csv' | 'json' | 'txt') => {
    const lines: string[] = [];
    switch (format) {
        case 'csv':
            lines.push('Ancien_ID,Ancien_Nom,Nouveau_ID,Nouveau_Nom');
            matches.forEach(({ senior, freshmen }) => {
                if (freshmen.length === 0) {
                    lines.push(`${senior.id},"${senior.name} ${senior.surname}",,`);
                } else {
                    freshmen.forEach(f => {
                        lines.push(`${senior.id},"${senior.name} ${senior.surname}",${f.id},"${f.name} ${f.surname}"`);
                    });
                }
            });
            return lines.join('\n');
        case 'json':
            return JSON.stringify(matches, null, 2);
        case 'txt':
        default:
            matches.forEach(({ senior, freshmen }) => {
                lines.push(`\n## Mentor : ${senior.name} ${senior.surname} ##`);
                if (freshmen.length > 0) {
                    freshmen.forEach(f => lines.push(`- ${f.name} ${f.surname}`));
                } else {
                    lines.push("- Aucun nouveau assigné.");
                }
            });
            return `Résultats du tirage Uni Matcher :\n${lines.join('\n')}`;
    }
};


const Randomize: React.FC = () => {
    const [matches, setMatches] = useState<Match[] | null>(() => getMatches());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const generatePrompt = () => {
        const seniorsData = seniors.map(({ id, name, surname }) => ({ id, name, surname }));
        const freshmenData = freshmen.map(({ id, name, surname }) => ({ id, name, surname }));

        return `
            You are a university mentorship program coordinator responsible for matching senior students with incoming freshmen. Your goal is to create balanced and equitable groups.

            Rules:
            1. Every freshman MUST be assigned to exactly one senior.
            2. Distribute the freshmen as evenly as possible among the available seniors.
            3. The output MUST be a valid JSON array that conforms to the provided schema. Do not include any text, explanations, or markdown formatting outside of the JSON array itself.

            Here are the participants:

            Seniors available for mentorship:
            ${JSON.stringify(seniorsData, null, 2)}

            Freshmen to be assigned:
            ${JSON.stringify(freshmenData, null, 2)}

            Please generate the mentorship matches based on these lists.
        `;
    };

    const handleRandomize = async () => {
        if (seniors.length === 0 || freshmen.length === 0) {
            setError("Il faut au moins un ancien et un nouveau pour lancer le tirage.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setMatches(null);
        clearMatches();

        try {
            const prompt = generatePrompt();
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });
            
            const jsonText = response.text.trim();
            const resultData = JSON.parse(jsonText) as { seniorId: number, freshmenIds: number[] }[];

            const seniorMap = new Map<number, User>(seniors.map(s => [s.id, s]));
            const freshmanMap = new Map<number, User>(freshmen.map(f => [f.id, f]));
            
            const newMatches: Match[] = resultData
                .map(match => {
                    const senior = seniorMap.get(match.seniorId);
                    if (!senior) return null;
                    const assignedFreshmen = match.freshmenIds
                        .map(id => freshmanMap.get(id))
                        .filter((f): f is User => f !== undefined);
                    return { senior, freshmen: assignedFreshmen };
                })
                .filter((m): m is Match => m !== null);

            const assignedFreshmenIds = new Set(newMatches.flatMap(m => m.freshmen.map(f => f.id)));
            if (assignedFreshmenIds.size !== freshmen.length) {
                setError("Certains nouveaux n'ont pas pu être assignés. Veuillez réessayer.");
            } else {
                 setMatches(newMatches);
                 saveMatches(newMatches);
            }

        } catch (err) {
            console.error("Error during randomization:", err);
            setError("Une erreur est survenue lors de la génération des matchs. Vérifiez votre clé API et la console pour plus de détails.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = (format: 'csv' | 'json' | 'txt') => {
        if (!matches) return;
        const content = formatResultsForExport(matches, format);
        const blob = new Blob([content], { type: `text/${format};charset=utf-8;` });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `uni-matcher-resultats.${format}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (!matches) return;
        const textToShare = formatResultsForExport(matches, 'txt');
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Résultats du Tirage Uni Matcher',
                    text: textToShare,
                });
            } catch (error) {
                console.error('Erreur lors du partage:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(textToShare);
                alert('Résultats copiés dans le presse-papiers !');
            } catch (error) {
                console.error('Erreur lors de la copie:', error);
                alert('La copie a échoué.');
            }
        }
    };

    const handleReset = () => {
      clearMatches();
      setMatches(null);
      setError(null);
    }
    
    // --- Render logic ---

    if (matches) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600">Tirage effectué !</h1>
                    <p className="text-slate-600 mt-2">Les résultats ont été générés et sauvegardés.</p>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                    <div className="flex items-center justify-center bg-green-50 text-green-800 p-4 rounded-lg mb-8">
                       <span className="material-symbols-outlined mr-3">check_circle</span>
                       <p>Vous pouvez consulter les matchs détaillés sur la page "Matchs" ou les exporter ci-dessous.</p>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-center text-slate-700 mb-4">Exporter ou Partager</h3>
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                           <button onClick={() => handleDownload('csv')} className="inline-flex items-center justify-center py-2 px-4 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white transition-colors hover:bg-slate-50 hover:border-slate-400">Export CSV</button>
                           <button onClick={() => handleDownload('json')} className="inline-flex items-center justify-center py-2 px-4 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white transition-colors hover:bg-slate-50 hover:border-slate-400">Export JSON</button>
                           <button onClick={() => handleDownload('txt')} className="inline-flex items-center justify-center py-2 px-4 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white transition-colors hover:bg-slate-50 hover:border-slate-400">Export TXT</button>
                           <button onClick={handleShare} className="inline-flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 transition-colors hover:bg-blue-700">Partager</button>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                         <button onClick={handleReset} className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                             <span className="material-symbols-outlined align-middle mr-1">refresh</span>
                             Relancer un nouveau tirage
                         </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-indigo-600">Tirage au sort</h1>
                <p className="text-slate-600 mt-2">Générez les groupes de mentorat entre anciens et nouveaux.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-center">
                    <div className="bg-sky-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-sky-800">Anciens Disponibles</h3>
                        <p className="text-4xl font-bold text-sky-600">{seniors.length}</p>
                    </div>
                     <div className="bg-indigo-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-indigo-800">Nouveaux à Assigner</h3>
                        <p className="text-4xl font-bold text-indigo-600">{freshmen.length}</p>
                    </div>
                </div>
                
                <div className="text-center border-t pt-8">
                    <p className="text-slate-700 mb-6">
                        Cliquez sur le bouton ci-dessous pour lancer le tirage.
                    </p>
                    <button
                        onClick={handleRandomize}
                        disabled={isLoading}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Génération en cours...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined mr-2">shuffle</span>
                                Lancer le tirage
                            </>
                        )}
                    </button>
                    {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Randomize;
