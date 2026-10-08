import React, { useState } from 'react';
import { 
  Building2, Edit3, Eye, Copy, Download, Trash2, 
  Search, Filter, Plus, Calendar, CheckCircle2, Clock, Globe 
} from 'lucide-react';

export default function ClientProjectsView({
  projects = [],
  templates = [],
  onEditProject,
  onPreviewProject,
  onDuplicateProject,
  onExportProject,
  onDeleteProject,
  onCreateNew
}) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | 'basic' | 'standard' | 'premium'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Draft' | 'Ready' | 'Exported'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.clientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.templateId || '').toLowerCase().includes(search.toLowerCase());

    const matchesTier = tierFilter === 'all' || p.tier === tierFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTemplate = (id) => templates.find(t => t.id === id) || { title: id, tier: 'basic', previewUrl: '#' };

  const getTierBadge = (tier) => {
    if (tier === 'premium') return { label: 'PREMIUM', bg: 'rgba(244, 63, 94, 0.15)', text: '#f43f5e', border: 'rgba(244, 63, 94, 0.3)' };
    if (tier === 'standard') return { label: 'STANDARD', bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308', border: 'rgba(234, 179, 8, 0.3)' };
    return { label: 'BASIC', bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
  };

  const getStatusBadge = (status) => {
    if (status === 'Exported') return { label: 'Exported', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    if (status === 'Ready') return { label: 'Ready', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' };
    return { label: 'Draft', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 1240, margin: '0 auto' }}>
      
      {/* Header bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 32
      }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: '#ffffff' }}>
            Client Projects Portfolio
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#94a3b8' }}>
            Manage client websites generated from Basic, Standard, and Premium templates.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 22px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            border: 'none',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 20px -4px rgba(59, 130, 246, 0.4)'
          }}
        >
          <Plus size={16} /> Create New Client Website
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 16,
        padding: '18px 20px',
        borderRadius: 16,
        background: 'var(--bg-surface-elevated, #10172a)',
        border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.08))',
        marginBottom: 28
      }}>
        <div style={{
          flex: 1,
          minWidth: 240,
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} style={{ position: 'absolute', left: 14, color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search by client, project title or template..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              color: '#ffffff',
              fontSize: 13
            }}
          />
        </div>

        {/* Tier filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Tier:</span>
          {['all', 'basic', 'standard', 'premium'].map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: tierFilter === t ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                border: tierFilter === t ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                color: tierFilter === t ? '#ffffff' : '#94a3b8',
                fontSize: 12,
                fontWeight: tierFilter === t ? 700 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {t === 'all' ? 'All Tiers' : t}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Status:</span>
          {['all', 'Draft', 'Ready', 'Exported'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: statusFilter === s ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                border: statusFilter === s ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                color: statusFilter === s ? '#ffffff' : '#94a3b8',
                fontSize: 12,
                fontWeight: statusFilter === s ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(255, 255, 255, 0.1)'
        }}>
          <Building2 size={44} style={{ color: '#475569', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#cbd5e1', marginBottom: 8 }}>No client projects found</h3>
          <p style={{ fontSize: 13, color: '#64748b', maxWidth: 400, margin: '0 auto 20px' }}>
            No projects match your current filters. Select a template to start building.
          </p>
          <button
            onClick={onCreateNew}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              background: '#3b82f6',
              border: 'none',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Create First Website
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 24
        }}>
          {filteredProjects.map(project => {
            const tmpl = getTemplate(project.templateId);
            const tierBadge = getTierBadge(project.tier || tmpl.tier);
            const statusBadge = getStatusBadge(project.status);
            const formattedDate = project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';

            return (
              <div
                key={project.id}
                style={{
                  borderRadius: 18,
                  background: 'var(--bg-surface-elevated, #111827)',
                  border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.08))',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Project Header Bar */}
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 9999,
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        background: tierBadge.bg,
                        color: tierBadge.text,
                        border: `1px solid ${tierBadge.border}`
                      }}>
                        {tierBadge.label}
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 9999,
                        fontSize: 10,
                        fontWeight: 600,
                        background: statusBadge.bg,
                        color: statusBadge.color
                      }}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                      {project.name}
                    </h3>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>
                      Client: <strong style={{ color: '#cbd5e1' }}>{project.clientName || 'General Client'}</strong>
                    </span>
                  </div>

                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: project.brand?.color || tmpl.accentColor || '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 16,
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    {(project.brand?.name || project.name || 'C')[0]}
                  </div>
                </div>

                {/* Project Details */}
                <div style={{ padding: '18px 24px', flex: 1 }}>
                  <p style={{
                    fontSize: 13,
                    color: '#94a3b8',
                    margin: '0 0 16px',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {project.brand?.description || project.brand?.tagline || tmpl.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                    <div style={{ color: '#64748b' }}>
                      Template: <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{tmpl.shortName || tmpl.title}</span>
                    </div>
                    <div style={{ color: '#64748b' }}>
                      Products: <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{project.products?.length || 0} items</span>
                    </div>
                    <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} /> {formattedDate}
                    </div>
                    <div style={{ color: '#64748b' }}>
                      Phone: <span style={{ color: '#cbd5e1' }}>{project.brand?.phone || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div style={{
                  padding: '14px 20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => onEditProject(project, tmpl)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 12px',
                        borderRadius: 8,
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        color: '#60a5fa',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => onPreviewProject(tmpl, {
                        ...(project.brand || {}),
                        products: project.products || [],
                        heroHeading: project.content?.heroHeading,
                        heroSubheading: project.content?.heroSubheading
                      })}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 12px',
                        borderRadius: 8,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#cbd5e1',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Eye size={13} /> Preview
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => onDuplicateProject(project.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: 6
                      }}
                      title="Duplicate Project"
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      onClick={() => onExportProject(project, tmpl)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#10b981',
                        cursor: 'pointer',
                        padding: 6
                      }}
                      title="Export Standalone ZIP"
                    >
                      <Download size={15} />
                    </button>

                    {deleteConfirmId === project.id ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => {
                            onDeleteProject(project.id);
                            setDeleteConfirmId(null);
                          }}
                          style={{
                            padding: '4px 8px',
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: 6,
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: 6,
                            color: '#fff',
                            fontSize: 11,
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(project.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          padding: 6
                        }}
                        title="Delete Project"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
