import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, MOBILE_CONTAINER } from '../styles/theme';

const Container = styled.div`
  ${MOBILE_CONTAINER}
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${COLORS.BLACK};
  padding: ${SPACING.MEDIUM}px;
  padding-bottom: ${SPACING.LARGE}px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${SPACING.LARGE}px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${COLORS.NEON_GREEN};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${SPACING.SMALL}px;
  margin-right: ${SPACING.MEDIUM}px;
`;

const Title = styled.h1`
  font-size: ${TYPOGRAPHY.HEADLINE.fontSize};
  font-weight: ${TYPOGRAPHY.HEADLINE.fontWeight};
  color: ${COLORS.NEON_PURPLE};
  text-align: center;
  flex: 1;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: ${SPACING.LARGE}px;
  border: 1px solid ${COLORS.NEON_GREEN};
  border-radius: 12px;
  padding: ${SPACING.MEDIUM}px;
  ${SHADOWS.NEON_GREEN}
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MEDIUM}px;
  padding-right: ${SPACING.SMALL}px;
  margin-bottom: ${SPACING.MEDIUM}px;

  /* Styling scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${COLORS.NEON_PURPLE};
    border-radius: 3px;
  }
`;

interface MessageProps {
  isUser: boolean;
}

const MessageBubble = styled.div<MessageProps>`
  max-width: 80%;
  padding: ${SPACING.MEDIUM}px;
  border-radius: 12px;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.isUser ? COLORS.NEON_PURPLE : COLORS.DARK_GRAY)};
  color: ${COLORS.WHITE};
  box-shadow: ${(props) => props.isUser 
    ? `0px 0px 8px 0px ${COLORS.NEON_PURPLE}` 
    : `0px 0px 8px 0px rgba(0, 0, 0, 0.5)`};
`;

const InputContainer = styled.div`
  display: flex;
  gap: ${SPACING.SMALL}px;
`;

const Input = styled.input`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${COLORS.NEON_GREEN};
  border-radius: 8px;
  padding: ${SPACING.MEDIUM}px;
  color: ${COLORS.WHITE};
  font-size: ${TYPOGRAPHY.BODY.fontSize};
  outline: none;

  &:focus {
    border-color: ${COLORS.NEON_PURPLE};
  }
`;

const SendButton = styled(motion.button)`
  background-color: ${COLORS.NEON_GREEN};
  border: none;
  border-radius: 8px;
  padding: ${SPACING.MEDIUM}px;
  color: ${COLORS.BLACK};
  font-weight: bold;
  cursor: pointer;
  ${SHADOWS.NEON_GREEN}
`;

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
  debugInfo?: string;
}

interface ApiError {
  response?: {
    status: number;
    data: {
      code?: number;
      message?: string;
      hint?: string;
    };
  };
  request?: any;
  message: string;
  code?: string;
  name?: string;
  stack?: string;
  config?: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    data?: string | Record<string, any>;
  };
}

const WEBHOOK_URL = 'https://pepsibasic.app.n8n.cloud/webhook-test/7909f9c7-932a-4b96-8c85-cd22cb17b312';
const CORS_PROXY_URL = 'https://corsproxy.io/?';
const isDevelopment = process.env.NODE_ENV === 'development';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Add user-friendly error messages
const getErrorMessage = (error: ApiError): string => {
  if (error.response) {
    // Server responded with error
    if (error.response.status === 404) {
      if (error.response.data.hint) {
        return `The Astro Master needs to be awakened. ${error.response.data.hint}`;
      }
      return "The Astro Master is currently in deep meditation. Please try again in a moment.";
    }
    return `Server error (${error.response.status}): ${error.response.data.message || 'Unknown error'}`;
  } else if (error.message === "Network Error") {
    return `Unable to reach the Astro Master (Network Error). This could be due to:
- The n8n server might be down or not responding
- CORS issues preventing the request
- Network connectivity problems
- Firewall or security settings blocking the request

Please try again in a few moments. The system will attempt to use alternative methods to reach the Astro Master.`;
  }
  return `Connection error: ${error.message}`;
};

// Add retry logic
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async (
  url: string, 
  data: any, 
  config: any, 
  retries: number = MAX_RETRIES
): Promise<any> => {
  try {
    return await axios.post(url, data, config);
  } catch (error) {
    if (retries === 0) throw error;
    
    const apiError = error as ApiError;
    if (apiError.response) {
      // Don't retry if we got a response (it's a server error)
      throw error;
    }
    
    // Wait before retrying
    await sleep(RETRY_DELAY);
    
    if (isDevelopment) {
      console.log(`Retrying request, ${retries} attempts remaining...`);
    }
    
    return retryRequest(url, data, config, retries - 1);
  }
};

// Add a mock response generator for fallback
const generateLocalResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Simple keyword-based responses
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    return "Greetings, seeker of celestial wisdom! How may I illuminate your path today?";
  } else if (lowerQuery.includes('luck') || lowerQuery.includes('future')) {
    return "The stars suggest a period of transformation ahead. Stay open to new opportunities, and fortune will favor your endeavors.";
  } else if (lowerQuery.includes('love') || lowerQuery.includes('relationship')) {
    return "Venus aligns favorably in your chart. This is an excellent time to nurture existing bonds or open your heart to new connections.";
  } else if (lowerQuery.includes('career') || lowerQuery.includes('job') || lowerQuery.includes('work')) {
    return "Mercury's position indicates favorable communication at work. Share your ideas confidently, as they are likely to be well-received.";
  } else if (lowerQuery.includes('health') || lowerQuery.includes('wellness')) {
    return "The celestial energies suggest focusing on balance. Integrate both rest and activity for optimal well-being during this cycle.";
  } else {
    return "The cosmic patterns relevant to your query are complex. I sense that patience and mindfulness will serve you well as the stars reveal their message over time.";
  }
};

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Welcome to AstroApp Chat! I am the Astro Master. How can I guide you on your celestial journey today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useLocalFallback, setUseLocalFallback] = useState<boolean>(false);
  const [useCorsProxy, setUseCorsProxy] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    setIsTyping(true);
    
    // If using local fallback after previous failures, don't attempt network request
    if (useLocalFallback) {
      await sleep(1000); // Simulate network delay
      const aiResponse = generateLocalResponse(input);
      
      const botMessage: Message = {
        text: aiResponse + "\n\n[Local Fallback Mode: Network connection issues detected]",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      return;
    }
    
    try {
      // Enhanced request configuration
      const config = {
        timeout: 15000, // 15 second timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        }
      };

      let targetUrl = WEBHOOK_URL;
      if (useCorsProxy) {
        targetUrl = CORS_PROXY_URL + encodeURIComponent(WEBHOOK_URL);
        if (isDevelopment) {
          console.log('Using CORS proxy:', targetUrl);
        }
      }

      if (isDevelopment) {
        console.log('Sending request to webhook:', {
          url: targetUrl,
          method: 'POST',
          headers: config.headers,
          payload: { message: input }
        });
      }

      // Use retry logic
      const response = await retryRequest(targetUrl, { message: input }, config);

      if (isDevelopment) {
        console.log('Webhook response:', response.data);
      }

      const aiResponse = response.data.output || "I apologize, but I'm having trouble processing that request.";
      
      const botMessage: Message = {
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Reset fallback states on successful request
      if (useCorsProxy) {
        // Keep using CORS proxy since it worked
        setUseLocalFallback(false);
      }
    } catch (error) {
      console.error('Error sending message to webhook:', error);
      
      const apiError = error as ApiError;
      let userFriendlyMessage = getErrorMessage(apiError);
      
      // Try CORS proxy if not already using it and it's a network error
      if (!useCorsProxy && apiError.message === "Network Error") {
        setUseCorsProxy(true);
        userFriendlyMessage += "\n\nTrying alternative connection method for your next message...";
      } 
      // If already using CORS proxy and still failing, suggest local fallback
      else if (useCorsProxy && apiError.message === "Network Error") {
        setUseLocalFallback(true);
        userFriendlyMessage += "\n\nSwitching to local fallback mode for future messages due to continued network issues.";
      }
      
      let errorDetails = '';
      if (isDevelopment) {
        errorDetails = '\n\nDebug Info:';
        if (apiError.response) {
          errorDetails += `\nStatus: ${apiError.response.status}
Response Data: ${JSON.stringify(apiError.response.data, null, 2)}`;
        } else if (apiError.request) {
          errorDetails += `\nNo response received from server
Request Details:
- URL: ${apiError.config?.url}
- Method: ${apiError.config?.method?.toUpperCase()}
- Headers: ${JSON.stringify(apiError.config?.headers, null, 2)}
- Data: ${typeof apiError.config?.data === 'string' ? apiError.config.data : JSON.stringify(apiError.config?.data, null, 2)}
Error Details:
- Code: ${apiError.code}
- Name: ${apiError.name}
- Message: ${apiError.message}`;
        } else {
          errorDetails += `\nError: ${apiError.message}`;
        }
        if (apiError.stack) {
          errorDetails += `\n\nStack Trace:\n${apiError.stack}`;
        }
      }

      const errorMessage: Message = {
        text: userFriendlyMessage + (isDevelopment ? errorDetails : ''),
        isUser: false,
        timestamp: new Date(),
        isError: true,
        debugInfo: isDevelopment ? JSON.stringify(error, null, 2) : undefined
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Add a function to reset network settings
  const resetNetworkSettings = () => {
    setUseLocalFallback(false);
    setUseCorsProxy(false);
    
    const systemMessage: Message = {
      text: "Network settings have been reset. The app will attempt to connect directly to the Astro Master on your next message.",
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBackClick}>←</BackButton>
        <Title>Astro Master Chat</Title>
      </Header>
      <ChatContainer>
        <MessagesContainer>
          {messages.map((message, index) => (
            <MessageBubble 
              key={index} 
              isUser={message.isUser}
              style={{
                backgroundColor: message.isError ? COLORS.DARK_RED : message.isUser ? COLORS.NEON_PURPLE : COLORS.DARK_GRAY,
                whiteSpace: 'pre-wrap' // To preserve formatting in error messages
              }}
            >
              {message.text}
              {isDevelopment && message.debugInfo && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '10px',
                  borderTop: `1px solid ${COLORS.WHITE}`,
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  opacity: 0.8
                }}>
                  {message.debugInfo}
                </div>
              )}
            </MessageBubble>
          ))}
          {isTyping && (
            <MessageBubble isUser={false}>
              The Astro Master is consulting the stars...
            </MessageBubble>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        {(useLocalFallback || useCorsProxy) && (
          <div style={{
            padding: '8px',
            marginBottom: '10px',
            fontSize: '12px',
            textAlign: 'center',
            color: COLORS.NEON_GREEN,
            cursor: 'pointer'
          }} onClick={resetNetworkSettings}>
            {useLocalFallback ? 'Using offline mode. Click to try reconnecting.' : 'Using CORS proxy. Click to reset.'}
          </div>
        )}
        <InputContainer>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleInputKeyPress}
            placeholder="Ask the Astro Master anything..."
          />
          <SendButton 
            onClick={() => handleSend()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default ChatScreen; 