import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Result from './pages/Result';
import Login from './pages/Login';
import Signup from './pages/Signup';
import History from './pages/History';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      setUser({ token, email });
    }
  }, []);

  const login = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    setUser({ token, email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background-soft font-sans w-full text-slate-800">
        <Navbar user={user} logout={logout} />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={!user ? <Login login={login} /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!user ? <Signup login={login} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/result" element={user ? <Result /> : <Navigate to="/login" />} />
            <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
