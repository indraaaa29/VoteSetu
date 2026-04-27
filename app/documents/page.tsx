'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/LanguageContext';

const DOCS = [
  { id: 'voting_process', label: 'nav.voting_process', cat: 'nav.process' },
  { id: 'eligibility',    label: 'nav.eligibility',    cat: 'nav.eligibility' },
  { id: 'required_docs',  label: 'nav.required_docs',  cat: 'nav.documents' },
  { id: 'registration',   label: 'nav.registration',   cat: 'nav.registration' },
  { id: 'evm_info',       label: 'nav.evm_info',       cat: 'nav.process' },
];

const S_BODY: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.8,
  color: '#374151',
};

function Section({ s }: { s: { heading: string; content: string | string[]; type?: 'ol' | 'ul' | 'text' | 'steps' } }) {
  const [open, setOpen] = useState(true);
  if (!s) return null;
  
  const isList = Array.isArray(s.content);

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
        marginBottom: open ? '0.85rem' : 0,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--saffron)', fontWeight: 600, minWidth: 10 }}>
          {open ? '−' : '+'}
        </span>
        <h3 style={{
          fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 700,
          color: 'var(--navy)', letterSpacing: '-0.01em',
        }}>
          {s.heading}
        </h3>
      </button>
      {open && (
        <div style={{ paddingLeft: '1.4rem' }}>
          {!isList && <p style={S_BODY}>{s.content as string}</p>}
          {isList && (
            <ul style={{ 
              paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem',
              listStyleType: s.type === 'ul' ? 'disc' : 'decimal'
            }}>
              {(s.content as string[]).map((item, i) => <li key={i} style={S_BODY}>{item}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState('eligibility');

  const title = t(`docs.${activeId}.title`);
  const sections = t(`docs.${activeId}.sections`) || [];
  const activeDoc = DOCS.find(d => d.id === activeId);

  return (
    <main style={{ display: 'flex', height: 'calc(100vh - var(--nav-h))', overflow: 'hidden' }}>

      {/* Sidebar */}
      <aside style={{
        width: 200, flexShrink: 0,
        borderRight: '1px solid var(--border)',
        background: 'var(--sidebar-bg)',
        overflowY: 'auto', padding: '1.5rem 0',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'var(--muted)', padding: '0 1.25rem', marginBottom: '0.5rem',
        }}>
          {t("nav.documents")}
        </p>
        {DOCS.map(d => (
          <button key={d.id} onClick={() => setActiveId(d.id)} style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '0.65rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
            borderLeft: `2px solid ${activeId === d.id ? 'var(--saffron)' : 'transparent'}`,
            backgroundColor: activeId === d.id ? 'rgba(255,153,51,0.06)' : 'transparent',
            transition: 'background 0.1s',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: activeId === d.id ? 'var(--saffron)' : 'var(--muted)',
              display: 'block', marginBottom: 2,
            }}>{t(d.cat)}</span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.4,
              color: activeId === d.id ? 'var(--navy)' : '#6B7280',
              fontWeight: activeId === d.id ? 600 : 400,
            }}>{t(d.label)}</span>
          </button>
        ))}
      </aside>

      {/* Document body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem 3.5rem', background: 'var(--bg)' }}>

        {/* Breadcrumb */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1.5rem',
        }}>
          {t("nav.documents")} › {t(activeDoc?.cat || '')} › {t(activeDoc?.label || '')}
        </p>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-head)', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
          fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '0.75rem',
        }}>
          {title}
        </h1>

        {/* Meta row */}
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
          paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green)',
          }}>
            ✓ {t("docs.meta.verified")}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
            Election Commission of India
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)' }}>
            {t("docs.meta.updated")} April 2024
          </span>
          <Link href={`/chat?q=${encodeURIComponent('Tell me about: ' + title)}`} style={{
            fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--saffron)',
            fontWeight: 600, marginLeft: 'auto',
          }}>
            {t("docs.meta.ask_about")}
          </Link>
        </div>

        {/* Sections */}
        {sections.map((s: any, i: number) => <Section key={i} s={s} />)}

        {/* Source */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.54rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--muted)', marginTop: '2rem', paddingTop: '1.25rem',
          borderTop: '1px solid var(--border)',
        }}>
          {t("docs.meta.source")}
        </p>
      </div>
    </main>
  );
}
