import React from 'react';
import { SlidersHorizontal, Eye, Sun, Moon, LayoutGrid, FolderKanban, RefreshCw, Plus } from 'lucide-react';

export default function ShowcaseHeader({ 
  onOpenPersonalizer, 
  clientBrand, 
  activeFilter, 
  setActiveFilter, 
  categories, 
  viewMode, 
  setViewMode,
  selectedTemplate,
  theme,
  toggleTheme,
  projectsCount = 0,
  onCreateNew
}) {
  return (
    <header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: 'var(--header-bg, #090d16)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
        transition: 'background-color 0.25s ease'
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
        {/* Left: Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
                width: 34, 
                height: 34, 
                borderRadius: 10, 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                color: '#ffffff',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 15,
                letterSpacing: '-0.04em',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              WB
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main, #ffffff)' }}>
                  AGENCY BUILDER
                </span>
                <span className="badge-mono" style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                  STUDIO v3
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Mode Switcher: Catalog vs Client Projects */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: 3,
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => setViewMode('catalog')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                background: viewMode === 'catalog' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: viewMode === 'catalog' ? '#ffffff' : '#94a3b8',
                border: 'none',
                fontSize: 12,
                fontWeight: viewMode === 'catalog' ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <LayoutGrid size={14} />
              <span>Template Library</span>
            </button>

            <button
              onClick={() => setViewMode('projects')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                background: viewMode === 'projects' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: viewMode === 'projects' ? '#ffffff' : '#94a3b8',
                border: 'none',
                fontSize: 12,
                fontWeight: viewMode === 'projects' ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <FolderKanban size={14} />
              <span>Client Projects</span>
              {projectsCount > 0 && (
                <span style={{
                  padding: '1px 6px',
                  borderRadius: 9999,
                  background: '#3b82f6',
                  color: '#ffffff',
                  fontSize: 10,
                  fontWeight: 800
                }}>
                  {projectsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Template Category Filter in Catalog Mode */}
        {viewMode === 'catalog' && (
          <div className="segmented-deck" style={{ overflowX: 'auto', maxWidth: '40vw' }}>
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

        {viewMode === 'studio' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Live Simulator:
            </span>
            <span 
              style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: 'var(--text-main)',
                background: 'var(--bg-input)',
                padding: '4px 12px',
                borderRadius: 7,
                border: '1px solid var(--border-subtle)'
              }}
            >
              {selectedTemplate ? selectedTemplate.title : 'Template'}
            </span>
          </div>
        )}

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {viewMode === 'studio' && (
            <button
              onClick={() => setViewMode('catalog')}
              className="btn-secondary"
              style={{ fontSize: 12, padding: '7px 12px' }}
            >
              <Eye size={14} /> Back to Catalog
            </button>
          )}

          {onCreateNew && (
            <button
              onClick={onCreateNew}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} /> New Website
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
