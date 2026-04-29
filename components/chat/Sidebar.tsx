'use client';
import { memo } from 'react';

const DOCS_LIST = [
  { id: 'voting_process', label: 'nav.voting_process' },
  { id: 'eligibility',    label: 'nav.eligibility' },
  { id: 'required_docs',  label: 'nav.required_docs' },
  { id: 'registration',   label: 'nav.registration' },
  { id: 'evm_info',       label: 'nav.evm_info' },
];

export const Sidebar = memo(({ t }: { t: any }) => (
  <nav className="desktop-sidebar" aria-label="Reference Documents" style={{
    width: 200, flexShrink: 0, borderRight: '1px solid var(--border)',
    background: 'var(--sidebar-bg)', overflowY: 'auto', padding: '1.5rem 0',
  }}>
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.16em',
      textTransform: 'uppercase', color: 'var(--muted)', padding: '0 1.25rem', marginBottom: '0.25rem',
    }}>{t("nav.documents")}</p>
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.1em',
      textTransform: 'uppercase', color: 'var(--muted)', padding: '0 1.25rem', marginBottom: '0.75rem', opacity: 0.6,
    }}>ID: VOTE-DOC-SYS</p>
    {DOCS_LIST.map(d => (
      <a key={d.id} href={`/documents?doc=${d.id}`} style={{
        display: 'block', padding: '0.65rem 1.25rem',
        fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#6B7280',
        borderLeft: '2px solid transparent', transition: 'color 0.1s',
      }}>
        {t(d.label)}
      </a>
    ))}
  </nav>
));

Sidebar.displayName = 'Sidebar';
