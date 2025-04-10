// Helper functions for API calls

// Constants
const isDevelopment = process.env.NODE_ENV === 'development';
// Use local server in development, mock in production
const BASE_URL = isDevelopment ? 'http://localhost:3001' : '';
const API_BASE_URL = `${BASE_URL}/api`;

console.log('API Service initialized with BASE_URL:', BASE_URL, 'Environment:', process.env.NODE_ENV);

// Storage keys
const STORAGE_KEYS = {
  READING_DATA: 'astro_daily_reading',
  LAST_UPDATE: 'astro_last_update'
};

// Define Relationship Status options
export type RelationshipStatus = 
  | 'single' 
  | 'married' 
  | 'engaged' 
  | 'dating' 
  | 'just broke up';

// Types
export interface UserProfile {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthTime?: { hour: number; minute: number }; // Add optional birth time
  gender?: string; // Optional field for gender
  birthPlace?: string; // Optional field for birth place
  relationshipStatus?: RelationshipStatus; // Optional field for relationship status
}

export interface ReadingResponse {
  zodiac: string;
  hourZodiac?: string | null; // Add optional hour zodiac
  dominantElement: string;
  elementPercent: number;
  elementalBalance: Record<string, number>;
  reading: string;
  date: string;
}

/**
 * Fetches a daily reading based on birth information
 * Includes caching and retry logic
 * @param userProfile User birth information 
 * @returns Promise with the reading data
 */
export const getDailyReading = async (userProfile: UserProfile): Promise<ReadingResponse> => {
  try {
    console.log('getDailyReading called with profile:', userProfile);
    
    // Check if we need to refresh the reading
    const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
    const needsRefresh = !lastUpdate || shouldRefreshReading(lastUpdate);
    console.log('Reading needs refresh:', needsRefresh, 'Last update:', lastUpdate);
    
    // If we don't need to refresh, try to get cached data
    if (!needsRefresh) {
      const cachedData = localStorage.getItem(STORAGE_KEYS.READING_DATA);
      if (cachedData) {
        console.log('Using cached reading data');
        return JSON.parse(cachedData);
      }
    }
    
    // If we're in production, generate mock data without API call
    if (!isDevelopment) {
      console.log('Using mock data in production');
      return generateMockReading(userProfile);
    }
    
    // If we need new data, fetch from API
    return await fetchDailyReading(userProfile);
  } catch (error) {
    console.error('Error in getDailyReading:', error);
    
    // Try to return cached data as fallback
    try {
      const cachedData = localStorage.getItem(STORAGE_KEYS.READING_DATA);
      if (cachedData) {
        console.log('Using cached data after error');
        return JSON.parse(cachedData);
      }
    } catch (storageError) {
      console.error('Could not retrieve cached data:', storageError);
    }
    
    // If all fails, return mock data
    console.log('Falling back to mock data');
    return generateMockReading(userProfile);
  }
};

/**
 * Direct API call using Fetch API
 */
async function fetchDailyReading(userProfile: UserProfile): Promise<ReadingResponse> {
  console.log('Fetching daily reading from API with profile:', userProfile);
  
  const url = new URL(`${API_BASE_URL}/daily-reading`);
  url.searchParams.append('birthYear', userProfile.birthYear.toString());
  url.searchParams.append('birthMonth', userProfile.birthMonth.toString());
  url.searchParams.append('birthDay', userProfile.birthDay.toString());
  // Add birthHour if it exists in the profile
  if (userProfile.birthTime?.hour !== undefined) {
    url.searchParams.append('birthHour', userProfile.birthTime.hour.toString());
  }
  // Optionally add minute too if needed by backend later
  // if (userProfile.birthTime?.minute !== undefined) {
  //   url.searchParams.append('birthMinute', userProfile.birthTime.minute.toString());
  // }
  
  console.log('Fetch URL:', url.toString());
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }
  
  const data = await response.json();
  console.log('API response:', data);
  
  if (!data.success) {
    throw new Error('API response indicates failure');
  }
  
  // Cache the successful response
  const readingData = data.data;
  localStorage.setItem(STORAGE_KEYS.READING_DATA, JSON.stringify(readingData));
  localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
  
  return readingData;
}

/**
 * Clears cached reading data
 * Useful for testing or forcing a refresh
 */
export const clearCachedReading = async (): Promise<void> => {
  try {
    await localStorage.removeItem(STORAGE_KEYS.READING_DATA);
    await localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
    console.log('Cleared cached reading data');
  } catch (error) {
    console.error('Error clearing cached reading:', error);
    throw error;
  }
};

/**
 * Determines if the reading needs to be refreshed
 * Readings should update at midnight each day
 * @param lastUpdateTime The timestamp of the last reading update
 * @returns Boolean indicating if refresh is needed
 */
export const shouldRefreshReading = (lastUpdateTime: string): boolean => {
  const lastUpdate = new Date(lastUpdateTime);
  const now = new Date();
  
  // Check if it's a new day or if the stored date is invalid
  return (
    lastUpdate.getDate() !== now.getDate() ||
    lastUpdate.getMonth() !== now.getMonth() ||
    lastUpdate.getFullYear() !== now.getFullYear() ||
    isNaN(lastUpdate.getTime())
  );
};

// Generate mock reading data
const generateMockReading = (userProfile: UserProfile): ReadingResponse => {
  const zodiacSigns = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  
  // Determine zodiac based on birth year
  const birthYear = userProfile.birthYear;
  const zodiacIndex = (birthYear - 4) % 12;
  const zodiac = zodiacSigns[zodiacIndex >= 0 ? zodiacIndex : zodiacIndex + 12];
  
  // Generate random element balance
  const elementalBalance: Record<string, number> = {};
  let total = 0;
  elements.forEach(element => {
    elementalBalance[element] = Math.floor(Math.random() * 30) + 5;
    total += elementalBalance[element];
  });
  
  // Normalize to 100%
  Object.keys(elementalBalance).forEach(key => {
    elementalBalance[key] = Math.round(elementalBalance[key] / total * 100);
  });
  
  // Find dominant element
  let dominantElement = elements[0];
  let maxValue = elementalBalance[elements[0]];
  elements.forEach(element => {
    if (elementalBalance[element] > maxValue) {
      maxValue = elementalBalance[element];
      dominantElement = element;
    }
  });
  
  // Generate reading text based on zodiac and element
  const readings = [
    `Your ${zodiac} energy aligns with ${dominantElement} today, bringing clarity and purpose. Trust your instincts and embrace new opportunities that come your way.`,
    `As a ${zodiac}, your ${dominantElement} essence is particularly strong today. Focus on relationships and communication for best results.`,
    `The cosmic energies favor your ${zodiac} spirit today, with ${dominantElement} guiding your path. A perfect day for planning and strategic thinking.`,
    `Your ${zodiac} nature harmonizes beautifully with ${dominantElement} forces today. Express your creativity and don't be afraid to stand out.`,
    `Today your ${zodiac} characteristics blend powerfully with ${dominantElement} energy. Stay grounded while pursuing your ambitions.`
  ];
  
  const randomReading = readings[Math.floor(Math.random() * readings.length)];
  
  // Return mock data
  return {
    zodiac,
    dominantElement,
    elementPercent: maxValue,
    elementalBalance,
    reading: randomReading,
    date: new Date().toISOString()
  };
};

export default {
  getDailyReading,
  shouldRefreshReading,
  clearCachedReading,
}; 