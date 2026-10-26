# AICTE SAMANVAY: Full-Stack Complaint Management and Tracking Portal

AICTE SAMANVAY is a centralized, role-based grievance management and tracking platform built for technical education institutions under the All India Council for Technical Education (AICTE), Ministry of Education, Government of India. 

Designed for the Smart India Hackathon (SIH) demonstration and production readiness, the platform enables students, faculty, and non-teaching staff to lodge complaints, track progress via audited timelines, and submit post-resolution satisfaction audits, while equipping Institutional Nodal Officers and Central AICTE Administrators with jurisdictional triage and decision support.

---

## 1. Key Features

- **Multi-Role Stakeholder Architecture**: Distinct workflows for Students, Faculty / Teachers, Non-Teaching Staff, Institution Nodal Officers, and Central AICTE Administrators.
- **5-Step Grievance Registration Wizard**:
  - Step 1: Complainant particulars verified from institutional credentials.
  - Step 2: Standardized grievance classification across 14 regulatory categories.
  - Step 3: Factual incident narrative, priority grading, target selection, and evidence upload (PDF/JPG/PNG max 5 MB).
  - Step 4: Rule-based duplicate similarity detection and legal accuracy declaration.
  - Step 5: Immutable reference ID generation (e.g., `AICTE-2026-000101`) and printable acknowledgement receipt.
- **Visual 8-Stage Status Timeline**: Chronological tracking across submission, acknowledgment, assignment, review, hearing, resolution, and closure with timestamps and actor signatures.
- **Confidential Grievance Redressal**: Identity masking and restricted access for sensitive harassment and safety allegations.
- **Smart Routing and Decision Support**: Dynamic assignment to specialized bureaus (Academic Redressal Cell, Research Welfare, Anti-Harassment, Infrastructure, etc.).
- **Institutional Analytics and Reporting**: Resolution rates, average turnaround days, monthly intake trends, and category distributions visualised via Recharts.
- **5-Dimension Post-Resolution Audit**: Complainant feedback rating satisfaction, effectiveness, timeliness, communication, and fairness.
- **Administrative Triage Queue**: Permitted status updates with transition validation, case assignment, escalation, institutional replies, and binding orders.
- **Notification Center**: Real-time alerts for workflow milestones and status updates.

---

## 2. Technology Stack

Built using the MERN stack with pure JavaScript (ES6+):

### Frontend
- **Framework**: React.js (v18) via Vite build tooling
- **Styling**: Tailwind CSS (Government enterprise design system: Navy `#0f172a`, Royal Blue `#1d4ed8`, Slate backgrounds)
- **Routing**: React Router (v6) with role-based route guards
- **API Client**: Axios with centralized token interceptors
- **Icons**: Lucide React (Clean institutional iconography, strictly no emojis)
- **Visualizations**: Recharts (Accessible bar charts and distribution graphs)

### Backend
- **Runtime**: Node.js (ES modules)
- **API Framework**: Express.js REST API
- **Database Modeling**: Mongoose schemas for User, Complaint, ComplaintHistory, Feedback, and Notification
- **Authentication**: JWT tokens and simulated OTP verification service with 5-minute expiry
- **File Management**: Multer disk storage with MIME type checking and 5 MB limits
- **Security**: Helmet HTTP headers, CORS controls, and rate-limited resend windows

---

## 3. Project Directory Structure

```
SIH-AICTE-Samanvay/
├── client/                      # React + Vite frontend
│   ├── public/                  # Favicon and assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Button, Card, Badge, Modal, Table, Input, Select, etc.
│   │   │   └── navigation/      # Sidebar, Topbar, Footer
│   │   ├── context/             # AuthContext, NotificationContext
│   │   ├── layouts/             # DashboardLayout
│   │   ├── pages/               # LandingPage, LoginPage, DashboardPage, RegisterComplaintPage,
│   │   │                        # TrackComplaintsPage, ComplaintDetailPage, AdminComplaintsPage,
│   │   │                        # InstitutionalStatsPage, FeedbackPage, NotificationsPage, HelpSupportPage
│   │   ├── services/            # api, authService, complaintService, analyticsService, feedbackService
│   │   └── utils/               # constants, formatters
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                      # Node.js + Express backend
│   ├── config/                  # constants.js, db.js
│   ├── controllers/             # authController, complaintController, adminController, analyticsController, etc.
│   ├── middleware/              # auth.js, rbac.js, upload.js, errorHandler.js
│   ├── models/                  # User.js, Complaint.js, ComplaintHistory.js, Feedback.js, Notification.js
│   ├── routes/                  # authRoutes, complaintRoutes, adminRoutes, analyticsRoutes, etc.
│   ├── services/                # otpService, duplicateService, routingService, memoryStore.js
│   ├── uploads/                 # Storage for evidentiary uploads
│   ├── server.js                # Express entrypoint
│   └── package.json
├── .env.example                 # Environment variable templates
├── .gitignore
├── package.json                 # Root script runner
└── README.md
```

---

## 4. Prerequisites

- **Node.js**: v18.0.0 or higher (v24 tested)
- **npm**: v9.0.0 or higher
- **MongoDB** (Optional for local testing): MongoDB v6.0+ local daemon or MongoDB Atlas cluster. When MongoDB is unreachable, the server automatically initializes a persistent, in-memory data store with demo records.

---

## 5. Quick Start Instructions

### Step 1: Install Dependencies

From the root project folder:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Environment

Copy `.env.example` to `server/.env`:

```bash
cp .env.example server/.env
```

### Step 3: Run the Backend Server

```bash
cd server
npm run dev
```

The Express server will start on **`http://localhost:5000`**.

### Step 4: Run the Frontend Dev Server

In a second terminal window:

```bash
cd client
npm run dev
```

The Vite client will launch on **`http://localhost:5173`**.

---

## 6. Demonstration Authentication for Evaluators

For Smart India Hackathon jury review, the portal provides instant one-click demonstration logins directly from the **Landing Page** and **Sign In Page**, as well as a quick role switcher in the top navigation bar.

| Role | Pre-configured Demo Account | Purpose |
| :--- | :--- | :--- |
| **Student** | `student@samanvay.demo` | Register grievances, track timelines, upload documents, rate resolution |
| **Faculty** | `faculty@samanvay.demo` | Lodge research grant delays and academic infrastructure issues |
| **Non-Teaching Staff** | `staff@samanvay.demo` | Report establishment and duty register irregularities |
| **Institution Nodal Officer** | `nodal@samanvay.demo` | Triage Delhi Technological University complaints, submit inquiry replies |
| **Central AICTE Administrator**| `admin@samanvay.demo` | Nationwide queue oversight, cell assignment, escalation, formal orders |

*Standard Demo OTP:* When using the standard login form with any email or phone number, enter verification code **`123456`**.

---

## 7. REST API Overview

All endpoints are prefixed with `/api`.

| Module | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/request-otp` | Public | Generate 6-digit OTP |
| **Auth** | `POST` | `/api/auth/verify-otp` | Public | Verify code, issue JWT token |
| **Auth** | `POST` | `/api/auth/demo-login` | Public | Quick evaluator authentication |
| **Auth** | `GET` | `/api/auth/me` | Authenticated | Fetch current profile |
| **Complaints** | `POST` | `/api/complaints` | Complainants | Register new institutional complaint |
| **Complaints** | `GET` | `/api/complaints/my` | Complainants | Fetch personal complaint records |
| **Complaints** | `GET` | `/api/complaints/:id` | Authorized | Fetch complaint details and timeline |
| **Complaints** | `POST` | `/api/complaints/:id/notes` | Complainants | Append clarification notes |
| **Complaints** | `POST` | `/api/complaints/:id/documents`| Complainants | Upload supporting evidence |
| **Complaints** | `POST` | `/api/complaints/:id/reopen` | Complainants | Request case reopening |
| **Complaints** | `POST` | `/api/complaints/check-duplicates`| Authenticated | Similarity scoring against existing complaints |
| **Admin** | `GET` | `/api/admin/complaints` | Nodal / Admin | Jurisdictional complaint triage queue |
| **Admin** | `PATCH`| `/api/admin/complaints/:id/status`| Nodal / Admin | Update workflow status with audited remarks |
| **Admin** | `PATCH`| `/api/admin/complaints/:id/assignment`| Nodal / Admin | Assign to officer and cell |
| **Admin** | `POST` | `/api/admin/complaints/:id/escalate`| Nodal / Admin | Escalate case to higher council authority |
| **Admin** | `POST` | `/api/admin/complaints/:id/response`| Nodal Officer | Submit institutional inquiry findings |
| **Admin** | `POST` | `/api/admin/complaints/:id/resolve` | Nodal / Admin | Issue binding resolution summary |
| **Analytics** | `GET` | `/api/analytics/dashboard` | Authenticated | KPI cards, status distributions, monthly trends |
| **Analytics** | `GET` | `/api/analytics/institutional` | Authenticated | Resolution rates, turnaround days, category metrics |
| **Feedback** | `POST` | `/api/feedback/:complaintId`| Complainants | Submit 5-star resolution satisfaction audit |
| **Feedback** | `GET` | `/api/feedback/analytics` | Authenticated | Aggregate satisfaction score and star breakdown |
| **Notifications**| `GET` | `/api/notifications` | Authenticated | User notification inbox |
| **Notifications**| `PATCH`| `/api/notifications/:id/read` | Authenticated | Mark alert as read |

---

## 8. Anti-Vibe-Coding Design Adherence

In accordance with strict enterprise and government application requirements:
- **No purple gradients** or neon glows.
- **No pill-shaped buttons** (moderately rounded rectangular geometry used throughout).
- **No em dashes** (`—` or `–`) in visible user interface copy.
- **No emoji icons** (standardized Lucide React iconography used exclusively).
- **No fake marketing copy or AI badges** ("Made with AI" or similar tags are strictly omitted).
- **Restrained Color Palette**: Deep Navy Blue (`#0f172a`), Royal Blue (`#1d4ed8`), Neutral Slate (`#f8fafc`, `#e2e8f0`), Emerald Green (`#15803d`) for resolutions, Amber (`#b45309`) for pending alerts, and Red (`#b91c1c`) for urgent issues.

---

## 9. Production Deployment Considerations

1. **MongoDB Connection**: Supply a production connection string via `MONGODB_URI` in `server/.env`.
2. **Reverse Proxy / HTTPS**: Terminate SSL using Nginx or Cloudflare in front of the application.
3. **SMS & Email Relays**: Connect production credentials for providers such as CDAC SMS Gateway or AWS SES in `server/services/otpService.js`.
4. **Cloud Object Storage**: Transition from local Multer disk storage to S3 or Azure Blob Storage for institutional document archives.
