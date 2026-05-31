# 90-Day QA Automation Learning Hub — Real-Time Firebase Sync Plan

## Background & Goal

The user requested an option to automatically sync progress between their laptop and mobile phone in real-time, drawing inspiration from the free Firebase Realtime Database/Firestore integration used in the **Badminton Split** expense calculator.

To deliver this premium capability without charging any hosting or database fees, we will integrate a fully optional **Real-Time Firebase Cloud Sync** feature:
1. **Self-Serve Firebase Config**: Allow the user to paste their free Firebase configuration object directly in the **Settings** panel (or initialize with a template config).
2. **Compat Auth Integration**: Implement an offline-first client-side authentication system (username & password) using `firebase-auth-compat.js` (e.g. creating a secure `username@qahub.local` account).
3. **Firestore Live Replication**: Automatically sync and replicate all progress records (`qa_completed`, `qa_notes`, `qa_checklist`, `qa_study_time`, `qa_activity`, `qa_start_date`, `qa_goal_mins`) to the user's private Firestore document.
4. **Instant Multi-Device Sync**: Use Firestore `onSnapshot` to trigger immediate UI refreshes across all open screens (laptop and phone) in real-time when progress changes.

---

## User Review Required

> [!IMPORTANT]
> **100% Free & Private Sync**
> This feature leverages the Firebase Spark Plan (which is 100% free forever) and Firestore, so you do not need to host a server. The database belongs to your own Firebase project, making your learning data completely private to you.

> [!TIP]
> **Real-Time Responsiveness**
> Once configured, ticking off a task on your mobile phone will automatically check it off on your laptop's screen in real-time, and vice versa!

> [!NOTE]
> **Completely Optional**
> If you choose not to configure Firebase Sync, the app will continue to save all progress locally in your browser's offline `localStorage` as it does currently.

---

## Technical Approach & Proposed Changes

### 1. Import SDKs in [index.html](file:///e:/Downloads/100%20Days/learning-hub/index.html)
We will add the standard compat script tags for Firebase inside the `<head>` of `index.html`:
```html
<script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore-compat.js"></script>
```

### 2. UI Upgrades in [index.html](file:///e:/Downloads/100%20Days/learning-hub/index.html)
- **Top Bar Sync Indicator**: Add a premium status dot in the top bar: `🟢 Cloud Connected` / `⚪ Local Storage (Offline)`.
- **Firebase Sync Panel in Settings**: Add a new settings section right above "Security":
  - Inputs for **Firebase Config** JSON text.
  - Inputs for **Sync Account**: Username and Password.
  - Buttons: **Enable Sync & Log In** and **Disconnect**.

### 3. Core Synchronization Engine in [app.js](file:///e:/Downloads/100%20Days/learning-hub/app.js)
We will introduce a `Sync` class in `app.js` containing:
- `init()`: Reads custom Firebase config from `localStorage`. If exists, initializes Firebase App, Auth, and Firestore.
- `login(user, pass)`: Signs in or registers the user using `username@qahub.local`.
- `disconnect()`: Clears credentials and rolls back to standard local storage.
- `push()`: Sends a write request to Firestore `users/{uid}/progress` with the latest state.
- `listen()`: Starts `onSnapshot` on the user's progress document to pull updates in real-time, save them to `localStorage`, and call `Today.render()` / `Dashboard.refresh()` to update the UI on the fly.

### 4. Styles in [app.css](file:///e:/Downloads/100%20Days/learning-hub/app.css)
- Stylings for the Top Bar Connection status indicator (flashing animation on sync, solid green on active connection).
- Layout alignment for the sync settings card.

---

## Verification Plan

### Automated/Code Validation
- Ensure that the Firebase configuration parses as valid JSON.
- Verify that if Firebase scripts are blocked (or offline), the app gracefully defaults to offline mode without breaking the UI.
- Verify that standard node syntax validation passes with `node -c`.

### Manual Sync Review
1. Set up a free Firebase project.
2. Enter the config in Settings and log in.
3. Observe status indicator change to `🟢 Cloud Connected`.
4. Open the same app on a mobile phone (or secondary browser window) and log in to the same account.
5. Tick off a checklist item in window 1, and verify it checks off in window 2 in under 1 second.
6. Write a study note on the laptop, and confirm it appears on the phone instantly.
