import React, { useState, useEffect } from 'react';
import { TEMPLATES, CATEGORIES } from './config/templates';
import ShowcaseHeader from './components/ShowcaseHeader';
import TemplateCatalog from './components/TemplateCatalog';
import StudioPreviewer from './components/StudioPreviewer';
import BrandPersonalizer from './components/BrandPersonalizer';
import SharePitchModal from './components/SharePitchModal';
import InquiryModal from './components/InquiryModal';

export default function App() {
  const [templates] = useState(TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [viewMode, setViewMode] = useState('catalog'); // 'catalog' | 'studio'
  const [activeFilter, setActiveFilter] = useState('All Templates');

  const [clientBrand, setClientBrand] = useState({
    name: '',
    tagline: '',
    color: '',
    phone: '',
    email: '',
    city: '',
    logoUrl: ''
  });

  const [isPersonalizerOpen, setIsPersonalizerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  // Inspect URL parameters on first load for direct pitch links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get('template');
    const brandParam = params.get('brand') || params.get('client');
    const colorParam = params.get('color');
    const phoneParam = params.get('phone');
    const taglineParam = params.get('tagline');
    const emailParam = params.get('email');
    const logoParam = params.get('logo');

    if (templateParam) {
      const match = TEMPLATES.find(t => t.id === templateParam);
      if (match) {
        setSelectedTemplate(match);
        setViewMode('studio');
      }
    }

    if (brandParam || colorParam || phoneParam || taglineParam || logoParam) {
      setClientBrand({
        name: brandParam || '',
        tagline: taglineParam || '',
        color: colorParam ? (colorParam.startsWith('#') ? colorParam : '#' + colorParam) : '',
        phone: phoneParam || '',
        email: emailParam || '',
        city: '',
        logoUrl: logoParam || ''
      });
      if (brandParam) {
        showToast(`Loaded personalized preview for ${brandParam}!`);
      }
    }
  }, []);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setViewMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPersonalizerFor = (template) => {
    setSelectedTemplate(template);
    setIsPersonalizerOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: 'rgba(16, 20, 31, 0.95)',
          color: '#ffffff',
          padding: '10px 22px',
          borderRadius: 999,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(12px)',
          fontSize: 13,
          fontWeight: 600,
          animation: 'slideDown 0.2s ease-out'
        }}>
          {toast.message}
        </div>
      )}

      {/* Main View Router */}
      {viewMode === 'catalog' ? (
        <>
          <ShowcaseHeader
            categories={CATEGORIES}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            clientBrand={clientBrand}
            onOpenPersonalizer={() => setIsPersonalizerOpen(true)}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedTemplate={selectedTemplate}
          />

          <main style={{ flexGrow: 1 }}>
            <TemplateCatalog
              templates={templates}
              activeFilter={activeFilter}
              onSelectTemplate={handleSelectTemplate}
              onOpenPersonalizer={handleOpenPersonalizerFor}
              clientBrand={clientBrand}
            />
          </main>

          {/* Catalog Footer */}
          <footer style={{
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(5, 7, 11, 0.8)',
            padding: '28px 24px',
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--text-dim)'
          }}>
            <p style={{ margin: 0 }}>
              Agency Template Studio &copy; {new Date().getFullYear()} — Built with React, Vite & High-Performance Web Standards.
            </p>
          </footer>
        </>
      ) : (
        <StudioPreviewer
          templates={templates}
          activeTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onBackToCatalog={() => setViewMode('catalog')}
          clientBrand={clientBrand}
          onOpenPersonalizer={() => setIsPersonalizerOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenInquiryModal={() => setIsInquiryModalOpen(true)}
        />
      )}

      {/* Modals & Drawers */}
      <BrandPersonalizer
        isOpen={isPersonalizerOpen}
        onClose={() => setIsPersonalizerOpen(false)}
        clientBrand={clientBrand}
        setClientBrand={setClientBrand}
        activeTemplate={selectedTemplate}
        onOpenShareModal={() => {
          setIsPersonalizerOpen(false);
          setIsShareModalOpen(true);
        }}
        showToast={showToast}
      />

      <SharePitchModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        activeTemplate={selectedTemplate}
        clientBrand={clientBrand}
        showToast={showToast}
      />

      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        activeTemplate={selectedTemplate}
        clientBrand={clientBrand}
        showToast={showToast}
      />

    </div>
  );
}
