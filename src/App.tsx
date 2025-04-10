import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import DailyReading from './components/DailyReading';
import BirthDateForm from './components/settings/BirthDateForm';
import ChatScreen from './components/ChatScreen';
import { COLORS } from './styles/theme';
import { UserProfile } from './services/api'; // Import UserProfile type

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${COLORS.BLACK};
    color: ${COLORS.WHITE};
    min-height: 100vh;
    width: 100%;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  color: ${COLORS.NEON_PURPLE};
  font-size: 1.5rem;
`;

// LocalStorage key
const BIRTH_DATE_KEY = 'astro_app_birth_date';

function App() {
  // Use UserProfile type for state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load birth date from localStorage on initial mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(BIRTH_DATE_KEY);
      if (storedData) {
        // Parse and validate against UserProfile structure
        const parsedData: UserProfile = JSON.parse(storedData);
        if (parsedData && typeof parsedData.birthYear === 'number' && 
            typeof parsedData.birthMonth === 'number' && typeof parsedData.birthDay === 'number') {
          setUserProfile(parsedData); // Set state with UserProfile type
        }
      }
    } catch (error) {
      console.error("Error loading birth date from storage:", error);
      localStorage.removeItem(BIRTH_DATE_KEY);
    }
    setIsLoading(false);
  }, []);

  // Handle form submission - Accept the full UserProfile
  const handleBirthDateSubmit = (profile: UserProfile) => {
    console.log("User profile submitted:", profile);
    setUserProfile(profile); // Update state with the received profile
    try {
      // Save the received UserProfile object directly
      localStorage.setItem(BIRTH_DATE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error("Error saving user profile to storage:", error);
      alert("Could not save user profile. Please try again.");
    }
  };

  const content = isLoading ? (
    <LoadingContainer>Loading...</LoadingContainer>
  ) : (
    <AppContainer>
      <Routes>
        <Route path="/" element={
          userProfile ? <DailyReading userProfile={userProfile} /> : <BirthDateForm initialProfile={userProfile || {}} onSubmit={handleBirthDateSubmit} />
        } />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContainer>
  );

  return (
    <Router>
      <GlobalStyle />
      {content}
    </Router>
  );
}

export default App;
