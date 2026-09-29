import React, { useState } from 'react';
import { X, Copy, Check, Share2, Smartphone, Send } from 'lucide-react';

export default function SharePitchModal({
  isOpen,
  onClose,
  activeTemplate,
  clientBrand,
  showToast
}) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Build the personalized pitch URL
  const baseUrl = window.location.origin;
  const brandName = clientBrand.name || '';
  const colorHex = (clientBrand.color || activeTemplate?.accentColor || '').replace('#', '');
  
  const pitchUrl = new URL(baseUrl);
  pitchUrl.searchParams.set('template', activeTemplate?.id || 'plazaclock');
  if (brandName) pitchUrl.searchParams.set('brand', brandName);
  if (colorHex) pitchUrl.searchParams.set('color', colorHex);
  if (clientBrand.phone) pitchUrl.searchParams.set('phone', clientBrand.phone);
  if (clientBrand.tagline) pitchUrl.searchParams.set('tagline', clientBrand.tagline);

  const fullShareUrl = pitchUrl.toString();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShareUrl);
    setCopied(true);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi! We’ve prepared a customized live preview of your proposed website for ${brandName || 'your business'}:\n\n${fullShareUrl}\n\nCheck it out and let us know what you think!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 500,
          borderRadius: 24,
          background: '#0e121d',
          border: '1px solid var(--border-highlight)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)',
          padding: 28,
          animation: 'slideDown 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>Share Client Pitch Link</h3>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: 0 }}>Pre-configured with brand parameters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Brand Summary Pill */}
        <div style={{
          padding: '12px 16px',
          borderRadius: 14,
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: clientBrand.color || activeTemplate?.accentColor || '#E6C378',
            boxShadow: `0 0 10px ${clientBrand.color || activeTemplate?.accentColor || '#E6C378'}`
          }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
              {brandName || 'Default Template Demo'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Template: {activeTemplate?.title}
            </div>
          </div>
        </div>

        {/* Link Input Box */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
            Direct Personalized Link
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              readOnly
              value={fullShareUrl}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                color: '#93c5fd',
                fontSize: 12,
                fontFamily: 'monospace'
              }}
            />
            <button
              onClick={handleCopy}
              className="btn-primary"
              style={{ padding: '0 16px', fontSize: 13 }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Pitch Share */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handleSendWhatsApp}
            className="btn-secondary"
            style={{
              justifyContent: 'center',
              padding: '12px',
              fontSize: 14,
              background: 'rgba(34, 197, 94, 0.15)',
              borderColor: 'rgba(34, 197, 94, 0.3)',
              color: '#4ade80'
            }}
          >
            <Send size={16} />
            <span>Open & Send via WhatsApp</span>
          </button>

          <p style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', margin: 0 }}>
            When the prospect taps this link on their mobile, the website automatically displays their name and brand colors!
          </p>
        </div>

      </div>
    </div>
  );
}
