import React from 'react';
import { SlidersHorizontal, ArrowUpRight, Monitor, Eye } from 'lucide-react';

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
    <header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: 'rgba(8, 9, 13, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div 
        style={{ 
          maxWidth: 1440, 
          margin: '0 auto', 
          padding: '12px 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: 16 
        }}
      >
        {/* Left: Studio Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div 
            onClick={() => setViewMode('catalog')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div 
              style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 8, 
                background: '#ffffff', 
                color: '#08090d',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: '-0.04em'
              }}
            >
              AS
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  AGENCY STUDIO
                </span>
                <span className="badge-mono" style={{ fontSize: 10, padding: '2px 6px' }}>
                  ATELIER v2
                </span>
              </div>
            </div>
          </div>

          <div 
            style={{ 
              width: 1, 
              height: 20, 
              background: 'var(--border-subtle)',
              display: 'none'
            }} 
          />
        </div>

        {/* Center: View Switcher or Minimalist Category Filter */}
        {viewMode === 'studio' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Previewing:
            </span>
            <span 
              style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '4px 12px',
                borderRadius: 7,
                border: '1px solid var(--border-subtle)'
              }}
            >
              {selectedTemplate ? selectedTemplate.title : 'Template'}
            </span>
          </div>
        ) : (
          <div className="segmented-deck" style={{ overflowX: 'auto', maxWidth: '55vw' }}>
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`segmented-item ${isActive ? 'active' : ''}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {viewMode === 'studio' && (
            <button
              onClick={() => setViewMode('catalog')}
              className="btn-secondary"
              style={{ fontSize: 12, padding: '7px 12px' }}
            >
              <Eye size={14} /> Catalog
            </button>
          )}

          {/* Personalize Client Brand Trigger */}
          <button
            onClick={onOpenPersonalizer}
            className="btn-secondary"
            style={{ 
              fontSize: 12, 
              padding: '7px 14px',
              borderColor: clientBrand.name ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)',
              background: clientBrand.name ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.04)'
            }}
          >
            <SlidersHorizontal size={13} color={clientBrand.name ? '#10b981' : 'currentColor'} />
            {clientBrand.name ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                Client: <strong style={{ color: '#ffffff' }}>{clientBrand.name}</strong>
                <span 
                  style={{ 
                    width: 7, 
                    height: 7, 
                    borderRadius: '50%', 
                    background: clientBrand.color || '#10b981',
                    display: 'inline-block'
                  }} 
                />
              </span>
            ) : (
              <span>Personalize Brand</span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
