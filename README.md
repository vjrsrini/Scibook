# 🔬 SciBook — Scientific Equipment & Lab Booking System

SciBook is a high-performance, full-stack web application designed for academic institutions, research facilities, and scientific laboratories to manage high-precision equipment usage, user certification levels, and real-time reservation schedules.

---

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js, MongoDB / Mongoose, JWT Authentication, bcryptjs, Socket.IO
- **Frontend**: React 19, Vite, React Router v7, Lucide Icons, Axios, Socket.IO-Client
- **Styling**: Vanilla CSS Modern Glassmorphism Design System (Dark Mode UI)
- **Database Engine**: Hybrid Dual-Engine (Connects to MongoDB local database with automatic instant **In-Memory Database Fallback**)

---

## ✅ Completed Features

### 🔐 1. Authentication & Role-Based Access (RBAC)
- [x] Secure JWT-based user authentication and bcrypt password hashing.
- [x] Multi-tier role system: `student`, `researcher`, `operator`, `admin`.
- [x] User certification tracking (`none`, `basic`, `advanced`) for specialized equipment.
- [x] One-click demo login presets (**Admin**, **Researcher**, **Student**).

### 🔬 2. Instrument Catalog & Telemetry
- [x] Interactive equipment catalog categorized by *Microscopy*, *X-Ray Crystallography*, *Spectroscopy*, and *Mass Spectrometry*.
- [x] Real-time equipment status badges (`available`, `in-use`, `maintenance`, `offline`).
- [x] Instant live search filter by equipment name, specification, or room location.
- [x] Admin & Operator capabilities to add new equipment, edit availability, and delete instruments.

### 📅 3. Smart Time-Slot Reservations
- [x] Overlap prevention logic: automatically blocks double-booking for the same instrument slot.
- [x] Maintenance & Offline enforcement (disables booking for equipment under calibration).
- [x] User reservation management with cancellation capabilities.

### 🛡️ 4. Operator Approval Queue & Admin Dashboard
- [x] Live analytics cards: Total Equipment, Active Sessions, Pending Approvals, Maintenance Alerts.
- [x] Real-time activity feed showing live booking requests.
- [x] Operator approval queue: **One-Click Approve / Reject** workflow.
- [x] Admin User Directory: view all users, modify roles, and grant certification levels.

### ⚡ 5. Real-Time WebSockets & Database Resilience
- [x] Socket.IO real-time event broadcasting (`bookingCreated`, `bookingUpdated`, `instrumentUpdated`) so changes appear instantly on all connected browsers without page reloads.
- [x] Instant In-Memory Database Mode fallback if local MongoDB is offline.
- [x] Automated initial seeding script pre-loaded with standard demo instruments and accounts.

---

## 🔮 Future Roadmap & Proposed Extra Features

### 📊 1. Usage Analytics & Reporting
- [ ] Export usage logs and equipment hours per research department into CSV / PDF format.
- [ ] Visual charts showing peak lab utilization times and instrument wear-and-tear tracking.

### 💳 2. Cost Center & Grant Billing
- [ ] Grant / Budget code tracking for research labs.
- [ ] Automated hourly rate calculation and internal invoice generation for instrument usage.

### 🔔 3. Email & SMS Notifications
- [ ] Automated email/SMS reminders sent 1 hour before a scheduled lab session.
- [ ] Instant notification alerts when an operator approves or rejects a booking request.

### 📸 4. Experiment Logbook & Sample Uploads
- [ ] Digital logbook allowing researchers to attach notes, raw data links, and sample micro-photographs to past bookings.

### 📅 5. Visual Interactive Calendar Matrix
- [ ] Drag-and-drop weekly/monthly grid calendar view for visual time slot selection.

### 🔒 6. Smart Hardware IoT Integration
- [ ] QR Code / RFID badge scanner integration to physically unlock equipment power outlets only during approved reservation times.

---

## 🛠️ Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Server starts on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Application runs on `http://localhost:5173`*
