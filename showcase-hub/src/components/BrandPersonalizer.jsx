import React, { useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Share2, 
  Send, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Wand2 
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Warm Gold', hex: '#E6C378' },
  { name: 'Electric Blue', hex: '#2563EB' },
  { name: 'High-Heat Orange', hex: '#F97316' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Ruby Crimson', hex: '#E11D48' },
  { name: 'Cyber Cyan', hex: '#06B6D4' },
  { name: 'Royal Purple', hex: '#8B5CF6' },
  { name: 'Vivid Amber', hex: '#F59E0B' }
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
      showToast('Custom logo loaded & applied live!');
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

    const color = clientBrand.color || activeTemplate?.accentColor || '#8b5cf6';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}"/>
            <stop offset="100%" stop-color="#4338ca"/>
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="58" height="58" rx="16" fill="url(#g)"/>
        <text x="35" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle">${initials || 'CB'}</text>
        <text x="76" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff">${name}</text>
        <text x="76" y="54" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="11" fill="rgba(255,255,255,0.6)" letter-spacing="2">OFFICIAL PREVIEW</text>
      </svg>
    `.trim();

    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    setClientBrand({ ...clientBrand, logoUrl: dataUri });
    showToast('Generated stylized luxury logo badge!');
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
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 440,
          height: '100%',
          background: '#0d111a',
          borderLeft: '1px solid var(--border-highlight)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.8)',
          animation: 'slideLeft 0.25s ease-out forwards',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={16} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>Brand & Logo Customizer</h3>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', margin: 0 }}>Instant Live UI & Logo Injection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Form Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18, flexGrow: 1 }}>
          
          <div style={{
            padding: 12,
            borderRadius: 12,
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            fontSize: 12,
            color: '#d8b4fe',
            lineHeight: 1.4
          }}>
            Upload your prospect's logo or enter their details. The active website will update live in real-time!
          </div>

          {/* Business Name */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
              Prospect Company / Brand Name
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Luxury Timepieces"
              value={clientBrand.name}
              onChange={(e) => setClientBrand({ ...clientBrand, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: 13,
                outline: 'none'
              }}
            />
          </div>

          {/* Logo Replacement Section */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
              Website Brand Logo
            </label>

            {/* Active Logo Preview if present */}
            {clientBrand.logoUrl ? (
              <div style={{
                padding: 12,
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 60,
                    height: 38,
                    background: '#090d16',
                    borderRadius: 6,
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <img 
                      src={clientBrand.logoUrl} 
                      alt="Logo preview" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                    />
                  </div>
                  <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
                    Custom Logo Active
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setClientBrand({ ...clientBrand, logoUrl: '' });
                    showToast('Reverted to default template logo');
                  }}
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: 11, color: '#ef4444' }}
                  title="Remove Custom Logo"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              </div>
            ) : null}

            {/* Logo Actions: Upload, Generate Monogram, or URL */}
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
                style={{ justifyContent: 'center', fontSize: 12, padding: '9px 12px' }}
              >
                <Upload size={14} />
                <span>Upload Logo</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateMonogram}
                className="btn-secondary"
                style={{ justifyContent: 'center', fontSize: 12, padding: '9px 12px' }}
                title="Automatically create a branded SVG logo with client initials"
              >
                <Wand2 size={14} color="#a855f7" />
                <span>Auto-Monogram</span>
              </button>
            </div>

            {/* Direct Image URL input */}
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="Or paste direct logo image URL..."
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
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Primary Accent Color */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>
                Primary Brand Accent Color
              </label>
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                {clientBrand.color || activeTemplate?.accentColor}
              </span>
            </div>

            {/* Color Swatches */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {PRESET_COLORS.map((preset) => {
                const isSelected = (clientBrand.color || activeTemplate?.accentColor)?.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setClientBrand({ ...clientBrand, color: preset.hex })}
                    style={{
                      height: 36,
                      borderRadius: 8,
                      background: preset.hex,
                      border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected ? `0 0 12px ${preset.hex}` : 'none'
                    }}
                    title={preset.name}
                  >
                    {isSelected && <Check size={14} color="#000000" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Hex Input */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={clientBrand.color || activeTemplate?.accentColor || '#E6C378'}
                onChange={(e) => setClientBrand({ ...clientBrand, color: e.target.value })}
                style={{
                  width: 40,
                  height: 38,
                  borderRadius: 8,
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
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: 13,
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
              Brand Tagline / Slogan
            </label>
            <input
              type="text"
              placeholder="e.g. Timeless Precision for Modern Leaders"
              value={clientBrand.tagline}
              onChange={(e) => setClientBrand({ ...clientBrand, tagline: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: 13,
                outline: 'none'
              }}
            />
          </div>

          {/* Contact Phone / WhatsApp */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
              WhatsApp / Contact Number
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={clientBrand.phone}
              onChange={(e) => setClientBrand({ ...clientBrand, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: 13,
                outline: 'none'
              }}
            />
          </div>

          {/* Pitch Action Buttons */}
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleCopyPitch}
              className="btn-secondary"
              style={{ justifyContent: 'center', fontSize: 13 }}
            >
              <Send size={15} color="#22c55e" />
              <span>Copy Ready WhatsApp Pitch</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="btn-primary"
              style={{ justifyContent: 'center', fontSize: 13 }}
            >
              <Share2 size={15} />
              <span>Generate Shareable Pitch Link</span>
            </button>

            <button
              onClick={handleReset}
              className="btn-secondary"
              style={{ justifyContent: 'center', fontSize: 12, padding: '7px 12px', color: 'var(--text-dim)' }}
            >
              <RotateCcw size={13} />
              <span>Reset to Template Defaults</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
