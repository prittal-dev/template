import React from 'react';
import { Layers, Sparkles, Sliders, ExternalLink, Laptop, Smartphone, Eye } from 'lucide-react';

export default function ShowcaseHeader({ 
  onOpenPersonalizer, 
  clientBrand, 
  activeFilter, 
  setActiveFilter, 
  categories, 
  viewMode, 
  setViewMode,
  selectedTemplate
}) {
  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div 
            onClick={() => setViewMode('catalog')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <div style={{ 
              width: 38, 
              height: 38, 
              borderRadius: 10, 
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
            }}>
              <Layers size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  STUDIO<span style={{ color: '#8b5cf6' }}>SHOWCASE</span>
                </span>
                <span style={{ 
                  fontSize: 10, 
                  fontWeight: 700, 
                  background: 'rgba(139, 92, 246, 0.18)', 
                  color: '#a78bfa', 
                  padding: '2px 8px', 
                  borderRadius: 999,
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  CLIENT DEMO HUB
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', margin: 0 }}>
                Live Brand Personalizer & Interactive Pitch Engine
              </p>
            </div>
          </div>
        </div>

        {/* Center: View Switcher or Active Template Info */}
        {viewMode === 'studio' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Viewing:</span>
            <span style={{ 
              fontSize: 13, 
              fontWeight: 600, 
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '4px 12px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)'
            }}>
              {selectedTemplate ? selectedTemplate.title : 'Template Preview'}
            </span>
          </div>
        ) : (
          /* Filter Pills in Catalog Mode */
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', padding: '4px 0' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: activeFilter === cat ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                  color: activeFilter === cat ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: activeFilter === cat ? '0 4px 12px rgba(139, 92, 246, 0.35)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {viewMode === 'studio' && (
            <button
              onClick={() => setViewMode('catalog')}
              className="btn-secondary"
              style={{ fontSize: 13, padding: '8px 14px' }}
            >
              <Eye size={15} /> All Templates
            </button>
          )}

          {/* Personalize Button */}
          <button
            onClick={onOpenPersonalizer}
            className="btn-primary"
            style={{ 
              fontSize: 13, 
              padding: '8px 16px',
              background: clientBrand.name 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
            }}
          >
            <Sliders size={15} />
            {clientBrand.name ? (
              <span>Brand: <strong>{clientBrand.name}</strong></span>
            ) : (
              <span>Personalize for Client</span>
            )}
            {clientBrand.name && (
              <span style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: clientBrand.color || '#10b981',
                boxShadow: `0 0 6px ${clientBrand.color || '#10b981'}`
              }} />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
