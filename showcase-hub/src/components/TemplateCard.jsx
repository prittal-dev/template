import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, SlidersHorizontal, ExternalLink, PlusCircle, Sparkles } from 'lucide-react';

export default function TemplateCard({ 
  template, 
  onSelect, 
  onCustomize, 
  onCreateWebsite, 
  clientBrand 
}) {
  const isPersonalized = Boolean(clientBrand.name);
  const activeColor = clientBrand.color || template.accentColor;
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Measure container dimensions for pixel-perfect edge-to-edge desktop preview scaling
  const frameRef = useRef(null);
  const [frameDimensions, setFrameDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!frameRef.current) return;
    const updateSize = () => {
      if (frameRef.current) {
        const { offsetWidth, offsetHeight } = frameRef.current;
        if (offsetWidth > 0 && offsetHeight > 0) {
          setFrameDimensions({ width: offsetWidth, height: offsetHeight });
        }
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  // Standard desktop viewport to simulate (1280px standard)
  const virtualWidth = 1280;
  // Calculate exact scale so the 1280px desktop site spans exactly 100% of the frame width
  const scale = frameDimensions.width > 0 ? (frameDimensions.width / virtualWidth) : 0.32;
  // Calculate height in virtual pixels so it spans exactly 100% of the frame height
  const virtualHeight = frameDimensions.height > 0 ? Math.round(frameDimensions.height / scale) : 750;

  // Keep iframe src stable to prevent expensive iframe reloads while typing
  const cardIframeSrc = template.previewUrl;

  const getTierBadge = (tier) => {
    if (tier === 'premium') return { label: 'PREMIUM WEBSITE', bg: 'rgba(244, 63, 94, 0.15)', text: '#f43f5e', border: 'rgba(244, 63, 94, 0.35)' };
    if (tier === 'standard') return { label: 'STANDARD WEBSITE', bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308', border: 'rgba(234, 179, 8, 0.35)' };
    return { label: 'BASIC WEBSITE', bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.35)' };
  };

  const tierBadge = getTierBadge(template.tier);

  return (
    <div 
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.08))',
        borderRadius: 18
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
          ref={frameRef}
          className="card-preview-frame"
          style={{
            background: template.heroColor ? `${template.heroColor}33` : '#0d1017'
          }}
        >
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
            src={cardIframeSrc}
            title={`${template.title} preview`}
            tabIndex="-1"
            scrolling="no"
            loading="lazy"
            onLoad={() => setIframeLoaded(true)}
            className="card-scaled-iframe"
            style={{
              width: `${virtualWidth}px`,
              height: `${virtualHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
              pointerEvents: 'none',
              border: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              display: 'block'
            }}
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
        
        {/* Tier Badge & Industry Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{
            padding: '3px 8px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.05em',
            background: tierBadge.bg,
            color: tierBadge.text,
            border: `1px solid ${tierBadge.border}`
          }}>
            {tierBadge.label}
          </span>

          <span className="badge-mono" style={{ fontSize: 10 }}>
            {template.completionTime}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.25, margin: '0 0 4px' }}>
          {isPersonalized ? `${clientBrand.name}` : template.title}
        </h3>

        {/* Tagline */}
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
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
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => onCreateWebsite(template)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              background: `linear-gradient(135deg, ${activeColor} 0%, #2563eb 100%)`,
              border: 'none',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 16px -4px rgba(0, 0, 0, 0.4)'
            }}
          >
            <PlusCircle size={15} />
            <span>Create Website</span>
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onSelect(template)}
              className="btn-primary"
              style={{ 
                flex: 1, 
                padding: '8px 12px', 
                fontSize: 12,
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1'
              }}
            >
              <span>Live Simulator</span>
              <ArrowUpRight size={13} />
            </button>

            <button
              onClick={() => onCustomize(template)}
              className="btn-secondary"
              title="Preferences & Full Customizer Form"
              style={{ 
                padding: '8px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12
              }}
            >
              <SlidersHorizontal size={13} />
              <span>Preferences</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
