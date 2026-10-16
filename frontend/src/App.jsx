import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  Microscope, CalendarClock, LayoutDashboard, LogOut, Plus, Search, Filter,
  CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck, UserCheck, KeyRound,
  FileText, MapPin, Layers, RefreshCw, X, ChevronRight, Activity, Award, Check, User
} from 'lucide-react';
import './index.css';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = `${BACKEND_URL}/api`;
const SOCKET_URL = BACKEND_URL;

// Axios Instance
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('scibook_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Context
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// Socket Instance
let socket;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('scibook_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('scibook_token', res.data.token);
      localStorage.setItem('scibook_user', JSON.stringify(res.data));
      setUser(res.data);
      showToast(`Welcome back, ${res.data.name}!`, 'success');
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      localStorage.setItem('scibook_token', res.data.token);
      localStorage.setItem('scibook_user', JSON.stringify(res.data));
      setUser(res.data);
      showToast('Registration successful!', 'success');
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('scibook_token');
    localStorage.removeItem('scibook_user');
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, toast, showToast }}>
      {children}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />}
            {toast.type === 'error' && <XCircle className="w-5 h-5" style={{ color: '#dc2626' }} />}
            {toast.type === 'info' && <Activity className="w-5 h-5" style={{ color: '#2563eb' }} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Top Navigation & Sidebar Layout (Clean Light Theme)
const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/instruments', label: 'Instrument Catalog', icon: Microscope },
    { path: '/bookings', label: 'My Bookings', icon: CalendarClock },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/users', label: 'User Directory', icon: ShieldCheck });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50
      }}>
        {/* Brand Logo */}
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Microscope style={{ width: '22px', height: '22px' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>SciBook</h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Lab Booking System</p>
          </div>
        </div>

        {/* User Card */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#dbeafe',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1e40af',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span className="badge badge-available" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                  {user?.role}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {user?.certificationLevel !== 'none' && `Cert: ${user?.certificationLevel}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  color: isActive ? '#1e40af' : 'var(--text-secondary)',
                  background: isActive ? '#eff6ff' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon style={{ width: '18px', height: '18px', color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div style={{ padding: '20px 16px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={logout}
            className="btn btn-danger"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '9px 14px' }}
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px 40px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
};

// Login & Register Screen (Clean Professional Light Theme)
const AuthScreen = () => {
  const { login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    register({ name: regName, email: regEmail, password: regPassword, role: regRole });
  };

  const fillDemoAccount = (demoRole) => {
    if (demoRole === 'admin') {
      setEmail('admin@scibook.io');
      setPassword('password123');
    } else if (demoRole === 'researcher') {
      setEmail('researcher@scibook.io');
      setPassword('password123');
    } else if (demoRole === 'student') {
      setEmail('student@scibook.io');
      setPassword('password123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '36px', background: '#ffffff' }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '14px'
          }}>
            <Microscope style={{ width: '28px', height: '28px' }} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>SciBook Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Scientific Equipment & Instrument Scheduling System
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: 'var(--radius-sm)',
          padding: '4px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: !isRegister ? '#ffffff' : 'transparent',
              color: !isRegister ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: !isRegister ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegister(true)}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: isRegister ? '#ffffff' : 'transparent',
              color: isRegister ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: isRegister ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {!isRegister ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-control"
                placeholder="admin@scibook.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>

            {/* Demo Quick Fill */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '10px' }}>
                Quick Demo Login Credentials:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin')}
                  className="btn btn-secondary btn-sm"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('researcher')}
                  className="btn btn-secondary btn-sm"
                >
                  Researcher
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('student')}
                  className="btn btn-secondary btn-sm"
                >
                  Student
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-control"
                placeholder="Dr. Jane Doe"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-control"
                placeholder="jane.doe@university.edu"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-control"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label className="input-label">User Role</label>
              <select
                className="input-control"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="researcher">Researcher</option>
                <option value="operator">Lab Operator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// 1. Dashboard View Component
const DashboardView = ({ onBookClick }) => {
  const [instruments, setInstruments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [instRes, bookRes] = await Promise.all([
        api.get('/instruments'),
        api.get('/bookings')
      ]);
      setInstruments(instRes.data);
      setBookings(bookRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    socket = io(SOCKET_URL);
    socket.on('bookingCreated', () => fetchData());
    socket.on('bookingUpdated', () => fetchData());
    socket.on('instrumentUpdated', () => fetchData());
    socket.on('instrumentCreated', () => fetchData());

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const totalInstruments = instruments.length;
  const availableCount = instruments.filter(i => i.status === 'available').length;
  const inUseCount = instruments.filter(i => i.status === 'in-use').length;
  const maintenanceCount = instruments.filter(i => i.status === 'maintenance').length;
  const activeBookingsCount = bookings.filter(b => b.status === 'approved').length;
  const pendingApprovalsCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>Laboratory Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
            Real-time telemetry and equipment utilization status
          </p>
        </div>
        <button className="btn btn-primary" onClick={onBookClick}>
          <Plus style={{ width: '18px', height: '18px' }} />
          New Reservation
        </button>
      </div>

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Total Instruments</p>
              <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>{totalInstruments}</h2>
            </div>
            <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
              <Microscope style={{ width: '22px', height: '22px' }} />
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="dot-pulse available"></span> {availableCount} Available Now
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Active Bookings</p>
              <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>{activeBookingsCount}</h2>
            </div>
            <div style={{ padding: '10px', background: '#e0f2fe', borderRadius: '8px', color: '#0284c7' }}>
              <CalendarClock style={{ width: '22px', height: '22px' }} />
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#0284c7', marginTop: '10px', fontWeight: '600' }}>
            {inUseCount} instruments in session
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Pending Approvals</p>
              <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>{pendingApprovalsCount}</h2>
            </div>
            <div style={{ padding: '10px', background: '#fef3c7', borderRadius: '8px', color: '#d97706' }}>
              <Clock style={{ width: '22px', height: '22px' }} />
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#d97706', marginTop: '10px', fontWeight: '600' }}>
            Awaiting operator sign-off
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Maintenance</p>
              <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>{maintenanceCount}</h2>
            </div>
            <div style={{ padding: '10px', background: '#fee2e2', borderRadius: '8px', color: '#dc2626' }}>
              <AlertTriangle style={{ width: '22px', height: '22px' }} />
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px', fontWeight: '500' }}>
            Scheduled calibration / offline
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Equipment Status */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
            Equipment Status Feed
          </h3>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading live instrumentation data...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {instruments.slice(0, 5).map((inst) => (
                <div key={inst._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={`dot-pulse ${inst.status}`} />
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>{inst.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin style={{ width: '12px', height: '12px' }} /> {inst.location} • Category: {inst.category}
                      </p>
                    </div>
                  </div>
                  <span className={`badge badge-${inst.status}`}>
                    {inst.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarClock style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)' }} />
            Recent Bookings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bookings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent reservations recorded.</p>
            ) : (
              bookings.slice(0, 4).map((b) => (
                <div key={b._id} style={{
                  padding: '12px 14px',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: `3px solid ${b.status === 'approved' ? '#16a34a' : b.status === 'pending' ? '#d97706' : '#dc2626'}`,
                  borderTop: '1px solid var(--border-color)',
                  borderRight: '1px solid var(--border-color)',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {b.instrument?.name || 'Instrument'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    User: {b.user?.name || 'Researcher'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {new Date(b.startTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Instrument Catalog Component
const InstrumentsView = ({ onBookInstrument }) => {
  const { user, showToast } = useAuth();
  const [instruments, setInstruments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Instrument Form
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Microscopy');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCert, setNewCert] = useState('basic');

  const fetchInstruments = async () => {
    try {
      const res = await api.get('/instruments');
      setInstruments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstruments();

    socket = io(SOCKET_URL);
    socket.on('instrumentCreated', () => fetchInstruments());
    socket.on('instrumentUpdated', () => fetchInstruments());
    socket.on('instrumentDeleted', () => fetchInstruments());

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/instruments', {
        name: newName,
        category: newCategory,
        description: newDesc,
        location: newLocation,
        requiresCertification: newCert
      });
      showToast('New instrument added to catalog!', 'success');
      setShowAddModal(false);
      setNewName('');
      setNewDesc('');
      setNewLocation('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add instrument', 'error');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/instruments/${id}`, { status });
      showToast(`Instrument status set to ${status}`, 'info');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this instrument from service?')) return;
    try {
      await api.delete(`/instruments/${id}`);
      showToast('Instrument deleted', 'info');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete instrument', 'error');
    }
  };

  const filteredInstruments = instruments.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(search.toLowerCase()) ||
                          inst.description?.toLowerCase().includes(search.toLowerCase()) ||
                          inst.location?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || inst.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Microscopy', 'X-Ray Crystallography', 'Spectroscopy', 'Mass Spectrometry'];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>Instrument Catalog</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
            Explore available laboratory hardware and request time slots
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'operator') && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus style={{ width: '18px', height: '18px' }} />
            Add Instrument
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-control"
            placeholder="Search instruments by name, specs, room..."
            style={{ paddingLeft: '38px', margin: 0 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                background: selectedCategory === cat ? 'var(--primary)' : '#f1f5f9',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                padding: '7px 12px',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading instruments catalog...</p>
      ) : filteredInstruments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No instruments found matching your criteria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredInstruments.map((inst) => (
            <div key={inst._id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className={`badge badge-${inst.status}`}>
                    <span className={`dot-pulse ${inst.status}`} /> {inst.status}
                  </span>
                  <span style={{ fontSize: '0.725rem', color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bae6fd', fontWeight: '600' }}>
                    {inst.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {inst.name}
                </h3>
                
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.5' }}>
                  {inst.description || 'High precision analytical tool.'}
                </p>

                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
                    <span>Location: {inst.location || 'Main Lab'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award style={{ width: '14px', height: '14px', color: 'var(--accent-amber)' }} />
                    <span>Req. Cert Level: <strong>{inst.requiresCertification || 'None'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={inst.status === 'maintenance' || inst.status === 'offline'}
                  onClick={() => onBookInstrument(inst)}
                >
                  <CalendarClock style={{ width: '16px', height: '16px' }} />
                  {inst.status === 'maintenance' ? 'Under Maintenance' : 'Reserve Time Slot'}
                </button>

                {(user?.role === 'admin' || user?.role === 'operator') && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      className="input-control"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', margin: 0, flex: 1 }}
                      value={inst.status}
                      onChange={(e) => handleStatusUpdate(inst._id, e.target.value)}
                    >
                      <option value="available">Set: Available</option>
                      <option value="in-use">Set: In-Use</option>
                      <option value="maintenance">Set: Maintenance</option>
                      <option value="offline">Set: Offline</option>
                    </select>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(inst._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Instrument Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>Add New Equipment</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="input-group">
                <label className="input-label">Equipment Name</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Titan TEM 300kV"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select
                  className="input-control"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Microscopy">Microscopy</option>
                  <option value="X-Ray Crystallography">X-Ray Crystallography</option>
                  <option value="Spectroscopy">Spectroscopy</option>
                  <option value="Mass Spectrometry">Mass Spectrometry</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Location / Room</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Room 104 - Nanofab Facility"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Required Certification</label>
                <select
                  className="input-control"
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="basic">Basic Operator</option>
                  <option value="advanced">Advanced Specialist</option>
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: '20px' }}>
                <label className="input-label">Technical Specification Description</label>
                <textarea
                  className="input-control"
                  rows="3"
                  placeholder="Detailed resolution specs, detectors, laser lines..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. My Bookings Component
const BookingsView = () => {
  const { user, showToast } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    socket = io(SOCKET_URL);
    socket.on('bookingCreated', () => fetchBookings());
    socket.on('bookingUpdated', () => fetchBookings());

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      showToast(`Booking marked as ${status}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      showToast('Booking cancelled', 'info');
    } catch (err) {
      showToast(err.response?.data?.message || 'Cancellation failed', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          {(user?.role === 'admin' || user?.role === 'operator') ? 'Laboratory Reservations & Approvals' : 'My Instrument Bookings'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
          {(user?.role === 'admin' || user?.role === 'operator') ? 'Review user booking requests and manage schedules' : 'Track your upcoming lab sessions and approval statuses'}
        </p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading bookings records...</p>
      ) : bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No reservations found. Visit the Instrument Catalog to book a session.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {bookings.map((b) => (
            <div key={b._id} className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  padding: '10px',
                  borderRadius: '8px',
                  background: b.status === 'approved' ? '#dcfce7' : b.status === 'pending' ? '#fef3c7' : '#fee2e2',
                  color: b.status === 'approved' ? '#15803d' : b.status === 'pending' ? '#b45309' : '#b91c1c'
                }}>
                  <CalendarClock style={{ width: '22px', height: '22px' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {b.instrument?.name || 'Instrument'}
                    </h3>
                    <span className={`badge badge-${b.status}`}>
                      {b.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Location: {b.instrument?.location || 'Lab'} • User: <strong>{b.user?.name || 'Researcher'}</strong> ({b.user?.email})
                  </p>

                  <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '2px', fontWeight: '700' }}>
                    Time Slot: {new Date(b.startTime).toLocaleString()} — {new Date(b.endTime).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {(user?.role === 'admin' || user?.role === 'operator') && b.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(b._id, 'approved')}
                      className="btn btn-primary btn-sm"
                      style={{ background: '#16a34a', borderColor: '#16a34a' }}
                    >
                      <Check style={{ width: '14px', height: '14px' }} /> Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(b._id, 'rejected')}
                      className="btn btn-danger btn-sm"
                    >
                      <X style={{ width: '14px', height: '14px' }} /> Reject
                    </button>
                  </>
                )}

                {b.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(b._id)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. Admin Users & Certifications View Component
const UsersView = () => {
  const { showToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (id, role, certificationLevel) => {
    try {
      await api.put(`/auth/users/${id}`, { role, certificationLevel });
      showToast('User credentials updated', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>User Directory & Certifications</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
          Grant lab operator roles and authorize equipment certification levels
        </p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading user records...</p>
      ) : (
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto', background: '#ffffff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', background: '#f8fafc' }}>
                <th style={{ padding: '10px 14px' }}>User</th>
                <th style={{ padding: '10px 14px' }}>Email</th>
                <th style={{ padding: '10px 14px' }}>Role</th>
                <th style={{ padding: '10px 14px' }}>Certification Level</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                      {u.name}
                    </div>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '14px' }}>
                    <select
                      className="input-control"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', margin: 0 }}
                      value={u.role}
                      onChange={(e) => handleUpdateUser(u._id, e.target.value, u.certificationLevel)}
                    >
                      <option value="student">Student</option>
                      <option value="researcher">Researcher</option>
                      <option value="operator">Operator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <select
                      className="input-control"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', margin: 0 }}
                      value={u.certificationLevel || 'none'}
                      onChange={(e) => handleUpdateUser(u._id, u.role, e.target.value)}
                    >
                      <option value="none">None</option>
                      <option value="basic">Basic Operator</option>
                      <option value="advanced">Advanced Specialist</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px', color: '#16a34a', fontSize: '0.8rem', fontWeight: '700' }}>
                    Active
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 5. Booking Modal Component
const BookingModal = ({ instrument, instruments, onClose, onSuccess }) => {
  const { showToast } = useAuth();
  const [selectedInstId, setSelectedInstId] = useState(instrument?._id || (instruments[0]?._id || ''));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Default start time to now + 1 hour, end time to now + 3 hours formatted for datetime-local
    const now = new Date();
    const start = new Date(now.getTime() + 60 * 60 * 1000);
    const end = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    setStartTime(start.toISOString().slice(0, 16));
    setEndTime(end.toISOString().slice(0, 16));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInstId || !startTime || !endTime) {
      showToast('Please specify instrument and time slots', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/bookings', {
        instrumentId: selectedInstId,
        startTime,
        endTime
      });
      showToast('Reservation created successfully! Awaiting sign-off.', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>Reserve Equipment</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Select Equipment</label>
            <select
              className="input-control"
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              required
            >
              {instruments.map(inst => (
                <option key={inst._id} value={inst._id}>
                  {inst.name} ({inst.category}) — {inst.location}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Start Date & Time</label>
            <input
              type="datetime-local"
              className="input-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label className="input-label">End Date & Time</label>
            <input
              type="datetime-local"
              className="input-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Checking Conflicts...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App Component with Routing
function MainApp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [instrumentsList, setInstrumentsList] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/instruments').then(res => setInstrumentsList(res.data)).catch(() => {});
    }
  }, [user]);

  const handleOpenBookModal = (inst = null) => {
    setSelectedInstrument(inst);
    setShowBookingModal(true);
  };

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardView onBookClick={() => handleOpenBookModal()} />} />
        <Route path="/instruments" element={<InstrumentsView onBookInstrument={(inst) => handleOpenBookModal(inst)} />} />
        <Route path="/bookings" element={<BookingsView />} />
        {user?.role === 'admin' && <Route path="/users" element={<UsersView />} />}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {showBookingModal && (
        <BookingModal
          instrument={selectedInstrument}
          instruments={instrumentsList}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            navigate('/bookings');
          }}
        />
      )}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}
