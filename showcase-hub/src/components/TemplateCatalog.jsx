import React, { useState } from 'react';
import TemplateCard from './TemplateCard';
import { ArrowRight, Layers, SlidersHorizontal, RefreshCw, Check, Sparkles, Building2, Crown, Shield } from 'lucide-react';

export default function TemplateCatalog({ 
  templates, 
  activeFilter, 
  onSelectTemplate, 
  onOpenPersonalizer, 
  onCreateWebsite,
  onRefreshLibrary,
  clientBrand 
}) {
  const [selectedTier, setSelectedTier] = useState('all'); // 'all' | 'basic' | 'standard' | 'premium'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = activeFilter === 'All Templates' || t.category === activeFilter;
    const matchesTier = selectedTier === 'all' || t.tier === selectedTier;
    return matchesCategory && matchesTier;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshLibrary) {
      await onRefreshLibrary();
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const basicCount = templates.filter(t => t.tier === 'basic').length;
  const standardCount = templates.filter(t => t.tier === 'standard').length;
  const premiumCount = templates.filter(t => t.tier === 'premium').length;

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '36px 24px 80px 24px' }}>
      
      {/* Editorial Hero Header */}
      <div 
        style={{ 
          padding: '36px 0 32px 0', 
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 36,
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge-mono" style={{ color: 'var(--text-main)', background: 'var(--bg-input)' }}>
              DYNAMIC TEMPLATE REPOSITORY
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              // {templates.length} DISCOVERED FRAMEWORKS
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#cbd5e1',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Scanning sources/...' : 'Refresh Template Library'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ maxWidth: 780 }}>
            <h1 
              style={{ 
                fontSize: 'clamp(28px, 3.6vw, 48px)', 
                fontWeight: 800, 
                lineHeight: 1.15, 
                letterSpacing: '-0.035em', 
                color: 'var(--text-main)',
                margin: '0 0 14px'
              }}
            >
              Dynamic Website Template Library & Client Website Builder
            </h1>
            <p style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 680, margin: 0 }}>
              Convert discovered React projects into customized client websites without manually modifying source code. Filter by Basic, Standard, and Premium tiers.
            </p>
          </div>

          {/* Tier Counts Cards */}
          <div 
            style={{ 
              display: 'flex', 
              gap: 16, 
              padding: '12px 18px', 
              borderRadius: 14, 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{basicCount}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Basic</div>
            </div>
            <div style={{ width: 1, background: 'var(--border-subtle)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#eab308', fontFamily: 'var(--font-mono)' }}>{standardCount}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Standard</div>
            </div>
            <div style={{ width: 1, background: 'var(--border-subtle)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>{premiumCount}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Premium</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Segregation Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 32,
        padding: '16px 20px',
        borderRadius: 16,
        background: 'var(--bg-surface-elevated, rgba(15, 23, 42, 0.6))',
        border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.08))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: 4 }}>
            Website Tier:
          </span>

          {[
            { id: 'all', label: 'All Tiers', count: templates.length, color: '#94a3b8' },
            { id: 'basic', label: 'Basic Websites', count: basicCount, color: '#60a5fa', icon: Shield },
            { id: 'standard', label: 'Standard Websites', count: standardCount, color: '#eab308', icon: Crown },
            { id: 'premium', label: 'Premium Websites', count: premiumCount, color: '#f43f5e', icon: Sparkles }
          ].map(tier => {
            const isActive = selectedTier === tier.id;
            const Icon = tier.icon;
            return (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 10,
                  background: isActive ? `${tier.color}20` : 'transparent',
                  border: isActive ? `1px solid ${tier.color}60` : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {Icon && <Icon size={14} color={tier.color} />}
                <span>{tier.label}</span>
                <span style={{
                  padding: '1px 6px',
                  borderRadius: 9999,
                  background: isActive ? tier.color : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: 10,
                  fontWeight: 800
                }}>
                  {tier.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tier helper note */}
        <div style={{ fontSize: 12, color: '#64748b' }}>
          {selectedTier === 'basic' && '⚡ Padma Cables & Electwell: Clean B2B Industrial, high credibility & lead generation.'}
          {selectedTier === 'standard' && '✨ Plaza Quartz: Luxury atelier layout, zero-crop showcases & Locomotive scroll.'}
          {selectedTier === 'premium' && '🔥 Young Wheels: Motion micro-interactions, variant selectors & commerce funnels.'}
          {selectedTier === 'all' && 'Click "Create Website" on any template to launch the client wizard.'}
        </div>
      </div>

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
            onSelect={onSelectTemplate}
            onCustomize={onOpenPersonalizer}
            onCreateWebsite={onCreateWebsite}
            clientBrand={clientBrand}
          />
        ))}
      </div>

    </div>
  );
}
