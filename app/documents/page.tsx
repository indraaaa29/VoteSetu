'use client';
import { useState } from 'react';
import Link from 'next/link';

const DOCS = [
  { id: 'voting-process', label: 'Voting Process', cat: 'PROCESS' },
  { id: 'eligibility',    label: 'Eligibility',    cat: 'ELIGIBILITY' },
  { id: 'required-docs',  label: 'Required Docs',  cat: 'DOCUMENTS' },
  { id: 'registration',   label: 'Reg Guide',      cat: 'REGISTRATION' },
  { id: 'evm-info',       label: 'EVM Info',       cat: 'PROCESS' },
];

const CONTENT: Record<string, {
  title: string; updated: string;
  sections: { heading: string; content: string | string[]; type?: 'ol' | 'ul' | 'text' | 'steps' }[]
}> = {
  'voting-process': {
    title: 'How the Indian Election Process Works', updated: 'April 2024',
    sections: [
      { heading: 'Overview', type: 'text', content: 'India conducts elections for the Lok Sabha and State Assemblies under the Election Commission of India (ECI), a constitutional body under Article 324. The process is governed by the Representation of the People Act, 1951.' },
      { heading: 'Key Stages', type: 'ol', content: ['ECI announces schedule and Model Code of Conduct begins','Nomination of candidates by political parties','Scrutiny and withdrawal period','Election campaign period (2+ weeks)','Polling day(s) — voters cast ballots at designated booths','Counting of votes and declaration of results'] },
      { heading: 'Governing Body', type: 'text', content: 'The Election Commission of India is fully independent of the executive and legislature. The Chief Election Commissioner is appointed by the President of India and can only be removed like a Supreme Court judge.' },
    ],
  },
  'eligibility': {
    title: 'Voter Eligibility Criteria', updated: 'April 2024',
    sections: [
      { heading: 'Basic Requirements', type: 'ul', content: ['Must be a citizen of India.','Must be 18 years of age or older on the qualifying date (usually 1st January of the revision year).','Must be ordinarily resident of the polling area where they wish to be enrolled.','Must be enrolled in the electoral roll of that particular constituency.'] },
      { heading: 'Grounds for Disqualification', type: 'ul', content: ['Is not a citizen of India.','Is confined in a prison under a sentence of imprisonment or is in the lawful custody of the police.','Is of unsound mind and stands so declared by a competent court.','Is for the time being disqualified under any law relating to corrupt practices in connection with elections.'] },
      { heading: 'Verification Protocol', type: 'steps', content: ['Submit Form 6 online via the official portal or physically at the designated Electoral Registration Office.','Provide necessary documentation establishing identity, age, and ordinary residence (e.g., Aadhaar, utility bills, passport).','Await field verification by the Booth Level Officer (BLO) to confirm residential status.','To verify your enrollment, call toll-free 1950 or access the digital ledger at nvsp.in.'] },
    ],
  },
  'required-docs': {
    title: 'Documents Required to Vote', updated: 'April 2024',
    sections: [
      { heading: 'Primary Documents', type: 'ul', content: ['EPIC Card (Voter ID Card)','Aadhaar Card','Passport','Driving License','PAN Card (with photograph)'] },
      { heading: 'Alternative Documents', type: 'ul', content: ['Bank or Post Office Passbook (with photo)','MGNREGA Job Card','Health Insurance Smart Card (ESIC/RSBY)','Smart Card issued by RGI under NPR','Pension documents (with photo)'] },
      { heading: 'Important Note', type: 'text', content: 'You must carry at least one of the above documents to the polling booth. The Presiding Officer will verify your identity against the electoral roll before allowing you to vote.' },
    ],
  },
  'registration': {
    title: 'How to Register as a Voter', updated: 'April 2024',
    sections: [
      { heading: 'Online Registration', type: 'steps', content: ['Visit voters.eci.gov.in or download the Voter Helpline app.','Select "New Voter Registration — Form 6".','Fill all required fields: name, date of birth, address.','Upload age proof, address proof, and one photograph.','Submit and keep the reference number for tracking.'] },
      { heading: 'Offline Registration', type: 'text', content: 'Obtain Form 6 from your local Electoral Registration Office (ERO) or Booth Level Officer (BLO). Fill and submit with self-attested copies of age proof, address proof, and one photograph.' },
    ],
  },
  'evm-info': {
    title: 'Electronic Voting Machines (EVM)', updated: 'April 2024',
    sections: [
      { heading: 'What is an EVM', type: 'text', content: 'An EVM is a standalone, battery-operated device used since 1982. It consists of a Control Unit (with the Presiding Officer) and a Ballot Unit (in the voting compartment). Votes are stored electronically and cannot be tampered with once locked.' },
      { heading: 'How to Use an EVM', type: 'steps', content: ['Show identity document to the Polling Officer.','Your name is marked in the electoral roll.','You receive a voter slip; proceed to the Ballot Unit.','Press the blue button next to your candidate\'s name.','A beep and green light confirm your vote is recorded.'] },
      { heading: 'VVPAT', type: 'text', content: 'A Voter Verifiable Paper Audit Trail (VVPAT) displays your candidate\'s name and symbol on a paper slip for 7 seconds after you vote, then drops it into a sealed box for verification.' },
    ],
  },
};

const S_BODY: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.8,
  color: '#374151',
};

function Section({ s, idx }: { s: typeof CONTENT[string]['sections'][0]; idx: number }) {
  const [open, setOpen] = useState(true);
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
          {(s.type === 'text') && <p style={S_BODY}>{s.content as string}</p>}
          {(s.type === 'ul') && (
            <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {(s.content as string[]).map((item, i) => <li key={i} style={S_BODY}>{item}</li>)}
            </ul>
          )}
          {(s.type === 'ol' || s.type === 'steps') && (
            <ol style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {(s.content as string[]).map((item, i) => <li key={i} style={S_BODY}>{item}</li>)}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  const [activeId, setActiveId] = useState('eligibility');
  const doc = CONTENT[activeId];

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
          Documents
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
            }}>{d.cat}</span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.8rem', lineHeight: 1.4,
              color: activeId === d.id ? 'var(--navy)' : '#6B7280',
              fontWeight: activeId === d.id ? 600 : 400,
            }}>{d.label}</span>
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
          Documents › {DOCS.find(d => d.id === activeId)?.cat} › {DOCS.find(d => d.id === activeId)?.label}
        </p>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-head)', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
          fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '0.75rem',
        }}>
          {doc.title}
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
            ✓ Verified
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
            Election Commission of India
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)' }}>
            Updated {doc.updated}
          </span>
          <Link href={`/chat?q=${encodeURIComponent('Tell me about: ' + doc.title)}`} style={{
            fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--saffron)',
            fontWeight: 600, marginLeft: 'auto',
          }}>
            Ask about this →
          </Link>
        </div>

        {/* Sections */}
        {doc.sections.map((s, i) => <Section key={s.heading} s={s} idx={i} />)}

        {/* Source */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.54rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--muted)', marginTop: '2rem', paddingTop: '1.25rem',
          borderTop: '1px solid var(--border)',
        }}>
          Source: Representation of the People Act, 1950 · eci.gov.in
        </p>
      </div>
    </main>
  );
}
