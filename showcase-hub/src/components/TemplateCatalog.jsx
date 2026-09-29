import React from 'react';
import TemplateCard from './TemplateCard';
import { Sparkles, Zap, Smartphone, Share2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TemplateCatalog({ 
  templates, 
  activeFilter, 
  onSelectTemplate, 
  onOpenPersonalizer, 
  clientBrand 
}) {
  const filteredTemplates = activeFilter === 'All Templates'
    ? templates
    : templates.filter(t => t.category === activeFilter);

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 24px 80px 24px' }}>
      
      {/* Hero Presentation Banner */}
      <div 
        className="glass-panel" 
        style={{ 
          borderRadius: 28, 
          padding: '48px 40px', 
          marginBottom: 44,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          background: 'linear-gradient(135deg, rgba(20, 24, 38, 0.9) 0%, rgba(10, 13, 20, 0.95) 100%)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 840, position: 'relative', zIndex: 2 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '6px 14px', 
            borderRadius: 999, 
            background: 'rgba(139, 92, 246, 0.15)', 
            border: '1px solid rgba(139, 92, 246, 0.3)',
            marginBottom: 16
          }}>
            <Sparkles size={14} color="#c084fc" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#e9d5ff', letterSpacing: '0.04em' }}>
              AGENCY SALES & LIVE PITCH ENGINE
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16, color: '#ffffff' }}>
            Show Clients Exactly How Their Website Will Look — <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Live & In Real-Time.</span>
          </h1>

          <p style={{ fontSize: 'clamp(14px, 1.5vw, 17px)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 28 }}>
            Stop losing deals to static PDF mockups. Select any of our production-ready frameworks below, personalize it with your prospect's brand name and colors, and pitch them with a fully responsive, working website.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color="#818cf8" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>4 Production Frameworks</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Luxury, Industrial, Infra & Retail</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={18} color="#22d3ee" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>Multi-Device Simulator</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Desktop, Tablet & iPhone Frames</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Share2 size={18} color="#34d399" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>Shareable Pitch Links</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Instant WhatsApp & Email URLs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Client Personalization Notice (if configured) */}
      {clientBrand.name && (
        <div 
          style={{ 
            marginBottom: 28,
            padding: '12px 20px',
            borderRadius: 14,
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: clientBrand.color || '#10b981' }} />
            <span style={{ fontSize: 14, color: '#ffffff' }}>
              Currently presenting as <strong>{clientBrand.name}</strong> ({clientBrand.tagline || 'Customized Brand'})
            </span>
          </div>
          <button 
            onClick={onOpenPersonalizer}
            className="btn-secondary"
            style={{ fontSize: 12, padding: '4px 12px' }}
          >
            Edit Brand Details
          </button>
        </div>
      )}

      {/* Templates Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: 28 
      }}>
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            clientBrand={clientBrand}
            onSelect={onSelectTemplate}
            onCustomize={onOpenPersonalizer}
          />
        ))}
      </div>

      {/* Pitch Playbook Section */}
      <div 
        className="glass-panel" 
        style={{ 
          marginTop: 64, 
          borderRadius: 24, 
          padding: '36px', 
          border: '1px solid var(--border-subtle)' 
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>
          How to Pitch These Websites to Close High-Ticket Clients:
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
          Follow this 3-step agency formula during client calls or coffee meetings:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div style={{ padding: 20, borderRadius: 16, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#8b5cf6', marginBottom: 6 }}>01</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Identify Their Industry</h4>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>
              Choose the template that fits: Plaza Clock for luxury brands, Electwell for B2B engineering, Padma Cables for infrastructure, or Young Wheels for consumer goods.
            </p>
          </div>

          <div style={{ padding: 20, borderRadius: 16, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#06b6d4', marginBottom: 6 }}>02</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Inject Their Brand Live</h4>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>
              Click "Personalize for Client", enter their business name and pick their brand color. The website transforms live on your screen or inside the device simulator.
            </p>
          </div>

          <div style={{ padding: 20, borderRadius: 16, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981', marginBottom: 6 }}>03</div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Send Shareable WhatsApp Link</h4>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>
              Generate a custom pitch link and send it directly to the decision-maker. When they open it on their phone, they will experience their brand already built.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
