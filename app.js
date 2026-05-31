/* ============================================================
   QA Learning Hub — app.js
   Full SPA: Auth · Router · Curriculum · SQL Engine
             Postman Viewer · Stats · Timer · Alarm
   ============================================================ */

'use strict';

// ============================================================
// STORAGE HELPER
// ============================================================
const Store = {
  get: (k, def = null) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      if (typeof FirebaseSync !== 'undefined' && FirebaseSync.active && FirebaseSync.keysToSync.includes(k)) {
        FirebaseSync.queuePush();
      }
    } catch {}
  },
  del: (k) => {
    try {
      localStorage.removeItem(k);
      if (typeof FirebaseSync !== 'undefined' && FirebaseSync.active && FirebaseSync.keysToSync.includes(k)) {
        FirebaseSync.queuePush();
      }
    } catch {}
  }
};

// ============================================================
// AUTH
// ============================================================
const Auth = {
  init() {
    if (!Store.get('qa_credentials')) {
      Store.set('qa_credentials', { user: 'learner', pass: btoa('qatesting2024') });
    }
    if (Store.get('qa_session')) this.showApp();
    document.getElementById('login-pass').addEventListener('keydown', e => { if (e.key === 'Enter') this.login(); });
    document.getElementById('login-user').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('login-pass').focus(); });
  },
  login() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    const creds = Store.get('qa_credentials');
    const errEl = document.getElementById('login-error');
    if (user === creds.user && btoa(pass) === creds.pass) {
      errEl.style.display = 'none';
      Store.set('qa_session', { user, ts: Date.now() });
      this.showApp();
    } else {
      errEl.style.display = 'block';
      document.getElementById('login-pass').value = '';
    }
  },
  logout() {
    if (!confirm('Sign out?')) return;
    Store.del('qa_session');
    location.reload();
  },
  showApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
    const session = Store.get('qa_session');
    const name = session?.user || 'Learner';
    document.getElementById('user-display-name').textContent = name;
    document.getElementById('user-avatar').textContent = name[0].toUpperCase();
    document.getElementById('hero-greeting').textContent = `Welcome back, ${name.charAt(0).toUpperCase() + name.slice(1)}! 👋`;
    App.init();
  }
};

// ============================================================
// ROUTER
// ============================================================
const Router = {
  current: 'dashboard',
  titles: {
    dashboard: 'Dashboard', plan: '90-Day Plan', today: "Today's Lesson",
    sql: 'SQL Sandbox', postman: 'Postman Viewer', stats: 'Progress & Stats', settings: 'Settings'
  },
  go(section, data = null) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const el = document.getElementById(`section-${section}`);
    if (el) el.classList.add('active');
    const nav = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (nav) nav.classList.add('active');
    document.getElementById('topbar-title').textContent = this.titles[section] || section;
    this.current = section;
    UI.closeSidebar();
    if (section === 'today') Today.render(data);
    if (section === 'dashboard') Dashboard.refresh();
    if (section === 'plan') Plan.render();
    if (section === 'stats') Stats.render();
    if (section === 'settings') Settings.load();
  }
};

// ============================================================
// UI HELPERS
// ============================================================
const UI = {
  toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('show');
  },
  closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('show');
  }
};

// ============================================================
// CURRICULUM DATA — All 90 Days
// ============================================================
const PHASES = [
  { id: 1, name: 'Manual Testing', color: 'phase-1', icon: '🧪', days: '1–18' },
  { id: 2, name: 'API with Postman', color: 'phase-2', icon: '📬', days: '19–30' },
  { id: 3, name: 'Core Java', color: 'phase-3', icon: '☕', days: '31–55' },
  { id: 4, name: 'REST Assured', color: 'phase-4', icon: '🔗', days: '56–65' },
  { id: 5, name: 'Selenium', color: 'phase-5', icon: '🌐', days: '66–80' },
  { id: 6, name: 'SQL', color: 'phase-6', icon: '🗄️', days: '81–85' },
  { id: 7, name: 'Jenkins CI/CD', color: 'phase-7', icon: '⚙️', days: '86–88' },
  { id: 8, name: 'Portfolio & AI', color: 'phase-8', icon: '🏆', days: '89–90' }
];

const CURRICULUM = [
  {
    "day": 1,
    "phase": 1,
    "topic": "SDLC & STLC — Software Dev & Testing Life Cycles",
    "desc": "Understand how software is built (SDLC) and where testing fits in (STLC). Learn Waterfall, Agile, V-Model.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=h3Q0g3yH_iA",
    "practice": "https://www.guru99.com/software-testing-life-cycle.html",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch SDLC vs STLC YouTube video",
      "Read the ATB Curriculum notes on SDLC",
      "Draw a SDLC diagram from memory",
      "Note differences: Waterfall vs Agile vs V-Model"
    ],
    "resources": [
      {
        "title": "SDLC vs STLC in Software Testing",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=h3Q0g3yH_iA",
        "duration": "18m",
        "year": "2023"
      },
      {
        "title": "Software Testing Life Cycle (STLC) Tutorial",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=U3d4bbV_pQA",
        "duration": "28m",
        "year": "2024"
      },
      {
        "title": "SDLC Tutorial for Beginners",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=Xh0s43bC_pI",
        "duration": "32m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 2,
    "phase": 1,
    "topic": "What is Software Testing? Types of Testing",
    "desc": "Learn the fundamentals: functional vs non-functional, manual vs automation, regression, smoke, sanity testing.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=sO8eGLc7Cis",
    "practice": "https://www.softwaretestinghelp.com/types-of-software-testing/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch testing types video",
      "List 10 types of testing with definitions",
      "Read curriculum notes on testing types",
      "Write 3 scenarios for smoke vs sanity"
    ],
    "resources": [
      {
        "title": "Software Testing Fundamentals & Types",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=sO8eGLc7Cis",
        "duration": "24m",
        "year": "2024"
      },
      {
        "title": "Manual Testing Full Course - Episode 1",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=mTHrSuXFPLo",
        "duration": "35m",
        "year": "2023"
      },
      {
        "title": "Different Types of Testing Explained",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=U3d4bbV_pQA",
        "duration": "45m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 3,
    "phase": 1,
    "topic": "Black Box Testing & 7+ Techniques",
    "desc": "Boundary Value Analysis, Equivalence Partitioning, Decision Table, State Transition, Error Guessing, Use Case Testing.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=cLFHQtdOtFo",
    "practice": "https://www.guru99.com/black-box-testing.html",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch Black Box Testing video",
      "Practice BVA on a login form (age 18-60)",
      "Create a Decision Table for a simple feature",
      "Practice Equivalence Partitioning exercise"
    ],
    "resources": [
      {
        "title": "Black Box Testing Techniques (BVA, EP)",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=cLFHQtdOtFo",
        "duration": "22m",
        "year": "2023"
      },
      {
        "title": "Black Box Testing Tutorial & Examples",
        "creator": "Automation Testing Insider",
        "url": "https://www.youtube.com/watch?v=8V-wN_gQo9o",
        "duration": "30m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 4,
    "phase": 1,
    "topic": "Test Planning — Writing a Test Plan",
    "desc": "Learn what a Test Plan contains: scope, objectives, test strategy, resources, schedule, risks.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=AXvg5HVfFbc",
    "practice": "https://www.guru99.com/what-everybody-ought-to-know-about-test-planing.html",
    "localFile": "Software-Testing-Projects2-main\\Templates\\Test Plan",
    "checklist": [
      "Open Template/Test Plan in your local folder",
      "Watch test planning video",
      "Fill in a sample test plan for a login feature",
      "Identify 5 risks for a software project"
    ],
    "resources": [
      {
        "title": "How to Create a Software Test Plan",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=AXvg5HVfFbc",
        "duration": "38m",
        "year": "2023"
      },
      {
        "title": "Mastering Test Planning with Templates",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=l56c5eO6Q98",
        "duration": "25m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 5,
    "phase": 1,
    "topic": "Writing Test Cases — Templates & Best Practices",
    "desc": "Good test cases have ID, description, preconditions, steps, expected results. Learn positive, negative, and boundary cases.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=7s4DHvnbszo",
    "practice": "https://the-internet.herokuapp.com/",
    "localFile": "Software-Testing-Projects2-main\\Templates\\Test Cases",
    "checklist": [
      "Open Template/Test Cases in local folder",
      "Watch test case writing video",
      "Write 10 test cases for a Login page",
      "Include positive, negative and boundary cases"
    ],
    "resources": [
      {
        "title": "How to Write Professional Test Cases",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=7s4DHvnbszo",
        "duration": "28m",
        "year": "2023"
      },
      {
        "title": "Test Case Writing Tutorial step-by-step",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=f2nN3zZtY0I",
        "duration": "35m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 6,
    "phase": 1,
    "topic": "Defect / Bug Reporting — JIRA & Bug Report",
    "desc": "A good bug report has title, severity, priority, steps to reproduce, expected vs actual result, screenshots/logs.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=KX6t6J0Y5sg",
    "practice": "https://www.atlassian.com/software/jira/free",
    "localFile": "Software-Testing-Projects2-main\\Templates\\Bug Report",
    "checklist": [
      "Open Template/Bug Report in local folder",
      "Watch bug reporting video",
      "Write 3 sample bug reports",
      "Understand severity vs priority difference"
    ],
    "resources": [
      {
        "title": "How to Write a Perfect Bug Report",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=KX6t6J0Y5sg",
        "duration": "20m",
        "year": "2023"
      },
      {
        "title": "Defect Life Cycle & JIRA Logging",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=F3J4lxEq0HI",
        "duration": "42m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 7,
    "phase": 1,
    "topic": "Requirement Traceability Matrix (RTM)",
    "desc": "RTM maps requirements to test cases ensuring 100% coverage. Learn to create and maintain RTM throughout a project.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=TgnLU_s6q0U",
    "practice": "https://www.guru99.com/traceability-matrix.html",
    "localFile": "Software-Testing-Projects2-main\\Templates\\RTM",
    "checklist": [
      "Open Templates/RTM in local folder",
      "Watch RTM video tutorial",
      "Create an RTM for 5 requirements with test cases",
      "Understand forward vs backward traceability"
    ],
    "resources": [
      {
        "title": "What is Requirement Traceability Matrix (RTM)",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=TgnLU_s6q0U",
        "duration": "15m",
        "year": "2023"
      },
      {
        "title": "RTM Tutorial with Excel Template",
        "creator": "Automation Testing Insider",
        "url": "https://www.youtube.com/watch?v=sO8eGLc7Cis",
        "duration": "25m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 8,
    "phase": 1,
    "topic": "Test Data Management & Test Environments",
    "desc": "Learn strategies for creating, managing and maintaining test data. Understand test environment setup and configuration.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=nCYqpHJZHeo",
    "practice": "https://www.guru99.com/test-environment-software-testing.html",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch test data management video",
      "List 5 types of test data",
      "Understand environment: Dev, QA, Staging, Prod",
      "Practice data masking concept"
    ],
    "resources": [
      {
        "title": "Test Data Management & QA Environments",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=nCYqpHJZHeo",
        "duration": "20m",
        "year": "2023"
      },
      {
        "title": "Environments & Data Strategy in Agile",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=vV77pC8uH80",
        "duration": "26m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 9,
    "phase": 1,
    "topic": "Test Execution & Reporting (Test Reports, Metrics)",
    "desc": "Learn how to execute tests, log results, create test summary reports and track metrics like pass/fail rate, defect density.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=2Bq4yXlNrys",
    "practice": "https://www.guru99.com/test-report.html",
    "localFile": "Software-Testing-Projects2-main\\Templates\\Test Metrics",
    "checklist": [
      "Open Templates/Test Metrics in local folder",
      "Watch test reporting video",
      "Create a sample test execution report",
      "Calculate pass rate, defect density metrics"
    ],
    "resources": [
      {
        "title": "Test Metrics & Reporting in QA",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=2Bq4yXlNrys",
        "duration": "22m",
        "year": "2023"
      },
      {
        "title": "Test Execution Reports & Metrics Tutorial",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=hV159iHpx88",
        "duration": "30m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 10,
    "phase": 1,
    "topic": "Agile & Scrum for Testers",
    "desc": "Understand Sprint cycles, user stories, acceptance criteria, story points. Learn QA role in daily standups, sprint review and retrospective.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=WjwEh15M5Rw",
    "practice": "https://www.scrum.org/resources/what-is-scrum",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch Agile & Scrum video",
      "Understand Sprint life cycle",
      "Learn 5 Scrum ceremonies",
      "Write 3 user stories with acceptance criteria"
    ],
    "resources": [
      {
        "title": "Agile & Scrum for QA Testers",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=WjwEh15M5Rw",
        "duration": "35m",
        "year": "2023"
      },
      {
        "title": "Agile Scrum Masterclass",
        "creator": "Edureka",
        "url": "https://www.youtube.com/watch?v=7s4DHvnbszo",
        "duration": "45m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 11,
    "phase": 1,
    "topic": "JIRA for Testers — Boards, Issues, Filters",
    "desc": "Hands-on JIRA: create projects, manage boards, create epics/stories/bugs, use filters, dashboards and reports.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=nUc6LSmekAw",
    "practice": "https://www.atlassian.com/software/jira/free",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Sign up for free JIRA account",
      "Watch JIRA for testers video",
      "Create a sample project with a Scrum board",
      "Log 3 bugs with proper severity and priority"
    ],
    "resources": [
      {
        "title": "JIRA Tutorial for Beginners (Agile Board)",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=nUc6LSmekAw",
        "duration": "30m",
        "year": "2023"
      },
      {
        "title": "Complete JIRA & Xray for QA",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=GbKI2LZNNxE",
        "duration": "55m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 12,
    "phase": 1,
    "topic": "LIVE Project 1 — Manual Testing: VWO.com",
    "desc": "Apply all manual testing skills on the real VWO web app. Write a full test plan, test cases for login, dashboard, A/B testing features.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=GbKI2LZNNxE",
    "practice": "https://app.vwo.com/",
    "localFile": "Software-Testing-Projects2-main\\Project 1 - app.vwo.com",
    "checklist": [
      "Open app.vwo.com in browser",
      "Create 15+ test cases for login and main flow",
      "Log any bugs found using your bug report template",
      "Create RTM mapping requirements to test cases"
    ],
    "resources": [
      {
        "title": "Manual Testing Real-Time Project Demo",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=GbKI2LZNNxE",
        "duration": "45m",
        "year": "2023"
      },
      {
        "title": "Practice Manual Testing on Live Website",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=sO8eGLc7Cis",
        "duration": "50m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 13,
    "phase": 1,
    "topic": "Root Cause Analysis & Production Bug Handling",
    "desc": "5 Whys, Fish bone diagrams, RCA process. How to handle critical production bugs and write post-mortem reports.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=4xQVaU31WP0",
    "practice": "https://www.guru99.com/defect-management-process.html",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch RCA video",
      "Perform 5-Whys analysis on a sample bug",
      "Learn defect life cycle states",
      "Write a sample post-mortem for a production issue"
    ],
    "resources": [
      {
        "title": "Root Cause Analysis (5 Whys) in QA",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=4xQVaU31WP0",
        "duration": "22m",
        "year": "2023"
      },
      {
        "title": "Handling Production Bugs as a QA Lead",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=Xh0s43bC_pI",
        "duration": "28m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 14,
    "phase": 1,
    "topic": "Mobile Testing Essentials",
    "desc": "Mobile-specific challenges: screen sizes, OS versions, gestures, battery, network conditions. Android vs iOS testing.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=GMzOllnqzH8",
    "practice": "https://www.browserstack.com/app-live",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch mobile testing video",
      "List 10 mobile-specific test scenarios",
      "Understand responsive design testing",
      "Test a website on your phone browser"
    ],
    "resources": [
      {
        "title": "Introduction to Mobile App Testing",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=GMzOllnqzH8",
        "duration": "25m",
        "year": "2023"
      },
      {
        "title": "Mobile Testing Crash Course",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=tLJe1AkQPVE",
        "duration": "32m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 15,
    "phase": 1,
    "topic": "How to Test APIs Manually",
    "desc": "Use browser DevTools and Postman to manually test APIs: check status codes, response body, headers and timing.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=VywxIQ2ZXw4",
    "practice": "https://restful-booker.herokuapp.com/apidoc/",
    "localFile": "LearningATB10xJavaPrograms-main\\Project #3 - Restful Booker (API Project).postman_collection.json",
    "checklist": [
      "Install Postman (free desktop app)",
      "Watch manual API testing video",
      "Test GET /booking on Restful Booker API",
      "Write test cases: status code, headers, response body"
    ],
    "resources": [
      {
        "title": "Manual API Testing for Beginners",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=VywxIQ2ZXw4",
        "duration": "30m",
        "year": "2023"
      },
      {
        "title": "Postman Manual API Testing Guide",
        "creator": "Testers Talk",
        "url": "https://www.youtube.com/watch?v=mF2vRqnJqk4",
        "duration": "40m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 16,
    "phase": 1,
    "topic": "LIVE Project 2 — HR Module Testing",
    "desc": "Test an HR application: employee login, leave management, payroll features. Practice full test cycle from plan to report.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=7s4DHvnbszo",
    "practice": "https://www.orangehrm.com/orangehrm-open-source/",
    "localFile": "Software-Testing-Projects2-main\\Project 2 - HR Module",
    "checklist": [
      "Explore OrangeHRM demo site",
      "Write 20 test cases for HR module features",
      "Create bug report for any defects found",
      "Build RTM and Test Summary Report"
    ],
    "resources": [
      {
        "title": "HR Management Testing Live Walkthrough",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=7s4DHvnbszo",
        "duration": "42m",
        "year": "2023"
      },
      {
        "title": "End-to-End Manual Testing Project",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=hV159iHpx88",
        "duration": "48m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 17,
    "phase": 1,
    "topic": "Manual Testing Interview Prep & QnA",
    "desc": "Top 50 manual testing interview questions: SDLC, defect life cycle, test types, RTM, test case design techniques.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=GbKI2LZNNxE",
    "practice": "https://www.softwaretestinghelp.com/manual-testing-interview-questions/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Study top 50 manual testing interview questions",
      "Practice answers out loud",
      "Review all templates created so far",
      "Prepare your QA story: \"Tell me about yourself\""
    ],
    "resources": [
      {
        "title": "Top 50 Manual Testing Interview QnA",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=GbKI2LZNNxE",
        "duration": "50m",
        "year": "2024"
      },
      {
        "title": "Manual Testing Mock Interview Demo",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=U3d4bbV_pQA",
        "duration": "1h 10m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 18,
    "phase": 1,
    "topic": "QA Resume & LinkedIn Optimization",
    "desc": "Build a QA-focused resume with the right keywords, skills section, and project descriptions. Optimize LinkedIn for recruiters.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Tt08KmFfIYQ",
    "practice": "https://www.linkedin.com/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Write your QA resume draft",
      "Add Manual Testing skills section",
      "Create/update LinkedIn profile",
      "Connect with 5 QA professionals on LinkedIn"
    ],
    "resources": [
      {
        "title": "Build an ATS-Friendly QA Resume",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=Tt08KmFfIYQ",
        "duration": "28m",
        "year": "2024"
      },
      {
        "title": "LinkedIn Optimization Hacks for Software Testers",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=nUc6LSmekAw",
        "duration": "35m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 19,
    "phase": 2,
    "topic": "HTTP Basics — Methods, Status Codes, Headers",
    "desc": "GET, POST, PUT, PATCH, DELETE. Status codes: 200, 201, 400, 401, 403, 404, 500. Request/response headers.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=iYM2zFP3Zn0",
    "practice": "https://httpbin.org/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch HTTP crash course",
      "Test GET/POST on httpbin.org",
      "List 10 important status codes with meaning",
      "Understand Content-Type and Authorization headers"
    ],
    "resources": [
      {
        "title": "HTTP Crash Course for QA Engineers",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=iYM2zFP3Zn0",
        "duration": "22m",
        "year": "2023"
      },
      {
        "title": "HTTP Methods, Headers & Status Codes Tutorial",
        "creator": "Testers Talk",
        "url": "https://www.youtube.com/watch?v=mF2vRqnJqk4",
        "duration": "38m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 20,
    "phase": 2,
    "topic": "REST vs SOAP — JSON & XML Basics",
    "desc": "Understand REST constraints, SOAP protocol, when to use each. JSON structure: objects, arrays, nesting. XML syntax basics.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=bPR4Q9JdFCo",
    "practice": "https://reqres.in/",
    "localFile": "LearningATB10xJavaPrograms-main\\Project #2 - SOAP.postman_collection.json",
    "checklist": [
      "Watch REST vs SOAP video",
      "Open SOAP collection in Postman",
      "Test a REST API on reqres.in",
      "Practice parsing JSON and XML structures"
    ],
    "resources": [
      {
        "title": "REST vs SOAP Web Services Explained",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=bPR4Q9JdFCo",
        "duration": "18m",
        "year": "2023"
      },
      {
        "title": "JSON and XML Basics for API Testers",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=JEMJRHJLmL4",
        "duration": "25m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 21,
    "phase": 2,
    "topic": "Postman Setup & GET/POST Requests",
    "desc": "Install Postman, explore the interface, make your first GET and POST requests. Understand request body types: raw, form-data.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=VywxIQ2ZXw4",
    "practice": "https://restful-booker.herokuapp.com/apidoc/",
    "localFile": "LearningATB10xJavaPrograms-main\\E2E Scenario #1.postman_collection.json",
    "checklist": [
      "Install Postman desktop app",
      "Make GET request to /booking on Restful Booker",
      "Make POST request to create a new booking",
      "Inspect response: status, body, headers, time"
    ],
    "resources": [
      {
        "title": "Postman Setup & Creating Your First Request",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=VywxIQ2ZXw4",
        "duration": "35m",
        "year": "2023"
      },
      {
        "title": "Postman Step-by-Step Tutorial",
        "creator": "Automation Step by Step",
        "url": "https://www.youtube.com/watch?v=VywxIQ2ZXw4",
        "duration": "45m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 22,
    "phase": 2,
    "topic": "Postman Collections, Environments & Variables",
    "desc": "Organize requests in Collections. Use Environment variables ({{url}}, {{bookingId}}) to avoid hardcoding values.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=7-FT4cxnY9s",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "LearningATB10xJavaPrograms-main\\E2E Scenario #1.postman_collection.json",
    "checklist": [
      "Import E2E Scenario #1 collection from local files",
      "Create an Environment with url variable",
      "Use {{url}} in all request URLs",
      "Chain booking ID from POST to GET request"
    ],
    "resources": [
      {
        "title": "Postman Environments & Global Variables",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=7-FT4cxnY9s",
        "duration": "28m",
        "year": "2023"
      },
      {
        "title": "Collections & Variables Masterclass",
        "creator": "Testers Talk",
        "url": "https://www.youtube.com/watch?v=mF2vRqnJqk4",
        "duration": "36m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 23,
    "phase": 2,
    "topic": "Authorization in Postman (Bearer, Basic, OAuth2)",
    "desc": "Configure Basic Auth, Bearer Token, Cookie-based auth. Understand OAuth 2.0 flow. Test authenticated endpoints.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=mF2vRqnJqk4",
    "practice": "https://restful-booker.herokuapp.com/apidoc/",
    "localFile": "LearningATB10xJavaPrograms-main\\E2E Scenario #1.postman_collection.json",
    "checklist": [
      "Watch authorization video",
      "Create a token using POST /auth endpoint",
      "Use token in DELETE/PUT requests",
      "Test with wrong credentials — verify 403 response"
    ],
    "resources": [
      {
        "title": "Postman API Authorization Complete Guide",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=mF2vRqnJqk4",
        "duration": "24m",
        "year": "2023"
      },
      {
        "title": "How to handle Bearer & OAuth2 Tokens",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=JEMJRHJLmL4",
        "duration": "32m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 24,
    "phase": 2,
    "topic": "Assertions & Test Scripts (pm.test, pm.expect)",
    "desc": "Write JavaScript test scripts in the Tests tab. Assert status code, response body fields, headers, response time.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=I4sTgaOfHN0",
    "practice": "https://learning.postman.com/docs/writing-scripts/test-scripts/",
    "localFile": "LearningATB10xJavaPrograms-main\\E2E Scenario #1.postman_collection.json",
    "checklist": [
      "Open E2E collection, view existing pm.test scripts",
      "Add status code assertion to every request",
      "Assert firstname == \"Jim\" in POST response",
      "Assert response time < 500ms"
    ],
    "resources": [
      {
        "title": "Writing Assertions & Scripts in Postman",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=I4sTgaOfHN0",
        "duration": "28m",
        "year": "2023"
      },
      {
        "title": "Postman Assertions and pm.test Guide",
        "creator": "Testers Talk",
        "url": "https://www.youtube.com/watch?v=mF2vRqnJqk4",
        "duration": "42m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 25,
    "phase": 2,
    "topic": "Chaining Requests & Dynamic Variables",
    "desc": "Extract values from one response and pass to next request automatically using environment variables in test scripts.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=JEMJRHJLmL4",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "LearningATB10xJavaPrograms-main\\E2E Scenario #1.postman_collection.json",
    "checklist": [
      "Implement full E2E: Create → Get → Update → Delete",
      "Use pm.environment.set to chain booking ID",
      "Run Collection Runner — all tests should pass",
      "Verify last step deletes the correct booking"
    ],
    "resources": [
      {
        "title": "Postman API Chaining Tutorial",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=JEMJRHJLmL4",
        "duration": "30m",
        "year": "2023"
      },
      {
        "title": "Dynamic Variables & Chaining in Postman",
        "creator": "Automation Testing Insider",
        "url": "https://www.youtube.com/watch?v=sO8eGLc7Cis",
        "duration": "40m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 26,
    "phase": 2,
    "topic": "Data-Driven Testing with CSV in Postman",
    "desc": "Run same test with multiple data sets using CSV files. Use Collection Runner with data file.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=RH8b3gbujPY",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "LearningATB10xJavaPrograms-main\\Project #6 - Data Driven Testing.postman_collection.json",
    "checklist": [
      "Open Data Driven Testing collection",
      "Create a CSV file with 5 sets of booking data",
      "Run collection with CSV data file",
      "Verify each iteration uses different data"
    ],
    "resources": [
      {
        "title": "Postman Data-Driven Testing with CSV/JSON",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=RH8b3gbujPY",
        "duration": "25m",
        "year": "2023"
      },
      {
        "title": "DDT with Postman Runner Tutorial",
        "creator": "Testers Talk",
        "url": "https://www.youtube.com/watch?v=mF2vRqnJqk4",
        "duration": "35m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 27,
    "phase": 2,
    "topic": "JSON Schema Validation in Postman",
    "desc": "Define a JSON schema and validate API responses automatically. Catch missing fields, wrong types, extra properties.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=JQMfQ0Cxy0I",
    "practice": "https://jsonschema.net/",
    "localFile": "Software-Testing-Projects2-main\\Project 4 - API Testing CRUD\\Restful Booker API Testing.postman_collection (1).json",
    "checklist": [
      "Watch JSON Schema video",
      "Generate schema from a response body",
      "Add schema validation to POST /booking test",
      "Test with a broken response to see validation fail"
    ],
    "resources": [
      {
        "title": "JSON Schema Validation in Postman",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=JQMfQ0Cxy0I",
        "duration": "20m",
        "year": "2023"
      },
      {
        "title": "JSON Schema Validation & Assertions",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=JEMJRHJLmL4",
        "duration": "30m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 28,
    "phase": 2,
    "topic": "Newman CLI — Run Postman from Terminal",
    "desc": "Export collections and run them from command line using Newman. Generate HTML reports for CI/CD integration.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=bBaeDzjyK6o",
    "practice": "https://github.com/postmanlabs/newman",
    "localFile": "Software-Testing-Projects2-main\\Project 4 - API Testing CRUD",
    "checklist": [
      "Install Node.js (required for Newman)",
      "Install newman: npm install -g newman",
      "Export Restful Booker collection as JSON",
      "Run: newman run collection.json --reporters html"
    ],
    "resources": [
      {
        "title": "Run Postman Collections with Newman CLI",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=bBaeDzjyK6o",
        "duration": "22m",
        "year": "2023"
      },
      {
        "title": "Newman Command Line Execution & Reports",
        "creator": "Testers Talk",
        "url": "https://www.youtube.com/watch?v=mF2vRqnJqk4",
        "duration": "32m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 29,
    "phase": 2,
    "topic": "LIVE Project — Restful Booker Full CRUD",
    "desc": "Complete API testing project: test all endpoints with proper assertions, environments, auth, schema validation.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=VywxIQ2ZXw4",
    "practice": "https://restful-booker.herokuapp.com/apidoc/",
    "localFile": "Software-Testing-Projects2-main\\Project 4 - API Testing CRUD",
    "checklist": [
      "Open Project 4 folder — Restful Booker collection",
      "Test all CRUD operations with auth",
      "Run with Newman and generate HTML report",
      "Review test cases Excel sheet in Project 4"
    ],
    "resources": [
      {
        "title": "Postman Live Project - E2E CRUD APIs",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=VywxIQ2ZXw4",
        "duration": "45m",
        "year": "2023"
      },
      {
        "title": "Complete End-To-End API Testing Flow",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=JEMJRHJLmL4",
        "duration": "50m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 30,
    "phase": 2,
    "topic": "API Test Plan & Test Cases Template",
    "desc": "Write a professional API test plan. Create structured test cases for all endpoints covering positive, negative, boundary scenarios.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=I4sTgaOfHN0",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "Software-Testing-Projects2-main\\Project 4 - API Testing CRUD\\Test Plan - Template (2).docx",
    "checklist": [
      "Open Test Plan template from Project 4",
      "Write API test plan for Restful Booker",
      "Open test cases Excel from Project 4",
      "Add 30 test cases: CRUD + auth + negative cases"
    ],
    "resources": [
      {
        "title": "How to write API Test Cases",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=I4sTgaOfHN0",
        "duration": "30m",
        "year": "2023"
      },
      {
        "title": "API Test Planning Masterclass",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=AXvg5HVfFbc",
        "duration": "40m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 31,
    "phase": 3,
    "topic": "Java Intro — JDK, JVM, JRE & IntelliJ Setup",
    "desc": "Understand Java architecture: JDK (development) → JVM (runtime) → JRE (environment). Install IntelliJ IDEA Community (free).",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=0_X7r8gWDDE",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_01_Java_Basic\\HelloWorld.java",
    "checklist": [
      "Install JDK 21 from oracle.com (free)",
      "Install IntelliJ IDEA Community Edition (free)",
      "Open ex_01_Java_Basic folder",
      "Run HelloWorld.java — see output in console"
    ],
    "resources": [
      {
        "title": "Java Full Course for Beginners 2024",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=0_X7r8gWDDE",
        "duration": "45m",
        "year": "2024"
      },
      {
        "title": "Java Tutorial for Beginners",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "50m",
        "year": "2023"
      },
      {
        "title": "Java JDK & IntelliJ Setup Guide",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "38m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 32,
    "phase": 3,
    "topic": "Data Types, Variables, Literals",
    "desc": "Primitive types: int, double, boolean, char, long, float, byte, short. Wrapper classes. String literals. Variable naming rules.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_02_JavaBasics",
    "checklist": [
      "Open ex_02_JavaBasics and ex_03_Literals",
      "Run each program and observe output",
      "Create your own program using all 8 primitive types",
      "Understand auto-boxing with Integer/Double"
    ],
    "resources": [
      {
        "title": "Variables and Primitive Data Types in Java",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "30m",
        "year": "2024"
      },
      {
        "title": "Java Data Types & Variables Explained",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "40m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 33,
    "phase": 3,
    "topic": "Operators & Type Casting",
    "desc": "Arithmetic, relational, logical, assignment, bitwise operators. Implicit (widening) and explicit (narrowing) type casting.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_04_Operators",
    "checklist": [
      "Open ex_04_Operators and ex_05_TypeCasting",
      "Run all programs",
      "Write a calculator program using all operators",
      "Practice casting: int to double and vice versa"
    ],
    "resources": [
      {
        "title": "Java Operators & Expression Evaluation",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "32m",
        "year": "2024"
      },
      {
        "title": "Type Casting & Math Operators in Java",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "42m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 34,
    "phase": 3,
    "topic": "Control Flow — if-else, switch, ternary",
    "desc": "if/else if/else chains, nested if, switch statements with fall-through, ternary operator for concise conditionals.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_06_Ternary_Operator",
    "checklist": [
      "Open ex_06, ex_08, ex_09 folders",
      "Run all programs",
      "Write a grade calculator (A/B/C/D/F) using switch",
      "Use ternary for even/odd checker"
    ],
    "resources": [
      {
        "title": "Java Conditionals: if-else & switch",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "38m",
        "year": "2024"
      },
      {
        "title": "Control Flow & Conditional Structures",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "45m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 35,
    "phase": 3,
    "topic": "Loops — for, while, do-while, enhanced for",
    "desc": "for loops, while loops, do-while loops, enhanced for-each loop. break and continue. Nested loops. Common patterns.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_10_For_Loop",
    "checklist": [
      "Open ex_10, ex_11, ex_12 folders",
      "Print multiplication table using nested loops",
      "Find prime numbers 1–100 using loops",
      "Print a star pyramid pattern using nested loops"
    ],
    "resources": [
      {
        "title": "Java Loops Tutorial (for, while, do-while)",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "40m",
        "year": "2024"
      },
      {
        "title": "Iterative Statements & Loops in Java",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "48m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 36,
    "phase": 3,
    "topic": "Functions & Method Overloading",
    "desc": "Method declaration, return types, parameters, void methods. Method overloading: same name, different signatures.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_13_Functions",
    "checklist": [
      "Open ex_13_Functions folder",
      "Write an add() method overloaded for int, double, String",
      "Create a static utility class with 5 helper methods",
      "Understand pass-by-value in Java"
    ],
    "resources": [
      {
        "title": "Methods and Overloading in Java",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "35m",
        "year": "2024"
      },
      {
        "title": "Writing Functions & Parameters",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "42m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 37,
    "phase": 3,
    "topic": "Strings, StringBuilder, StringBuffer",
    "desc": "String immutability, common String methods: length, charAt, substring, contains, replace, split, trim, equals.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_14_Strings",
    "checklist": [
      "Open ex_14_Strings and ex_15_Strings_Functions",
      "Practice 20 String methods",
      "Reverse a string without using reverse()",
      "Use StringBuilder to concatenate 1000 strings efficiently"
    ],
    "resources": [
      {
        "title": "Strings, StringBuilder & StringBuffer",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "38m",
        "year": "2024"
      },
      {
        "title": "Java Strings Manipulation Tutorial",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "45m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 38,
    "phase": 3,
    "topic": "Arrays & Array Operations",
    "desc": "1D and 2D arrays, declaration, initialization, iteration. Arrays class: sort, binarySearch, copyOf. Common algorithms.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_16_Arrays",
    "checklist": [
      "Open ex_16_Arrays folder",
      "Sort an array without Arrays.sort()",
      "Find the largest/smallest element in an array",
      "Create a 2D array (matrix) and print it"
    ],
    "resources": [
      {
        "title": "Java Arrays (1D and 2D Dimension)",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "42m",
        "year": "2024"
      },
      {
        "title": "Arrays & Multi-Dimensional Matrix",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "50m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 39,
    "phase": 3,
    "topic": "OOPs Basics — Classes & Objects",
    "desc": "Class definition, instance variables, object creation with new keyword, dot notation, instance vs class members.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_17_OOPs",
    "checklist": [
      "Open ex_17_OOPs folder (Dog.java, Person.java)",
      "Create a Car class with 5 fields and 3 methods",
      "Instantiate 3 Car objects with different values",
      "Add a displayInfo() method and call it on each object"
    ],
    "resources": [
      {
        "title": "Classes, Objects & OOP Concepts",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "45m",
        "year": "2024"
      },
      {
        "title": "Introduction to OOP in Java",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "55m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 40,
    "phase": 3,
    "topic": "Constructors — Default & Parameterized",
    "desc": "Default constructor, parameterized constructors, constructor overloading, this() constructor call.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_18_OOPs_Constructors",
    "checklist": [
      "Open ex_18_OOPs_Constructors folder",
      "Add both default and parameterized constructors to Car class",
      "Use this() to call one constructor from another",
      "Practice constructor chaining"
    ],
    "resources": [
      {
        "title": "Constructors & Constructor Overloading",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "32m",
        "year": "2024"
      },
      {
        "title": "Java Constructors Explained",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "38m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 41,
    "phase": 3,
    "topic": "Inheritance, this & super keywords",
    "desc": "extends keyword, single inheritance, method inheritance, super() to call parent constructor, super.method() to call parent methods.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_19_OOPs_Part2",
    "checklist": [
      "Open ex_19_OOPs_Part2 folder",
      "Create Animal → Dog → PoliceDog inheritance chain",
      "Use super() and super.method() in each class",
      "Understand IS-A relationship"
    ],
    "resources": [
      {
        "title": "Inheritance & super Keyword in Java",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "40m",
        "year": "2024"
      },
      {
        "title": "Inheritance & Types of Inheritance",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "48m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 42,
    "phase": 3,
    "topic": "Polymorphism — Compile-time & Runtime",
    "desc": "Method overloading (compile-time), method overriding (runtime), @Override annotation, dynamic dispatch.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_20_OOPs_Super_Abstraction",
    "checklist": [
      "Open ex_20_OOPs_Super_Abstraction folder",
      "Override toString() and equals() in a class",
      "Use parent reference to call overridden method",
      "Observe runtime polymorphism behavior"
    ],
    "resources": [
      {
        "title": "Polymorphism & Dynamic Method Dispatch",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "38m",
        "year": "2024"
      },
      {
        "title": "Polymorphism Explained in Java",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "45m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 43,
    "phase": 3,
    "topic": "Abstraction — Abstract Classes & Interfaces",
    "desc": "abstract keyword, abstract methods (no body), interfaces (all abstract by default in Java 7), implements keyword, default methods.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_20_OOPs_Super_Abstraction",
    "checklist": [
      "Create an abstract Shape class",
      "Implement Circle and Rectangle extending Shape",
      "Create a Drawable interface",
      "Understand abstract class vs interface use cases"
    ],
    "resources": [
      {
        "title": "Abstract Class & Interface in Java",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "42m",
        "year": "2024"
      },
      {
        "title": "Interfaces & Abstraction Deep Dive",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "50m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 44,
    "phase": 3,
    "topic": "Static keyword & Encapsulation",
    "desc": "static variables, static methods, static blocks. Encapsulation: private fields + public getters/setters. Data hiding.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_21_Static",
    "checklist": [
      "Open ex_21_Static folder",
      "Create a Counter class with static count variable",
      "Add private fields + getters/setters to Car class",
      "Understand why encapsulation is important"
    ],
    "resources": [
      {
        "title": "Static Variables & Methods + Encapsulation",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "35m",
        "year": "2024"
      },
      {
        "title": "Static Keyword, Initializers & Encapsulation",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "42m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 45,
    "phase": 3,
    "topic": "ENUM & Wrapper Classes",
    "desc": "Enum: fixed set of constants, methods in enum, ordinal() and name(). Wrapper classes: Integer, Double, Boolean. Auto-boxing.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_22_ENUM",
    "checklist": [
      "Open ex_22_ENUM and ex_23_Wrapper_Class",
      "Create Day enum and switch on it",
      "Use Integer.parseInt, Double.parseDouble in programs",
      "Understand null pointer risk with wrapper classes"
    ],
    "resources": [
      {
        "title": "Enums & Wrapper Classes in Java",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "30m",
        "year": "2024"
      },
      {
        "title": "Java Enums & Auto-boxing Tutorial",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "36m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 46,
    "phase": 3,
    "topic": "Exception Handling — try, catch, finally, throws",
    "desc": "Checked vs unchecked exceptions, try-catch-finally, throw, throws, multi-catch, custom exceptions.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_24_Exceptions",
    "checklist": [
      "Open ex_24_Exceptions folder",
      "Write code that throws NumberFormatException",
      "Catch multiple exception types",
      "Create a custom InvalidAgeException class"
    ],
    "resources": [
      {
        "title": "Exception Handling in Java (try-catch-finally)",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "40m",
        "year": "2024"
      },
      {
        "title": "Checked vs Unchecked Exceptions",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "48m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 47,
    "phase": 3,
    "topic": "Generics",
    "desc": "Generic classes, generic methods, bounded type parameters <T extends Number>, wildcards <?>.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_25_Generics",
    "checklist": [
      "Open ex_25_Generics folder",
      "Create a generic Pair<K,V> class",
      "Write a generic swap() method",
      "Understand why generics are useful in collections"
    ],
    "resources": [
      {
        "title": "Java Generics Tutorial",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "35m",
        "year": "2024"
      },
      {
        "title": "Generics & Wildcards Explained",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "42m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 48,
    "phase": 3,
    "topic": "Collections — List (ArrayList, LinkedList)",
    "desc": "List interface, ArrayList vs LinkedList, add/remove/get/contains/size, iterator, ListIterator, sorting.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_26_Collection_Framework\\List",
    "checklist": [
      "Open ex_26/List folder",
      "Create ArrayList of 10 students",
      "Sort by name using Collections.sort",
      "Remove duplicates using iterator"
    ],
    "resources": [
      {
        "title": "List interface, ArrayList vs LinkedList",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "45m",
        "year": "2024"
      },
      {
        "title": "Java ArrayList & LinkedList Tutorial",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "52m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 49,
    "phase": 3,
    "topic": "Collections — Set (HashSet, TreeSet, LinkedHashSet)",
    "desc": "Set characteristics: no duplicates. HashSet (unordered), TreeSet (sorted), LinkedHashSet (insertion order).",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_26_Collection_Framework\\SET",
    "checklist": [
      "Open ex_26/SET folder",
      "Find duplicates in a list using HashSet",
      "Print unique words from a paragraph using TreeSet",
      "Compare all 3 Set implementations"
    ],
    "resources": [
      {
        "title": "Java Collections: Set, HashSet & TreeSet",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "38m",
        "year": "2024"
      },
      {
        "title": "Sets and Hashing in Java",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "45m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 50,
    "phase": 3,
    "topic": "Collections — Map (HashMap, TreeMap, LinkedHashMap)",
    "desc": "Key-value pairs, put/get/containsKey/keySet/values/entrySet, iteration over Map entries.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_26_Collection_Framework\\MAP",
    "checklist": [
      "Open ex_26/MAP folder",
      "Count word frequency in a string using HashMap",
      "Create a student grade book Map",
      "Iterate using entrySet and print key=value pairs"
    ],
    "resources": [
      {
        "title": "Java Map & HashMap Masterclass",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "42m",
        "year": "2024"
      },
      {
        "title": "HashMaps & HashTables in Java",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "50m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 51,
    "phase": 3,
    "topic": "Collections — Queue, Deque & Iterator",
    "desc": "Queue interface (FIFO), LinkedList as Queue, PriorityQueue, Deque (double-ended), Iterator pattern.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "LearningATB10xJavaPrograms-main\\src\\ex_26_Collection_Framework\\Queue",
    "checklist": [
      "Open ex_26/Queue folder",
      "Implement a task queue simulation",
      "Use PriorityQueue with custom Comparator",
      "Remove elements using Iterator to avoid ConcurrentModificationException"
    ],
    "resources": [
      {
        "title": "Queue, Deque & Priority Queue in Java",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "30m",
        "year": "2024"
      },
      {
        "title": "Queues & Iterators Tutorial",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "38m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 52,
    "phase": 3,
    "topic": "Java 8 — Lambda Expressions & Stream API",
    "desc": "Functional interfaces, lambda syntax, method references. Stream: filter, map, collect, sorted, distinct, reduce.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=FTBH1FMLJHs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch Java 8 Lambda tutorial",
      "Convert anonymous class to lambda",
      "Filter a list of employees with salary > 50000 using Stream",
      "Sort and collect results to a new list"
    ],
    "resources": [
      {
        "title": "Java 8 Streams and Lambda Tutorial",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=FTBH1FMLJHs",
        "duration": "48m",
        "year": "2024"
      },
      {
        "title": "Lambda Expressions & Streams Masterclass",
        "creator": "Amigoscode",
        "url": "https://www.youtube.com/watch?v=A74TOX803D0",
        "duration": "55m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 53,
    "phase": 3,
    "topic": "File Handling & Object Class Methods",
    "desc": "FileReader, FileWriter, BufferedReader. Object class: toString(), equals(), hashCode(). Reading properties files.",
    "learningTime": "1.5 Hours",
    "youtube": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
    "practice": "https://bit.ly/javanotesatb",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Write a program to read data.properties file",
      "Write test data to a text file",
      "Override toString() and equals() in a POJO class",
      "Understand why hashCode must be overridden with equals()"
    ],
    "resources": [
      {
        "title": "Java File Handling & BufferedReader",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=Le_5AkVW8Cs",
        "duration": "35m",
        "year": "2024"
      },
      {
        "title": "File Streams & Object methods in Java",
        "creator": "Kunal Kushwaha",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "42m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 54,
    "phase": 3,
    "topic": "Maven — pom.xml, Dependencies & Build Lifecycle",
    "desc": "Maven project structure, pom.xml structure, adding dependencies, lifecycle phases: clean, compile, test, package, install.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=y6J9eFZNOEY",
    "practice": "https://mvnrepository.com/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\pom.xml",
    "checklist": [
      "Open the ATB7x Framework pom.xml",
      "Understand each dependency (RestAssured, TestNG, etc.)",
      "Create a new Maven project in IntelliJ",
      "Add TestNG dependency and run a simple test"
    ],
    "resources": [
      {
        "title": "Maven Complete Build Tool Tutorial",
        "creator": "Telusko",
        "url": "https://www.youtube.com/watch?v=y6J9eFZNOEY",
        "duration": "40m",
        "year": "2024"
      },
      {
        "title": "Maven Architecture, Lifecycle & pom.xml",
        "creator": "Edureka",
        "url": "https://www.youtube.com/watch?v=FX322RVNGj4",
        "duration": "45m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 55,
    "phase": 3,
    "topic": "TestNG — Annotations, Suite XML, DataProvider, Assertions",
    "desc": "@Test, @BeforeTest, @AfterTest, @BeforeMethod, @AfterMethod, @DataProvider, testng.xml suite, soft vs hard assert.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=sITi4f2Uc8o",
    "practice": "https://testng.org/doc/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\testng_integration.xml",
    "checklist": [
      "Open testng_integration.xml files",
      "Write 5 TestNG tests with different annotations",
      "Use @DataProvider to run test with 3 data sets",
      "Practice Assert.assertEquals and SoftAssert"
    ],
    "resources": [
      {
        "title": "TestNG Complete Tutorial for Beginners",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=sITi4f2Uc8o",
        "duration": "45m",
        "year": "2023"
      },
      {
        "title": "TestNG Framework Setup & Integration",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
        "duration": "50m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 56,
    "phase": 4,
    "topic": "REST Assured Intro & Maven Project Setup",
    "desc": "Add RestAssured dependency to pom.xml. Make first GET request using given().when().get(). Log request and response.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main",
    "checklist": [
      "Open ATB7x Framework project in IntelliJ",
      "Run mvn test — ensure project compiles",
      "Study given()-when()-then() syntax",
      "Make a GET /booking request and log the response"
    ],
    "resources": [
      {
        "title": "REST Assured Framework Setup & First Test",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
        "duration": "42m",
        "year": "2024"
      },
      {
        "title": "Introduction to REST Assured Library",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=8jXkBb2TfGA",
        "duration": "35m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 57,
    "phase": 4,
    "topic": "GET Requests — Path Params, Query Params, Validations",
    "desc": "pathParam(), queryParam(), header(). Validate statusCode(), body() using Hamcrest matchers, contentType().",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=8jXkBb2TfGA",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\src\\test\\java\\com\\thetestingacademy\\tests\\crud",
    "checklist": [
      "Open crud test folder",
      "Study testCreateBookingTCPOST.java",
      "Write a GET test with path parameter /booking/{id}",
      "Assert: status 200, firstname not null"
    ],
    "resources": [
      {
        "title": "REST Assured GET Request & Parameters",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
        "duration": "38m",
        "year": "2024"
      },
      {
        "title": "Query & Path Params in REST Assured",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=8jXkBb2TfGA",
        "duration": "32m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 58,
    "phase": 4,
    "topic": "POST, PUT & DELETE with REST Assured",
    "desc": "Send JSON body, use contentType(JSON), extract response fields using jsonPath(), path(). Full CRUD automation.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=8jXkBb2TfGA",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\src\\test\\java\\com\\thetestingacademy\\tests\\crud",
    "checklist": [
      "Write POST test to create a booking",
      "Write PUT test to update first name",
      "Write DELETE test with token authentication",
      "Assert status codes: 200 for POST/PUT, 201 for DELETE"
    ],
    "resources": [
      {
        "title": "REST Assured POST, PUT & DELETE APIs",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
        "duration": "45m",
        "year": "2024"
      },
      {
        "title": "Automating full CRUD operations with REST Assured",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=8jXkBb2TfGA",
        "duration": "40m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 59,
    "phase": 4,
    "topic": "POJO Classes, GSON & Jackson Serialization",
    "desc": "Create POJO (Plain Old Java Object) for request/response. Use Jackson @JsonProperty, GSON to serialize/deserialize.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=fWVxIGMV_cI",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\src\\main\\java\\com\\thetestingacademy\\pojos",
    "checklist": [
      "Open pojos folder — study Booking.java and BookingResponse.java",
      "Serialize a Booking object to JSON string using GSON",
      "Deserialize a JSON response to Booking object",
      "Use @JsonProperty for field name mapping"
    ],
    "resources": [
      {
        "title": "Jackson & GSON POJOs Serialization/Deserialization",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=fWVxIGMV_cI",
        "duration": "35m",
        "year": "2023"
      },
      {
        "title": "Creating POJOs in REST Assured Framework",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
        "duration": "42m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 60,
    "phase": 4,
    "topic": "BaseTest Pattern & RequestSpecification",
    "desc": "Create BaseTest with @BeforeTest setup. Build RequestSpecBuilder with baseUri, headers. PayloadManager for request bodies.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\src\\test\\java\\com\\thetestingacademy\\base\\BaseTest.java",
    "checklist": [
      "Study BaseTest.java thoroughly",
      "Understand RequestSpecBuilder pattern",
      "Study PayloadManager class in modules folder",
      "Create your own BaseTest for Reqres.in API"
    ],
    "resources": [
      {
        "title": "BaseTest & RequestSpecification Builder Pattern",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
        "duration": "40m",
        "year": "2024"
      },
      {
        "title": "BaseTest Design & RequestSpecBuilder in REST Assured",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=8jXkBb2TfGA",
        "duration": "36m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 61,
    "phase": 4,
    "topic": "AssertJ Advanced Assertions & Response Validation",
    "desc": "assertThat(value).isNotNull().isNotBlank().isEqualTo(). Chain multiple assertions. Better error messages than TestNG Assert.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=kfpSMdl7bBM",
    "practice": "https://assertj.github.io/doc/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\src\\test\\java\\com\\thetestingacademy\\tests\\integration\\TCIntegrationFlow.java",
    "checklist": [
      "Study AssertJ assertions in TCIntegrationFlow.java",
      "Replace TestNG assertions with AssertJ in your tests",
      "Use assertThat(list).hasSize(5).contains(\"QA\")",
      "Chain: isNotNull().isNotBlank().isEqualTo()"
    ],
    "resources": [
      {
        "title": "Fluent Assertions with AssertJ in Automation",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=kfpSMdl7bBM",
        "duration": "28m",
        "year": "2023"
      },
      {
        "title": "AssertJ Assertions Tutorial for QA Engineers",
        "creator": "Testers Talk",
        "url": "https://www.youtube.com/watch?v=mF2vRqnJqk4",
        "duration": "35m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 62,
    "phase": 4,
    "topic": "Authentication — Token, Cookie & Basic Auth",
    "desc": "Generate auth token via POST /auth. Use cookie(\"token\", token) for PUT/DELETE. Basic auth with username/password.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=8jXkBb2TfGA",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\src\\test\\java\\com\\thetestingacademy\\tests\\integration\\TCIntegrationFlow.java",
    "checklist": [
      "Study getToken() method in BaseTest.java",
      "Generate token and print it in test",
      "Use token in PUT request via cookie()",
      "Test what happens when using wrong/expired token"
    ],
    "resources": [
      {
        "title": "API Authentication in REST Assured (Token, Cookie, Basic)",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
        "duration": "36m",
        "year": "2024"
      },
      {
        "title": "Bearer Tokens & Cookie Auth Validation",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=8jXkBb2TfGA",
        "duration": "30m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 63,
    "phase": 4,
    "topic": "E2E Integration Flow — Create → Get → Update → Delete",
    "desc": "Full E2E test using ITestContext to share booking ID between test methods. Priority-based execution.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
    "practice": "https://restful-booker.herokuapp.com/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\src\\test\\java\\com\\thetestingacademy\\tests\\integration\\TCIntegrationFlow.java",
    "checklist": [
      "Study all 4 test methods in TCIntegrationFlow.java",
      "Run mvn test -DsuiteXmlFile=testng_integration.xml",
      "Verify all 4 tests pass in order",
      "Write your own E2E flow for a different API"
    ],
    "resources": [
      {
        "title": "E2E API Integration Flow with REST Assured",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
        "duration": "50m",
        "year": "2024"
      },
      {
        "title": "Design E2E Integration Suite from Scratch",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=8jXkBb2TfGA",
        "duration": "42m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 64,
    "phase": 4,
    "topic": "Data Driven Testing with Excel (Apache POI)",
    "desc": "Read test data from TD.xlsx using Apache POI. Use @DataProvider with Excel data. Run same test with multiple users.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=b3cLZEYjrns",
    "practice": "https://poi.apache.org/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\src\\test\\java\\com\\thetestingacademy\\utils\\UtilsExcel.java",
    "checklist": [
      "Open UtilsExcel.java and TD.xlsx in resources",
      "Understand how Excel data is read",
      "Run DDT tests from testng_integration.xml",
      "Add a new row to TD.xlsx and verify it runs as a new test"
    ],
    "resources": [
      {
        "title": "Excel Data Driven Testing using Apache POI",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=b3cLZEYjrns",
        "duration": "38m",
        "year": "2023"
      },
      {
        "title": "Data Driven Framework with Excel & Rest Assured",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
        "duration": "46m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 65,
    "phase": 4,
    "topic": "Allure Reports, Log4j Logging & Retry Analyzer",
    "desc": "@Description, @Owner, @Severity for Allure. Log4j for console/file logging. RetryAnalyzer for flaky test handling.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=ZRK5L8V0Cns",
    "practice": "https://docs.qameta.io/allure/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main\\testng_integration_retry.xml",
    "checklist": [
      "Run tests and generate Allure report: allure serve allure-results",
      "Add @Description annotation to your test methods",
      "Study TCIntegrationFlowRetry.java",
      "Configure Log4j to write logs to a file"
    ],
    "resources": [
      {
        "title": "Configuring Allure Reports & Log4j in Java Framework",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=ZRK5L8V0Cns",
        "duration": "35m",
        "year": "2023"
      },
      {
        "title": "Allure Reporting Integration with Jenkins",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=V1jfU5LHZRA",
        "duration": "42m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 66,
    "phase": 5,
    "topic": "Selenium Architecture & WebDriver Setup",
    "desc": "Selenium 4 architecture, WebDriver interface, ChromeDriver, FirefoxDriver. Setup Maven project with Selenium dependency.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
    "practice": "https://www.selenium.dev/documentation/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Create new Maven project for Selenium",
      "Add Selenium 4.x dependency in pom.xml",
      "Open Chrome using ChromeDriver",
      "Navigate to https://the-internet.herokuapp.com/"
    ],
    "resources": [
      {
        "title": "Selenium 4 Architecture & Chrome WebDriver Setup",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
        "duration": "45m",
        "year": "2024"
      },
      {
        "title": "Selenium Java Automation Crash Course",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
        "duration": "38m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 67,
    "phase": 5,
    "topic": "Locators — ID, Name, XPath, CSS Selector",
    "desc": "findElement(By.id()), By.name(), By.xpath(), By.cssSelector(). Absolute vs relative XPath. CSS selectors cheat sheet.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=9_J-aGNqg3I",
    "practice": "https://the-internet.herokuapp.com/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Use Chrome DevTools to inspect elements",
      "Write absolute and relative XPath for login form",
      "Write CSS selector for the same element",
      "Find 5 elements on the-internet.herokuapp.com"
    ],
    "resources": [
      {
        "title": "Mastering Locators & XPath in Selenium",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=9_J-aGNqg3I",
        "duration": "40m",
        "year": "2023"
      },
      {
        "title": "Writing CSS & XPath Locators Tutorial",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
        "duration": "48m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 68,
    "phase": 5,
    "topic": "Basic WebDriver Commands",
    "desc": "driver.get(), driver.getTitle(), driver.getCurrentUrl(), driver.navigate(), findElement(), sendKeys(), click(), getText(), clear().",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
    "practice": "https://the-internet.herokuapp.com/login",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Write a test: open login page, enter credentials, click login",
      "Verify title and URL after login",
      "Logout and verify redirect to login page",
      "Assert success/failure message text"
    ],
    "resources": [
      {
        "title": "WebDriver Basic Commands: get, sendKeys & click",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
        "duration": "35m",
        "year": "2024"
      },
      {
        "title": "Essential WebDriver Commands Tutorial",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=9_J-aGNqg3I",
        "duration": "30m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 69,
    "phase": 5,
    "topic": "Dropdowns, Checkboxes & Radio Buttons",
    "desc": "Select class for dropdowns: selectByVisibleText, selectByValue, getOptions. Checkbox/radio: isSelected(), click().",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=dCq2n67p59E",
    "practice": "https://the-internet.herokuapp.com/dropdown",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Automate dropdown on /dropdown page",
      "Select all checkboxes on /checkboxes page",
      "Assert selected option text",
      "Handle dynamic dropdowns (dependent dropdowns)"
    ],
    "resources": [
      {
        "title": "Dropdowns, Checkboxes & Radio Buttons Automation",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=dCq2n67p59E",
        "duration": "38m",
        "year": "2024"
      },
      {
        "title": "Select Class & Dropdowns Handling in Selenium",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=9_J-aGNqg3I",
        "duration": "32m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 70,
    "phase": 5,
    "topic": "Waits — Implicit, Explicit & Fluent",
    "desc": "Thread.sleep() (bad), implicitlyWait, WebDriverWait + ExpectedConditions, FluentWait with polling interval.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=rpV0pJJrZXk",
    "practice": "https://the-internet.herokuapp.com/dynamic_loading",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Automate /dynamic_loading page",
      "Use WebDriverWait until element is visible",
      "Use FluentWait with 500ms polling for slow elements",
      "Never use Thread.sleep in production — understand why"
    ],
    "resources": [
      {
        "title": "Selenium Waits: Implicit, Explicit & Fluent Waits",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=rpV0pJJrZXk",
        "duration": "40m",
        "year": "2023"
      },
      {
        "title": "Synchronization & Waits in WebDriver Framework",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
        "duration": "46m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 71,
    "phase": 5,
    "topic": "Alerts, Frames & Multiple Windows/Tabs",
    "desc": "Alert: accept(), dismiss(), getText(). Frame: switchTo().frame(). Window: getWindowHandles(), switchTo().window().",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=BFsV1CQPV-8",
    "practice": "https://the-internet.herokuapp.com/frames",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Handle JS alert on /javascript_alerts page",
      "Switch to nested frames on /nested_frames",
      "Open new window and switch to it",
      "Close child window and return to parent"
    ],
    "resources": [
      {
        "title": "Alerts, Frames & Multi-Window Handling",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=BFsV1CQPV-8",
        "duration": "38m",
        "year": "2024"
      },
      {
        "title": "SwitchTo Frame, Window and Alert in Selenium",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=9_J-aGNqg3I",
        "duration": "32m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 72,
    "phase": 5,
    "topic": "Actions Class — Mouse & Keyboard Events",
    "desc": "doubleClick(), rightClick(), hover (moveToElement), dragAndDrop, keyDown, keyUp, sendKeys with chord keys.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=BFsV1CQPV-8",
    "practice": "https://the-internet.herokuapp.com/drag_and_drop",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Automate drag-and-drop on /drag_and_drop page",
      "Hover on a menu to reveal hidden sub-menu",
      "Double-click to select text",
      "Use keyboard shortcuts: Ctrl+A, Ctrl+C"
    ],
    "resources": [
      {
        "title": "Actions Class: Mouse Hover, Drag & Drop, Right Click",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=BFsV1CQPV-8",
        "duration": "42m",
        "year": "2024"
      },
      {
        "title": "Advanced Keyboard & Mouse Actions",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=9_J-aGNqg3I",
        "duration": "35m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 73,
    "phase": 5,
    "topic": "JavaScriptExecutor & Screenshots",
    "desc": "executeScript() to scroll, click hidden elements, change styles. TakesScreenshot interface to capture screenshots.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=jLOYZYOhH9M",
    "practice": "https://the-internet.herokuapp.com/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Scroll to bottom of page using JS",
      "Click a hidden element using executeScript()",
      "Take full-page screenshot and save to file",
      "Highlight elements using JS before asserting"
    ],
    "resources": [
      {
        "title": "JavaScriptExecutor & Capturing Screenshots",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=jLOYZYOhH9M",
        "duration": "36m",
        "year": "2023"
      },
      {
        "title": "executeScript & Screenshot Methods in Selenium",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
        "duration": "42m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 74,
    "phase": 5,
    "topic": "Page Object Model (POM) Design Pattern",
    "desc": "Separate page locators and actions from test logic. One class per page. Improves maintainability and reusability.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=F3J4lxEq0HI",
    "practice": "https://www.saucedemo.com/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Create LoginPage.java with all locators and login() method",
      "Create ProductsPage.java with product-related actions",
      "Write test using Page classes (no locators in test)",
      "Understand why POM reduces code duplication"
    ],
    "resources": [
      {
        "title": "Page Object Model (POM) Design Pattern in Java",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=F3J4lxEq0HI",
        "duration": "45m",
        "year": "2023"
      },
      {
        "title": "Creating POM Framework from Scratch",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
        "duration": "52m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 75,
    "phase": 5,
    "topic": "PageFactory & Utility Classes",
    "desc": "@FindBy, @FindBys, PageFactory.initElements(). Create utilities: ConfigReader, ScreenshotUtil, DateUtils.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=tM6z3Tp4gag",
    "practice": "https://www.saucedemo.com/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Refactor LoginPage using @FindBy annotations",
      "Create a BaseTest with @BeforeMethod WebDriver setup",
      "Create ScreenshotUtil for test failure screenshots",
      "Read URL and browser from config.properties file"
    ],
    "resources": [
      {
        "title": "PageFactory with FindBy Annotations",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=tM6z3Tp4gag",
        "duration": "38m",
        "year": "2023"
      },
      {
        "title": "Writing Utility Classes & Config Readers",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=GbKI2LZNNxE",
        "duration": "44m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 76,
    "phase": 5,
    "topic": "Data-Driven Testing with Excel (Apache POI)",
    "desc": "Read username/password from Excel, run login test for each row. @DataProvider with ExcelUtil class.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=b3cLZEYjrns",
    "practice": "https://www.saucedemo.com/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Create testdata.xlsx with 5 login credential rows",
      "Build ExcelUtil to read rows and cells",
      "Use @DataProvider to supply data from Excel",
      "Run test — should run 5 times with different credentials"
    ],
    "resources": [
      {
        "title": "Data Driven Testing with Excel & TestNG",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=b3cLZEYjrns",
        "duration": "40m",
        "year": "2023"
      },
      {
        "title": "Apache POI Excel Utility in Selenium",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
        "duration": "48m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 77,
    "phase": 5,
    "topic": "Extent Reports & Log4j Logging",
    "desc": "ExtentReports: create HTML reports with pass/fail status, screenshots. Log4j: info/debug/warn/error logging levels.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=LcyC_xyf4og",
    "practice": "https://www.extentreports.com/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Add ExtentReports dependency to pom.xml",
      "Generate an HTML report after test run",
      "Attach screenshot to failed test in report",
      "Configure Log4j: console + file appender"
    ],
    "resources": [
      {
        "title": "Extent Reports & Screenshots in Selenium Java",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=LcyC_xyf4og",
        "duration": "42m",
        "year": "2023"
      },
      {
        "title": "Log4j Integration and Logger Levels",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
        "duration": "50m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 78,
    "phase": 5,
    "topic": "Git & GitHub Integration for QA",
    "desc": "git init, add, commit, push. Create remote repo on GitHub. Branching, .gitignore for Selenium projects.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=SWYqp7iY_Tc",
    "practice": "https://github.com/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Install Git on your machine",
      "Create a GitHub account (free)",
      "Push your Selenium project to GitHub",
      "Create .gitignore to exclude target/ folder"
    ],
    "resources": [
      {
        "title": "Git & GitHub Complete Tutorial",
        "creator": "Automation Step by Step",
        "url": "https://www.youtube.com/watch?v=SWYqp7iY_Tc",
        "duration": "35m",
        "year": "2023"
      },
      {
        "title": "Git Crash Course for QA Testers",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=nUc6LSmekAw",
        "duration": "42m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 79,
    "phase": 5,
    "topic": "Cross-Browser Testing & Parallel Execution",
    "desc": "Run tests on Chrome, Firefox, Edge. TestNG parallel=\"methods\" or \"tests\". Selenium Grid basics.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=jKiP6j3CNFM",
    "practice": "https://www.saucedemo.com/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Parameterize browser name in testng.xml",
      "Add FirefoxDriver support to your framework",
      "Set parallel=methods thread-count=2",
      "Verify tests run simultaneously in 2 browsers"
    ],
    "resources": [
      {
        "title": "Cross-Browser Parallel Testing using TestNG XML",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=jKiP6j3CNFM",
        "duration": "45m",
        "year": "2024"
      },
      {
        "title": "Selenium Cross-Browser Framework Setup",
        "creator": "Naveen AutomationLabs",
        "url": "https://www.youtube.com/watch?v=9_J-aGNqg3I",
        "duration": "38m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 80,
    "phase": 5,
    "topic": "LIVE UI Challenge — SauceDemo + Practice Sites",
    "desc": "Apply everything: POM, PageFactory, DDT, Reporting, Waits. Test complete e-commerce flow on SauceDemo.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
    "practice": "https://www.saucedemo.com/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Automate full SauceDemo flow: login → add to cart → checkout",
      "Generate Extent Report for the run",
      "Log all actions using Log4j",
      "Push final framework to GitHub"
    ],
    "resources": [
      {
        "title": "SauceDemo E-commerce Flow Automation Challenge",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=J7s2ngtX4E0",
        "duration": "50m",
        "year": "2024"
      },
      {
        "title": "Live UI Automation Framework Walkthrough",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=GbKI2LZNNxE",
        "duration": "42m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 81,
    "phase": 6,
    "topic": "SQL Intro — DBMS, Relational Model & Data Types",
    "desc": "What is a RDBMS, tables/rows/columns, primary key, foreign key, data types: INT, VARCHAR, DATE, BOOLEAN.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=PLsGOlyTzNH6fWJsttBPaoUuH474v7Dlda",
    "practice": "https://www.w3schools.com/sql/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch SQL for Testers full course",
      "Understand tables, rows, columns concepts",
      "Practice on W3Schools SQL tryit editor",
      "Use the SQL Sandbox in this tool: SELECT * FROM employees"
    ],
    "resources": [
      {
        "title": "SQL Complete Tutorial for Beginners 2024",
        "creator": "Programming with Mosh",
        "url": "https://www.youtube.com/watch?v=PLsGOlyTzNH6fWJsttBPaoUuH474v7Dlda",
        "duration": "45m",
        "year": "2024"
      },
      {
        "title": "Database Concepts & SQL Basics",
        "creator": "Kudvenkat",
        "url": "https://www.youtube.com/watch?v=PLsGOlyTzNH",
        "duration": "40m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 82,
    "phase": 6,
    "topic": "DQL — SELECT, WHERE, GROUP BY, HAVING, ORDER BY",
    "desc": "SELECT with *, column list, DISTINCT, WHERE conditions, AND/OR, LIKE, IN, BETWEEN, ORDER BY ASC/DESC, GROUP BY with COUNT.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=7S_tz1z_5bA",
    "practice": "https://www.sql-practice.com/",
    "localFile": "Software-Testing-Projects2-main\\SQL Projects",
    "checklist": [
      "Practice all SELECT variants in SQL Sandbox",
      "Use WHERE with AND, OR, LIKE conditions",
      "Use GROUP BY to count bugs per severity",
      "ORDER BY salary DESC — top 3 earners"
    ],
    "resources": [
      {
        "title": "SQL DQL: SELECT, WHERE, GROUP BY & ORDER BY",
        "creator": "Programming with Mosh",
        "url": "https://www.youtube.com/watch?v=7S_tz1z_5bA",
        "duration": "38m",
        "year": "2024"
      },
      {
        "title": "Grouping & Filtering Queries Tutorial",
        "creator": "Kudvenkat",
        "url": "https://www.youtube.com/watch?v=PLsGOlyTzNH",
        "duration": "32m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 83,
    "phase": 6,
    "topic": "SQL JOINs — INNER, LEFT, RIGHT, SELF, CROSS",
    "desc": "INNER JOIN (matching rows), LEFT JOIN (all left + matched right), RIGHT JOIN, SELF JOIN (same table), CROSS JOIN (cartesian).",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=yW6J_ZtY8uE",
    "practice": "https://sqlzoo.net/wiki/SQL_Tutorial",
    "localFile": "Software-Testing-Projects2-main\\SQL Projects",
    "checklist": [
      "Write INNER JOIN: employees JOIN bugs on reporter_id",
      "Write LEFT JOIN to see employees without bugs",
      "Practice on SQLZoo JOIN exercises",
      "In SQL Sandbox: join test_cases with projects"
    ],
    "resources": [
      {
        "title": "SQL Joins Explained (Inner, Left, Right, Self, Full)",
        "creator": "Programming with Mosh",
        "url": "https://www.youtube.com/watch?v=yW6J_ZtY8uE",
        "duration": "42m",
        "year": "2024"
      },
      {
        "title": "Visual Explanation of Joins & Queries",
        "creator": "Kudvenkat",
        "url": "https://www.youtube.com/watch?v=PLsGOlyTzNH",
        "duration": "36m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 84,
    "phase": 6,
    "topic": "DDL, DML, TCL — Create, Insert, Update, Delete",
    "desc": "CREATE TABLE, ALTER TABLE, DROP TABLE (DDL). INSERT, UPDATE, DELETE (DML). COMMIT, ROLLBACK, SAVEPOINT (TCL).",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    "practice": "https://www.w3schools.com/sql/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Write CREATE TABLE for a new test_results table",
      "INSERT 5 test results",
      "UPDATE status where test failed",
      "DELETE old records with ROLLBACK safety"
    ],
    "resources": [
      {
        "title": "SQL Commands: DDL, DML & TCL Tutorial",
        "creator": "Programming with Mosh",
        "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        "duration": "38m",
        "year": "2024"
      },
      {
        "title": "Transactions, Commits & Rollbacks",
        "creator": "Kudvenkat",
        "url": "https://www.youtube.com/watch?v=PLsGOlyTzNH",
        "duration": "32m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 85,
    "phase": 6,
    "topic": "Subqueries, Functions & SQL in Backend Validation",
    "desc": "Scalar subqueries, correlated subqueries, aggregate functions: COUNT/SUM/AVG/MAX/MIN. Using SQL to validate API data.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=4M1z-nK6H78",
    "practice": "https://www.sql-practice.com/",
    "localFile": "Software-Testing-Projects2-main\\SQL Projects",
    "checklist": [
      "Write subquery: employees earning above average salary",
      "Use MAX(), MIN(), AVG() in SQL Sandbox",
      "Run SELECT after API POST to verify data in DB",
      "Validate that DELETE API actually removes the record from DB"
    ],
    "resources": [
      {
        "title": "Subqueries & Complex SQL Functions",
        "creator": "Programming with Mosh",
        "url": "https://www.youtube.com/watch?v=4M1z-nK6H78",
        "duration": "40m",
        "year": "2024"
      },
      {
        "title": "SQL Queries for Backend & DB Testing",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=PLsGOlyTzNH6fWJsttBPaoUuH474v7Dlda",
        "duration": "35m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 86,
    "phase": 7,
    "topic": "Jenkins Install, Freestyle Job & Maven Integration",
    "desc": "Install Jenkins on Windows/Mac. Create Freestyle job: checkout from Git, build with Maven, view test results.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=FX322RVNGj4",
    "practice": "https://www.jenkins.io/doc/tutorials/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Download Jenkins WAR file from jenkins.io",
      "Start Jenkins: java -jar jenkins.war",
      "Create a Freestyle job pointing to your GitHub repo",
      "Run mvn test as build step and view results"
    ],
    "resources": [
      {
        "title": "Jenkins Installation & Integration with Maven",
        "creator": "Automation Step by Step",
        "url": "https://www.youtube.com/watch?v=FX322RVNGj4",
        "duration": "38m",
        "year": "2023"
      },
      {
        "title": "Jenkins CI/CD Complete Beginner Guide",
        "creator": "Edureka",
        "url": "https://www.youtube.com/watch?v=FX322RVNGj4",
        "duration": "45m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 87,
    "phase": 7,
    "topic": "Jenkins Pipeline — Jenkinsfile & GitHub Webhooks",
    "desc": "Declarative pipeline syntax, stages: Checkout, Build, Test, Report. Webhook to auto-trigger build on git push.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=7KCS70sCoK0",
    "practice": "https://www.jenkins.io/doc/book/pipeline/",
    "localFile": "APIAutomationFramworkATB7x-main\\APIAutomationFramworkATB7x-main",
    "checklist": [
      "Check Jenkinsfile in ATB7x framework project",
      "Create a Pipeline job in Jenkins",
      "Configure GitHub webhook using ngrok",
      "Push code to GitHub — verify Jenkins auto-triggers build"
    ],
    "resources": [
      {
        "title": "Jenkins Pipeline Projects (Jenkinsfile) Tutorial",
        "creator": "Automation Step by Step",
        "url": "https://www.youtube.com/watch?v=7KCS70sCoK0",
        "duration": "42m",
        "year": "2023"
      },
      {
        "title": "Jenkins Declarative Pipelines & GitHub Webhooks",
        "creator": "Techworld with Nana",
        "url": "https://www.youtube.com/watch?v=7KCS70sCoK0",
        "duration": "50m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 88,
    "phase": 7,
    "topic": "Run Tests via Jenkins + Allure & Email Reports",
    "desc": "Publish Allure reports from Jenkins. Send email notification on test failure. Multi-branch pipeline overview.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=Z3S2Pxan_jU",
    "practice": "https://www.jenkins.io/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Install Allure Plugin in Jenkins",
      "Add allure:serve step to Jenkinsfile",
      "Configure email notification for build failures",
      "View beautiful Allure report from Jenkins dashboard"
    ],
    "resources": [
      {
        "title": "Jenkins Allure Reports & Email Configurations",
        "creator": "Automation Step by Step",
        "url": "https://www.youtube.com/watch?v=Z3S2Pxan_jU",
        "duration": "36m",
        "year": "2023"
      },
      {
        "title": "Automating QA Test Execution in CI/CD Pipeline",
        "creator": "Software Testing Mentor",
        "url": "https://www.youtube.com/watch?v=Z3S2Pxan_jU",
        "duration": "42m",
        "year": "2024"
      }
    ]
  },
  {
    "day": 89,
    "phase": 8,
    "topic": "Appium Overview & Mobile Testing Project",
    "desc": "Appium architecture, Desired Capabilities, setting up Android emulator, simple click/tap test on a mobile app.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/watch?v=tLJe1AkQPVE",
    "practice": "https://appium.io/docs/en/2.0/",
    "localFile": "ATB Full Course Curriculum (4 Months) + Notes.docx",
    "checklist": [
      "Watch Appium introduction video",
      "Install Android Studio + SDK (for emulator)",
      "Install Appium Desktop tool",
      "Run a simple Appium test on a sample Android APK"
    ],
    "resources": [
      {
        "title": "Appium 2.x Mobile Automation Framework Tutorial",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=tLJe1AkQPVE",
        "duration": "50m",
        "year": "2024"
      },
      {
        "title": "Mobile UI Automation Concepts & Appium Setup",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/watch?v=tLJe1AkQPVE",
        "duration": "42m",
        "year": "2023"
      }
    ]
  },
  {
    "day": 90,
    "phase": 8,
    "topic": "Portfolio Building, Resume, Mock Interview & Final Review",
    "desc": "Showcase your GitHub: API framework, Selenium framework, SQL projects. Polish resume, update LinkedIn, practice top 100 QA interview questions.",
    "learningTime": "2 Hours",
    "youtube": "https://www.youtube.com/@TheTestingAcademy",
    "practice": "https://github.com/",
    "localFile": "Websites for Practice.docx",
    "checklist": [
      "Push ALL your projects to GitHub with good README files",
      "Update your QA resume with all skills learned",
      "Record a 2-min self-introduction video",
      "Practice top 50 automation testing interview questions"
    ],
    "resources": [
      {
        "title": "How to build a stand-out GitHub QA Portfolio",
        "creator": "TheTestingAcademy",
        "url": "https://www.youtube.com/@TheTestingAcademy",
        "duration": "45m",
        "year": "2024"
      },
      {
        "title": "Top Automation QA Interview QnA Masterclass",
        "creator": "SDET-QA",
        "url": "https://www.youtube.com/watch?v=GbKI2LZNNxE",
        "duration": "52m",
        "year": "2023"
      }
    ]
  }
];

// ============================================================
// POSTMAN COLLECTIONS DATA (Embedded from local files)
// ============================================================
const POSTMAN_COLLECTIONS = [
  {
    name: 'E2E Scenario #1 (Restful Booker)',
    desc: '3 requests: Create Booking → Update → Get Booking',
    requests: [
      { name: 'E2E Step 1 - Create Booking (No Auth)', method: 'POST', url: '{{url}}/booking', body: '{\n  "firstname": "Jim",\n  "lastname": "{{$randomLastName}}",\n  "totalprice": {{$randomInt}},\n  "depositpaid": true,\n  "bookingdates": {\n    "checkin": "2024-01-01",\n    "checkout": "2024-12-01"\n  },\n  "additionalneeds": "Breakfast"\n}', tests: 'pm.test("Status 200", () => pm.expect(pm.response.code).to.equal(200));\npm.test("firstname == Jim", () => pm.expect(pm.response.json().booking.firstname).to.equal("Jim"));\npm.test("bookingId not null", () => { var id = pm.response.json().bookingid; pm.environment.set("bookingId", id); pm.expect(id).not.equal(null); });' },
      { name: '🔐 Full Update Booking by ID (Auth Req.)', method: 'PUT', url: 'https://restful-booker.herokuapp.com/booking/{{bookingId}}', body: '{\n  "firstname": "James",\n  "lastname": "Brown",\n  "totalprice": 200,\n  "depositpaid": true,\n  "bookingdates": {\n    "checkin": "2024-01-01",\n    "checkout": "2024-12-01"\n  },\n  "additionalneeds": "Lunch"\n}', tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));\npm.test("firstname == James", () => pm.expect(pm.response.json().firstname).to.equal("James"));' },
      { name: 'GetBooking by Single ID (No Auth)', method: 'GET', url: 'https://restful-booker.herokuapp.com/booking/{{bookingId}}', body: null, tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));\npm.test("firstname == James", () => pm.expect(pm.response.json().firstname).to.equal("James"));' }
    ]
  },
  {
    name: 'Project #2 — SOAP API Testing',
    desc: 'SOAP web service testing with XML request/response',
    requests: [
      { name: 'Get Country Info by Name', method: 'POST', url: 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso', body: '<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope>\n  <soap:Body>\n    <CountryName xmlns="http://www.oorsprong.org/websamples.countryinfo">\n      <sCountryISOCode>IN</sCountryISOCode>\n    </CountryName>\n  </soap:Body>\n</soap:Envelope>', tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));\npm.test("Response contains India", () => pm.expect(pm.response.text()).to.include("India"));' },
      { name: 'Get Capital City by Country', method: 'POST', url: 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso', body: '<?xml version="1.0" encoding="utf-8"?>\n<soap:Envelope>\n  <soap:Body>\n    <CapitalCity xmlns="http://www.oorsprong.org/websamples.countryinfo">\n      <sCountryISOCode>IN</sCountryISOCode>\n    </CapitalCity>\n  </soap:Body>\n</soap:Envelope>', tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));\npm.test("Response contains New Delhi", () => pm.expect(pm.response.text()).to.include("New Delhi"));' }
    ]
  },
  {
    name: 'Project #3 — Restful Booker Full CRUD',
    desc: 'Complete CRUD with auth token: Create, Get All, Get by ID, Update, Partial Update, Delete',
    requests: [
      { name: 'Generate Token (Auth)', method: 'POST', url: 'https://restful-booker.herokuapp.com/auth', body: '{\n  "username": "admin",\n  "password": "password123"\n}', tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));\nvar token = pm.response.json().token;\npm.environment.set("token", token);\npm.test("Token generated", () => pm.expect(token).to.not.be.undefined);' },
      { name: 'Get All Bookings', method: 'GET', url: 'https://restful-booker.herokuapp.com/booking', body: null, tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));\npm.test("Response is array", () => pm.expect(pm.response.json()).to.be.an("array"));' },
      { name: 'Create New Booking', method: 'POST', url: 'https://restful-booker.herokuapp.com/booking', body: '{\n  "firstname": "Pramod",\n  "lastname": "Dutta",\n  "totalprice": 500,\n  "depositpaid": true,\n  "bookingdates": {\n    "checkin": "2024-01-01",\n    "checkout": "2024-12-31"\n  },\n  "additionalneeds": "Breakfast"\n}', tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));\nvar id = pm.response.json().bookingid;\npm.environment.set("bookingId", id);\npm.test("Booking ID not null", () => pm.expect(id).not.be.null);' },
      { name: 'Get Booking by ID', method: 'GET', url: 'https://restful-booker.herokuapp.com/booking/{{bookingId}}', body: null, tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));\npm.test("firstname is Pramod", () => pm.expect(pm.response.json().firstname).to.equal("Pramod"));' },
      { name: 'Full Update Booking (PUT)', method: 'PUT', url: 'https://restful-booker.herokuapp.com/booking/{{bookingId}}', body: '{\n  "firstname": "Updated",\n  "lastname": "Name",\n  "totalprice": 999,\n  "depositpaid": false,\n  "bookingdates": {\n    "checkin": "2025-01-01",\n    "checkout": "2025-06-01"\n  },\n  "additionalneeds": "Dinner"\n}', tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));\npm.test("firstname is Updated", () => pm.expect(pm.response.json().firstname).to.equal("Updated"));' },
      { name: 'Delete Booking', method: 'DELETE', url: 'https://restful-booker.herokuapp.com/booking/{{bookingId}}', body: null, tests: 'pm.test("Status 201 - Deleted", () => pm.response.to.have.status(201));' }
    ]
  },
  {
    name: 'Project #4 — Opencart Registration',
    desc: 'API testing for user registration and login flow',
    requests: [
      { name: 'Register New User', method: 'POST', url: '{{opencart_url}}/index.php?route=account/register', body: '{\n  "firstname": "Test",\n  "lastname": "User",\n  "email": "test{{$randomInt}}@mail.com",\n  "telephone": "9876543210",\n  "password": "Test@1234",\n  "confirm": "Test@1234",\n  "agree": "1"\n}', tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));\npm.test("No error in response", () => pm.expect(pm.response.text()).to.not.include("Error"));' },
      { name: 'Login with Credentials', method: 'POST', url: '{{opencart_url}}/index.php?route=account/login', body: '{\n  "email": "test@mail.com",\n  "password": "Test@1234"\n}', tests: 'pm.test("Status 200", () => pm.response.to.have.status(200));' }
    ]
  },
  {
    name: 'Project #6 — Data Driven Testing',
    desc: 'Run same booking test with multiple datasets from CSV',
    requests: [
      { name: 'Create Booking - DDT', method: 'POST', url: '{{url}}/booking', body: '{\n  "firstname": "{{firstname}}",\n  "lastname": "{{lastname}}",\n  "totalprice": {{price}},\n  "depositpaid": {{paid}},\n  "bookingdates": {\n    "checkin": "{{checkin}}",\n    "checkout": "{{checkout}}"\n  }\n}', tests: 'pm.test("Status 200", () => pm.expect(pm.response.code).to.equal(200));\npm.test("Firstname matches", () => pm.expect(pm.response.json().booking.firstname).to.equal(pm.iterationData.get("firstname")));' }
    ]
  }
];

// ============================================================
// PROGRESS TRACKING
// ============================================================
const Progress = {
  getCompleted: () => Store.get('qa_completed', {}),
  getNotes: () => Store.get('qa_notes', {}),
  getChecklist: () => Store.get('qa_checklist', {}),
  getStudyTime: () => Store.get('qa_study_time', {}),
  getActivityLog: () => Store.get('qa_activity', {}),

  toggleDay(dayNum) {
    const done = this.getCompleted();
    if (done[dayNum]) { delete done[dayNum]; } else { done[dayNum] = Date.now(); }
    Store.set('qa_completed', done);
    // Log activity
    const today = new Date().toISOString().split('T')[0];
    const log = this.getActivityLog();
    log[today] = (log[today] || 0) + 1;
    Store.set('qa_activity', log);
    return !!done[dayNum];
  },
  isDone(dayNum) { return !!this.getCompleted()[dayNum]; },
  getStreak() {
    const log = this.getActivityLog();
    let streak = 0; let d = new Date();
    while (true) {
      const key = d.toISOString().split('T')[0];
      if (log[key]) { streak++; d.setDate(d.getDate() - 1); } else break;
    }
    return streak;
  },
  getTodayDay() {
    const start = Store.get('qa_start_date');
    if (!start) return 1;
    const diff = Math.floor((Date.now() - new Date(start).getTime()) / 86400000);
    return Math.min(Math.max(diff + 1, 1), 90);
  },
  getPhaseProgress(phaseId) {
    const days = CURRICULUM.filter(d => d.phase === phaseId);
    const done = days.filter(d => this.isDone(d.day)).length;
    return { done, total: days.length, pct: Math.round(done / days.length * 100) };
  },
  totalDone() { return Object.keys(this.getCompleted()).length; },
  totalTime() {
    const t = this.getStudyTime();
    return Object.values(t).reduce((a, b) => a + b, 0);
  },
  addStudyTime(mins) {
    const t = this.getStudyTime();
    const today = new Date().toISOString().split('T')[0];
    t[today] = (t[today] || 0) + mins;
    Store.set('qa_study_time', t);
  },
  todayStudyTime() {
    const t = this.getStudyTime();
    const today = new Date().toISOString().split('T')[0];
    return t[today] || 0;
  }
};

// ============================================================
// DASHBOARD
// ============================================================
const Dashboard = {
  init() { this.render(); },
  refresh() { this.render(); },
  render() {
    const todayDay = Progress.getTodayDay();
    const todayItem = CURRICULUM[todayDay - 1] || CURRICULUM[0];
    const totalDone = Progress.totalDone();
    const pct = Math.round(totalDone / 90 * 100);
    const streak = Progress.getStreak();

    // Update ring
    const ring = document.getElementById('hero-ring');
    if (ring) { ring.style.strokeDashoffset = 289 - (289 * pct / 100); }
    document.getElementById('hero-pct').textContent = pct + '%';
    document.getElementById('hero-day-num').textContent = todayDay;
    document.getElementById('hero-done').textContent = totalDone;
    document.getElementById('hero-streak').textContent = streak;
    document.getElementById('hero-time').textContent = Math.round(Progress.totalTime() / 60) + 'h';
    document.getElementById('topbar-streak').textContent = `🔥 ${streak} day streak`;
    document.getElementById('today-badge').textContent = todayDay;

    // Today card
    const phase = PHASES.find(p => p.id === todayItem.phase);
    document.getElementById('today-topic-dash').textContent = todayItem.topic;
    document.getElementById('today-phase-dash').textContent = `${phase?.icon} ${phase?.name} · Day ${todayDay}`;

    // Stat cards
    const goals = Store.get('qa_goal_mins', 120);
    const todayMins = Progress.todayStudyTime();
    document.getElementById('stat-cards').innerHTML = [
      { label: 'Overall Progress', value: pct + '%', sub: `${totalDone}/90 days done`, icon: '📈' },
      { label: "Today's Day", value: todayDay, sub: `${90 - todayDay} days remaining`, icon: '📅' },
      { label: 'Study Streak', value: streak + ' 🔥', sub: streak > 0 ? 'Keep it going!' : 'Start today!', icon: '🔥' },
      { label: 'Today Studied', value: `${todayMins}m`, sub: `Goal: ${goals}m · ${Math.max(0, goals - todayMins)}m left`, icon: '⏱️' }
    ].map(s => `<div class="card"><div class="card-title">${s.icon} ${s.label}</div><div class="card-value">${s.value}</div><div class="card-sub">${s.sub}</div></div>`).join('');

    // Phase grid
    document.getElementById('phases-grid').innerHTML = PHASES.map(ph => {
      const p = Progress.getPhaseProgress(ph.id);
      return `<div class="phase-card" onclick="Router.go('plan'); Plan.setPhaseFilter('${ph.id}', null)">
        <div class="phase-card-header">
          <span class="tag ${ph.color}">${ph.icon} ${ph.name}</span>
        </div>
        <div class="phase-card-days" style="margin-bottom:6px;font-size:0.72rem;color:var(--text-muted)">Days ${ph.days}</div>
        <div class="progress-bar"><div class="progress-fill" style="width:${p.pct}%"></div></div>
        <div class="phase-progress-label" style="margin-top:4px"><span style="font-size:0.72rem;color:var(--text-secondary)">${p.done}/${p.total}</span><span style="font-size:0.72rem;color:var(--primary-light)">${p.pct}%</span></div>
      </div>`;
    }).join('');
  }
};

// ============================================================
// PLAN
// ============================================================
const Plan = {
  currentPhase: 'all',
  init() { this.render(); },
  render() {
    const search = (document.getElementById('plan-search')?.value || '').toLowerCase();
    const list = document.getElementById('days-list');
    const todayDay = Progress.getTodayDay();
    let items = CURRICULUM;
    if (this.currentPhase !== 'all') items = items.filter(d => d.phase === parseInt(this.currentPhase));
    if (search) items = items.filter(d => d.topic.toLowerCase().includes(search) || PHASES.find(p => p.id === d.phase)?.name.toLowerCase().includes(search));

    list.innerHTML = items.map(item => {
      const done = Progress.isDone(item.day);
      const isToday = item.day === todayDay;
      const phase = PHASES.find(p => p.id === item.phase);
      return `<div class="day-row ${done ? 'completed' : ''} ${isToday ? 'today-row' : ''}" onclick="Router.go('today', ${item.day})">
        <div class="day-num">${String(item.day).padStart(2, '0')}</div>
        <div class="day-info">
          <h4>${item.topic}</h4>
          <div class="day-meta">
            <span class="tag ${phase?.color}">${phase?.icon} ${phase?.name}</span>
            ${isToday ? '<span class="badge badge-green">📖 Today</span>' : ''}
            ${done ? '<span class="badge badge-cyan">✅ Done</span>' : ''}
          </div>
        </div>
        <div class="day-status">${done ? '✅' : isToday ? '📖' : '⬜'}</div>
      </div>`;
    }).join('') || '<div style="padding:40px;text-align:center;color:var(--text-muted)">No matching days found.</div>';
  },
  filter() { this.render(); },
  setPhaseFilter(phase, btn) {
    this.currentPhase = phase;
    document.querySelectorAll('.phase-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    else {
      const found = document.querySelector(`.phase-filter-btn[data-phase="${phase}"]`);
      if (found) found.classList.add('active');
    }
    this.render();
  }
};

// ============================================================
// TODAY'S LESSON (Day Detail)
// ============================================================
function getCreatorClass(creator) {
  const c = creator.toLowerCase();
  if (c.includes('naveen')) return 'creator-naveen';
  if (c.includes('testingacademy') || c.includes('pramod')) return 'creator-tta';
  if (c.includes('sdet') || c.includes('pavan')) return 'creator-sdet';
  if (c.includes('mentor') || c.includes('manish')) return 'creator-mentor';
  if (c.includes('telusko')) return 'creator-telusko';
  if (c.includes('testers talk')) return 'creator-testers-talk';
  if (c.includes('mosh')) return 'creator-mosh';
  if (c.includes('amigos')) return 'creator-amigos';
  if (c.includes('kunal')) return 'creator-kunal';
  if (c.includes('automation step')) return 'creator-asb';
  return 'creator-default';
}

const Today = {
  currentDay: null,
  init() { this.render(Progress.getTodayDay()); },
  render(dayNum) {
    dayNum = dayNum || Progress.getTodayDay();
    this.currentDay = dayNum;
    const item = CURRICULUM[dayNum - 1];
    if (!item) return;
    const phase = PHASES.find(p => p.id === item.phase);
    const done = Progress.isDone(dayNum);
    const notes = Progress.getNotes()[dayNum] || '';
    const checks = Progress.getChecklist()[dayNum] || {};

    const container = document.getElementById('day-detail-container');
    const resourcesList = item.resources || [
      { title: 'Free YouTube Tutorial', creator: 'Default Creator', url: item.youtube, duration: '30m', year: '2024' }
    ];

    container.innerHTML = `
      <div class="day-detail-header">
        <div class="day-detail-nav">
          ${dayNum > 1 ? `<button class="btn btn-ghost btn-sm" onclick="Today.render(${dayNum - 1})">← Prev</button>` : ''}
          <span class="day-detail-day">Day ${dayNum} of 90 · <span class="tag ${phase?.color}">${phase?.icon} ${phase?.name}</span></span>
          ${dayNum < 90 ? `<button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="Today.render(${dayNum + 1})">Next →</button>` : ''}
        </div>
        <div class="day-detail-title">${item.topic}</div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
          <span class="study-time-badge">⏱️ Suggested Study Time: ${item.learningTime || '2 Hours'}</span>
        </div>
        <div class="day-detail-desc">${item.desc}</div>
        <div class="day-detail-links">
          <a href="${resourcesList[0].url}" target="_blank" class="btn btn-accent btn-sm">▶ Watch Primary Video</a>
          ${item.practice ? `<a href="${item.practice}" target="_blank" class="btn btn-outline btn-sm">🌐 Practice Site</a>` : ''}
          <button class="btn ${done ? 'btn-success' : 'btn-outline'} btn-sm" onclick="Today.toggleDone(${dayNum})" id="done-btn">
            ${done ? '✅ Completed' : '⬜ Mark Complete'}
          </button>
        </div>
      </div>
      <div class="detail-grid">
        <div>
          <!-- Checklist -->
          <div class="checklist-card">
            <h3>✅ Today's Checklist</h3>
            ${item.checklist.map((task, i) => {
              const checked = checks[i] || false;
              return `<div class="checklist-item ${checked ? 'done' : ''}" onclick="Today.toggleCheck(${dayNum}, ${i})">
                <input type="checkbox" ${checked ? 'checked' : ''} onclick="event.stopPropagation(); Today.toggleCheck(${dayNum}, ${i})" />
                <span class="checklist-text">${task}</span>
              </div>`;
            }).join('')}
          </div>
          <!-- Notes -->
          <div class="notes-card">
            <h3>📝 Your Notes</h3>
            <textarea class="notes-textarea" id="notes-area" placeholder="Write your notes, code snippets, or key points here..." oninput="Today.saveNotes(${dayNum})">${notes}</textarea>
            <div class="notes-save-status" id="notes-status">Auto-saved to browser</div>
          </div>
        </div>
        <!-- Resource links -->
        <div>
          <div class="resource-links-card">
            <h3>📚 Learning Resources</h3>
            
            <!-- Dynamically render all verified resources -->
            ${resourcesList.map(res => `
              <a href="${res.url}" target="_blank" class="resource-link-item">
                <span class="resource-link-icon">▶️</span>
                <div class="resource-link-info">
                  <div class="resource-link-name">${res.title}</div>
                  <div style="margin-top:4px;display:flex;gap:6px;align-items:center;flex-wrap:wrap">
                    <span class="creator-badge ${getCreatorClass(res.creator)}">${res.creator}</span>
                  </div>
                </div>
                <div class="resource-link-meta-right">
                  <span class="duration-chip">⏱️ ${res.duration}</span>
                  <span class="year-badge">📅 ${res.year}</span>
                </div>
              </a>
            `).join('')}

            <!-- Local file reference -->
            <div class="resource-link-item" style="cursor:default">
              <span class="resource-link-icon">📁</span>
              <div class="resource-link-info">
                <div class="resource-link-name" style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;word-break:break-all">${item.localFile}</div>
                <div class="resource-link-type">Local File · Open in File Explorer</div>
              </div>
            </div>

            <!-- Practice Site -->
            ${item.practice ? `<a href="${item.practice}" target="_blank" class="resource-link-item">
              <span class="resource-link-icon">🌐</span>
              <div class="resource-link-info">
                <div class="resource-link-name">Practice Website</div>
                <div class="resource-link-type">Hands-on · Free</div>
              </div>
            </a>` : ''}

            <!-- Reference notes -->
            <a href="https://bit.ly/javanotesatb" target="_blank" class="resource-link-item" ${item.phase !== 3 ? 'style="display:none"' : ''}>
              <span class="resource-link-icon">📓</span>
              <div class="resource-link-info">
                <div class="resource-link-name">Java Notes (ATB)</div>
                <div class="resource-link-type">Reference Notes · Free</div>
              </div>
            </a>
          </div>
          <!-- Day progress -->
          <div class="card" style="margin-top:16px">
            <div class="card-title">Day Completion</div>
            <div style="margin-top:10px">
              ${item.checklist.map((_, i) => {
                const checked = Progress.getChecklist()[dayNum]?.[i] || false;
                return `<span style="display:inline-block;width:24px;height:8px;background:${checked ? 'var(--primary)' : 'rgba(255,255,255,0.08)'};border-radius:4px;margin:2px"></span>`;
              }).join('')}
            </div>
            <div style="margin-top:8px;font-size:0.8rem;color:var(--text-secondary)">
              ${Object.values(Progress.getChecklist()[dayNum] || {}).filter(Boolean).length} / ${item.checklist.length} tasks done
            </div>
          </div>
          <!-- Quick jump -->
          <div class="card" style="margin-top:12px;padding:14px">
            <div class="card-title">Jump to Day</div>
            <div style="margin-top:8px;display:flex;gap:6px;align-items:center">
              <input type="number" min="1" max="90" value="${dayNum}" id="jump-day-input" class="settings-input" style="width:80px;padding:7px 10px" />
              <button class="btn btn-accent btn-sm" onclick="Today.render(parseInt(document.getElementById('jump-day-input').value))">Go</button>
            </div>
          </div>
        </div>
      </div>`;
  },
  toggleDone(dayNum) {
    Progress.toggleDay(dayNum);
    this.render(dayNum);
    Dashboard.refresh();
  },
  toggleCheck(dayNum, idx) {
    const checks = Progress.getChecklist();
    if (!checks[dayNum]) checks[dayNum] = {};
    checks[dayNum][idx] = !checks[dayNum][idx];
    Store.set('qa_checklist', checks);
    this.render(dayNum);
  },
  saveNotes(dayNum) {
    const notes = Progress.getNotes();
    notes[dayNum] = document.getElementById('notes-area')?.value || '';
    Store.set('qa_notes', notes);
    const status = document.getElementById('notes-status');
    if (status) { status.textContent = '✅ Saved · ' + new Date().toLocaleTimeString(); }
  }
};

// ============================================================
// STUDY TIMER
// ============================================================
const Timer = {
  totalSecs: 7200, remaining: 7200, running: false, interval: null, goal: 7200,
  init() {
    this.goal = (Store.get('qa_goal_mins', 120)) * 60;
    this.remaining = this.goal;
    this.totalSecs = this.goal;
    this.updateDisplay();
    this.updateTodayTotal();
  },
  toggle() {
    if (this.running) { this.pause(); }
    else { this.start(); }
  },
  start() {
    if (this.remaining <= 0) this.reset();
    this.running = true;
    document.getElementById('timer-start-btn').textContent = '⏸ Pause';
    this.interval = setInterval(() => {
      this.remaining--;
      Progress.addStudyTime(1 / 60);
      this.updateDisplay();
      this.updateTodayTotal();
      if (this.remaining <= 0) {
        this.pause();
        Alarm.playSound();
        const sessionHours = (this.goal / 3600).toFixed(1).replace('.0', '');
        alert(`🎉 ${sessionHours}-hour study session complete! Great work!`);
      }
    }, 1000);
  },
  pause() {
    this.running = false;
    clearInterval(this.interval);
    document.getElementById('timer-start-btn').textContent = '▶ Resume';
  },
  reset() {
    this.pause();
    this.remaining = this.goal;
    document.getElementById('timer-start-btn').textContent = '▶ Start';
    this.updateDisplay();
  },
  setCustom() {
    const currentHours = (this.goal / 3600).toFixed(1).replace('.0', '');
    const hInput = prompt('Set timer duration in hours (e.g. 2, 1, 0.5, 4):', currentHours);
    if (hInput !== null) {
      const hours = parseFloat(hInput);
      if (!isNaN(hours) && hours > 0) {
        this.pause();
        this.goal = Math.round(hours * 3600);
        this.remaining = this.goal;
        this.totalSecs = this.goal;
        this.updateDisplay();
        // Also update settings goal if relevant
        Store.set('qa_goal_mins', Math.round(hours * 60));
        Dashboard.refresh();
      } else {
        alert('Please enter a valid number of hours (e.g. 0.5, 1, 2).');
      }
    }
  },
  updateDisplay() {
    const h = Math.floor(this.remaining / 3600);
    const m = Math.floor((this.remaining % 3600) / 60);
    const s = this.remaining % 60;
    const str = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const el = document.getElementById('timer-display');
    if (el) el.textContent = str;
    const pct = Math.round((1 - this.remaining / this.totalSecs) * 100);
    const prog = document.getElementById('timer-progress');
    if (prog) prog.style.width = pct + '%';
  },
  updateTodayTotal() {
    const el = document.getElementById('timer-today-total');
    if (el) el.textContent = Math.round(Progress.todayStudyTime()) + ' min';
  }
};

// ============================================================
// SQL ENGINE (Lightweight In-Browser SQL)
// ============================================================
const SQL = {
  tables: {
    employees: [
      { id:1, name:'Riya Sharma', dept:'QA', salary:65000, city:'Mumbai', hire_date:'2022-03-15' },
      { id:2, name:'Amit Kumar', dept:'Dev', salary:85000, city:'Bangalore', hire_date:'2021-07-01' },
      { id:3, name:'Priya Nair', dept:'QA', salary:70000, city:'Chennai', hire_date:'2022-09-10' },
      { id:4, name:'Rahul Singh', dept:'Dev', salary:90000, city:'Pune', hire_date:'2020-01-20' },
      { id:5, name:'Sneha Patel', dept:'QA', salary:68000, city:'Ahmedabad', hire_date:'2023-02-01' },
      { id:6, name:'Vivek Gupta', dept:'DevOps', salary:95000, city:'Delhi', hire_date:'2019-11-15' },
      { id:7, name:'Deepa Reddy', dept:'QA', salary:72000, city:'Hyderabad', hire_date:'2023-06-01' },
      { id:8, name:'Suresh Babu', dept:'Dev', salary:78000, city:'Bangalore', hire_date:'2022-01-10' }
    ],
    bugs: [
      { id:1, title:'Login fails with valid credentials', severity:'Critical', status:'Open', project:'WebApp', reporter_id:1 },
      { id:2, title:'Payment page timeout', severity:'High', status:'In Progress', project:'WebApp', reporter_id:3 },
      { id:3, title:'Typo in footer text', severity:'Low', status:'Closed', project:'Mobile', reporter_id:5 },
      { id:4, title:'API returns 500 for valid payload', severity:'Critical', status:'Open', project:'API', reporter_id:7 },
      { id:5, title:'Search results duplicated', severity:'Medium', status:'Open', project:'WebApp', reporter_id:1 },
      { id:6, title:'Profile picture not loading', severity:'Low', status:'Open', project:'Mobile', reporter_id:3 },
      { id:7, title:'Export to CSV missing data', severity:'High', status:'Closed', project:'API', reporter_id:5 }
    ],
    test_cases: [
      { id:1, title:'Verify login with valid credentials', module:'Auth', status:'Pass', priority:'High', automated:'Yes' },
      { id:2, title:'Verify login with invalid password', module:'Auth', status:'Pass', priority:'High', automated:'Yes' },
      { id:3, title:'Verify forgot password flow', module:'Auth', status:'Fail', priority:'Medium', automated:'No' },
      { id:4, title:'Add item to cart', module:'Cart', status:'Pass', priority:'High', automated:'Yes' },
      { id:5, title:'Remove item from cart', module:'Cart', status:'Pass', priority:'Medium', automated:'Yes' },
      { id:6, title:'Checkout with valid payment', module:'Payment', status:'Fail', priority:'Critical', automated:'No' },
      { id:7, title:'Verify search returns correct results', module:'Search', status:'Pass', priority:'Medium', automated:'Yes' },
      { id:8, title:'Verify 404 page for invalid URL', module:'Navigation', status:'Pass', priority:'Low', automated:'No' }
    ],
    projects: [
      { id:1, name:'WebApp', type:'Web', status:'Active', team_size:6 },
      { id:2, name:'Mobile', type:'Mobile', status:'Active', team_size:4 },
      { id:3, name:'API', type:'Backend', status:'Active', team_size:3 },
      { id:4, name:'Desktop', type:'Desktop', status:'On Hold', team_size:2 }
    ]
  },

  examples: [
    'SELECT * FROM employees',
    'SELECT name, salary FROM employees WHERE dept = \'QA\'',
    'SELECT dept, COUNT(*) as count FROM employees GROUP BY dept',
    'SELECT * FROM bugs WHERE severity = \'Critical\'',
    'SELECT * FROM employees ORDER BY salary DESC',
    'SELECT e.name, b.title FROM employees e INNER JOIN bugs b ON e.id = b.reporter_id',
    'SELECT * FROM test_cases WHERE status = \'Fail\'',
    'SELECT module, COUNT(*) as total FROM test_cases GROUP BY module',
    'SELECT AVG(salary) as avg_salary FROM employees WHERE dept = \'QA\''
  ],

  init() {
    const ex = document.getElementById('sql-examples');
    if (ex) ex.innerHTML = this.examples.slice(0, 6).map(e =>
      `<button class="sql-example-btn" onclick="SQL.setQuery(\`${e.replace(/`/g, '\\`')}\`)">${e.length > 35 ? e.substring(0, 32) + '...' : e}</button>`
    ).join('');
  },

  setQuery(q) {
    const el = document.getElementById('sql-input');
    if (el) { el.value = q; el.focus(); }
  },
  clear() { const el = document.getElementById('sql-input'); if (el) el.value = ''; },
  showSchema(table) {
    const data = this.tables[table];
    if (!data || !data.length) return;
    this.displayResults(data, `Schema for ${table} (${data.length} rows)`);
  },

  run() {
    const query = (document.getElementById('sql-input')?.value || '').trim();
    if (!query) return;
    try {
      const result = this.execute(query);
      this.displayResults(result.rows, `${result.rows.length} row(s) returned`);
    } catch (err) {
      document.getElementById('sql-results').innerHTML = `
        <div class="sql-results-header"><span class="sql-results-title">Results</span><span style="color:var(--red-light);font-size:0.78rem">Error</span></div>
        <div class="sql-error">❌ ${err.message}</div>`;
    }
  },

  execute(query) {
    const q = query.trim().replace(/\s+/g, ' ');
    const upper = q.toUpperCase();
    if (!upper.startsWith('SELECT')) throw new Error('Only SELECT statements are supported in the sandbox.');

    // Parse FROM
    const fromMatch = q.match(/FROM\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?/i);
    if (!fromMatch) throw new Error('Missing FROM clause.');
    const tableName = fromMatch[1].toLowerCase();
    const tableAlias = fromMatch[2] || tableName;
    if (!this.tables[tableName]) throw new Error(`Table "${tableName}" not found. Available: ${Object.keys(this.tables).join(', ')}`);

    let rows = JSON.parse(JSON.stringify(this.tables[tableName]));

    // Parse JOIN
    const joinMatch = q.match(/(?:INNER\s+|LEFT\s+|RIGHT\s+)?JOIN\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?\s+ON\s+(.+?)(?=\s+WHERE|\s+GROUP|\s+ORDER|\s+HAVING|\s+LIMIT|$)/i);
    if (joinMatch) {
      const joinTable = joinMatch[1].toLowerCase();
      const joinAlias = joinMatch[2] || joinTable;
      if (!this.tables[joinTable]) throw new Error(`Join table "${joinTable}" not found.`);
      const joinRows = this.tables[joinTable];
      const onClause = joinMatch[3].trim();
      // Parse ON: e.id = b.reporter_id
      const [leftOn, rightOn] = onClause.split('=').map(s => s.trim());
      const leftCol = leftOn.includes('.') ? leftOn.split('.')[1] : leftOn;
      const rightCol = rightOn.includes('.') ? rightOn.split('.')[1] : rightOn;
      const isLeft = q.match(/LEFT\s+JOIN/i);
      const merged = [];
      for (const r of rows) {
        const matches = joinRows.filter(j => String(j[rightCol]) === String(r[leftCol]));
        if (matches.length) {
          for (const m of matches) merged.push({ ...r, ...m });
        } else if (isLeft) {
          merged.push({ ...r });
        }
      }
      rows = merged;
    }

    // Parse WHERE
    const whereMatch = q.match(/WHERE\s+(.+?)(?=\s+GROUP\s+BY|\s+ORDER\s+BY|\s+HAVING|\s+LIMIT|$)/i);
    if (whereMatch) { rows = this.applyWhere(rows, whereMatch[1].trim()); }

    // Parse GROUP BY
    const groupMatch = q.match(/GROUP\s+BY\s+(.+?)(?=\s+HAVING|\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (groupMatch) {
      const groupCols = groupMatch[1].split(',').map(s => s.trim());
      const selectStr = q.match(/SELECT\s+(.+?)\s+FROM/i)?.[1] || '*';
      rows = this.applyGroupBy(rows, groupCols, selectStr);
    }

    // Parse ORDER BY
    const orderMatch = q.match(/ORDER\s+BY\s+(.+?)(?=\s+LIMIT|$)/i);
    if (orderMatch) {
      const parts = orderMatch[1].split(',').map(s => s.trim());
      rows.sort((a, b) => {
        for (const part of parts) {
          const [col, dir] = part.split(/\s+/);
          const asc = !dir || dir.toUpperCase() !== 'DESC';
          const av = a[col], bv = b[col];
          if (av < bv) return asc ? -1 : 1;
          if (av > bv) return asc ? 1 : -1;
        }
        return 0;
      });
    }

    // Parse LIMIT
    const limitMatch = q.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) rows = rows.slice(0, parseInt(limitMatch[1]));

    // Parse SELECT columns
    const selectRaw = q.match(/SELECT\s+(.+?)\s+FROM/i)?.[1]?.trim() || '*';
    if (selectRaw !== '*' && !groupMatch) {
      const cols = selectRaw.split(',').map(c => {
        const parts = c.trim().split(/\s+AS\s+|\s+/i);
        const col = parts[0].trim().split('.').pop();
        const alias = parts[parts.length - 1] || col;
        return { col, alias };
      });
      rows = rows.map(r => {
        const obj = {};
        for (const { col, alias } of cols) {
          obj[alias] = col in r ? r[col] : r[Object.keys(r).find(k => k.toLowerCase() === col.toLowerCase())] ?? null;
        }
        return obj;
      });
    }

    return { rows };
  },

  applyWhere(rows, condition) {
    return rows.filter(row => {
      try { return this.evalCondition(row, condition); }
      catch { return true; }
    });
  },

  evalCondition(row, cond) {
    // Handle AND / OR
    if (/\s+AND\s+/i.test(cond)) {
      return cond.split(/\s+AND\s+/i).every(c => this.evalCondition(row, c.trim()));
    }
    if (/\s+OR\s+/i.test(cond)) {
      return cond.split(/\s+OR\s+/i).some(c => this.evalCondition(row, c.trim()));
    }
    // LIKE
    const likeM = cond.match(/(.+?)\s+LIKE\s+'(.+?)'/i);
    if (likeM) {
      const col = likeM[1].trim().split('.').pop();
      const pat = likeM[2].replace(/%/g, '.*').replace(/_/g, '.');
      const val = String(row[col] || '');
      return new RegExp(`^${pat}$`, 'i').test(val);
    }
    // IN
    const inM = cond.match(/(.+?)\s+IN\s+\((.+?)\)/i);
    if (inM) {
      const col = inM[1].trim().split('.').pop();
      const vals = inM[2].split(',').map(v => v.trim().replace(/^'|'$/g, ''));
      return vals.includes(String(row[col]));
    }
    // Comparison operators
    const ops = ['!=', '<>', '>=', '<=', '=', '>', '<'];
    for (const op of ops) {
      if (cond.includes(op)) {
        const [left, right] = cond.split(op).map(s => s.trim());
        const col = left.split('.').pop();
        const rowVal = row[col] ?? row[Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase())];
        const compVal = right.replace(/^'|'$/g, '');
        const numRow = parseFloat(rowVal), numComp = parseFloat(compVal);
        const numericCmp = !isNaN(numRow) && !isNaN(numComp);
        switch (op) {
          case '=': return numericCmp ? numRow === numComp : String(rowVal).toLowerCase() === compVal.toLowerCase();
          case '!=': case '<>': return numericCmp ? numRow !== numComp : String(rowVal) !== compVal;
          case '>': return numericCmp ? numRow > numComp : String(rowVal) > compVal;
          case '<': return numericCmp ? numRow < numComp : String(rowVal) < compVal;
          case '>=': return numericCmp ? numRow >= numComp : String(rowVal) >= compVal;
          case '<=': return numericCmp ? numRow <= numComp : String(rowVal) <= compVal;
        }
      }
    }
    return true;
  },

  applyGroupBy(rows, groupCols, selectStr) {
    const groups = {};
    for (const row of rows) {
      const key = groupCols.map(c => row[c.split('.').pop()]).join('|');
      if (!groups[key]) groups[key] = { _rows: [], ...Object.fromEntries(groupCols.map(c => [c.split('.').pop(), row[c.split('.').pop()]])) };
      groups[key]._rows.push(row);
    }
    const aggFuncs = /COUNT\(\*?\)|COUNT\((\w+)\)|SUM\((\w+)\)|AVG\((\w+)\)|MAX\((\w+)\)|MIN\((\w+)\)/gi;
    return Object.values(groups).map(g => {
      const result = { ...g };
      delete result._rows;
      // Parse aggregates from select
      const segs = selectStr.split(',');
      for (const seg of segs) {
        const s = seg.trim();
        const aliasMatch = s.match(/\s+(?:AS\s+)?(\w+)$/i);
        const alias = aliasMatch ? aliasMatch[1] : null;
        if (/COUNT\(\*?\)/i.test(s)) result[alias || 'COUNT(*)'] = g._rows.length;
        else if (/COUNT\((\w+)\)/i.test(s)) { const m = s.match(/COUNT\((\w+)\)/i); result[alias || `COUNT(${m[1]})`] = g._rows.filter(r => r[m[1]] != null).length; }
        else if (/SUM\((\w+)\)/i.test(s)) { const m = s.match(/SUM\((\w+)\)/i); result[alias || `SUM(${m[1]})`] = g._rows.reduce((a, r) => a + (parseFloat(r[m[1]]) || 0), 0); }
        else if (/AVG\((\w+)\)/i.test(s)) { const m = s.match(/AVG\((\w+)\)/i); const vals = g._rows.map(r => parseFloat(r[m[1]])).filter(v => !isNaN(v)); result[alias || `AVG(${m[1]})`] = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null; }
        else if (/MAX\((\w+)\)/i.test(s)) { const m = s.match(/MAX\((\w+)\)/i); result[alias || `MAX(${m[1]})`] = Math.max(...g._rows.map(r => parseFloat(r[m[1]]))); }
        else if (/MIN\((\w+)\)/i.test(s)) { const m = s.match(/MIN\((\w+)\)/i); result[alias || `MIN(${m[1]})`] = Math.min(...g._rows.map(r => parseFloat(r[m[1]]))); }
      }
      return result;
    });
  },

  displayResults(rows, meta) {
    const el = document.getElementById('sql-results');
    if (!rows.length) { el.innerHTML = `<div class="sql-results-header"><span class="sql-results-title">Results</span><span class="sql-results-meta">${meta}</span></div><div class="sql-empty">No rows returned</div>`; return; }
    const cols = Object.keys(rows[0]);
    el.innerHTML = `
      <div class="sql-results-header">
        <span class="sql-results-title">Results</span>
        <span class="sql-results-meta">✅ ${meta}</span>
      </div>
      <div class="sql-table-wrapper">
        <table class="sql-result-table">
          <thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(r => `<tr>${cols.map(c => `<td>${r[c] ?? 'NULL'}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>`;
  }
};

// ============================================================
// POSTMAN VIEWER
// ============================================================
const Postman = {
  current: 0,
  init() {
    const list = document.getElementById('postman-collection-list');
    list.innerHTML = `<div class="sql-tables-header">📬 Collections (${POSTMAN_COLLECTIONS.length})</div>` +
      POSTMAN_COLLECTIONS.map((c, i) => `
        <div class="postman-collection-item ${i === 0 ? 'active' : ''}" onclick="Postman.select(${i})" id="pc-${i}">
          <div class="postman-collection-name">${c.name}</div>
          <div class="postman-collection-meta">${c.requests.length} requests · ${c.desc}</div>
        </div>`).join('');
    this.select(0);
  },
  select(i) {
    this.current = i;
    document.querySelectorAll('.postman-collection-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`pc-${i}`)?.classList.add('active');
    const col = POSTMAN_COLLECTIONS[i];
    document.getElementById('postman-requests-panel').innerHTML = col.requests.map((r, ri) => `
      <div class="postman-request">
        <div class="postman-request-header" onclick="Postman.toggle(${ri})">
          <span class="method-badge method-${r.method}">${r.method}</span>
          <div style="flex:1">
            <div class="request-name">${r.name}</div>
            <div class="request-url">${r.url}</div>
          </div>
          <span id="toggle-${ri}" style="color:var(--text-muted);font-size:1rem">▼</span>
        </div>
        <div class="request-body" id="rb-${ri}" style="display:none">
          ${r.body ? `<div class="request-section-label">Request Body</div><pre>${r.body}</pre>` : '<div style="padding:10px 0;font-size:0.8rem;color:var(--text-muted)">No request body (GET / DELETE)</div>'}
          ${r.tests ? `<div class="request-section-label">Test Scripts (pm.test)</div><pre>${r.tests}</pre>` : ''}
        </div>
      </div>`).join('');
  },
  toggle(ri) {
    const body = document.getElementById(`rb-${ri}`);
    const icon = document.getElementById(`toggle-${ri}`);
    if (body) { const show = body.style.display === 'none'; body.style.display = show ? 'block' : 'none'; if (icon) icon.textContent = show ? '▲' : '▼'; }
  }
};

// ============================================================
// STATS
// ============================================================
const Stats = {
  render() {
    // Heatmap
    const log = Progress.getActivityLog();
    const cells = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const count = log[key] || 0;
      const lvl = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
      cells.push(`<div class="heatmap-cell level-${lvl}" title="${key}: ${count} activities"></div>`);
    }
    const hm = document.getElementById('heatmap-container');
    if (hm) {
      const rows = [];
      for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
      hm.innerHTML = `<div style="display:flex;gap:4px;flex-wrap:wrap">${cells.join('')}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:12px;font-size:0.7rem;color:var(--text-muted)">
          Less ${[0,1,2,3,4].map(l => `<div class="heatmap-cell level-${l}" style="width:12px;height:12px"></div>`).join('')} More
        </div>`;
    }

    // Phase progress
    const pp = document.getElementById('phase-progress-list');
    if (pp) {
      pp.innerHTML = PHASES.map(ph => {
        const p = Progress.getPhaseProgress(ph.id);
        return `<div class="phase-progress-row">
          <div class="phase-progress-header">
            <span class="phase-progress-name"><span class="tag ${ph.color}">${ph.icon} ${ph.name}</span></span>
            <span class="phase-progress-pct">${p.pct}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${p.pct}%"></div></div>
          <div style="font-size:0.7rem;color:var(--text-muted);margin-top:3px">${p.done}/${p.total} days · Days ${ph.days}</div>
        </div>`;
      }).join('');
    }

    // Detail cards
    const totalDone = Progress.totalDone();
    const totalTime = Progress.totalTime();
    const streak = Progress.getStreak();
    const sc = document.getElementById('stats-detail-cards');
    if (sc) {
      sc.innerHTML = [
        { label: 'Total Days Completed', value: `${totalDone}/90`, icon: '✅' },
        { label: 'Overall Progress', value: Math.round(totalDone / 90 * 100) + '%', icon: '📈' },
        { label: 'Total Study Time', value: `${Math.round(totalTime)}m`, icon: '⏱️' },
        { label: 'Avg Daily Study', value: `${Math.round(totalTime / Math.max(Object.keys(Progress.getStudyTime()).length, 1))}m`, icon: '📊' },
        { label: 'Current Streak', value: `${streak} days`, icon: '🔥' },
        { label: 'Active Days', value: `${Object.keys(Progress.getActivityLog()).length}`, icon: '📅' }
      ].map(s => `<div class="card"><div class="card-title">${s.icon} ${s.label}</div><div class="card-value" style="font-size:1.6rem">${s.value}</div></div>`).join('');
    }
  }
};

// ============================================================
// ALARM
// ============================================================
const Alarm = {
  intervalId: null,
  init() {
    const savedTime = Store.get('qa_alarm_time', '20:00');
    const enabled = Store.get('qa_alarm_enabled', false);
    const el = document.getElementById('alarm-time');
    const toggle = document.getElementById('alarm-enabled');
    if (el) el.value = savedTime;
    if (toggle) toggle.checked = enabled;
    if (enabled) this.startChecker();
  },
  toggle() {
    const enabled = document.getElementById('alarm-enabled')?.checked;
    Store.set('qa_alarm_enabled', enabled);
    if (enabled) {
      this.requestPermission();
      this.startChecker();
    } else {
      clearInterval(this.intervalId);
    }
  },
  save() {
    Store.set('qa_alarm_time', document.getElementById('alarm-time')?.value);
  },
  requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => {
        const n = document.getElementById('alarm-notif');
        if (n) { n.style.display = 'block'; n.textContent = p === 'granted' ? '✅ Notifications enabled! You will get daily study reminders.' : '⚠️ Notifications blocked. Alarm sound will still play.'; }
      });
    }
  },
  startChecker() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      const now = new Date();
      const alarmTime = Store.get('qa_alarm_time', '20:00');
      const [ah, am] = alarmTime.split(':').map(Number);
      if (now.getHours() === ah && now.getMinutes() === am) {
        this.fire();
      }
    }, 60000);
  },
  fire() {
    const todayDay = Progress.getTodayDay();
    const topic = CURRICULUM[todayDay - 1]?.topic || 'your lesson';
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('📚 Time to Study!', { body: `Day ${todayDay}: ${topic}`, icon: '🧪' });
    }
    this.playSound();
  },
  playSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.2 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.4);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 0.4);
      });
    } catch (e) {}
  },
  testSound() { this.playSound(); }
};

// ============================================================
// SETTINGS
// ============================================================
const Settings = {
  load() {
    const startDate = Store.get('qa_start_date', '');
    const goal = Store.get('qa_goal_mins', 120);
    const creds = Store.get('qa_credentials');
    const el1 = document.getElementById('setting-start-date');
    const el2 = document.getElementById('setting-goal');
    const el3 = document.getElementById('setting-username');
    if (el1) el1.value = startDate;
    if (el2) el2.value = goal;
    if (el3) el3.value = creds?.user || 'learner';
    Alarm.init();
    if (typeof FirebaseSync !== 'undefined') {
      FirebaseSync.loadSettingsUI();
    }
  },
  saveStartDate() {
    Store.set('qa_start_date', document.getElementById('setting-start-date')?.value);
    Dashboard.refresh();
  },
  saveGoal() {
    Store.set('qa_goal_mins', parseInt(document.getElementById('setting-goal')?.value || 120));
    Timer.init();
  },
  saveCredentials() {
    const user = document.getElementById('setting-username')?.value?.trim();
    const pass = document.getElementById('setting-password')?.value;
    const creds = Store.get('qa_credentials');
    if (user) creds.user = user;
    if (pass) creds.pass = btoa(pass);
    Store.set('qa_credentials', creds);
    Store.set('qa_session', { user, ts: Date.now() });
    const n = document.getElementById('cred-notif');
    if (n) { n.style.display = 'block'; n.textContent = '✅ Credentials updated successfully! Use new login next time.'; setTimeout(() => n.style.display = 'none', 4000); }
    document.getElementById('setting-password').value = '';
  },
  resetProgress() {
    if (!confirm('⚠️ This will delete ALL your progress, notes, and study time. This cannot be undone!\n\nAre you sure?')) return;
    ['qa_completed', 'qa_notes', 'qa_checklist', 'qa_study_time', 'qa_activity'].forEach(k => Store.del(k));
    Dashboard.refresh();
    alert('✅ Progress reset. Starting fresh!');
  },
  exportProgress() {
    const data = {};
    const keys = ['qa_completed', 'qa_notes', 'qa_checklist', 'qa_study_time', 'qa_activity', 'qa_start_date', 'qa_goal_mins', 'qa_alarm_time', 'qa_alarm_enabled'];
    keys.forEach(k => {
      const v = localStorage.getItem(k);
      if (v !== null) data[k] = v;
    });
    try {
      const serialized = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
      navigator.clipboard.writeText(serialized).then(() => {
        const msg = document.getElementById('export-msg');
        if (msg) {
          msg.style.display = 'inline';
          setTimeout(() => msg.style.display = 'none', 3000);
        }
      });
    } catch (e) {
      alert('Error copying backup code: ' + e.message);
    }
  },
  importProgress() {
    const code = document.getElementById('import-code-area')?.value?.trim();
    if (!code) {
      alert('Please paste a progress code first.');
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(code)));
      const data = JSON.parse(decoded);
      if (confirm('Importing this backup will overwrite your current progress on this device. Do you want to proceed?')) {
        Object.keys(data).forEach(k => {
          localStorage.setItem(k, data[k]);
        });
        alert('🎉 Progress successfully synchronized! Reloading page to update...');
        location.reload();
      }
    } catch (e) {
      alert('❌ Invalid progress code. Please make sure you copied the entire backup code string.');
    }
  }
};

// ============================================================
// FIREBASE CLOUD SYNC ENGINE
// ============================================================
const FirebaseSync = {
  db: null,
  auth: null,
  active: false,
  listener: null,
  pushTimeout: null,
  isIncomingUpdate: false,
  keysToSync: [
    'qa_completed',
    'qa_notes',
    'qa_checklist',
    'qa_study_time',
    'qa_activity',
    'qa_start_date',
    'qa_goal_mins'
  ],

  init() {
    this.loadSettingsUI();
    const configStr = localStorage.getItem('qa_fb_config');
    const username = localStorage.getItem('qa_fb_username');
    const encPassword = localStorage.getItem('qa_fb_password');

    if (configStr && username && encPassword) {
      this.updateStatus('connecting', 'Connecting to Firebase Cloud Sync...');
      this.initializeFirebase(configStr, username, atob(encPassword));
    } else {
      this.updateStatus('offline', 'Local Storage');
    }
  },

  updateStatus(state, message) {
    const topPill = document.getElementById('topbar-sync-indicator');
    const banner = document.getElementById('fb-status-banner');

    if (topPill) {
      topPill.className = `sync-status-indicator ${state}`;
      const dot = topPill.querySelector('.sync-dot');
      const text = topPill.querySelector('.sync-text');
      if (text) {
        if (state === 'connected') {
          text.textContent = 'Cloud Connected';
        } else if (state === 'connecting') {
          text.textContent = 'Syncing...';
        } else {
          text.textContent = 'Local Storage';
        }
      }
    }

    if (banner) {
      banner.style.display = 'block';
      if (state === 'connected') {
        banner.className = 'notif-banner notif-success';
        banner.textContent = `✅ Cloud Sync active! Authenticated as ${localStorage.getItem('qa_fb_username')}`;
      } else if (state === 'connecting') {
        banner.className = 'notif-banner notif-info';
        banner.textContent = `⏳ ${message}`;
      } else if (state === 'error') {
        banner.className = 'notif-banner notif-danger';
        banner.textContent = `❌ Sync Error: ${message}`;
      } else {
        banner.style.display = 'none';
      }
    }
  },

  initializeFirebase(configStr, username, password) {
    if (typeof firebase === 'undefined') {
      this.updateStatus('error', 'Firebase SDK scripts not loaded. Check your network or connection.');
      this.active = false;
      return;
    }

    try {
      const config = JSON.parse(configStr);
      let app;
      if (firebase.apps.length === 0) {
        app = firebase.initializeApp(config);
      } else {
        app = firebase.app();
      }

      this.auth = firebase.auth();
      this.db = firebase.firestore();

      const email = `${username}@qahub.local`;
      this.auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          this.active = true;
          this.updateStatus('connected');
          this.startSnapshotListener(userCredential.user.uid);
        })
        .catch((authError) => {
          if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
            this.updateStatus('connecting', 'User profile not found. Attempting auto-registration...');
            this.auth.createUserWithEmailAndPassword(email, password)
              .then((userCredential) => {
                this.active = true;
                this.updateStatus('connected');
                this.pushImmediately(userCredential.user.uid);
                this.startSnapshotListener(userCredential.user.uid);
              })
              .catch((regError) => {
                console.error(regError);
                if (regError.code === 'auth/email-already-in-use') {
                  this.updateStatus('error', 'Incorrect password for this Sync Username.');
                } else {
                  this.updateStatus('error', `Sync setup failed: ${regError.message}`);
                }
                this.active = false;
              });
          } else {
            console.error(authError);
            this.updateStatus('error', `Authentication failed: ${authError.message}`);
            this.active = false;
          }
        });
    } catch (e) {
      console.error(e);
      this.updateStatus('error', `Initialization failed: ${e.message}`);
      this.active = false;
    }
  },

  connect() {
    const configStr = document.getElementById('fb-config-input')?.value?.trim();
    const username = document.getElementById('fb-username')?.value?.trim();
    const password = document.getElementById('fb-password')?.value;

    if (!configStr || !username || !password) {
      alert('Please fill out all Firebase Cloud Sync fields (Config JSON, Username, and Password).');
      return;
    }

    try {
      JSON.parse(configStr);
    } catch (e) {
      alert('Invalid Firebase Config JSON format. Please paste a valid JSON object.');
      return;
    }

    localStorage.setItem('qa_fb_config', configStr);
    localStorage.setItem('qa_fb_username', username);
    localStorage.setItem('qa_fb_password', btoa(password));

    this.updateStatus('connecting', 'Connecting to Firebase Cloud Sync...');
    this.initializeFirebase(configStr, username, password);
  },

  disconnect() {
    if (this.listener) {
      this.listener();
      this.listener = null;
    }
    if (this.auth) {
      this.auth.signOut().catch(() => {});
    }

    localStorage.removeItem('qa_fb_config');
    localStorage.removeItem('qa_fb_username');
    localStorage.removeItem('qa_fb_password');

    this.active = false;
    this.updateStatus('offline');
    
    const configEl = document.getElementById('fb-config-input');
    const userEl = document.getElementById('fb-username');
    const passEl = document.getElementById('fb-password');
    if (configEl) configEl.value = '';
    if (userEl) userEl.value = '';
    if (passEl) passEl.value = '';

    alert('Disconnected from Firebase Cloud Sync.');
  },

  startSnapshotListener(uid) {
    if (this.listener) this.listener();

    const docRef = this.db.collection('users').doc(uid).collection('progress').doc('latest');
    this.listener = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        const cloudData = doc.data();
        this.isIncomingUpdate = true;

        let changed = false;
        this.keysToSync.forEach(k => {
          if (cloudData[k] !== undefined) {
            const currentVal = localStorage.getItem(k);
            if (currentVal !== cloudData[k]) {
              localStorage.setItem(k, cloudData[k]);
              changed = true;
            }
          }
        });

        this.isIncomingUpdate = false;

        if (changed) {
          console.log('FirebaseSync: Real-time update loaded from cloud');
          if (Router.current === 'dashboard') Dashboard.refresh();
          if (Router.current === 'plan') Plan.render();
          if (Router.current === 'stats') Stats.render();
          if (Router.current === 'settings') Settings.load();
          if (Router.current === 'today') Today.render();
          Timer.init();
        }
      } else {
        console.log('FirebaseSync: Initializing Firestore document with local data...');
        this.pushImmediately(uid);
      }
    }, (error) => {
      console.error('FirebaseSync Snapshot Error:', error);
      this.updateStatus('error', `Sync interrupted: ${error.message}`);
    });
  },

  queuePush() {
    if (this.isIncomingUpdate) return;

    if (this.pushTimeout) clearTimeout(this.pushTimeout);
    this.pushTimeout = setTimeout(() => {
      const user = this.auth?.currentUser;
      if (user) {
        this.pushImmediately(user.uid);
      }
    }, 1000);
  },

  pushImmediately(uid) {
    if (!this.db) return;
    const docRef = this.db.collection('users').doc(uid).collection('progress').doc('latest');

    const payload = {};
    this.keysToSync.forEach(k => {
      const v = localStorage.getItem(k);
      if (v !== null) {
        payload[k] = v;
      }
    });

    docRef.set(payload, { merge: true })
      .then(() => {
        console.log('FirebaseSync: Data synced successfully to cloud!');
      })
      .catch((error) => {
        console.error('FirebaseSync Firestore Push Error:', error);
      });
  },

  loadSettingsUI() {
    const configStr = localStorage.getItem('qa_fb_config') || '';
    const username = localStorage.getItem('qa_fb_username') || '';
    const encPassword = localStorage.getItem('qa_fb_password') || '';

    const configEl = document.getElementById('fb-config-input');
    const userEl = document.getElementById('fb-username');
    const passEl = document.getElementById('fb-password');

    if (configEl) configEl.value = configStr;
    if (userEl) userEl.value = username;
    if (passEl) {
      if (encPassword) {
        try {
          passEl.value = atob(encPassword);
        } catch (e) {
          passEl.value = '';
        }
      } else {
        passEl.value = '';
      }
    }
  }
};

// ============================================================
// APP INIT
// ============================================================
const App = {
  init() {
    // Set default start date if not set
    if (!Store.get('qa_start_date')) {
      Store.set('qa_start_date', new Date().toISOString().split('T')[0]);
    }
    Timer.init();
    Dashboard.init();
    Plan.init();
    Today.init();
    SQL.init();
    Postman.init();
    Alarm.init();
    if (typeof FirebaseSync !== 'undefined') {
      FirebaseSync.init();
    }
    // Handle keyboard Enter on login
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && document.getElementById('sql-input') === document.activeElement) {
        // Don't submit on SQL textarea
      }
    });
  }
};

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => { Auth.init(); });
