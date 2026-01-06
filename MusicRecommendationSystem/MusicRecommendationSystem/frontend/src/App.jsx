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
import { PlayerProvider } from './context/PlayerContext';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsAuthenticated(!!user);
    }, []);

    return (
        <PlayerProvider>
            <Router>
                <div className="app-container">
                    {isAuthenticated && <Sidebar />}
                    <main className={isAuthenticated ? "main-content" : "auth-content"} style={{ width: isAuthenticated ? 'auto' : '100%', marginLeft: isAuthenticated ? '250px' : '0', flex: 1, padding: '2rem' }}>
                        <Routes>
                            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                            <Route path="/search" element={isAuthenticated ? <Search /> : <Navigate to="/login" />} />
                            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                            <Route path="/library" element={isAuthenticated ? <Library /> : <Navigate to="/login" />} />
                            <Route path="/playlist/:id" element={isAuthenticated ? <PlaylistView /> : <Navigate to="/login" />} />

                            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                        </Routes>
                    </main>
                    {isAuthenticated && <Player />}
                </div>
            </Router>
        </PlayerProvider>
    );
}

export default App;
