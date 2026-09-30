import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, ExternalLink } from 'lucide-react';

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
    showToast('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi! We’ve prepared a customized live preview of your proposed website for ${brandName || 'your business'}:\n\n${fullShareUrl}\n\nTake a look on your phone or desktop and let me know your thoughts!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{ padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge-mono" style={{ fontSize: 10 }}>LINK GENERATOR</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
              Shareable Pitch Link
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Brand Summary Pill */}
        <div style={{
          padding: '10px 14px',
          borderRadius: 8,
          background: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: clientBrand.color || activeTemplate?.accentColor || 'var(--text-main)'
            }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>
              {brandName || 'Default Preview'}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {activeTemplate?.title}
          </span>
        </div>

        {/* Link Input Box */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', marginBottom: 6 }}>
            Direct Pitch URL (Encodes Brand Parameters)
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              readOnly
              value={fullShareUrl}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
            />
            <button
              onClick={handleCopy}
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: 12 }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Dispatch Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={handleSendWhatsApp}
            className="btn-primary"
            style={{ 
              width: '100%', 
              fontSize: 13, 
              padding: '10px'
            }}
          >
            <Send size={14} />
            <span>Open & Send via WhatsApp</span>
          </button>

          <p style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', margin: '4px 0 0 0' }}>
            When the client taps this link, the demo site loads with their company name, accent colors, and phone numbers already integrated.
          </p>
        </div>

      </div>
    </div>
  );
}
