import React from 'react';
import { ArrowUpRight, SlidersHorizontal, Check, ExternalLink, Clock } from 'lucide-react';

export default function TemplateCard({ template, onSelect, onCustomize, clientBrand }) {
  const isPersonalized = Boolean(clientBrand.name);
  const activeColor = clientBrand.color || template.accentColor;

  return (
    <div 
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Banner with Subtle Atmospheric Hue */}
      <div 
        style={{
          height: 190,
          position: 'relative',
          background: `linear-gradient(180deg, ${template.heroColor}88 0%, #0d0f17 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 20,
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {/* Architectural hairline grid */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            pointerEvents: 'none'
          }} 
        />

        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <span className="badge-mono" style={{ fontSize: 10, background: 'rgba(0, 0, 0, 0.4)' }}>
            {template.badge || template.category}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              BUILD: {template.completionTime}
            </span>
            <a 
              href={template.previewUrl} 
              target="_blank" 
              rel="noreferrer"
              title="Open Direct in New Tab"
              style={{
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: 6,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.2s'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Center Title & Industry */}
        <div style={{ zIndex: 2 }}>
          <div style={{ 
            fontSize: 11, 
            fontFamily: 'var(--font-mono)', 
            color: activeColor, 
            letterSpacing: '0.06em', 
            textTransform: 'uppercase',
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeColor }} />
            {template.industry}
          </div>

          <h3 style={{ fontSize: 19, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            {isPersonalized ? `${clientBrand.name}` : template.title}
          </h3>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
            {isPersonalized && clientBrand.tagline ? clientBrand.tagline : template.tagline}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 16 }}>
          {template.description}
        </p>

        {/* Key Features Minimalist List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
          {template.keyFeatures.slice(0, 3).map((feat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: activeColor, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-main)', fontWeight: 500 }}>{feat}</span>
            </div>
          ))}
        </div>

        {/* Tech Stack Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {template.techStack.map((tech) => (
            <span 
              key={tech}
              className="badge-mono"
              style={{ fontSize: 10, padding: '2px 7px', color: 'var(--text-dim)' }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => onSelect(template)}
            className="btn-primary"
            style={{ 
              flex: 1, 
              padding: '9px 14px', 
              fontSize: 12,
              justifyContent: 'space-between'
            }}
          >
            <span>Launch Live Simulator</span>
            <ArrowUpRight size={14} />
          </button>

          <button
            onClick={() => onCustomize(template)}
            className="btn-secondary"
            title="Personalize Client Brand"
            style={{ padding: '9px 12px' }}
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
