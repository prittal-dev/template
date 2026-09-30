import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCw, 
  SlidersHorizontal, 
  Share2, 
  ExternalLink, 
  Maximize2, 
  ChevronDown, 
  RefreshCw,
  Lock,
  MessageSquare
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#06070a', overflow: 'hidden' }}>
      
      {/* Studio Top Control Deck */}
      {!isFullscreen && (
        <div 
          style={{ 
            height: 56, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0 18px', 
            zIndex: 50,
            background: 'rgba(9, 10, 15, 0.95)',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Left: Back & Template Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onBackToCatalog}
              className="btn-ghost"
              style={{ padding: '6px 10px', fontSize: 12 }}
            >
              <ArrowLeft size={14} />
              <span>Catalog</span>
            </button>

            <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />

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
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: '6px 28px 6px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id} style={{ background: '#0e1118', color: '#ffffff' }}>
                    {t.title}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={13} 
                color="var(--text-dim)" 
                style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
              />
            </div>

            <button
              onClick={() => setIframeKey(Date.now())}
              className="btn-ghost"
              title="Reload preview iframe"
              style={{ padding: '6px' }}
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Center: Minimalist Segmented Viewport Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="segmented-deck">
              <button
                onClick={() => setViewport('desktop')}
                className={`segmented-item ${viewport === 'desktop' ? 'active' : ''}`}
              >
                <Monitor size={13} />
                <span>Desktop</span>
              </button>

              <button
                onClick={() => setViewport('tablet')}
                className={`segmented-item ${viewport === 'tablet' ? 'active' : ''}`}
              >
                <Tablet size={13} />
                <span>Tablet</span>
              </button>

              <button
                onClick={() => setViewport('mobile')}
                className={`segmented-item ${viewport === 'mobile' ? 'active' : ''}`}
              >
                <Smartphone size={13} />
                <span>Mobile</span>
              </button>
            </div>

            {viewport !== 'desktop' && (
              <button
                onClick={() => setIsLandscape(!isLandscape)}
                className="btn-ghost"
                title="Toggle Portrait / Landscape"
                style={{
                  padding: '6px 10px',
                  fontSize: 11,
                  background: isLandscape ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: isLandscape ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                <RotateCw size={12} />
                <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Personalize Button */}
            <button
              onClick={onOpenPersonalizer}
              className="btn-secondary"
              style={{ 
                fontSize: 12, 
                padding: '6px 12px',
                borderColor: clientBrand.name ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)',
                background: clientBrand.name ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.04)'
              }}
            >
              <SlidersHorizontal size={13} color={clientBrand.name ? '#10b981' : 'currentColor'} />
              <span>{clientBrand.name ? clientBrand.name : 'Personalize'}</span>
              {clientBrand.name && (
                <span 
                  style={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    background: clientBrand.color || '#10b981' 
                  }} 
                />
              )}
            </button>

            {/* Share Link */}
            <button
              onClick={onOpenShareModal}
              className="btn-secondary"
              title="Generate Pitch Link for Client"
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              <Share2 size={13} />
              <span>Share Pitch</span>
            </button>

            <a
              href={getIframeUrl()}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              title="Open full page in new tab"
              style={{ padding: '6px' }}
            >
              <ExternalLink size={14} />
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn-ghost"
              title="Toggle Fullscreen"
              style={{ padding: '6px' }}
            >
              <Maximize2 size={14} />
            </button>

            <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />

            <button
              onClick={onOpenInquiryModal}
              className="btn-primary"
              style={{ fontSize: 12, padding: '6px 14px' }}
            >
              <MessageSquare size={13} />
              <span>Order Site</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Exit Fullscreen Button */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="btn-secondary"
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 9999,
            fontSize: 12,
            padding: '6px 12px',
            background: 'rgba(8, 9, 13, 0.85)',
            backdropFilter: 'blur(10px)'
          }}
        >
          Exit Fullscreen
        </button>
      )}

      {/* Main Viewport Simulator Container */}
      <div className="device-viewport-wrapper">
        
        {/* DESKTOP VIEWPORT */}
        {viewport === 'desktop' && (
          <div className="device-desktop-frame">
            {/* Minimalist Browser Header Bar */}
            {!isFullscreen && (
              <div 
                style={{
                  height: 34,
                  background: '#0a0c12',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px',
                  borderBottom: '1px solid var(--border-subtle)',
                  gap: 12
                }}
              >
                {/* Traffic Light Dots */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)' }} />
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)' }} />
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)' }} />
                </div>

                {/* Minimalist URL Bar */}
                <div 
                  style={{
                    flex: 1,
                    maxWidth: 520,
                    margin: '0 auto',
                    height: 22,
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    fontSize: 11,
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                    border: '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <Lock size={10} color="#10b981" />
                  <span style={{ color: 'var(--text-muted)' }}>https://</span>
                  <span style={{ color: '#ffffff', fontWeight: 500 }}>
                    {clientBrand.name ? clientBrand.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com' : activeTemplate.id + '.atelier.dev'}
                  </span>
                </div>

                <div style={{ width: 36 }} />
              </div>
            )}

            {/* Embedded Live Iframe */}
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

        {/* TABLET VIEWPORT (iPad Pro Titanium) */}
        {viewport === 'tablet' && (
          <div 
            className="device-tablet-frame"
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

        {/* MOBILE VIEWPORT (iPhone 15 Pro Titanium) */}
        {viewport === 'mobile' && (
          <div 
            className="device-mobile-frame"
            style={{
              width: isLandscape ? 844 : 390,
              height: isLandscape ? 390 : 844
            }}
          >
            {/* Dynamic Island */}
            {!isLandscape && (
              <div className="dynamic-island">
                <div className="dynamic-island-sensor" />
                <div className="dynamic-island-lens" />
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
