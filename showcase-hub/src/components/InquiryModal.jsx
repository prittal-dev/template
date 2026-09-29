import React, { useState } from 'react';
import { X, CalendarCheck, CheckCircle2, Send } from 'lucide-react';

export default function InquiryModal({
  isOpen,
  onClose,
  activeTemplate,
  clientBrand,
  showToast
}) {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: clientBrand.name || '',
    phone: clientBrand.phone || '',
    email: clientBrand.email || '',
    timeline: '3-5 Days (Express Delivery)',
    notes: `We love the ${activeTemplate?.title} design and would like to build our website with similar UI.`
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Inquiry submitted! We will contact you within 2 hours.');
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
          maxWidth: 520,
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
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CalendarCheck size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>Order This Website</h3>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: 0 }}>Template: {activeTemplate?.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={32} color="#22c55e" />
            </div>
            <h4 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
              Proposal Request Received!
            </h4>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
              Thank you! Our engineering team will review your specifications for <strong>{formData.company || activeTemplate?.title}</strong> and send a comprehensive proposal & timeline within 2 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apex Enterprise"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  style={{
                    width: '100%',
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

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
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

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                Target Delivery Timeline
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: 13,
                  outline: 'none'
                }}
              >
                <option value="3-5 Days (Express Delivery)" style={{ background: '#11141f' }}>3-5 Days (Express Delivery)</option>
                <option value="1-2 Weeks (Standard)" style={{ background: '#11141f' }}>1-2 Weeks (Standard)</option>
                <option value="Custom Project Timeline" style={{ background: '#11141f' }}>Custom Project Timeline</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                Project Requirements / Special Requests
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: 13,
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: 14,
                marginTop: 6
              }}
            >
              <Send size={15} />
              <span>Submit Project Request</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
