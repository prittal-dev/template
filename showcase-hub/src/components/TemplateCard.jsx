import React from 'react';
import { Play, Sparkles, ExternalLink, Star, Clock, CheckCircle2, Sliders, Smartphone, Laptop } from 'lucide-react';

export default function TemplateCard({ template, onSelect, onCustomize, clientBrand }) {
  const isPersonalized = Boolean(clientBrand.name);
  const activeColor = clientBrand.color || template.accentColor;

  return (
    <div 
      className="glass-panel glass-panel-hover"
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Top Card Preview Banner */}
      <div 
        style={{
          height: 220,
          position: 'relative',
          background: `linear-gradient(135deg, ${template.heroColor}dd 0%, #0d111c 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 20,
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {/* Subtle grid pattern background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          pointerEvents: 'none'
        }} />

        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '4px 10px',
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {template.category}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0, 0, 0, 0.4)', padding: '3px 8px', borderRadius: 20 }}>
            <Star size={12} fill="#eab308" color="#eab308" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fef08a' }}>{template.rating}</span>
          </div>
        </div>

        {/* Center Presentation Title & Accent Glow */}
        <div style={{ zIndex: 2 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6,
            fontSize: 11,
            color: activeColor,
            fontWeight: 600,
            marginBottom: 6
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeColor, boxShadow: `0 0 8px ${activeColor}` }} />
            {template.industry}
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
            {isPersonalized ? `${clientBrand.name} Demo` : template.title}
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.7)', marginTop: 4 }}>
            {isPersonalized && clientBrand.tagline ? clientBrand.tagline : template.tagline}
          </p>
        </div>

        {/* Bottom Banner Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ 
              fontSize: 11, 
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <Clock size={12} /> Ready in {template.completionTime}
            </span>
          </div>

          <a 
            href={template.previewUrl} 
            target="_blank" 
            rel="noreferrer"
            title="Open Fullscreen in New Window"
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              transition: 'all 0.2s'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Card Content & Features */}
      <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
          {template.description}
        </p>

        {/* Feature Checkmarks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {template.keyFeatures.slice(0, 3).map((feat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={14} color={activeColor} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-main)', fontWeight: 500 }}>{feat}</span>
            </div>
          ))}
        </div>

        {/* Tech Stack Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {template.techStack.map((tech) => (
            <span 
              key={tech}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-dim)',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '3px 8px',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
          <button
            onClick={() => onSelect(template)}
            className="btn-primary"
            style={{ 
              flex: 1, 
              justifyContent: 'center', 
              fontSize: 13,
              background: `linear-gradient(135deg, ${activeColor}, #6366f1)`
            }}
          >
            <Play size={14} fill="#ffffff" />
            <span>Live Interactive Demo</span>
          </button>

          <button
            onClick={() => onCustomize(template)}
            className="btn-secondary"
            title="Pitch with Custom Client Brand"
            style={{ padding: '9px 12px' }}
          >
            <Sliders size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
