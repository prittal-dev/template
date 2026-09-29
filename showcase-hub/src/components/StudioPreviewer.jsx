import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCw, 
  Sliders, 
  Share2, 
  ExternalLink, 
  Maximize2, 
  Sparkles,
  ChevronDown,
  CalendarCheck,
  RefreshCw
} from 'lucide-react';

export default function StudioPreviewer({
  templates,
  activeTemplate,
  onSelectTemplate,
  onBackToCatalog,
  clientBrand,
  onOpenPersonalizer,
  onOpenShareModal,
  onOpenInquiryModal
}) {
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const iframeRef = useRef(null);

  // Send branding updates to iframe via postMessage
  const broadcastBrandToIframe = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'SHOWCASE_UPDATE_BRAND',
          payload: {
            name: clientBrand.name || '',
            tagline: clientBrand.tagline || '',
            primaryColor: clientBrand.color || activeTemplate.accentColor,
            phone: clientBrand.phone || '',
            email: clientBrand.email || '',
            city: clientBrand.city || '',
            logoUrl: clientBrand.logoUrl || ''
          }
        },
        '*'
      );
    }
  };

  // Broadcast when branding changes or template changes
  useEffect(() => {
    const timer = setTimeout(broadcastBrandToIframe, 300);
    return () => clearTimeout(timer);
  }, [clientBrand, activeTemplate]);

  // Listen for handshake from iframe when it finishes loading
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'SHOWCASE_TEMPLATE_READY') {
        broadcastBrandToIframe();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [clientBrand, activeTemplate]);

  // Build the URL with query params for direct fallback
  const getIframeUrl = () => {
    const url = new URL(activeTemplate.previewUrl, window.location.origin);
    if (clientBrand.name) url.searchParams.set('brand', clientBrand.name);
    if (clientBrand.color) url.searchParams.set('color', clientBrand.color.replace('#', ''));
    if (clientBrand.phone) url.searchParams.set('phone', clientBrand.phone);
    if (clientBrand.tagline) url.searchParams.set('tagline', clientBrand.tagline);
    if (clientBrand.logoUrl && !clientBrand.logoUrl.startsWith('data:')) {
      url.searchParams.set('logo', clientBrand.logoUrl);
    }
    return url.toString();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#05070b', overflow: 'hidden' }}>
      
      {/* Studio Top Control Deck */}
      {!isFullscreen && (
        <div 
          className="glass-panel" 
          style={{ 
            height: 64, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0 20px', 
            zIndex: 50,
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0
          }}
        >
          {/* Left: Back & Template Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onBackToCatalog}
              className="btn-secondary"
              style={{ padding: '7px 12px', fontSize: 13 }}
            >
              <ArrowLeft size={16} />
              <span>Catalog</span>
            </button>

            {/* Template Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={activeTemplate.id}
                onChange={(e) => {
                  const found = templates.find(t => t.id === e.target.value);
                  if (found) {
                    onSelectTemplate(found);
                    setIframeKey(Date.now());
                  }
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: '7px 32px 7px 12px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id} style={{ background: '#11141f', color: '#ffffff' }}>
                    {t.title}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={14} 
                color="var(--text-muted)" 
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
              />
            </div>

            <button
              onClick={() => setIframeKey(Date.now())}
              className="btn-secondary"
              title="Reload Frame"
              style={{ padding: '7px 10px' }}
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Center: Device Viewport Switcher */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: 4, 
            borderRadius: 12,
            border: '1px solid var(--border-subtle)',
            gap: 4
          }}>
            <button
              onClick={() => setViewport('desktop')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: viewport === 'desktop' ? '#8b5cf6' : 'transparent',
                color: viewport === 'desktop' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              <Monitor size={15} />
              <span>Desktop</span>
            </button>

            <button
              onClick={() => setViewport('tablet')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: viewport === 'tablet' ? '#8b5cf6' : 'transparent',
                color: viewport === 'tablet' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              <Tablet size={15} />
              <span>Tablet (iPad)</span>
            </button>

            <button
              onClick={() => setViewport('mobile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: viewport === 'mobile' ? '#8b5cf6' : 'transparent',
                color: viewport === 'mobile' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >
              <Smartphone size={15} />
              <span>Mobile (iPhone)</span>
            </button>

            {(viewport === 'mobile' || viewport === 'tablet') && (
              <button
                onClick={() => setIsLandscape(!isLandscape)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  border: 'none',
                  cursor: 'pointer',
                  background: isLandscape ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: 'var(--text-main)'
                }}
                title="Rotate Orientation"
              >
                <RotateCw size={14} />
              </button>
            )}
          </div>

          {/* Right Actions: Personalize, Share, Fullscreen, Order */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            
            <button
              onClick={onOpenPersonalizer}
              className="btn-secondary"
              style={{
                fontSize: 13,
                padding: '7px 12px',
                borderColor: clientBrand.name ? '#10b981' : 'var(--border-subtle)',
                color: clientBrand.name ? '#34d399' : 'var(--text-main)'
              }}
            >
              <Sliders size={14} />
              <span>{clientBrand.name ? clientBrand.name : 'Personalize Brand'}</span>
              <span style={{ 
                width: 7, 
                height: 7, 
                borderRadius: '50%', 
                background: clientBrand.color || activeTemplate.accentColor 
              }} />
            </button>

            <button
              onClick={onOpenShareModal}
              className="btn-secondary"
              title="Share Pitch Link via WhatsApp/Email"
              style={{ padding: '7px 12px', fontSize: 13 }}
            >
              <Share2 size={14} />
              <span>Share Link</span>
            </button>

            <a
              href={getIframeUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              title="Open Standalone in New Tab"
              style={{ padding: '7px 10px' }}
            >
              <ExternalLink size={14} />
            </a>

            <button
              onClick={() => setIsFullscreen(true)}
              className="btn-secondary"
              title="Clean Fullscreen Pitch Mode"
              style={{ padding: '7px 10px' }}
            >
              <Maximize2 size={14} />
            </button>

            <button
              onClick={onOpenInquiryModal}
              className="btn-primary"
              style={{ 
                padding: '7px 14px', 
                fontSize: 13,
                background: `linear-gradient(135deg, ${clientBrand.color || activeTemplate.accentColor}, #8b5cf6)`
              }}
            >
              <CalendarCheck size={14} />
              <span>Order This Site</span>
            </button>
          </div>

        </div>
      )}

      {/* Floating Exit Button in Fullscreen Mode */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 99999,
            background: 'rgba(15, 23, 42, 0.85)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          Exit Fullscreen Presentation (ESC)
        </button>
      )}

      {/* Simulator Canvas / Viewport Container */}
      <div 
        className="device-container"
        style={{
          height: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
          padding: isFullscreen ? 0 : 20
        }}
      >
        {/* DESKTOP VIEWPORT */}
        {viewport === 'desktop' && (
          <div 
            className="device-desktop"
            style={{ 
              borderRadius: isFullscreen ? 0 : 12,
              border: isFullscreen ? 'none' : '1px solid var(--border-subtle)'
            }}
          >
            {/* Desktop Mock Browser Chrome Bar */}
            {!isFullscreen && (
              <div style={{
                height: 38,
                background: '#161b26',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: 14,
                flexShrink: 0
              }}>
                {/* Traffic lights */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                </div>

                {/* Mock Address Bar */}
                <div style={{
                  flex: 1,
                  maxWidth: 600,
                  margin: '0 auto',
                  height: 24,
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 12px',
                  fontSize: 11,
                  color: 'var(--text-dim)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <span style={{ color: '#22c55e', marginRight: 6 }}>https://</span>
                  <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                    {clientBrand.name ? clientBrand.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com' : activeTemplate.id + '.agencydemo.com'}
                  </span>
                </div>
              </div>
            )}

            {/* Embedded Iframe */}
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={getIframeUrl()}
              title={activeTemplate.title}
              onLoad={broadcastBrandToIframe}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#ffffff'
              }}
            />
          </div>
        )}

        {/* TABLET VIEWPORT (iPad) */}
        {viewport === 'tablet' && (
          <div 
            className="device-tablet"
            style={{
              width: isLandscape ? 1024 : 768,
              height: isLandscape ? 768 : 1024
            }}
          >
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={getIframeUrl()}
              title={activeTemplate.title}
              onLoad={broadcastBrandToIframe}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#ffffff'
              }}
            />
          </div>
        )}

        {/* MOBILE VIEWPORT (iPhone) */}
        {viewport === 'mobile' && (
          <div 
            className="device-mobile"
            style={{
              width: isLandscape ? 844 : 390,
              height: isLandscape ? 390 : 844
            }}
          >
            {/* Dynamic Island Notch */}
            {!isLandscape && (
              <div className="mobile-notch">
                <div className="mobile-notch-camera" />
              </div>
            )}

            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={getIframeUrl()}
              title={activeTemplate.title}
              onLoad={broadcastBrandToIframe}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#ffffff'
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
