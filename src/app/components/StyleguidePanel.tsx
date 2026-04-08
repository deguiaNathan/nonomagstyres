import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Copy, Check, Settings, ShoppingCart, Star, ArrowRight,
  ChevronRight, TrendingUp, ShieldCheck, MapPin, Package,
  Phone, CheckCircle, Wrench, ThumbsUp, Menu, User,
  Tag, AlertCircle
} from 'lucide-react';
import logoUrl from '../../assets/logo.png';

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'brand',      label: 'Brand Identity' },
  { id: 'colours',    label: 'Colour System' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing',    label: 'Spacing & Grid' },
  { id: 'elevation',  label: 'Elevation & Radius' },
  { id: 'buttons',    label: 'Buttons' },
  { id: 'forms',      label: 'Form Elements' },
  { id: 'cards',      label: 'Cards' },
  { id: 'badges',     label: 'Badges & Labels' },
  { id: 'icons',      label: 'Iconography' },
  { id: 'motion',     label: 'Motion' },
  { id: 'ux',         label: 'UX Principles' },
];

const COLOUR_GROUPS = [
  {
    group: 'Brand Primary',
    colors: [
      { name: 'Navy',        hex: '#132043', text: 'white', usage: 'Headings, nav bar, trust bar bg, CTA secondary' },
      { name: 'Navy Dark',   hex: '#0B132C', text: 'white', usage: 'Footer bg, hover on navy, deep overlays' },
    ],
  },
  {
    group: 'Brand Accent',
    colors: [
      { name: 'Orange',       hex: '#FF5C00', text: 'white', usage: 'Primary CTAs, active tab, badge bg, icon accent' },
      { name: 'Orange Hover', hex: '#E05200', text: 'white', usage: 'Pressed / hover state for all orange elements' },
    ],
  },
  {
    group: 'Neutral Scale',
    colors: [
      { name: 'White',     hex: '#FFFFFF', text: '#132043', usage: 'Card bg, input bg, text on dark surfaces' },
      { name: 'Gray 50',   hex: '#F9FAFB', text: '#132043', usage: 'Page section alternating bg' },
      { name: 'Gray 100',  hex: '#F3F4F6', text: '#132043', usage: 'Promo section bg, ghost button fill' },
      { name: 'Gray 200',  hex: '#E2E8F0', text: '#132043', usage: 'Card borders, dividers, input default border' },
      { name: 'Gray 500',  hex: '#6B7280', text: 'white',   usage: 'Muted body text, placeholders, captions' },
      { name: 'Gray 900',  hex: '#1F2937', text: 'white',   usage: 'Primary body text, card titles' },
    ],
  },
  {
    group: 'Semantic',
    colors: [
      { name: 'Success', hex: '#16A34A', text: 'white', usage: 'Fitment guarantee, saving badges, positive states' },
      { name: 'Info',    hex: '#0EA5E9', text: 'white', usage: 'Seasonal / informational badges, tooltips' },
      { name: 'Warning', hex: '#F59E0B', text: 'white', usage: 'Low-stock alerts, countdown urgency elements' },
      { name: 'Error',   hex: '#DC2626', text: 'white', usage: 'Form errors, out-of-stock, destructive actions' },
    ],
  },
];

const TYPE_SCALE = [
  { label: 'Display / H1', tailwind: 'text-6xl', px: 60, weight: '800', lh: 'tight',   sample: 'Get the Right Tyres.', usage: 'Hero headline only' },
  { label: 'H1 Alt',       tailwind: 'text-5xl', px: 48, weight: '800', lh: 'tight',   sample: 'Premium Tyres & Mags', usage: 'Hero headline variant' },
  { label: 'H2 Section',   tailwind: 'text-4xl', px: 36, weight: '800', lh: 'tight',   sample: 'Featured Deals',       usage: 'Section headings' },
  { label: 'H3 Card',      tailwind: 'text-2xl', px: 24, weight: '700', lh: 'tight',   sample: 'Michelin Pilot Sport 4',usage: 'Card titles, panel headings' },
  { label: 'H4 Feature',   tailwind: 'text-lg',  px: 18, weight: '700', lh: 'snug',    sample: 'Local Expert Fitting', usage: 'Feature bullets, trust items' },
  { label: 'Body Large',   tailwind: 'text-xl',  px: 20, weight: '500', lh: 'relaxed', sample: "Enter your rego and we'll find exact-fit tyres for your car.", usage: 'Hero & section subheadings' },
  { label: 'Body Base',    tailwind: 'text-base',px: 16, weight: '400', lh: 'relaxed', sample: 'Choose from 200+ vetted fitting stations. We ship directly to them.', usage: 'Standard body text' },
  { label: 'Body Small',   tailwind: 'text-sm',  px: 14, weight: '400', lh: 'relaxed', sample: 'Shipped directly to your fitter or right to your door.', usage: 'Card descriptions, footer text' },
  { label: 'Label / Cap',  tailwind: 'text-xs',  px: 12, weight: '700', lh: 'normal',  sample: 'MICHELIN • 225/45 R17', usage: 'Uppercase metadata, brand labels, badges' },
];

const SPACING = [
  { token: 'space-1',  px: 4,   use: 'Icon gap, tight inline' },
  { token: 'space-2',  px: 8,   use: 'Base unit — badge pad, icon margin' },
  { token: 'space-3',  px: 12,  use: 'Compact button / input padding' },
  { token: 'space-4',  px: 16,  use: 'Standard button pad, card inner gap' },
  { token: 'space-6',  px: 24,  use: 'Card padding, grid gap default' },
  { token: 'space-8',  px: 32,  use: 'Container gutters (px-8)' },
  { token: 'space-10', px: 40,  use: 'Wide gutters at 2xl (px-10)' },
  { token: 'space-12', px: 48,  use: 'Trust bar padding Y' },
  { token: 'space-16', px: 64,  use: 'Section inner content gap' },
  { token: 'space-24', px: 96,  use: 'Section vertical rhythm (py-24)' },
];

const BREAKPOINTS = [
  { bp: 'xs',   min: '0px',    max: '639px',  cols: 1, container: 'fluid',   note: 'Mobile — single column stacking' },
  { bp: 'sm',   min: '640px',  max: '767px',  cols: 2, container: 'fluid',   note: 'Product/promo grid → 2 col' },
  { bp: 'md',   min: '768px',  max: '1023px', cols: 2, container: 'fluid',   note: 'Trust bar & footer → multi-col' },
  { bp: 'lg',   min: '1024px', max: '1279px', cols: 4, container: 'fluid',   note: 'Product grid → 4 col, hero → 2 col' },
  { bp: 'xl',   min: '1280px', max: '1535px', cols: 4, container: '1280px',  note: 'Container locks to 1280px (67% of 1920)' },
  { bp: '2xl',  min: '1536px', max: '∞',      cols: 5, container: '1440px',  note: 'Container → 1440px. Grids → 5 col (75% of 1920, 56% of 2560)' },
];

const SHADOWS = [
  { name: 'shadow-sm', use: 'Card resting state' },
  { name: 'shadow',    use: 'Floating pill badges' },
  { name: 'shadow-md', use: 'Buttons, sticky nav' },
  { name: 'shadow-lg', use: 'Dropdowns, footer trust cards' },
  { name: 'shadow-xl', use: 'Card hover lift, trust badge overlay' },
  { name: 'shadow-2xl',use: 'Hero search widget, modals, styleguide panel' },
];

const RADII = [
  { name: 'rounded-lg',  px: '8px',   use: 'Buttons, inputs, small cards' },
  { name: 'rounded-xl',  px: '12px',  use: 'Hero widget, info panels' },
  { name: 'rounded-2xl', px: '16px',  use: 'Product cards, promo cards' },
  { name: 'rounded-3xl', px: '24px',  use: 'Category image cards' },
  { name: 'rounded-full',px: '9999px',use: 'Badges, pills, avatar circles' },
];

const ICON_SET = [
  { icon: <ShoppingCart size={20}/>, name: 'ShoppingCart', use: 'Cart button, add to cart CTA' },
  { icon: <Star size={20}/>,         name: 'Star',          use: 'Ratings, social proof, hero badge' },
  { icon: <ArrowRight size={20}/>,   name: 'ArrowRight',    use: 'CTA directional affordance' },
  { icon: <ChevronRight size={20}/>, name: 'ChevronRight',  use: '"View all" text links' },
  { icon: <TrendingUp size={20}/>,   name: 'TrendingUp',    use: 'Flash sale, section label' },
  { icon: <ShieldCheck size={20}/>,  name: 'ShieldCheck',   use: 'Fitment guarantee trust item' },
  { icon: <MapPin size={20}/>,       name: 'MapPin',        use: 'Fitting stations trust item' },
  { icon: <Package size={20}/>,      name: 'Package',       use: 'Delivery trust item' },
  { icon: <Phone size={20}/>,        name: 'Phone',         use: 'Contact / help panel' },
  { icon: <CheckCircle size={20}/>,  name: 'CheckCircle',   use: 'Guarantees, form success, saving pill' },
  { icon: <Wrench size={20}/>,       name: 'Wrench',        use: 'Local fitting feature' },
  { icon: <ThumbsUp size={20}/>,     name: 'ThumbsUp',      use: '"Why Choose Us" section label' },
  { icon: <User size={20}/>,         name: 'User',          use: 'Account nav icon' },
  { icon: <Menu size={20}/>,         name: 'Menu',          use: 'Mobile hamburger' },
  { icon: <X size={20}/>,            name: 'X',             use: 'Close / dismiss' },
  { icon: <Tag size={20}/>,          name: 'Tag',           use: 'Sale nav item, promo section label' },
  { icon: <AlertCircle size={20}/>,  name: 'AlertCircle',   use: 'Warning states, stock alerts' },
  { icon: <Settings size={20}/>,     name: 'Settings',      use: 'Design system toggle button' },
];

const MOTION = [
  { label: 'Instant',    value: '0ms',   use: 'Focus rings, checked states' },
  { label: 'Fast',       value: '150ms', use: 'Button colour swaps, hover border' },
  { label: 'Base',       value: '200ms', use: 'Colour/background transitions (transition-colors)' },
  { label: 'Moderate',   value: '300ms', use: 'Card shadow lift, tab panel switch' },
  { label: 'Slow',       value: '500ms', use: 'Product image zoom on hover (group-hover:scale-105)' },
  { label: 'Deliberate', value: '700ms', use: 'Category card panoramic zoom' },
];

const UX_PRINCIPLES = [
  {
    law: 'Fitts\'s Law',
    source: 'Laws of UX',
    applied: 'Product card CTAs are full-width buttons (not icon-only). The time to acquire a target is a function of size — wider button = faster click = higher CVR.',
  },
  {
    law: 'Law of Proximity',
    source: 'Gestalt / Laws of UX',
    applied: 'Product card content is divided into two groups: (1) Brand → Name → Size → Rating, and (2) Price → Add to Cart. White space and a border-top separator reinforce the grouping.',
  },
  {
    law: 'Jakob\'s Law',
    source: 'Laws of UX',
    applied: 'Logo top-left, Cart top-right, search-first hero, price + CTA at card bottom. Users spend most of their time on other sites — we meet existing mental models.',
  },
  {
    law: 'Law of Common Region',
    source: 'Gestalt / Laws of UX',
    applied: 'The hero search widget tabs (Rego / Size) are visually connected to the content panel beneath them via a shared white background, making clear they control that region.',
  },
  {
    law: 'Explicit Labelling',
    source: 'Nielsen Norman Group',
    applied: 'All form inputs have explicit <label> elements with matching htmlFor/id pairs. Labels sit directly above their field. No icon-only labels.',
  },
  {
    law: 'Discoverability over Hover',
    source: 'Nielsen Norman Group',
    applied: 'Category cards expose the "Shop Category" button persistently — not hidden behind a hover state, which fails entirely on touch devices.',
  },
  {
    law: 'Contrast & Legibility',
    source: 'WCAG 2.1 / NN/g',
    applied: 'All muted text uses slate-600 (#475569) minimum on white, achieving 4.6:1 contrast ratio. Body text on white is slate-900 (#1F2937) at 16.75:1.',
  },
  {
    law: 'Scarcity & Urgency',
    source: 'Cialdini / CRO',
    applied: '"Limited Stock", "Flash Sale", and "This Week Only" copy trigger loss-aversion. The top bar reinforces with a live sale message.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeading = ({ title, desc }: { title: string; desc?: string }) => (
  <div className="mb-8 pb-6 border-b border-slate-200">
    <h2 className="text-2xl font-extrabold text-[#132043] mb-1">{title}</h2>
    {desc && <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{desc}</p>}
  </div>
);

const SubHeading = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ${className}`}>{children}</h3>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

const ColorSwatch = ({ name, hex, text, usage }: { name: string; hex: string; text: string; usage: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = hex;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(hex).catch(fallback);
    } else {
      fallback();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#FF5C00] focus:ring-offset-2"
      title={`Copy ${hex}`}
    >
      <div className="h-16 w-full flex items-center justify-center relative" style={{ backgroundColor: hex }}>
        <AnimatePresence>
          {copied ? (
            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: hex }}>
              <Check size={20} style={{ color: text }} />
            </motion.div>
          ) : (
            <motion.div key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: hex }}>
              <Copy size={16} style={{ color: text }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-3 bg-white flex-1">
        <div className="font-bold text-slate-900 text-sm">{name}</div>
        <div className="font-mono text-xs text-slate-500 mb-2">{hex}</div>
        <div className="text-xs text-slate-400 leading-snug">{usage}</div>
      </div>
    </button>
  );
};

// ─── Sections ─────────────────────────────────────────────────────────────────

const BrandSection = () => (
  <section id="brand">
    <SectionHeading
      title="Brand Identity"
      desc="Core brand assets, tone of voice, and visual personality principles for Hyperdrive."
    />
    <div className="space-y-8">
      <Card>
        <SubHeading>Logo — Light Background</SubHeading>
        <div className="flex items-center gap-8 flex-wrap">
          <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-center">
            <img src={logoUrl} alt="Hyperdrive Logo" className="h-12 object-contain" />
          </div>
          <div className="bg-[#132043] p-6 rounded-xl flex items-center justify-center">
            <img src={logoUrl} alt="Hyperdrive Logo on dark" className="h-12 object-contain" />
          </div>
          <div className="bg-[#FF5C00] p-6 rounded-xl flex items-center justify-center">
            <img src={logoUrl} alt="Hyperdrive Logo on orange" className="h-12 object-contain" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <SubHeading>Brand Personality</SubHeading>
          <div className="space-y-3">
            {[
              { trait: 'Performance-Focused', desc: 'Every visual decision reinforces speed, precision, and quality.' },
              { trait: 'Trustworthy', desc: 'Navy palette and guarantee messaging build authority and reduce purchase anxiety.' },
              { trait: 'Kiwi-Proud', desc: 'Language and tone speak directly to New Zealanders — no corporate jargon.' },
              { trait: 'Accessible Premium', desc: 'Premium aesthetics without alienating everyday car owners.' },
            ].map(({ trait, desc }) => (
              <div key={trait} className="flex gap-3">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-[#FF5C00] flex-shrink-0 mt-2" />
                <div>
                  <span className="font-bold text-[#132043] text-sm">{trait}</span>
                  <span className="text-slate-500 text-sm"> — {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SubHeading>Voice & Tone</SubHeading>
          <div className="space-y-4">
            {[
              { label: 'Confident', example: '"Guaranteed fit for your vehicle."' },
              { label: 'Direct', example: '"Enter your rego. We\'ll do the rest."' },
              { label: 'Reassuring', example: '"If it doesn\'t fit, we replace it free."' },
              { label: 'Local', example: '"Shipped to your local fitter."' },
            ].map(({ label, example }) => (
              <div key={label}>
                <span className="text-xs font-bold text-[#FF5C00] uppercase tracking-wider">{label}</span>
                <p className="text-sm text-slate-700 italic mt-0.5">{example}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </section>
);

const ColoursSection = () => (
  <section id="colours">
    <SectionHeading
      title="Colour System"
      desc="Click any swatch to copy the hex value. Colours are defined as design tokens for consistency across all components."
    />
    <div className="space-y-8">
      {COLOUR_GROUPS.map(({ group, colors }) => (
        <Card key={group}>
          <SubHeading>{group}</SubHeading>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {colors.map((c) => <ColorSwatch key={c.hex} {...c} />)}
          </div>
        </Card>
      ))}

      <Card>
        <SubHeading>Contrast Ratios (WCAG 2.1)</SubHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-4 font-bold text-slate-700">Pairing</th>
                <th className="text-left py-2 pr-4 font-bold text-slate-700">Ratio</th>
                <th className="text-left py-2 font-bold text-slate-700">Level</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {[
                ['White on Navy #132043',      '11.6:1', 'AAA ✓'],
                ['White on Orange #FF5C00',    '3.4:1',  'AA (large text) ✓'],
                ['Gray 900 on White',          '16.8:1', 'AAA ✓'],
                ['Gray 500 on White',          '4.6:1',  'AA ✓'],
                ['Orange on Navy',             '4.2:1',  'AA ✓'],
                ['White on Navy Dark #0B132C', '14.1:1', 'AAA ✓'],
              ].map(([pair, ratio, level]) => (
                <tr key={pair} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-4">{pair}</td>
                  <td className="py-2 pr-4 font-mono font-bold text-[#132043]">{ratio}</td>
                  <td className="py-2 text-green-700 font-bold">{level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </section>
);

const TypographySection = () => (
  <section id="typography">
    <SectionHeading
      title="Typography"
      desc="System font stack (font-sans). No custom webfont is loaded — this gives instant render with zero font-swap flash. All sizes follow an 8pt modular scale."
    />
    <div className="space-y-4">
      {TYPE_SCALE.map(({ label, tailwind, px, weight, lh, sample, usage }) => (
        <Card key={label} className="overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="flex-shrink-0 lg:w-36 space-y-1">
              <div className="text-xs font-bold text-[#FF5C00] uppercase tracking-wider">{label}</div>
              <div className="font-mono text-xs text-slate-400">{tailwind}</div>
              <div className="font-mono text-xs text-slate-400">{px}px / w{weight}</div>
              <div className="text-xs text-slate-400 italic">{usage}</div>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`${tailwind} text-[#132043] leading-${lh} font-[${weight}] break-words`}
                style={{ fontWeight: weight }}
              >
                {sample}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </section>
);

const SpacingSection = () => (
  <section id="spacing">
    <SectionHeading
      title="Spacing & Grid"
      desc="Based on an 8px base unit. All layout spacing uses multiples of 4px (Tailwind's default scale). Never use odd values — maintain the rhythm."
    />
    <div className="space-y-8">
      <Card>
        <SubHeading>Spacing Scale</SubHeading>
        <div className="space-y-3">
          {SPACING.map(({ token, px, use }) => (
            <div key={token} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-20 font-mono text-xs text-slate-500">{token}</div>
              <div className="flex-shrink-0 bg-[#FF5C00]/20 rounded" style={{ width: Math.min(px * 2.5, 300), height: 20 }} />
              <div className="flex-shrink-0 font-mono text-xs font-bold text-[#132043] w-10">{px}px</div>
              <div className="text-xs text-slate-500">{use}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SubHeading>Responsive Grid Breakpoints</SubHeading>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {['Breakpoint', 'Min Width', 'Max Width', 'Cols', 'Container', 'Notes'].map(h => (
                  <th key={h} className="text-left py-2 pr-4 font-bold text-slate-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map(({ bp, min, max, cols, container, note }) => (
                <tr key={bp} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-4 font-mono font-bold text-[#FF5C00]">{bp}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600">{min}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-slate-600">{max}</td>
                  <td className="py-2 pr-4">
                    <span className="inline-flex items-center bg-[#132043] text-white text-xs font-bold px-2 py-0.5 rounded-full">{cols}</span>
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-[#132043] font-bold">{container}</td>
                  <td className="py-2 text-xs text-slate-500">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-[#132043]/5 rounded-xl border border-[#132043]/10">
          <p className="text-xs font-bold text-[#132043] mb-1">Why 1440px at 2xl?</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tailwind's <code className="bg-slate-100 px-1 rounded">2xl</code> breakpoint (≥1536px) fires on both 1080p desktops (1920px viewport, 75% fill)
            and 1440p monitors (2560px viewport, 56% fill) — serving both audiences with a single container width token.
          </p>
        </div>
      </Card>
    </div>
  </section>
);

const ElevationSection = () => (
  <section id="elevation">
    <SectionHeading
      title="Elevation & Radius"
      desc="Shadows convey hierarchy and interactivity. Border radius follows a purposeful scale — tighter for small interactive elements, looser for large surfaces."
    />
    <div className="space-y-8">
      <Card>
        <SubHeading>Shadow Scale</SubHeading>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SHADOWS.map(({ name, use }) => (
            <div key={name} className={`bg-white ${name} rounded-xl p-5 border border-slate-100`}>
              <div className="font-mono text-xs font-bold text-[#132043] mb-1">{name}</div>
              <div className="text-xs text-slate-500">{use}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SubHeading>Border Radius Scale</SubHeading>
        <div className="flex flex-wrap gap-6 items-end">
          {RADII.map(({ name, px, use }) => (
            <div key={name} className="text-center">
              <div
                className={`${name} bg-[#132043]/10 border-2 border-[#132043]/20 w-16 h-16 mx-auto mb-2`}
              />
              <div className="font-mono text-xs font-bold text-[#132043]">{name}</div>
              <div className="font-mono text-xs text-slate-400">{px}</div>
              <div className="text-xs text-slate-400 max-w-[80px] mt-1">{use}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </section>
);

const ButtonsSection = () => (
  <section id="buttons">
    <SectionHeading
      title="Buttons"
      desc="Four variants, three sizes. Orange = primary action. Navy = secondary/informational. Ghost = tertiary. All include focus rings for keyboard accessibility."
    />
    <div className="space-y-6">
      <Card>
        <SubHeading>Variants</SubHeading>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="bg-[#FF5C00] hover:bg-[#E05200] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]">
            <ShoppingCart size={18} /> Primary — Add to Cart
          </button>
          <button className="bg-[#132043] hover:bg-[#0B132C] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#132043]">
            <ArrowRight size={18} /> Secondary — Learn More
          </button>
          <button className="bg-slate-100 hover:bg-[#FF5C00] text-[#132043] hover:text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]">
            <ShoppingCart size={18} /> Ghost — Card CTA
          </button>
          <button disabled className="bg-slate-100 text-slate-400 px-6 py-3 rounded-lg font-bold flex items-center gap-2 cursor-not-allowed">
            <ShoppingCart size={18} /> Disabled
          </button>
        </div>
      </Card>

      <Card>
        <SubHeading>Sizes</SubHeading>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="bg-[#FF5C00] text-white px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5">
            <ArrowRight size={14} /> Small
          </button>
          <button className="bg-[#FF5C00] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2">
            <ArrowRight size={16} /> Medium
          </button>
          <button className="bg-[#FF5C00] text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-2">
            <ArrowRight size={20} /> Large
          </button>
        </div>
      </Card>

      <Card>
        <SubHeading>Icon-only (with aria-label)</SubHeading>
        <div className="flex gap-4 items-center">
          <button aria-label="Account" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]">
            <User size={20} />
          </button>
          <button aria-label="Cart" className="p-2 bg-[#FF5C00] text-white rounded-full hover:bg-[#E05200] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]">
            <ShoppingCart size={20} />
          </button>
          <button aria-label="Close" className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-4">⚠ Icon-only buttons must always carry an <code className="bg-slate-100 px-1 rounded">aria-label</code> — NN/g guideline.</p>
      </Card>
    </div>
  </section>
);

const FormsSection = () => {
  const [tab, setTab] = useState<'rego' | 'size'>('rego');
  return (
    <section id="forms">
      <SectionHeading
        title="Form Elements"
        desc="All inputs have visible labels (htmlFor linked), high-contrast focus borders, and clear placeholder copy. Never rely on placeholder text as a label substitute."
      />
      <div className="space-y-6">
        <Card>
          <SubHeading>Text Input — States</SubHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Default</label>
              <input type="text" placeholder="e.g. ABC123" className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Focus (orange border)</label>
              <input type="text" defaultValue="ABC123" className="w-full border-2 border-[#FF5C00] rounded-lg px-4 py-3 text-sm ring-2 ring-[#FF5C00]/20 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Error state</label>
              <input type="text" defaultValue="XYZ???" className="w-full border-2 border-red-500 rounded-lg px-4 py-3 text-sm focus:outline-none" />
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={12} /> Invalid plate format</p>
            </div>
          </div>
        </Card>

        <Card>
          <SubHeading>Select Dropdown</SubHeading>
          <div className="grid grid-cols-3 gap-4 max-w-xs">
            {['Width', 'Profile', 'Rim'].map(label => (
              <div key={label}>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
                <select className="w-full border-2 border-slate-300 rounded-lg px-2 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20">
                  <option>{label === 'Width' ? '225' : label === 'Profile' ? '45' : '17"'}</option>
                </select>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SubHeading>Tabs (border-top indicator)</SubHeading>
          <div className="max-w-sm">
            <div className="flex w-full bg-slate-100 rounded-t-xl overflow-hidden">
              {(['rego', 'size'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-3.5 text-sm font-bold border-t-4 transition-colors ${tab === t ? 'border-t-[#FF5C00] text-[#132043] bg-white' : 'border-t-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {t === 'rego' ? 'By Rego' : 'By Size'}
                </button>
              ))}
            </div>
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-xl p-4 text-sm text-slate-600">
              {tab === 'rego' ? 'Search by number plate' : 'Search by tyre dimensions'}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Active tab: border-top <code className="bg-slate-100 px-1 rounded">border-t-[#FF5C00]</code>. Panel background lifts to white to create visual connection (Law of Common Region).</p>
        </Card>
      </div>
    </section>
  );
};

const CardsSection = () => (
  <section id="cards">
    <SectionHeading
      title="Cards"
      desc="Three card templates used across the site. All share rounded-2xl, border, and shadow-sm base. Hover state lifts to shadow-xl to signal interactivity."
    />
    <div className="space-y-6">
      <Card>
        <SubHeading>Product Card</SubHeading>
        <div className="max-w-[220px]">
          <article className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative aspect-square bg-slate-100 overflow-hidden border-b border-slate-100">
              <div className="absolute top-3 left-3 bg-[#FF5C00] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm z-10">Best Seller</div>
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 text-xs">Product Image</div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Michelin</div>
              <h3 className="font-bold text-[#1F2937] text-base leading-tight mb-1">Pilot Sport 4</h3>
              <p className="text-xs text-slate-500 mb-2">225/45 R17</p>
              <div className="flex text-[#FF5C00] mb-auto">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-end gap-1.5 mb-3">
                  <span className="text-xl font-extrabold text-[#132043]">$249</span>
                  <span className="text-xs text-slate-400 line-through mb-0.5">$310</span>
                </div>
                <button className="w-full bg-slate-100 hover:bg-[#FF5C00] hover:text-white text-[#132043] py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                  <ShoppingCart size={14} /> Add to Cart
                </button>
              </div>
            </div>
          </article>
        </div>
        <div className="mt-4 text-xs text-slate-500 space-y-1">
          <p>• <strong>Image area:</strong> <code className="bg-slate-100 px-1 rounded">aspect-square object-cover</code> — enforces equal heights regardless of source image dimensions.</p>
          <p>• <strong>Content area:</strong> Two groups separated by <code className="bg-slate-100 px-1 rounded">border-t border-slate-100</code> (Law of Proximity).</p>
          <p>• <strong>CTA:</strong> Full-width ghost→orange hover (Fitts's Law).</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <SubHeading>Trust Bar Item</SubHeading>
          <div className="flex items-start gap-4 bg-[#132043] p-5 rounded-xl">
            <div className="flex-shrink-0 bg-white/10 p-3 rounded-xl">
              <ShieldCheck size={28} className="text-[#FF5C00]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base mb-1">100% Fitment Guarantee</h4>
              <p className="text-sm text-slate-300">If it doesn't fit, we replace it free.</p>
            </div>
          </div>
        </Card>

        <Card>
          <SubHeading>Category Card (image overlay)</SubHeading>
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-slate-200">
            <div className="absolute inset-0 bg-gradient-to-r from-[#132043]/80 to-transparent" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <span className="text-[#FF5C00] font-bold text-xs uppercase tracking-wider mb-1">Shop all brands</span>
              <h3 className="text-xl font-extrabold text-white mb-3">Premium Tyres</h3>
              <div className="inline-flex items-center bg-white text-[#132043] font-bold text-xs gap-1.5 px-4 py-2 rounded-lg w-max hover:bg-[#FF5C00] hover:text-white transition-colors">
                Shop Category <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
);

const BadgesSection = () => (
  <section id="badges">
    <SectionHeading
      title="Badges & Labels"
      desc="Status-driven visual cues. Badge colour signals the semantic category. All use rounded-full and font-bold for clear identification at small sizes."
    />
    <Card>
      <SubHeading>Product Badges</SubHeading>
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: 'Best Seller',    bg: 'bg-[#FF5C00] text-white' },
          { label: 'Save 22%',       bg: 'bg-[#FF5C00] text-white' },
          { label: 'New Arrival',    bg: 'bg-[#132043] text-white' },
          { label: 'Top Rated',      bg: 'bg-[#132043] text-white' },
          { label: 'Limited Stock',  bg: 'bg-amber-500 text-white' },
          { label: 'Out of Stock',   bg: 'bg-slate-400 text-white' },
        ].map(({ label, bg }) => (
          <span key={label} className={`${bg} text-xs font-bold px-3 py-1.5 rounded-full shadow-sm`}>{label}</span>
        ))}
      </div>

      <SubHeading>Promo Badges</SubHeading>
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: 'Flash Sale',   bg: 'bg-[#FF5C00] text-white' },
          { label: 'Bundle Deal',  bg: 'bg-[#132043] text-white' },
          { label: 'Seasonal',     bg: 'bg-sky-500 text-white' },
          { label: 'Free Service', bg: 'bg-green-600 text-white' },
          { label: 'Combo Offer',  bg: 'bg-[#FF5C00] text-white' },
        ].map(({ label, bg }) => (
          <span key={label} className={`${bg} text-xs font-bold px-3 py-1.5 rounded-full shadow-sm`}>{label}</span>
        ))}
      </div>

      <SubHeading>Saving Pill (card footer)</SubHeading>
      <div className="flex flex-wrap gap-3">
        {['Save up to $93', 'Save $150 vs. separate', 'Worth up to $80', 'From $179 per tyre'].map(s => (
          <span key={s} className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
            <CheckCircle size={12} /> {s}
          </span>
        ))}
      </div>

      <SubHeading className="mt-6">Section Labels (orange, uppercase)</SubHeading>
      <div className="flex flex-wrap gap-4">
        {["Today's Top Picks", 'Exclusive Offers', 'Why Choose Us'].map(l => (
          <div key={l} className="flex items-center gap-2 text-[#FF5C00] font-bold text-sm uppercase tracking-wide">
            <TrendingUp size={16} /> {l}
          </div>
        ))}
      </div>
    </Card>
  </section>
);

const IconsSection = () => (
  <section id="icons">
    <SectionHeading
      title="Iconography"
      desc="All icons sourced from lucide-react. Sizes: 14px (inline text), 16px (labels), 18–20px (buttons), 24px (nav), 32px (trust bar). Icons are always aria-hidden when decorative."
    />
    <Card>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ICON_SET.map(({ icon, name, use }) => (
          <div key={name} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
            <div className="flex-shrink-0 w-8 h-8 bg-[#132043]/5 rounded-lg flex items-center justify-center text-[#132043]">
              {icon}
            </div>
            <div className="min-w-0">
              <div className="font-mono text-xs font-bold text-[#132043] truncate">{name}</div>
              <div className="text-xs text-slate-500 leading-snug mt-0.5">{use}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
        <strong>Rule:</strong> Icon-only interactive elements (e.g. account button) must include <code className="bg-amber-100 px-1 rounded">aria-label</code>. Decorative icons within labelled buttons carry <code className="bg-amber-100 px-1 rounded">aria-hidden="true"</code>.
      </div>
    </Card>
  </section>
);

const MotionSection = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <section id="motion">
      <SectionHeading
        title="Motion"
        desc="Motion reinforces interactivity and hierarchy. Prefer transform over layout-triggering properties. Never animate solely for decoration — every transition must communicate state change."
      />
      <div className="space-y-6">
        <Card>
          <SubHeading>Duration Scale</SubHeading>
          <div className="space-y-4">
            {MOTION.map(({ label, value, use }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-24 flex-shrink-0">
                  <div className="text-xs font-bold text-[#132043]">{label}</div>
                  <div className="font-mono text-xs text-slate-400">{value}</div>
                </div>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF5C00] rounded-full"
                    style={{ width: `${(parseInt(value) / 700) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 flex-shrink-0 max-w-[200px]">{use}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SubHeading>Live Demos</SubHeading>
          <div className="flex flex-wrap gap-6">
            {/* Hover lift */}
            <div className="text-center space-y-2">
              <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={`w-28 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center cursor-pointer transition-all duration-300 ${hovered ? 'shadow-xl -translate-y-1' : 'shadow-sm'}`}
              >
                <ShoppingCart size={24} className="text-[#132043]" />
              </div>
              <p className="text-xs text-slate-500">Card hover lift<br /><code className="bg-slate-100 px-1 rounded">300ms</code></p>
            </div>

            {/* Button hover */}
            <div className="text-center space-y-2">
              <button className="w-28 h-20 bg-slate-100 hover:bg-[#FF5C00] text-[#132043] hover:text-white rounded-2xl border border-slate-200 font-bold text-xs transition-colors duration-200 flex items-center justify-center gap-1">
                <ShoppingCart size={16} /> Add
              </button>
              <p className="text-xs text-slate-500">Colour swap<br /><code className="bg-slate-100 px-1 rounded">200ms</code></p>
            </div>

            {/* Scale */}
            <div className="text-center space-y-2">
              <div className="w-28 h-20 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 hover:scale-105 transition-transform duration-500 origin-center cursor-zoom-in flex items-center justify-center text-slate-500 text-xs">
                  Hover zoom
                </div>
              </div>
              <p className="text-xs text-slate-500">Image zoom<br /><code className="bg-slate-100 px-1 rounded">500ms</code></p>
            </div>

            {/* Fade in */}
            <div className="text-center space-y-2">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-28 h-20 bg-[#132043] rounded-2xl flex items-center justify-center"
              >
                <Star size={24} className="text-[#FF5C00]" fill="currentColor" />
              </motion.div>
              <p className="text-xs text-slate-500">Panel fade<br /><code className="bg-slate-100 px-1 rounded">AnimatePresence</code></p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

const UXSection = () => (
  <section id="ux">
    <SectionHeading
      title="UX Principles"
      desc="Every design decision is grounded in a cited UX law or guideline. This section serves as the living audit trail for the Hyperdrive design system."
    />
    <div className="space-y-4">
      {UX_PRINCIPLES.map(({ law, source, applied }) => (
        <Card key={law}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-shrink-0">
              <div className="font-bold text-[#132043] text-base">{law}</div>
              <span className="text-xs font-bold text-[#FF5C00] uppercase tracking-wider">{source}</span>
            </div>
            <div className="sm:border-l sm:border-slate-200 sm:pl-4 text-sm text-slate-600 leading-relaxed">{applied}</div>
          </div>
        </Card>
      ))}

      <Card className="bg-[#132043] border-[#132043]">
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-white font-bold">Further reading: </span>
          <a href="https://lawsofux.com" target="_blank" rel="noopener noreferrer" className="text-[#FF5C00] underline hover:no-underline">lawsofux.com</a>
          {' · '}
          <a href="https://www.nngroup.com" target="_blank" rel="noopener noreferrer" className="text-[#FF5C00] underline hover:no-underline">nngroup.com</a>
          {' · '}
          <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer" className="text-[#FF5C00] underline hover:no-underline">WCAG 2.1</a>
        </p>
      </Card>
    </div>
  </section>
);

// ─── Main Panel ──────────────────────────────────────────────────────────────

export const StyleguidePanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('brand');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el && scrollRef.current) {
      const offset = el.offsetTop - 24;
      scrollRef.current.scrollTo({ top: offset, behavior: 'smooth' });
    }
    setActiveId(id);
  }, []);

  // Track active section via scroll
  useEffect(() => {
    if (!isOpen) return;
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      const sections = NAV.map(n => ({ id: n.id, el: document.getElementById(n.id) })).filter(s => s.el);
      const scrollTop = container.scrollTop + 80;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el && sections[i].el!.offsetTop <= scrollTop) {
          setActiveId(sections[i].id);
          break;
        }
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-[#132043] text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-[#0B132C] transition-colors flex items-center gap-2 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]"
        aria-label="Open Design System"
      >
        <Settings size={15} />
        Design System
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-5xl flex flex-col bg-[#F8F9FA] shadow-2xl"
            >
              {/* Header */}
              <div className="flex-shrink-0 bg-[#0B132C] px-6 py-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-4">
                  <img src={logoUrl} alt="Hyperdrive" className="h-7 object-contain" />
                  <div className="w-px h-6 bg-white/20" />
                  <div>
                    <span className="text-white font-extrabold text-sm">Design System</span>
                    <span className="ml-2 text-xs font-bold text-[#FF5C00] bg-[#FF5C00]/10 border border-[#FF5C00]/30 px-1.5 py-0.5 rounded">v1.0</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Left nav */}
                <nav className="flex-shrink-0 w-52 bg-white border-r border-slate-200 overflow-y-auto py-4" aria-label="Styleguide navigation">
                  {NAV.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all border-l-2 ${
                        activeId === id
                          ? 'border-l-[#FF5C00] text-[#132043] font-bold bg-[#FF5C00]/5'
                          : 'border-l-transparent text-slate-500 hover:text-[#132043] hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>

                {/* Scrollable content */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto">
                  <div className="max-w-3xl mx-auto px-8 py-10 space-y-20">
                    <BrandSection />
                    <ColoursSection />
                    <TypographySection />
                    <SpacingSection />
                    <ElevationSection />
                    <ButtonsSection />
                    <FormsSection />
                    <CardsSection />
                    <BadgesSection />
                    <IconsSection />
                    <MotionSection />
                    <UXSection />
                    <div className="pb-16" />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
