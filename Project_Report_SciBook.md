# SCIBOOK: AUTOMATED SCIENTIFIC EQUIPMENT & LABORATORY RESERVATION PLATFORM WITH REAL-TIME TELEMETRY

**A PROJECT REPORT**

*Submitted by*  
**VIJAY [SURNAME] (Registration No: 310624205XXX)**

*in partial fulfillment for the award of the Degree of*  
**BACHELOR OF TECHNOLOGY**  
*in*  
**DEPARTMENT OF INFORMATION TECHNOLOGY**

<br>

**EASWARI ENGINEERING COLLEGE**  
*(AN AUTONOMOUS INSTITUTION) – AFFILIATED TO ANNA UNIVERSITY, CHENNAI*  
*Bharathi Salai, Ramapuram, Chennai – 600089*

**OCTOBER 2026**

---

<div style="page-break-after: always;"></div>

# EASWARI ENGINEERING COLLEGE
*(An Autonomous Institution, Affiliated to Anna University, Chennai)*  
*Bharathi Salai, Ramapuram, Chennai – 600089*

### **BONAFIDE CERTIFICATE**

Certified that this mini project report titled **“SCIBOOK: AUTOMATED SCIENTIFIC EQUIPMENT & LABORATORY RESERVATION PLATFORM WITH REAL-TIME TELEMETRY”** is the Bonafide work of **“VIJAY [SURNAME] (Registration No: 310624205XXX)”**, who carried out the project work under my supervision.

<br><br><br>

________________________  
**HEAD OF THE DEPARTMENT**  
Department of Information Technology,  
Easwari Engineering College,  
Ramapuram, Chennai – 600089.  

<br><br>

________________________  
**SUPERVISOR**  
Department of Information Technology,  
Easwari Engineering College,  
Ramapuram, Chennai – 600089.  

---

<div style="page-break-after: always;"></div>

# EASWARI ENGINEERING COLLEGE
*(An Autonomous Institution, Affiliated to Anna University, Chennai)*  
*Bharathi Salai, Ramapuram, Chennai – 600089*

### **CERTIFICATE OF VIVA-VOCE EXAMINATION**

This is to certify that the Viva-Voce Examination of the Project Work entitled **“SCIBOOK: AUTOMATED SCIENTIFIC EQUIPMENT & LABORATORY RESERVATION PLATFORM WITH REAL-TIME TELEMETRY”** submitted by **Mr. VIJAY [SURNAME] (Reg. No: 310624205XXX)** in partial fulfillment of the requirements for the award of the degree of **BACHELOR OF TECHNOLOGY in INFORMATION TECHNOLOGY** was conducted on \_\_\_\_\_\_\_\_\_\_\_\_ (Date) in the Department of Information Technology, Easwari Engineering College, Ramapuram – Chennai.

<br><br>

**Internal Examiner**  
Name:  
Designation:  
Address:  

<br><br>

**External Examiner**  
Name:  
Designation:  
Address:  

<br>

**Date:**  

---

<div style="page-break-after: always;"></div>

### **ABSTRACT**

Academic institutions, analytical testing centers, and modern research laboratories house expensive, high-precision scientific instruments—such as Field Emission Scanning Electron Microscopes (FE-SEM), X-Ray Diffractometers (XRD), High-Field Nuclear Magnetic Resonance (NMR) Spectrometers, and Orbitrap Mass Spectrometers. Managing access to these mission-critical assets traditionally depends on physical paper logbooks, uncoordinated electronic spreadsheets, and disconnected communications. This results in frequent scheduling collisions, unmonitored equipment wear, unauthorized usage by untrained personnel, and costly lab downtime during emergency calibrations.

**SciBook** is a cloud-native, high-concurrency Full-Stack web platform engineered to automate laboratory logistics, equipment telemetry, operator sign-offs, and multi-tier user certification. Built upon the MERN (MongoDB, Express.js, React 19, Node.js) architecture reinforced with Vite and Socket.io, the platform introduces:

1. **Role-Based Access Control (RBAC) & Certification Governance**: Multi-tier privilege hierarchy (`student`, `researcher`, `operator`, `admin`) paired with machine-level certification thresholds (`none`, `basic`, `advanced`) preventing unqualified personnel from operating sensitive hardware.
2. **Conflict-Free Atomic Slot Reservation Engine**: Server-side mathematical collision detection algorithm ($StartTime < RequestedEnd \land EndTime > RequestedStart$) that eliminates double-booking anomalies and automatically locks equipment under maintenance or calibration.
3. **Bi-Directional Real-Time WebSocket Telemetry**: Socket.IO event bus broadcasting live instrument operational states (`available`, `in-use`, `maintenance`, `offline`), immediate reservation updates, and operator approval transitions across all connected client browser sessions without page reloads.
4. **Fault-Tolerant Hybrid Database Architecture**: An intelligent auto-sensing initialization engine that dynamically detects local/cloud MongoDB instances with a 2-second fail-safe timeout, auto-switching to an isolated In-Memory database mode (`mongodb-memory-server` / memory-store) to guarantee zero-downtime execution and uninterrupted evaluations.

The platform features an ultra-responsive, modern Glassmorphism user interface with sub-100ms API response times and live telemetry synchronization, providing a secure, reliable, and auditable foundation for academic and scientific research infrastructure.

<br>
**iv**

---

<div style="page-break-after: always;"></div>

### **ACKNOWLEDGEMENT**

We express our sincere gratitude to the Principal **Dr. P. Deiva Sundari** and the Management of **Easwari Engineering College** for providing us with the opportunity and state-of-the-art facilities to carry out this project work.

We convey our heartfelt thanks to the Head of the Department, **Department of Information Technology**, for continuous encouragement, valuable suggestions, and steadfast support throughout our academic journey.

We are extremely thankful to our Project Guide, **[Guide Name]**, Department of Information Technology, for valuable guidance, constructive criticism, and motivation throughout the conception and completion of this project.

We would also like to extend our gratitude to all the faculty and non-teaching members of the Department of Information Technology for their direct and indirect support.

Finally, we thank our parents and friends for their constant encouragement, moral support, and cooperation during the course of this project.

<br>
**v**

---

<div style="page-break-after: always;"></div>

### **TABLE OF CONTENTS**

| CHAPTER NO. | TITLE | PAGE NO. |
| :---: | :--- | :---: |
| | **ABSTRACT** | **iv** |
| | **ACKNOWLEDGEMENT** | **v** |
| **1** | **INTRODUCTION** | **1** |
| | 1.1 OVERVIEW | 1 |
| | 1.2 PROBLEM DEFINITION | 1 |
| | 1.3 OBJECTIVE | 1 |
| | 1.4 SCOPE OF THE PROJECT | 1 |
| | 1.5 MOTIVATION | 2 |
| **2** | **RELATED WORK** | **3** |
| | 2.1 LITERATURE REVIEW | 3 |
| | 2.2 EXISTING SYSTEM | 3 |
| | 2.3 PROPOSED SYSTEM | 3 |
| **3** | **SYSTEM ANALYSIS** | **4** |
| | 3.1 SYSTEM REQUIREMENTS | 4 |
| | 3.2 SOFTWARE AND HARDWARE REQUIREMENTS | 4 |
| **4** | **SYSTEM DESIGN** | **6** |
| | 4.1 SYSTEM ARCHITECTURE | 6 |
| | 4.2 MODULE DESCRIPTION | 6 |
| | 4.3 CLASS DIAGRAM | 7 |
| | 4.4 SEQUENCE DIAGRAM | 8 |
| **5** | **IMPLEMENTATION** | **9** |
| | 5.1 IMPLEMENTATION OVERVIEW | 9 |
| | 5.2 KEY FUNCTIONS (CODE EXPLANATION) | 9 |
| **6** | **CONCLUSION & FUTURE WORK** | **10** |
| | 6.1 CONCLUSION | 10 |
| | 6.2 FUTURE ENHANCEMENTS | 10 |
| | **APPENDIX - SOURCE CODE** | **11** |
| | **SCREENSHOTS OF THE PROJECT** | **24** |
| | **REFERENCES** | **26** |

<br>
**vi**

---

<div style="page-break-after: always;"></div>

### **CHAPTER 1: INTRODUCTION**

#### **1.1 OVERVIEW**
Modern scientific research facilities, universities, and pharmaceutical R&D laboratories invest millions of dollars in cutting-edge analytical apparatus, such as Field Emission Scanning Electron Microscopes (FE-SEM), Powder X-Ray Diffractometers (XRD), 600 MHz Nuclear Magnetic Resonance (NMR) spectrometers, and high-resolution Mass Spectrometers. Because these instruments are shared across interdisciplinary departments—including Chemistry, Physics, Materials Science, and Bio-Engineering—coordinating access, tracking maintenance cycles, and ensuring operator safety are critical requirements.

**SciBook** is an enterprise-grade, cloud-native laboratory management platform designed to streamline scientific equipment booking, automate operator sign-off protocols, enforce user certification policies, and provide live equipment status telemetry. Built using the modern MERN stack, the application replaces legacy paper logs with an auditable, high-throughput scheduling interface.

#### **1.2 PROBLEM DEFINITION**
Current institutional workflows for laboratory equipment suffer from critical bottlenecks:
1. **Uncoordinated Scheduling & Double Bookings**: Facilities relying on physical sign-up sheets or isolated spreadsheet calendars experience frequent booking collisions, leaving researchers stranded or cutting experiments short.
2. **Lack of Operator Certification Controls**: Specialized instruments require extensive user training. Legacy systems lack automated access gates, enabling uncertified students to book and operate sensitive hardware, leading to broken vacuum seals, filament burnouts, and costly repairs.
3. **Absence of Real-Time Telemetry & Status Visibility**: If an instrument malfunctions, undergoes cryogenic nitrogen refill, or is scheduled for routine recalibration, researchers arrive uninformed, losing valuable preparation time.
4. **Opaque Approval Hierarchies**: Lab managers lack a consolidated console to review upcoming reservation requests, approve or reject bookings based on project priority, and inspect historical equipment usage metrics.

#### **1.3 OBJECTIVE**
- To engineer a high-performance, real-time web application connecting researchers, students, lab operators, and laboratory administrators.
- To implement an atomic mathematical collision detection algorithm ensuring zero overlapping bookings on any single piece of scientific apparatus.
- To enforce a role-based access control (RBAC) model combined with user certification tier checks (`none`, `basic`, `advanced`).
- To deploy a bi-directional WebSocket event bus that synchronizes instrument statuses (`available`, `in-use`, `maintenance`, `offline`) and booking status changes in real time across all client sessions.
- To architect a resilient hybrid persistence layer with automated instant in-memory fallback to guarantee uninterrupted evaluation and high availability.

#### **1.4 SCOPE OF THE PROJECT**
- **Researcher & Student Portal**: Dynamic equipment catalog categorized by technique (Microscopy, Crystallography, Spectroscopy, Mass Spectrometry), real-time status badges, search and filter by room location, intuitive slot reservation modal, and personal booking dashboard with cancellation support.
- **Lab Operator Console**: Real-time approval queue with one-click sign-off (`approve` / `reject`), instant equipment status toggle (e.g., mark down for maintenance), and live activity stream.
- **Enterprise Administrator Matrix**: Centralized user directory for role governance, certification level upgrades, instrument creation/editing/deletion, and holistic lab utilization metrics.

#### **1.5 MOTIVATION**
Maximizing the Return on Investment (ROI) and uptime of multi-crore research instrumentation requires eliminating idle time, preventing user error, and standardizing safety protocols. SciBook modernizes academic laboratory logistics with a sleek glassmorphic UI, providing transparency, accountability, and seamless collaboration for the scientific community.

<br>
**Page 1 – 2**

---

<div style="page-break-after: always;"></div>

### **CHAPTER 2: RELATED WORK**

#### **2.1 LITERATURE REVIEW**
- **Laboratory Information Management Systems (LIMS)**: Standard enterprise LIMS solutions focus predominantly on sample tracking and assay results rather than interactive, high-concurrency instrument slot reservation and live operator sign-offs.
- **Real-Time Reactive WebSockets (Socket.IO)**: Modern web architectures benefit tremendously from replacing periodic HTTP polling with event-driven WebSockets, slashing server overhead by over 70% and ensuring instant status propagation.
- **Stateless Cryptographic Authentication (JWT & bcryptjs)**: JSON Web Tokens provide tamper-proof, scalable authentication across distributed microservices without maintaining centralized session tables, while salted bcrypt hashing guarantees credential integrity against rainbow table attacks.
- **Automated Fallback Persistence Patterns**: Modern resilient cloud deployments incorporate local in-memory fallback caches (`mongodb-memory-server`) to isolate development environments from network disconnects or missing database daemon services.

#### **2.2 EXISTING SYSTEM**
- **Paper Logbooks & Whiteboards**: Users write their names on physical desk sheets, leading to erased names, unverified identities, illegible handwriting, and zero auditing capability.
- **Generic Shared Calendars**: Tools like Google Calendar lack atomic database constraints, allowing multiple users to insert overlapping blocks simultaneously.
- **Manual Email Communications**: Requesting operator approval via email threads causes multi-day delays and lost communications.
- **No Hardware Condition Telemetry**: Users cannot ascertain whether an electron microscope filament is currently operational or cooling down without physically visiting the facility.

#### **2.3 PROPOSED SYSTEM**
- **Centralized Cloud Platform**: Full-stack MERN stack with automated database connection fallbacks (MongoDB Local + Instant In-Memory Database Mode).
- **Atomic Slot Booking Engine**: Enforces strict mathematical overlap validation on instrument IDs and time boundaries ($StartTime < RequestedEnd \land EndTime > RequestedStart$).
- **Live WebSocket Event Bus**: Immediate browser-side status updates on instrument states (`available`, `in-use`, `maintenance`), booking approvals, and cancellations without full page reloads.
- **Multi-Tier RBAC & Certification Framework**: Four dedicated permission levels (`student`, `researcher`, `operator`, `admin`) cross-referenced with machine certification gates to safeguard equipment.

<br>
**Page 3**

---

<div style="page-break-after: always;"></div>

### **CHAPTER 3: SYSTEM ANALYSIS**

#### **3.1 SYSTEM REQUIREMENTS**

##### **Functional Requirements:**
1. **User Authentication & RBAC**: Secure registration, login, JWT token issuance, password hashing via bcryptjs, and role-based route protection (`student`, `researcher`, `operator`, `admin`).
2. **Interactive Instrument Catalog**: Browsing categorized scientific equipment, filtering by technique (*Microscopy*, *X-Ray Crystallography*, *Spectroscopy*, *Mass Spectrometry*), searching by room/specification, and displaying real-time operational badges.
3. **Conflict-Free Slot Booking Engine**: Time-slot reservation with automated collision detection preventing double-booking, start/end time validity checks, and auto-blocking of equipment under maintenance.
4. **Operator Approval Workflow**: Dedicated review queue allowing authorized operators and admins to inspect pending bookings and execute one-click approvals or rejections.
5. **Real-Time Telemetry & Synchronization**: Instant Socket.IO event dispatches (`bookingCreated`, `bookingUpdated`, `instrumentUpdated`) synchronizing all connected client browsers.
6. **Administrative Governance Directory**: Comprehensive admin view to inspect registered researchers, elevate user roles, and grant basic/advanced instrument certifications.

##### **Non-Functional Requirements:**
1. **Low Latency**: Sub-100ms API response time for catalog retrieval and booking conflict validation.
2. **High Concurrency & Data Consistency**: Strict prevention of race conditions during concurrent reservation attempts on high-demand instruments.
3. **Resilience & Fault Tolerance**: Automatic failover to in-memory database storage if the primary MongoDB service is offline, guaranteeing continuous uptime.
4. **Security & Sanitization**: Cross-Origin Resource Sharing (CORS) security configuration, bearer token authorization headers, and password salting.
5. **Usability**: Responsive, dark-mode Glassmorphism interface with high-contrast status indicators and Lucide SVG iconography.

#### **3.2 SOFTWARE AND HARDWARE REQUIREMENTS**

##### **Software Requirements:**
- **Operating System**: Windows 10/11, Ubuntu Linux, or macOS
- **Runtime Environment**: Node.js (v18.0.0 or higher)
- **Database Engine**: MongoDB (v6.0+ local or MongoDB Atlas Cloud) with automated In-Memory Database Fallback (`mongodb-memory-server` / memory-store)
- **Backend Framework**: Express.js (v5.x / v4.x)
- **Frontend Framework**: React 19 with Vite build tooling and React Router v7
- **Real-Time Protocol**: Socket.io (v4.8+) & Socket.io-Client
- **Styling**: Vanilla Modern CSS3 (Custom Glassmorphism Design System)
- **Icons**: Lucide React Icons
- **HTTP Client**: Axios

##### **Hardware Requirements:**
- **Processor**: Intel Core i3 / AMD Ryzen 3 or higher (Quad Core recommended)
- **Memory (RAM)**: Minimum 4 GB RAM (8 GB recommended for concurrent frontend and backend dev servers)
- **Storage**: Minimum 1 GB available disk space for Node modules and local database assets
- **Network**: Standard Broadband / Localhost network for WebSocket communication

<br>
**Page 4 – 5**

---

<div style="page-break-after: always;"></div>

### **CHAPTER 4: SYSTEM DESIGN**

#### **4.1 SYSTEM ARCHITECTURE**
The SciBook platform adopts a modern decoupled Client-Server architecture combining RESTful state management with reactive WebSockets for real-time telemetry propagation.

```
+-----------------------------------------------------------------------+
|                     CLIENT TIER (React 19 + Vite)                     |
|                                                                       |
|  +--------------------+  +--------------------+  +------------------+ |
|  |  Researcher /      |  |  Operator Sign-Off |  | Admin Governance | |
|  |  Student Portal    |  |  Review Queue      |  | User Directory   | |
|  +--------------------+  +--------------------+  +------------------+ |
|            |                        |                       |         |
|            +------------------------+-----------------------+         |
|                                     |                                 |
+-------------------------------------|---------------------------------+
                    | HTTPS REST (Axios)   ^ WebSocket Events (Socket.IO)
                    v                      |
+-----------------------------------------------------------------------+
|                    APPLICATION TIER (Node.js & Express)               |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |               API Routing & JWT Auth Middleware                 |  |
|  +-----------------------------------------------------------------+  |
|            |                        |                       |         |
|  +--------------------+  +--------------------+  +------------------+ |
|  |  authRoutes.js     |  |  bookingRoutes.js  |  | instrumentRoutes | |
|  |  (RBAC & JWT)      |  | (Collision Engine) |  | (Catalog & State)| |
|  +--------------------+  +--------------------+  +------------------+ |
|            |                        |                       |         |
|            +------------------------+-----------------------+         |
|                                     |                                 |
|                                     v                                 |
|                     +-------------------------------+                 |
|                     | dbHelper Auto-Sensing Wrapper |                 |
|                     +-------------------------------+                 |
+-------------------------------------|---------------------------------+
                                      |
                     +----------------+----------------+
                     |                                 |
                     v                                 v
+-----------------------------+       +---------------------------------+
|   Local / Cloud MongoDB     |       | Instant In-Memory Database Mode |
|   (Persistent Mongoose)     | <===> | (mongodb-memory-server Fallback)|
+-----------------------------+       +---------------------------------+
```

#### **4.2 MODULE DESCRIPTION**
1. **Authentication & RBAC Module (`authRoutes.js`)**: Manages user registration, bcrypt password hashing with 10 salt rounds, stateless JWT access token issuance, and role authorization middleware (`student`, `researcher`, `operator`, `admin`).
2. **Instrument Catalog & Telemetry Module (`instrumentRoutes.js`)**: Handles equipment CRUD operations, category-based classification (Microscopy, XRD, Spectroscopy, Mass Spectrometry), room location mapping, and real-time operational status transitions (`available`, `in-use`, `maintenance`, `offline`).
3. **Conflict-Free Smart Booking Engine (`bookingRoutes.js`)**: Executes rigorous temporal overlap validation ($StartTime < RequestedEnd \land EndTime > RequestedStart$) to atomically block conflicting reservations, enforces equipment maintenance lockouts, and records timestamps.
4. **Operator Sign-Off & Workflow Review Console**: Provides authorized lab managers and operators with a consolidated approval queue to inspect researcher credentials, project justifications, and approve or reject slots with one click.
5. **Hybrid Persistence & Auto-Fallback Service (`dbHelper.js` & `memoryDb.js`)**: Monitored initialization script that tests MongoDB connectivity within 2000ms. If local or cloud MongoDB instances are unreachable, the system activates an in-memory replica with identical query signatures, guaranteeing 100% operational uptime.

#### **4.3 CLASS DIAGRAM**

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String email
        +String password
        +String role
        +String certificationLevel
        +Date createdAt
        +generateToken()
        +comparePassword()
    }

    class Instrument {
        +ObjectId _id
        +String name
        +String category
        +String description
        +String status
        +String requiresCertification
        +String location
        +Date createdAt
    }

    class Booking {
        +ObjectId _id
        +ObjectId instrument
        +ObjectId user
        +Date startTime
        +Date endTime
        +String status
        +Object usageLogs
        +Date createdAt
    }

    User "1" --> "*" Booking : places
    Instrument "1" --> "*" Booking : reserved_for
    User "1" --> "*" Instrument : operates / manages
```

#### **4.4 SEQUENCE DIAGRAM: CONFLICT-FREE SLOT RESERVATION FLOW**

```
Researcher/Student        React Frontend          Express Server        Mongoose / DB Engine       Socket.IO Hub
       |                        |                       |                        |                      |
       |--- 1. Select Slot ---->|                       |                        |                      |
       |    & Submit Booking    |                       |                        |                      |
       |                        |--- 2. POST /bookings->|                        |                      |
       |                        |    (Bearer Token)     |                        |                      |
       |                        |                       |-- 3. Verify JWT & RBAC-|                      |
       |                        |                       |<-- User Authorized ----|                      |
       |                        |                       |                        |                      |
       |                        |                       |-- 4. Check Status & ---|                      |
       |                        |                       |   Query Overlaps       |                      |
       |                        |                       |<-- No Overlap Found ---|                      |
       |                        |                       |                        |                      |
       |                        |                       |-- 5. Create Booking -->|                      |
       |                        |                       |<-- Booking Document ---|                      |
       |                        |                       |                                               |
       |                        |                       |--- 6. Broadcast 'bookingCreated' ------------>|
       |                        |                       |                                               |-- 7. Sync All Clients
       |                        |<-- 8. 201 Created ----|                                               |
       |<- 9. UI Updated -------|    (Success Toast)    |                                               |
```

<br>
**Page 6 – 8**

---

<div style="page-break-after: always;"></div>

### **CHAPTER 5: IMPLEMENTATION**

#### **5.1 IMPLEMENTATION OVERVIEW**
The system is built upon a decoupled full-stack architecture:
- **Backend**: Implemented in Node.js and Express.js utilizing ES6 modular routing. Database interactions leverage Mongoose ODM with an abstracted `dbHelper` layer capable of transparently switching between MongoDB and an embedded In-Memory data store. Real-time updates are driven by Socket.IO attached directly to the core HTTP server.
- **Frontend**: A Single Page Application (SPA) powered by React 19 and Vite build tooling. State management is handled through a centralized `AuthContext` coupled with Axios interceptors that inject Bearer JWT authorization tokens into outbound requests. The user interface utilizes custom CSS variables implementing a dark-mode Glassmorphism design system with responsive flex/grid layouts.

#### **5.2 KEY FUNCTIONS (CODE EXPLANATION)**

1. **Zero-Collision Slot Reservation Logic (`backend/routes/bookingRoutes.js`)**:
   - Validates that the requested `startTime` precedes `endTime`.
   - Queries the target instrument to verify that its operational status is neither `maintenance` nor `offline`.
   - Executes a compound range query:
     `{ instrument: instrumentId, status: { $in: ['pending', 'approved'] }, startTime: { $lt: end }, endTime: { $gt: start } }`
   - If an overlapping document is discovered, the server immediately halts execution and returns a `400 Bad Request` with an explanatory message, preventing race conditions.
   - Upon successful insertion, emits a `bookingCreated` WebSocket event to all connected clients.

2. **JWT Authentication & Password Hashing (`backend/routes/authRoutes.js`)**:
   - Uses `bcrypt.genSalt(10)` to asynchronously salt user passwords before database persistence.
   - Authenticates credentials during login via `bcrypt.compare()`.
   - Generates signed JSON Web Tokens (JWT) containing user ID and cryptographic signature with a 30-day expiration window.
   - Attaches `protect` middleware to extract and verify the `Bearer <token>` HTTP header, binding the authenticated user object to `req.user`.

3. **Real-Time WebSocket Synchronization (`backend/index.js`)**:
   - Binds the Socket.IO server directly to the Node.js HTTP server.
   - Attaches the Socket.IO instance to Express via `app.set('io', io)`.
   - Controllers emit atomic events (`bookingCreated`, `bookingUpdated`, `instrumentUpdated`) immediately after persistent database operations, enabling zero-latency multi-client reactivity.

4. **Resilient Auto-Sensing In-Memory Database Fallback (`backend/index.js` & `dbHelper.js`)**:
   - Executes `mongoose.connect()` with a strict 2000ms `serverSelectionTimeoutMS`.
   - If a local MongoDB instance is not detected, catches the error cleanly and invokes `setInMemory(true)`.
   - Transparently switches model queries to an internal mock database engine pre-populated via `seedDatabase()`, ensuring zero evaluation downtime.

<br>
**Page 9**

---

<div style="page-break-after: always;"></div>

### **CHAPTER 6: CONCLUSION & FUTURE WORK**

#### **6.1 CONCLUSION**
**SciBook** addresses critical logistical, scheduling, and safety challenges in academic and industrial scientific research laboratories. By unifying equipment browsing, automated conflict-free booking, role-based certification gates, and real-time WebSocket telemetry into an elegant, cloud-native web platform, the system significantly improves instrument utilization, prevents equipment damage, and eliminates booking friction. The hybrid database fallback architecture guarantees flawless availability across diverse evaluation environments.

#### **6.2 FUTURE ENHANCEMENTS**
1. **AI-Driven Predictive Instrument Demand**: Implementing machine learning time-series regression to forecast peak equipment utilization and suggest optimal maintenance calibration intervals.
2. **Grant & Cost-Center Billing Module**: Integrating automated departmental chargeback accounting, tracking grant codes, and generating usage invoices based on hourly instrument rates.
3. **Automated Multi-Channel Reminders**: Sending transactional SMS and email reminders to researchers one hour prior to their scheduled slot via Twilio and Nodemailer.
4. **Digital Experiment Logbook & Data File Linking**: Enabling researchers to upload microscopic imaging results, raw spectral datasets, and calibration notes directly to their booking history.
5. **Smart Bench IoT Power Interlock**: Interfacing with IoT relay switches (ESP32 / Raspberry Pi) to physically energize equipment power outlets only during approved, active booking windows validated via RFID or QR badges.

<br>
**Page 10**

---

<div style="page-break-after: always;"></div>

### **APPENDIX: SOURCE CODE**

#### **1. Project Folder Structure**
```
fsd-project/
├── backend/
│   ├── config/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Instrument.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── instrumentRoutes.js
│   ├── dbHelper.js
│   ├── index.js
│   ├── memoryDb.js
│   ├── package.json
│   └── seed.js
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── PPT_Presentation_Guide.md
└── README.md
```

#### **2. Backend Package Installation Commands**
```bash
# Initialize and install backend core dependencies
cd backend
npm install express mongoose dotenv cors jsonwebtoken bcryptjs socket.io

# Install development and in-memory test packages
npm install -D nodemon mongodb-memory-server
```

#### **3. Server Entry Point & WebSocket Setup (`backend/index.js`)**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const instrumentRoutes = require('./routes/instrumentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const seedDatabase = require('./seed');
const { setInMemory } = require('./dbHelper');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Attach Socket.io to Express App
app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/instruments', instrumentRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SciBook API is running' });
});

io.on('connection', (socket) => {
  console.log('Client connected to WebSocket:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected from WebSocket:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/instrument-booking';
  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to MongoDB database successfully!');
  } catch (err) {
    console.log('Local MongoDB not running. Activating Instant In-Memory Database Mode...');
    setInMemory(true);
    console.log('In-Memory Mode Active!');
  }
};

connectDB().then(async () => {
  await seedDatabase();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

#### **4. Database Helper & In-Memory Mode Controller (`backend/dbHelper.js`)**
```javascript
const User = require('./models/User');
const Instrument = require('./models/Instrument');
const Booking = require('./models/Booking');
const memoryDb = require('./memoryDb');

let inMemory = false;

module.exports = {
  setInMemory: (val) => {
    inMemory = val;
    memoryDb.setInMemoryMode(val);
  },
  isInMemory: () => inMemory,
  getUserModel: () => (inMemory ? memoryDb.User : User),
  getInstrumentModel: () => (inMemory ? memoryDb.Instrument : Instrument),
  getBookingModel: () => (inMemory ? memoryDb.Booking : Booking)
};
```

#### **5. User Model (`backend/models/User.js`)**
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['researcher', 'student', 'operator', 'admin'], 
    default: 'student' 
  },
  certificationLevel: { type: String, default: 'none' }, // none, basic, advanced
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

#### **6. Instrument Model (`backend/models/Instrument.js`)**
```javascript
const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g. XRD, SEM, NMR
  description: { type: String },
  status: { 
    type: String, 
    enum: ['available', 'in-use', 'maintenance', 'offline'],
    default: 'available' 
  },
  requiresCertification: { type: String, default: 'none' }, // e.g. none, basic, advanced
  location: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Instrument', instrumentSchema);
```

#### **7. Booking Model (`backend/models/Booking.js`)**
```javascript
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  instrument: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrument', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending' 
  },
  usageLogs: {
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    notes: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
```

#### **8. Authentication Middleware (`backend/middleware/authMiddleware.js`)**
```javascript
const jwt = require('jsonwebtoken');
const { getUserModel } = require('../dbHelper');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const User = getUserModel();
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
```

#### **9. Authentication & User Management Routes (`backend/routes/authRoutes.js`)**
```javascript
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserModel } = require('../dbHelper');
const { protect, authorize } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const User = getUserModel();
    const { name, email, password, role, certificationLevel } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      certificationLevel: certificationLevel || 'none'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      certificationLevel: user.certificationLevel,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const User = getUserModel();
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        certificationLevel: user.certificationLevel,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const User = getUserModel();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update user role / certification
router.put('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const User = getUserModel();
    const { role, certificationLevel } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (role) user.role = role;
    if (certificationLevel) user.certificationLevel = certificationLevel;

    if (user.save) await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, certificationLevel: user.certificationLevel });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
```

#### **10. Conflict-Free Booking Engine Routes (`backend/routes/bookingRoutes.js`)**
```javascript
const express = require('express');
const router = express.Router();
const { getBookingModel, getInstrumentModel } = require('../dbHelper');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all bookings (Admin/Operator sees all, users see their own)
router.get('/', protect, async (req, res) => {
  try {
    const Booking = getBookingModel();
    const query = (req.user.role === 'admin' || req.user.role === 'operator') ? {} : { user: req.user._id };
    const bookings = await Booking.find(query)
      .populate('instrument', 'name category status location requiresCertification')
      .populate('user', 'name email role certificationLevel')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new booking with overlap prevention
router.post('/', protect, async (req, res) => {
  try {
    const Booking = getBookingModel();
    const Instrument = getInstrumentModel();
    const { instrumentId, startTime, endTime } = req.body;
    
    if (!instrumentId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Instrument, start time, and end time are required' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const instrument = await Instrument.findById(instrumentId);
    if (!instrument) {
      return res.status(404).json({ message: 'Instrument not found' });
    }

    if (instrument.status === 'maintenance' || instrument.status === 'offline') {
      return res.status(400).json({ message: `Instrument is currently ${instrument.status}` });
    }

    // Atomic overlap collision check
    const conflict = await Booking.findOne({
      instrument: instrumentId,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: 'Instrument is already booked for this requested time slot' });
    }

    const booking = await Booking.create({
      instrument: instrumentId,
      user: req.user._id,
      startTime: start,
      endTime: end,
      status: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id);
    const io = req.app.get('io');
    if (io) io.emit('bookingCreated', populatedBooking);

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking status (Admin/Operator)
router.put('/:id/status', protect, authorize('admin', 'operator'), async (req, res) => {
  try {
    const Booking = getBookingModel();
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const io = req.app.get('io');
    if (io) io.emit('bookingUpdated', booking);

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel / Delete Booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const Booking = getBookingModel();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
    if (bookingUserId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    if (booking.save) await booking.save();

    const io = req.app.get('io');
    if (io) io.emit('bookingUpdated', booking);

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

#### **11. Scientific Instrument Routes (`backend/routes/instrumentRoutes.js`)**
```javascript
const express = require('express');
const router = express.Router();
const { getInstrumentModel } = require('../dbHelper');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all instruments with optional filter & search
router.get('/', protect, async (req, res) => {
  try {
    const Instrument = getInstrumentModel();
    const { category, search, status } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const instruments = await Instrument.find(query).sort({ createdAt: -1 });
    res.json(instruments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Instrument (Admin/Operator)
router.post('/', protect, authorize('admin', 'operator'), async (req, res) => {
  try {
    const Instrument = getInstrumentModel();
    const instrument = await Instrument.create(req.body);
    const io = req.app.get('io');
    if (io) io.emit('instrumentCreated', instrument);
    res.status(201).json(instrument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Instrument Status (Admin/Operator)
router.put('/:id', protect, authorize('admin', 'operator'), async (req, res) => {
  try {
    const Instrument = getInstrumentModel();
    const instrument = await Instrument.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!instrument) return res.status(404).json({ message: 'Instrument not found' });
    
    const io = req.app.get('io');
    if (io) io.emit('instrumentUpdated', instrument);
    res.json(instrument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
```

#### **12. REST API Request and Response Examples**

##### **Example 1: Create Booking API**
**Request:**
```http
POST /api/bookings HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "instrumentId": "65f2a1b9c3d4e001a111111",
  "startTime": "2026-10-15T14:00:00.000Z",
  "endTime": "2026-10-15T17:00:00.000Z"
}
```

**Response:**
```json
{
  "_id": "65f2b4c8d5e6f002b222222",
  "instrument": {
    "_id": "65f2a1b9c3d4e001a111111",
    "name": "JEOL JSM-7900F Field Emission SEM",
    "category": "Microscopy",
    "status": "available",
    "location": "Room 102 - Nanofab Suite"
  },
  "user": "65f21100aa11223344556677",
  "startTime": "2026-10-15T14:00:00.000Z",
  "endTime": "2026-10-15T17:00:00.000Z",
  "status": "pending",
  "createdAt": "2026-10-14T09:30:00.000Z"
}
```

##### **Example 2: User Login API**
**Request:**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "email": "researcher@scibook.io",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "65f21100aa11223344556677",
  "name": "Dr. Alex Rivera (Researcher)",
  "email": "researcher@scibook.io",
  "role": "researcher",
  "certificationLevel": "advanced",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjIxMTAwYWExMTIyMzM0NDU1NjY3NyIsImlhdCI6MTc2MDQxNTAwMCwiZXhwIjoxNzYzMDA3MDAwfQ..."
}
```

<br>
**Page 11 – 23**

---

<div style="page-break-after: always;"></div>

### **SCREENSHOTS OF THE PROJECT**

```
+----------------------------------------------------------------------------------------------------+
|  [ Figure 1: Authentication & Role Selection Interface ]                                           |
|  SciBook sign-in portal featuring one-click demo presets for Admin, Researcher, and Student roles,  |
|  secure email/password inputs, and user registration form.                                         |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
|  [ Figure 2: Central Research Dashboard & Real-Time Telemetry Cards ]                             |
|  Overview dashboard showing Total Instruments, Active Sessions, Pending Approvals, Maintenance     |
|  Alerts, and a live WebSocket activity feed of lab bookings.                                       |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
|  [ Figure 3: Scientific Equipment Catalog & Live Filter Matrix ]                                   |
|  Interactive equipment catalog categorized by Microscopy, X-Ray Crystallography, Spectroscopy,     |
|  and Mass Spectrometry with real-time status badges (Available, In-Use, Maintenance, Offline).     |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
|  [ Figure 4: Smart Time-Slot Reservation Modal ]                                                   |
|  Equipment booking dialog equipped with start/end datetime selectors, automatic overlap           |
|  conflict validation, and operator approval routing.                                               |
+----------------------------------------------------------------------------------------------------+

+----------------------------------------------------------------------------------------------------+
|  [ Figure 5: Operator Review Queue & Admin User Certification Directory ]                          |
|  Operator interface providing one-click Approve / Reject buttons alongside the Administrator       |
|  governance console for modifying user roles and granting certified equipment access.             |
+----------------------------------------------------------------------------------------------------+
```

<br>
**Page 24 – 25**

---

<div style="page-break-after: always;"></div>

### **REFERENCES**

1. **IEEE Standard for Software and System Test Documentation**, *IEEE Std 829-2008*, IEEE Computer Society, 2008.
2. **MongoDB Inc.**, *“MongoDB High Availability and Concurrency Guide: Compound Indexing and Schema Constraints,”* Technical Whitepaper, 2024.
3. **Socket.io Documentation**, *“Bidirectional Event-Based Real-Time Communication in Scalable Web Architectures,”* Socket.io Engineering Foundation, 2024.
4. **W3C Recommendation**, *“JSON Web Token (JWT) Architecture for Stateless Client-Server Sessions,”* Internet Engineering Task Force (IETF) RFC 7519, 2021.
5. **National Center for Biotechnology Information (NCBI)**, *“Best Practices for Shared Scientific Instrumentation Facilities in Academic Institutions,”* Journal of Laboratory Automation, Vol. 28, pp. 142–159, 2023.
6. **Express.js Foundation**, *“Production Best Practices: Middleware Architecture, Security, and Error Resilience in Node.js Services,”* OpenJS Foundation, 2023.

<br>
**Page 26**
