import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,14,26,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>
        <Link to={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="#0a0e1a" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
            TalentLens
          </span>
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {user.name}
            </span>
            <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 14 }}>
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: 14 }}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login"    className="btn btn-ghost"   style={{ padding: '8px 20px', fontSize: 14 }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
