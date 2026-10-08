import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Palette, Image as ImageIcon, ShoppingBag, 
  FileText, Search, X, Check, Save, Download, RefreshCw, 
  Trash2, Copy, Plus, Upload, Eye, ExternalLink, Sparkles 
} from 'lucide-react';
import { exportStandaloneWebsite } from '../services/exportEngine';

export default function ClientWizardModal({
  isOpen,
  onClose,
  template,
  initialProject = null,
  onSaveProject,
  onOpenPreview,
  showToast
}) {
  if (!isOpen || !template) return null;

  const [activeTab, setActiveTab] = useState('business'); // 'business' | 'branding' | 'media' | 'products' | 'content' | 'seo'
  const [isExporting, setIsExporting] = useState(false);

  // Form State
  const [projectId, setProjectId] = useState(initialProject?.id || null);
  const [projectName, setProjectName] = useState(initialProject?.name || `${template.title} Client Site`);
  const [status, setStatus] = useState(initialProject?.status || 'Draft');

  // Step 1: Business Details
  const [brand, setBrand] = useState({
    name: initialProject?.brand?.name || template.defaultBrand?.name || '',
    tagline: initialProject?.brand?.tagline || template.defaultBrand?.tagline || '',
    description: initialProject?.brand?.description || template.defaultBrand?.description || '',
    industry: initialProject?.brand?.industry || template.industry || '',
    email: initialProject?.brand?.email || template.defaultBrand?.email || '',
    phone: initialProject?.brand?.phone || template.defaultBrand?.phone || '',
    whatsapp: initialProject?.brand?.whatsapp || template.defaultBrand?.whatsapp || template.defaultBrand?.phone || '',
    address: initialProject?.brand?.address || template.defaultBrand?.address || '',
    city: initialProject?.brand?.city || template.defaultBrand?.city || '',
    color: initialProject?.brand?.color || template.accentColor || '#3b82f6',
    logoUrl: initialProject?.brand?.logoUrl || ''
  });

  // Step 3: Media Library
  const [mediaList, setMediaList] = useState(initialProject?.media || [
    { id: '1', title: 'Logo', url: brand.logoUrl || '', category: 'branding' }
  ]);

  // Step 4: Products
  const [products, setProducts] = useState(initialProject?.products || [
    {
      id: 'prod_1',
      name: `${template.shortName} Signature Item 01`,
      category: 'General',
      price: '₹2,499',
      description: 'Engineered high-grade specification unit designed for enterprise and retail requirements.',
      chips: ['Popular', 'In Stock']
    }
  ]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Step 5: Content Sections
  const [content, setContent] = useState(initialProject?.content || {
    heroHeading: template.contentSchema?.sections?.[0]?.fields?.[0]?.default || template.tagline || '',
    heroSubheading: template.contentSchema?.sections?.[0]?.fields?.[1]?.default || template.description || '',
    aboutTitle: 'About Our Organization',
    aboutContent: brand.description || template.description || ''
  });

  // Step 6: SEO
  const [seo, setSeo] = useState(initialProject?.seo || {
    title: `${brand.name || template.title} — Official Website`,
    description: brand.description || template.description || '',
    keywords: `${template.industry}, ${template.shortName}, services, manufacturer`
  });

  // Broadcast live changes to any open preview iframe with smooth debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const payload = {
        name: brand.name,
        tagline: brand.tagline,
        primaryColor: brand.color,
        phone: brand.phone,
        whatsapp: brand.whatsapp,
        email: brand.email,
        logoUrl: brand.logoUrl
      };

      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(f => {
        try {
          f.contentWindow?.postMessage({ type: 'SHOWCASE_UPDATE_BRAND', payload, tier: template.tier }, '*');
        } catch (e) {}
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [brand, template]);

  // Handle local image file upload
  const handleFileUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast?.('File is too large (max 8MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      if (field === 'logo') {
        setBrand(prev => ({ ...prev, logoUrl: base64 }));
        showToast?.('Logo updated!');
      } else {
        const newMedia = {
          id: `media_${Date.now()}`,
          title: file.name,
          url: base64,
          category: 'gallery'
        };
        setMediaList(prev => [newMedia, ...prev]);
        showToast?.('Image uploaded to media manager!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Project
  const handleSave = () => {
    const projectRecord = {
      id: projectId || `proj_${Date.now()}`,
      name: projectName,
      clientName: brand.name || projectName,
      templateId: template.id,
      tier: template.tier,
      status: status,
      brand,
      products,
      content,
      seo,
      media: mediaList,
      updatedAt: new Date().toISOString()
    };

    onSaveProject(projectRecord);
    setProjectId(projectRecord.id);
    showToast?.(`Project "${projectName}" saved successfully!`);
  };

  // Export Standalone Website
  const handleExport = async () => {
    setIsExporting(true);
    showToast?.('Preparing standalone React project package...');
    try {
      const projectRecord = {
        id: projectId || `proj_${Date.now()}`,
        name: projectName,
        clientName: brand.name,
        templateId: template.id,
        tier: template.tier,
        brand,
        products,
        content,
        seo
      };
      await exportStandaloneWebsite(projectRecord, template);
      setStatus('Exported');
      handleSave();
      showToast?.('Standalone React project exported and downloaded as .ZIP!');
    } catch (err) {
      console.error('Export error:', err);
      showToast?.('Export failed: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const getTierColor = (tier) => {
    if (tier === 'premium') return '#f43f5e';
    if (tier === 'standard') return '#eab308';
    return '#3b82f6';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(16px)',
      padding: '24px 16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 1040,
        height: '92vh',
        background: 'var(--bg-surface-elevated, #0f172a)',
        border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden'
      }}>
        
        {/* Wizard Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.5)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Client Website Builder Wizard
              </h2>
              <span style={{
                padding: '3px 8px',
                borderRadius: 9999,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.05em',
                background: `${getTierColor(template.tier)}20`,
                color: getTierColor(template.tier),
                border: `1px solid ${getTierColor(template.tier)}40`
              }}>
                {template.tier.toUpperCase()} TIER
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
              Customizing <strong style={{ color: '#e2e8f0' }}>{template.title}</strong> for client delivery
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => onOpenPreview?.(template, brand)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#e2e8f0',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Eye size={14} /> Live Preview
            </button>
            <button
              onClick={handleSave}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Save size={14} /> Save Draft
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 8,
                background: `linear-gradient(135deg, ${brand.color} 0%, #3b82f6 100%)`,
                border: 'none',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
              }}
            >
              <Download size={14} /> {isExporting ? 'Packaging...' : 'Export ZIP'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: 6,
                display: 'flex'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Wizard Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 15, 30, 0.4)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'business', label: '1. Business Details', icon: Building2 },
            { id: 'branding', label: '2. Branding & Colors', icon: Palette },
            { id: 'media', label: '3. Media Manager', icon: ImageIcon },
            ...(template.hasProducts ? [{ id: 'products', label: '4. Products Manager', icon: ShoppingBag }] : []),
            { id: 'content', label: '5. Page Content', icon: FileText },
            { id: 'seo', label: '6. SEO & Meta', icon: Search }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${brand.color}` : '2px solid transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} color={isActive ? brand.color : '#64748b'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Wizard Content Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 32px'
        }}>
          
          {/* STEP 1: BUSINESS DETAILS */}
          {activeTab === 'business' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Client Identity</h3>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Client / Project Title</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 13
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Official Business / Brand Name</label>
                  <input
                    type="text"
                    value={brand.name}
                    onChange={e => setBrand({ ...brand, name: e.target.value })}
                    placeholder="e.g. Apex Conductors Ltd"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 13
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Company Tagline</label>
                  <input
                    type="text"
                    value={brand.tagline}
                    onChange={e => setBrand({ ...brand, tagline: e.target.value })}
                    placeholder="e.g. Conductors for Critical Infrastructure"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 13
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>About Us / Company Overview</label>
                  <textarea
                    rows={4}
                    value={brand.description}
                    onChange={e => setBrand({ ...brand, description: e.target.value })}
                    placeholder="Comprehensive overview of company history, manufacturing standards..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 13,
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Contact & Location Channels</h3>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Phone Number</label>
                  <input
                    type="text"
                    value={brand.phone}
                    onChange={e => setBrand({ ...brand, phone: e.target.value })}
                    placeholder="+91 98100 12345"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 13
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>WhatsApp Number (for Instant Funnel)</label>
                  <input
                    type="text"
                    value={brand.whatsapp}
                    onChange={e => setBrand({ ...brand, whatsapp: e.target.value })}
                    placeholder="+91 98100 12345"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 13
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Email Address</label>
                  <input
                    type="email"
                    value={brand.email}
                    onChange={e => setBrand({ ...brand, email: e.target.value })}
                    placeholder="sales@company.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 13
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Physical Plant / Registered Address</label>
                  <textarea
                    rows={3}
                    value={brand.address}
                    onChange={e => setBrand({ ...brand, address: e.target.value })}
                    placeholder="Plot No. 42, Industrial Area, Sector 5..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 13
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BRANDING & COLORS */}
          {activeTab === 'branding' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Brand Color Palette</h3>
                
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Primary Brand Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="color"
                      value={brand.color}
                      onChange={e => setBrand({ ...brand, color: e.target.value })}
                      style={{
                        width: 48,
                        height: 48,
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: 'none'
                      }}
                    />
                    <input
                      type="text"
                      value={brand.color}
                      onChange={e => setBrand({ ...brand, color: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 8,
                        color: '#ffffff',
                        fontSize: 13
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Preset Color Schemes</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['#eab308', '#f97316', '#E6C378', '#f43f5e', '#3b82f6', '#10b981', '#8b5cf6', '#06b6d4'].map(c => (
                      <button
                        key={c}
                        onClick={() => setBrand({ ...brand, color: c })}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: c,
                          border: brand.color === c ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{
                  padding: 18,
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#cbd5e1' }}>Live Theme Variable Binding</h4>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Modifying this color dynamically injects <code style={{ color: brand.color }}>--primary</code>, <code style={{ color: brand.color }}>--accent</code>, and CTAs across the template without altering original layout physics.
                  </p>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Company Logo</h3>

                <div style={{
                  border: '2px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: 16,
                  padding: 24,
                  textAlign: 'center',
                  marginBottom: 16,
                  background: 'rgba(255, 255, 255, 0.01)'
                }}>
                  {brand.logoUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <img src={brand.logoUrl} alt="Preview" style={{ maxHeight: 70, maxWidth: '100%', objectFit: 'contain' }} />
                      <button
                        onClick={() => setBrand({ ...brand, logoUrl: '' })}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: 6,
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: 'none',
                          fontSize: 11,
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={12} /> Remove Logo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={32} style={{ color: '#64748b', marginBottom: 10 }} />
                      <p style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 6 }}>Upload high-resolution client logo</p>
                      <span style={{ fontSize: 11, color: '#64748b' }}>PNG, WebP, SVG or JPG (Transparent recommended)</span>
                      <div style={{ marginTop: 14 }}>
                        <label style={{
                          display: 'inline-block',
                          padding: '8px 16px',
                          borderRadius: 8,
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#ffffff',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}>
                          Choose File
                          <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'logo')} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Or enter direct Logo Image URL</label>
                <input
                  type="text"
                  value={brand.logoUrl}
                  onChange={e => setBrand({ ...brand, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    color: '#ffffff',
                    fontSize: 13
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: MEDIA MANAGER */}
          {activeTab === 'media' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#f8fafc' }}>Local Media Asset Manager</h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Images uploaded here are stored per client project without mutating original template source assets.</p>
                </div>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 8,
                  background: brand.color,
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                  <Plus size={16} /> Upload Media
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'media')} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 16
              }}>
                {mediaList.map((m, idx) => (
                  <div key={m.id || idx} style={{
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}>
                    <div style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 8,
                      background: '#070a13',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {m.url ? (
                        <img src={m.url} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <ImageIcon size={28} color="#475569" />
                      )}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.title || `Asset ${idx + 1}`}
                    </span>
                    <button
                      onClick={() => setMediaList(prev => prev.filter((_, i) => i !== idx))}
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        borderRadius: 6,
                        color: '#f87171',
                        fontSize: 11,
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#f8fafc' }}>Dynamic Product Catalog</h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                    Automatically rendered using {template.title}'s native card layout.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newProd = {
                      id: `prod_${Date.now()}`,
                      name: 'New Catalog Product',
                      category: 'Industrial',
                      price: '₹1,999',
                      description: 'Custom engineered product specification with certified quality assurance.',
                      chips: ['High-Grade']
                    };
                    setProducts([...products, newProd]);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: brand.color,
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {products.map((prod, idx) => (
                  <div key={prod.id || idx} style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 140px 140px auto',
                    gap: 16,
                    alignItems: 'center'
                  }}>
                    <div>
                      <input
                        type="text"
                        value={prod.name}
                        onChange={e => {
                          const updated = [...products];
                          updated[idx].name = e.target.value;
                          setProducts(updated);
                        }}
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: 14,
                          marginBottom: 4
                        }}
                      />
                      <input
                        type="text"
                        value={prod.description || ''}
                        onChange={e => {
                          const updated = [...products];
                          updated[idx].description = e.target.value;
                          setProducts(updated);
                        }}
                        placeholder="Description..."
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          fontSize: 12
                        }}
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={prod.category || ''}
                        onChange={e => {
                          const updated = [...products];
                          updated[idx].category = e.target.value;
                          setProducts(updated);
                        }}
                        placeholder="Category"
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 6,
                          color: '#ffffff',
                          fontSize: 12
                        }}
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={prod.price || ''}
                        onChange={e => {
                          const updated = [...products];
                          updated[idx].price = e.target.value;
                          setProducts(updated);
                        }}
                        placeholder="Price / RFQ"
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 6,
                          color: brand.color,
                          fontWeight: 700,
                          fontSize: 12
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => {
                          const copy = { ...JSON.parse(JSON.stringify(prod)), id: `prod_${Date.now()}`, name: `${prod.name} (Copy)` };
                          setProducts([...products, copy]);
                        }}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6 }}
                        title="Duplicate Product"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => setProducts(products.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 6 }}
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: PAGE CONTENT */}
          {activeTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Hero Section Messaging</h3>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Hero Headline</label>
                  <input
                    type="text"
                    value={content.heroHeading}
                    onChange={e => setContent({ ...content, heroHeading: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 13
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Hero Subtitle & Value Proposition</label>
                  <textarea
                    rows={3}
                    value={content.heroSubheading}
                    onChange={e => setContent({ ...content, heroSubheading: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 13
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: SEO SETTINGS */}
          {activeTab === 'seo' && (
            <div style={{ maxWidth: 640 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Search Engine Optimization</h3>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Website Meta Title Tag</label>
                <input
                  type="text"
                  value={seo.title}
                  onChange={e => setSeo({ ...seo, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    color: '#ffffff',
                    fontSize: 13
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Meta Description Tag</label>
                <textarea
                  rows={3}
                  value={seo.description}
                  onChange={e => setSeo({ ...seo, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 8,
                    color: '#ffffff',
                    fontSize: 13
                  }}
                />
              </div>

              {/* SERP Snippet Preview */}
              <div style={{
                marginTop: 24,
                padding: 16,
                borderRadius: 12,
                background: '#181f30',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>Google Search Snippet Preview</span>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>https://www.{brand.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}.com</div>
                  <div style={{ fontSize: 16, color: '#60a5fa', fontWeight: 600, marginBottom: 4 }}>{seo.title}</div>
                  <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.4 }}>{seo.description}</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>Status:</span>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: 12
              }}
            >
              <option value="Draft">Draft</option>
              <option value="Ready">Ready for Client</option>
              <option value="Exported">Exported</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '8px 24px',
                borderRadius: 8,
                background: brand.color,
                border: 'none',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Save Project
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
