# Detailed Implementation Plan: Google Meet Clone

## 📋 Project Overview
A fully functional Google Meet clone with video calling, meeting rooms, screen sharing, and call controls built with React + Node.js + Simple Peer (WebRTC).

---

## 🏗️ Phase 1: Environment Setup & Project Structure (Day 1)

### 1.1 Install Prerequisites
- **Node.js & npm**: Install from nodejs.org (LTS version)
- **Code Editor**: VS Code recommended
- **Browser**: Chrome/Edge (best WebRTC support)
- **Verify Installation**: Run `node --version` and `npm --version`

### 1.2 Create Project Structure
```bash
# Create root folder
mkdir google-meet-clone
cd google-meet-clone

# Initialize backend
mkdir server
cd server
npm init -y

# Initialize frontend
cd ..
npm create vite@latest client -- --template react
cd client
npm install
```

### 1.3 Install Dependencies

**Server Dependencies:**
```bash
npm install express socket.io cors dotenv
npm install --save-dev nodemon
```

**Client Dependencies:**
```bash
npm install simple-peer socket.io-client
npm install react-router-dom
```

### 1.4 Configure Development Environment
- Setup `nodemon` for auto-restart (server)
- Configure Vite proxy for development
- Create `.env` files for environment variables
- Setup basic folder structure

---

## 🔌 Phase 2: Backend - Socket.io Signaling Server (Day 2)

### 2.1 Create Express Server
**File: `server/index.js`**
```javascript
// Setup Express server with Socket.io
// Configure CORS for client connection
// Setup basic routes
// Start server on port 5000
```

**What it does:**
- Creates HTTP server using Express
- Attaches Socket.io for real-time communication
- Enables CORS so React client can connect
- Listens for incoming connections

### 2.2 Setup Socket.io Event Handlers
**Events to handle:**

| Event Name | Direction | Purpose |
|------------|-----------|---------|
| `join-room` | Client → Server | User joins a meeting room |
| `user-connected` | Server → Client | Notify others a user joined |
| `user-disconnected` | Server → Client | Notify when user leaves |
| `signal-data` | Client → Client (via server) | Exchange WebRTC signals |
| `receiving-signal` | Client → Client (via server) | Receive signal from peer |

**Implementation:**
```javascript
io.on('connection', (socket) => {
  // Handle user joining room
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    // Notify others in room
    socket.to(roomId).emit('user-connected', userId);
  });

  // Handle signaling data exchange
  socket.on('signal-data', ({ signal, targetUserId }) => {
    io.to(targetUserId).emit('receiving-signal', { signal, userId: socket.id });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Notify room of disconnection
  });
});
```

### 2.3 Test Socket.io Connection
- Create test endpoint
- Use Socket.io client to verify connection
- Check console logs for join/leave events

---

## 🎨 Phase 3: Frontend - Basic UI Setup (Day 3-4)

### 3.1 Setup React Router
**File: `client/src/App.jsx`**
```javascript
// Define routes:
// '/' -> Home page (create/join meeting)
// '/meet/:roomId' -> Meeting room page
```

### 3.2 Create Home Page Component
**File: `client/src/pages/Home.jsx`**

**Features:**
- Input field for meeting code
- "New Meeting" button (generates unique room ID)
- "Join Meeting" button (validates and navigates to room)
- Google Meet-like styling

**Logic:**
```javascript
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 10);
};

const handleNewMeeting = () => {
  const roomId = generateRoomId();
  navigate(`/meet/${roomId}`);
};
```

### 3.3 Create Meeting Room Component
**File: `client/src/pages/MeetingRoom.jsx`**

**Initial Structure:**
```javascript
function MeetingRoom() {
  const { roomId } = useParams();
  
  return (
    <div className="meeting-room">
      <VideoGrid>
        {/* Local video stream */}
        {/* Remote video stream(s) */}
      </VideoGrid>
      <Controls>
        {/* Mute/Unmute button */}
        {/* Camera on/off button */}
        {/* Screen share button */}
        {/* Leave meeting button */}
      </Controls>
    </div>
  );
}
```

### 3.4 Create UI Components
**Components to build:**

1. **`VideoCard.jsx`** - Individual video stream display
   - Shows video stream
   - Shows participant name
   - Mute indicator

2. **`Controls.jsx`** - Bottom control bar
   - Mute/Unmute microphone button
   - Camera on/off button
   - Screen share toggle
   - Leave meeting (red button)
   - Each button with icons and tooltips

3. **`VideoGrid.jsx`** - Layout manager
   - 1 person: Full screen
   - 2 people: Side by side
   - Responsive grid

### 3.5 Add Basic Styling
**File: `client/src/index.css`**
- Dark theme (like Google Meet)
- Responsive layout
- Button hover effects
- Video container styling

---

## 📹 Phase 4: Camera & Microphone Access (Day 5)

### 4.1 Get User Media (Local Stream)
**File: `client/src/hooks/useLocalStream.js`**

```javascript
import { useState, useEffect } from 'react';

function useLocalStream() {
  const [localStream, setLocalStream] = useState(null);
  
  useEffect(() => {
    // Get camera and microphone access
    navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    })
    .then(stream => setLocalStream(stream))
    .catch(err => console.error('Error accessing media devices:', err));
    
    // Cleanup on unmount
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);
  
  return localStream;
}
```

**What it does:**
- Requests access to camera and microphone
- Stores the media stream in state
- Properly cleans up when component unmounts
- Returns stream to be used in video element

### 4.2 Display Local Video
**Update VideoCard component:**
```javascript
function VideoCard({ stream, isLocal }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  
  return (
    <div className="video-card">
      <video ref={videoRef} autoPlay muted={isLocal} playsInline />
      <span className="participant-name">{isLocal ? 'You' : 'Participant'}</span>
    </div>
  );
}
```

**Key Points:**
- `autoPlay`: Video plays automatically
- `muted={isLocal}`: Mute local video to prevent feedback
- `playsInline`: Required for mobile browsers

### 4.3 Handle Permissions
- Show permission request dialog
- Handle denied permissions gracefully
- Show error message if camera/mic not available

---

## 🔗 Phase 5: WebRTC Video Calling with Simple Peer (Day 6-8)

### 5.1 Understanding the Signaling Process

**How two peers connect:**

```
Peer A                          Server                          Peer B
  |                               |                               |
  |--1. Create offer signal------>|                               |
  |                               |---2. Forward signal---------->|
  |                               |                               |
  |                               |<--3. Create answer signal-----|
  |<--4. Forward answer signal----|                               |
  |                               |                               |
  |=======5. Direct P2P Connection Established===================|
```

### 5.2 Create Custom Hook for Peer Connection
**File: `client/src/hooks/usePeerConnection.js`**

```javascript
import { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

function usePeerConnection(roomId) {
  const [peers, setPeers] = useState({});
  const socketRef = useRef();
  const localStreamRef = useRef();
  
  useEffect(() => {
    // 1. Connect to Socket.io server
    socketRef.current = io.connect('http://localhost:5000');
    
    // 2. Get local stream (from Phase 4)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        
        // 3. Join the room
        socketRef.current.emit('join-room', roomId, socketRef.current.id);
        
        // 4. Listen for new users connecting
        socketRef.current.on('user-connected', (userId) => {
          console.log('User connected:', userId);
          // Create new peer connection to this user
          connectPeer(userId, stream);
        });
      });
    
    // 5. Listen for incoming signals
    socketRef.current.on('receiving-signal', ({ signal, userId }) => {
      peers[userId]?.signal(signal);
    });
    
    // Cleanup
    return () => {
      socketRef.current.disconnect();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [roomId]);
  
  // Function to create peer connection
  const connectPeer = (userId, stream) => {
    const peer = new Peer({
      initiator: true, // This peer starts the connection
      stream: stream,
      trickle: false // Simpler signaling (all at once)
    });
    
    // When peer generates signal data
    peer.on('signal', (signal) => {
      socketRef.current.emit('signal-data', {
        signal,
        targetUserId: userId
      });
    });
    
    // When peer receives stream from other user
    peer.on('stream', (remoteStream) => {
      setPeers(prev => ({
        ...prev,
        [userId]: { peer, stream: remoteStream }
      }));
    });
    
    setPeers(prev => ({ ...prev, [userId]: { peer, stream: null } }));
  };
  
  return { peers, localStream: localStreamRef.current, socket: socketRef.current };
}
```

### 5.3 Integrate Peer Connection in Meeting Room
**Update MeetingRoom.jsx:**
```javascript
function MeetingRoom() {
  const { roomId } = useParams();
  const { peers, localStream } = usePeerConnection(roomId);
  
  return (
    <div className="meeting-room">
      <VideoGrid>
        {/* Local video */}
        <VideoCard stream={localStream} isLocal={true} />
        
        {/* Remote videos */}
        {Object.keys(peers).map(userId => (
          <VideoCard 
            key={userId} 
            stream={peers[userId].stream} 
            isLocal={false} 
          />
        ))}
      </VideoGrid>
      <Controls />
    </div>
  );
}
```

### 5.4 Handle Edge Cases
- User denies camera access
- Peer disconnects unexpectedly
- Multiple users in room (handle all connections)
- Reconnection logic

---

## 🎛️ Phase 6: Call Controls (Day 9-10)

### 6.1 Mute/Unmute Microphone
**File: `client/src/hooks/useMediaControls.js`**

```javascript
function useMediaControls(stream) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };
  
  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };
  
  return { isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo };
}
```

**How it works:**
- Gets the audio/video track from the stream
- Toggles the `enabled` property
- Updates UI state to reflect changes

### 6.2 Update Controls Component
**File: `client/src/components/Controls.jsx`**

```javascript
function Controls({ isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo, onLeave }) {
  return (
    <div className="controls">
      <button onClick={toggleAudio} className={isAudioEnabled ? '' : 'disabled'}>
        {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
        <span>{isAudioEnabled ? 'Mute' : 'Unmute'}</span>
      </button>
      
      <button onClick={toggleVideo} className={isVideoEnabled ? '' : 'disabled'}>
        {isVideoEnabled ? <CameraIcon /> : <CameraOffIcon />}
        <span>{isVideoEnabled ? 'Stop Video' : 'Start Video'}</span>
      </button>
      
      <button onClick={onLeave} className="leave-btn">
        <PhoneIcon />
        <span>Leave</span>
      </button>
    </div>
  );
}
```

### 6.3 Leave Meeting Logic
```javascript
const handleLeave = () => {
  // Stop all tracks
  localStream.getTracks().forEach(track => track.stop());
  
  // Close peer connections
  Object.values(peers).forEach(({ peer }) => peer.destroy());
  
  // Disconnect socket
  socket.disconnect();
  
  // Navigate home
  navigate('/');
};
```

---

## 🖥️ Phase 7: Screen Sharing (Day 11-12)

### 7.1 Create Screen Sharing Hook
**File: `client/src/hooks/useScreenShare.js`**

```javascript
function useScreenShare(socket, peers) {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);
  
  const startScreenShare = async () => {
    try {
      // Get screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      screenStreamRef.current = screenStream;
      setIsScreenSharing(true);
      
      // Replace video track in all peer connections
      const screenTrack = screenStream.getVideoTracks()[0];
      
      Object.values(peers).forEach(({ peer }) => {
        const sender = peer._pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          sender.replaceTrack(screenTrack);
        }
      });
      
      // Handle user stopping share via browser UI
      screenTrack.onended = () => stopScreenShare();
      
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };
  
  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      setIsScreenSharing(false);
      // TODO: Restore camera stream
    }
  };
  
  return { isScreenSharing, startScreenShare, stopScreenShare };
}
```

### 7.2 How Screen Sharing Works
1. User clicks "Share Screen" button
2. Browser shows permission dialog (select window/tab/screen)
3. Get screen stream using `getDisplayMedia()`
4. Replace video track in all active peer connections
5. Remote users now see screen instead of camera
6. When stopped, restore original camera stream

### 7.3 Add Screen Share Button to Controls
```javascript
<button onClick={isScreenSharing ? stopScreenShare : startScreenShare}>
  {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
  <span>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
</button>
```

---

## 🔗 Phase 8: Meeting Rooms & Link Sharing (Day 13)

### 8.1 Generate Unique Meeting Codes
```javascript
const generateMeetingCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code; // e.g., "abc123xy"
};
```

### 8.2 Copy Meeting Link to Clipboard
**Add to MeetingRoom.jsx:**
```javascript
const copyMeetingLink = () => {
  const meetingLink = `${window.location.origin}/meet/${roomId}`;
  navigator.clipboard.writeText(meetingLink);
  setShowCopiedMessage(true);
  setTimeout(() => setShowCopiedMessage(false), 2000);
};
```

**UI Component:**
```javascript
<div className="meeting-info">
  <span>Meeting code: <strong>{roomId}</strong></span>
  <button onClick={copyMeetingLink}>
    <CopyIcon /> Copy link
  </button>
  {showCopiedMessage && <span className="copied-msg">Copied!</span>}
</div>
```

### 8.3 Join Meeting from URL
**Already handled by React Router:**
```javascript
<Route path="/meet/:roomId" element={<MeetingRoom />} />
```

When user opens link, they're taken directly to the meeting room and auto-join.

---

## 🎨 Phase 9: UI Polish & Better Styling (Day 14-15)

### 9.1 Google Meet-like Dark Theme
**File: `client/src/index.css`**

```css
:root {
  --bg-primary: #202124;
  --bg-secondary: #292a2d;
  --bg-controls: #1a1a1a;
  --text-primary: #e8eaed;
  --text-secondary: #9aa0a6;
  --accent-color: #8ab4f8;
  --danger-color: #ea4335;
  --success-color: #34a853;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
  margin: 0;
  overflow: hidden;
}
```

### 9.2 Responsive Video Grid
```css
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
  padding: 16px;
  height: calc(100vh - 80px);
}

@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}
```

### 9.3 Add Animations
- Smooth transitions for buttons
- Fade in/out for video cards
- Tooltip animations
- Loading spinner while connecting

### 9.4 Add Icons
**Install Material Icons:**
```bash
npm install @mui/icons-material @mui/material @emotion/react @emotion/styled
```

**Use in components:**
```javascript
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
```

---

## 🧪 Phase 10: Testing & Debugging (Day 16-17)

### 10.1 Test Scenarios

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Create Meeting | Click "New Meeting" | Generates unique code, navigates to room |
| Join Meeting | Enter code, click join | Joins room, camera/mic activate |
| Video Call | Two users in same room | Both see each other's video |
| Audio Call | Both users speak | Audio transmitted clearly |
| Mute/Unmute | Toggle microphone | Audio stops/resumes |
| Camera Toggle | Toggle video | Video stops/resumes |
| Screen Share | Click share screen | Remote user sees screen |
| Leave Meeting | Click leave | Returns home, cleanup resources |
| Copy Link | Click copy link | Link copied to clipboard |
| Rejoin Meeting | Use same link | Works correctly |

### 10.2 Common Issues & Solutions

**Issue 1: "Cannot access camera"**
- Check browser permissions
- Ensure HTTPS or localhost
- Check if another app is using camera

**Issue 2: "Peers not connecting"**
- Verify Socket.io connection
- Check server logs for events
- Ensure room IDs match exactly

**Issue 3: "No audio/video"**
- Check if tracks are enabled
- Verify stream is attached to video element
- Check muted property on video

**Issue 4: "Screen share not working"**
- Browser may not support getDisplayMedia
- User denied permission
- Check track replacement logic

### 10.3 Debugging Tools
- Browser DevTools Console (F12)
- Socket.io debugger: `localStorage.debug = 'socket.io-client:*'`
- WebRTC internals: Chrome → `chrome://webrtc-internals`

---

## 🚀 Phase 11: Deployment Preparation (Day 18)

### 11.1 Production Build

**Client:**
```bash
cd client
npm run build
```

**Server:**
- Remove development-only dependencies
- Add error handling
- Set production environment variables

### 11.2 Deployment Options

**Option 1: Render.com (Recommended for beginners)**
- Free tier available
- Easy deployment
- Automatic HTTPS

**Option 2: Vercel (Client) + Railway (Server)**
- Vercel for React frontend
- Railway for Node.js backend

**Option 3: Netlify + Heroku**
- Netlify for static site
- Heroku for backend (paid)

### 11.3 Environment Variables for Production
```env
# Server .env
PORT=5000
CORS_ORIGIN=https://your-domain.com
NODE_ENV=production
```

---

## 📊 Feature Checklist

### MVP Features ✅
- [x] Create new meeting with unique code
- [x] Join meeting via code or link
- [x] One-on-one video calling
- [x] Audio calling
- [x] Mute/unmute microphone
- [x] Camera on/off toggle
- [x] Screen sharing
- [x] Leave meeting with cleanup
- [x] Copy meeting link to clipboard

### Future Enhancements (Optional)
- [ ] Chat functionality
- [ ] Participant list
- [ ] Meeting recording
- [ ] Virtual backgrounds
- [ ] Hand raise feature
- [ ] Meeting host controls
- [ ] More than 2 participants (requires SFU/MCU)
- [ ] Meeting scheduling
- [ ] User authentication
- [ ] Meeting history

---

## 📁 Final Project Structure

```
google-meet-clone/
│
├── server/
│   ├── node_modules/
│   ├── index.js                 # Main server file
│   ├── package.json
│   └── .env
│
├── client/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoCard.jsx
│   │   │   ├── VideoGrid.jsx
│   │   │   └── Controls.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── MeetingRoom.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useLocalStream.js
│   │   │   ├── usePeerConnection.js
│   │   │   ├── useMediaControls.js
│   │   │   └── useScreenShare.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🎯 Learning Outcomes

After building this project, you'll understand:
- ✅ React hooks and component architecture
- ✅ State management with useState/useRef/useEffect
- ✅ Real-time communication with Socket.io
- ✅ WebRTC peer-to-peer connections
- ✅ MediaDevices API (camera, mic, screen share)
- ✅ Node.js + Express server setup
- ✅ Event-driven programming
- ✅ Custom React hooks
- ✅ Responsive CSS styling
- ✅ Debugging real-time applications

---

**Ready to start?** Each phase will be implemented step-by-step with detailed explanations and guidance.
