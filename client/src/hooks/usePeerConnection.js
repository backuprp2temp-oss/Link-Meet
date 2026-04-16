import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

function usePeerConnection(roomId, localStream) {
  const [peers, setPeers] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const peersRef = useRef({});

  // Connect to Socket.io server when component mounts
  useEffect(() => {
    if (!localStream) return;

    console.log('[PEER] Initializing peer connection for room:', roomId);
    
    // Connect to Socket.io server
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    socketRef.current = io.connect(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    // Handle socket connection
    socketRef.current.on('connect', () => {
      console.log('[PEER] Connected to signaling server');
      setIsConnected(true);
      
      // Join the room
      socketRef.current.emit('join-room', roomId, socketRef.current.id);
      console.log('[PEER] Joined room:', roomId);
    });

    // Handle room joined confirmation
    socketRef.current.on('room-joined', (roomId) => {
      console.log('[PEER] Successfully joined room:', roomId);
    });

    // Listen for new users connecting to the room
    socketRef.current.on('user-connected', (userId) => {
      console.log('[PEER] New user connected:', userId);
      createPeer(userId, localStream, true);
    });

    // Listen for incoming signals from other peers
    socketRef.current.on('receiving-signal', ({ signal, userId }) => {
      console.log('[PEER] Receiving signal from:', userId);
      
      // Check if we already have a peer connection with this user
      if (peersRef.current[userId]) {
        peersRef.current[userId].signal(signal);
      } else {
        // Create peer connection as receiver
        createPeer(userId, localStream, false, signal);
      }
    });

    // Handle disconnection
    socketRef.current.on('disconnect', () => {
      console.log('[PEER] Disconnected from signaling server');
      setIsConnected(false);
    });

    // Handle socket errors
    socketRef.current.on('connect_error', (error) => {
      console.error('[PEER] Connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      console.log('[PEER] Cleaning up peer connections');
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      // Destroy all peer connections
      Object.values(peersRef.current).forEach(peer => {
        if (peer) peer.destroy();
      });
      peersRef.current = {};
    };
  }, [roomId, localStream]);

  // Function to create a peer connection
  const createPeer = useCallback((userId, stream, initiator, incomingSignal = null) => {
    console.log(`[PEER] Creating peer connection with ${userId} (initiator: ${initiator})`);
    
    const peer = new Peer({
      initiator: initiator,
      stream: stream,
      trickle: false, // Wait for complete signal before sending
    });

    // Store peer reference
    peersRef.current[userId] = peer;

    // When peer generates signal data (offer or answer)
    peer.on('signal', (signal) => {
      console.log('[PEER] Generated signal, sending to:', userId);
      socketRef.current.emit('signal-data', {
        signal,
        targetUserId: userId
      });
    });

    // When peer receives stream from remote user
    peer.on('stream', (remoteStream) => {
      console.log('[PEER] Received remote stream from:', userId);
      
      // Update state with the remote stream
      setPeers(prev => ({
        ...prev,
        [userId]: { 
          peer, 
          stream: remoteStream,
          name: `User ${userId.substring(0, 6)}`
        }
      }));
    });

    // Handle peer connection close
    peer.on('close', () => {
      console.log('[PEER] Peer connection closed:', userId);
      removePeer(userId);
    });

    // Handle peer errors
    peer.on('error', (err) => {
      console.error('[PEER] Peer error:', err);
      removePeer(userId);
    });

    // If there's an incoming signal, use it to connect
    if (incomingSignal) {
      peer.signal(incomingSignal);
    }

    // Add to state immediately for initiator
    if (initiator) {
      setPeers(prev => ({
        ...prev,
        [userId]: { peer, stream: null, name: `User ${userId.substring(0, 6)}` }
      }));
    }
  }, []);

  // Function to remove peer from state
  const removePeer = useCallback((userId) => {
    console.log('[PEER] Removing peer:', userId);
    
    if (peersRef.current[userId]) {
      peersRef.current[userId].destroy();
      delete peersRef.current[userId];
    }
    
    setPeers(prev => {
      const newPeers = { ...prev };
      delete newPeers[userId];
      return newPeers;
    });
  }, []);

  return { 
    peers, 
    socket: socketRef.current, 
    isConnected,
    peersRef 
  };
}

export default usePeerConnection;
