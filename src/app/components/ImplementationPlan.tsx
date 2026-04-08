import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft, ChevronRight, ChevronDown, CheckCircle, Circle, Clock, Layers,
  Server, Palette, LayoutTemplate, ShoppingCart, Search, Zap, BarChart3,
  ListChecks, FileCode, Database, Globe, Settings, Shield, Truck, Monitor,
  Smartphone, Tablet, Code, Package, Plug, Image, Type, Box, MousePointer,
  Eye, Accessibility, Gauge, HardDrive, CloudLightning, Tag, MapPin,
  CreditCard, FileText, Users, Star, Hash, Copy, Check, Rocket, ArrowDown,
  ExternalLink, Download, Key, FolderOpen, Play, RefreshCw, BookOpen, Lightbulb,
  AlertTriangle, Info, ChevronUp
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Section { id: string; title: string; icon: React.ReactNode; }

/* ─── Colour tokens ─────────────────────────────────────────────────────── */
const N = '#132043';
const ND = '#0B132C';
const O = '#FF5C00';

/* ─── CONTAINER ─────────────────────────────────────────────────────────── */
const CX = "max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10";

/* ─── Sections nav data ─────────────────────────────────────────────────── */
const SECTIONS: Section[] = [
  { id: 'getting-started', title: 'Getting Started',        icon: <Rocket size={16}/> },
  { id: 'stack',        title: 'Stack & Environment',       icon: <Server size={16}/> },
  { id: 'bricks',       title: 'Bricks 2.3 Feature Map',    icon: <Layers size={16}/> },
  { id: 'tokens',       title: 'Design Token Translation',  icon: <Palette size={16}/> },
  { id: 'templates',    title: 'Template Architecture',     icon: <LayoutTemplate size={16}/> },
  { id: 'header',       title: 'Header Build',              icon: <Monitor size={16}/> },
  { id: 'homepage',     title: 'Homepage Build',            icon: <Globe size={16}/> },
  { id: 'shop',         title: 'Shop Archive Build',        icon: <ShoppingCart size={16}/> },
  { id: 'product',      title: 'Single Product Build',      icon: <Package size={16}/> },
  { id: 'checkout',     title: 'Cart & Checkout Build',     icon: <CreditCard size={16}/> },
  { id: 'data',         title: 'WooCommerce Data Model',    icon: <Database size={16}/> },
  { id: 'search',       title: 'Search Widget (Rego+Size)', icon: <Search size={16}/> },
  { id: 'cart',         title: 'AJAX Cart Integration',     icon: <Zap size={16}/> },
  { id: 'performance',  title: 'Performance & Hosting',     icon: <Gauge size={16}/> },
  { id: 'timeline',     title: 'Migration Sequence',        icon: <Clock size={16}/> },
  { id: 'qa',           title: 'QA Checklist',              icon: <ListChecks size={16}/> },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const Badge = ({ children, color = 'orange' }: { children: React.ReactNode; color?: 'orange' | 'navy' | 'green' | 'sky' | 'amber' | 'slate' }) => {
  const cls: Record<string, string> = {
    orange: 'bg-[#FF5C00]/10 text-[#FF5C00] border-[#FF5C00]/20',
    navy:   'bg-[#132043]/10 text-[#132043] border-[#132043]/20',
    green:  'bg-green-50 text-green-700 border-green-200',
    sky:    'bg-sky-50 text-sky-700 border-sky-200',
    amber:  'bg-amber-50 text-amber-700 border-amber-200',
    slate:  'bg-slate-100 text-slate-600 border-slate-200',
  };
  return <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${cls[color]}`}>{children}</span>;
};

const SH = ({ id, title, sub, icon }: { id: string; title: string; sub: string; icon: React.ReactNode }) => (
  <div id={id} className="scroll-mt-28 mb-10">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-9 h-9 rounded-xl bg-[#FF5C00]/10 flex items-center justify-center text-[#FF5C00]">{icon}</div>
      <div>
        <h2 className="text-2xl font-extrabold text-[#132043]">{title}</h2>
        <p className="text-sm text-slate-500">{sub}</p>
      </div>
    </div>
    <div className="h-px bg-gradient-to-r from-[#FF5C00]/30 to-transparent mt-4" />
  </div>
);

const Table = ({ headers, rows, compact }: { headers: string[]; rows: (string | React.ReactNode)[][]; compact?: boolean }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          {headers.map(h => <th key={h} className={`text-left font-bold text-slate-700 ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
            {row.map((cell, j) => <td key={j} className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} text-slate-600`}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CodeBlock = ({ title, language, children }: { title?: string; language?: string; children: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(children).catch(() => {}); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-[#0B132C] shadow-sm my-4">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#132043] border-b border-white/10">
          <div className="flex items-center gap-2">
            <FileCode size={14} className="text-[#FF5C00]" />
            <span className="text-xs font-bold text-white/70">{title}</span>
            {language && <Badge color="navy"><span className="text-white/50">{language}</span></Badge>}
          </div>
          <button onClick={copy} className="text-white/40 hover:text-white transition-colors p-1 rounded" title="Copy">
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-emerald-300 font-mono">{children}</pre>
    </div>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 ${className}`}>{children}</div>
);

const Callout = ({ type = 'info', children }: { type?: 'info' | 'tip' | 'warn'; children: React.ReactNode }) => {
  const styles = {
    info: 'bg-sky-50 border-sky-200 text-sky-900',
    tip:  'bg-green-50 border-green-200 text-green-900',
    warn: 'bg-amber-50 border-amber-200 text-amber-900',
  };
  const icons = { info: <Globe size={16} />, tip: <CheckCircle size={16} />, warn: <Zap size={16} /> };
  return (
    <div className={`flex gap-3 items-start rounded-xl border p-4 my-4 text-sm ${styles[type]}`}>
      <span className="flex-shrink-0 mt-0.5">{icons[type]}</span>
      <div>{children}</div>
    </div>
  );
};

const TreeItem = ({ icon, label, children, indent = 0 }: { icon?: React.ReactNode; label: React.ReactNode; children?: React.ReactNode; indent?: number }) => (
  <div style={{ paddingLeft: indent * 20 }} className="py-0.5">
    <div className="flex items-center gap-2 text-sm">
      {indent > 0 && <span className="text-slate-300">├─</span>}
      {icon && <span className="text-[#FF5C00] flex-shrink-0">{icon}</span>}
      <span className="text-slate-700">{label}</span>
    </div>
    {children}
  </div>
);

const Accordion = ({ title, badge, children, defaultOpen = false }: { title: string; badge?: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm my-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-2">
          <ChevronDown size={16} className={`text-[#FF5C00] transition-transform ${open ? '' : '-rotate-90'}`} />
          <span className="font-bold text-[#132043] text-sm">{title}</span>
          {badge && <Badge color="slate">{badge}</Badge>}
        </div>
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-100">{children}</div>}
    </div>
  );
};

const ProgressStep = ({ step, title, days, status }: { step: number; title: string; days: string; status: 'done' | 'active' | 'pending' }) => {
  const s = {
    done:    'bg-green-500 text-white',
    active:  'bg-[#FF5C00] text-white',
    pending: 'bg-slate-200 text-slate-500',
  };
  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${s[status]}`}>
        {status === 'done' ? <Check size={14} /> : step}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-[#132043]">{title}</div>
        <div className="text-xs text-slate-400">{days}</div>
      </div>
    </div>
  );
};

const CheckRow = ({ text, category }: { text: string; category?: string }) => {
  const [checked, setChecked] = useState(false);
  return (
    <label className="flex items-start gap-3 py-2 cursor-pointer group">
      <button onClick={() => setChecked(!checked)} className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all mt-0.5 ${checked ? 'bg-green-500 border-green-500' : 'border-slate-300 group-hover:border-[#FF5C00]'}`}>
        {checked && <Check size={12} className="text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{text}</span>
        {category && <Badge color="slate">{category}</Badge>}
      </div>
    </label>
  );
};

/* ─── Getting Started Sub-Components ─────────────────────────────────────── */
const GettingStartedStep = ({ step, title, duration, difficulty, prereqs, linkedSection, scrollTo, children }: {
  step: number; title: string; duration: string; difficulty: 'easy' | 'medium' | 'hard';
  prereqs: string[]; linkedSection: string; scrollTo: (id: string) => void; children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(step <= 2);
  const diffColors = { easy: 'bg-green-50 text-green-700 border-green-200', medium: 'bg-amber-50 text-amber-700 border-amber-200', hard: 'bg-red-50 text-red-700 border-red-200' };
  const diffLabels = { easy: 'Beginner-friendly', medium: 'Intermediate', hard: 'Developer required' };
  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all ${open ? 'border-[#FF5C00]/30 shadow-md' : 'border-slate-200 shadow-sm hover:border-[#FF5C00]/20'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50/50 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-[#FF5C00] text-white flex items-center justify-center flex-shrink-0 font-extrabold text-lg shadow-md">
          {step}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-[#132043]">{title}</span>
            <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border ${diffColors[difficulty]}`}>{diffLabels[difficulty]}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock size={12}/> {duration}</span>
            {prereqs.length > 0 && <span className="flex items-center gap-1"><ArrowLeft size={12}/> Requires: {prereqs.join(', ')}</span>}
          </div>
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform flex-shrink-0 ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <div className="pt-4">
            {children}
            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between">
              <button onClick={() => scrollTo(linkedSection)} className="text-[#FF5C00] hover:underline text-sm font-bold flex items-center gap-1">
                <BookOpen size={14}/> Jump to detailed reference <ChevronRight size={14}/>
              </button>
              {step < 10 && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ArrowDown size={12}/> Next: Step {step + 1}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StepTask = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [done, setDone] = useState(false);
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${done ? 'bg-green-50/50 border-green-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
      <button onClick={() => setDone(!done)} className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all mt-0.5 ${done ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-[#FF5C00]'}`}>
        {done && <Check size={12} className="text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-bold mb-0.5 ${done ? 'text-green-700 line-through' : 'text-[#132043]'}`}>{title}</div>
        <div className={`text-xs leading-relaxed ${done ? 'text-green-600/70' : 'text-slate-500'}`}>{children}</div>
      </div>
    </div>
  );
};

const PluginInstallRow = ({ name, type, action, critical }: { name: string; type: 'free' | 'premium'; action: string; critical?: boolean }) => (
  <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${critical ? 'bg-[#FF5C00]' : 'bg-slate-300'}`} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm text-[#132043]">{name}</span>
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${type === 'premium' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>{type === 'premium' ? 'Paid' : 'Free'}</span>
        {critical && <span className="text-xs font-bold text-[#FF5C00]">Required</span>}
      </div>
      <div className="text-xs text-slate-400 mt-0.5">{action}</div>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
export const ImplementationPlan = ({ onBack }: { onBack: () => void }) => {
  const [activeId, setActiveId] = useState('stack');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map(s => ({ id: s.id, el: document.getElementById(s.id) })).filter(s => s.el);
      const scrollY = window.scrollY + 160;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el && sections[i].el!.offsetTop <= scrollY) {
          setActiveId(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* ─── Sticky Header ─── */}
      <div className="sticky top-0 z-50 bg-[#0B132C] border-b border-white/10 shadow-lg">
        <div className={`${CX} flex items-center justify-between py-3`}>
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors">
              <ArrowLeft size={16} /> Back to Site
            </button>
            <div className="w-px h-5 bg-white/20 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-white font-extrabold text-sm">Implementation Plan</span>
              <Badge color="orange">Bricks 2.3</Badge>
              <Badge color="sky">WooCommerce</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/50">
            <Clock size={14} />
            <span>~16 working days</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">~128 hours</span>
          </div>
        </div>
      </div>

      {/* ─── Hero Banner ─── */}
      <div className="bg-gradient-to-br from-[#132043] via-[#0B132C] to-[#132043] text-white">
        <div className={`${CX} py-16 md:py-20`}>
          <div className="flex items-center gap-2 text-[#FF5C00] text-sm font-bold uppercase tracking-wider mb-4">
            <FileText size={16} /> Technical Specification
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Hyperdrive → WordPress<br />
            <span className="text-[#FF5C00]">Bricks Builder 2.3 + WooCommerce</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mb-8">
            A 1:1 migration plan mapping every React component, state hook, and interaction to its
            WordPress equivalent — preserving the exact visual design, responsive behaviour, and user flows.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: <Rocket size={14}/>, label: '10-Step Guide' },
              { icon: <Layers size={14}/>, label: '16 Sections' },
              { icon: <LayoutTemplate size={14}/>, label: '8 Templates' },
              { icon: <FileCode size={14}/>, label: '6 Code Blocks' },
              { icon: <ListChecks size={14}/>, label: '31+ QA Checks' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80">
                <span className="text-[#FF5C00]">{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className={`${CX} py-10`}>
        <div className="flex gap-8">
          {/* Sidebar Nav */}
          <nav className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-20 space-y-0.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Contents</div>
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeId === s.id
                      ? 'bg-[#FF5C00]/10 text-[#FF5C00] font-bold'
                      : 'text-slate-500 hover:text-[#132043] hover:bg-slate-100'
                  }`}
                >
                  {s.icon}
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <div ref={scrollRef} className="flex-1 min-w-0 space-y-16">

            {/* ═══ 0. GETTING STARTED ═══ */}
            <section>
              <SH id="getting-started" title="Getting Started" sub="Your step-by-step roadmap from zero to launch" icon={<Rocket size={20}/>} />

              <Callout type="tip">
                <strong>New to Bricks Builder or WooCommerce?</strong> This guide walks you through every step in the exact order you should follow. Complete each step before moving on — later steps depend on earlier ones.
              </Callout>

              {/* Quick-start overview */}
              <Card className="mb-6">
                <h3 className="font-bold text-[#132043] mb-2 flex items-center gap-2">
                  <BookOpen size={16} className="text-[#FF5C00]" /> How to Read This Plan
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  This plan is organised into 10 actionable steps. Each step tells you <strong>what to do</strong>, <strong>where to do it</strong>, and <strong>links to the detailed section</strong> in this document. Follow them in order.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { icon: <Download size={16}/>, label: 'Steps 1–2', desc: 'Environment setup', color: 'text-sky-600 bg-sky-50' },
                    { icon: <Palette size={16}/>, label: 'Steps 3–5', desc: 'Design & templates', color: 'text-[#FF5C00] bg-[#FF5C00]/5' },
                    { icon: <Rocket size={16}/>, label: 'Steps 6–10', desc: 'Build, test & launch', color: 'text-green-600 bg-green-50' },
                  ].map(p => (
                    <div key={p.label} className={`flex items-center gap-3 rounded-xl border border-slate-100 p-3`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${p.color}`}>{p.icon}</div>
                      <div>
                        <div className="font-bold text-sm text-[#132043]">{p.label}</div>
                        <div className="text-xs text-slate-500">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Step-by-step guide */}
              <div className="space-y-4">

                {/* ── STEP 1 ── */}
                <GettingStartedStep
                  step={1}
                  title="Provision Hosting & Install WordPress"
                  duration="~1 hour"
                  difficulty="easy"
                  prereqs={[]}
                  linkedSection="stack"
                  scrollTo={scrollTo}
                >
                  <p className="text-sm text-slate-600 mb-4">
                    Before anything else, you need a live server running WordPress. This is where everything lives.
                  </p>
                  <div className="space-y-3">
                    <StepTask title="Choose a hosting provider optimised for NZ">
                      We recommend <strong>Cloudways (Vultr Sydney)</strong> for the best price/performance ratio with ~18ms latency to Auckland.
                      Alternatively, use <strong>Starter Publishing</strong> (NZ-based, ~5ms) or <strong>Kinsta</strong> (managed, Sydney GCP).
                    </StepTask>
                    <StepTask title="Install WordPress">
                      Use your host's one-click installer. Select WordPress 6.7+ and choose <code className="text-xs bg-slate-100 px-1 rounded">hyperdrive.co.nz</code> as the domain (you can point DNS later).
                    </StepTask>
                    <StepTask title="Enable server-level optimisations">
                      In your hosting panel, enable: <strong>PHP 8.2+</strong>, <strong>Redis object cache</strong>, and <strong>OPcache</strong>.
                    </StepTask>
                    <StepTask title="Set up Cloudflare (free tier)">
                      Point your DNS to Cloudflare. Enable <strong>HTTP/3</strong>, <strong>Auto Minify</strong>, and <strong>APO for WordPress</strong>.
                    </StepTask>
                  </div>
                  <Callout type="warn">
                    <strong>Don't skip Redis.</strong> WooCommerce generates many database queries per page load. Without object caching, your TTFB will be 2-3x slower.
                  </Callout>
                </GettingStartedStep>

                {/* ── STEP 2 ── */}
                <GettingStartedStep
                  step={2}
                  title="Install & Activate All Plugins"
                  duration="~30 minutes"
                  difficulty="easy"
                  prereqs={['Step 1']}
                  linkedSection="stack"
                  scrollTo={scrollTo}
                >
                  <p className="text-sm text-slate-600 mb-4">
                    Install all required plugins before building anything. Some plugins register custom post types and taxonomies that later steps depend on.
                  </p>
                  <div className="space-y-2">
                    <PluginInstallRow name="Bricks Builder 2.3" type="premium" action="Upload ZIP from bricksbuilder.io" critical />
                    <PluginInstallRow name="WooCommerce" type="free" action="Plugins → Add New → search 'WooCommerce'" critical />
                    <PluginInstallRow name="Advanced Custom Fields PRO" type="premium" action="Upload ZIP from advancedcustomfields.com" critical />
                    <PluginInstallRow name="FacetWP" type="premium" action="Upload ZIP from facetwp.com" critical />
                    <PluginInstallRow name="Yoast SEO" type="free" action="Plugins → Add New → search 'Yoast SEO'" />
                    <PluginInstallRow name="WP Rocket" type="premium" action="Upload ZIP from wp-rocket.me" />
                    <PluginInstallRow name="Safe SVG" type="free" action="Plugins → Add New → search 'Safe SVG'" />
                    <PluginInstallRow name="ShortPixel Image Optimizer" type="free" action="Plugins → Add New → search 'ShortPixel'" />
                    <PluginInstallRow name="Stripe for WooCommerce" type="free" action="Plugins → Add New → search 'WooCommerce Stripe'" />
                  </div>
                  <Callout type="info">
                    <strong>Activation order matters.</strong> Activate WooCommerce first (it creates required pages like Cart and Checkout), then Bricks, then ACF PRO, then everything else.
                  </Callout>
                </GettingStartedStep>

                {/* ── STEP 3 ── */}
                <GettingStartedStep
                  step={3}
                  title="Configure WooCommerce Settings"
                  duration="~2 hours"
                  difficulty="medium"
                  prereqs={['Step 2']}
                  linkedSection="data"
                  scrollTo={scrollTo}
                >
                  <p className="text-sm text-slate-600 mb-4">
                    Configure WooCommerce's core settings <em>before</em> creating products or templates. This ensures correct tax display, shipping rules, and payment processing from the start.
                  </p>
                  <div className="space-y-3">
                    <StepTask title="General settings">
                      <strong>WooCommerce → Settings → General</strong>: Set store address to NZ, currency to NZD ($), selling locations to "Sell to specific countries" → New Zealand.
                    </StepTask>
                    <StepTask title="Tax setup">
                      <strong>Settings → Tax</strong>: Enable taxes. Add a standard rate: Country = NZ, Rate = 15%, Name = "GST". Set "Prices entered with tax" → <strong>No, I will enter prices exclusive of tax</strong>.
                    </StepTask>
                    <StepTask title="Shipping zones">
                      <strong>Settings → Shipping → Add zone</strong> "New Zealand" with region NZ.<br />
                      Add two methods: <strong>Free Shipping</strong> (min order $500) and <strong>Flat Rate</strong> ($29.95).
                    </StepTask>
                    <StepTask title="Create product attributes">
                      <strong>Products → Attributes</strong>: Create all 8 global attributes — Brand, Tyre Width, Profile, Rim Size, Category, Speed Rating, Load Index, Season. Add terms to each (see the <em>WooCommerce Data Model</em> section for full term lists).
                    </StepTask>
                    <StepTask title="Payment gateway">
                      <strong>Settings → Payments → Stripe</strong>: Connect your Stripe account. Enable <strong>test mode</strong> for development. You'll switch to live keys before launch.
                    </StepTask>
                    <StepTask title="Product categories">
                      <strong>Products → Categories</strong>: Create "Tyres" (with sub-categories: Performance, Passenger, SUV/4WD, All Season, Run-Flat), "Wheels & Mags", and "Combos".
                    </StepTask>
                  </div>
                </GettingStartedStep>

                {/* ── STEP 4 ── */}
                <GettingStartedStep
                  step={4}
                  title="Set Up Design Tokens & Global Styles"
                  duration="~2 hours"
                  difficulty="medium"
                  prereqs={['Step 2']}
                  linkedSection="tokens"
                  scrollTo={scrollTo}
                >
                  <p className="text-sm text-slate-600 mb-4">
                    Translate the React app's design system into Bricks Builder. This ensures every template you build afterward uses consistent colours, spacing, and typography.
                  </p>
                  <div className="space-y-3">
                    <StepTask title="Create a Bricks child theme">
                      In <code className="text-xs bg-slate-100 px-1 rounded">/wp-content/themes/</code>, create a <code className="text-xs bg-slate-100 px-1 rounded">bricks-child</code> folder with a <code className="text-xs bg-slate-100 px-1 rounded">style.css</code> header referencing the Bricks parent theme and a blank <code className="text-xs bg-slate-100 px-1 rounded">functions.php</code>. Activate the child theme.
                    </StepTask>
                    <StepTask title="Add CSS custom properties">
                      Go to <strong>Bricks → Settings → Custom Code → Custom CSS (head)</strong>. Paste the full <code className="text-xs bg-slate-100 px-1 rounded">:root</code> CSS variables block from the <em>Design Token Translation</em> section. This defines all colours, radii, shadows, and transitions.
                    </StepTask>
                    <StepTask title="Create Global Classes in Bricks">
                      Go to <strong>Bricks → Settings → Global Classes</strong>. Create the 8+ global classes (<code className="text-xs bg-orange-50 text-[#FF5C00] px-1 rounded">.hd-container</code>, <code className="text-xs bg-orange-50 text-[#FF5C00] px-1 rounded">.hd-card</code>, <code className="text-xs bg-orange-50 text-[#FF5C00] px-1 rounded">.hd-btn-primary</code>, etc.) defined in the tokens section.
                    </StepTask>
                    <StepTask title="Add the responsive container CSS">
                      In the same Custom CSS area, add the <code className="text-xs bg-slate-100 px-1 rounded">@media</code> queries that scale <code className="text-xs bg-orange-50 text-[#FF5C00] px-1 rounded">.hd-container</code> to 1280px at xl and 1440px at 2xl.
                    </StepTask>
                    <StepTask title="Set up fonts">
                      Either add "Inter" via <strong>Bricks → Settings → General → Google Fonts</strong> (weights 400–800), or self-host the Inter Variable WOFF2 file in your child theme's <code className="text-xs bg-slate-100 px-1 rounded">/fonts/</code> folder for better performance.
                    </StepTask>
                  </div>
                  <Callout type="tip">
                    <strong>Test your tokens early.</strong> Create a temporary Bricks page, drop in a Section + Heading + Button, and apply your global classes. Verify colours, fonts, and spacing look correct before building real templates.
                  </Callout>
                </GettingStartedStep>

                {/* ── STEP 5 ── */}
                <GettingStartedStep
                  step={5}
                  title="Create ACF Field Groups"
                  duration="~2 hours"
                  difficulty="medium"
                  prereqs={['Steps 2–3']}
                  linkedSection="data"
                  scrollTo={scrollTo}
                >
                  <p className="text-sm text-slate-600 mb-4">
                    Set up all custom field groups before building templates. Bricks 2.3 reads ACF fields via dynamic data tags — if the fields don't exist yet, you can't use them in the builder.
                  </p>
                  <div className="space-y-3">
                    <StepTask title='Field Group 1: "Product — Extra Fields"'>
                      <strong>Location:</strong> Post Type = Product.<br />
                      Fields: <code className="text-xs bg-slate-100 px-1 rounded">badge_text</code> (Text), <code className="text-xs bg-slate-100 px-1 rounded">badge_color</code> (Select: orange/navy/amber/sky/green), <code className="text-xs bg-slate-100 px-1 rounded">warranty_km</code> (Number), <code className="text-xs bg-slate-100 px-1 rounded">tread_depth</code> (Text), <code className="text-xs bg-slate-100 px-1 rounded">sidewall_type</code> (Select: Black/White Letter).
                    </StepTask>
                    <StepTask title='Field Group 2: "Homepage — Content"'>
                      <strong>Location:</strong> Page = Front Page.<br />
                      Fields: <code className="text-xs bg-slate-100 px-1 rounded">promo_countdown_end</code> (Date Time Picker), <code className="text-xs bg-slate-100 px-1 rounded">promotions</code> (Repeater with sub-fields: eyebrow, heading, detail, saving_text, image, cta_text, cta_link, badge_text, badge_color, is_hero).
                    </StepTask>
                    <StepTask title='Field Group 3: "Site Options" (ACF Options Page)'>
                      Register an ACF Options page via <code className="text-xs bg-slate-100 px-1 rounded">functions.php</code>.<br />
                      Fields: <code className="text-xs bg-slate-100 px-1 rounded">announcement_active</code> (True/False), <code className="text-xs bg-slate-100 px-1 rounded">announcement_text</code> (Text), <code className="text-xs bg-slate-100 px-1 rounded">phone_number</code> (Text), <code className="text-xs bg-slate-100 px-1 rounded">fitting_stations</code> (Repeater: name, address, slug).
                    </StepTask>
                  </div>
                </GettingStartedStep>

                {/* ── STEP 6 ── */}
                <GettingStartedStep
                  step={6}
                  title="Build Global Templates (Header & Footer)"
                  duration="~6 hours"
                  difficulty="medium"
                  prereqs={['Steps 4–5']}
                  linkedSection="header"
                  scrollTo={scrollTo}
                >
                  <p className="text-sm text-slate-600 mb-4">
                    Build the header and footer first — they appear on every page, so everything you build afterwards will already feel like the real site.
                  </p>
                  <div className="space-y-3">
                    <StepTask title="Create Header template">
                      <strong>Bricks → Templates → Add New</strong>: Type = Header, Condition = Entire Site.<br />
                      Build three layers: <strong>Announcement bar</strong> (navy-dark bg, flash sale text, phone number), <strong>Main nav</strong> (sticky, logo, nav links, cart button with <code className="text-xs bg-slate-100 px-1 rounded">{'{'}woo_cart_count{'}'}</code> badge), and <strong>Mobile off-canvas</strong> menu.
                    </StepTask>
                    <StepTask title="Create Footer template">
                      <strong>Bricks → Templates → Add New</strong>: Type = Footer, Condition = Entire Site.<br />
                      Build the 4-column footer: brand column (logo, description, rating), shop links, customer care, and contact card.
                    </StepTask>
                    <StepTask title="Build reusable components">
                      Create and save as template parts: <strong>Product Card</strong>, <strong>Trust Bar Item</strong>, <strong>Category Card</strong>, and <strong>Star Rating</strong>. These will be inserted into other templates via Bricks' template include system.
                    </StepTask>
                  </div>
                  <Callout type="info">
                    <strong>Build the Product Card component early.</strong> It's used on the homepage, shop archive, single product (related), and search results — it's the single most reused component in the entire site.
                  </Callout>
                </GettingStartedStep>

                {/* ── STEP 7 ── */}
                <GettingStartedStep
                  step={7}
                  title="Build Page Templates"
                  duration="~3–4 days"
                  difficulty="hard"
                  prereqs={['Step 6']}
                  linkedSection="homepage"
                  scrollTo={scrollTo}
                >
                  <p className="text-sm text-slate-600 mb-4">
                    This is the main build phase. Create each page template in Bricks, following the detailed structures in sections 6–9 of this plan. Build them in this order:
                  </p>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                    {[
                      { num: '7a', title: 'Homepage', desc: 'Hero (with search widget), trust bar, promotions (ACF repeater + countdown), featured products (WC query loop), about section, categories', time: '8–10 hrs', section: 'homepage' },
                      { num: '7b', title: 'Shop Archive', desc: 'Navy header, sticky toolbar, sidebar with FacetWP facets, product grid query loop using Product Card component, mobile filter drawer', time: '6–8 hrs', section: 'shop' },
                      { num: '7c', title: 'Single Product', desc: 'Image gallery, product details with qty=4 default, price block, trust badges, specs table (Code element), reviews, related products', time: '6–8 hrs', section: 'product' },
                      { num: '7d', title: 'Cart Page', desc: 'Progress steps, cart items list, order summary sidebar with GST & shipping', time: '4–5 hrs', section: 'checkout' },
                      { num: '7e', title: 'Checkout Page', desc: 'Multi-step form (details → payment), fitting station selector, Stripe integration', time: '5–6 hrs', section: 'checkout' },
                      { num: '7f', title: 'Order Confirmation', desc: 'Success state with order number, next-steps timeline, CTAs', time: '2 hrs', section: 'checkout' },
                    ].map(t => (
                      <div key={t.num} className="flex items-start gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-[#FF5C00]/10 text-[#FF5C00] flex items-center justify-center flex-shrink-0 text-xs font-extrabold">{t.num}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-[#132043]">{t.title}</span>
                            <Badge color="slate">{t.time}</Badge>
                            <button onClick={() => scrollTo(t.section)} className="text-[#FF5C00] hover:underline text-xs font-bold flex items-center gap-1">
                              View details <ChevronRight size={12}/>
                            </button>
                          </div>
                          <p className="text-xs text-slate-500">{t.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Callout type="warn">
                    <strong>Import sample products first.</strong> Before building the Shop Archive and Single Product templates, add at least 5–10 products (Step 8) so you can see real data in the builder's preview.
                  </Callout>
                </GettingStartedStep>

                {/* ── STEP 8 ── */}
                <GettingStartedStep
                  step={8}
                  title="Import Products & Populate Content"
                  duration="~1 day"
                  difficulty="easy"
                  prereqs={['Steps 3, 5']}
                  linkedSection="data"
                  scrollTo={scrollTo}
                >
                  <p className="text-sm text-slate-600 mb-4">
                    Populate the store with real product data and homepage content. You can start this alongside Step 7.
                  </p>
                  <div className="space-y-3">
                    <StepTask title="Prepare product images">
                      Compress all product images using ShortPixel or TinyPNG. Ensure WebP versions are generated. Aim for &lt;150KB per product image.
                    </StepTask>
                    <StepTask title="Import products via CSV">
                      <strong>Products → Import</strong>: Use WooCommerce's CSV importer. Map columns to: Title, SKU, Regular Price, Sale Price, Categories, and all product attributes (pa_brand, pa_width, etc.). Import 20 products to start.
                    </StepTask>
                    <StepTask title="Set ACF fields on products">
                      For each product, fill in the custom ACF fields: badge_text, badge_color, warranty_km, tread_depth, sidewall_type.
                    </StepTask>
                    <StepTask title="Populate the homepage">
                      Edit the front page and fill in the ACF fields: promotions repeater (5 promos with images), countdown end date, and mark featured products in WooCommerce.
                    </StepTask>
                    <StepTask title="Upload brand assets">
                      Upload the Nono Mags N Tyres logo (SVG or PNG), storefront photo, and any brand icons to the Media Library.
                    </StepTask>
                  </div>
                </GettingStartedStep>

                {/* ── STEP 9 ── */}
                <GettingStartedStep
                  step={9}
                  title="Build Custom Plugins & PHP Customisations"
                  duration="~2 days"
                  difficulty="hard"
                  prereqs={['Steps 6–7']}
                  linkedSection="search"
                  scrollTo={scrollTo}
                >
                  <p className="text-sm text-slate-600 mb-4">
                    Add the custom functionality that can't be done through the Bricks UI alone.
                  </p>
                  <div className="space-y-3">
                    <StepTask title="Add PHP customisations to functions.php">
                      In your child theme's <code className="text-xs bg-slate-100 px-1 rounded">functions.php</code>, add: <strong>qty default = 4</strong> filter, <strong>fitting station</strong> checkout field, <strong>cart fragment</strong> registration for the header badge, and AJAX add-to-cart for single product pages. All code is in the relevant plan sections.
                    </StepTask>
                    <StepTask title="Build the Rego Lookup plugin">
                      Create <code className="text-xs bg-slate-100 px-1 rounded">/wp-content/plugins/hyperdrive-rego-lookup/</code>. This plugin handles AJAX rego → tyre size lookups via the CarJam NZ API. See the <em>Search Widget</em> section for full source code. For MVP, use mock data while waiting for API access.
                    </StepTask>
                    <StepTask title="Configure FacetWP facets">
                      Create all 10 facets (search, category, brand, width, price, rating, stock, sort, pager, reset) in <strong>FacetWP → Settings</strong>. Add the custom CSS to match the Hyperdrive design. Test filtering on the shop archive.
                    </StepTask>
                    <StepTask title="Wire up the hero search widget">
                      Connect the "Search by Size" form to submit to <code className="text-xs bg-slate-100 px-1 rounded">/shop/?fwp_width=X&fwp_profile=Y&fwp_rim=Z</code>. Connect the "Search by Rego" form to the AJAX endpoint from the rego plugin.
                    </StepTask>
                  </div>
                </GettingStartedStep>

                {/* ── STEP 10 ── */}
                <GettingStartedStep
                  step={10}
                  title="Test, Optimise & Launch"
                  duration="~3–4 days"
                  difficulty="medium"
                  prereqs={['Steps 1–9']}
                  linkedSection="qa"
                  scrollTo={scrollTo}
                >
                  <p className="text-sm text-slate-600 mb-4">
                    The final phase. Run through every checklist, fix issues, and go live.
                  </p>
                  <div className="space-y-3">
                    <StepTask title="Responsive QA">
                      Test every page at all 6 breakpoints (375px, 640px, 768px, 1024px, 1280px, 1536px). Use Chrome DevTools' device toolbar. Fix any layout breaks, overflow issues, or touch target problems.
                    </StepTask>
                    <StepTask title="Full checkout flow test">
                      Add items to cart → proceed to checkout → fill in details → select fitting station → complete Stripe test payment → verify order appears in WooCommerce admin. Test on both desktop and mobile.
                    </StepTask>
                    <StepTask title="Performance audit">
                      Run Google Lighthouse on homepage, shop, and product pages. Target: mobile &ge; 85, desktop &ge; 95. Enable WP Rocket's page cache, critical CSS, and deferred JS. Verify LCP &lt; 2.5s and CLS &lt; 0.1.
                    </StepTask>
                    <StepTask title="Accessibility check">
                      Verify keyboard navigation, focus rings, alt text, colour contrast (WCAG AA), and screen reader compatibility. Use axe DevTools browser extension for automated checks.
                    </StepTask>
                    <StepTask title="SEO setup">
                      Configure Yoast SEO: set homepage title/description, generate XML sitemap, configure breadcrumbs, add schema markup for products (Yoast WooCommerce SEO addon).
                    </StepTask>
                    <StepTask title="DNS cutover & go-live">
                      Point <code className="text-xs bg-slate-100 px-1 rounded">hyperdrive.co.nz</code> DNS to your new server. Disable Stripe test mode. Clear all caches. Monitor for errors in the first 24 hours.
                    </StepTask>
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <div className="flex items-center gap-2 text-green-800 font-bold mb-1">
                      <CheckCircle size={16}/> You're live!
                    </div>
                    <p className="text-sm text-green-700">
                      After launch, set up Google Analytics 4, Google Search Console, and uptime monitoring (e.g., UptimeRobot). Schedule weekly WooCommerce report reviews.
                    </p>
                  </div>
                </GettingStartedStep>
              </div>

              {/* Quick Reference Card */}
              <Card className="mt-8">
                <h3 className="font-bold text-[#132043] mb-4 flex items-center gap-2">
                  <Lightbulb size={16} className="text-[#FF5C00]" /> Quick Reference: Where Things Live
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { q: 'Where do I add CSS variables?', a: 'Bricks → Settings → Custom Code → Custom CSS (head)' },
                    { q: 'Where do I create page templates?', a: 'Bricks → Templates → Add New' },
                    { q: 'Where do I add PHP code?', a: '/wp-content/themes/bricks-child/functions.php' },
                    { q: 'Where do I create product attributes?', a: 'WooCommerce → Products → Attributes' },
                    { q: 'Where do I set up shipping?', a: 'WooCommerce → Settings → Shipping → Zones' },
                    { q: 'Where do I configure FacetWP?', a: 'FacetWP → Settings → Facets tab' },
                    { q: 'Where do I create ACF fields?', a: 'ACF → Field Groups → Add New' },
                    { q: 'Where do I add global classes?', a: 'Bricks → Settings → Global Classes' },
                  ].map(item => (
                    <div key={item.q} className="p-3 rounded-lg border border-slate-100 hover:border-[#FF5C00]/20 transition-colors">
                      <div className="text-xs font-bold text-[#132043] mb-1">{item.q}</div>
                      <div className="text-xs text-slate-500"><code className="bg-slate-50 px-1 rounded">{item.a}</code></div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* ═══ 1. STACK ═══ */}
            <section>
              <SH id="stack" title="Stack & Environment" sub="Core technologies and hosting" icon={<Server size={20}/>} />

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <h3 className="font-bold text-[#132043] mb-3 flex items-center gap-2"><Layers size={16} className="text-[#FF5C00]" /> Core Stack</h3>
                  <Table compact headers={['Layer', 'Technology', 'Version']} rows={[
                    [<span className="font-bold">CMS</span>, 'WordPress', '6.7+'],
                    [<span className="font-bold">Builder</span>, 'Bricks Builder', <Badge color="orange">2.3</Badge>],
                    [<span className="font-bold">E-commerce</span>, 'WooCommerce', '9.x'],
                    [<span className="font-bold">Fields</span>, 'ACF PRO', '6.x'],
                    [<span className="font-bold">Filtering</span>, 'FacetWP', '4.x'],
                    [<span className="font-bold">SEO</span>, 'Yoast SEO', '23.x'],
                  ]} />
                </Card>
                <Card>
                  <h3 className="font-bold text-[#132043] mb-3 flex items-center gap-2"><Plug size={16} className="text-[#FF5C00]" /> Required Plugins</h3>
                  <Table compact headers={['Plugin', 'Purpose']} rows={[
                    ['WP Rocket / FlyingPress', 'Page cache, critical CSS, lazy load'],
                    ['ShortPixel / Imagify', 'WebP conversion, compression'],
                    ['Safe SVG', 'SVG uploads for brand assets'],
                    ['FacetWP', 'AJAX product filtering'],
                    ['Stripe for WooCommerce', 'Payment gateway (NZ)'],
                    ['CheckoutWC', 'Multi-step checkout (optional)'],
                  ]} />
                </Card>
              </div>

              <Card>
                <h3 className="font-bold text-[#132043] mb-3 flex items-center gap-2"><CloudLightning size={16} className="text-[#FF5C00]" /> Hosting (NZ-Optimised)</h3>
                <Table compact headers={['Provider', 'Region', 'Latency', 'Why']} rows={[
                  [<span className="font-bold">Cloudways (Vultr)</span>, 'Sydney, AU', '~18ms to AKL', 'Best price/performance ratio'],
                  ['Starter Publishing', 'Auckland, NZ', '~5ms', 'Local hosting, NZ-based'],
                  ['Kinsta', 'Sydney GCP', '~20ms', 'Managed WP, built-in CDN'],
                ]} />
                <Callout type="tip">
                  <strong>Enable:</strong> PHP 8.2+, Redis object cache, Cloudflare CDN (free tier), HTTP/3.
                </Callout>
              </Card>
            </section>

            {/* ═══ 2. BRICKS 2.3 ═══ */}
            <section>
              <SH id="bricks" title="Bricks 2.3 Feature Map" sub="React pattern → Bricks equivalent" icon={<Layers size={20}/>} />

              <Card className="mb-6">
                <h3 className="font-bold text-[#132043] mb-3">React → Bricks 2.3 Translation</h3>
                <Table headers={['React Pattern', 'Bricks 2.3 Equivalent', 'Notes']} rows={[
                  [<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">useState</code>, <span className="font-bold">Interactions API</span>, 'Toggle classes / show-hide on click'],
                  [<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">useState</code>, <span className="font-bold">Off-Canvas element</span>, 'Mobile menu slide-from-left'],
                  [<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">motion/react</code>, <span className="font-bold">CSS transitions + Interactions</span>, 'Simple fade/slide; complex use @keyframes'],
                  [<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">useCart()</code>, <span className="font-bold">WooCommerce AJAX Cart</span>, 'Native cart, no React state'],
                  [<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">useMemo</code>, <span className="font-bold">FacetWP / Query Loop Filters</span>, 'Server-side AJAX filtering'],
                  ['React Router', <span className="font-bold">WordPress pages + Bricks templates</span>, 'Each "page" → real WP page'],
                  [<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">.map()</code>, <span className="font-bold">Bricks Query Loop</span>, 'Loop over posts, products, ACF repeaters'],
                  ['Countdown timer', <span className="font-bold">Bricks Code element + JS</span>, 'Reads ACF datetime field'],
                  [<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">CONTAINER</code>, <span className="font-bold">Global Class</span>, 'One class on all section inner containers'],
                ]} />
              </Card>

              <Card>
                <h3 className="font-bold text-[#132043] mb-3">Bricks 2.3–Specific Features to Leverage</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: <Palette size={16}/>, title: 'Global Classes', desc: 'Named reusable classes replacing Tailwind utility stacking' },
                    { icon: <Box size={16}/>, title: 'Component System', desc: 'Save product card, trust item, category card as reusable templates' },
                    { icon: <MousePointer size={16}/>, title: 'Interactions API', desc: 'Tab switching, mobile menu, filter accordion, hover effects' },
                    { icon: <Eye size={16}/>, title: 'Conditions', desc: 'Show/hide based on WooCommerce status (on sale, cart empty, etc.)' },
                    { icon: <Hash size={16}/>, title: 'Dynamic Data Tags', desc: '{woo_product_price}, {acf_badge_text}, {post_title}' },
                    { icon: <Smartphone size={16}/>, title: 'Responsive Controls', desc: 'Per-element breakpoint overrides for all 6 breakpoints' },
                  ].map(f => (
                    <div key={f.title} className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#FF5C00]/30 transition-colors">
                      <span className="text-[#FF5C00] mt-0.5">{f.icon}</span>
                      <div>
                        <div className="font-bold text-sm text-[#132043]">{f.title}</div>
                        <div className="text-xs text-slate-500">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* ═══ 3. TOKENS ═══ */}
            <section>
              <SH id="tokens" title="Design Token Translation" sub="CSS variables, global classes, fonts" icon={<Palette size={20}/>} />

              <Accordion title="CSS Custom Properties" badge="root" defaultOpen>
                <CodeBlock title="Bricks → Settings → Custom Code → CSS" language="CSS">{`:root {
  /* Brand Colours */
  --hd-navy:          #132043;
  --hd-navy-dark:     #0B132C;
  --hd-orange:        #FF5C00;
  --hd-orange-hover:  #E05200;

  /* Neutrals */
  --hd-white:         #FFFFFF;
  --hd-gray-50:       #F9FAFB;
  --hd-gray-100:      #F3F4F6;
  --hd-gray-200:      #E2E8F0;
  --hd-gray-500:      #6B7280;
  --hd-gray-900:      #1F2937;

  /* Semantic */
  --hd-success:       #16A34A;
  --hd-info:          #0EA5E9;
  --hd-warning:       #F59E0B;
  --hd-error:         #DC2626;

  /* Container */
  --hd-container:     1184px;
  --hd-container-xl:  1280px;
  --hd-container-2xl: 1440px;
  --hd-gutter:        32px;
  --hd-gutter-2xl:    40px;

  /* Radius */
  --hd-radius-sm:     8px;
  --hd-radius-md:     12px;
  --hd-radius-lg:     16px;
  --hd-radius-xl:     24px;
  --hd-radius-pill:   9999px;

  /* Shadows */
  --hd-shadow-card:   0 1px 3px rgba(0,0,0,0.08);
  --hd-shadow-hover:  0 20px 25px -5px rgba(0,0,0,0.1);
  --hd-shadow-btn:    0 4px 6px -1px rgba(0,0,0,0.1);

  /* Transitions */
  --hd-ease-fast:     150ms ease;
  --hd-ease-base:     200ms ease;
  --hd-ease-moderate: 300ms ease;
  --hd-ease-slow:     500ms ease;
}`}</CodeBlock>
              </Accordion>

              <Accordion title="Bricks Global Classes" badge="13 classes">
                <Table compact headers={['Global Class', 'Properties', 'Maps to React']} rows={[
                  [<code className="text-xs bg-orange-50 text-[#FF5C00] px-1.5 py-0.5 rounded font-bold">.hd-container</code>, 'max-width + auto margin + gutters', <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">CONTAINER</code>],
                  [<code className="text-xs bg-orange-50 text-[#FF5C00] px-1.5 py-0.5 rounded font-bold">.hd-card</code>, 'white bg, border, radius-lg, shadow-card', 'Product/info cards'],
                  [<code className="text-xs bg-orange-50 text-[#FF5C00] px-1.5 py-0.5 rounded font-bold">.hd-btn-primary</code>, 'orange bg, white text, radius-sm, bold', 'Orange CTA buttons'],
                  [<code className="text-xs bg-orange-50 text-[#FF5C00] px-1.5 py-0.5 rounded font-bold">.hd-btn-secondary</code>, 'navy bg, white text', 'Navy buttons'],
                  [<code className="text-xs bg-orange-50 text-[#FF5C00] px-1.5 py-0.5 rounded font-bold">.hd-btn-ghost</code>, 'gray-100 bg → orange on hover', '"Add to Cart" cards'],
                  [<code className="text-xs bg-orange-50 text-[#FF5C00] px-1.5 py-0.5 rounded font-bold">.hd-badge-orange</code>, 'orange pill badge, 12px bold', '"Best Seller", "Save %"'],
                  [<code className="text-xs bg-orange-50 text-[#FF5C00] px-1.5 py-0.5 rounded font-bold">.hd-section-label</code>, 'orange, 14px, uppercase, tracking', 'Eyebrow text'],
                  [<code className="text-xs bg-orange-50 text-[#FF5C00] px-1.5 py-0.5 rounded font-bold">.hd-input</code>, '2px border, radius-sm, orange focus ring', 'All form inputs'],
                ]} />
              </Accordion>

              <Accordion title="Responsive Container Override">
                <CodeBlock title="Custom CSS — responsive container" language="CSS">{`@media (min-width: 1280px) {
  .hd-container { max-width: var(--hd-container-xl); }
}
@media (min-width: 1536px) {
  .hd-container {
    max-width: var(--hd-container-2xl);
    padding-left: var(--hd-gutter-2xl);
    padding-right: var(--hd-gutter-2xl);
  }
}`}</CodeBlock>
              </Accordion>

              <Accordion title="Font Setup">
                <CodeBlock title="Self-hosted Inter (child theme)" language="CSS">{`@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/wp-content/themes/bricks-child/fonts/Inter-Variable.woff2')
       format('woff2');
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}`}</CodeBlock>
              </Accordion>
            </section>

            {/* ═══ 4. TEMPLATES ═══ */}
            <section>
              <SH id="templates" title="Template Architecture" sub="Bricks templates and reusable components" icon={<LayoutTemplate size={20}/>} />

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <h3 className="font-bold text-[#132043] mb-3 flex items-center gap-2"><LayoutTemplate size={16} className="text-[#FF5C00]" /> Bricks Templates</h3>
                  <Table compact headers={['#', 'Template', 'Type', 'Condition']} rows={[
                    ['1', <span className="font-bold">Header — Global</span>, 'Header', 'Entire site'],
                    ['2', <span className="font-bold">Footer — Global</span>, 'Footer', 'Entire site'],
                    ['3', <span className="font-bold">Homepage</span>, 'Content', 'Front Page'],
                    ['4', <span className="font-bold">Shop Archive</span>, 'WC Archive', 'Product Archive'],
                    ['5', <span className="font-bold">Single Product</span>, 'WC Single', 'Single Product'],
                    ['6', <span className="font-bold">Cart</span>, 'Content', 'Page = Cart'],
                    ['7', <span className="font-bold">Checkout</span>, 'Content', 'Page = Checkout'],
                    ['8', <span className="font-bold">Order Confirmation</span>, 'Content', 'Thank-you'],
                  ]} />
                </Card>
                <Card>
                  <h3 className="font-bold text-[#132043] mb-3 flex items-center gap-2"><Box size={16} className="text-[#FF5C00]" /> Reusable Components</h3>
                  <Table compact headers={['Component', 'Used In', 'React Source']} rows={[
                    [<span className="font-bold">Product Card</span>, 'Shop, Home, Related', 'ProductCard'],
                    [<span className="font-bold">Trust Bar Item</span>, 'Home, Shop, PDP', 'Trust bar markup'],
                    [<span className="font-bold">Category Card</span>, 'Home categories', 'Category card'],
                    [<span className="font-bold">Promo Card</span>, 'Home promotions', 'Promotion tile'],
                    [<span className="font-bold">Star Rating</span>, 'Cards, PDP, reviews', 'StarRating'],
                    [<span className="font-bold">Search Widget</span>, 'Home hero', 'HeroSearchWidget'],
                  ]} />
                </Card>
              </div>

              <Card>
                <h3 className="font-bold text-[#132043] mb-3 flex items-center gap-2"><Globe size={16} className="text-[#FF5C00]" /> WordPress Page Structure</h3>
                <Table compact headers={['Page', 'Slug', 'Bricks Template']} rows={[
                  [<span className="font-bold">Home</span>, <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/</code>, 'Homepage'],
                  [<span className="font-bold">Shop</span>, <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/shop/</code>, 'Shop Archive (auto)'],
                  [<span className="font-bold">Cart</span>, <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/cart/</code>, 'Cart'],
                  [<span className="font-bold">Checkout</span>, <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/checkout/</code>, 'Checkout'],
                  [<span className="font-bold">My Account</span>, <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/my-account/</code>, 'Default WooCommerce'],
                ]} />
                <Callout type="info">
                  Single products are auto-generated at <code className="text-xs bg-sky-100 px-1 rounded">/product/&#123;slug&#125;/</code> by WooCommerce.
                </Callout>
              </Card>
            </section>

            {/* ═══ 5. HEADER ═══ */}
            <section>
              <SH id="header" title="Header Build" sub="Announcement bar, navigation, mobile menu, mini-cart" icon={<Monitor size={20}/>} />

              <Accordion title="5.1 Announcement Bar" badge="Section" defaultOpen>
                <div className="space-y-2 mt-3">
                  <TreeItem icon={<Box size={14}/>} label={<><span className="font-bold">Section</span> — bg: navy-dark, py: 6px, z: 50</>} />
                  <TreeItem icon={<Box size={14}/>} label={<><span className="font-bold">Div</span> .hd-container (flex, justify-between)</>} indent={1} />
                  <TreeItem icon={<Type size={14}/>} label="Left: Flash Sale text (orange) + Fitment Guarantee" indent={2} />
                  <TreeItem icon={<Type size={14}/>} label="Right: Phone number + Fitting stations [hidden < md]" indent={2} />
                </div>
              </Accordion>

              <Accordion title="5.2 Main Navigation Bar" badge="Sticky">
                <div className="space-y-2 mt-3">
                  <TreeItem icon={<Box size={14}/>} label={<><span className="font-bold">Section</span> — sticky, bg: white, z: 40, shadow</>} />
                  <TreeItem icon={<Box size={14}/>} label={<><span className="font-bold">Container</span> — flex, justify-between, h: 65px</>} indent={1} />
                  <TreeItem icon={<Image size={14}/>} label="Logo (h: 40px, link: home)" indent={2} />
                  <TreeItem icon={<Box size={14}/>} label={<>Nav Menu [hidden &lt; 1024px]: Shop Tyres, Mags, Combos, <span className="text-[#FF5C00] font-bold">Sale</span></>} indent={2} />
                  <TreeItem icon={<ShoppingCart size={14}/>} label="Cart button: .hd-btn-primary + {woo_cart_count} badge" indent={2} />
                  <TreeItem icon={<Users size={14}/>} label="User icon button → /my-account/" indent={2} />
                  <TreeItem icon={<Box size={14}/>} label="Hamburger [visible < 1024px] → triggers Off-Canvas" indent={2} />
                </div>
                <Callout type="tip">
                  Cart badge uses Bricks 2.3 <strong>Condition</strong>: Hide when <code>&#123;woo_cart_count&#125; = 0</code>
                </Callout>
              </Accordion>

              <Accordion title="5.3 Mobile Menu (Off-Canvas)" badge="< 1024px">
                <div className="space-y-2 mt-3">
                  <TreeItem icon={<Box size={14}/>} label={<><span className="font-bold">Off-Canvas</span> — position: left, w: 320px, bg: navy</>} />
                  <TreeItem icon={<Box size={14}/>} label="Header: Logo + Close button" indent={1} />
                  <TreeItem icon={<Box size={14}/>} label="Body: Vertical nav links + search input" indent={1} />
                  <TreeItem icon={<Box size={14}/>} label="Footer: Phone number + Visit Us link" indent={1} />
                </div>
              </Accordion>

              <Accordion title="5.4 Mini Cart Drawer (Enhancement)" badge="Popup">
                <p className="text-sm text-slate-600 mt-3">
                  Use Bricks 2.3 <strong>Popup element</strong> triggered by cart button click. Contains WooCommerce Mini Cart widget, subtotal, and "View Cart" / "Checkout" buttons.
                </p>
              </Accordion>
            </section>

            {/* ═══ 6. HOMEPAGE ═══ */}
            <section>
              <SH id="homepage" title="Homepage Build" sub="6 sections: Hero, Trust, Promos, Featured, About, Categories" icon={<Globe size={20}/>} />

              <Accordion title="6.1 Hero Section" badge="min-h: 640px" defaultOpen>
                <div className="space-y-2 mt-3">
                  <TreeItem icon={<Box size={14}/>} label={<><span className="font-bold">Section</span> — bg-image (Unsplash car), gradient overlay from navy</>} />
                  <TreeItem icon={<Box size={14}/>} label="2-column grid (stack on mobile)" indent={1} />
                  <TreeItem icon={<Star size={14}/>} label="Left: Badge pill + H1 + paragraph + trust checkmarks" indent={2} />
                  <TreeItem icon={<Search size={14}/>} label="Right: Search Widget (§11)" indent={2} />
                </div>
              </Accordion>

              <Accordion title="6.2 Trust Bar" badge="3 items">
                <p className="text-sm text-slate-600 mt-3">Navy bg, negative margin-top, 3-column grid. Each item: icon wrapper (white/10% bg) + title + description. Data: hardcoded or ACF Repeater.</p>
              </Accordion>

              <Accordion title="6.3 Promotions Section" badge="ACF Repeater + Countdown">
                <div className="space-y-2 mt-3">
                  <p className="text-sm text-slate-600">Asymmetric CSS Grid: Hero card (span 2 rows) + 4 tile cards (2×2). ACF Repeater with <code className="text-xs bg-slate-100 px-1 rounded">is_hero</code> boolean.</p>
                  <CodeBlock title="Countdown Timer — Bricks Code Element" language="HTML + JS">{`<div class="hd-countdown"
     data-end="<?php echo get_field('promo_countdown_end'); ?>">
  <span class="hd-countdown__label">Ends in</span>
  <span data-hours>00</span>:<span data-minutes>00</span>:<span data-seconds>00</span>
</div>
<script>
(function() {
  const el = document.querySelector('.hd-countdown');
  if (!el) return;
  const end = new Date(el.dataset.end).getTime();
  setInterval(() => {
    const d = Math.max(0, end - Date.now());
    el.querySelector('[data-hours]').textContent =
      String(Math.floor(d / 3600000)).padStart(2, '0');
    el.querySelector('[data-minutes]').textContent =
      String(Math.floor((d % 3600000) / 60000)).padStart(2, '0');
    el.querySelector('[data-seconds]').textContent =
      String(Math.floor((d % 60000) / 1000)).padStart(2, '0');
  }, 1000);
})();
</script>`}</CodeBlock>
                </div>
              </Accordion>

              <Accordion title="6.4 Featured Products" badge="Query Loop">
                <p className="text-sm text-slate-600 mt-3">
                  Bricks <strong>Query Loop</strong> over WooCommerce featured products (limit: 5). Grid: 2→3→4→5 columns. Each item renders the reusable <strong>Product Card</strong> component.
                </p>
                <Callout type="info">
                  Product Card is the most critical reusable component — build once, use on homepage, shop archive, related products, and search results.
                </Callout>
              </Accordion>

              <Accordion title="6.5 About Us Section" badge="2 columns">
                <p className="text-sm text-slate-600 mt-3">
                  Left: Storefront photo with rotated accent bg + floating 4.9/5 rating card. Right: Eyebrow, heading, paragraph, 2 feature rows, CTA button.
                </p>
              </Accordion>

              <Accordion title="6.6 Category Section" badge="3 cards">
                <p className="text-sm text-slate-600 mt-3">
                  3-column grid of image overlay cards. Query Loop over product categories (Performance, SUV/4WD, Wheels). Each links to <code className="text-xs bg-slate-100 px-1 rounded">&#123;term_link&#125;</code>.
                </p>
              </Accordion>
            </section>

            {/* ═══ 7. SHOP ═══ */}
            <section>
              <SH id="shop" title="Shop Archive Build" sub="Filters, product grid, pagination" icon={<ShoppingCart size={20}/>} />

              <Card className="mb-4">
                <h3 className="font-bold text-[#132043] mb-3">Layout Structure</h3>
                <div className="space-y-1">
                  <TreeItem icon={<Box size={14}/>} label={<span className="font-bold">Navy Header — Breadcrumb + H1 + count + quick filters</span>} />
                  <TreeItem icon={<Box size={14}/>} label={<span className="font-bold">Sticky Toolbar — Filter toggle + sort + view toggle</span>} />
                  <TreeItem icon={<Box size={14}/>} label={<span className="font-bold">Main Content (flex)</span>} />
                  <TreeItem icon={<Box size={14}/>} label="Sidebar (256px, sticky, hidden < lg) — FacetWP facets" indent={1} />
                  <TreeItem icon={<Box size={14}/>} label="Product Grid (flex: 1) — Query Loop + Product Card" indent={1} />
                </div>
              </Card>

              <Accordion title="FacetWP Facet Configuration" badge="10 facets">
                <Table compact headers={['Facet', 'Data Source', 'Type']} rows={[
                  [<span className="font-bold">search</span>, 'Post Title + Content', 'Search'],
                  [<span className="font-bold">category</span>, 'product_cat', 'Checkboxes'],
                  [<span className="font-bold">brand</span>, 'pa_brand', 'Checkboxes'],
                  [<span className="font-bold">width</span>, 'pa_width', 'Buttons (pills)'],
                  [<span className="font-bold">price</span>, 'regular_price', 'Slider'],
                  [<span className="font-bold">rating</span>, 'average_rating', 'Buttons'],
                  [<span className="font-bold">stock</span>, 'stock_status', 'Checkbox'],
                  [<span className="font-bold">sort</span>, '—', 'Sort dropdown'],
                  [<span className="font-bold">pager</span>, '—', 'Numbered pagination'],
                  [<span className="font-bold">reset</span>, '—', '"Clear all" link'],
                ]} />
              </Accordion>

              <Accordion title="FacetWP Custom CSS" badge="Styling">
                <CodeBlock title="FacetWP → match Hyperdrive design" language="CSS">{`/* Checkbox styling */
.facetwp-checkbox.checked {
  font-weight: 700;
  color: var(--hd-navy);
}
.facetwp-checkbox.checked::before {
  background: var(--hd-orange);
  border-color: var(--hd-orange);
}

/* Slider accent */
.facetwp-slider .noUi-connect {
  background: var(--hd-orange);
}

/* Pager */
.facetwp-pager .facetwp-page.active {
  background: var(--hd-orange);
  border-color: var(--hd-orange);
  color: white;
}`}</CodeBlock>
              </Accordion>
            </section>

            {/* ═══ 8. PRODUCT ═══ */}
            <section>
              <SH id="product" title="Single Product Build" sub="Gallery, specs, reviews, related products" icon={<Package size={20}/>} />

              <Card className="mb-4">
                <h3 className="font-bold text-[#132043] mb-3">Product Page Structure</h3>
                <div className="space-y-1">
                  <TreeItem icon={<Box size={14}/>} label={<span className="font-bold">Navy Header — breadcrumb</span>} />
                  <TreeItem icon={<Box size={14}/>} label={<span className="font-bold">Main Product (2-col grid)</span>} />
                  <TreeItem icon={<Image size={14}/>} label="Left: Gallery — main image + thumbnail strip" indent={1} />
                  <TreeItem icon={<FileText size={14}/>} label="Right: Brand + title + rating + description" indent={1} />
                  <TreeItem icon={<CreditCard size={14}/>} label="Right: Price Block — price, qty (default 4), total, Add to Cart" indent={1} />
                  <TreeItem icon={<Shield size={14}/>} label="Right: Trust badges (3-col: Fitment, Shipping, Fitting)" indent={1} />
                  <TreeItem icon={<Box size={14}/>} label={<span className="font-bold">Specs + Reviews (2-col grid)</span>} />
                  <TreeItem icon={<Box size={14}/>} label={<span className="font-bold">Related Products (4-col Query Loop)</span>} />
                </div>
              </Card>

              <Accordion title="Quantity Default Override" badge="PHP">
                <CodeBlock title="functions.php — Default qty = 4" language="PHP">{`add_filter('woocommerce_quantity_input_args',
  function($args, $product) {
    if (is_product() && $product->is_type('simple')) {
        $args['input_value'] = 4; // Most drivers buy 4
        $args['min_value']   = 1;
        $args['max_value']   = 8;
    }
    return $args;
  }, 10, 2);`}</CodeBlock>
              </Accordion>

              <Accordion title="Specifications Table" badge="Code Element">
                <CodeBlock title="Bricks Code Element — specs table" language="PHP">{`<?php
global $product;
$specs = [
    'Size'         => $product->get_attribute('pa_width') . '/' .
                      $product->get_attribute('pa_profile') . ' R' .
                      $product->get_attribute('pa_rim'),
    'Brand'        => $product->get_attribute('pa_brand'),
    'Category'     => $product->get_attribute('pa_category'),
    'Load Index'   => $product->get_attribute('pa_load_index'),
    'Speed Rating' => $product->get_attribute('pa_speed_rating'),
    'Tread Depth'  => get_field('tread_depth'),
    'Warranty'     => number_format(get_field('warranty_km')) . ' km',
    'Season'       => $product->get_attribute('pa_season'),
];
foreach ($specs as $label => $value) {
    if (!$value) continue;
    echo '<div class="hd-spec-row">';
    echo '<span>' . esc_html($label) . '</span>';
    echo '<span>' . esc_html($value) . '</span>';
    echo '</div>';
} ?>`}</CodeBlock>
              </Accordion>
            </section>

            {/* ═══ 9. CHECKOUT ═══ */}
            <section>
              <SH id="checkout" title="Cart & Checkout Build" sub="Multi-step checkout with fitting station selector" icon={<CreditCard size={20}/>} />

              <Accordion title="9.1 Cart Page" badge="Template" defaultOpen>
                <div className="space-y-2 mt-3">
                  <TreeItem icon={<Box size={14}/>} label={<span className="font-bold">Progress Steps bar (Cart → Details → Payment → Confirmation)</span>} />
                  <TreeItem icon={<Box size={14}/>} label={<span className="font-bold">3-column grid: Main (2fr) + Sidebar (1fr)</span>} />
                  <TreeItem icon={<ShoppingCart size={14}/>} label="Main: Cart items (image, name, qty selector, remove, line total)" indent={1} />
                  <TreeItem icon={<BarChart3 size={14}/>} label="Sidebar: Order Summary (subtotal, shipping, GST 15%, total)" indent={1} />
                </div>
                <Callout type="info">
                  <strong>Shipping logic:</strong> Free over $500, else $29.95 flat rate. Configure in WooCommerce → Settings → Shipping → NZ Zone.
                </Callout>
              </Accordion>

              <Accordion title="9.2 Multi-Step Checkout" badge="JS + Conditions">
                <p className="text-sm text-slate-600 mt-3 mb-3">
                  Split checkout fields into visible steps using <code className="text-xs bg-slate-100 px-1 rounded">data-step</code> attributes + JS to toggle visibility:
                </p>
                <CodeBlock title="Multi-step checkout JS" language="JavaScript">{`document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form.checkout');
  if (!form) return;

  const steps = form.querySelectorAll('[data-step]');
  function showStep(name) {
    steps.forEach(el => {
      el.style.display = el.dataset.step === name ? '' : 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  form.querySelectorAll('[data-goto-step]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      showStep(this.dataset.gotoStep);
    });
  });

  showStep('details');
});`}</CodeBlock>
              </Accordion>

              <Accordion title="9.3 Fitting Station Selector" badge="PHP Custom Field">
                <CodeBlock title="functions.php — Fitting station checkout field" language="PHP">{`add_action('woocommerce_before_order_notes', function($checkout) {
    woocommerce_form_field('fitting_station', [
        'type'     => 'select',
        'label'    => 'Choose a Fitting Station',
        'required' => true,
        'options'  => [
            ''                 => 'Select a station...',
            'auckland-central' => 'Tyre Plus — Auckland Central',
            'auckland-east'    => 'Fast Fit — East Auckland',
            'wellington'       => 'Capital Tyres — Wellington CBD',
            'christchurch'     => 'South Island Tyres — Christchurch',
            'hamilton'         => 'Waikato Wheel Works — Hamilton',
            'home'             => 'Ship to home address instead',
        ],
    ], $checkout->get_value('fitting_station'));
});

// Save to order meta
add_action('woocommerce_checkout_update_order_meta', function($id) {
    if (!empty($_POST['fitting_station'])) {
        update_post_meta($id, '_fitting_station',
          sanitize_text_field($_POST['fitting_station']));
    }
});`}</CodeBlock>
              </Accordion>
            </section>

            {/* ═══ 10. DATA MODEL ═══ */}
            <section>
              <SH id="data" title="WooCommerce Data Model" sub="Attributes, ACF fields, tax, shipping" icon={<Database size={20}/>} />

              <Accordion title="Product Attributes" badge="8 attributes" defaultOpen>
                <Table compact headers={['Attribute', 'Slug', 'Example Terms']} rows={[
                  [<span className="font-bold">Brand</span>, <code className="text-xs bg-slate-100 px-1 rounded">pa_brand</code>, 'Michelin, Bridgestone, Pirelli, Goodyear, Continental...'],
                  [<span className="font-bold">Tyre Width</span>, <code className="text-xs bg-slate-100 px-1 rounded">pa_width</code>, '205, 215, 225, 235, 245, 255, 265, 275'],
                  [<span className="font-bold">Profile</span>, <code className="text-xs bg-slate-100 px-1 rounded">pa_profile</code>, '35, 40, 45, 50, 55, 60, 65, 70'],
                  [<span className="font-bold">Rim Size</span>, <code className="text-xs bg-slate-100 px-1 rounded">pa_rim</code>, '16, 17, 18, 19, 20'],
                  [<span className="font-bold">Category</span>, <code className="text-xs bg-slate-100 px-1 rounded">pa_category</code>, 'Performance, Passenger, SUV/4WD, All Season, Run-Flat'],
                  [<span className="font-bold">Speed Rating</span>, <code className="text-xs bg-slate-100 px-1 rounded">pa_speed_rating</code>, 'H, V, W, Y'],
                  [<span className="font-bold">Load Index</span>, <code className="text-xs bg-slate-100 px-1 rounded">pa_load_index</code>, '87, 91, 94, 97, 100'],
                  [<span className="font-bold">Season</span>, <code className="text-xs bg-slate-100 px-1 rounded">pa_season</code>, 'Summer, Winter, All Season'],
                ]} />
              </Accordion>

              <Accordion title="ACF Product Fields" badge="5 fields">
                <Table compact headers={['Field', 'Type', 'Example']} rows={[
                  [<span className="font-bold">badge_text</span>, 'Text', '"Best Seller", "Top Rated"'],
                  [<span className="font-bold">badge_color</span>, 'Select', 'orange, navy, amber, sky, green'],
                  [<span className="font-bold">warranty_km</span>, 'Number', '80000'],
                  [<span className="font-bold">tread_depth</span>, 'Text', '"7.5mm"'],
                  [<span className="font-bold">sidewall_type</span>, 'Select', 'Black, White Letter'],
                ]} />
              </Accordion>

              <Accordion title="WooCommerce Settings" badge="Config">
                <Table compact headers={['Setting', 'Value']} rows={[
                  ['Tax → NZ Rate', <span className="font-bold">15% GST</span>],
                  ['Tax → Prices entered', 'Exclusive of tax'],
                  ['Shipping → Free Shipping', 'Min order: $500'],
                  ['Shipping → Flat Rate', '$29.95'],
                  ['Payment → Stripe', 'NZ Stripe keys'],
                  ['Inventory → Stock management', 'Enabled'],
                ]} />
              </Accordion>
            </section>

            {/* ═══ 11. SEARCH ═══ */}
            <section>
              <SH id="search" title="Search Widget (Rego + Size)" sub="Hero search tabs with FacetWP integration" icon={<Search size={20}/>} />

              <Card className="mb-4">
                <h3 className="font-bold text-[#132043] mb-3">Tab Structure</h3>
                <p className="text-sm text-slate-600 mb-3">Uses Bricks <strong>Interactions API</strong> for tab switching. "Search by Size" is default active.</p>
                <div className="space-y-1">
                  <TreeItem icon={<Box size={14}/>} label={<span className="font-bold">Search Widget (bg: white, rounded-2xl, shadow-2xl)</span>} />
                  <TreeItem icon={<Box size={14}/>} label="Tab Row (Rego | Size) — border-top: 4px orange on active" indent={1} />
                  <TreeItem icon={<Box size={14}/>} label='Panel: Rego — plate input + "Find My Tyres" button' indent={1} />
                  <TreeItem icon={<Box size={14}/>} label="Panel: Size — 3 selects (width, profile, rim) + button" indent={1} />
                </div>
                <Callout type="tip">
                  Size search submits to <code className="text-xs bg-green-100 px-1 rounded">/shop/?fwp_width=225&fwp_profile=45&fwp_rim=17</code> — FacetWP auto-filters.
                </Callout>
              </Card>

              <Accordion title="Rego Lookup Plugin" badge="Custom Plugin">
                <CodeBlock title="hyperdrive-rego-lookup.php — AJAX handler" language="PHP">{`class HD_Rego_Lookup {
    public function handle_lookup() {
        check_ajax_referer('hd_rego_nonce', 'nonce');

        $plate = sanitize_text_field($_POST['plate'] ?? '');
        if (!preg_match('/^[A-Z0-9]{1,7}$/i', $plate)) {
            wp_send_json_error('Invalid plate format');
        }

        // Call CarJam NZ API
        $api_key = get_option('hd_carjam_api_key', '');
        $response = wp_remote_get(
            "https://www.carjam.co.nz/a/vehicle:abcd"
          . "?plate={$plate}&key={$api_key}"
        );

        $body = json_decode(wp_remote_retrieve_body($response), true);

        // Map vehicle → tyre size → shop redirect
        $width   = $body['tyre_width'] ?? '225';
        $profile = $body['tyre_profile'] ?? '45';
        $rim     = $body['tyre_rim'] ?? '17';

        wp_send_json_success([
            'vehicle'  => ($body['make'] ?? '') . ' ' . ($body['model'] ?? ''),
            'redirect' => home_url(
              "/shop/?fwp_width={$width}&fwp_profile={$profile}&fwp_rim={$rim}"
            ),
        ]);
    }
}`}</CodeBlock>
              </Accordion>
            </section>

            {/* ═══ 12. AJAX CART ═══ */}
            <section>
              <SH id="cart" title="AJAX Cart Integration" sub="Replacing React CartContext with WooCommerce native cart" icon={<Zap size={20}/>} />

              <Card className="mb-4">
                <h3 className="font-bold text-[#132043] mb-3">How It Works</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: <ShoppingCart size={20}/>, title: 'AJAX Add to Cart', desc: 'WooCommerce native. Enable in Settings → Products → General.' },
                    { icon: <Zap size={20}/>, title: 'Cart Fragments', desc: 'WC fires added_to_cart events that auto-update registered fragments.' },
                    { icon: <Hash size={20}/>, title: 'Badge Update', desc: 'Register header badge as a WC fragment via PHP filter.' },
                  ].map(f => (
                    <div key={f.title} className="text-center p-4 rounded-xl border border-slate-200">
                      <div className="w-10 h-10 rounded-full bg-[#FF5C00]/10 flex items-center justify-center text-[#FF5C00] mx-auto mb-3">{f.icon}</div>
                      <div className="font-bold text-sm text-[#132043] mb-1">{f.title}</div>
                      <div className="text-xs text-slate-500">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Accordion title="Cart Fragment Registration" badge="PHP">
                <CodeBlock title="functions.php — Register cart badge as fragment" language="PHP">{`add_filter('woocommerce_add_to_cart_fragments', function($fragments) {
    $count = WC()->cart->get_cart_contents_count();
    $fragments['.hd-cart-count'] = '<span class="hd-cart-count"'
        . ($count === 0 ? ' style="display:none"' : '')
        . '>' . esc_html($count) . '</span>';
    return $fragments;
});`}</CodeBlock>
              </Accordion>
            </section>

            {/* ═══ 13. PERFORMANCE ═══ */}
            <section>
              <SH id="performance" title="Performance & Hosting" sub="Core Web Vitals targets and optimisation" icon={<Gauge size={20}/>} />

              <Card className="mb-4">
                <h3 className="font-bold text-[#132043] mb-3 flex items-center gap-2"><Gauge size={16} className="text-[#FF5C00]" /> Performance Budget</h3>
                <Table compact headers={['Metric', 'Target', 'Strategy']} rows={[
                  [<span className="font-bold text-green-600">LCP</span>, '< 2.5s', 'Preload hero image, inline critical CSS'],
                  [<span className="font-bold text-green-600">INP</span>, '< 200ms', 'Defer non-critical JS, minimal jQuery'],
                  [<span className="font-bold text-green-600">CLS</span>, '< 0.1', 'Explicit image dimensions, font-display: swap'],
                  [<span className="font-bold text-amber-600">Page weight</span>, '< 1.5MB', 'WebP images, lazy load below fold'],
                  [<span className="font-bold text-amber-600">TTFB</span>, '< 400ms', 'Server cache + Redis + CDN'],
                ]} />
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <h3 className="font-bold text-[#132043] mb-3 flex items-center gap-2"><Image size={16} className="text-[#FF5C00]" /> Image Strategy</h3>
                  <Table compact headers={['Type', 'Format', 'Max Width', 'Lazy']} rows={[
                    ['Hero background', 'WebP', '1920px', <Badge color="amber">No (LCP)</Badge>],
                    ['Product images', 'WebP', '600px', <Badge color="green">Yes</Badge>],
                    ['Category cards', 'WebP', '800px', <Badge color="green">Yes</Badge>],
                    ['Logo', 'SVG', '—', <Badge color="amber">No</Badge>],
                  ]} />
                </Card>
                <Card>
                  <h3 className="font-bold text-[#132043] mb-3 flex items-center gap-2"><CloudLightning size={16} className="text-[#FF5C00]" /> Cloudflare</h3>
                  <Table compact headers={['Setting', 'Value']} rows={[
                    ['Cache Level', 'Standard'],
                    ['Browser Cache TTL', '1 month (static)'],
                    ['Polish', 'Lossy'],
                    ['HTTP/3', <Badge color="green">Enabled</Badge>],
                    ['Early Hints', <Badge color="green">Enabled</Badge>],
                    ['APO for WordPress', <Badge color="green">Enabled</Badge>],
                  ]} />
                </Card>
              </div>
            </section>

            {/* ═══ 14. TIMELINE ═══ */}
            <section>
              <SH id="timeline" title="Migration Sequence" sub="6 phases, ~16 working days" icon={<Clock size={20}/>} />

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { phase: 1, title: 'Foundation', days: 'Days 1–2', tasks: ['Provision hosting', 'Install WordPress + plugins', 'Configure WooCommerce (tax, shipping, Stripe)', 'Register CSS variables + global classes', 'Create ACF field groups', 'Create WC attributes'], status: 'done' as const },
                  { phase: 2, title: 'Templates — Structure', days: 'Days 3–5', tasks: ['Header template', 'Footer template', 'Product Card component', 'Trust Bar Item component', 'Homepage (all 6 sections)', 'Hero search widget'], status: 'done' as const },
                  { phase: 3, title: 'WooCommerce Templates', days: 'Days 6–9', tasks: ['Shop Archive + FacetWP', 'Single Product template', 'Cart page template', 'Checkout (multi-step)', 'Order Confirmation', 'Fitting station field', 'AJAX cart integration'], status: 'active' as const },
                  { phase: 4, title: 'Content & Data', days: 'Days 10–11', tasks: ['Prepare product images', 'Import 20 products via CSV', 'Set ACF fields on products', 'Populate homepage ACF fields', 'Upload brand assets', 'Create product categories'], status: 'pending' as const },
                  { phase: 5, title: 'Custom Plugin', days: 'Days 11–12', tasks: ['Build rego-lookup plugin', 'Integrate CarJam API', 'Frontend rego JS', 'Test rego → filter flow'], status: 'pending' as const },
                  { phase: 6, title: 'Polish & QA', days: 'Days 13–16', tasks: ['Responsive QA (6 breakpoints)', 'Cross-browser testing', 'Accessibility audit', 'Performance audit (Lighthouse)', 'Full checkout flow test', 'WP Rocket + Cloudflare', 'SEO setup', 'DNS cutover + go-live'], status: 'pending' as const },
                ].map(p => (
                  <Card key={p.phase}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        p.status === 'done' ? 'bg-green-500 text-white' :
                        p.status === 'active' ? 'bg-[#FF5C00] text-white' :
                        'bg-slate-200 text-slate-500'
                      }`}>
                        {p.status === 'done' ? <Check size={14}/> : p.phase}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#132043]">Phase {p.phase}: {p.title}</div>
                        <div className="text-xs text-slate-400">{p.days}</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {p.tasks.map(t => (
                        <div key={t} className="flex items-start gap-2 text-xs text-slate-600">
                          <Circle size={8} className="text-slate-300 flex-shrink-0 mt-1" />
                          {t}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#132043]">Total Estimated Timeline</div>
                    <div className="text-sm text-slate-500">Based on a single developer working full-time</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-[#FF5C00]">~16 days</div>
                    <div className="text-sm text-slate-400">~128 hours</div>
                  </div>
                </div>
              </Card>
            </section>

            {/* ═══ 15. QA ═══ */}
            <section>
              <SH id="qa" title="QA Checklist" sub="Interactive checklist — click to mark complete" icon={<ListChecks size={20}/>} />

              <Accordion title="Functional QA" badge="31 checks" defaultOpen>
                <div className="space-y-0.5 mt-3">
                  {[
                    'Homepage loads all 6 sections with correct styling',
                    'Hero search — "By Size" is default active tab',
                    'Size search → redirects to filtered shop page',
                    'Rego search → API lookup → redirects to filtered shop page',
                    'Countdown timer counts down from ACF date',
                    'Shop archive — all FacetWP filters work',
                    'Shop archive — AJAX filtering (no page reload)',
                    'Shop archive — sort dropdown works',
                    'Shop archive — mobile filter drawer opens/closes',
                    'Product card — badge shows when ACF field is set',
                    'Product card — "Add to Cart" AJAX works, updates header badge',
                    'Product card — click navigates to single product',
                    'Single product — gallery thumbnails switch main image',
                    'Single product — quantity defaults to 4',
                    'Single product — total updates live when quantity changes',
                    'Single product — add to cart updates header badge',
                    'Single product — specs table from attributes + ACF',
                    'Single product — reviews display correctly',
                    'Single product — related products show 4 same-category items',
                    'Cart — items list with correct prices and quantities',
                    'Cart — quantity +/- updates totals',
                    'Cart — remove item works',
                    'Cart — shipping: free over $500, $29.95 under',
                    'Cart — GST 15% calculated correctly',
                    'Checkout — multi-step navigation (details → payment)',
                    'Checkout — fitting station dropdown works',
                    'Checkout — Stripe payment processes (test mode)',
                    'Checkout — order created in WooCommerce admin',
                    'Confirmation — order number + next-steps shown',
                    'Empty cart — shows empty state with "Browse Tyres" CTA',
                    'Header cart badge updates across all pages',
                  ].map(t => <CheckRow key={t} text={t} />)}
                </div>
              </Accordion>

              <Accordion title="Responsive QA" badge="6 breakpoints">
                <div className="space-y-0.5 mt-3">
                  {[
                    'Mobile (375px) — single column, hamburger, stacked, touch-friendly',
                    'SM (640px) — 2-col product grid, stacked hero',
                    'MD (768px) — trust bar multi-col, wider cards',
                    'LG (1024px) — desktop nav visible, sidebar filters visible',
                    'XL (1280px) — container 1280px, 4-col products',
                    '2XL (1536px) — container 1440px, 5-col products, 40px gutters',
                  ].map(t => <CheckRow key={t} text={t} />)}
                </div>
              </Accordion>

              <Accordion title="Performance QA" badge="7 metrics">
                <div className="space-y-0.5 mt-3">
                  {[
                    'Lighthouse Performance (mobile) ≥ 85',
                    'Lighthouse Performance (desktop) ≥ 95',
                    'LCP < 2.5s',
                    'INP < 200ms',
                    'CLS < 0.1',
                    'Total page weight (homepage) < 1.5MB',
                    'TTFB < 400ms',
                  ].map(t => <CheckRow key={t} text={t} />)}
                </div>
              </Accordion>

              <Accordion title="Accessibility QA" badge="8 checks">
                <div className="space-y-0.5 mt-3">
                  {[
                    'All images have alt text',
                    'All form inputs have visible labels with for/id pairing',
                    'Keyboard navigation: Tab through all interactive elements',
                    'Focus rings visible on all interactive elements (orange ring)',
                    'Colour contrast: all text passes WCAG AA (4.5:1 normal, 3:1 large)',
                    'Screen reader: headings hierarchy + landmarks',
                    'Cart badge uses aria-label for count',
                    'Mobile menu: focus trapped when open, Escape closes',
                  ].map(t => <CheckRow key={t} text={t} />)}
                </div>
              </Accordion>
            </section>

            {/* ═══ FILE TREE ═══ */}
            <section>
              <Card className="bg-[#0B132C] border-[#132043]">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <HardDrive size={16} className="text-[#FF5C00]" /> File Deliverables
                </h3>
                <pre className="text-xs text-emerald-300 font-mono leading-relaxed overflow-x-auto">{`WordPress Installation
├── /wp-content/themes/bricks-child/
│   ├── style.css
│   ├── functions.php
│   ├── fonts/Inter-Variable.woff2
│   └── woocommerce/  (template overrides)
│
├── /wp-content/plugins/hyperdrive-rego-lookup/
│   ├── hyperdrive-rego-lookup.php
│   ├── includes/class-carjam-api.php
│   └── assets/rego-lookup.js
│
├── Bricks Templates (8 templates)
│   ├── Header — Global
│   ├── Footer — Global
│   ├── Homepage
│   ├── Shop Archive
│   ├── Single Product
│   ├── Cart / Checkout / Confirmation
│
├── Bricks Template Parts (6 components)
│   ├── Product Card
│   ├── Trust Bar Item
│   ├── Category Card
│   ├── Promo Card
│   ├── Star Rating
│   └── Search Widget
│
├── ACF Field Groups (3 JSON exports)
├── FacetWP Config (JSON export)
└── WooCommerce Product CSV (20 products)`}</pre>
              </Card>
            </section>

            {/* Bottom spacer */}
            <div className="h-16" />
          </div>
        </div>
      </div>
    </div>
  );
};
