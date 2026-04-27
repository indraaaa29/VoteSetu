import type { Metadata } from 'next';
import '../styles/globals.css';
import Nav from '../components/Nav';
import { LanguageProvider } from '../lib/LanguageContext';

export const metadata: Metadata = {
  title: 'VoteSetu — Civic Information Assistant',
  description: 'Understand elections, verify eligibility, and ask questions — powered by official Election Commission of India data.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Nav />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
