import React, { useState } from 'react';
import { ArrowUpRight, SlidersHorizontal, ExternalLink, Lock } from 'lucide-react';

export default function TemplateCard({ template, onSelect, onCustomize, clientBrand }) {
  const isPersonalized = Boolean(clientBrand.name);
  const activeColor = clientBrand.color || template.accentColor;
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const getCardIframeUrl = () => {
    const url = new URL(template.previewUrl, window.location.origin);
    if (clientBrand.name) url.searchParams.set('brand', clientBrand.name);
    if (clientBrand.color) url.searchParams.set('color', clientBrand.color.replace('#', ''));
    if (clientBrand.phone) url.searchParams.set('phone', clientBrand.phone);
    if (clientBrand.tagline) url.searchParams.set('tagline', clientBrand.tagline);
    return url.toString();
  };

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
      {/* Real Live Miniature Website Browser Preview */}
      <div 
        className="card-preview-viewport"
        onClick={() => onSelect(template)}
        style={{ cursor: 'pointer' }}
      >
        {/* Browser Top Window Bar */}
        <div className="card-browser-header">
          <div className="card-browser-dots">
            <div className="card-browser-dot" style={{ background: '#ef4444' }} />
            <div className="card-browser-dot" style={{ background: '#eab308' }} />
            <div className="card-browser-dot" style={{ background: '#10b981' }} />
          </div>

          <div className="card-browser-url">
            <span>{clientBrand.name ? clientBrand.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com' : `${template.id}.atelier.dev`}</span>
          </div>

          <a 
            href={template.previewUrl} 
            target="_blank" 
            rel="noreferrer"
            title="Open in new window"
            style={{
              color: 'var(--text-dim)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              borderRadius: 4,
              transition: 'color 0.2s'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Live Scaled Iframe Viewport */}
        <div 
          className="card-preview-frame"
          style={{
            background: template.heroColor ? `${template.heroColor}33` : '#0d1017'
          }}
        >
          {/* Subtle placeholder while iframe loads */}
          {!iframeLoaded && (
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${template.heroColor || '#0a0d14'}, #08090d)`,
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.08em'
              }}
            >
              LOADING PREVIEW...
            </div>
          )}

          <iframe
            src={getCardIframeUrl()}
            title={`${template.title} preview`}
            tabIndex="-1"
            scrolling="no"
            loading="lazy"
            onLoad={() => setIframeLoaded(true)}
            className="card-scaled-iframe"
          />

          {/* Interactive Hover Overlay */}
          <div className="card-preview-overlay">
            <button className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>
              <span>Launch Live Simulator</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Card Content Information */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Industry Tag & Turnaround */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ 
            fontSize: 11, 
            fontFamily: 'var(--font-mono)', 
            color: activeColor, 
            letterSpacing: '0.04em', 
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeColor }} />
            {template.industry}
          </div>

          <span className="badge-mono" style={{ fontSize: 10 }}>
            {template.completionTime}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          {isPersonalized ? `${clientBrand.name}` : template.title}
        </h3>

        {/* Tagline */}
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
          {isPersonalized && clientBrand.tagline ? clientBrand.tagline : template.tagline}
        </p>

        {/* Description */}
        <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5, margin: '12px 0 14px 0' }}>
          {template.description}
        </p>

        {/* Key Features Minimalist List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {template.keyFeatures.slice(0, 3).map((feat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: activeColor, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-main)', fontWeight: 500 }}>{feat}</span>
            </div>
          ))}
        </div>

        {/* Tech Stack Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {template.techStack.map((tech) => (
            <span 
              key={tech}
              className="badge-mono"
              style={{ fontSize: 10, padding: '2px 6px' }}
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
