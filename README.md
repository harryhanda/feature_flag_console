# 🚩 Feature Flag Console

A full-stack **Feature Flag Management System** built with the MERN stack.

Manage feature flags from an admin dashboard, control their rollout across environments, and see changes reflected in a separate live demo application.

## 🚀 Try It Live

### 🎮 Live Demo

👉 **[Open the Feature Flag Demo](https://feature-flag-console-pjid.vercel.app/)**

The demo is a Netflix-style client application that consumes the public feature-flag evaluation API.

### 🖥️ Admin Dashboard

👉 **[Open the Admin Dashboard](https://feature-flag-console-lovat.vercel.app/)**

Use the dashboard to create, update, enable, disable, and configure feature flags.

### 💻 Source Code

👉 **[GitHub Repository](https://github.com/harryhanda/feature_flag_console)**

### ⚙️ Backend API

👉 **[Backend API](https://feature-flag-console.onrender.com)**

---

## 🎯 What This Project Does

Feature flags allow developers to change application behavior **without redeploying the application**.

This project provides:

* A React-based admin dashboard
* An Express + Node.js backend
* MongoDB Atlas for persistent storage
* JWT authentication
* Role-based access control
* Feature flag management
* Environment-specific configuration
* Percentage-based rollouts
* Public feature evaluation API
* Audit logging
* A separate live demo client

The demo client continuously checks the public evaluation API, allowing feature changes made from the dashboard to appear in the demo without redeploying the demo application.

---

## ✨ Main Features

### 🔐 Authentication

* User registration
* Login / logout
* JWT authentication
* Password change
* Current-user endpoint

### 👥 Role-Based Access Control

The system supports:

```text
Admin
  ↓
Developer
  ↓
Viewer
```

Different roles receive different permissions for managing the system.

### 🚩 Feature Flags

Create and manage feature flags with:

* Feature name
* Enabled / disabled state
* Percentage rollout
* Environment-specific overrides

Supported environments:

```text
Development
Staging
Production
```

### 📊 Percentage Rollouts

Features can be gradually released to users.

For example:

```text
Feature: New Checkout

Rollout: 25%

→ Approximately 25% of eligible users receive the feature
```

The rollout uses deterministic evaluation, meaning the same user consistently receives the same result.

### 📝 Audit Logging

Important management actions are recorded, including:

* Feature creation
* Feature updates
* Feature deletion
* Role changes

### 🌐 Public Evaluation API

The demo client does not require an authentication token.

It consumes:

```text
GET /api/public/features
```

Example:

```text
https://feature-flag-console.onrender.com/api/public/features?environment=production&userId=visitor-test123
```

The API returns the resolved feature state for the requested environment and user.

---

# 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │   Admin Dashboard     │
                    │      React/Vercel     │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │      Backend API     │
                    │   Express + Node.js   │
                    │       Render         │
                    └──────────┬───────────┘
                               │
                               │ Mongoose
                               ▼
                    ┌──────────────────────┐
                    │     MongoDB Atlas    │
                    └──────────────────────┘


                    ┌──────────────────────┐
                    │    Demo Client       │
                    │      HTML / JS       │
                    │       Vercel         │
                    └──────────┬───────────┘
                               │
                               │ Public Evaluation API
                               ▼
                    ┌──────────────────────┐
                    │      Backend API     │
                    └──────────────────────┘
```

The frontend and demo client never connect directly to MongoDB. The backend is responsible for database access.

---

# 🔄 How Feature Flags Work

The basic flow is:

```text
1. Developer creates a feature flag
              ↓
2. Flag is stored in MongoDB
              ↓
3. Dashboard updates the flag
              ↓
4. Demo client requests resolved flags
              ↓
5. Backend evaluates:
      • enabled state
      • environment
      • rollout percentage
              ↓
6. Backend returns:
      { name, enabled }
              ↓
7. Demo client changes its UI
```

### Example

Suppose the dashboard contains:

```text
premiumBanner
```

If the flag is enabled:

```text
premiumBanner = true
```

the demo displays the Premium Experience banner.

If it is disabled:

```text
premiumBanner = false
```

the banner disappears.

This demonstrates how feature flags can control production behavior without redeploying the client.

---

# 🧪 Try The Demo

You can test the system yourself.

### Step 1

Open the:

👉 **[Admin Dashboard](YOUR_ADMIN_DASHBOARD_URL_HERE)**

### Step 2

Login with a valid account.

### Step 3

Open the:

👉 **[Live Demo](https://feature-flag-console-pjid.vercel.app/)**

### Step 4

Change a feature flag from the dashboard.

For example:

```text
premiumBanner
festiveMode
betaFeature
autoplayBanner
```

### Step 5

Return to the demo.

The demo periodically requests the latest resolved feature state from the backend and updates the UI.

🎯 **No demo redeployment is required.**

---

# 🛠️ Tech Stack

## Frontend

* React
* JavaScript
* HTML / CSS
* Vercel

## Backend

* Node.js
* Express.js
* JWT
* Mongoose
* bcrypt
* Render

## Database

* MongoDB Atlas

## Demo Client

* HTML
* CSS
* JavaScript
* Vercel

## Development

* Git
* GitHub
* Jest
* Supertest

---

# 📁 Project Structure

```text
feature_flag_console/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── tests/
│   └── server.js
│
├── feature-flag-dashboard/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── demo_client/
│   ├── index.html
│   ├── images/
│   ├── videos/
│   └── assets/
│
├── README.md
└── .gitignore
```

---

# ⚙️ Run Locally

## 1. Clone the repository

```bash
git clone https://github.com/harryhanda/feature_flag_console.git
cd feature_flag_console
```

## 2. Backend

```bash
cd backend
npm install
```

Create:

```text
.env
```

Add your own environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
FRONTEND_URL=http://localhost:3000
DEMO_CLIENT_URL=http://localhost:5500
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5001
```

## 3. Dashboard

Open another terminal:

```bash
cd feature-flag-dashboard
npm install
npm start
```

Dashboard:

```text
http://localhost:3000
```

Configure:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

## 4. Demo Client

```bash
cd demo_client
```

The demo is a static HTML/JavaScript application.

It can be served using:

```bash
npx serve .
```

The API can be supplied using:

```text
?api=http://localhost:5001/api
```

---

# ☁️ Production Deployment

The production architecture uses:

```text
GitHub
   │
   ├── Vercel
   │     └── React Admin Dashboard
   │
   ├── Vercel
   │     └── Demo Client
   │
   └── Render
         └── Express Backend
                │
                └── MongoDB Atlas
```

### Vercel

The React dashboard and static demo client are deployed separately.

### Render

The Express backend is deployed on Render.

### MongoDB Atlas

MongoDB Atlas stores:

* Users
* Feature flags
* Environment configurations
* Audit information

---

# 🔐 Security

The project includes:

* JWT authentication
* Password hashing
* Role-based authorization
* Protected backend routes
* CORS configuration
* Rate limiting
* Security headers
* Environment variables for secrets
* Public API exposing only resolved feature state

**Never commit `.env` files or real credentials to GitHub.**

---

# 🚧 Known Limitations / Future Improvements

Possible future improvements include:

* Automated CI/CD testing with GitHub Actions
* Redis-based distributed rate limiting
* Refresh-token rotation
* More advanced rollout targeting
* Real-time updates using WebSockets or Server-Sent Events
* Additional analytics for feature usage

The current demo intentionally uses polling instead of real-time push updates.

---

# 📚 API Documentation

See:

👉 **[Backend API Documentation](backend/API.md)**

---

# 👨‍💻 Author

**Harry Handa**

Computer Science Engineering — AI

---

## ⭐ Project

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

👉 **[Feature Flag Console — GitHub](https://github.com/harryhanda/feature_flag_console)**
