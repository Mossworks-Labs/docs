/* eslint-disable */
// All screen components for the CRAFT mobile app.
// Flow design system ported to Android: dark surface, teal accent,
// Instrument Serif headlines, Inter Tight UI, JetBrains Mono labels.

const { useState, useMemo } = React;

// ─── Tokens ──────────────────────────────────────────────────
const T = {
  surface950: '#0b0f0e',
  surface900: '#111615',
  surface800: '#1a201e',
  surface700: '#242b29',
  surface600: '#2e3633',
  surface500: '#3a423f',

  ink: '#e8ecea',
  ink2: '#b8c0bc',
  ink3: '#7a847f',
  ink4: '#525c57',

  accent: '#0d9488',     // teal — README badge color
  accent2: '#5eead4',
  accent3: '#13b8a4',
  accentDim: 'rgba(13,148,136,0.14)',
  accentBorder: 'rgba(13,148,136,0.32)',

  short: '#f59e0b',      // amber for shorts
  shortDim: 'rgba(245,158,11,0.18)',
  shortBorder: 'rgba(245,158,11,0.35)',

  highlight: '#a78bfa',  // violet for discover
  highlightDim: 'rgba(167,139,250,0.18)',

  success: '#34d399',
  successDim: 'rgba(52,211,153,0.18)',
  warning: '#fbbf24',
  danger:  '#f87171',
  info:    '#60a5fa',

  serif: '"Instrument Serif", ui-serif, Georgia, serif',
  sans:  '"Inter Tight", "Inter", system-ui, sans-serif',
  mono:  '"JetBrains Mono", "Fira Code", monospace',
};

// ─── Primitive bits ──────────────────────────────────────────
function MonoLabel({ children, color, style }) {
  return (
    <div style={{
      fontFamily: T.mono,
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: color || T.ink3,
      ...style,
    }}>{children}</div>
  );
}

function Pill({ children, color = 'accent', filled, style }) {
  const map = {
    accent:    { bg: T.accentDim,    fg: T.accent2,   bd: T.accentBorder },
    short:     { bg: T.shortDim,     fg: '#fcd34d',   bd: T.shortBorder },
    highlight: { bg: T.highlightDim, fg: '#c4b5fd',   bd: 'rgba(167,139,250,0.32)' },
    success:   { bg: T.successDim,   fg: '#6ee7b7',   bd: 'rgba(52,211,153,0.32)' },
    warning:   { bg: 'rgba(251,191,36,0.16)', fg: '#fcd34d', bd: 'rgba(251,191,36,0.32)' },
    neutral:   { bg: T.surface800,   fg: T.ink2,     bd: T.surface600 },
    danger:    { bg: 'rgba(248,113,113,0.14)', fg: T.danger, bd: 'rgba(248,113,113,0.32)' },
  };
  const c = map[color] || map.accent;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: T.mono,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '2px 6px',
      borderRadius: 4,
      background: filled ? c.fg : c.bg,
      color: filled ? T.surface950 : c.fg,
      border: `1px solid ${c.bd}`,
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}

function Tag({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: T.mono, fontSize: 11,
      padding: '3px 8px', borderRadius: 4,
      background: active ? T.accentDim : T.surface800,
      color: active ? T.accent2 : T.ink2,
      border: `1px solid ${active ? T.accentBorder : T.surface600}`,
      cursor: 'pointer', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

function Btn({ children, kind = 'primary', size = 'md', icon, onClick, style, disabled }) {
  const sizes = {
    sm: { padY: 6, padX: 10, fs: 12, gap: 5 },
    md: { padY: 9, padX: 14, fs: 13, gap: 6 },
    lg: { padY: 12, padX: 18, fs: 14, gap: 8 },
  }[size];
  const kinds = {
    primary:   { bg: T.accent,      fg: '#001a17', bd: 'transparent' },
    secondary: { bg: T.surface800,  fg: T.ink,    bd: T.surface600 },
    ghost:     { bg: 'transparent', fg: T.ink2,   bd: 'transparent' },
    danger:    { bg: 'transparent', fg: T.danger, bd: 'rgba(248,113,113,0.3)' },
  };
  const c = kinds[kind];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: sizes.gap,
      padding: `${sizes.padY}px ${sizes.padX}px`,
      borderRadius: 8,
      background: c.bg, color: c.fg,
      border: `1px solid ${c.bd}`,
      fontFamily: T.sans, fontSize: sizes.fs, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      lineHeight: 1, whiteSpace: 'nowrap',
      ...style,
    }}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </button>
  );
}

function Card({ children, style, onClick, active }) {
  return (
    <div onClick={onClick} style={{
      background: active ? T.surface800 : T.surface900,
      border: `1px solid ${active ? T.accentBorder : T.surface600}`,
      borderRadius: 12,
      padding: 14,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

function Divider({ vertical, style }) {
  return (
    <div style={{
      ...(vertical
        ? { width: 1, alignSelf: 'stretch' }
        : { height: 1, width: '100%' }),
      background: T.surface600,
      ...style,
    }} />
  );
}

// ─── Mini icons (SVG) ────────────────────────────────────────
const Ico = {
  search: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  plus: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  spark: (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6z"/></svg>,
  arrow: (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  arrowL: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  check: (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  more:  (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>,
  filter:(s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>,
  play:  (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  pause: (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>,
  mic:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>,
  eye:   (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>,
  edit:  (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3l5 5L8 21H3v-5z"/></svg>,
  trash: (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>,
  bolt:  (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-2 8 9-12h-7l2-8z"/></svg>,
  pipe:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h8M6 8v8M18 8v8M8 18h8"/></svg>,
  film:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,
  doc:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>,
  folder:(s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  audio: (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h2l3-7 4 14 3-10 2 6h4"/></svg>,
  bell:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/></svg>,
  user:  (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>,
  cog:   (s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>,
  ext:   (s = 12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>,
  sliders:(s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/></svg>,
  link:  (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>,
  copy:  (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  hash:  (s = 12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>,
};

// ─── Channel pill (top of every screen) ──────────────────────
function ChannelPill({ name = 'Otterworks', niche = 'Education' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '5px 9px 5px 5px',
      background: T.surface800,
      border: `1px solid ${T.surface600}`,
      borderRadius: 999,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: T.accent, color: '#001a17',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.serif, fontSize: 14, fontWeight: 600,
      }}>O</div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
        <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.ink }}>{name}</span>
        <span style={{ fontFamily: T.mono, fontSize: 9, color: T.ink3, letterSpacing: '0.05em' }}>{niche}</span>
      </div>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.ink3} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  );
}

// ─── Top bar (compact app bar) ───────────────────────────────
function TopBar({ title, subtitle, right, onBack, leftLogo }) {
  return (
    <div style={{
      padding: '10px 14px 12px',
      display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: `1px solid ${T.surface700}`,
      background: T.surface950,
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', color: T.ink, cursor: 'pointer',
        }}>{Ico.arrowL()}</button>
      ) : leftLogo ? (
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: `linear-gradient(135deg, ${T.accent} 0%, ${T.accent3} 100%)`,
          color: '#001a17', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.serif, fontSize: 18, fontWeight: 600,
        }}>c</div>
      ) : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{
            fontFamily: T.serif, fontSize: 22, fontWeight: 400,
            color: T.ink, lineHeight: 1, letterSpacing: '-0.01em',
          }}>{title}</div>
        )}
        {subtitle && (
          <div style={{
            fontFamily: T.mono, fontSize: 10, color: T.ink3,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3,
          }}>{subtitle}</div>
        )}
      </div>
      {right}
    </div>
  );
}

// ─── Bottom nav ──────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',      label: 'Home',     icon: Ico.spark },
  { id: 'discover',  label: 'Discover', icon: Ico.search },
  { id: 'board',     label: 'Board',    icon: Ico.pipe },
  { id: 'audio',     label: 'Audio',    icon: Ico.audio },
  { id: 'more',      label: 'More',     icon: Ico.more },
];

function BottomNav({ active, onChange }) {
  return (
    <div style={{
      borderTop: `1px solid ${T.surface700}`,
      background: T.surface950,
      padding: '6px 4px 8px',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {NAV_ITEMS.map(n => {
        const isActive = active === n.id;
        return (
          <button key={n.id} onClick={() => onChange(n.id)} style={{
            background: 'transparent', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 4px',
            color: isActive ? T.accent2 : T.ink3,
            cursor: 'pointer', flex: 1,
          }}>
            <div style={{
              padding: '4px 14px', borderRadius: 999,
              background: isActive ? T.accentDim : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{n.icon(20)}</div>
            <span style={{
              fontFamily: T.sans, fontSize: 11, fontWeight: isActive ? 600 : 500,
            }}>{n.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  HOME — landing / today's view
// ════════════════════════════════════════════════════════════
function HomeScreen({ go }) {
  return (
    <div style={{ background: T.surface950, color: T.ink }}>
      <TopBar leftLogo title="craft." right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{
            width: 36, height: 36, borderRadius: 999, position: 'relative',
            background: 'transparent', border: 'none', color: T.ink2, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {Ico.bell()}
            <span style={{
              position: 'absolute', top: 8, right: 9,
              width: 7, height: 7, borderRadius: '50%', background: T.accent,
            }} />
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: T.surface800, border: `1px solid ${T.surface600}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.serif, fontSize: 14, color: T.ink,
          }}>A</div>
        </div>
      } />

      <div style={{ padding: '12px 14px 8px' }}>
        <ChannelPill />
      </div>

      {/* Hero greeting */}
      <div style={{ padding: '8px 18px 4px' }}>
        <MonoLabel>Tuesday · 9:30</MonoLabel>
        <h1 style={{
          fontFamily: T.serif, fontSize: 38, fontWeight: 400, lineHeight: 0.98,
          letterSpacing: '-0.02em', color: T.ink, margin: '6px 0 4px',
        }}>
          Morning, <em style={{ color: T.accent2, fontStyle: 'italic' }}>Alex</em>.<br/>
          3 things waiting.
        </h1>
        <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink3, lineHeight: 1.45 }}>
          One script needs review, two episodes are mid-pipeline.
        </div>
      </div>

      {/* Stage rail */}
      <div style={{ padding: '14px 14px 4px' }}>
        <MonoLabel style={{ marginBottom: 10, paddingLeft: 4 }}>Stage</MonoLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <StageTile label="Discover" sub="Find inspiration" count="—" tint="highlight" icon={Ico.search(18)} onClick={() => go('discover')} />
          <StageTile label="Ideas"    sub="12 active" count="12" tint="accent" icon={Ico.spark(18)} onClick={() => go('ideas')} />
          <StageTile label="Scripts"  sub="2 in review" count="2"  tint="warning" icon={Ico.doc(18)} onClick={() => go('scripts')} />
          <StageTile label="Episodes" sub="3 cooking"   count="3"  tint="accent" icon={Ico.film(18)} onClick={() => go('episodes')} />
        </div>
      </div>

      {/* Live pipeline */}
      <div style={{ padding: '18px 14px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, paddingLeft: 4 }}>
          <MonoLabel>Live now</MonoLabel>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.accent2 }}>● 2 jobs running</span>
        </div>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Pill color="accent">long</Pill>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>ep · 04 · ott-otter-physics</span>
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 19, lineHeight: 1.2, color: T.ink }}>
              Why otters hold hands while sleeping
            </div>
            <PipelineStrip current={3} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 12, color: T.ink3 }}>
              <div style={{ width: 14, height: 14, borderTop: `2px solid ${T.accent2}`, borderRight: `2px solid transparent`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontFamily: T.sans }}>Storyboarder · iteration 2 of 3</span>
              <span style={{ marginLeft: 'auto', fontFamily: T.mono, color: T.ink4 }}>0:42 elapsed</span>
            </div>
          </div>
        </Card>

        <div style={{ height: 8 }} />

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 14px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Pill color="short">short</Pill>
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>ep · 17 · sea-otter-tools</span>
            </div>
            <div style={{ fontFamily: T.serif, fontSize: 19, lineHeight: 1.2, color: T.ink }}>
              The rock under their armpit
            </div>
            <PipelineStrip current={5} warn />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 12, color: T.warning }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.warning }} />
              <span style={{ fontFamily: T.sans }}>Producer flagged audio · needs review</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '18px 14px 24px' }}>
        <MonoLabel style={{ marginBottom: 10, paddingLeft: 4 }}>Quick</MonoLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Btn kind="primary" size="md" icon={Ico.spark()} onClick={() => go('ideas')}>Generate ideas</Btn>
          <Btn kind="secondary" size="md" icon={Ico.search()} onClick={() => go('discover')}>Search YouTube</Btn>
          <Btn kind="secondary" size="md" icon={Ico.plus()} onClick={() => go('script')}>New script</Btn>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function StageTile({ label, sub, count, tint, icon, onClick }) {
  const tintColor = tint === 'highlight' ? T.highlight : tint === 'warning' ? T.warning : T.accent2;
  return (
    <Card onClick={onClick} style={{
      padding: 14, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ color: tintColor, marginBottom: 10 }}>{icon}</div>
      <div style={{
        fontFamily: T.serif, fontSize: 28, fontWeight: 400,
        color: T.ink, lineHeight: 1, marginBottom: 4,
      }}>{count}</div>
      <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, marginTop: 2 }}>{sub}</div>
    </Card>
  );
}

const PIPELINE_STAGES = ['research', 'script', 'storyboard', 'assets', 'export', 'review', 'publish'];
function PipelineStrip({ current = 0, warn }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
      {PIPELINE_STAGES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} style={{ flex: 1 }}>
            <div style={{
              height: 4, borderRadius: 2,
              background: done ? T.accent : active ? (warn ? T.warning : T.accent2) : T.surface700,
              opacity: active ? 1 : done ? 0.7 : 1,
            }} />
            <div style={{
              fontFamily: T.mono, fontSize: 8, marginTop: 3,
              color: done ? T.ink3 : active ? (warn ? T.warning : T.accent2) : T.ink4,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>{s.slice(0, 4)}</div>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  IDEAS
// ════════════════════════════════════════════════════════════
const IDEAS = [
  { id: 1, type: 'long', title: 'Why otters hold hands while sleeping', hook: 'They don\'t want to drift apart in the night.', source: 'ai', model: 'gemini 2.5 pro', age: '12m', tags: ['biology', 'behavior'] },
  { id: 2, type: 'short', title: 'The rock under their armpit', hook: 'Each otter keeps a favorite tool in a chest pocket.', source: 'discover', views: 2_400_000, age: '2h', tags: ['tools'] },
  { id: 3, type: 'long', title: 'Sea urchins are losing the war', hook: 'One predator, no replacement. The kelp is paying.', source: 'ai', model: 'claude sonnet 4.5', age: '4h', tags: ['ecology', 'kelp'] },
  { id: 4, type: 'short', title: 'They sleep in rafts of 100', hook: 'Floating dorms, with assigned roles.', source: 'manual', age: '1d', tags: ['behavior'] },
  { id: 5, type: 'long', title: 'How a single otter saved a forest', hook: 'It\'s not the otter — it\'s the cascade.', source: 'discover', views: 480_000, age: '2d', tags: ['ecology'] },
  { id: 6, type: 'short', title: 'Their fur is denser than human hair × 1000', hook: '1 million strands per square inch.', source: 'ai', model: 'gemini 2.5 flash', age: '3d', tags: ['biology'] },
];

function IdeasScreen({ go }) {
  const [filter, setFilter] = useState('all');
  const [contentType, setContentType] = useState('long');
  const [generating, setGenerating] = useState(false);
  const [focused, setFocused] = useState(null);

  const filtered = IDEAS.filter(i => filter === 'all' || i.type === filter);

  if (focused) return <IdeaFocusScreen idea={focused} onBack={() => setFocused(null)} go={go} />;

  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={() => go('home')} title="Ideas." right={
        <Btn kind="ghost" size="sm" icon={Ico.filter()}>Sort</Btn>
      } />

      <div style={{ padding: '10px 14px 4px' }}>
        <ChannelPill />
      </div>

      {/* Filter rail */}
      <div style={{
        padding: '10px 14px', display: 'flex', gap: 6, overflowX: 'auto',
        borderBottom: `1px solid ${T.surface800}`,
      }}>
        {[
          { id: 'all',   label: 'All',     count: 12 },
          { id: 'long',  label: 'Long',    count: 7 },
          { id: 'short', label: 'Shorts',  count: 5 },
        ].map(f => (
          <Tag key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label} <span style={{ color: T.ink4, marginLeft: 3 }}>{f.count}</span>
          </Tag>
        ))}
        <span style={{ width: 1, background: T.surface600, margin: '0 4px' }} />
        {['biology', 'ecology', 'behavior', 'kelp', 'tools'].map(t => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      {/* Generate strip */}
      <div style={{ padding: '12px 14px 10px' }}>
        <div style={{
          background: T.surface900, border: `1px dashed ${T.surface500}`,
          borderRadius: 12, padding: '10px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ color: T.accent2 }}>{Ico.spark()}</span>
            <MonoLabel>Generate · context (optional)</MonoLabel>
            <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 9, color: T.ink4 }}>gemini · 2.5 pro</span>
          </div>
          <input placeholder="e.g. trending: kelp forests" style={{
            width: '100%', background: 'transparent', border: 'none',
            color: T.ink, fontFamily: T.sans, fontSize: 13, outline: 'none',
            marginBottom: 10,
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex', borderRadius: 6, overflow: 'hidden',
              border: `1px solid ${T.surface600}`,
            }}>
              <button onClick={() => setContentType('short')} style={{
                padding: '5px 10px',
                background: contentType === 'short' ? T.short : 'transparent',
                color: contentType === 'short' ? T.surface950 : T.ink2,
                border: 'none', fontFamily: T.sans, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}>Shorts</button>
              <button onClick={() => setContentType('long')} style={{
                padding: '5px 10px',
                background: contentType === 'long' ? T.accent : 'transparent',
                color: contentType === 'long' ? '#001a17' : T.ink2,
                border: 'none', fontFamily: T.sans, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}>Long</button>
            </div>
            <Btn kind="primary" size="sm" icon={Ico.spark()} disabled={generating}
                 onClick={() => { setGenerating(true); setTimeout(() => setGenerating(false), 1200); }}
                 style={{ marginLeft: 'auto' }}>
              {generating ? 'Generating…' : 'Generate 5'}
            </Btn>
          </div>
        </div>
      </div>

      {/* Ideas list — table-like rows */}
      <div style={{ padding: '4px 12px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: T.surface600, borderRadius: 10, overflow: 'hidden' }}>
          {filtered.map(idea => (
            <div key={idea.id} onClick={() => setFocused(idea)} style={{
              padding: '11px 12px', background: T.surface900, cursor: 'pointer',
              borderLeft: `2px solid transparent`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Pill color={idea.type === 'short' ? 'short' : 'accent'}>{idea.type}</Pill>
                {idea.source === 'ai' && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.accent2 }}>✦ {idea.model}</span>}
                {idea.source === 'discover' && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.highlight }}>⊕ {idea.views?.toLocaleString()} views</span>}
                {idea.source === 'manual' && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>✎ manual</span>}
                <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 10, color: T.ink4 }}>{idea.age}</span>
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.ink, marginBottom: 2 }}>
                {idea.title}
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 13, fontStyle: 'italic', color: T.ink3, lineHeight: 1.3 }}>
                "{idea.hook}"
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', padding: '14px 0 4px', fontFamily: T.mono, fontSize: 10, color: T.ink4 }}>
          · · {filtered.length} of {IDEAS.length} shown · ·
        </div>
      </div>
    </div>
  );
}

function IdeaFocusScreen({ idea, onBack, go }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={onBack} title="" right={
        <div style={{ display: 'flex', gap: 4 }}>
          <Btn kind="ghost" size="sm" icon={Ico.edit()}>Edit</Btn>
          <Btn kind="ghost" size="sm" icon={Ico.trash()} style={{ color: T.danger }}/>
        </div>
      } />
      <div style={{ padding: '6px 18px 24px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
          <Pill color={idea.type === 'short' ? 'short' : 'accent'}>{idea.type}</Pill>
          {idea.source === 'ai' && <Pill color="accent">ai · {idea.model}</Pill>}
          {idea.source === 'discover' && <Pill color="highlight">discover</Pill>}
        </div>
        <h1 style={{
          fontFamily: T.serif, fontSize: 32, fontWeight: 400,
          lineHeight: 1.05, letterSpacing: '-0.02em', color: T.ink,
          margin: '0 0 12px',
        }}>{idea.title}</h1>
        <p style={{
          fontFamily: T.serif, fontSize: 18, fontStyle: 'italic',
          color: T.ink2, lineHeight: 1.45, margin: '0 0 20px',
        }}>"{idea.hook}"</p>

        <Section label="Angle">
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink2, lineHeight: 1.55 }}>
            Open with a tight underwater shot of two otters drifting apart, then snap-cut to the resolution: they reach for each other in their sleep. The science follows — kelp anchors, raft formation, why physical proximity matters when the current never stops.
          </p>
        </Section>

        <Section label="Tags">
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {idea.tags.map(t => <Tag key={t}>{t}</Tag>)}
          </div>
        </Section>

        {idea.source === 'discover' && (
          <Section label="Source metrics">
            <div style={{ display: 'flex', gap: 14, fontFamily: T.mono, fontSize: 11, color: T.ink3 }}>
              <span>0:48</span>
              <span>{idea.views?.toLocaleString()} views</span>
              <span>{(idea.views * 0.08 | 0).toLocaleString()} likes</span>
              <span>3 days ago</span>
            </div>
          </Section>
        )}

        <div style={{
          position: 'sticky', bottom: 0, paddingTop: 12,
          background: `linear-gradient(to top, ${T.surface950} 60%, transparent)`,
          display: 'flex', gap: 8,
        }}>
          <Btn kind="primary" size="lg" icon={Ico.doc(15)} onClick={() => go('script')} style={{ flex: 1, justifyContent: 'center' }}>
            Convert to script
          </Btn>
          <Btn kind="secondary" size="lg" icon={Ico.bolt()} onClick={() => go('episodes')}>YOLO</Btn>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ paddingTop: 14, borderTop: `1px solid ${T.surface700}`, marginTop: 14 }}>
      <MonoLabel style={{ marginBottom: 8 }}>{label}</MonoLabel>
      {children}
    </div>
  );
}

Object.assign(window, { T, Ico, MonoLabel, Pill, Tag, Btn, Card, Divider, ChannelPill, TopBar, BottomNav, NAV_ITEMS, HomeScreen, IdeasScreen, IdeaFocusScreen, Section, PipelineStrip });
