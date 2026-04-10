# Troubleshooting Guide - Google Meet Clone

## Quick Start Checklist

### Before Testing, Ensure:
- [ ] Node.js is installed (run `node --version`)
- [ ] Server is running on port 5000 (run `cd server && npm run dev`)
- [ ] Client is running on port 3000 (run `cd client && npm run dev`)
- [ ] Using Chrome or Edge browser (best WebRTC support)
- [ ] Camera and microphone are connected and working
- [ ] No other app is using camera (Zoom, Skype, etc.)

---

## Common Errors & Fixes

### Error: "Camera/microphone access denied"

**What it means:** Browser blocked camera/mic permission

**How to fix:**
1. Click the lock icon in address bar
2. Change camera/mic permissions to "Allow"
3. Refresh the page
4. Click "Allow" when prompted

**Chrome:** `chrome://settings/content/camera`
**Edge:** `edge://settings/content/camera`

---

### Error: "No camera or microphone found"

**What it means:** Device has no camera/mic or it's disabled

**How to fix:**
1. Check if camera exists in Device Manager
2. Enable camera in browser settings
3. Try external USB camera
4. Use a different device

---

### Error: "Peers not connecting"

**What it means:** Two users in same room but can't see each other

**Debug Steps:**

1. **Check Server Console:**
   ```
   [SOCKET] User connected: abc123
   [ROOM] User joining room: test123
   [SIGNAL] Forwarding signal from abc to xyz
   ```

2. **Check Browser Console (F12):**
   ```
   [PEER] Connected to signaling server
   [PEER] New user connected: xyz789
   [PEER] Received remote stream from: xyz789
   ```

3. **Verify Room IDs Match:**
   - Both tabs must have EXACT same room ID
   - Room IDs are case-sensitive

4. **Check Socket.io Connection:**
   ```javascript
   // In browser console:
   socket.connected // Should be true
   socket.id // Should show your ID
   ```

**Solutions:**
- Restart both browser tabs
- Ensure server is running
- Check for CORS errors
- Verify exact room ID match

---

### Error: "Black screen instead of video"

**What it means:** Video element shows black/no image

**Debug:**
```javascript
// In browser console:
const video = document.querySelector('video');
console.log(video.srcObject); // Should show MediaStream
video.srcObject.getTracks(); // Should show active tracks
```

**Solutions:**
1. Refresh page
2. Check camera permission
3. Close other apps using camera
4. Try different browser

---

### Error: "Can't hear other user"

**What it means:** Audio not transmitting

**Debug:**
```javascript
// In browser console:
localStream.getAudioTracks().forEach(track => {
  console.log(`Audio track: enabled=${track.enabled}`);
});
```

**Check:**
- [ ] Both users allowed microphone
- [ ] Mute button is NOT red
- [ ] Speakers are working
- [ ] System volume is up

**Solutions:**
1. Toggle mute button
2. Check system audio settings
3. Try headphones
4. Verify audio tracks are enabled

---

### Error: "Screen share not working"

**What it means:** Click button, nothing happens

**Requirements:**
- Modern Chrome (72+), Edge (79+), or Firefox (66+)
- HTTPS or localhost
- At least one peer connection active

**Solutions:**
1. Check browser supports getDisplayMedia
2. Ensure you're in a meeting with others
3. Check console for `[SCREEN]` logs
4. Try selecting different window/screen
5. Restart browser

---

### Error: "Keyboard shortcuts not working"

**What it means:** Pressing shortcuts does nothing

**Check:**
- NOT typing in input field
- Using correct shortcut:
  - `Ctrl+D` - Mute
  - `Ctrl+E` - Camera
  - `Space` - Quick mute
- Functions are properly connected

**Debug:**
```javascript
// In browser console:
window.addEventListener('keydown', (e) => {
  console.log('Key pressed:', e.key);
});
```

---

### Error: "Meeting shows 00:00 timer"

**What it means:** Timer not counting up

**Solutions:**
1. Check console for errors
2. Refresh page
3. Verify `useMeetingTimer` hook imported
4. Check React DevTools for state

---

### Error: "Layout looks broken"

**What it means:** CSS not rendering properly

**Solutions:**
1. Hard refresh: `Ctrl+Shift+R`
2. Clear browser cache
3. Check if index.css loaded
4. Disable browser extensions
5. Try incognito/private mode

---

## Debug Mode Commands

### Enable Socket.io Debug Logging
```javascript
// In browser console:
localStorage.debug = 'socket.io-client:*';
// Refresh page to see detailed logs
```

### Check WebRTC Statistics
```
Chrome/Edge: chrome://webrtc-internals
Firefox: about:webrtc
```

### Check React Component State
Install React DevTools extension, then:
1. Open DevTools
2. Go to Components tab
3. Select MeetingRoom
4. Check state values

---

## Performance Issues

### Video Lagging or Stuttering

**Causes:**
- High CPU usage
- Low bandwidth
- Too many participants
- Browser extensions

**Solutions:**
1. Close unnecessary tabs
2. Disable browser extensions
3. Lower video quality (modify getUserMedia constraints)
4. Reduce number of participants
5. Use wired internet connection

### High CPU Usage

**Check:**
```
Task Manager → See node.exe and browser CPU usage
```

**Solutions:**
1. Restart browser
2. Update graphics drivers
3. Use hardware acceleration
4. Limit concurrent peer connections

### Memory Leaks

**Symptoms:**
- RAM usage keeps growing
- Browser slows down over time
- Need to restart frequently

**Debug:**
```
Chrome DevTools → Memory tab → Take heap snapshot
```

**Solutions:**
1. Ensure tracks stopped on leave
2. Verify peer connections destroyed
3. Check socket disconnected
4. Remove event listeners on unmount

---

## Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| getUserMedia | ✅ | ✅ | ✅ | ✅ |
| getDisplayMedia | ✅ | ✅ | ✅ | ✅ |
| WebRTC | ✅ | ✅ | ✅ | ✅ |
| Socket.io | ✅ | ✅ | ✅ | ✅ |
| Clipboard API | ✅ | ✅ | ✅ | ⚠️ |

**Recommended:** Chrome 90+ or Edge 90+

---

## Network Issues

### Behind Firewall/Proxy

**Symptoms:**
- Can't connect to server
- WebRTC fails
- STUN/TURN needed

**Solutions:**
1. Configure STUN server in peer options
2. Open required ports (5000, 3000)
3. Use TURN server for relay
4. Check firewall rules

### NAT Traversal Issues

**Check:**
```
chrome://webrtc-internals → Look for ICE connection state
```

**Should show:**
- ICE connection state: connected
- ICE gathering state: complete

---

## Getting Help

### Information to Provide:

1. **Browser & Version:**
   - Chrome 120, Edge 120, etc.

2. **Console Errors:**
   - Screenshot of DevTools console

3. **Server Logs:**
   - Copy from server terminal

4. **Steps to Reproduce:**
   - Exact steps that cause issue

5. **Expected vs Actual:**
   - What should happen vs what does happen

### Where to Ask:

- Check this troubleshooting guide first
- Review TESTING.md for test scenarios
- Check console and server logs
- Search for similar issues online

---

## Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| No camera | Check permissions, close other apps |
| Can't connect | Verify server running, same room ID |
| No audio | Toggle mute, check system volume |
| Black screen | Refresh page, check tracks |
| Screen share fails | Update browser, try Chrome |
| Shortcuts fail | Not in input field, check console |
| Timer stuck | Refresh page, check hook |
| Layout broken | Hard refresh, clear cache |

---

**Last Updated:** April 2026

