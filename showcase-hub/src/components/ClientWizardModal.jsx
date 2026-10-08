import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, Palette, Image as ImageIcon, ShoppingBag, 
  FileText, Search, X, Check, Save, Download, RefreshCw, 
  Trash2, Copy, Plus, Upload, Eye, ExternalLink, Sparkles, Star,
  Sun, Moon, Layers, ShieldCheck, ChevronRight, Link as LinkIcon
} from 'lucide-react';
import { exportStandaloneWebsite } from '../services/exportEngine';
import { optimizeImageFile, optimizeMultipleFiles } from '../utils/imageOptimizer';

const PRESET_PALETTES = [
  { name: 'Industrial Gold', color: '#eab308', secondary: '#1e293b', accent: '#ca8a04' },
  { name: 'Sapphire Enterprise', color: '#3b82f6', secondary: '#0f172a', accent: '#2563eb' },
  { name: 'Emerald Precision', color: '#10b981', secondary: '#064e3b', accent: '#059669' },
  { name: 'Engineering Amber', color: '#f97316', secondary: '#1c1917', accent: '#ea580c' },
  { name: 'Amethyst Luxury', color: '#8b5cf6', secondary: '#2e1065', accent: '#7c3aed' },
  { name: 'Ruby Corporate', color: '#f43f5e', secondary: '#4c0519', accent: '#e11d48' },
  { name: 'Cyber Cyan', color: '#06b6d4', secondary: '#083344', accent: '#0891b2' },
  { name: 'Graphite Titanium', color: '#64748b', secondary: '#0f172a', accent: '#475569' }
];

export default function ClientWizardModal({
  isOpen,
  onClose,
  template,
  initialProject = null,
  initialBrand = null,
  initialTab = 'business',
  onSaveProject,
  onOpenPreview,
  onUpdateBrand,
  showToast
}) {
  if (!isOpen || !template) return null;

  const [activeTab, setActiveTab] = useState(initialTab || 'business'); // 'business' | 'branding' | 'media' | 'products' | 'content' | 'seo'
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State: Project Meta
  const [projectId, setProjectId] = useState(initialProject?.id || null);
  const [projectName, setProjectName] = useState(initialProject?.name || `${template.title} Client Site`);
  const [status, setStatus] = useState(initialProject?.status || 'Draft');

  // Step 1 & 2: Brand & Theme Details
  const [brand, setBrand] = useState({
    name: initialProject?.brand?.name || initialBrand?.name || template.defaultBrand?.name || '',
    tagline: initialProject?.brand?.tagline || initialBrand?.tagline || template.defaultBrand?.tagline || '',
    description: initialProject?.brand?.description || initialBrand?.description || template.defaultBrand?.description || '',
    industry: initialProject?.brand?.industry || initialBrand?.industry || template.industry || '',
    email: initialProject?.brand?.email || initialBrand?.email || template.defaultBrand?.email || '',
    phone: initialProject?.brand?.phone || initialBrand?.phone || template.defaultBrand?.phone || '',
    whatsapp: initialProject?.brand?.whatsapp || initialBrand?.whatsapp || initialBrand?.phone || template.defaultBrand?.whatsapp || '',
    address: initialProject?.brand?.address || initialBrand?.address || template.defaultBrand?.address || '',
    city: initialProject?.brand?.city || initialBrand?.city || template.defaultBrand?.city || '',
    themeMode: initialProject?.brand?.themeMode || initialBrand?.themeMode || 'dark', // 'dark' | 'light'
    color: initialProject?.brand?.color || initialBrand?.color || template.accentColor || '#3b82f6',
    secondaryColor: initialProject?.brand?.secondaryColor || initialBrand?.secondaryColor || '#1e293b',
    accentColor: initialProject?.brand?.accentColor || initialBrand?.accentColor || template.accentColor || '#eab308',
    bgColor: initialProject?.brand?.bgColor || initialBrand?.bgColor || (template.heroColor || '#090d16'),
    logoUrl: initialProject?.brand?.logoUrl || initialBrand?.logoUrl || ''
  });

  // Keep state synchronized when opening or switching tabs
  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      if (initialProject?.brand) {
        setBrand(prev => ({ ...prev, ...initialProject.brand }));
      } else if (initialBrand && (initialBrand.name || initialBrand.color)) {
        setBrand(prev => ({
          ...prev,
          name: initialBrand.name || prev.name,
          tagline: initialBrand.tagline || prev.tagline,
          color: initialBrand.color || prev.color,
          phone: initialBrand.phone || prev.phone,
          whatsapp: initialBrand.whatsapp || initialBrand.phone || prev.whatsapp,
          email: initialBrand.email || prev.email,
          city: initialBrand.city || prev.city,
          logoUrl: initialBrand.logoUrl || prev.logoUrl
        }));
      }
    }
  }, [isOpen, initialTab, initialProject, initialBrand]);

  // Step 3: Media Library
  const [mediaList, setMediaList] = useState(initialProject?.media || [
    { id: '1', title: 'Brand Logo', url: brand.logoUrl || '', category: 'branding' }
  ]);

  // Step 4: Products with MULTIPLE IMAGES GALLERY support
  const [products, setProducts] = useState(initialProject?.products || [
    {
      id: 'prod_1',
      name: `${template.shortName} Signature Item 01`,
      category: 'General',
      price: '₹2,499',
      description: 'Engineered high-grade specification unit designed for enterprise and retail requirements.',
      chips: ['Popular', 'In Stock'],
      images: [], // MULTIPLE PRODUCT IMAGES!
      image: '',
      isBestSeller: true
    }
  ]);

  // URL Input helper for each product
  const [urlInputs, setUrlInputs] = useState({});

  // Step 5: Content Sections
  const [content, setContent] = useState(initialProject?.content || {
    heroHeading: template.contentSchema?.sections?.[0]?.fields?.[0]?.default || template.tagline || '',
    heroSubheading: template.contentSchema?.sections?.[0]?.fields?.[1]?.default || template.description || '',
    ctaText: 'Explore Catalog',
    ctaLink: '#products',
    ctaSecondaryText: 'Contact Concierge',
    ctaSecondaryLink: '#contact',
    aboutTitle: `About Our Organization`,
    aboutContent: brand.description || template.description || '',
    foundedYear: '1989',
    missionStatement: 'Committed to uncompromising engineering precision, sustainable manufacturing, and client trust.',
    stats: [
      { label: 'Years in Business', value: '35+' },
      { label: 'Happy Clients', value: '650K+' },
      { label: 'Certified Quality', value: 'ISO 9001' }
    ],
    services: [
      { title: 'Custom Manufacturing', description: 'Bespoke engineering tailored to exacting technical parameters.' },
      { title: 'Global Logistics', description: 'Direct insured distribution to over 40 global markets and ports.' }
    ],
    copyrightText: `© ${new Date().getFullYear()} ${brand.name || template.title}. All Rights Reserved.`
  });

  // Step 6: SEO
  const [seo, setSeo] = useState(initialProject?.seo || {
    title: `${brand.name || template.title} — Official Website`,
    description: brand.description || template.description || '',
    keywords: `${template.industry}, ${template.shortName}, services, manufacturer`
  });

  // Fast on-demand broadcast to preview iframe (only when clicked, never blocking keystrokes)
  const broadcastPreviewUpdate = () => {
    const payload = {
      name: brand.name,
      tagline: brand.tagline,
      primaryColor: brand.color,
      secondaryColor: brand.secondaryColor,
      accentColor: brand.accentColor,
      themeMode: brand.themeMode,
      phone: brand.phone,
      whatsapp: brand.whatsapp,
      email: brand.email,
      address: brand.address,
      logoUrl: brand.logoUrl,
      heroHeading: content.heroHeading,
      heroSubheading: content.heroSubheading,
      products: products || []
    };

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(f => {
      try {
        f.contentWindow?.postMessage({ type: 'SHOWCASE_UPDATE_BRAND', payload, tier: template.tier }, '*');
      } catch (e) {}
    });
  };

  // Handle Logo Upload (Single Image with canvas WebP compression)
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast?.('Optimizing logo image...');
      const optimizedUrl = await optimizeImageFile(file, 600, 300, 0.9);
      setBrand(prev => ({ ...prev, logoUrl: optimizedUrl }));
      showToast?.('Logo updated successfully!');
    } catch (err) {
      showToast?.('Failed to optimize logo: ' + err.message);
    }
  };

  // Generate Smart Monogram Logo
  const handleGenerateMonogram = () => {
    const name = brand.name || template.title || 'Brand';
    const words = name.trim().split(' ').filter(Boolean);
    const initials = words.slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'CO';
    const accent = brand.color || '#3b82f6';
    
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 64" width="280" height="64">
        <rect x="4" y="8" width="48" height="48" rx="12" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="2"/>
        <text x="28" y="39" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="22" fill="${accent}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
        <text x="64" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="18" fill="#ffffff" letter-spacing="0.5">${name}</text>
        <text x="64" y="49" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="9" fill="${accent}" letter-spacing="2">OFFICIAL PREVIEW</text>
      </svg>
    `.trim();

    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    setBrand(prev => ({ ...prev, logoUrl: dataUri }));
    showToast?.('Generated custom brand monogram badge!');
  };

  // Handle Multiple Media Upload in Media Manager (Step 3)
  const handleBatchMediaUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    showToast?.(`Optimizing ${files.length} images...`);
    try {
      const optimizedResults = await optimizeMultipleFiles(files, 800, 800);
      const newItems = optimizedResults.map((item, idx) => ({
        id: `media_${Date.now()}_${idx}`,
        title: item.fileName,
        url: item.url,
        category: 'gallery'
      }));
      setMediaList(prev => [...newItems, ...prev]);
      showToast?.(`Uploaded and optimized ${newItems.length} images!`);
    } catch (err) {
      showToast?.('Batch upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Multiple Product Images Upload for a Specific Product (Step 4)
  const handleProductMultipleImagesUpload = async (e, prodIdx) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    showToast?.(`Optimizing ${files.length} product photos...`);
    try {
      const optimizedResults = await optimizeMultipleFiles(files, 800, 800);
      const newImageUrls = optimizedResults.map(r => r.url);
      
      setProducts(prevProducts => {
        const updated = [...prevProducts];
        const targetProd = { ...updated[prodIdx] };
        const currentImages = targetProd.images || [];
        targetProd.images = [...currentImages, ...newImageUrls];
        
        // If primary image is empty, set first image as primary
        if (!targetProd.image && targetProd.images.length > 0) {
          targetProd.image = targetProd.images[0];
        }

        updated[prodIdx] = targetProd;
        return updated;
      });

      showToast?.(`Added ${newImageUrls.length} photos to product gallery!`);
    } catch (err) {
      showToast?.('Failed to process product images: ' + err.message);
    }
  };

  // Add Product Photo via URL
  const handleAddProductImageUrl = (prodIdx) => {
    const url = (urlInputs[prodIdx] || '').trim();
    if (!url) return;

    setProducts(prevProducts => {
      const updated = [...prevProducts];
      const targetProd = { ...updated[prodIdx] };
      const currentImages = targetProd.images || [];
      targetProd.images = [...currentImages, url];

      if (!targetProd.image) {
        targetProd.image = url;
      }

      updated[prodIdx] = targetProd;
      return updated;
    });

    setUrlInputs(prev => ({ ...prev, [prodIdx]: '' }));
    showToast?.('Added photo URL to product gallery!');
  };

  // Set Primary Cover Image for a Product
  const handleSetPrimaryProductImage = (prodIdx, imgUrl) => {
    setProducts(prevProducts => {
      const updated = [...prevProducts];
      updated[prodIdx] = { ...updated[prodIdx], image: imgUrl };
      return updated;
    });
    showToast?.('Set as primary cover photo!');
  };

  // Delete an Image from a Product's Gallery
  const handleDeleteProductImage = (prodIdx, imgIdx) => {
    setProducts(prevProducts => {
      const updated = [...prevProducts];
      const targetProd = { ...updated[prodIdx] };
      const imgs = [...(targetProd.images || [])];
      const removedUrl = imgs[imgIdx];
      imgs.splice(imgIdx, 1);
      targetProd.images = imgs;

      if (targetProd.image === removedUrl) {
        targetProd.image = imgs[0] || '';
      }

      updated[prodIdx] = targetProd;
      return updated;
    });
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
    broadcastPreviewUpdate();
    onUpdateBrand?.(brand);
    showToast?.(`Project "${projectName}" saved successfully!`);
  };

  // Export Standalone Website
  const handleExport = async () => {
    setIsExporting(true);
    showToast?.('Packaging standalone React project with all media & configs...');
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
      background: 'rgba(5, 8, 16, 0.88)',
      backdropFilter: 'blur(16px)',
      padding: '20px 16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 1120,
        height: '92vh',
        background: 'var(--bg-surface-elevated, #0f172a)',
        border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
        overflow: 'hidden'
      }}>
        
        {/* Wizard Header Bar */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.7)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => {
                broadcastPreviewUpdate();
                onUpdateBrand?.(brand);
                onOpenPreview?.(template, brand, products, content);
              }}
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
          background: 'rgba(10, 15, 30, 0.5)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'business', label: '1. Business Identity', icon: Building2 },
            { id: 'branding', label: '2. Theme & Colors', icon: Palette },
            { id: 'media', label: '3. Media Library', icon: ImageIcon },
            ...(template.hasProducts !== false ? [{ id: 'products', label: '4. Products (Multi-Image)', icon: ShoppingBag }] : []),
            { id: 'content', label: '5. Page Text & Copy', icon: FileText },
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
                  padding: '13px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${brand.color}` : '2px solid transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
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
          padding: '24px 28px'
        }}>
          
          {/* STEP 1: BUSINESS IDENTITY */}
          {activeTab === 'business' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Client Identity</h3>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Internal Project Title</label>
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Official Client / Business Name</label>
                  <input
                    type="text"
                    value={brand.name}
                    onChange={e => setBrand(prev => ({ ...prev, name: e.target.value }))}
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Company Tagline / Slogan</label>
                  <input
                    type="text"
                    value={brand.tagline}
                    onChange={e => setBrand(prev => ({ ...prev, tagline: e.target.value }))}
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Company Overview Narrative</label>
                  <textarea
                    rows={4}
                    value={brand.description}
                    onChange={e => setBrand(prev => ({ ...prev, description: e.target.value }))}
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
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Contact & Routing Information</h3>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Phone Number</label>
                  <input
                    type="text"
                    value={brand.phone}
                    onChange={e => setBrand(prev => ({ ...prev, phone: e.target.value }))}
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>WhatsApp Number (Instant Funnel)</label>
                  <input
                    type="text"
                    value={brand.whatsapp}
                    onChange={e => setBrand(prev => ({ ...prev, whatsapp: e.target.value }))}
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Official Email Address</label>
                  <input
                    type="email"
                    value={brand.email}
                    onChange={e => setBrand(prev => ({ ...prev, email: e.target.value }))}
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Plant / Corporate Address</label>
                  <textarea
                    rows={3}
                    value={brand.address}
                    onChange={e => setBrand(prev => ({ ...prev, address: e.target.value }))}
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

          {/* STEP 2: THEME & BRANDING */}
          {activeTab === 'branding' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Theme Atmosphere & Color System</h3>
                
                {/* Theme Mode Toggle (Dark vs Light) */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Theme Atmosphere</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setBrand(prev => ({ ...prev, themeMode: 'dark', bgColor: '#090d16' }))}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: brand.themeMode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                        border: brand.themeMode === 'dark' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer'
                      }}
                    >
                      <Moon size={16} /> Dark Mode (High Tech)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrand(prev => ({ ...prev, themeMode: 'light', bgColor: '#ffffff' }))}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: brand.themeMode === 'light' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                        border: brand.themeMode === 'light' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer'
                      }}
                    >
                      <Sun size={16} /> Clean Light Mode
                    </button>
                  </div>
                </div>

                {/* Primary Brand Color */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Primary Brand Accent Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="color"
                      value={brand.color}
                      onChange={e => setBrand(prev => ({ ...prev, color: e.target.value }))}
                      style={{
                        width: 46,
                        height: 46,
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: 'none'
                      }}
                    />
                    <input
                      type="text"
                      value={brand.color}
                      onChange={e => setBrand(prev => ({ ...prev, color: e.target.value }))}
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

                {/* Preset Palettes */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Curated Agency Palettes</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {PRESET_PALETTES.map(p => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setBrand(prev => ({ 
                          ...prev, 
                          color: p.color, 
                          secondaryColor: p.secondary, 
                          accentColor: p.accent 
                        }))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 10px',
                          borderRadius: 8,
                          background: brand.color === p.color ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                          border: brand.color === p.color ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.08)',
                          color: '#ffffff',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ width: 14, height: 14, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Contrast Preview Box */}
                <div style={{
                  padding: 18,
                  borderRadius: 14,
                  background: brand.themeMode === 'light' ? '#ffffff' : '#080d1a',
                  border: `2px solid ${brand.color}`,
                  color: brand.themeMode === 'light' ? '#0f172a' : '#ffffff',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: brand.color }}>
                      Live Theme & Contrast Test
                    </span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 9999, background: brand.color, color: '#ffffff', fontWeight: 700 }}>
                      {brand.themeMode.toUpperCase()} MODE
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800 }}>{brand.name || 'Brand Heading Preview'}</h4>
                  <p style={{ margin: '0 0 14px', fontSize: 12, color: brand.themeMode === 'light' ? '#475569' : '#94a3b8' }}>
                    Buttons, borders, accents, and surfaces dynamically update across all pages.
                  </p>
                  <button
                    type="button"
                    style={{
                      padding: '8px 18px',
                      borderRadius: 8,
                      background: brand.color,
                      border: 'none',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 700
                    }}
                  >
                    Action Button
                  </button>
                </div>
              </div>

              {/* Logo & Visual Identity */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#f8fafc' }}>Logo & Brand Assets</h3>

                <div style={{
                  padding: 20,
                  borderRadius: 14,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                }}>
                  <div style={{
                    width: '100%',
                    height: 110,
                    borderRadius: 10,
                    background: brand.themeMode === 'light' ? '#f1f5f9' : '#070a13',
                    border: '1px dashed rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: 12
                  }}>
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#64748b' }}>
                        <ImageIcon size={28} style={{ margin: '0 auto 6px', display: 'block' }} />
                        <span style={{ fontSize: 12 }}>No custom logo uploaded yet</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <label style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      <Upload size={14} /> Upload Custom Logo
                      <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                    </label>

                    <button
                      type="button"
                      onClick={handleGenerateMonogram}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#60a5fa',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Sparkles size={14} /> Generate Monogram
                    </button>

                    {brand.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setBrand(prev => ({ ...prev, logoUrl: '' }))}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 8,
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#f8fafc' }}>Local Media Asset Library</h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                    Select and upload multiple photos at once. Photos are compressed on the fly to prevent lag.
                  </p>
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
                  cursor: isUploading ? 'not-allowed' : 'pointer'
                }}>
                  <Plus size={16} /> {isUploading ? 'Optimizing...' : 'Upload Multiple Photos'}
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleBatchMediaUpload} 
                    style={{ display: 'none' }} 
                    disabled={isUploading}
                  />
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
                      {m.title || `Photo ${idx + 1}`}
                    </span>
                    <button
                      type="button"
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

          {/* STEP 4: PRODUCTS MANAGER (WITH EXPLICIT MULTIPLE IMAGES GALLERY PROMPT) */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                    Product Catalog & Multi-Image Gallery
                  </h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                    Each product supports multiple photos. Upload multiple pictures at once to build an interactive gallery.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newProd = {
                      id: `prod_${Date.now()}`,
                      name: 'New Product Item',
                      category: 'Standard',
                      price: '₹1,499',
                      description: 'High-durability product engineered to strict industrial and retail specifications.',
                      chips: ['New Arrival'],
                      images: [],
                      image: ''
                    };
                    setProducts(prev => [...prev, newProd]);
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
                  <Plus size={14} /> + Add New Product
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {products.map((prod, idx) => {
                  const galleryImages = (prod.images && prod.images.length > 0) ? prod.images : (prod.image ? [prod.image] : []);
                  return (
                    <div key={prod.id || idx} style={{
                      padding: 20,
                      borderRadius: 14,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16
                    }}>
                      {/* Top Row: Name, Category, Price, Actions */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 140px 140px auto',
                        gap: 14,
                        alignItems: 'center'
                      }}>
                        <div>
                          <input
                            type="text"
                            value={prod.name}
                            onChange={e => {
                              const val = e.target.value;
                              setProducts(prev => {
                                const updated = [...prev];
                                updated[idx] = { ...updated[idx], name: val };
                                return updated;
                              });
                            }}
                            placeholder="Product Title / Model Name"
                            style={{
                              width: '100%',
                              background: 'none',
                              border: 'none',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: 15,
                              marginBottom: 4,
                              padding: '4px 0'
                            }}
                          />
                          <input
                            type="text"
                            value={prod.description || ''}
                            onChange={e => {
                              const val = e.target.value;
                              setProducts(prev => {
                                const updated = [...prev];
                                updated[idx] = { ...updated[idx], description: val };
                                return updated;
                              });
                            }}
                            placeholder="Product description and key specifications..."
                            style={{
                              width: '100%',
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              fontSize: 12,
                              padding: '2px 0'
                            }}
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={prod.category || ''}
                            onChange={e => {
                              const val = e.target.value;
                              setProducts(prev => {
                                const updated = [...prev];
                                updated[idx] = { ...updated[idx], category: val };
                                return updated;
                              });
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
                              const val = e.target.value;
                              setProducts(prev => {
                                const updated = [...prev];
                                updated[idx] = { ...updated[idx], price: val };
                                return updated;
                              });
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
                            type="button"
                            onClick={() => {
                              const copy = { 
                                ...JSON.parse(JSON.stringify(prod)), 
                                id: `prod_${Date.now()}`, 
                                name: `${prod.name} (Copy)` 
                              };
                              setProducts(prev => [...prev, copy]);
                            }}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6 }}
                            title="Duplicate Product"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProducts(prev => prev.filter((_, i) => i !== idx))}
                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 6 }}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Section: EXPLICIT MULTIPLE PRODUCT IMAGES GALLERY PROMPT */}
                      <div style={{
                        padding: 16,
                        borderRadius: 12,
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px dashed rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.02em' }}>
                              📷 Product Photos Gallery ({galleryImages.length} {galleryImages.length === 1 ? 'photo' : 'photos'})
                            </span>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>
                              (Supports selecting multiple photos at once. Click any photo to make it the primary cover)
                            </span>
                          </div>

                          {/* Action Controls for uploading multiple images */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <label style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '6px 14px',
                              borderRadius: 8,
                              background: brand.color,
                              color: '#ffffff',
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}>
                              <Plus size={13} /> Select Multiple Photos
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={e => handleProductMultipleImagesUpload(e, idx)}
                                style={{ display: 'none' }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Quick Web URL Input for this product */}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <div style={{ position: 'relative', flex: 1 }}>
                            <LinkIcon size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input
                              type="text"
                              value={urlInputs[idx] || ''}
                              onChange={e => setUrlInputs(prev => ({ ...prev, [idx]: e.target.value }))}
                              placeholder="Or paste an image web URL (https://...) to add to gallery"
                              style={{
                                width: '100%',
                                padding: '6px 10px 6px 30px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: 6,
                                color: '#ffffff',
                                fontSize: 11
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddProductImageUrl(idx)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#e2e8f0',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Add URL
                          </button>
                        </div>

                        {/* Thumbnails Gallery Strip */}
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
                          {galleryImages.map((imgUrl, imgIdx) => {
                            const isPrimary = prod.image === imgUrl || (!prod.image && imgIdx === 0);
                            return (
                              <div 
                                key={imgIdx} 
                                style={{
                                  position: 'relative',
                                  width: 80,
                                  height: 80,
                                  borderRadius: 8,
                                  overflow: 'hidden',
                                  border: isPrimary ? `2px solid ${brand.color}` : '1px solid rgba(255, 255, 255, 0.15)',
                                  background: '#070a12',
                                  cursor: 'pointer',
                                  boxShadow: isPrimary ? `0 0 12px ${brand.color}40` : 'none'
                                }}
                                onClick={() => handleSetPrimaryProductImage(idx, imgUrl)}
                                title={isPrimary ? 'Primary Cover Photo' : 'Click to make Primary Cover'}
                              >
                                <img src={imgUrl} alt={`Product ${imgIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                
                                {/* Photo Sequence Badge */}
                                <div style={{
                                  position: 'absolute',
                                  bottom: 2,
                                  left: 2,
                                  background: 'rgba(0,0,0,0.7)',
                                  color: '#cbd5e1',
                                  borderRadius: 4,
                                  padding: '1px 4px',
                                  fontSize: 8,
                                  fontWeight: 700
                                }}>
                                  #{imgIdx + 1}
                                </div>

                                {/* Primary Star Tag */}
                                {isPrimary && (
                                  <div style={{
                                    position: 'absolute',
                                    top: 2,
                                    left: 2,
                                    background: brand.color,
                                    color: '#ffffff',
                                    borderRadius: 4,
                                    padding: '1px 5px',
                                    fontSize: 8,
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                  }}>
                                    ★ Cover
                                  </div>
                                )}

                                {/* Remove single image */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProductImage(idx, imgIdx);
                                  }}
                                  style={{
                                    position: 'absolute',
                                    top: 2,
                                    right: 2,
                                    background: 'rgba(0, 0, 0, 0.75)',
                                    color: '#f87171',
                                    border: 'none',
                                    borderRadius: 4,
                                    padding: 3,
                                    cursor: 'pointer'
                                  }}
                                  title="Remove this photo"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            );
                          })}

                          {galleryImages.length === 0 && (
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 8,
                              width: '100%',
                              padding: '24px 16px',
                              borderRadius: 8,
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px dashed rgba(255, 255, 255, 0.15)',
                              cursor: 'pointer',
                              color: '#94a3b8',
                              fontSize: 12
                            }}>
                              <Upload size={16} /> Click here to upload multiple photos for this product gallery
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={e => handleProductMultipleImagesUpload(e, idx)}
                                style={{ display: 'none' }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: PAGE TEXT & CONTENT SECTIONS */}
          {activeTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Hero Banner Section */}
              <div style={{
                padding: 20,
                borderRadius: 14,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#f8fafc' }}>
                  Hero Banner & Primary Messaging
                </h3>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Hero Headline (H1 Main Title)</label>
                  <input
                    type="text"
                    value={content.heroHeading}
                    onChange={e => setContent(prev => ({ ...prev, heroHeading: e.target.value }))}
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

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Hero Subtitle & Value Proposition</label>
                  <textarea
                    rows={2}
                    value={content.heroSubheading}
                    onChange={e => setContent(prev => ({ ...prev, heroSubheading: e.target.value }))}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Primary CTA Button Label</label>
                    <input
                      type="text"
                      value={content.ctaText}
                      onChange={e => setContent(prev => ({ ...prev, ctaText: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 8,
                        color: '#ffffff',
                        fontSize: 12
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Secondary CTA Button Label</label>
                    <input
                      type="text"
                      value={content.ctaSecondaryText}
                      onChange={e => setContent(prev => ({ ...prev, ctaSecondaryText: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 8,
                        color: '#ffffff',
                        fontSize: 12
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* About Us & Heritage Narrative */}
              <div style={{
                padding: 20,
                borderRadius: 14,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#f8fafc' }}>
                  About Us & Heritage Narrative
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Section Title</label>
                    <input
                      type="text"
                      value={content.aboutTitle}
                      onChange={e => setContent(prev => ({ ...prev, aboutTitle: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 8,
                        color: '#ffffff',
                        fontSize: 12
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Founded Year</label>
                    <input
                      type="text"
                      value={content.foundedYear}
                      onChange={e => setContent(prev => ({ ...prev, foundedYear: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 8,
                        color: '#ffffff',
                        fontSize: 12
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Full Narrative Copy</label>
                  <textarea
                    rows={3}
                    value={content.aboutContent}
                    onChange={e => setContent(prev => ({ ...prev, aboutContent: e.target.value }))}
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

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Mission Statement & Quality Commitment</label>
                  <input
                    type="text"
                    value={content.missionStatement || ''}
                    onChange={e => setContent(prev => ({ ...prev, missionStatement: e.target.value }))}
                    placeholder="e.g. Committed to sustainable engineering and client trust."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#ffffff',
                      fontSize: 12
                    }}
                  />
                </div>
              </div>

              {/* Repeating Metrics / Statistics */}
              <div style={{
                padding: 20,
                borderRadius: 14,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                    Key Trust Statistics & Metrics
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setContent(prev => ({
                        ...prev,
                        stats: [...(prev.stats || []), { label: 'New Metric', value: '100%' }]
                      }));
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    + Add Metric
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {(content.stats || []).map((st, sIdx) => (
                    <div key={sIdx} style={{
                      display: 'flex',
                      gap: 8,
                      padding: 10,
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.03)',
                      alignItems: 'center'
                    }}>
                      <input
                        type="text"
                        value={st.value}
                        onChange={e => {
                          const val = e.target.value;
                          setContent(prev => {
                            const updated = [...prev.stats];
                            updated[sIdx] = { ...updated[sIdx], value: val };
                            return { ...prev, stats: updated };
                          });
                        }}
                        placeholder="Value (e.g. 35+)"
                        style={{
                          width: 70,
                          padding: '4px 8px',
                          background: 'none',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 4,
                          color: brand.color,
                          fontWeight: 800,
                          fontSize: 13
                        }}
                      />
                      <input
                        type="text"
                        value={st.label}
                        onChange={e => {
                          const val = e.target.value;
                          setContent(prev => {
                            const updated = [...prev.stats];
                            updated[sIdx] = { ...updated[sIdx], label: val };
                            return { ...prev, stats: updated };
                          });
                        }}
                        placeholder="Label"
                        style={{
                          flex: 1,
                          padding: '4px 8px',
                          background: 'none',
                          border: 'none',
                          color: '#cbd5e1',
                          fontSize: 12
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setContent(prev => ({
                            ...prev,
                            stats: prev.stats.filter((_, i) => i !== sIdx)
                          }));
                        }}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 4 }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
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
                  onChange={e => setSeo(prev => ({ ...prev, title: e.target.value }))}
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
                  onChange={e => setSeo(prev => ({ ...prev, description: e.target.value }))}
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
          padding: '14px 24px',
          borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.8)'
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

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={broadcastPreviewUpdate}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sync to Preview
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
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
              type="button"
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
