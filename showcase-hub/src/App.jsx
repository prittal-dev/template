import React, { useState, useEffect } from 'react';
import { TEMPLATES as INITIAL_TEMPLATES, CATEGORIES } from './config/templates';
import ShowcaseHeader from './components/ShowcaseHeader';
import TemplateCatalog from './components/TemplateCatalog';
import StudioPreviewer from './components/StudioPreviewer';
import BrandPersonalizer from './components/BrandPersonalizer';
import SharePitchModal from './components/SharePitchModal';
import InquiryModal from './components/InquiryModal';
import ClientWizardModal from './components/ClientWizardModal';
import ClientProjectsView from './components/ClientProjectsView';
import { 
  fetchProjects, 
  saveProject, 
  duplicateProject, 
  deleteProject, 
  refreshTemplatesDiscovery 
} from './services/projectStore';
import { exportStandaloneWebsite } from './services/exportEngine';

export default function App() {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(INITIAL_TEMPLATES[0]);
  const [viewMode, setViewMode] = useState('catalog'); // 'catalog' | 'projects' | 'studio'
  const [activeFilter, setActiveFilter] = useState('All Templates');
  const [projects, setProjects] = useState([]);
  
  // Wizard Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardTemplate, setWizardTemplate] = useState(null);
  const [wizardProject, setWizardProject] = useState(null);
  const [wizardInitialTab, setWizardInitialTab] = useState('business');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('agency_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('agency_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
    }, 3500);
  };

  // Load client projects on start
  useEffect(() => {
    fetchProjects().then(data => {
      if (Array.isArray(data)) {
        setProjects(data);
      }
    });
  }, []);

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
      const match = templates.find(t => t.id === templateParam);
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
  }, [templates]);

  // Handle template selection for Live Simulator
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setViewMode('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Create Website wizard trigger from Template Card
  const handleCreateWebsite = (template) => {
    setWizardTemplate(template || templates[0]);
    setWizardProject(null);
    setWizardInitialTab('business');
    setIsWizardOpen(true);
  };

  // Handle Opening the full form wizard for preferences & branding
  const handleOpenPreferences = (template = null, tab = 'branding') => {
    const targetTemplate = template || selectedTemplate || templates[0];
    setWizardTemplate(targetTemplate);
    setWizardProject(null);
    setWizardInitialTab(tab);
    setIsWizardOpen(true);
  };

  // Handle Edit Project trigger from Projects Portfolio
  const handleEditProject = (project, template) => {
    setWizardTemplate(template);
    setWizardProject(project);
    setWizardInitialTab('business');
    setIsWizardOpen(true);
  };

  // Handle Save Project
  const handleSaveProjectRecord = async (projectData) => {
    const updated = await saveProject(projectData);
    setProjects(updated);
  };

  // Handle Duplicate Project
  const handleDuplicateProjectRecord = async (id) => {
    const updated = await duplicateProject(id);
    setProjects(updated);
    showToast('Project duplicated successfully!');
  };

  // Handle Delete Project
  const handleDeleteProjectRecord = async (id) => {
    const updated = await deleteProject(id);
    setProjects(updated);
    showToast('Project deleted.');
  };

  // Handle Export Standalone ZIP
  const handleExportProjectRecord = async (project, template) => {
    showToast(`Generating standalone React package for ${project.name}...`);
    try {
      await exportStandaloneWebsite(project, template);
      showToast('Standalone React project exported and downloaded as .ZIP!');
    } catch (err) {
      showToast('Export failed: ' + err.message);
    }
  };

  // Refresh Template Library via Discovery Engine
  const handleRefreshLibrary = async () => {
    const discovered = await refreshTemplatesDiscovery();
    if (discovered) {
      setTemplates(discovered);
      showToast(`Discovered ${discovered.length} templates across sources/`);
    } else {
      showToast('Templates up to date.');
    }
  };

  // Open Live Preview from Wizard
  const handleOpenPreviewFromWizard = (template, brandData) => {
    setSelectedTemplate(template);
    setClientBrand(brandData);
    setIsWizardOpen(false);
    setViewMode('studio');
    showToast(`Viewing live simulator for ${brandData.name || template.title}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: 'var(--bg-surface-elevated, #10172a)',
          color: 'var(--text-main, #ffffff)',
          padding: '10px 20px',
          borderRadius: 10,
          border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.15))',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Agency Header */}
      <ShowcaseHeader
        categories={CATEGORIES}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        clientBrand={clientBrand}
        onOpenPersonalizer={() => handleOpenPreferences(selectedTemplate || templates[0], 'branding')}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedTemplate={selectedTemplate}
        theme={theme}
        toggleTheme={toggleTheme}
        projectsCount={projects.length}
        onCreateNew={() => handleCreateWebsite(templates[0])}
      />

      {/* Main View Router */}
      <main style={{ flexGrow: 1 }}>
        {viewMode === 'catalog' && (
          <TemplateCatalog
            templates={templates}
            activeFilter={activeFilter}
            onSelectTemplate={handleSelectTemplate}
            onOpenPersonalizer={(tmpl) => handleOpenPreferences(tmpl, 'branding')}
            onCreateWebsite={handleCreateWebsite}
            onRefreshLibrary={handleRefreshLibrary}
            clientBrand={clientBrand}
          />
        )}

        {viewMode === 'projects' && (
          <ClientProjectsView
            projects={projects}
            templates={templates}
            onEditProject={handleEditProject}
            onPreviewProject={(tmpl, brandData) => {
              setSelectedTemplate(tmpl);
              if (brandData) setClientBrand(brandData);
              setViewMode('studio');
            }}
            onDuplicateProject={handleDuplicateProjectRecord}
            onExportProject={handleExportProjectRecord}
            onDeleteProject={handleDeleteProjectRecord}
            onCreateNew={() => handleCreateWebsite(templates[0])}
          />
        )}

        {viewMode === 'studio' && (
          <StudioPreviewer
            templates={templates}
            activeTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onBackToCatalog={() => setViewMode('catalog')}
            clientBrand={clientBrand}
            onOpenPersonalizer={() => handleOpenPreferences(selectedTemplate, 'branding')}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenInquiryModal={() => setIsInquiryModalOpen(true)}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </main>

      {/* Dashboard Footer */}
      {viewMode !== 'studio' && (
        <footer style={{
          borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
          background: 'var(--bg-dark, #070a12)',
          padding: '32px 24px',
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--text-dim, #64748b)',
          fontFamily: 'var(--font-mono)'
        }}>
          <p style={{ margin: 0 }}>
            AGENCY WEBSITE BUILDER & TEMPLATE STUDIO &copy; {new Date().getFullYear()} — BASIC, STANDARD &amp; PREMIUM ARCHITECTURE
          </p>
        </footer>
      )}

      {/* Dynamic Client Information Wizard Modal — Full Comprehensive Form */}
      {isWizardOpen && (
        <ClientWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          template={wizardTemplate}
          initialProject={wizardProject}
          initialBrand={clientBrand}
          initialTab={wizardInitialTab}
          onSaveProject={handleSaveProjectRecord}
          onOpenPreview={handleOpenPreviewFromWizard}
          onUpdateBrand={(updatedBrand) => setClientBrand(prev => ({ ...prev, ...updatedBrand }))}
          showToast={showToast}
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
