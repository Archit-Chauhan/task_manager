// src/context/SocketContext.jsx

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';


const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [socket, setSocket] = useState(null);

  const memoizedSocket = useMemo(() => {
    return socket;
  }, [socket]);

  useEffect(() => {
    let newSocket;

    if (isAuthenticated && token) {
      console.log('Socket: Attempting to connect...');
      
     
      newSocket = io(SOCKET_SERVER_URL, {
        query: { token },
        transports: ['websocket', 'polling'], // Prioritize websockets
      });
      
      newSocket.on('connect', () => {
        console.log(`Socket: Connected successfully. ID: ${newSocket.id}`);
      });
      
      newSocket.on('disconnect', (reason) => {
        console.log(`Socket: Disconnected. Reason: ${reason}`);
      });
      
      // Add general error handling
      newSocket.on('connect_error', (error) => {
        console.error('Socket: Connection error:', error.message);
      });
      
      setSocket(newSocket);
      
    } else {
      
      if (socket) {
        console.log('Socket: Disconnecting due to unauthenticated state.');
        socket.close();
        setSocket(null);
      }
    }

   
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={memoizedSocket}>
      {children}
    </SocketContext.Provider>
  );
};


export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};