# 🛠️ Construction Website – Admin Dashboard

This folder contains the **Admin Dashboard** used to manage all content of the Construction Website.  
It provides a secure interface for administrators to manage:

- Projects  
- Services  
- Features  
- Gallery Images  
- Career Applications  
- Job Listings  
- Contact Queries  
- Admin Profile (via authentication)

The dashboard is built with **React + Vite**, state-managed using **Redux Toolkit**, and styled with **TailwindCSS**. It communicates with the backend API using axios (`withCredentials: true`) for JWT cookie authentication.

---

## ⚙️ Tech Stack

- **React 19**
- **React Router v7**
- **Redux Toolkit**
- **Vite**
- **TailwindCSS**
- **Axios**
- **React Toastify**
- **Lucide Icons**
- **Framer Motion**

---

## 📁 Folder Structure

dashboard/
│
├── src/
│ ├── components/ # AdminLayout, Sidebar, ProtectedRoute, UI components
│ ├── pages/ # Dashboard pages (Projects, Services, Gallery, etc.)
│ ├── redux/
│ │ ├── slices/ # State slices (auth, projects, services, gallery etc.)
│ │ └── store.js # Central Redux store
│ ├── api/ # axios instance (API.js)
│ ├── App.jsx # Routing logic / Admin routes
│ ├── main.jsx # Entry point
│ └── index.css # TailwindCSS
│
├── public/ # Static icons, images (if any)
├── vite.config.js
├── package.json
└── .env.example # Example environment variables

VITE_API_URL=http://localhost:5000


For production:

VITE_API_URL=https://your-live-backend.com

*/------------------------------------------------------------------------------------------/*




🔐 Authentication

The admin panel uses:

Protected routes

JWT cookies

Auto fetch current user on load

If not authenticated:

User is redirected to /login

Dashboard pages are inaccessible


*/------------------------------------------------------------------------------------------/*

🧭 Routing Structure
Public Route

/login – Admin Login Page

Protected Admin Routes

Wrapped inside <ProtectedRoute> and <AdminLayout />:

/dashboard – Overview analytics

/projects – Manage projects

/services – Manage services

/features – Manage features

/gallery – Upload / delete gallery images

/job – Manage job listings

/career – Manage career submissions

/contact – View contact form submissions



*/------------------------------------------------------------------------------------------/*


🚀 Development Setup

1️⃣ Install dependencies
npm install

2️⃣ Start development server
npm run dev

Dashboard will run on:
http://localhost:5174




*/------------------------------------------------------------------------------------------/*

🏗️ Production Build

To generate a production build:

npm run build


*/------------------------------------------------------------------------------------------/*

🔌 API Requirements

Backend must allow CORS:

origin: [
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL
],
credentials: true


Your backend already supports:

DASHBOARD_URL=http://localhost:5174  (check your terminal for latest url)

*/------------------------------------------------------------------------------------------/*

🧯 Troubleshooting

Issue	Reason	Fix

Login not working	Cookies blocked	Ensure backend has credentials: true and correct CORS

Redux state empty	Backend URL incorrect	Verify VITE_API_URL

Upload fails	Cloudinary key missing	Check backend .env

Route blank / layout missing	Incorrect nested route	Check AdminLayout & Outlet usage

"Loading…" stuck	Backend not reachable	API base URL wrong


*/------------------------------------------------------------------------------------------/*


👨‍💻 Developer

Name: Aneesh Chauhan
Role: Full Stack Developer (MERN)
License: Client Private Use Only
