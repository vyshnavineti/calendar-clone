# Calendar Clone — Scaler Assignment

Hey! This is my **Calendar Clone app**, built as part of the Scaler assignment.  
It’s a simple and functional calendar where you can **add, view, edit, and delete events**, with a proper backend and persistent storage.

Everything works locally — with both frontend and backend connected smoothly.

---

## 🚀 Tech Stack Used

### 🖥️ Frontend
- **React (Vite)** – for fast and responsive UI
- **Tailwind CSS** – for clean styling
- **Fetch API** – to connect with the backend

### ⚙️ Backend
- **Node.js + Express.js** – for creating REST APIs
- **CORS** – to allow requests between frontend & backend
- **File-based JSON storage** – data is saved in `events.json` (so it stays even after restarting the server)

---

## 📁 Project Structure

```bash
calendar-clone/
│
├── backend/
│   ├── server.js        # Express server and API routes
│   ├── events.json      # Stores all events
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main calendar UI
│   │   ├── AddEvent.jsx     # Form to add/edit events
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   └── package.json
│
└── README.md
```
---

## 🧠 Features

✅ Add new events (with date & time)  
✅ Edit existing events  
✅ Delete events  
✅ View all events for a selected date  
✅ Persistent data saved in JSON  
✅ Simple REST APIs for CRUD operations  

---

## ⚡ How to Run Locally

### 1️⃣ Clone the repo
```bash
git clone https://github.com/vyshnavineti/calendar-clone.git
cd backend && npm install && npx nodemon server.js
frontend && npm run dev
```
---
## 🧩 Architecture Overview

- Frontend: Handles UI and user interactions

- Backend: Handles logic, CRUD operations, and data persistence

- They communicate using REST APIs via fetch() calls
---
## 🖼️ Project Preview
<img width="656" height="836" alt="image" src="https://github.com/user-attachments/assets/3df667eb-f5a3-4607-beb7-a391699bc9fe" />
<img width="971" height="700" alt="image" src="https://github.com/user-attachments/assets/639aaf1e-89f4-41e8-9197-8a1c8dec0dcb" />

It doesn't create multiple meetings at same date and time.
---
## 👩‍💻 Author

- Vyshnavi Neti
- e22cseu0148@bennett.edu.in
- Bennett University
- BTech CSE (AIML)
- Built for Scaler Assignment 💻
- Frontend + Backend both implemented and tested locally
