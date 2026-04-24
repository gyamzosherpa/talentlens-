import { Link } from 'react-router-dom';
import { Zap, Brain, Target, BarChart3, ChevronRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const features = [
  { icon: Brain, title: 'Resume-Grounded Questions', desc: 'Every question is generated from your actual resume — skills, projects, and experience.' },
  { icon: Target, title: 'No Repeat Topics', desc: 'Our AI tracks every topic asked and guarantees zero repetition across all 10 questions.' },
  { icon: BarChart3, title: 'Real-Time Evaluation', desc: 'Get instant scored feedback after every answer with strengths and areas to improve.' },
  { icon: Zap, title: 'Adaptive Difficulty', desc: 'Questions rotate through resume-specific, technical, behavioural, and situational categories.' },
];

const steps = [
  'Upload your resume (PDF or TXT)',
  'Enter the job role you are targeting',
  'Answer 10 uniquely crafted interview questions',
  'Review your score, feedback, and AI report',
];

export default function LandingPage() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '7rem 2rem 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,231,183,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container fade-up">
          <div className="badge badge-green" style={{ marginBottom: 24 }}>
            AI-Powered Interview Practice
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: 24, letterSpacing: '-0.03em' }}>
            Interviews That Know<br />
            <span style={{ color: 'var(--accent)' }}>Your Resume</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            TalentLens generates personalised interview questions from your resume, evaluates every answer in real time, and produces a detailed hiring report.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
              Start Free Interview <ChevronRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-ghost" style={{ fontSize: 16, padding: '14px 32px' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 2rem' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>
            Built Different
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ transition: 'transform 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='rgba(110,231,183,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='var(--border)'; }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 16,
                  background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '4rem 2rem' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>How It Works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map((step, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'var(--navy-2)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '16px 20px',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--accent-dim)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
                }}>{i + 1}</div>
                <span style={{ fontSize: 15 }}>{step}</span>
                <CheckCircle size={18} color="var(--accent)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
              Try It Free <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        © {new Date().getFullYear()} TalentLens — AI Interview Platform
      </footer>
    </div>
  );
}
