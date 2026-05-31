# 🧪 QA Learning Hub — 90-Day Automation Testing Roadmap

A fully responsive, offline-capable web app to plan, track, and complete your 90-day QA Automation learning journey.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Login** | Simple authentication (username + password) |
| 🏠 **Dashboard** | Progress ring, streak tracker, today's topic, 2-hr study timer |
| 📅 **90-Day Plan** | All 90 days with phase filters, search, click to open |
| 📖 **Today's Lesson** | Checklist, free YouTube link, local file reference, auto-save notes |
| 🖥️ **SQL Sandbox** | Live SQL against mock QA tables — no install needed |
| 📬 **Postman Viewer** | Browse 5 API collections with requests, body, and test scripts |
| 📊 **Progress Stats** | Activity heatmap, phase completion bars |
| 🔔 **Study Alarm** | Daily notification + chime using Web Audio API |

## 🔐 Default Login

```
Username: learner
Password: qatesting2024
```

> Change these anytime in **Settings → Security**

---

## 🚀 Option 1: Open Locally on Your Laptop

1. Double-click `index.html` → opens in Chrome/Edge
2. All data saves automatically in your browser (localStorage)
3. Works 100% offline (except YouTube links)

---

## 🌐 Option 2: Host FREE on GitHub Pages (Access from Any Device)

Follow these steps to get a free URL like `https://yourusername.github.io/qa-learning-hub/`:

### Step 1 — Create GitHub Account
- Go to [github.com](https://github.com) and sign up (free)

### Step 2 — Create a New Repository
- Click **+** → **New repository**
- Name it: `qa-learning-hub`
- Keep it **Public**
- Click **Create repository**

### Step 3 — Upload Files
- Click **uploading an existing file** on the repository page
- Drag and drop ALL files from this `learning-hub` folder:
  - `index.html`
  - `app.css`
  - `app.js`
  - `README.md`
  - `implementation_plan.md`
  - `task.md`
- Click **Commit changes**

### Step 4 — Enable GitHub Pages
- Go to repository **Settings** → **Pages** (left sidebar)
- Under **Source**: select **Deploy from a branch**
- Under **Branch**: select `main` → `/ (root)` → Click **Save**
- Wait 1-2 minutes

### Step 5 — Access Your App
- Your app is now live at: `https://yourusername.github.io/qa-learning-hub/`
- **Open this URL on your phone or laptop — it works on any device!**

> **Note:** By default, data is stored locally on each device. To seamlessly sync your progress, checklist, and notes between your laptop and mobile phone in real-time for free, enable **Firebase Cloud Sync** by following the steps below.

---

## 🔥 Option 3: Enable Real-Time Cloud Sync (Sync Laptop & Phone for FREE)

You can connect your own free Google Firebase database so that checking a task on your phone instantly updates your laptop screen (in under 1 second!).

### Step 1 — Create a Free Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and log in with your Google account.
2. Click **Add Project** (or **Create a Project**).
3. Name it: `qa-learning-hub` (or any name you like).
4. Click **Continue** (you can disable Google Analytics for this project, as it's not needed).
5. Click **Create Project** and wait for it to be ready.

### Step 2 — Register a Web App & Get Your Config
1. On your project homepage, click the **Web icon `</>`** (near the top center, under the project name) to register a web app.
2. Enter an App Nickname: `qa-hub-web`.
3. Leave "Also set up Firebase Hosting" **unchecked** (we are hosting on GitHub Pages instead!).
4. Click **Register App**.
5. You will see a `firebaseConfig` block. Copy only the **JSON object** inside the curly braces `{ ... }`. It looks like this:
   ```json
   {
     "apiKey": "AIzaSy...",
     "authDomain": "qa-learning-hub.firebaseapp.com",
     "projectId": "qa-learning-hub",
     "storageBucket": "qa-learning-hub.appspot.com",
     "messagingSenderId": "123456789...",
     "appId": "1:123456789..."
   }
   ```
6. Keep this JSON safe; you will paste it into the app settings later!

### Step 3 — Enable Email/Password Authentication
1. In the Firebase left sidebar, click **Build** → **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Email/Password**.
4. Enable **Email/Password** (keep "Email link (passwordless sign-in)" disabled).
5. Click **Save**.

### Step 4 — Create Firestore Database & Set Security Rules
1. In the Firebase left sidebar, click **Build** → **Firestore Database**.
2. Click **Create database**.
3. Select your Database Location (prefer nearest to you) and click **Next**.
4. Start in **Production mode** or **Test mode** (it doesn't matter, we will write our own secure rules next). Click **Create**.
5. Once created, click on the **Rules** tab at the top.
6. Replace the existing rules with these secure, user-locked rules (which prevent anyone else from reading/writing your progress):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/progress/{document} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
7. Click **Publish**.

### Step 5 — Activate Cloud Sync in Settings
1. Open your hosted QA Learning Hub app (either locally or on your GitHub Pages URL).
2. Go to **Settings** → scroll down to the **Firebase Real-Time Cloud Sync** card.
3. Paste the **Firebase Web App Configuration JSON** you copied in Step 2.
4. Invent a **Sync Username** (e.g. `ravi`) and a **Sync Password** (e.g. `secret123`).
   > *Note:* The username and password will be registered in your Firebase project as a secure virtual account: `username@qahub.local`.
5. Click **🔥 Enable Cloud Sync**.
6. The status dot in the top bar will turn `🟢 Cloud Connected`!
7. **To Sync Another Device:** Open the URL on your mobile phone, go to Settings, paste the *same* Firebase Config JSON, enter the *same* username and password, and click **Enable Cloud Sync**. Any progress checked off on one screen will sync to the other in under 1 second!

---

## 📱 Mobile Access Tips

- Open the GitHub Pages URL in Chrome on your Android phone
- Tap the 3-dot menu → **Add to Home Screen**
- The app installs like a native app with an icon!

---

## 🗂️ Files in This Folder

| File | Purpose |
|------|---------|
| `index.html` | Main app shell — login + all sections |
| `app.css` | All styles — dark glassmorphism, fully responsive |
| `app.js` | Full app logic — curriculum data, SQL engine, all features |
| `implementation_plan.md` | Full 90-day curriculum plan with free resource links |
| `task.md` | Build task tracking |
| `README.md` | This file |

---

## 🧪 SQL Sandbox Tables

Practice SQL on realistic QA-themed data:

| Table | Columns |
|-------|---------|
| `employees` | id, name, dept, salary, city, hire_date |
| `bugs` | id, title, severity, status, project, reporter_id |
| `test_cases` | id, title, module, status, priority, automated |
| `projects` | id, name, type, status, team_size |

**Example queries:**
```sql
SELECT * FROM employees WHERE dept = 'QA'
SELECT dept, COUNT(*) as count FROM employees GROUP BY dept
SELECT e.name, b.title FROM employees e INNER JOIN bugs b ON e.id = b.reporter_id
SELECT * FROM test_cases WHERE status = 'Fail' ORDER BY priority
```

---

## 📬 Postman Collections Included

1. **E2E Scenario #1** — Restful Booker: Create → Update → Get
2. **Project #2** — SOAP API testing (CountryInfo service)
3. **Project #3** — Restful Booker full CRUD with auth token
4. **Project #4** — Opencart user registration and login
5. **Project #6** — Data-Driven Testing with variables

---

## 🎯 90-Day Learning Phases

| Phase | Topics | Days |
|-------|--------|------|
| 1 | Manual Testing — SDLC, Test Cases, Bug Reports, JIRA, Agile | 1–18 |
| 2 | API Testing with Postman — REST, Collections, Assertions, Newman | 19–30 |
| 3 | Core Java — OOPs, Collections, Generics, Java 8, Maven, TestNG | 31–55 |
| 4 | REST Assured Framework — CRUD, BaseTest, POJO, Allure, DDT | 56–65 |
| 5 | Selenium WebDriver — Locators, Waits, POM, Reporting, Git | 66–80 |
| 6 | SQL for Testers — DQL, JOINs, DDL/DML, Subqueries | 81–85 |
| 7 | Jenkins CI/CD — Freestyle, Pipeline, GitHub Webhooks, Allure | 86–88 |
| 8 | Portfolio — Appium, GitHub, Resume, Mock Interview | 89–90 |

---

Built with ❤️ for aspiring QA Automation Engineers.
