'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../LanguageContext';

const LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/documents',  label: 'Documents' },
  { href: '/checklist',  label: 'Checklist' },
  { href: '/chat',       label: 'Chat' },
];

export default function Nav() {
  const path = usePathname();
  const { lang, setLang, t } = useLanguage();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--nav-h)',
      background: 'var(--bg)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', zIndex: 100,
    }}>
      <Link href="/" style={{
        fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.95rem',
        color: 'var(--navy)', letterSpacing: '-0.01em',
      }}>
        Vote<span style={{ color: 'var(--saffron)' }}>Setu</span>
      </Link>

      <div style={{ display: 'flex', gap: '0' }}>
        {LINKS.map(({ href, label }) => {
          const active = path === href || (href !== '/' && path.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: active ? 600 : 400,
              color: active ? 'var(--navy)' : 'var(--muted)',
              padding: '0 1rem', height: 'var(--nav-h)', display: 'flex', alignItems: 'center',
              borderBottom: `2px solid ${active ? 'var(--saffron)' : 'transparent'}`,
              transition: 'color 0.15s, border-color 0.15s',
            }}>
              {t(label)}
            </Link>
          );
        })}
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--navy)', marginLeft: '1rem', display: 'flex', alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <span style={{ opacity: lang === 'en' ? 1 : 0.5 }}>EN</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ opacity: lang === 'hi' ? 1 : 0.5, fontSize: '0.85rem' }}>हिंदी</span>
        </button>
      </div>
    </nav>
  );
}
