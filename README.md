# Link Meet - Video Conferencing Application

A fully functional, real-time video conferencing application built with React, Node.js, WebRTC, and Socket.io. Experience seamless one-on-one video calls, screen sharing, and audio communication with a professional, Google Meet-inspired interface.

![Status](https://img.shields.io/badge/status-complete-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19.2.4-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)

---

## 📑 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Learning Outcomes](#-learning-outcomes)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- **🎥 Video Calling** - Crystal-clear one-on-one peer-to-peer video communication using WebRTC
- **🎤 Audio Calling** - High-quality audio transmission with real-time streaming
- **🖥️ Screen Sharing** - Share your entire screen, specific windows, or browser tabs
- **🔇 Mute/Unmute** - Toggle microphone on/off with visual indicators
- **📷 Camera Toggle** - Enable/disable camera feed instantly
- **⏱️ Meeting Timer** - Real-time elapsed time display during meetings
- **🔗 Meeting Rooms** - Unique, auto-generated room codes for easy joining
- **📋 Copy Meeting Link** - One-click link sharing for effortless invitations
- **👥 Participant Tracking** - Real-time participant count and status

### User Experience
- **⌨️ Keyboard Shortcuts** - Quick access controls for all major functions
- **📱 Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **🎨 Professional UI** - Dark theme inspired by Google Meet's modern aesthetics
- **⚡ Error Handling** - Graceful error messages and recovery mechanisms
- **🔄 Real-time Updates** - Instant connection status and participant changes

---

## 🌐 Live Demo

*Deploy the application to experience it live! See [Deployment](#deployment) section for instructions.*

**Local Development:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 📸 Screenshots

### Home Page
Create a new meeting or join an existing meeting with a simple code entry.

### Meeting Room
Professional video interface with controls bar, participant videos, and meeting information.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.4 | UI component framework |
| **Vite** | 8.0.4 | Build tool and development server |
| **React Router** | 7.14.0 | Client-side routing |
| **Simple Peer** | 9.11.1 | WebRTC wrapper for peer-to-peer connections |
| **Socket.io Client** | 4.8.3 | Real-time bidirectional communication |
| **Material UI** | 7.3.9 | Icon library and component system |
| **CSS3** | - | Custom styling with animations and transitions |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | LTS | JavaScript runtime environment |
| **Express** | 5.2.1 | HTTP web server framework |
| **Socket.io** | 4.8.3 | WebSocket server for real-time signaling |
| **CORS** | 2.8.6 | Cross-Origin Resource Sharing middleware |
| **Dotenv** | 17.4.1 | Environment variable management |
| **Nodemon** | 3.1.14 | Auto-restart development server |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Browser (Peer A)                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React UI Layer                                           │   │
│  │  • Video Streams (Local & Remote)                        │   │
│  │  • Control Bar (Mute, Camera, Screen Share, Leave)       │   │
│  │  • Meeting Info (Timer, Room Code, Copy Link)            │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────┐   │
│  │  Custom React Hooks                                       │   │
│  │  • useLocalStream - Camera/Microphone Access             │   │
│  │  • usePeerConnection - WebRTC Peer Management            │   │
│  │  • useMediaControls - Audio/Video Toggles                │   │
│  │  • useScreenShare - Screen Sharing Logic                 │   │
│  │  • useKeyboardShortcuts - Keyboard Event Handlers        │   │
│  │  • useMeetingTimer - Meeting Duration Tracker            │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────┐   │
│  │  WebRTC (Simple Peer)           Socket.io Client          │   │
│  │  • P2P Media Stream               • Room Management       │   │
│  │  • Signal Generation              • Signal Forwarding     │   │
│  │  • Track Replacement              • Connection Events     │   │
│  └──────────────────┬────────────────────────┬───────────────┘   │
└─────────────────────┼────────────────────────┼───────────────────┘
                      │                        │
         ┌────────────▼────────┐   ┌───────────▼────────────────┐
         │   Direct P2P        │   │   Socket.io Signaling      │
         │   WebRTC Connection │   │   Server (Node.js)         │
         │   (Media Streams)   │   │                            │
         │                     │   │   • Connection Management  │
         │   Video/Audio flows │   │   • Room Join/Leave        │
         │   directly between  │   │   • Signal Data Routing    │
         │   peers (low lag)   │   │   • User Tracking          │
         └────────────┬────────┘   └───────────┬────────────────┘
                      │                        │
┌─────────────────────┼────────────────────────┼───────────────────┐
│                     │                        │                   │
│  ┌──────────────────▼────────────────────────▼───────────────┐   │
│  │  Socket.io Client          WebRTC (Simple Peer)           │   │
│  │  • Connection Events         • P2P Media Streams          │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────┐   │
│  │  React UI Layer (Peer B)                                  │   │
│  │  • Video Display, Controls, Meeting Info                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│                      Browser (Peer B)                            │
└─────────────────────────────────────────────────────────────────┘
```

### WebRTC Signaling Flow

```
Peer A                          Signaling Server                    Peer B
  |                                     |                             |
  |-- 1. Create offer signal ---------->|                             |
  |   (SDP + ICE candidates)            |                             |
  |                                     |-- 2. Forward signal ------->|
  |                                     |     (via socket.io)         |
  |                                     |                             |
  |                                     |<-- 3. Create answer signal -|
  |                                     |     (SDP + ICE candidates)  |
  |<-- 4. Forward answer signal --------|                             |
  |    (via socket.io)                  |                             |
  |                                     |                             |
  |========= 5. Direct P2P Connection Established ===================|
  |         (Media streams flow directly, no server relay)            |
```

### Data Flow

1. **User joins room** → Socket.io notifies server
2. **Server broadcasts** → All peers in room receive notification
3. **Peer creates offer** → WebRTC generates SDP (Session Description Protocol)
4. **Signal exchange** → SDP and ICE candidates exchanged via Socket.io
5. **P2P established** → Direct media connection between peers
6. **Media streaming** → Audio/video flows directly (lowest latency)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download LTS version](https://nodejs.org/)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Modern Browser** - Chrome, Edge, or Firefox (best WebRTC support)
- **Camera & Microphone** - For video/audio functionality
- **Code Editor** - VS Code recommended

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/backuprp2temp-oss/Link-Meet.git
cd Link-Meet
```

#### 2. Install Server Dependencies

```bash
cd server
npm install
```

#### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

#### 4. Configure Environment Variables

The server includes a default `.env` file. Modify if needed:

```env
# server/.env
PORT=5000
NODE_ENV=development
```

For production, update the CORS origin in `server/index.js` to your deployed frontend URL.

---

## 📖 Usage Guide

### Running the Application

You need to run **both** the server and client simultaneously.

#### Option 1: Manual Start (Recommended)

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```

Expected output:
```
===========================================
Google Meet Clone Server
Server is running on port 5000
Environment: development
===========================================
```

**Terminal 2 - Start Frontend Client:**
```bash
cd client
npm run dev
```

Expected output:
```
  VITE v8.0.4  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

#### Option 2: Concurrent Start (Advanced)

Install `concurrently`:
```bash
npm install -g concurrently
```

Create a root-level `package.json` script:
```json
{
  "scripts": {
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\""
  }
}
```

Run both servers:
```bash
npm run dev
```

### Using the Application

#### Creating a New Meeting

1. Open your browser to `http://localhost:3000`
2. Click the **"New Meeting"** button
3. Browser will request camera and microphone permissions - click **Allow**
4. You'll be redirected to the meeting room with your video active
5. A unique meeting code is displayed - share it with others!

#### Joining an Existing Meeting

**Method 1: Via Meeting Code**
1. Get the meeting code from the host (e.g., `abc123xy`)
2. Open `http://localhost:3000`
3. Enter the meeting code in the input field
4. Click **"Join Meeting"**
5. Allow camera/microphone permissions if prompted

**Method 2: Via Direct Link**
1. Receive a meeting link (e.g., `http://localhost:3000/meet/abc123xy`)
2. Click the link
3. You'll be automatically joined in the meeting after allowing permissions

#### During a Meeting

**Mute/Unmute Microphone:**
- Click the microphone icon in the control bar
- Or press `Ctrl + D`
- Visual indicator shows current status

**Toggle Camera:**
- Click the camera icon in the control bar
- Or press `Ctrl + E`
- Video feed will appear/disappear

**Share Your Screen:**
- Click the screen share icon
- Select what to share (entire screen, window, or browser tab)
- Click **Share** to begin
- Remote participants will see your screen
- Click **Stop Sharing** to return to camera

**Copy Meeting Link:**
- Click the **Copy link** button in the meeting header
- Link is copied to clipboard
- Paste and share with others via chat, email, etc.

**Leave Meeting:**
- Click the red **Leave** button (phone icon)
- You'll be redirected to the home page
- All streams and connections are properly cleaned up

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl + D` | Toggle Microphone | Mute/unmute your microphone |
| `Ctrl + E` | Toggle Camera | Turn camera on/off |
| `Ctrl + Shift + E` | Toggle Screen Share | Start/stop screen sharing |
| `Space` | Quick Microphone | Instantly toggle microphone state |

**Note:** Keyboard shortcuts work when the meeting room page is active and focused.

---

## 📁 Project Structure

```
Link-Meet/
│
├── 📄 README.md                         # Comprehensive documentation (this file)
├── 📄 PROJECT SUMMARY.md                # Quick project overview
├── 📄 Implementation Plan.md            # Detailed development roadmap
├── 📄 TESTING.md                        # Testing procedures and checklists
├── 📄 TROUBLESHOOTING.md                # Common issues and solutions
│
├── 📂 server/                           # Backend (Node.js + Express + Socket.io)
│   ├── 📄 index.js                      # Main server file with Socket.io handlers
│   ├── 📄 package.json                  # Server dependencies and scripts
│   ├── 📄 .env                          # Environment variables (PORT, NODE_ENV)
│   ├── 📄 test-socket.html              # Socket.io connection test page
│   └── 📂 node_modules/                 # Server dependencies
│
├── 📂 client/                           # Frontend (React + Vite)
│   ├── 📄 package.json                  # Client dependencies and scripts
│   ├── 📄 vite.config.js                # Vite configuration and proxy settings
│   ├── 📄 index.html                    # HTML entry point
│   ├── 📄 eslint.config.js              # ESLint configuration
│   │
│   ├── 📂 public/                       # Static assets
│   │   ├── 🖼️ favicon.svg               # Browser tab icon
│   │   └── 🖼️ icons.svg                  # SVG icon collection
│   │
│   ├── 📂 src/                          # Source code
│   │   ├── 📄 App.jsx                   # Main app component with routing
│   │   ├── 📄 App.css                   # App-specific styles
│   │   ├── 📄 main.jsx                  # React entry point
│   │   ├── 📄 index.css                 # Global styles and CSS variables
│   │   │
│   │   ├── 📂 components/               # Reusable UI components
│   │   │   ├── 📄 Controls.jsx          # Bottom control bar (mute, camera, share)
│   │   │   ├── 📄 VideoCard.jsx         # Individual video participant card
│   │   │   └── 📄 VideoGrid.jsx         # Responsive video layout manager
│   │   │
│   │   ├── 📂 pages/                    # Route-based page components
│   │   │   ├── 📄 Home.jsx              # Landing page (create/join meeting)
│   │   │   └── 📄 MeetingRoom.jsx       # Active meeting room interface
│   │   │
│   │   ├── 📂 hooks/                    # Custom React hooks (business logic)
│   │   │   ├── 📄 useLocalStream.js     # Camera/microphone stream access
│   │   │   ├── 📄 usePeerConnection.js  # WebRTC peer-to-peer connection management
│   │   │   ├── 📄 useMediaControls.js   # Microphone/camera toggle logic
│   │   │   ├── 📄 useScreenShare.js     # Screen sharing functionality
│   │   │   ├── 📄 useKeyboardShortcuts.js # Keyboard event handlers
│   │   │   └── 📄 useMeetingTimer.js    # Meeting duration timer
│   │   │
│   │   ├── 📂 utils/                    # Utility functions
│   │   │   └── 📄 meetingUtils.js       # Helper functions (ID generation, etc.)
│   │   │
│   │   └── 📂 assets/                   # Images and static resources
│   │       ├── 🖼️ hero.png               # Hero image for landing page
│   │       ├── 🖼️ react.svg              # React logo
│   │       └── 🖼️ vite.svg               # Vite logo
│   │
│   └── 📂 dist/                         # Production build output (generated)
│
└── 📂 .git/                             # Git repository metadata
```

---

## 🔌 API Reference

### Server Endpoints

#### HTTP Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Server status message |
| `GET` | `/health` | Health check endpoint (returns status and timestamp) |

#### Socket.io Events

**Client → Server Events:**

| Event | Parameters | Description |
|-------|-----------|-------------|
| `join-room` | `(roomId: string, userId: string)` | Join a specific meeting room |
| `signal-data` | `({ signal: object, targetUserId: string })` | Send WebRTC signal to a peer |
| `disconnect` | - | Automatically emitted on disconnection |

**Server → Client Events:**

| Event | Parameters | Description |
|-------|-----------|-------------|
| `user-connected` | `(userId: string)` | Notify when a user joins the room |
| `receiving-signal` | `({ signal: object, userId: string })` | Receive WebRTC signal from a peer |
| `room-joined` | `(roomId: string)` | Confirmation of successful room join |

### Client-Side Hooks

#### `useLocalStream()`

Accesses camera and microphone, returns media stream.

```javascript
const localStream = useLocalStream();
// Returns: MediaStream | null
```

#### `usePeerConnection(roomId)`

Manages WebRTC peer connections within a meeting room.

```javascript
const { peers, localStream, socket } = usePeerConnection(roomId);
// peers: { [userId]: { peer: Peer, stream: MediaStream } }
// localStream: MediaStream
// socket: Socket
```

#### `useMediaControls(stream)`

Toggles audio and video tracks.

```javascript
const { isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo } = useMediaControls(stream);
```

#### `useScreenShare(socket, peers)`

Manages screen sharing functionality.

```javascript
const { isScreenSharing, startScreenShare, stopScreenShare } = useScreenShare(socket, peers);
```

#### `useKeyboardShortcuts(handlers)`

Registers keyboard shortcuts for meeting controls.

```javascript
useKeyboardShortcuts({ toggleAudio, toggleVideo, toggleScreenShare });
```

#### `useMeetingTimer()`

Tracks and displays meeting duration.

```javascript
const { elapsedTime, isRunning } = useMeetingTimer();
// elapsedTime: "00:05:23"
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Basic Functionality
- [ ] Create a new meeting (click button, verify redirect)
- [ ] Join via meeting code (enter code, verify connection)
- [ ] Join via direct URL link
- [ ] Video call between two browser tabs
- [ ] Audio transmission (speak and verify playback)

#### Controls Testing
- [ ] Mute/unmute microphone (check visual indicator)
- [ ] Toggle camera on/off (verify video feed)
- [ ] Screen sharing (share screen, verify remote view)
- [ ] Keyboard shortcuts (test all combinations)

#### Advanced Testing
- [ ] Copy meeting link to clipboard
- [ ] Leave meeting (verify cleanup and redirect)
- [ ] Error handling (deny permissions, check messages)
- [ ] Responsive design (resize browser, mobile view)
- [ ] Meeting timer (verify it increments correctly)

### Browser Developer Tools

**Console (F12):**
- Check for JavaScript errors
- View Socket.io connection logs
- Monitor WebRTC state

**WebRTC Internals (Chrome):**
- Navigate to `chrome://webrtc-internals`
- View active peer connections
- Monitor data channels and media streams

**Socket.io Debug:**
```javascript
// In browser console
localStorage.debug = 'socket.io-client:*';
// Refresh page to see detailed logs
```

### Automated Testing

*Unit and integration tests can be added using:*
- **Jest** or **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress** or **Playwright** - E2E testing

---

## 🐛 Troubleshooting

### Common Issues

#### "Cannot access camera or microphone"

**Symptoms:** Error message about media devices, blank video

**Solutions:**
1. Check browser permissions: `Settings > Privacy > Camera/Microphone`
2. Ensure you're on `localhost` or `HTTPS`
3. Close other apps using the camera
4. Try a different browser (Chrome/Edge recommended)

#### "Peers not connecting"

**Symptoms:** Both users in room but no video

**Solutions:**
1. Verify server is running on port 5000
2. Check server logs for `join-room` events
3. Ensure both users have the exact same room ID
4. Check browser console for Socket.io errors
5. Verify CORS is properly configured

#### "No audio or video"

**Symptoms:** Connected but no media

**Solutions:**
1. Check if media tracks are enabled
2. Verify stream is attached to `<video>` element
3. Ensure local video has `muted` attribute
4. Check WebRTC connection state in `chrome://webrtc-internals`

#### "Screen sharing not working"

**Symptoms:** Click share, nothing happens

**Solutions:**
1. Browser must support `getDisplayMedia` API
2. User must grant screen sharing permission
3. Check console for track replacement errors
4. Verify peer connections are active

#### "Socket.io connection failed"

**Symptoms:** Cannot connect to server

**Solutions:**
1. Ensure server is running (`npm run dev` in server directory)
2. Check if port 5000 is available
3. Verify CORS settings in `server/index.js`
4. Check network tab in browser dev tools

### Quick Debug Commands

```bash
# Check if server is running
curl http://localhost:5000/health

# View active Node.js processes
# Windows:
tasklist | findstr node
# macOS/Linux:
ps aux | grep node

# Kill all Node processes (use with caution)
# Windows:
taskkill /F /IM node.exe
# macOS/Linux:
killall node
```

### Performance Tips

- Close unused browser tabs
- Use wired internet connection for stability
- Ensure adequate CPU/RAM for video processing
- Limit background applications
- Use Chrome/Edge for best WebRTC performance

---

## 🌍 Deployment

### Pre-Deployment Checklist

- [ ] Update CORS origin in `server/index.js` to production URL
- [ ] Set `NODE_ENV=production` in server `.env`
- [ ] Build client: `cd client && npm run build`
- [ ] Test production build: `cd client && npm run preview`
- [ ] Remove `console.log` statements (optional)
- [ ] Add error monitoring (e.g., Sentry)

### Deployment Options

#### Option 1: Render (Recommended)

**Backend (Server):**
1. Create account at [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Environment Variables:** `NODE_ENV=production`
5. Deploy!

**Frontend (Client):**
1. In Render dashboard, click **New +** → **Static Site**
2. Connect GitHub repository
3. Configure:
   - **Build Command:** `cd client && npm install && npm run build`
   - **Publish Directory:** `client/dist`
4. Update server CORS to frontend URL
5. Deploy!

#### Option 2: Vercel + Railway

**Frontend (Vercel):**
```bash
cd client
npm install
npm run build
```
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Follow prompts

**Backend (Railway):**
1. Create account at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Deploy from repo, select `server` directory
4. Set environment variables

#### Option 3: Heroku + Netlify

**Frontend (Netlify):**
1. Push to GitHub
2. Connect repo at [netlify.com](https://netlify.com)
3. Set build command: `cd client && npm run build`
4. Set publish directory: `client/dist`

**Backend (Heroku):**
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Push to Heroku remote
4. Set environment variables

### Production Environment Variables

```env
# Server .env (Production)
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

Update CORS in `server/index.js`:
```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
```

---

## 🚀 Future Enhancements

### Communication Features
- [ ] **Chat Functionality** - Real-time text messaging during calls
- [ ] **Participant List** - Sidebar showing all participants with status
- [ ] **Meeting Recording** - Record video/audio for later playback
- [ ] **Live Captions** - Speech-to-text transcription
- [ ] **Reactions** - Emoji reactions during calls (like Google Meet)

### Meeting Management
- [ ] **Meeting Host** - Host controls, permissions, and moderation
- [ ] **Hand Raise** - Virtual hand raising for orderly discussions
- [ ] **Breakout Rooms** - Split participants into smaller groups
- [ ] **Meeting Scheduling** - Calendar integration and invites
- [ ] **Meeting History** - List of past meetings with details

### Video & Audio Enhancements
- [ ] **Virtual Backgrounds** - Blur or replace background
- [ ] **Background Noise Suppression** - AI-powered noise cancellation
- [ ] **Call Quality Settings** - HD/SD video quality options
- [ ] **Video Filters** - Brightness, contrast adjustments
- [ ] **Picture-in-Picture** - Minimized floating video window

### Scalability
- [ ] **SFU Integration** - Support 3+ participants efficiently
- [ ] **User Authentication** - Login/signup with accounts
- [ ] **Persistent Rooms** - Reusable meeting rooms with settings
- [ ] **Waiting Rooms** - Host approval before joining
- [ ] **Load Balancing** - Distribute across multiple servers

### User Experience
- [ ] **Themes** - Light/dark mode toggle
- [ ] **Custom Avatars** - Profile pictures for participants
- [ ] **Notifications** - Desktop notifications for meetings
- [ ] **Internationalization** - Multi-language support
- [ ] **Accessibility** - Screen reader support, keyboard navigation

---

## 🎓 Learning Outcomes

By studying and building this project, you'll understand:

### Frontend Development
✅ **React Hooks** - useState, useEffect, useRef, useCallback, custom hooks
✅ **Component Architecture** - Reusable, modular UI components
✅ **State Management** - Complex app state with hooks and context
✅ **Client-Side Routing** - React Router for navigation
✅ **MediaDevices API** - Camera, microphone, and screen capture
✅ **WebRTC** - Peer-to-peer real-time media streaming

### Backend Development
✅ **Express.js** - HTTP server setup, routing, middleware
✅ **Socket.io** - WebSocket communication, event-driven architecture
✅ **Signaling** - WebRTC connection establishment process
✅ **CORS** - Cross-origin resource sharing configuration

### Real-Time Communication
✅ **WebRTC Fundamentals** - SDP, ICE candidates, STUN/TURN servers
✅ **Peer-to-Peer Connections** - Direct data channels between clients
✅ **Signaling Servers** - Role of Socket.io in WebRTC
✅ **Media Streams** - Track management and manipulation

### Development Practices
✅ **Debugging** - Browser dev tools, WebRTC internals, server logs
✅ **Error Handling** - Graceful degradation and user feedback
✅ **Responsive Design** - Mobile-first CSS with media queries
✅ **Code Organization** - Separation of concerns, clean architecture

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Test your changes thoroughly
- Update documentation if needed
- Add comments for complex logic

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **WebRTC** - Open-source project enabling real-time communication
- **Socket.io** - Powerful WebSocket library for real-time apps
- **Simple Peer** - Simplified WebRTC wrapper
- **React Team** - Excellent UI framework
- **Material UI** - Beautiful icon library

---

## 📞 Support & Resources

### Documentation
- [WebRTC API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [MDN MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)

### Getting Help
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review browser console (F12)
3. Check server terminal output
4. Search online with specific error messages
5. Open an issue on GitHub

---

## 📊 Project Statistics

- **Total Files:** 1,300+
- **Lines of Code:** 214,000+ (including dependencies)
- **Core Components:** 6
- **Custom Hooks:** 6
- **Socket Events:** 5
- **Dependencies:** 20+

---

<div align="center">

**Built with ❤️ using React, Node.js, WebRTC, and Socket.io**

⭐ Star this repository if you found it helpful!

**Happy Video Conferencing! 🎉🚀**

</div>
