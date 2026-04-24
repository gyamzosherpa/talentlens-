import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, User, Mail, Lock, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:24 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,var(--accent),var(--accent-2))',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Zap size={20} color="#0a0e1a" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily:'Syne',fontWeight:800,fontSize:20 }}>TalentLens</span>
          </Link>
          <h1 style={{ fontSize:'1.8rem', marginBottom:8 }}>Create account</h1>
          <p style={{ color:'var(--text-muted)', fontSize:15 }}>Start practising interviews for free</p>
        </div>

        <div className="card">
          {error && (
            <div style={{ display:'flex',gap:8,alignItems:'center',background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:8,padding:'10px 14px',marginBottom:20,color:'var(--red)',fontSize:14 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[
              { label:'Full Name', name:'name', type:'text', icon:User, placeholder:'John Doe' },
              { label:'Email',     name:'email', type:'email', icon:Mail, placeholder:'you@example.com' },
              { label:'Password',  name:'password', type:'password', icon:Lock, placeholder:'Min 6 characters' },
            ].map(({ label, name, type, icon:Icon, placeholder }) => (
              <div key={name}>
                <label style={{ display:'block', fontSize:13, color:'var(--text-muted)', marginBottom:6, fontWeight:500 }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <Icon size={15} style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)' }} />
                  <input className="input" name={name} type={type} placeholder={placeholder} value={form[name]} onChange={handle} style={{ paddingLeft:36 }} required />
                </div>
              </div>
            ))}
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width:'100%',justifyContent:'center',marginTop:8 }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color:'var(--accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
