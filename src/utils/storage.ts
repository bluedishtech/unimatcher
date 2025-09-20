import { Match } from '../types';

const MATCHES_STORAGE_KEY = 'uni-matcher-matches';

/**
 * Retrieves the list of matches from localStorage.
 * @returns An array of Match objects, or null if none are found.
 */
export const getMatches = (): Match[] | null => {
  try {
    const storedMatches = window.localStorage.getItem(MATCHES_STORAGE_KEY);
    if (storedMatches) {
      return JSON.parse(storedMatches) as Match[];
    }
    return null;
  } catch (error) {
    console.error("Error retrieving matches from storage:", error);
    return null;
  }
};

/**
 * Saves a list of matches to localStorage.
 * @param matches An array of Match objects to save.
 */
export const saveMatches = (matches: Match[]): void => {
  try {
    const data = JSON.stringify(matches);
    window.localStorage.setItem(MATCHES_STORAGE_KEY, data);
  } catch (error) {
    console.error("Error saving matches to storage:", error);
  }
};

/**
 * Clears all matches from localStorage.
 */
export const clearMatches = (): void => {
  try {
    window.localStorage.removeItem(MATCHES_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing matches from storage:", error);
  }
};
