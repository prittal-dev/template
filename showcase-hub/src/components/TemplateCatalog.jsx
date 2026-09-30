import React from 'react';
import TemplateCard from './TemplateCard';
import { ArrowRight, Monitor, SlidersHorizontal, Check } from 'lucide-react';

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
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      
      {/* Editorial Minimalist Hero Header */}
      <div 
        style={{ 
          padding: '40px 0 36px 0', 
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="badge-mono" style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.08)' }}>
            PORTFOLIO REPOSITORY
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            // 4 PRODUCTION FRAMEWORKS
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ maxWidth: 740 }}>
            <h1 
              style={{ 
                fontSize: 'clamp(32px, 3.8vw, 52px)', 
                fontWeight: 700, 
                lineHeight: 1.1, 
                letterSpacing: '-0.035em', 
                color: '#ffffff',
                marginBottom: 14
              }}
            >
              Interactive Website Atelier & Live Client Pitch Engine.
            </h1>
            <p style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 640 }}>
              Live interactive digital showroom. Test websites inside responsive device viewports, personalize logos and brand colors in real-time, and send shareable client links.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div 
            style={{ 
              display: 'flex', 
              gap: 28, 
              padding: '16px 24px', 
              borderRadius: 14, 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-subtle)' 
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>04</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Frameworks</div>
            </div>
            <div style={{ width: 1, background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>3x</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Device Modes</div>
            </div>
            <div style={{ width: 1, background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>Live</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>White-Labeling</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Client Personalization Notice (if configured) */}
      {clientBrand.name && (
        <div 
          style={{ 
            marginBottom: 32,
            padding: '12px 20px',
            borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: clientBrand.color || '#10b981' }} />
            <span style={{ fontSize: 13, color: '#ffffff' }}>
              Active Client Simulation: <strong style={{ color: '#ffffff' }}>{clientBrand.name}</strong>
              {clientBrand.tagline && <span style={{ color: 'var(--text-muted)' }}> — {clientBrand.tagline}</span>}
            </span>
          </div>
          <button 
            onClick={onOpenPersonalizer}
            className="btn-ghost"
            style={{ fontSize: 12, padding: '4px 10px', textDecoration: 'underline' }}
          >
            Edit Brand Parameters
          </button>
        </div>
      )}

      {/* Templates Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 24 
        }}
      >
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

      {/* Minimalist Agency Workflow Footer */}
      <div 
        style={{ 
          marginTop: 64, 
          padding: '32px', 
          borderRadius: 18, 
          background: 'var(--bg-surface)', 
          border: '1px solid var(--border-subtle)' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 4 }}>
              Three-Step Client Pitch Protocol
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: 0 }}>
              Close prospective clients faster during live screen-share or in-person meetings.
            </p>
          </div>
          <span className="badge-mono">AGENCY PROTOCOL</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <div style={{ padding: 18, borderRadius: 12, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>
              PHASE 01
            </span>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Select Niche Framework</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Pick the industry layout: Horology & Luxury, Heavy Engineering, Power Infrastructure, or Consumer Goods.
            </p>
          </div>

          <div style={{ padding: 18, borderRadius: 12, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>
              PHASE 02
            </span>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Inject Client Brand</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Input business name, upload their logo or generate an instant monogram, and set accent colors in real-time.
            </p>
          </div>

          <div style={{ padding: 18, borderRadius: 12, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>
              PHASE 03
            </span>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Dispatch Pitch Link</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Generate a custom link with preloaded brand query parameters and send directly via WhatsApp or email.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
