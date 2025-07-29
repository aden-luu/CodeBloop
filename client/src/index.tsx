import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ChakraProvider } from '@chakra-ui/react';
import FakeStackOverflow from './components/fakestackoverflow';
import { FakeSOSocket } from './types';
import theme from './constants/theme';

const container = document.getElementById('root');

const App = () => {
  const [socket, setSocket] = useState<FakeSOSocket | null>(null);

  const serverURL = process.env.REACT_APP_SERVER_URL;

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  if (serverURL === undefined) {
    throw new Error("Environment variable 'REACT_APP_SERVER_URL' must be defined");
  }

  if (clientId === undefined) {
    throw new Error("Environment variable 'REACT_APP_GOOGLE_CLIENT_ID' must be defined");
  }

  useEffect(() => {
    if (!socket) {
      setSocket(io(serverURL));
    }

    return () => {
      if (socket !== null) {
        socket.disconnect();
      }
    };
  }, [socket, serverURL]);

  return (
    <ChakraProvider theme={theme}>
      <GoogleOAuthProvider clientId={clientId}>
        <Router>
          <FakeStackOverflow socket={socket} />
        </Router>
      </GoogleOAuthProvider>
    </ChakraProvider>
  );
};

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
