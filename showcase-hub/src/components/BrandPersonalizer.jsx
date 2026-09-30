import React, { useRef } from 'react';
import { 
  X, 
  Check, 
  RotateCcw, 
  Share2, 
  Send, 
  Upload, 
  Trash2, 
  Sparkles,
  Palette
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Warm Gold', hex: '#E6C378' },
  { name: 'Engineering Orange', hex: '#F97316' },
  { name: 'Cobalt Blue', hex: '#2563EB' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Crimson', hex: '#E11D48' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Indigo Violet', hex: '#8B5CF6' },
  { name: 'Safety Amber', hex: '#F59E0B' }
];

export default function BrandPersonalizer({
  isOpen,
  onClose,
  clientBrand,
  setClientBrand,
  activeTemplate,
  onOpenShareModal,
  showToast
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleReset = () => {
    if (activeTemplate && activeTemplate.defaultBrand) {
      setClientBrand({ 
        ...activeTemplate.defaultBrand,
        logoUrl: '' 
      });
      showToast('Reset to template defaults');
    } else {
      setClientBrand({
        name: '',
        tagline: '',
        color: '',
        phone: '',
        email: '',
        city: '',
        logoUrl: ''
      });
      showToast('Cleared custom branding');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Please upload an image smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setClientBrand({ ...clientBrand, logoUrl: dataUrl });
      showToast('Custom logo loaded & injected live!');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateMonogram = () => {
    const name = clientBrand.name || 'Custom Brand';
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');

    const color = clientBrand.color || activeTemplate?.accentColor || '#ffffff';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
        <rect x="6" y="6" width="58" height="58" rx="12" fill="#0d1017" stroke="${color}" stroke-width="2"/>
        <text x="35" y="43" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="22" fill="${color}" text-anchor="middle">${initials || 'CB'}</text>
        <text x="76" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="18" fill="#ffffff">${name}</text>
        <text x="76" y="53" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="10" fill="${color}" letter-spacing="1.5">OFFICIAL PREVIEW</text>
      </svg>
    `.trim();

    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    setClientBrand({ ...clientBrand, logoUrl: dataUri });
    showToast('Generated custom brand monogram badge!');
  };

  const handleCopyPitch = () => {
    const brandName = clientBrand.name || 'Your Brand';
    const msg = `Hi! Here is a live, interactive preview of your new website built specifically for ${brandName}: ${window.location.origin}/?template=${activeTemplate?.id || 'plazaclock'}&brand=${encodeURIComponent(brandName)}&color=${encodeURIComponent((clientBrand.color || '').replace('#', ''))}\n\nTake a look on your phone or desktop and let me know your thoughts!`;
    navigator.clipboard.writeText(msg);
    showToast('Copied WhatsApp Pitch message to clipboard!');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(4, 5, 8, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          height: '100%',
          background: '#0c0e15',
          borderLeft: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.9)',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge-mono" style={{ fontSize: 10 }}>STUDIO ATELIER</span>
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>● Live Sync</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 4, letterSpacing: '-0.02em' }}>
              Brand & Identity Customizer
            </h3>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: 6 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body Form */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18, flexGrow: 1 }}>
          
          <div style={{
            padding: '12px 14px',
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            fontSize: 12,
            color: 'var(--text-muted)',
            lineHeight: 1.5
          }}>
            Every change made here updates the active website preview in real-time. Headings, logos, phone numbers, and accent colors transform instantly.
          </div>

          {/* Business Name */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
              Prospect Company / Brand Name
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Luxury Timepieces"
              value={clientBrand.name}
              onChange={(e) => setClientBrand({ ...clientBrand, name: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Logo Replacement Section */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
              Website Brand Logo
            </label>

            {/* Active Logo Preview */}
            {clientBrand.logoUrl && (
              <div style={{
                padding: 10,
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 52,
                    height: 32,
                    background: '#08090d',
                    borderRadius: 6,
                    padding: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <img 
                      src={clientBrand.logoUrl} 
                      alt="Logo preview" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
                    Active Logo Injected
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setClientBrand({ ...clientBrand, logoUrl: '' });
                    showToast('Reverted to default logo');
                  }}
                  className="btn-ghost"
                  style={{ padding: '4px 8px', fontSize: 11, color: '#ef4444' }}
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </div>
            )}

            {/* Logo Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="btn-secondary"
                style={{ justifyContent: 'center', fontSize: 12, padding: '8px 10px' }}
              >
                <Upload size={13} />
                <span>Upload File</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateMonogram}
                className="btn-secondary"
                style={{ justifyContent: 'center', fontSize: 12, padding: '8px 10px' }}
              >
                <Palette size={13} />
                <span>Auto-Monogram</span>
              </button>
            </div>

            <input
              type="text"
              placeholder="Or paste direct image URL..."
              value={clientBrand.logoUrl?.startsWith('data:') ? '' : clientBrand.logoUrl}
              onChange={(e) => setClientBrand({ ...clientBrand, logoUrl: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: 12,
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Primary Accent Color */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>
                Primary Brand Accent Color
              </label>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                {clientBrand.color || activeTemplate?.accentColor}
              </span>
            </div>

            {/* Swatches */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {PRESET_COLORS.map((preset) => {
                const isSelected = (clientBrand.color || activeTemplate?.accentColor)?.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setClientBrand({ ...clientBrand, color: preset.hex })}
                    style={{
                      height: 32,
                      borderRadius: 6,
                      background: preset.hex,
                      border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected ? `0 0 10px ${preset.hex}` : 'none'
                    }}
                    title={preset.name}
                  >
                    {isSelected && <Check size={13} color="#000000" />}
                  </button>
                );
              })}
            </div>

            {/* Hex Input */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={clientBrand.color || activeTemplate?.accentColor || '#ffffff'}
                onChange={(e) => setClientBrand({ ...clientBrand, color: e.target.value })}
                style={{
                  width: 36,
                  height: 34,
                  borderRadius: 6,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer'
                }}
              />
              <input
                type="text"
                placeholder="#E6C378"
                value={clientBrand.color}
                onChange={(e) => setClientBrand({ ...clientBrand, color: e.target.value })}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
              Brand Tagline / Slogan
            </label>
            <input
              type="text"
              placeholder="e.g. Timeless Precision for Modern Leaders"
              value={clientBrand.tagline}
              onChange={(e) => setClientBrand({ ...clientBrand, tagline: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* WhatsApp / Phone */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
              WhatsApp / Direct Phone
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={clientBrand.phone}
              onChange={(e) => setClientBrand({ ...clientBrand, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Action Footer Buttons */}
          <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={handleCopyPitch}
              className="btn-secondary"
              style={{ justifyContent: 'center', fontSize: 12, padding: '9px' }}
            >
              <Send size={13} color="#10b981" />
              <span>Copy Ready WhatsApp Pitch</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="btn-primary"
              style={{ justifyContent: 'center', fontSize: 12, padding: '9px' }}
            >
              <Share2 size={13} />
              <span>Generate Shareable Pitch Link</span>
            </button>

            <button
              onClick={handleReset}
              className="btn-ghost"
              style={{ justifyContent: 'center', fontSize: 11, color: 'var(--text-dim)' }}
            >
              <RotateCcw size={12} />
              <span>Reset to Defaults</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
