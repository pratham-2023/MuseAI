import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Library from './pages/Library';
import PlaylistView from './pages/PlaylistView';
import Feedback from './pages/Feedback';
import { PlayerProvider } from './context/PlayerContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ThemeToggle from './components/ThemeToggle';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function AppContent() {
    const { user } = useAuth();
    const isAuthenticated = !!user;

    return (
        <Router>
            <ThemeToggle />
            <div className="app-container">
                {isAuthenticated && <Sidebar />}
                <main className={isAuthenticated ? "main-content" : "auth-content"} style={{ width: isAuthenticated ? 'auto' : '100%', marginLeft: isAuthenticated ? '250px' : '0', flex: 1, padding: '2rem' }}>
                    <Routes>
                        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                        <Route path="/search" element={isAuthenticated ? <Search /> : <Navigate to="/login" />} />
                        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                        <Route path="/library" element={isAuthenticated ? <Library /> : <Navigate to="/login" />} />
                        <Route path="/playlist/:id" element={isAuthenticated ? <PlaylistView /> : <Navigate to="/login" />} />
                        <Route path="/feedback" element={isAuthenticated ? <Feedback /> : <Navigate to="/login" />} />

                        {/* Admin Routes */}
                        <Route path="/admin/login" element={!isAuthenticated ? <AdminLogin /> : (user?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />)} />
                        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/admin/login" />} />

                        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                    </Routes>
                </main>
                {isAuthenticated && <Player />}
            </div>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <PlayerProvider>
                    <AppContent />
                </PlayerProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
