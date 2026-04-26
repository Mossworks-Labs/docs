/* eslint-disable */
// More screens: Discover, Scripts, Script Editor, Episodes, Audio, Resources,
// Proposals, Jobs, Login, Settings, More, Endpoints (refactor appendix).

const { useState: useS2 } = React;

// ════════════════════════════════════════════════════════════
//  DISCOVER
// ════════════════════════════════════════════════════════════
const DISCOVER_RESULTS = [
  { id: 1, title: 'A sea otter cracks open dinner', channel: 'Monterey Bay Aquarium', views: 4_200_000, vph: 1240, dur: '0:58', subs: 2_100_000, outlier: 5, type: 'short', thumb: 1 },
  { id: 2, title: 'Why kelp forests are dying off the California coast', channel: 'Lab Notes', views: 890_000, vph: 410, dur: '14:22', subs: 84_000, outlier: 12, type: 'long', thumb: 2 },
  { id: 3, title: 'The otter that stole 14 surfboards', channel: 'KQED Science', views: 12_400_000, vph: 2200, dur: '8:11', subs: 660_000, outlier: 50, type: 'long', thumb: 3 },
  { id: 4, title: 'I dove with otters for 100 days', channel: 'Pacific Wild', views: 220_000, vph: 90, dur: '11:04', subs: 14_500, outlier: 8, type: 'long', thumb: 4 },
];

function DiscoverScreen({ go }) {
  const [q, setQ] = useS2('sea otters');
  const [outlier, setOutlier] = useS2(5);
  const [maxSubs, setMaxSubs] = useS2('1M');
  const [duration, setDuration] = useS2('any');

  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar leftLogo title="Discover." subtitle="14 sources · yt-dlp · live" right={
        <Btn kind="ghost" size="sm" icon={Ico.filter()}>Filters</Btn>
      } />

      {/* Search */}
      <div style={{ padding: '12px 14px 8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: T.surface900, border: `1px solid ${T.surface600}`,
          borderRadius: 10, padding: '10px 12px',
        }}>
          <span style={{ color: T.ink3 }}>{Ico.search(16)}</span>
          <input value={q} onChange={e => setQ(e.target.value)} style={{
            flex: 1, background: 'transparent', border: 'none', color: T.ink,
            fontFamily: T.sans, fontSize: 14, outline: 'none',
          }} />
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink4 }}>4 results</span>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '4px 14px 12px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        <Tag active>relevance</Tag>
        <Tag>views</Tag>
        <Tag>date</Tag>
        <span style={{ width: 1, background: T.surface600 }} />
        {['any', 'short', 'medium', 'long'].map(d => (
          <Tag key={d} active={duration === d} onClick={() => setDuration(d)}>{d}</Tag>
        ))}
        <span style={{ width: 1, background: T.surface600 }} />
        {['100K', '1M', '10M'].map(s => (
          <Tag key={s} active={maxSubs === s} onClick={() => setMaxSubs(s)}>≤{s} subs</Tag>
        ))}
      </div>

      {/* Outlier slider */}
      <div style={{ padding: '0 14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MonoLabel>Outlier ≥ {outlier}×</MonoLabel>
          <div style={{ flex: 1, height: 4, background: T.surface700, borderRadius: 2, position: 'relative' }}>
            <div style={{ width: `${(outlier / 50) * 100}%`, height: '100%', background: T.accent, borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: `calc(${(outlier / 50) * 100}% - 7px)`, top: -5, width: 14, height: 14, background: T.accent2, borderRadius: '50%' }} />
          </div>
          <Pill color={outlier >= 50 ? 'danger' : outlier >= 10 ? 'warning' : 'success'}>{outlier}×</Pill>
        </div>
      </div>

      {/* Channel strip */}
      <div style={{ padding: '0 14px 12px' }}>
        <MonoLabel style={{ marginBottom: 8 }}>Channels in results · 4</MonoLabel>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { name: 'Monterey Bay Aq.', subs: '2.1M', count: 1, active: true },
            { name: 'Lab Notes', subs: '84K', count: 1 },
            { name: 'KQED Science', subs: '660K', count: 1 },
            { name: 'Pacific Wild', subs: '14.5K', count: 1 },
          ].map(c => (
            <div key={c.name} onClick={() => go('channel-deep')} style={{
              flexShrink: 0, padding: '8px 10px', borderRadius: 8,
              background: c.active ? T.highlightDim : T.surface900,
              border: `1px solid ${c.active ? 'rgba(167,139,250,0.32)' : T.surface600}`,
              cursor: 'pointer', minWidth: 120,
            }}>
              <div style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.ink, marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>{c.subs} · {c.count} hit</div>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: '0 14px 100px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DISCOVER_RESULTS.map(r => (
          <Card key={r.id} onClick={() => go('video-deep')}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{
                width: 96, height: 64, borderRadius: 6, flexShrink: 0,
                background: `linear-gradient(135deg, hsl(${r.thumb * 60} 30% 22%), hsl(${r.thumb * 60 + 40} 40% 14%))`,
                position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
              }}>
                <span style={{
                  margin: 4, padding: '1px 4px', borderRadius: 3,
                  background: 'rgba(0,0,0,0.7)', color: T.ink,
                  fontFamily: T.mono, fontSize: 9, fontWeight: 600,
                }}>{r.dur}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: T.sans, fontSize: 13, fontWeight: 500, color: T.ink,
                  lineHeight: 1.3, marginBottom: 4,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{r.title}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, marginBottom: 4 }}>
                  {r.channel} · {r.subs >= 1e6 ? `${(r.subs/1e6).toFixed(1)}M` : `${(r.subs/1e3).toFixed(0)}K`} subs
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Pill color={r.outlier >= 50 ? 'danger' : r.outlier >= 10 ? 'warning' : 'success'}>{r.outlier}×</Pill>
                  <Pill color="highlight">{r.vph} vph</Pill>
                  <Pill color="neutral">{(r.views / 1e6).toFixed(1)}M views</Pill>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ──── Channel deep dive ────
function ChannelDeepScreen({ go, onBack }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={onBack} title="" />
      <div style={{ padding: '4px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${T.accent}, ${T.highlight})` }} />
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 24, lineHeight: 1, color: T.ink }}>Monterey Bay Aquarium</div>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3, marginTop: 4 }}>2.1M subs · 1.4K videos · 12 yrs</div>
          </div>
        </div>

        {/* Stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
          {[
            { k: 'Avg views',     v: '480K', sub: 'last 30 days' },
            { k: 'Upload freq.',  v: '2.4/wk' },
            { k: 'Engagement',    v: '8.2%' },
            { k: 'Growth',        v: '+1.2K/d', good: true },
          ].map((s, i) => (
            <div key={i} style={{
              background: T.surface900, border: `1px solid ${T.surface600}`,
              borderRadius: 8, padding: '10px 12px',
            }}>
              <MonoLabel>{s.k}</MonoLabel>
              <div style={{ fontFamily: T.serif, fontSize: 22, color: s.good ? T.accent2 : T.ink, marginTop: 2 }}>{s.v}</div>
              {s.sub && <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink4 }}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Earnings card */}
        <Card style={{ marginBottom: 14, padding: 14, borderColor: T.accentBorder, background: 'linear-gradient(180deg, rgba(13,148,136,0.10), transparent 70%)' }}>
          <MonoLabel style={{ color: T.accent2 }}>Estimated earnings · RPM $4.50</MonoLabel>
          <div style={{ fontFamily: T.serif, fontSize: 32, color: T.ink, lineHeight: 1, marginTop: 6 }}>$8.4K – $14.2K</div>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3, marginTop: 4 }}>monthly · per video: $1.8K – $3.1K</div>
        </Card>

        {/* Health bar */}
        <MonoLabel style={{ marginBottom: 8 }}>Content mix</MonoLabel>
        <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ width: '64%', background: T.accent }} />
          <div style={{ width: '36%', background: T.short }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 10, color: T.ink3, marginBottom: 18 }}>
          <span>64% long-form</span><span>36% shorts</span>
        </div>

        <MonoLabel style={{ marginBottom: 8 }}>Recent uploads</MonoLabel>
        {[
          { t: 'Octopus solves Rubik\'s cube', vph: 3400, d: '0:42', type: 'short' },
          { t: 'Why jellyfish never sleep',     vph: 1100, d: '12:08', type: 'long' },
          { t: 'A sea otter cracks open dinner', vph: 1240, d: '0:58', type: 'short' },
        ].map((v, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${T.surface800}` }}>
            <Pill color={v.type === 'short' ? 'short' : 'accent'}>{v.type}</Pill>
            <div style={{ flex: 1, fontFamily: T.sans, fontSize: 13, color: T.ink }}>{v.t}</div>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.highlight }}>{v.vph} vph</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────  Video deep dive ────
function VideoDeepScreen({ go, onBack }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={onBack} title="" right={<Btn kind="ghost" size="sm" icon={Ico.ext()}>Open</Btn>} />
      <div style={{
        height: 200, background: `linear-gradient(135deg, hsl(180 30% 22%), hsl(220 40% 14%))`,
        margin: '0 14px', borderRadius: 12, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink,
        }}>{Ico.play(22)}</div>
      </div>
      <div style={{ padding: '14px 18px 24px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          <Pill color="short">short</Pill>
          <Pill color="danger">50× outlier</Pill>
        </div>
        <h1 style={{ fontFamily: T.serif, fontSize: 26, lineHeight: 1.1, margin: '0 0 10px', color: T.ink }}>
          The otter that stole 14 surfboards
        </h1>
        <div style={{ display: 'flex', gap: 14, fontFamily: T.mono, fontSize: 11, color: T.ink3, marginBottom: 14 }}>
          <span>12.4M views</span><span>820K likes</span><span>8:11</span><span>3 days</span>
        </div>
        <Section label="Description">
          <p style={{ fontFamily: T.sans, fontSize: 13, color: T.ink2, lineHeight: 1.5 }}>
            Joon, a wild sea otter on the California coast, has stolen 14 surfboards from local surfers since 2023. KQED Science follows the chase…
          </p>
        </Section>
        <Section label="Transcript">
          <div style={{
            fontFamily: T.mono, fontSize: 11, color: T.ink3, lineHeight: 1.6,
            maxHeight: 120, overflow: 'hidden', position: 'relative',
          }}>
            00:00 — She came out of nowhere. I was paddling, minding my own business, and then I see this little face right next to my board…
            00:14 — Wildlife officials are tracking Joon, a 5-year-old sea otter who has developed a taste for surfboards…
            <div style={{ position: 'absolute', inset: 'auto 0 0 0', height: 60, background: `linear-gradient(to bottom, transparent, ${T.surface950})` }} />
          </div>
        </Section>
        <div style={{ display: 'flex', gap: 8, paddingTop: 16 }}>
          <Btn kind="primary" size="lg" icon={Ico.spark(15)} onClick={() => go('ideas')} style={{ flex: 1, justifyContent: 'center' }}>
            Inspire idea
          </Btn>
          <Btn kind="secondary" size="lg" icon={Ico.copy()} />
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  SCRIPTS
// ════════════════════════════════════════════════════════════
const SCRIPTS = [
  { id: 1, title: 'Why otters hold hands while sleeping', type: 'long', status: 'review',  words: 1483, target: 1500, age: '12m' },
  { id: 2, title: 'The rock under their armpit',           type: 'short', status: 'final',  words: 152,  target: 150,  age: '2h' },
  { id: 3, title: 'Sea urchins are losing the war',        type: 'long', status: 'draft',   words: 412,  target: 1500, age: '4h' },
  { id: 4, title: 'They sleep in rafts of 100',             type: 'short', status: 'draft',  words: 0,    target: 150,  age: '1d' },
];

const STATUS_COLORS = { draft: 'neutral', review: 'warning', final: 'success' };

function ScriptsScreen({ go }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={() => go('home')} title="Scripts." right={
        <Btn kind="primary" size="sm" icon={Ico.plus()}>New</Btn>
      } />
      <div style={{ padding: '10px 14px 4px' }}>
        <ChannelPill />
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', gap: 6, borderBottom: `1px solid ${T.surface800}` }}>
        <Tag active>All <span style={{ color: T.ink4, marginLeft: 3 }}>4</span></Tag>
        <Tag>Draft 2</Tag>
        <Tag>Review 1</Tag>
        <Tag>Final 1</Tag>
      </div>
      <div style={{ padding: '12px 14px 100px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SCRIPTS.map(s => {
          const pct = Math.min(1, s.words / s.target);
          return (
            <Card key={s.id} onClick={() => go('script-edit')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Pill color={s.type === 'short' ? 'short' : 'accent'}>{s.type}</Pill>
                <Pill color={STATUS_COLORS[s.status]}>{s.status}</Pill>
                <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 10, color: T.ink4 }}>{s.age}</span>
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 18, lineHeight: 1.2, color: T.ink, marginBottom: 8 }}>{s.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 3, background: T.surface700, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${pct * 100}%`, height: '100%', background: pct >= 0.95 ? T.success : T.accent }} />
                </div>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>
                  {s.words} / {s.target} words
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ──── Script editor ────
function ScriptEditScreen({ go, onBack }) {
  const [tool, setTool] = useS2(null);
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={onBack} title="" right={
        <Btn kind="primary" size="sm">Save</Btn>
      } />
      <div style={{ padding: '4px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Pill color="accent">long</Pill>
          <Pill color="warning">review</Pill>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.accent2, marginLeft: 'auto' }}>● auto-saved 12s ago</span>
        </div>
        <h1 style={{ fontFamily: T.serif, fontSize: 26, lineHeight: 1.1, margin: '0 0 6px', color: T.ink }}>
          Why otters hold hands while sleeping
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 3, background: T.surface700, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '99%', height: '100%', background: T.success }} />
          </div>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3 }}>1,483 / 1,500</span>
        </div>
      </div>

      {/* Tool rail */}
      <div style={{ padding: '6px 12px 8px', display: 'flex', gap: 6, overflowX: 'auto', borderBottom: `1px solid ${T.surface800}` }}>
        {[
          { id: 'revise',    label: 'Revise',     icon: Ico.spark() },
          { id: 'polish',    label: 'Polish',     icon: Ico.bolt() },
          { id: 'fact',      label: 'Fact-check', icon: Ico.check() },
          { id: 'human',     label: 'Humanize',   icon: Ico.user() },
        ].map(t => (
          <button key={t.id} onClick={() => setTool(t.id === tool ? null : t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 10px', borderRadius: 6,
            background: tool === t.id ? T.accentDim : T.surface900,
            border: `1px solid ${tool === t.id ? T.accentBorder : T.surface600}`,
            color: tool === t.id ? T.accent2 : T.ink2,
            fontFamily: T.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Editor body */}
      <div style={{ padding: '14px 18px 100px', fontFamily: T.serif, fontSize: 16, lineHeight: 1.7, color: T.ink2 }}>
        <p style={{ margin: '0 0 14px' }}>
          <span style={{ color: T.ink, fontWeight: 500 }}>Two otters drift in the kelp.</span> The current never stops. Neither do they.
        </p>
        <p style={{ margin: '0 0 14px' }}>
          <em style={{ color: T.ink3, fontStyle: 'italic' }}>[underwater wide shot — golden hour through the canopy]</em>
        </p>
        <p style={{ margin: '0 0 14px' }}>
          What you're watching is a behavior so reliable that biologists named it: <span style={{ background: 'rgba(167,139,250,0.16)', padding: '0 2px', borderRadius: 2 }}>rafting<sup style={{ fontSize: 10, color: T.highlight, marginLeft: 2 }}>[1]</sup></span>. A sea otter raft is exactly what it sounds like — a floating dorm, anchored together by held paws.
        </p>
        <p style={{ margin: '0 0 14px', background: tool === 'human' ? 'rgba(13,148,136,0.10)' : 'transparent', padding: tool === 'human' ? '8px' : 0, borderRadius: 6, position: 'relative' }}>
          {tool === 'human' && (
            <div style={{ position: 'absolute', top: -10, left: 8, fontFamily: T.mono, fontSize: 9, padding: '1px 5px', background: T.accent, color: T.surface950, borderRadius: 3 }}>HUMANIZE · suggested</div>
          )}
          But here's the thing — and this is the part that genuinely surprised me when I first read it — the hand-holding isn't sentimental. It's load-bearing engineering. A drifting otter is a dead otter.
        </p>
      </div>

      {/* Tool overlay */}
      {tool === 'fact' && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: T.surface900, border: `1px solid ${T.surface600}`,
          borderRadius: '14px 14px 0 0', padding: 14,
          maxHeight: '52%', overflowY: 'auto',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <MonoLabel style={{ color: T.accent2 }}>Fact check · 4 claims</MonoLabel>
            <Btn kind="ghost" size="sm" onClick={() => setTool(null)} style={{ marginLeft: 'auto' }}>Done</Btn>
          </div>
          {[
            { v: 'verified',   t: 'Sea otters hold paws while sleeping', src: 'Monterey Bay · 2019' },
            { v: 'verified',   t: 'Rafts can exceed 100 individuals',    src: 'NOAA Fisheries' },
            { v: 'unverified', t: 'Otters keep tools in chest pocket',   src: 'no source found' },
            { v: 'opinion',    t: '"Genuinely surprised me"',             src: '— editorial' },
          ].map((c, i) => {
            const map = { verified: 'success', unverified: 'warning', opinion: 'neutral', disputed: 'danger' };
            return (
              <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${T.surface800}`, display: 'flex', gap: 8 }}>
                <Pill color={map[c.v]}>{c.v}</Pill>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.sans, fontSize: 12, color: T.ink, marginBottom: 2 }}>{c.t}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>{c.src}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky bottom action */}
      <div style={{
        position: 'sticky', bottom: 0,
        padding: 12,
        background: `linear-gradient(to top, ${T.surface950} 70%, transparent)`,
        display: 'flex', gap: 8,
      }}>
        <Btn kind="primary" size="lg" icon={Ico.audio()} onClick={() => go('audio-create')} style={{ flex: 1, justifyContent: 'center' }}>
          Send to audio
        </Btn>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  EPISODES (board view)
// ════════════════════════════════════════════════════════════
const EPISODES = [
  { id: 1, title: 'Otter hand-holding',    stage: 3, status: 'running',  type: 'long',  iter: '2/3' },
  { id: 2, title: 'Rock under armpit',     stage: 5, status: 'flagged',  type: 'short' },
  { id: 3, title: 'Urchin war',            stage: 1, status: 'queued',   type: 'long' },
  { id: 4, title: 'Rafts of 100',          stage: 6, status: 'final',    type: 'short' },
  { id: 5, title: 'Single otter, forest',  stage: 0, status: 'idea',     type: 'long' },
];

function EpisodesScreen({ go }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={() => go('home')} title="Episodes." right={
        <Btn kind="primary" size="sm" icon={Ico.bolt()}>YOLO</Btn>
      } />
      <div style={{ padding: '10px 14px 4px' }}>
        <ChannelPill />
      </div>
      <div style={{ padding: '12px 14px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {EPISODES.map(e => {
          const statusMap = {
            running: { color: T.accent2, label: 'running' },
            flagged: { color: T.warning, label: 'needs review' },
            queued:  { color: T.ink3,    label: 'queued' },
            final:   { color: T.success, label: 'ready to publish' },
            idea:    { color: T.ink4,    label: 'idea' },
          }[e.status];
          return (
            <Card key={e.id} onClick={() => go('episode-detail')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Pill color={e.type === 'short' ? 'short' : 'accent'}>{e.type}</Pill>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: statusMap.color, marginLeft: 'auto' }}>● {statusMap.label}</span>
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 18, lineHeight: 1.15, color: T.ink, marginBottom: 10 }}>{e.title}</div>
              <PipelineStrip current={e.stage} warn={e.status === 'flagged'} />
              {e.iter && (
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, marginTop: 8 }}>
                  Storyboarder · iteration {e.iter}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function EpisodeDetailScreen({ onBack, go }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={onBack} title="" right={<Btn kind="ghost" size="sm" icon={Ico.more()} />} />
      <div style={{ padding: '4px 18px 24px' }}>
        <Pill color="accent" style={{ marginBottom: 8 }}>long · iteration 2/3</Pill>
        <h1 style={{ fontFamily: T.serif, fontSize: 26, lineHeight: 1.1, margin: '0 0 14px', color: T.ink }}>
          Why otters hold hands while sleeping
        </h1>

        <PipelineStrip current={3} />

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { k: 'research',   s: 'done',    score: 9,  by: 'Researcher' },
            { k: 'script',     s: 'done',    score: 8,  by: 'Writer' },
            { k: 'storyboard', s: 'running', score: '—', by: 'Storyboarder' },
            { k: 'assets',     s: 'queued' },
            { k: 'export',     s: 'queued' },
            { k: 'review',     s: 'queued' },
            { k: 'publish',    s: 'queued' },
          ].map((row, i) => {
            const tone = row.s === 'done' ? T.success
              : row.s === 'running' ? T.accent2
              : T.ink4;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8,
                background: row.s === 'running' ? T.surface800 : T.surface900,
                border: `1px solid ${row.s === 'running' ? T.accentBorder : T.surface600}`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: tone, flexShrink: 0 }} />
                <div style={{ fontFamily: T.sans, fontSize: 13, color: T.ink, fontWeight: 500, textTransform: 'capitalize', flex: 1 }}>{row.k}</div>
                {row.by && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>{row.by}</span>}
                {row.score && row.score !== '—' && <Pill color={row.score >= 7 ? 'success' : 'warning'}>{row.score}/10</Pill>}
                {row.s === 'running' && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.accent2 }}>● live</span>}
                {row.s === 'queued' && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink4 }}>queued</span>}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 18 }}>
          <MonoLabel style={{ marginBottom: 8 }}>Producer notes · iteration 2</MonoLabel>
          <div style={{
            padding: 12, background: T.surface900, borderRadius: 8,
            border: `1px solid ${T.surface600}`,
            fontFamily: T.serif, fontSize: 14, fontStyle: 'italic', color: T.ink2, lineHeight: 1.5,
          }}>
            Storyboard scored 6/10 — beat 4 lacks visual variety, suggest cutting to a wide shot of the raft. Re-running with notes attached.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <Btn kind="secondary" size="lg" style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
          <Btn kind="primary" size="lg" icon={Ico.eye()} onClick={() => go('audio-create')} style={{ flex: 1, justifyContent: 'center' }}>Open script</Btn>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  AUDIO PRODUCTION
// ════════════════════════════════════════════════════════════
function AudioScreen({ go }) {
  const [voice, setVoice] = useS2('alloy');
  const [genIdx, setGenIdx] = useS2(-1);

  const sections = [
    { id: 1, kind: 'speech', text: 'Two otters drift in the kelp. The current never stops.', dur: '0:08', state: 'done' },
    { id: 2, kind: 'sfx',    text: 'soft underwater ambient', dur: '0:02', state: 'done' },
    { id: 3, kind: 'speech', text: 'What you\'re watching is a behavior so reliable that biologists named it: rafting.', dur: '0:11', state: 'done' },
    { id: 4, kind: 'speech', text: 'A sea otter raft is exactly what it sounds like — a floating dorm.', dur: '0:09', state: 'pending' },
    { id: 5, kind: 'speech', text: 'But here\'s the thing — the hand-holding isn\'t sentimental.', dur: '0:07', state: 'pending' },
  ];

  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={() => go('home')} title="Audio." right={
        <Btn kind="primary" size="sm" icon={Ico.bolt()}>Render all</Btn>
      } />

      {/* Voice strip */}
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${T.surface800}` }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
          <MonoLabel>Provider</MonoLabel>
          <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>· 2 of 5 sections rendered</span>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {[
            { id: 'edge',     label: 'Edge TTS',   sub: 'free · 300+', active: false },
            { id: 'eleven',   label: 'ElevenLabs', sub: 'premium',     active: true },
            { id: 'openai',   label: 'OpenAI',     sub: 'HD · 6 voices' },
            { id: 'oas',      label: 'OpenedAI',   sub: 'GPU · local' },
          ].map(p => (
            <div key={p.id} style={{
              flexShrink: 0, padding: '8px 12px', borderRadius: 8,
              background: p.active ? T.accentDim : T.surface900,
              border: `1px solid ${p.active ? T.accentBorder : T.surface600}`,
              minWidth: 110, cursor: 'pointer',
            }}>
              <div style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: p.active ? T.accent2 : T.ink, marginBottom: 2 }}>{p.label}</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.ink3 }}>{p.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice + tuning */}
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${T.surface800}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <MonoLabel style={{ marginBottom: 4 }}>Voice</MonoLabel>
            <div style={{ fontFamily: T.serif, fontSize: 18, color: T.ink }}>Bella · narration</div>
          </div>
          <Btn kind="secondary" size="sm" icon={Ico.play()}>Test</Btn>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <Slider label="Stability" value={0.65} />
          <Slider label="Similarity" value={0.78} />
          <Slider label="Pause" value={0.4} unit="s" />
        </div>
      </div>

      {/* Sections */}
      <div style={{ padding: '12px 14px 100px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sections.map((s, i) => {
          const isSfx = s.kind === 'sfx';
          const isGen = genIdx === i;
          return (
            <div key={s.id} style={{
              padding: '10px 12px', borderRadius: 8,
              background: isSfx ? 'rgba(167,139,250,0.06)' : T.surface900,
              border: `1px solid ${isSfx ? 'rgba(167,139,250,0.18)' : T.surface600}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                {isSfx ? <Pill color="highlight">sfx</Pill> : <Pill color="accent">{i + 1}</Pill>}
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>{s.dur}</span>
                {s.state === 'done' && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.success }}>● rendered</span>}
                {s.state === 'pending' && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>○ pending</span>}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  {s.state === 'done' && (
                    <button style={{ width: 28, height: 28, border: 'none', background: T.surface800, color: T.ink2, borderRadius: 999, cursor: 'pointer' }}>{Ico.play(12)}</button>
                  )}
                  <button style={{ width: 28, height: 28, border: 'none', background: T.surface800, color: T.ink2, borderRadius: 999, cursor: 'pointer' }}>{Ico.mic(13)}</button>
                </div>
              </div>
              <div style={{
                fontFamily: isSfx ? T.mono : T.serif,
                fontSize: isSfx ? 12 : 14,
                fontStyle: isSfx ? 'normal' : 'italic',
                color: isSfx ? T.highlight : T.ink2,
                lineHeight: 1.45,
              }}>
                {isSfx ? `[ ${s.text} ]` : `"${s.text}"`}
              </div>
              {s.state === 'pending' && (
                <button onClick={() => setGenIdx(i)} style={{
                  marginTop: 8, padding: '4px 8px', borderRadius: 4,
                  background: T.accent, color: '#001a17', border: 'none',
                  fontFamily: T.sans, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>{Ico.bolt(11)} Render</button>
              )}
            </div>
          );
        })}

        {/* Background track */}
        <div style={{ marginTop: 12, padding: 12, background: T.surface900, border: `1px solid ${T.surface600}`, borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Pill color="highlight">music</Pill>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>background · loop</span>
            <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 10, color: T.accent2 }}>MusicGen</span>
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 14, color: T.ink, marginBottom: 8 }}>
            "ambient underwater shimmer, slow"
          </div>
          {/* Waveform mock */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 22 }}>
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, background: T.accent2,
                opacity: 0.4 + 0.5 * Math.abs(Math.sin(i * 0.5 + Math.cos(i * 0.13))),
                height: `${20 + 70 * Math.abs(Math.sin(i * 0.4))}%`,
                borderRadius: 1,
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 10, color: T.ink3, marginTop: 4 }}>
            <span>0:00</span><span>vol −18 dB · fade 1s</span><span>0:42</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, unit }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <MonoLabel>{label}</MonoLabel>
        <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink2 }}>{value.toFixed(2)}{unit || ''}</span>
      </div>
      <div style={{ height: 3, background: T.surface700, borderRadius: 2, position: 'relative' }}>
        <div style={{ width: `${value * 100}%`, height: '100%', background: T.accent, borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  RESOURCES
// ════════════════════════════════════════════════════════════
function ResourcesScreen({ go }) {
  const [type, setType] = useS2('image');
  const [q, setQ] = useS2('kelp forest');
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={() => go('more')} title="Resources." />
      <div style={{ padding: '12px 14px 8px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {['video', 'image', 'audio', 'research'].map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              flex: 1, padding: '8px 0', borderRadius: 6,
              background: type === t ? T.surface800 : 'transparent',
              border: `1px solid ${type === t ? T.accentBorder : T.surface700}`,
              color: type === t ? T.accent2 : T.ink2,
              fontFamily: T.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: T.surface900, border: `1px solid ${T.surface600}`,
          borderRadius: 10, padding: '10px 12px',
        }}>
          <span style={{ color: T.ink3 }}>{Ico.search(16)}</span>
          <input value={q} onChange={e => setQ(e.target.value)} style={{
            flex: 1, background: 'transparent', border: 'none', color: T.ink,
            fontFamily: T.sans, fontSize: 14, outline: 'none',
          }} />
        </div>
      </div>

      {/* Source toggles */}
      <div style={{ padding: '4px 14px 10px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[
          { n: 'Pexels',   free: true,  on: true },
          { n: 'Unsplash', free: true,  on: true },
          { n: 'NASA',     free: true,  on: true },
          { n: 'Smithsonian', free: true, on: false },
          { n: 'Met',      free: true,  on: false },
          { n: 'Wikim. Commons', free: true, on: true },
          { n: 'Pixabay',  free: true,  on: true },
        ].map(s => (
          <Tag key={s.n} active={s.on}>
            {s.n} {s.free && <span style={{ color: T.success, marginLeft: 3 }}>free</span>}
          </Tag>
        ))}
      </div>

      {/* License filter */}
      <div style={{ padding: '0 14px 10px', display: 'flex', gap: 6 }}>
        <Tag active>any license</Tag>
        <Tag>CC0 / PD</Tag>
        <Tag>CC BY</Tag>
      </div>

      {/* Result grid */}
      <div style={{ padding: '4px 14px 100px' }}>
        <MonoLabel style={{ marginBottom: 8 }}>43 results · 4 sources</MonoLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', position: 'relative',
              background: `linear-gradient(${i * 30}deg, hsl(${160 + i * 14} 35% ${28 - i}%), hsl(${190 + i * 8} 50% 18%))`,
            }}>
              <div style={{
                position: 'absolute', top: 4, left: 4, padding: '1px 5px', borderRadius: 3,
                background: 'rgba(0,0,0,0.65)', color: T.ink2,
                fontFamily: T.mono, fontSize: 9,
              }}>{['Pexels', 'NASA', 'Wikim.', 'Unsplash'][i % 4]}</div>
              {i === 2 && <div style={{
                position: 'absolute', bottom: 4, right: 4, padding: '1px 5px', borderRadius: 3,
                background: T.successDim, color: T.success,
                fontFamily: T.mono, fontSize: 9, fontWeight: 600, border: `1px solid rgba(52,211,153,0.3)`
              }}>CC0</div>}
              {i === 5 && <div style={{
                position: 'absolute', bottom: 4, right: 4, padding: '1px 5px', borderRadius: 3,
                background: T.highlightDim, color: T.highlight,
                fontFamily: T.mono, fontSize: 9, fontWeight: 600,
              }}>AI</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  PROPOSALS / JOBS
// ════════════════════════════════════════════════════════════
function ProposalsScreen({ go }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={() => go('more')} title="Proposals." right={
        <Btn kind="primary" size="sm" icon={Ico.spark()}>Generate</Btn>
      } />
      <div style={{ padding: '10px 14px 4px' }}>
        <ChannelPill />
        <span style={{ marginLeft: 8, fontFamily: T.mono, fontSize: 10, color: T.warning }}>premium · 8 left this month</span>
      </div>
      <div style={{ padding: '12px 14px 100px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { title: 'The unspoken hierarchy in otter rafts',          rel: 9.2, uniq: 8.4, fit: 9.0, status: 'new' },
          { title: 'Why pups sleep on mom\'s belly, not the kelp', rel: 8.6, uniq: 7.8, fit: 9.4, status: 'new' },
          { title: 'A timeline of the otter\'s tool kit',           rel: 7.9, uniq: 9.1, fit: 8.2, status: 'accepted' },
          { title: 'Sea otter myths your grandfather believed',     rel: 6.4, uniq: 8.8, fit: 6.9, status: 'rejected' },
        ].map((p, i) => {
          const score = (p.rel + p.uniq + p.fit) / 3;
          return (
            <Card key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Pill color={score > 8 ? 'success' : score > 7 ? 'accent' : 'warning'}>{score.toFixed(1)}</Pill>
                <span style={{ marginLeft: 'auto' }}>
                  {p.status === 'new' && <Pill color="neutral">new</Pill>}
                  {p.status === 'accepted' && <Pill color="success">accepted</Pill>}
                  {p.status === 'rejected' && <Pill color="danger">rejected</Pill>}
                </span>
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.2, color: T.ink, marginBottom: 10 }}>
                {p.title}
              </div>
              <div style={{ display: 'flex', gap: 10, fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>
                <span>relevance <span style={{ color: T.ink }}>{p.rel}</span></span>
                <span>unique <span style={{ color: T.ink }}>{p.uniq}</span></span>
                <span>fit <span style={{ color: T.ink }}>{p.fit}</span></span>
              </div>
              {p.status === 'new' && (
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <Btn kind="primary" size="sm" icon={Ico.check()}>Accept</Btn>
                  <Btn kind="secondary" size="sm" icon={Ico.bolt()}>YOLO</Btn>
                  <Btn kind="ghost" size="sm" style={{ marginLeft: 'auto' }}>Skip</Btn>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function JobsScreen({ go }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={() => go('more')} title="Jobs." subtitle="● live · SSE" />
      <div style={{ padding: '12px 14px 100px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { title: 'Generating proposals',         status: 'running', pct: 0.62, dur: '0:42' },
          { title: 'Storyboard · iteration 2',     status: 'running', pct: 0.30, dur: '1:08' },
          { title: 'Render MP4 · ep-04',            status: 'queued',  pct: 0,    dur: '—' },
          { title: 'Fact-check · sea-urchin-war',   status: 'done',    pct: 1,    dur: '0:14' },
          { title: 'Humanize · rafts-of-100',        status: 'failed',  pct: 0,    dur: '0:03' },
        ].map((j, i) => {
          const tone = j.status === 'running' ? T.accent2
            : j.status === 'done' ? T.success
            : j.status === 'failed' ? T.danger
            : T.ink3;
          return (
            <Card key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: tone }}>● {j.status}</span>
                <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>{j.dur}</span>
              </div>
              <div style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.ink, marginBottom: 8 }}>{j.title}</div>
              <div style={{ height: 3, background: T.surface700, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${j.pct * 100}%`, height: '100%', background: tone }} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  LOGIN
// ════════════════════════════════════════════════════════════
function LoginScreen({ go }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '60px 32px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: `linear-gradient(135deg, ${T.accent}, ${T.accent3})`,
          color: '#001a17', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.serif, fontSize: 32, marginBottom: 30,
        }}>c</div>
        <h1 style={{
          fontFamily: T.serif, fontSize: 42, lineHeight: 0.98,
          letterSpacing: '-0.02em', margin: '0 0 8px', color: T.ink,
        }}>
          Your <em style={{ color: T.accent2 }}>studio</em> for<br/>
          scripts, sound,<br/>
          and story.
        </h1>
        <p style={{ fontFamily: T.sans, fontSize: 14, color: T.ink3, lineHeight: 1.5, marginTop: 18, marginBottom: 30 }}>
          AI-powered scripts, competitive research, audio production, and a 14-source media library — all in one place.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <MonoLabel style={{ marginBottom: 4 }}>Server URL</MonoLabel>
            <div style={{
              padding: '12px 14px', borderRadius: 10,
              background: T.surface900, border: `1px solid ${T.surface600}`,
              fontFamily: T.mono, fontSize: 13, color: T.ink,
            }}>https://dev.rudolphhome.com</div>
          </div>
          <div>
            <MonoLabel style={{ marginBottom: 4 }}>Username</MonoLabel>
            <div style={{
              padding: '12px 14px', borderRadius: 10,
              background: T.surface900, border: `1px solid ${T.surface600}`,
              fontFamily: T.sans, fontSize: 14, color: T.ink,
            }}>alex</div>
          </div>
          <div>
            <MonoLabel style={{ marginBottom: 4 }}>Password</MonoLabel>
            <div style={{
              padding: '12px 14px', borderRadius: 10,
              background: T.surface900, border: `1px solid ${T.surface600}`,
              fontFamily: T.sans, fontSize: 14, color: T.ink, letterSpacing: '0.3em',
            }}>•••••••</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 32px 32px' }}>
        <Btn kind="primary" size="lg" onClick={() => go('home')} style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 15 }}>
          Sign in with Keycloak
        </Btn>
        <div style={{ textAlign: 'center', fontFamily: T.mono, fontSize: 10, color: T.ink4, marginTop: 14 }}>
          v1.0 · keycloak SSO · oauth2-proxy
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  MORE / SETTINGS / ENDPOINTS
// ════════════════════════════════════════════════════════════
function MoreScreen({ go }) {
  const groups = [
    {
      label: 'Workspace',
      items: [
        { id: 'scripts',   t: 'Scripts',     sub: '4 active',           icon: Ico.doc(18) },
        { id: 'episodes',  t: 'Episodes',    sub: '3 in pipeline',       icon: Ico.film(18) },
        { id: 'resources', t: 'Resources',   sub: '14 sources · library', icon: Ico.folder(18) },
      ],
    },
    {
      label: 'Premium',
      items: [
        { id: 'proposals', t: 'Proposals',   sub: '4 new · channel-scoped', icon: Ico.spark(18), prem: true },
        { id: 'jobs',      t: 'Jobs',        sub: '2 running · SSE',         icon: Ico.bolt(18),  prem: true },
      ],
    },
    {
      label: 'Account',
      items: [
        { id: 'settings',  t: 'Channel settings', sub: 'character, voice, RPM', icon: Ico.cog(18) },
        { id: 'endpoints', t: 'Endpoint health',  sub: 'mobile ↔ backend status', icon: Ico.link(18) },
        { id: 'login',     t: 'Sign out',          sub: 'alex@otterworks',        icon: Ico.user(18) },
      ],
    },
  ];

  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar leftLogo title="More." />
      <div style={{ padding: '12px 14px 100px' }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 18 }}>
            <MonoLabel style={{ marginBottom: 8, paddingLeft: 4 }}>{g.label}</MonoLabel>
            <div style={{ background: T.surface900, border: `1px solid ${T.surface600}`, borderRadius: 12, overflow: 'hidden' }}>
              {g.items.map((it, ii) => (
                <div key={it.id} onClick={() => go(it.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 14px',
                  borderBottom: ii < g.items.length - 1 ? `1px solid ${T.surface800}` : 'none',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: T.surface800, color: T.ink2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{it.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.ink, display: 'flex', gap: 6, alignItems: 'center' }}>
                      {it.t} {it.prem && <Pill color="warning">premium</Pill>}
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, marginTop: 2 }}>{it.sub}</div>
                  </div>
                  <span style={{ color: T.ink4 }}>{Ico.arrow(14)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ go }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={() => go('more')} title="Settings." />
      <div style={{ padding: '12px 14px 100px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        <div>
          <MonoLabel style={{ marginBottom: 8 }}>Character</MonoLabel>
          <Card>
            <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, lineHeight: 1, marginBottom: 4 }}>Otterworks</div>
            <div style={{ fontFamily: T.serif, fontSize: 14, fontStyle: 'italic', color: T.ink2, lineHeight: 1.5 }}>
              "A naturalist who sounds like your favorite uncle — calm, generous, secretly very nerdy about kelp."
            </div>
            <Btn kind="secondary" size="sm" icon={Ico.spark()} style={{ marginTop: 10 }}>Re-run AI Character Creator</Btn>
          </Card>
        </div>

        <div>
          <MonoLabel style={{ marginBottom: 8 }}>Default voice</MonoLabel>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: T.accentDim, color: T.accent2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Ico.audio(18)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.ink }}>Bella · ElevenLabs</div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>narration · stability 0.65 · similarity 0.78</div>
              </div>
              <Btn kind="ghost" size="sm" icon={Ico.play()}>Test</Btn>
            </div>
          </Card>
        </div>

        <div>
          <MonoLabel style={{ marginBottom: 8 }}>Analytics RPM</MonoLabel>
          <Card>
            <div style={{ fontFamily: T.serif, fontSize: 28, color: T.ink, lineHeight: 1 }}>$4.50</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, marginTop: 2 }}>per 1k views · niche: education</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {['Gaming $3', 'Tech $6', 'Finance $10', 'Edu $4.5', 'Howto $5'].map(p => (
                <Tag key={p} active={p.startsWith('Edu')}>{p}</Tag>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <MonoLabel style={{ marginBottom: 8 }}>Topic tags</MonoLabel>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {['biology', 'ecology', 'kelp', 'tools', 'behavior', 'predators'].map(t => (
              <Tag key={t} active>#{t} ✕</Tag>
            ))}
            <Tag>+ add</Tag>
          </div>
        </div>

        <div>
          <MonoLabel style={{ marginBottom: 8 }}>API keys</MonoLabel>
          <Card style={{ padding: 0 }}>
            {[
              { k: 'GEMINI_API_KEY', last: '••••3F2k', ok: true },
              { k: 'ANTHROPIC_API_KEY', last: '••••8XQv', ok: true },
              { k: 'YOUTUBE_API_KEY', last: 'not set', ok: false },
              { k: 'ELEVENLABS_API_KEY', last: '••••aP1m', ok: true },
            ].map((k, i) => (
              <div key={k.k} style={{
                padding: '10px 12px',
                borderBottom: i < 3 ? `1px solid ${T.surface800}` : 'none',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: k.ok ? T.success : T.ink4 }} />
                <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink, flex: 1 }}>{k.k}</span>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3 }}>{k.last}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ────  Endpoint health / refactor appendix ────
const ENDPOINTS = [
  { sec: 'Auth', rows: [
    { fn: 'getMe()', cur: 'GET /api/me', mob: '— missing —', status: 'add', note: 'Mobile lib has no getMe; web App.tsx calls it. Add for displaying current user.' },
    { fn: 'changePassword()', cur: 'POST /api/auth/change-password', mob: 'POST /api/auth/change-password', status: 'ok' },
    { fn: 'registerRelayDevice()', cur: 'POST /api/relay/devices', mob: 'POST /api/relay/devices', status: 'ok' },
  ]},
  { sec: 'Channels', rows: [
    { fn: 'listChannels()',  cur: 'GET /api/channels', mob: 'GET /api/channels', status: 'ok' },
    { fn: 'createChannel()', cur: 'POST /api/channels', mob: '— missing —', status: 'add', note: 'Landing page in mobile cannot create a channel today.' },
    { fn: 'updateChannel()', cur: 'PATCH /api/channels/:id', mob: 'PATCH /api/channels/:id', status: 'ok' },
  ]},
  { sec: 'Ideas', rows: [
    { fn: 'listIdeas()',   cur: 'GET .../channels/:id/ideas',  mob: 'same', status: 'ok' },
    { fn: 'createIdea()',  cur: 'POST .../channels/:id/ideas', mob: 'same', status: 'ok' },
    { fn: 'updateIdea()',  cur: 'PATCH', mob: 'PATCH', status: 'ok' },
    { fn: 'deleteIdea()',  cur: 'DELETE', mob: 'DELETE', status: 'ok' },
  ]},
  { sec: 'Scripts', rows: [
    { fn: 'getScript()', cur: 'GET .../scripts/:id',  mob: 'same', status: 'ok' },
    { fn: 'updateScript()', cur: 'PUT', mob: 'PUT', status: 'ok' },
    { fn: 'generateScript()', cur: 'POST /api/ai/stream (SSE)', mob: 'POST /api/ai/stream (text)', status: 'mismatch', note: 'Mobile reads full text — works but no streaming UI; consider chunked progress.' },
  ]},
  { sec: 'AI', rows: [
    { fn: 'generateIdeas()', cur: 'POST /api/ai/ideas', mob: 'same', status: 'ok' },
    { fn: 'getModels()', cur: 'GET /api/ai/models', mob: 'same', status: 'ok' },
    { fn: 'factCheckScript()', cur: 'POST /api/ai/fact-check', mob: 'POST /api/ai/fact-check', status: 'ok', note: 'Mobile pre-fetches script content; backend now also accepts scriptId — simplify.' },
    { fn: 'humanizeScript()', cur: 'POST /api/ai/humanize', mob: 'same', status: 'ok' },
  ]},
  { sec: 'YouTube Discover', rows: [
    { fn: 'discoverYouTube()', cur: 'GET /api/youtube/discover', mob: 'same', status: 'ok' },
    { fn: 'fetchChannelDeepDive()', cur: 'GET /api/youtube/channel/:id', mob: 'same', status: 'ok' },
    { fn: 'fetchVideoMetadata()', cur: 'GET /api/youtube/metadata', mob: 'same', status: 'ok' },
    { fn: 'fetchTranscript()', cur: 'GET /api/youtube/transcript', mob: 'same', status: 'ok' },
  ]},
  { sec: 'Episodes / Pipeline', rows: [
    { fn: 'listEpisodes()', cur: 'GET .../episodes  (pipeline-svc proxied via nginx)', mob: 'same', status: 'mismatch', note: 'Routes moved to pipeline-service in Phase 4. Monolith dropped proxy shims — confirm prod ingress still routes mobile traffic.' },
    { fn: 'runPipeline()', cur: 'POST .../pipeline/run', mob: 'same', status: 'mismatch', note: 'Pipeline-service URL only; old monolith returns 404. Verify EAS dev base URL.' },
    { fn: 'runStage()', cur: 'POST .../pipeline/:stage/run', mob: 'same', status: 'mismatch', note: 'Same as above.' },
    { fn: 'createEpisode()', cur: 'POST .../episodes', mob: 'POST .../episodes', status: 'mismatch', note: 'Response shape changed: now returns { episode: {...} }; mobile expects flat object. IdeasPanel.web already tolerates either — port that fallback.' },
    { fn: '— missing in mobile —', cur: 'POST .../episodes/:id/script-generate', mob: 'not called', status: 'add', note: 'Web converts ideas via this endpoint; mobile creates a script but never spawns the episode worker.' },
    { fn: '— missing in mobile —', cur: 'PATCH .../pipeline/:stage/status', mob: 'not called', status: 'add', note: 'Used by web to mark research as approved when a script is created from an idea.' },
  ]},
  { sec: 'Proposals', rows: [
    { fn: 'listProposals()', cur: 'GET .../proposals', mob: 'same', status: 'ok' },
    { fn: 'generateProposals()', cur: 'POST .../proposals/generate', mob: 'same', status: 'ok' },
    { fn: 'updateProposal()', cur: 'PATCH', mob: 'PATCH', status: 'ok' },
    { fn: 'convertProposal()', cur: 'POST .../convert', mob: 'POST .../convert', status: 'ok' },
    { fn: 'yoloProposal()', cur: 'POST .../yolo', mob: 'POST .../yolo', status: 'ok' },
  ]},
  { sec: 'Jobs', rows: [
    { fn: 'listJobs()', cur: 'GET /api/jobs', mob: 'same', status: 'ok' },
    { fn: 'getJob()', cur: 'GET /api/jobs/:id', mob: 'same', status: 'ok' },
    { fn: 'cancelJob()', cur: 'POST /api/jobs/:id/cancel', mob: 'same', status: 'ok' },
    { fn: '— missing —', cur: 'GET /api/events (SSE)', mob: 'not consumed', status: 'add', note: 'Web subscribes for live job updates. RN fetch lacks ReadableStream — use react-native-sse or poll listJobs every 3s.' },
  ]},
  { sec: 'Resources', rows: [
    { fn: 'searchResources()', cur: 'GET .../resources', mob: 'same', status: 'ok' },
    { fn: 'downloadResource()', cur: 'POST .../resources/download', mob: 'same', status: 'ok' },
    { fn: 'listDownloaded()', cur: 'GET .../resources/downloaded', mob: 'same', status: 'ok' },
    { fn: 'listUserResources()', cur: 'GET /api/resources/library', mob: 'same', status: 'ok' },
    { fn: 'deleteResource()', cur: 'DELETE .../resources/downloaded/:dir/:file', mob: 'same', status: 'ok' },
    { fn: '— missing —', cur: 'POST .../resources/upload (multipart)', mob: 'not called', status: 'add', note: 'Mobile cannot upload local media yet. Use expo-image-picker + FormData.' },
  ]},
  { sec: 'TTS / Audio', rows: [
    { fn: 'getTTSServices()', cur: 'GET /api/tts/services', mob: 'same', status: 'ok' },
    { fn: 'getTTSVoices()', cur: 'GET /api/tts/voices', mob: 'same', status: 'ok' },
    { fn: 'createAudioProject()', cur: 'POST /api/tts/projects', mob: 'same', status: 'ok' },
    { fn: 'generateSection()', cur: 'POST /api/tts/generate', mob: 'same', status: 'ok' },
    { fn: 'mergeSections()', cur: 'POST /api/tts/merge', mob: 'same', status: 'ok' },
    { fn: 'finalizeAudio()', cur: 'POST .../projects/:id/finalize', mob: 'same', status: 'ok' },
    { fn: '— missing —', cur: 'POST .../sections/:id/upload (mic recording)', mob: 'not called', status: 'add', note: 'Per-section mic re-record popup is web-only. Use expo-av + multipart.' },
    { fn: '— missing —', cur: 'POST /api/musicgen/generate', mob: 'not called', status: 'add', note: 'AI music generation; would be premium-only.' },
  ]},
  { sec: 'New / unmapped backend routes', rows: [
    { fn: '— missing —', cur: 'GET /api/wizard/*', mob: 'not called', status: 'add', note: 'Channel-creation wizard. Useful first-run flow.' },
    { fn: '— missing —', cur: 'GET /api/channels/:id/brand-templates', mob: 'not called', status: 'add', note: 'Mobile post-graphic / thumbnail templates.' },
    { fn: '— missing —', cur: 'GET /api/billing/*', mob: 'not called', status: 'add', note: 'Storage billing summary — surface on Settings.' },
    { fn: '— missing —', cur: 'GET /api/oauth/*', mob: 'not called', status: 'add', note: 'Per-user OAuth (Anthropic). Bind via WebBrowser.openAuthSessionAsync.' },
    { fn: '— missing —', cur: 'POST /api/feedback (groomed → GitHub Issue)', mob: 'not called', status: 'add', note: 'Surface from More → Feedback.' },
    { fn: '— missing —', cur: '.../scripts/:id/storyboard', mob: 'not called', status: 'add', note: 'Storyboard editor; could be view-only on mobile.' },
  ]},
];

function EndpointsScreen({ go }) {
  return (
    <div style={{ background: T.surface950, color: T.ink, minHeight: '100%' }}>
      <TopBar onBack={() => go('more')} title="" />
      <div style={{ padding: '0 18px 12px' }}>
        <MonoLabel style={{ color: T.accent2 }}>Refactor appendix · v1.0</MonoLabel>
        <h1 style={{ fontFamily: T.serif, fontSize: 26, lineHeight: 1.05, color: T.ink, margin: '4px 0 6px' }}>
          Endpoint <em style={{ color: T.accent2 }}>health</em>.
        </h1>
        <p style={{ fontFamily: T.sans, fontSize: 13, color: T.ink3, lineHeight: 1.45 }}>
          Mobile <code style={{ fontFamily: T.mono, color: T.ink2 }}>src/lib/api.ts</code> diffed against the current backend routes (<code style={{ fontFamily: T.mono, color: T.ink2 }}>app/backend/src/routes/*</code> + pipeline-service). 6 to add, 4 mismatches, rest aligned.
        </p>
      </div>

      {/* Summary bar */}
      <div style={{ padding: '4px 14px 14px', display: 'flex', gap: 6 }}>
        <SummaryChip label="aligned"   value="22" tint={T.success} />
        <SummaryChip label="mismatch"  value="4"  tint={T.warning} />
        <SummaryChip label="add"       value="13" tint={T.accent2} />
      </div>

      <div style={{ padding: '0 14px 100px' }}>
        {ENDPOINTS.map((sec, si) => (
          <div key={si} style={{ marginBottom: 16 }}>
            <MonoLabel style={{ marginBottom: 6, paddingLeft: 4 }}>{sec.sec} · {sec.rows.length}</MonoLabel>
            <div style={{ background: T.surface900, border: `1px solid ${T.surface600}`, borderRadius: 10, overflow: 'hidden' }}>
              {sec.rows.map((r, ri) => {
                const statusMap = {
                  ok:       { color: T.success, label: 'ok',       icon: '●' },
                  mismatch: { color: T.warning, label: 'mismatch', icon: '◐' },
                  add:      { color: T.accent2, label: 'add',      icon: '+' },
                };
                const st = statusMap[r.status];
                return (
                  <div key={ri} style={{
                    padding: '10px 12px',
                    borderBottom: ri < sec.rows.length - 1 ? `1px solid ${T.surface800}` : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink, fontWeight: 600 }}>{r.fn}</span>
                      <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 9, color: st.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {st.icon} {st.label}
                      </span>
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, lineHeight: 1.55 }}>
                      <div><span style={{ color: T.ink4 }}>backend</span> &nbsp;{r.cur}</div>
                      <div><span style={{ color: T.ink4 }}>mobile&nbsp;&nbsp;</span> &nbsp;{r.mob}</div>
                    </div>
                    {r.note && (
                      <div style={{ marginTop: 6, padding: '6px 8px', borderLeft: `2px solid ${st.color}`, fontFamily: T.serif, fontSize: 12, fontStyle: 'italic', color: T.ink2, lineHeight: 1.4, background: T.surface800 }}>
                        {r.note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryChip({ label, value, tint }) {
  return (
    <div style={{
      flex: 1, padding: '10px 12px', borderRadius: 8,
      background: T.surface900, border: `1px solid ${T.surface600}`,
    }}>
      <div style={{ fontFamily: T.serif, fontSize: 22, color: tint, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}

Object.assign(window, {
  DiscoverScreen, ChannelDeepScreen, VideoDeepScreen,
  ScriptsScreen, ScriptEditScreen,
  EpisodesScreen, EpisodeDetailScreen,
  AudioScreen, ResourcesScreen,
  ProposalsScreen, JobsScreen,
  LoginScreen, MoreScreen, SettingsScreen,
  EndpointsScreen,
});
