import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SpotlightCard from '../components/SpotlightCard';
import GlareHover from '../components/GlareHover';
import { 
  Sparkles, 
  ArrowRight, 
  PieChart, 
  ShieldCheck, 
  Filter, 
  CreditCard
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const features = [
    {
      icon: CreditCard,
      title: 'Add & Track',
      description: 'Easily add and track your daily expenses in seconds.'
    },
    {
      icon: PieChart,
      title: 'Smart Analytics',
      description: 'Visualize your spending patterns with beautiful charts and insights.'
    },
    {
      icon: Filter,
      title: 'Filter & Search',
      description: 'Find any expense quickly with advanced filters and powerful search.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Private',
      description: 'Your data is encrypted and always protected with top security standards.'
    }
  ];

  return (
    <div className="landing-root">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="flex items-center gap-sm cursor-pointer" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}>
          <img src="/logo.png" alt="ExpenseVault" className="w-28 h-28 rounded-md" />
          <h1 style={{ fontSize: '0.9rem' }} className="font-bold tracking-normal text-white">
            Expense<span className="gradient-text">Vault</span>
          </h1>
        </div>

        <div className="landing-nav-actions">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="font-semibold rounded-full border cursor-pointer transition-fast text-primary"
                style={{
                  background: 'transparent',
                  padding: '0.65rem 1.5rem',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                  e.target.style.background = 'rgba(6, 182, 212, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.background = 'transparent';
                }}
              >
                Dashboard
              </button>
              <button
                onClick={() => { logout(); }}
                className="btn-secondary"
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="font-semibold rounded-full border cursor-pointer transition-fast text-primary"
                style={{
                  background: 'transparent',
                  padding: '0.65rem 1.5rem',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                  e.target.style.background = 'rgba(6, 182, 212, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.background = 'transparent';
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary"
                style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
              >
                Get Started Free
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="landing-hero">
        {/* Orbital background decorations */}
        <div className="orbital-bg">
          <div className="orbital-ring" />
          <div className="orbital-ring-inner" />
          {/* Floating star particles */}
          {[
            { top: '15%', left: '20%', size: 6, delay: 0 },
            { top: '25%', right: '18%', size: 4, delay: 1.5 },
            { top: '60%', left: '12%', size: 5, delay: 0.8 },
            { top: '70%', right: '15%', size: 7, delay: 2.2 },
            { top: '40%', left: '8%', size: 3, delay: 3.0 },
            { top: '35%', right: '10%', size: 5, delay: 1.0 },
            { top: '80%', left: '25%', size: 4, delay: 2.8 },
            { top: '18%', right: '28%', size: 3, delay: 0.5 }
          ].map((star, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              right: star.right,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: '50%',
              background: i % 2 === 0 ? '#06b6d4' : '#14b8a6',
              boxShadow: `0 0 ${star.size * 3}px ${i % 2 === 0 ? 'rgba(6, 182, 212, 0.6)' : 'rgba(20, 184, 166, 0.6)'}`,
              animation: `pulse ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`
            }} />
          ))}
        </div>

        <div className="landing-hero-content">
          {/* Tagline pill */}
          <GlareHover
            width="auto"
            height="auto"
            background="rgba(6, 182, 212, 0.1)"
            borderRadius="9999px"
            borderColor="rgba(6, 182, 212, 0.25)"
            glareColor="#06b6d4"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={200}
            transitionDuration={600}
            playOnce={false}
            className="inline-flex"
            style={{ marginBottom: '2rem' }}
          >
            <div className="inline-flex items-center gap-md text-base font-semibold text-turquoise" style={{ padding: '0.45rem 1.2rem' }}>
              <Sparkles size={16} />
              Take Control of Your Money
            </div>
          </GlareHover>

          {/* Headline */}
          <h2 className="landing-headline">
            <span className="text-primary">Track Every Expense.<br /></span>
            <span className="text-turquoise">Save More.</span>
            <span className="text-primary"> Stress Less.</span>
          </h2>

          {/* Subtitle */}
          <p className="landing-subtitle">
            ExpenseVault helps you track your expenses, understand your spending habits, and make smarter financial decisions every day.
          </p>

          {/* CTA Buttons */}
          <div className="landing-cta">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary font-bold rounded-full"
              style={{ padding: '0.7rem 1.75rem', fontSize: '0.9rem' }}
            >
              Get Started Free
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <SpotlightCard
                key={feature.title}
                className="card-col gap-lg text-left"
                style={{ padding: '1rem 1.25rem' }}
              >
                <div className="feature-icon">
                  <Icon size={20} style={{ color: '#06b6d4' }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary mb-xs">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* Responsive overrides */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @media (max-width: 900px) {
          nav { padding: 0.6rem 1.5rem !important; }
          section > div { grid-template-columns: repeat(2, 1fr) !important; }
          section { padding: 0.75rem 1.5rem 1rem !important; }
        }
        @media (max-width: 600px) {
          nav { padding: 0.5rem 1rem !important; }
          nav > div:last-child { gap: 0.5rem !important; }
          nav button:first-child { padding: 0.4rem 0.8rem !important; font-size: 0.75rem !important; }
          nav button:last-child { padding: 0.4rem 0.8rem !important; font-size: 0.75rem !important; }
          main { padding: 1rem 1rem 0.5rem !important; }
          main h2 { font-size: 1.6rem !important; }
          main p { font-size: 0.85rem !important; }
          section > div { grid-template-columns: 1fr !important; }
          section { padding: 0.75rem 1rem 1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
