import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Plus, Clock, CheckCircle, BarChart3, ChevronRight, FileText } from 'lucide-react';

function ScoreBadge({ score }) {
  if (!score) return <span className="badge badge-muted">—</span>;
  if (score >= 7) return <span className="badge badge-green">{score}/10</span>;
  if (score >= 5) return <span className="badge badge-gold">{score}/10</span>;
  return <span className="badge badge-red">{score}/10</span>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/interviews')
      .then(r => setSessions(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completed = sessions.filter(s => s.status === 'completed');
  const avgScore = completed.length
    ? (completed.reduce((a, s) => a + parseFloat(s.average_score || 0), 0) / completed.length).toFixed(1)
    : null;

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="container">

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40, flexWrap:'wrap', gap:16 }}>
            <div>
              <h1 style={{ fontSize:'2rem', marginBottom:4 }}>
                Welcome, <span style={{ color:'var(--accent)' }}>{user?.name}</span>
              </h1>
              <p style={{ color:'var(--text-muted)' }}>Your interview practice dashboard</p>
            </div>
            <Link to="/setup" className="btn btn-primary" style={{ fontSize:15, padding:'12px 28px' }}>
              <Plus size={18} /> New Interview
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:20, marginBottom:40 }}>
            {[
              { label:'Total Interviews', value: sessions.length, icon: FileText, color:'var(--accent)' },
              { label:'Completed',        value: completed.length, icon: CheckCircle, color:'var(--accent)' },
              { label:'In Progress',      value: sessions.filter(s=>s.status==='pending').length, icon: Clock, color:'var(--gold)' },
              { label:'Avg Score',        value: avgScore ? `${avgScore}/10` : '—', icon: BarChart3, color:'var(--accent)' },
            ].map(({ label, value, icon:Icon, color }) => (
              <div key={label} className="card" style={{ padding:'1.5rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:500 }}>{label}</span>
                  <Icon size={18} color={color} />
                </div>
                <div style={{ fontFamily:'Syne', fontSize:'2rem', fontWeight:700, color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Sessions list */}
          <div>
            <h2 style={{ fontSize:'1.25rem', marginBottom:20 }}>Interview History</h2>
            {loading ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>Loading…</div>
            ) : sessions.length === 0 ? (
              <div className="card" style={{ textAlign:'center', padding:'4rem' }}>
                <FileText size={40} color="var(--text-muted)" style={{ margin:'0 auto 16px' }} />
                <h3 style={{ marginBottom:8 }}>No interviews yet</h3>
                <p style={{ color:'var(--text-muted)', marginBottom:24 }}>Start your first AI-powered interview practice session</p>
                <Link to="/setup" className="btn btn-primary">
                  <Plus size={16} /> Start Interview
                </Link>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {sessions.map(session => (
                  <div key={session.id} className="card" style={{ padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                    <div style={{ flex:1, minWidth:200 }}>
                      <div style={{ fontWeight:600, marginBottom:4 }}>{session.job_role}</div>
                      <div style={{ fontSize:13, color:'var(--text-muted)' }}>
                        {new Date(session.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                        {' · '}{session.questions_asked || 0}/{session.total_questions} questions
                      </div>
                    </div>
                    <ScoreBadge score={session.average_score} />
                    <span className={`badge ${session.status === 'completed' ? 'badge-green' : 'badge-gold'}`}>
                      {session.status}
                    </span>
                    {session.status === 'completed' ? (
                      <Link to={`/results/${session.id}`} className="btn btn-ghost" style={{ padding:'8px 16px', fontSize:13 }}>
                        View Report <ChevronRight size={14} />
                      </Link>
                    ) : (
                      <Link to={`/interview/${session.id}`} className="btn btn-primary" style={{ padding:'8px 16px', fontSize:13 }}>
                        Continue <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
