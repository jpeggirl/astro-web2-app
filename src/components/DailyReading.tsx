import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, MOBILE_CONTAINER } from '../styles/theme';
import { getDailyReading, clearCachedReading, UserProfile, ReadingResponse } from '../services/api';
import ZodiacIcon from './zodiac/ZodiacIcon';
import ElementalBalanceChart from './elements/ElementalBalanceChart';
import { generateShareImage } from '../utils/imageGenerator';

// Remove mockUserProfile
// const mockUserProfile: UserProfile = { ... };

// Fallback mock data in case API fails - Ensure all fields are present
const fallbackData: ReadingResponse = {
  zodiac: 'Dragon',
  dominantElement: 'Fire',
  elementPercent: 40,
  elementalBalance: { // Make sure this field matches the type
    Wood: 20,
    Fire: 40,
    Earth: 15,
    Metal: 10,
    Water: 15,
  },
  reading: 'Your Dragon\'s a chaotic visionary, Fire\'s lit but reckless—slaps harder than a K-pop stan comeback. Try not to overthink every text today. The universe has spoken.',
  date: new Date().toISOString()
};

// Define props for DailyReading
interface DailyReadingProps {
  userProfile: UserProfile;
}

// Styled components
const Container = styled.div`
  ${MOBILE_CONTAINER}
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${COLORS.BLACK};
  padding: ${SPACING.MEDIUM}px;
  padding-bottom: ${SPACING.LARGE}px;
`;

const Card = styled.div`
  flex: 1;
  background-color: ${COLORS.BLACK};
  border: 1px solid ${COLORS.NEON_GREEN};
  border-radius: 12px;
  padding: ${SPACING.LARGE}px;
  margin-top: ${SPACING.SMALL}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  ${SHADOWS.NEON_GREEN}
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: ${TYPOGRAPHY.HEADLINE.fontSize};
  font-weight: ${TYPOGRAPHY.HEADLINE.fontWeight};
  color: ${COLORS.NEON_PURPLE};
  margin-bottom: ${SPACING.MEDIUM}px;
  text-align: center;
`;

const ZodiacText = styled.h2`
  font-size: ${TYPOGRAPHY.SUBHEADLINE.fontSize};
  font-weight: ${TYPOGRAPHY.SUBHEADLINE.fontWeight};
  color: ${COLORS.NEON_GREEN};
  margin-top: ${SPACING.MEDIUM}px;
  margin-bottom: ${SPACING.MEDIUM}px;
`;

const ReadingText = styled(motion.p)`
  font-size: ${TYPOGRAPHY.BODY.fontSize};
  color: ${COLORS.WHITE};
  text-align: center;
  margin-bottom: ${SPACING.LARGE}px;
  line-height: 1.5;
`;

const ElementContainer = styled.div`
  width: 100%;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: ${SPACING.LARGE}px;
`;

interface ElementBarProps {
  width: string;
  color: string;
}

const ElementBar = styled.div<ElementBarProps>`
  width: ${(props: ElementBarProps) => props.width};
  height: 100%;
  background-color: ${(props: ElementBarProps) => props.color};
  border-radius: 15px;
`;

const ElementText = styled.p`
  font-size: ${TYPOGRAPHY.CAPTION.fontSize};
  color: ${COLORS.WHITE};
  margin-top: ${SPACING.SMALL}px;
  margin-bottom: ${SPACING.MEDIUM}px;
`;

const ShareButton = styled(motion.button)`
  background-color: ${COLORS.NEON_PURPLE};
  border: 3px solid ${COLORS.WHITE};
  border-radius: 25px;
  padding: ${SPACING.MEDIUM}px ${SPACING.LARGE}px;
  margin-top: auto;
  color: ${COLORS.WHITE};
  font-size: ${TYPOGRAPHY.BUTTON.fontSize};
  font-weight: bold;
  cursor: pointer;
  ${SHADOWS.NEON_PURPLE}
  width: 100%;
  max-width: 300px;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    background-color: ${COLORS.WHITE};
    color: ${COLORS.NEON_PURPLE};
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface OnlineProps {
  isOnline: boolean;
}

const ConnectionStatusBar = styled.div<OnlineProps>`
  background-color: ${(props: OnlineProps) => props.isOnline ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
  padding: 4px 8px;
  margin-bottom: ${SPACING.SMALL}px;
  border-radius: 4px;
  width: 100%;
  text-align: center;
`;

const ConnectionStatusText = styled.p<OnlineProps>`
  color: ${(props: OnlineProps) => props.isOnline ? COLORS.NEON_GREEN : '#ff5555'};
  font-size: ${TYPOGRAPHY.CAPTION.fontSize};
  margin: 0;
`;

const LastUpdatedText = styled.p`
  color: ${COLORS.GRAY};
  font-size: calc(${TYPOGRAPHY.CAPTION.fontSize} - 2px);
  margin-top: ${SPACING.LARGE}px;
  text-align: center;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${SPACING.LARGE}px;
`;

const ErrorText = styled.p`
  color: ${COLORS.NEON_PURPLE};
  font-size: ${TYPOGRAPHY.BODY.fontSize};
  text-align: center;
  margin-bottom: ${SPACING.LARGE}px;
`;

const RetryButton = styled.button`
  background-color: ${COLORS.BLACK};
  border: 2px solid ${COLORS.NEON_GREEN};
  border-radius: 25px;
  padding: ${SPACING.MEDIUM}px ${SPACING.LARGE}px;
  color: ${COLORS.NEON_GREEN};
  font-size: ${TYPOGRAPHY.BUTTON.fontSize};
  font-weight: ${TYPOGRAPHY.BUTTON.fontWeight};
  cursor: pointer;
  ${SHADOWS.NEON_GREEN}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SpinnerContainer = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(161, 0, 255, 0.1);
  border-radius: 50%;
  border-top-color: ${COLORS.NEON_PURPLE};
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: ${SPACING.LARGE}px;
`;

const DailyReading: React.FC<DailyReadingProps> = ({ userProfile }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReadingResponse | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isOnline, setIsOnline] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Check network status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // Fetch data using the passed userProfile
  const fetchDailyReading = React.useCallback(async (forceRefresh = false) => {
    console.log(`Fetching daily reading for profile:`, userProfile, `Force refresh: ${forceRefresh}`);
    setLoading(true);
    setError(null);
    try {
      if (forceRefresh) {
        console.log("Clearing cache for forced refresh...");
        await clearCachedReading();
      }
      // Use the passed userProfile prop here
      const response = await getDailyReading(userProfile); 
      console.log("API Response received:", response);
      setData(response);
      setLastUpdate(new Date().toISOString());
    } catch (fetchError) {
      console.error('Error fetching reading:', fetchError);
      const cachedData = localStorage.getItem('astro_daily_reading');
      if (cachedData) {
        console.log("Using cached data after fetch error.");
        setData(JSON.parse(cachedData));
        setError('Could not refresh data. Showing last saved reading.');
      } else {
        console.log("No cached data available, setting data to null.");
        setData(null); // Set data to null on error if no cache
        setError('Could not connect to the server.');
      }
    } finally {
      setLoading(false);
      console.log("Finished fetching daily reading.");
    }
  }, [userProfile]);
  
  // Helper function to get element color
  const getElementColor = (element: string) => {
    switch (element.toLowerCase()) {
      case 'wood': return '#4CAF50';
      case 'fire': return '#FF5722';
      case 'earth': return '#8D6E63';
      case 'metal': return '#9E9E9E';
      case 'water': return '#2196F3';
      default: return COLORS.GRAY;
    }
  };

  // Convert data URL to Blob
  const dataURLtoBlob = (dataurl: string): Blob | null => {
    try {
      const arr = dataurl.split(',');
      if (arr.length < 2) throw new Error('Invalid data URL');
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) throw new Error('Could not parse MIME type');
      const mime = mimeMatch[1];
      const bstr = atob(arr[arr.length - 1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch (e) {
      console.error('Error converting data URL to blob:', e);
      return null;
    }
  };

  // Function to trigger image download
  const triggerDownload = (imageDataUrl: string) => {
    console.log('Triggering image download...');
    try {
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = `astroapp-reading-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Download triggered.');
      alert('Share image downloaded! (Web Share API not available)');
    } catch (err) {
      console.error("Error triggering download:", err);
      alert("Failed to download image.");
    }
  };

  // Function to handle chat button press
  const handleChatPress = () => {
    console.log('Chat button pressed');
    navigate('/chat');
  };

  // Format the last updated time
  const formatLastUpdated = (dateString: string) => {
    try {
      if (!dateString) return 'Last updated: Unknown';
      const date = new Date(dateString);
      return `Last updated: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Last updated: Invalid date';
    }
  };
  
  // useEffect to fetch data on mount and check for midnight update
  useEffect(() => {
    fetchDailyReading(); // Fetch using the current userProfile

    // Check for midnight crossing
    const checkMidnight = () => {
      const now = new Date();
      const lastStoredUpdate = localStorage.getItem('astro_last_update');
      if (lastStoredUpdate) {
        const lastDate = new Date(lastStoredUpdate);
        if (now.getDate() !== lastDate.getDate() || 
            now.getMonth() !== lastDate.getMonth() || 
            now.getFullYear() !== lastDate.getFullYear()) {
          console.log("Midnight crossed! Fetching new reading.");
          fetchDailyReading(true); // Force refresh after midnight
        }
      }
    };

    // Check immediately and then set an interval
    checkMidnight();
    const intervalId = setInterval(checkMidnight, 60 * 1000); // Check every minute

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);

  }, [fetchDailyReading, userProfile]); // Add userProfile dependency here too

  // Main content render
  if (!data) {
      // Handles both initial null state and error state where data becomes null
      return (
        <Container>
          <ConnectionStatusBar isOnline={isOnline}>
             <ConnectionStatusText isOnline={isOnline}>
               {isOnline ? 'Connected' : 'Offline Mode'}
             </ConnectionStatusText>
          </ConnectionStatusBar>
          {loading ? (
            <LoadingContainer><SpinnerContainer /></LoadingContainer>
          ) : (
            <ErrorContainer>
              <ErrorText>{error || 'No reading data available. Please try refreshing.'}</ErrorText>
              <RetryButton onClick={() => fetchDailyReading(true)}>Refresh</RetryButton>
            </ErrorContainer>
          )}
        </Container>
      );
  }

  return (
    <Container>
      <ConnectionStatusBar isOnline={isOnline}>
         <ConnectionStatusText isOnline={isOnline}>
           {isOnline ? 'Connected' : 'Offline Mode'}
         </ConnectionStatusText>
      </ConnectionStatusBar>
      
      <Card ref={cardRef}>
        <ContentContainer>
          <Title>AstroApp Daily Reading</Title>
          <ZodiacIcon zodiacSign={data.zodiac} size={80} animated={true} />
          <ZodiacText>Your Year Zodiac: {data.zodiac}</ZodiacText>
          <ReadingText
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
          >
             {data.reading}
          </ReadingText>
          <ElementalBalanceChart balance={data.elementalBalance} />
        </ContentContainer>
        <ShareButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleChatPress}
        >
          Ask the Master anything
        </ShareButton>
        {error && (
          <ErrorText style={{ color: COLORS.GRAY, marginTop: SPACING.MEDIUM, fontSize: '0.8rem' }}>
            {error}
          </ErrorText>
        )}
        <LastUpdatedText>
          {formatLastUpdated(lastUpdate || data.date)}
        </LastUpdatedText>
      </Card>
    </Container>
  );
};

export default DailyReading; 