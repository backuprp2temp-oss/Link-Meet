# Google Meet Clone - Testing Guide

## 🧪 Test Scenarios & Results

### Test Case 1: Create New Meeting
**Steps:**
1. Open http://localhost:3000
2. Click "New Meeting" button
3. Wait for redirect

**Expected Result:**
- ✅ Button shows "Creating..." loading state
- ✅ Redirected to `/meet/[unique-code]`
- ✅ Camera permission prompt appears
- ✅ After allowing, see your video feed

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 2: Join Meeting via Code
**Steps:**
1. Open http://localhost:3000
2. Type a meeting code (e.g., "test1234")
3. Click "Join Meeting"

**Expected Result:**
- ✅ "Join Meeting" button is enabled
- ✅ Redirected to `/meet/test1234`
- ✅ Camera permission prompt appears
- ✅ Video feed loads

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 3: Video Call Between Two Tabs
**Steps:**
1. Open Tab 1: http://localhost:3000/meet/abc123
2. Allow camera permissions
3. Copy the meeting code "abc123"
4. Open Tab 2: http://localhost:3000/meet/abc123
5. Allow camera permissions

**Expected Result:**
- ✅ Both tabs show their own video
- ✅ Tab 1 sees Tab 2's video appear
- ✅ Tab 2 sees Tab 1's video appear
- ✅ Participant count shows "2 participants"
- ✅ No errors in console

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 4: Audio Transmission
**Steps:**
1. Set up two tabs in same meeting
2. Speak into microphone in Tab 1
3. Listen in Tab 2

**Expected Result:**
- ✅ Audio is clear in Tab 2
- ✅ No echo or feedback
- ✅ Volume level is appropriate
- ✅ No delay or lag

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 5: Mute/Unmute Microphone
**Steps:**
1. In a meeting, click "Mute" button
2. Try speaking
3. Click "Unmute" button
4. Try speaking again

**Expected Result:**
- ✅ Button turns red when muted
- ✅ Icon changes to MicOffIcon
- ✅ Text changes to "Unmute"
- ✅ Other participants see muted indicator
- ✅ Audio stops when muted
- ✅ Audio resumes when unmuted

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 6: Camera Toggle
**Steps:**
1. In a meeting, click "Stop video" button
2. Observe your video card
3. Click "Start video" button
4. Observe your video card

**Expected Result:**
- ✅ Button turns red when camera off
- ✅ Icon changes to VideocamOffIcon
- ✅ Video replaced with avatar (your initials)
- ✅ Camera light turns off
- ✅ Video resumes when re-enabled
- ✅ Avatar pulses gently

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 7: Screen Sharing
**Steps:**
1. In a meeting with 2 tabs
2. Click "Present now" in Tab 1
3. Select a window/screen in browser dialog
4. Observe Tab 2
5. Click "Stop sharing"

**Expected Result:**
- ✅ Browser shows screen selector
- ✅ Tab 1 video shows screen content
- ✅ Tab 2 sees Tab 1's screen
- ✅ Header shows "🖥️ Sharing Screen"
- ✅ Button changes to "Stop sharing"
- ✅ Camera restored when stopping
- ✅ No errors in console

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 8: Keyboard Shortcuts
**Steps:**
1. In a meeting, press `Ctrl+D`
2. Press `Ctrl+E`
3. Press `Space`
4. Hover over buttons

**Expected Result:**
- ✅ `Ctrl+D` toggles microphone
- ✅ `Ctrl+E` toggles camera
- ✅ `Space` toggles microphone
- ✅ Tooltips show shortcuts
- ✅ Console logs show [SHORTCUT] messages
- ✅ Shortcuts don't work when typing in inputs

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 9: Copy Meeting Link
**Steps:**
1. In a meeting, click "Copy link" button
2. Paste clipboard into text editor

**Expected Result:**
- ✅ Shows "✓ Copied!" message
- ✅ Message fades out after 2 seconds
- ✅ Clipboard contains full meeting URL
- ✅ URL can be used to join meeting

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 10: Leave Meeting and Cleanup
**Steps:**
1. In a meeting, click "Leave" button
2. Confirm in dialog (if using Ctrl+Shift+D)
3. Observe behavior

**Expected Result:**
- ✅ Redirected to home page
- ✅ Camera/microphone turn off
- ✅ Socket.io disconnects
- ✅ Peer connections destroyed
- ✅ No errors in console
- ✅ Other participants see you leave

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 11: Meeting Timer
**Steps:**
1. Enter a meeting
2. Wait 1 minute
3. Observe timer display

**Expected Result:**
- ✅ Timer starts at 00:00
- ✅ Timer counts up correctly
- ✅ Shows MM:SS format
- ✅ Shows HH:MM:SS after 1 hour
- ✅ Monospace font displays properly

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 12: Error Handling - Camera Denied
**Steps:**
1. Enter a meeting
2. Click "Block" when camera permission asks
3. Observe behavior

**Expected Result:**
- ✅ Shows error message: "Camera/microphone access denied..."
- ✅ Shows "Go Back Home" button
- ✅ No crash or blank screen
- ✅ Can navigate back and retry

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 13: Error Handling - No Camera
**Steps:**
1. Use device without camera (or disable in browser)
2. Try to enter meeting

**Expected Result:**
- ✅ Shows error: "No camera or microphone found..."
- ✅ Graceful fallback shown
- ✅ No crash

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 14: Responsive Design
**Steps:**
1. Open meeting on desktop (1920x1080)
2. Resize to tablet (768px width)
3. Resize to mobile (375px width)

**Expected Result:**
- ✅ Desktop: Multi-column grid
- ✅ Tablet: 2 columns
- ✅ Mobile: Single column
- ✅ Controls scroll horizontally
- ✅ Header adapts properly
- ✅ No overflow or broken layout

**Status:** [ ] Pass / [ ] Fail

---

### Test Case 15: Multiple Participants (3+)
**Steps:**
1. Open 3 tabs in same meeting
2. Observe video grid layout

**Expected Result:**
- ✅ All 3 videos visible
- ✅ Grid layout adjusts (3 columns or 2+1)
- ✅ All videos play smoothly
- ✅ No performance issues

**Status:** [ ] Pass / [ ] Fail

---

## 🔍 Debugging Tools

### Browser DevTools Console (F12)
**How to access:**
- Chrome/Edge: Press `F12` → Console tab
- Firefox: Press `Ctrl+Shift+K`
- Safari: Develop → Show JavaScript Console

**What to look for:**
- `[SOCKET]` - Socket.io connection events
- `[PEER]` - WebRTC peer connection events
- `[MEDIA]` - Media control events
- `[SCREEN]` - Screen sharing events
- `[SHORTCUT]` - Keyboard shortcut events
- Error messages (red text)

### Socket.io Debug Mode
**Enable in browser console:**
```javascript
localStorage.debug = 'socket.io-client:*';
```

**What it shows:**
- All Socket.io events
- Connection details
- Packet data
- Reconnection attempts

### WebRTC Internals (Chrome/Edge)
**Access:** Navigate to `chrome://webrtc-internals`

**What to check:**
- Active peer connections
- Sent/received bytes
- Codec information
- Connection quality stats
- ICE connection state

### Server Console Logs
**What to watch for:**
- User connections/disconnections
- Room joins
- Signal forwarding
- Error messages

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot access camera"
**Symptoms:** Error message on screen, no video

**Possible Causes:**
1. User denied permission
2. Another app using camera
3. Browser doesn't support getUserMedia

**Solutions:**
1. Check browser permissions: `chrome://settings/content/camera`
2. Close other apps using camera (Zoom, Skype, etc.)
3. Ensure using HTTPS or localhost
4. Try different browser (Chrome recommended)
5. Check browser console for specific error

**Status:** [ ] Resolved / [ ] Still Occurring

---

### Issue 2: "Peers not connecting"
**Symptoms:** Two users in same room but don't see each other

**Possible Causes:**
1. Socket.io not connected
2. Different room IDs
3. Server not running
4. CORS issues

**Solutions:**
1. Check server is running on port 5000
2. Verify both users have exact same room ID
3. Check browser console for `[SOCKET]` logs
4. Check server console for connection logs
5. Verify CORS settings in server/index.js

**Debug Steps:**
```javascript
// In browser console:
socket.emit('join-room', 'test-room', 'user1');
// Check if other user receives 'user-connected' event
```

**Status:** [ ] Resolved / [ ] Still Occurring

---

### Issue 3: "No audio/video from other user"
**Symptoms:** Connected but no media transmission

**Possible Causes:**
1. Tracks not enabled
2. Stream not attached to video element
3. Peer connection failed
4. Firewall blocking WebRTC

**Solutions:**
1. Check if tracks are enabled: `stream.getTracks()`
2. Verify stream attached: `videoElement.srcObject`
3. Check peer.on('stream') fired
4. Check WebRTC internals for connection state
5. Ensure not behind strict firewall

**Debug Code:**
```javascript
// In browser console:
localStream.getTracks().forEach(track => {
  console.log(`${track.kind}: enabled=${track.enabled}`);
});
```

**Status:** [ ] Resolved / [ ] Still Occurring

---

### Issue 4: "Screen share not working"
**Symptoms:** Click button, nothing happens or error

**Possible Causes:**
1. Browser doesn't support getDisplayMedia
2. User cancelled selection
3. Track replacement failed
4. Not in secure context

**Solutions:**
1. Use modern Chrome/Edge/Firefox
2. Ensure localhost or HTTPS
3. Check console for `[SCREEN]` error logs
4. Verify peer connections exist before sharing
5. Try different browser

**Status:** [ ] Resolved / [ ] Still Occurring

---

### Issue 5: "Video stays black after camera toggle"
**Symptoms:** Turn camera back on, but video still black

**Possible Causes:**
1. Track not re-enabled properly
2. Video element not updated
3. Stream reference lost

**Solutions:**
1. Check track.enabled property
2. Verify localStream still exists
3. Try refreshing page
4. Check console for errors

**Status:** [ ] Resolved / [ ] Still Occurring

---

### Issue 6: "Meeting timer not working"
**Symptoms:** Timer shows 00:00 and doesn't update

**Possible Causes:**
1. Hook not initialized
2. useEffect cleanup running prematurely
3. Component re-rendering

**Solutions:**
1. Check console for errors
2. Verify useMeetingTimer imported
3. Check React DevTools for hook state
4. Verify component not unmounting/remounting

**Status:** [ ] Resolved / [ ] Still Occurring

---

### Issue 7: "Keyboard shortcuts not working"
**Symptoms:** Press shortcuts, nothing happens

**Possible Causes:**
1. Hook not connected
2. Typing in input field (prevented)
3. Event listener not attached

**Solutions:**
1. Make sure not in input field
2. Check console for [SHORTCUT] logs
3. Verify useKeyboardShortcuts called
4. Check function props are passed correctly

**Status:** [ ] Resolved / [ ] Still Occurring

---

## ✅ Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| Create New Meeting | [ ] | |
| Join Meeting via Code | [ ] | |
| Video Call Between Two Tabs | [ ] | |
| Audio Transmission | [ ] | |
| Mute/Unmute | [ ] | |
| Camera Toggle | [ ] | |
| Screen Sharing | [ ] | |
| Keyboard Shortcuts | [ ] | |
| Copy Meeting Link | [ ] | |
| Leave Meeting | [ ] | |
| Meeting Timer | [ ] | |
| Error Handling - Camera | [ ] | |
| Responsive Design | [ ] | |
| Multiple Participants | [ ] | |

---

## 🚀 Performance Checklist

- [ ] No memory leaks (check Task Manager)
- [ ] Video plays smoothly (30+ FPS)
- [ ] Audio is clear and synced
- [ ] No console errors
- [ ] Fast page loads (< 2 seconds)
- [ ] Smooth animations (60 FPS)
- [ ] Reasonable CPU usage (< 30%)
- [ ] Reasonable RAM usage (< 500MB)

---

## 📝 Notes & Observations

_Add any issues found during testing here:_

1. 
2. 
3. 

---

**Testing Date:** _____________

**Tested By:** _____________

**Overall Status:** [ ] Ready for Production / [ ] Needs Fixes

