import { useState, useEffect, type FormEvent } from 'react'
import './landing.css'

/* ─── Data & Constants ─── */
const navLinks = [
  { label: 'COMPANY', href: '#company' },
  { label: 'NEWSROOM', href: '#newsroom' },
]

const clientLogos = [
  { name: 'Meta', file: '/client-logo/meta.svg', height: 26 },
  { name: 'Amazon', file: '/client-logo/amazon.svg', height: 32 },
  { name: 'Perplexity', file: '/client-logo/perplexity.svg', height: 26 },
  { name: 'SentinelOne', file: '/client-logo/sentinelone.svg', height: 26 },
  { name: 'Kaspersky', file: '/client-logo/kaspersky.svg', height: 25 },
  { name: 'IHG Hotels & Resorts', file: '/client-logo/ihg.svg', height: 26 },
  { name: 'Eni', file: '/client-logo/eni.svg', height: 32 },
  { name: 'Ledger Vault', file: '/client-logo/ledger-vault.svg', height: 25 },
  { name: 'Everpure', file: '/client-logo/everpure.svg', height: 24 },
  { name: 'Kleinanzeigen', file: '/client-logo/kleinanzeigen.svg', height: 25 },
  { name: 'VK', file: '/client-logo/vk.svg', height: 26 },
]

type IntegrationCategory = 'crm' | 'support' | 'inbox' | 'automation'

const integrationFilters: { id: 'all' | IntegrationCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'crm', label: 'CRM' },
  { id: 'support', label: 'Support' },
  { id: 'inbox', label: 'Mail & Chat' },
  { id: 'automation', label: 'Automation' },
]

const integrationsList: {
  name: string
  category: IntegrationCategory
  blurb: string
  sync: string
  mark: string
  bg: string
  fg: string
  logo?: string
}[] = [
  { name: 'Zapier', category: 'automation', mark: 'Zp', bg: '#FF4A00', fg: '#FFFFFF', blurb: 'Fire any downstream workflow the moment a conversation resolves.', sync: 'Triggers, payloads, retries', logo: '/zapier.png' },
  { name: 'WhatsApp', category: 'inbox', mark: 'Wa', bg: '#128C7E', fg: '#FFFFFF', blurb: 'Keep Business API threads on the same agent that handles the phone.', sync: 'Threads, templates, media', logo: '/whatsapp.png' },
  { name: 'Slack', category: 'automation', mark: 'Sl', bg: '#4A154B', fg: '#FFFFFF', blurb: 'Post the handoff into the channel that owns the account, with the transcript.', sync: 'Channels, threads, mentions', logo: '/slack.png' },
  { name: 'Mail (Gmail)', category: 'inbox', mark: 'Gm', bg: '#EA4335', fg: '#FFFFFF', blurb: 'Read the thread, draft the reply, and send it in your brand voice.', sync: 'Threads, drafts, labels', logo: '/mail.png' },
  { name: 'Salesforce', category: 'crm', mark: 'Sf', bg: '#00A1E0', fg: '#FFFFFF', blurb: 'Write the call, the contact, and the case back while it is still live.', sync: 'Contacts, cases, activities', logo: '/salesforce.png' },
  { name: 'Zendesk', category: 'support', mark: 'Zd', bg: '#03363D', fg: '#FFFFFF', blurb: 'Open, update, and close the ticket without a second screen.', sync: 'Tickets, macros, CSAT', logo: '/zendesk.png' },
]

const faqItems = [
  {
    q: 'How do Synthio\'s AI agents handle complex customer conversations?',
    a: 'Synthio agents use advanced natural language understanding to follow multi-turn conversations, detect intent shifts, and escalate to human agents when needed. They maintain full context across channels — so a customer who starts on chat and moves to a call never has to repeat themselves.',
  },
  {
    q: 'Can I customize the AI agent\'s voice and personality?',
    a: 'Yes. You can choose from 30+ natural-sounding voices, adjust speaking pace and tone, and define brand-specific guidelines. The agent adapts its personality to match your brand — professional, friendly, or anywhere in between.',
  },
  {
    q: 'How long does it take to deploy our first AI agent?',
    a: 'Most teams deploy a production-ready agent in under 30 minutes. Import your knowledge base, connect your phone number or email, set routing rules, and you\'re live. No code required for basic setups.',
  },
  {
    q: 'What happens if the AI agent can\'t resolve a customer issue?',
    a: 'Synthio automatically detects when a conversation requires human intervention — based on sentiment, complexity, or custom rules you set. It seamlessly hands off to your team with full conversation context, so agents can pick up exactly where the AI left off.',
  },
  {
    q: 'Is my customer data secure with Synthio?',
    a: 'Absolutely. All conversations are encrypted end-to-end with AES-256. We\'re SOC 2 Type II certified, GDPR compliant, and HIPAA eligible. Customer data is never used to train models, and you retain full ownership and control.',
  },
]

/* ─── IntegratedBio Style Overlapping Loop Brand Mark ─── */
function BrandLogo() {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="brand-loop-mark" aria-hidden="true">
      <rect x="1.5" y="2.5" width="18" height="10.5" rx="5.25" stroke="currentColor" strokeWidth="1.6" />
      <rect x="8.5" y="7" width="18" height="10.5" rx="5.25" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

/* ─── Coda-Style End-to-End Navbar ─── */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>('products')
  const [navTheme, setNavTheme] = useState<'blue' | 'white'>('blue')

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.querySelector('.hero-section')
      const footerEl = document.querySelector('.dark-footer')

      if (heroEl) {
        const heroBottom = heroEl.getBoundingClientRect().bottom
        const footerTop = footerEl ? footerEl.getBoundingClientRect().top : Infinity

        // When scrolled past the hero section (heroBottom <= 70) and above the footer: WHITE
        // While inside the hero fold or at the footer: BLUE
        if (heroBottom <= 70 && footerTop > 70) {
          setNavTheme('white')
        } else {
          setNavTheme('blue')
        }
      } else {
        setNavTheme(window.scrollY > 600 ? 'white' : 'blue')
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <header className={`coda-nav-wrap ${navTheme === 'white' ? 'is-white-nav' : 'is-blue-nav'}`}>
      <div className="coda-nav-bar">
        {/* Left: Brand Logo (Synthio) */}
        <div className="coda-nav-left">
          <a className="coda-brand-logo" href="#top" aria-label="Synthio home">
            <img
              src={navTheme === 'white' ? '/logos/logo-on-white.png' : '/logos/logo-on-blue.png'}
              alt="Synthio"
              className="coda-brand-img"
            />
          </a>
        </div>

        {/* Center: Nav Links with Dropdown Indicators */}
        <nav className={`coda-nav-center ${mobileOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {/* Products */}
          <div className="coda-nav-item">
            <button
              type="button"
              className={`coda-nav-link ${activeMenu === 'products' ? 'has-pill' : ''}`}
              onClick={() => setActiveMenu(activeMenu === 'products' ? null : 'products')}
            >
              <span>Products</span>
              <svg className="coda-chevron" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Solutions */}
          <div className="coda-nav-item">
            <button
              type="button"
              className={`coda-nav-link ${activeMenu === 'solutions' ? 'has-pill' : ''}`}
              onClick={() => setActiveMenu(activeMenu === 'solutions' ? null : 'solutions')}
            >
              <span>Solutions</span>
              <svg className="coda-chevron" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Resources */}
          <div className="coda-nav-item">
            <button
              type="button"
              className={`coda-nav-link ${activeMenu === 'resources' ? 'has-pill' : ''}`}
              onClick={() => setActiveMenu(activeMenu === 'resources' ? null : 'resources')}
            >
              <span>Resources</span>
              <svg className="coda-chevron" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Company */}
          <div className="coda-nav-item">
            <button
              type="button"
              className={`coda-nav-link ${activeMenu === 'company' ? 'has-pill' : ''}`}
              onClick={() => setActiveMenu(activeMenu === 'company' ? null : 'company')}
            >
              <span>Company</span>
              <svg className="coda-chevron" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="coda-nav-item">
            <a className="coda-nav-link" href="#pricing" onClick={() => setMobileOpen(false)}>
              Pricing
            </a>
          </div>
        </nav>

        {/* Right: Language, Login, Get Started */}
        <div className="coda-nav-right">
          <button type="button" className="coda-lang-btn" aria-label="Change language">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span>EN</span>
          </button>

          <a className="coda-login-link" href="#login">
            Login
          </a>

          <a className="coda-get-started-btn" href="#pricing">
            Get started
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="coda-mobile-burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

/* ─── Hero Section: Dashboard SVG Icons ─── */
function DashIcon({ name, className = '', size = 15 }: { name: string; className?: string; size?: number }) {
  switch (name) {
    case 'inbox':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      )
    case 'teams':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'integrations':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="4" r="2" />
          <circle cx="12" cy="20" r="2" />
          <circle cx="4" cy="12" r="2" />
          <circle cx="20" cy="12" r="2" />
        </svg>
      )
    case 'knowledge':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    case 'ai-center':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      )
    case 'automations':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      )
    case 'settings':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    case 'clock':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    case 'alarm':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2 2" />
          <path d="M5 3L2 6" />
          <path d="M22 6l-3-3" />
        </svg>
      )
    case 'alert-triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 'check':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'mail':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    case 'chat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      )
    case 'phone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      )
    case 'slack':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <line x1="10" y1="3" x2="8" y2="21" />
          <line x1="16" y1="3" x2="14" y2="21" />
        </svg>
      )
    case 'stripe':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    case 'search':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    case 'bell':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h24s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
    case 'smiley':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      )
    case 'plus':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )
    case 'arrow-up':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      )
    case 'download':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )
    case 'workspace':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    case 'external-link':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      )
    case 'chevron-down':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )
    default:
      return null
  }
}

/* ─── Hero Section: AI Customer Operations Dashboard ─── */
interface DashboardThread {
  id: string
  name: string
  avatarText: string
  avatarBg: string
  time: string
  tag: string
  tagType: 'ai' | 'draft' | 'escalated'
  preview: string
  email: string
  plan: string
  ltv: string
  joined: string
  priority: 'High' | 'Normal' | 'Urgent'
  segment: string
  language: string
  lastPayment: { amount: string; date: string }
  aiSummary: string
  status: string
  messages: Array<{
    id: string
    sender: 'customer' | 'agent'
    author: string
    time: string
    text?: string
    isActionCard?: boolean
    actionCard?: {
      title: string
      sub: string
      amount?: string
      refId: string
      status: string
    }
  }>
}

const DASHBOARD_THREADS: DashboardThread[] = [
  {
    id: 'sarah',
    name: 'Sarah Mitchell',
    avatarText: 'SM',
    avatarBg: '#E0E7FF',
    time: '2m ago',
    tag: 'AI gen.',
    tagType: 'ai',
    preview: 'I was charged twice for my monthly subscription...',
    email: 'sarah.mitchell@gmail.com',
    plan: 'Premium ($29/mo)',
    ltv: '$1,450',
    joined: 'Mar 2021',
    priority: 'High',
    segment: 'North America',
    language: 'English',
    lastPayment: { amount: '$29', date: 'Sep 8, 2025' },
    aiSummary: 'Double charge detected on today payment. Refund already initiated via Stripe API. Customer is frustrated but polite.',
    status: 'Resolved',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        author: 'Sarah Mitchell',
        time: '22m ago',
        text: 'Hi, I just noticed I was charged twice for my monthly subscription this morning. Can you fix this?',
      },
      {
        id: 'm2',
        sender: 'agent',
        author: 'John Ab. (Synthio AI)',
        time: '22m ago',
        text: 'Hi Sarah, thanks for reaching out. I see two charges on your account for today. One of them was already reversed automatically. You should see the refund in 3–5 business days. Could you confirm if you’d like me to also send you a receipt of the refund?',
      },
      {
        id: 'm3',
        sender: 'customer',
        author: 'Sarah Mitchell',
        time: '22m ago',
        text: 'Thanks for clarifying! Yes, please send me the receipt for the refund.',
      },
      {
        id: 'm4',
        sender: 'agent',
        author: 'John Ab. (Synthio AI)',
        time: '22m ago',
        isActionCard: true,
        actionCard: {
          title: 'Refund Processed',
          sub: 'Invoice #INV-2025-09 · Card ending 4242',
          amount: '$29.00',
          refId: '#RF-23891',
          status: 'Emailed to customer',
        },
      },
    ],
  },
  {
    id: 'marcus',
    name: 'Marcus Vance',
    avatarText: 'MV',
    avatarBg: '#FEF3C7',
    time: '8m ago',
    tag: 'AI drafted',
    tagType: 'draft',
    preview: 'Can you move our onboarding call to Friday at 3 PM?',
    email: 'marcus@vance.io',
    plan: 'Enterprise ($499/mo)',
    ltv: '$8,500',
    joined: 'Jan 2023',
    priority: 'Urgent',
    segment: 'Enterprise US',
    language: 'English',
    lastPayment: { amount: '$499', date: 'Sep 1, 2025' },
    aiSummary: 'Inbound phone request to reschedule product onboarding. Calendar queried and updated autonomously in 38s.',
    status: 'Confirmed',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        author: 'Marcus Vance',
        time: '12m ago',
        text: 'Hey team, something came up and I need to move our onboarding call to this Friday at 3:00 PM EST instead.',
      },
      {
        id: 'm2',
        sender: 'agent',
        author: 'Synthio Voice Agent',
        time: '12m ago',
        text: 'Hi Marcus, I’ve checked your Account Lead’s Google Calendar and locked in Friday at 3:00 PM EST. The updated invite and Zoom details have been dispatched to your email.',
      },
      {
        id: 'm3',
        sender: 'agent',
        author: 'Synthio Voice Agent',
        time: '12m ago',
        isActionCard: true,
        actionCard: {
          title: 'Calendar Slot Confirmed',
          sub: 'Friday, Sep 12, 2025 · 3:00 PM EST',
          amount: '45 mins',
          refId: '#CAL-98214',
          status: 'Google Calendar & Zoom synced',
        },
      },
    ],
  },
  {
    id: 'elena',
    name: 'Elena Rostova',
    avatarText: 'ER',
    avatarBg: '#DCFCE7',
    time: '25m ago',
    tag: 'Escalated',
    tagType: 'escalated',
    preview: 'URGENT: Production Okta SSO certificate renewed...',
    email: 'elena@enterprise-cloud.net',
    plan: 'Enterprise Plus ($999/mo)',
    ltv: '$18,200',
    joined: 'Aug 2022',
    priority: 'Urgent',
    segment: 'Global Security',
    language: 'English',
    lastPayment: { amount: '$999', date: 'Aug 28, 2025' },
    aiSummary: 'Urgent IdP SAML certificate rotation inquiry. Security AI agent validated Okta metadata thumbprint and generated tenant guide.',
    status: 'In Progress',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        author: 'Elena Rostova',
        time: '30m ago',
        text: 'URGENT: Our production Okta SAML SSO broke after renewing our signing certificate. Users cannot log in.',
      },
      {
        id: 'm2',
        sender: 'agent',
        author: 'Synthio Email Agent',
        time: '28m ago',
        text: 'Hi Elena, our security agent detected the SHA-1 fingerprint expiration in your tenant SAML configuration. I have verified your new certificate fingerprint and generated your tenant deep-link rotation guide below.',
      },
      {
        id: 'm3',
        sender: 'agent',
        author: 'Synthio Email Agent',
        time: '28m ago',
        isActionCard: true,
        actionCard: {
          title: 'SAML Cert Rotation Verified',
          sub: 'Tenant: enterprise-cloud-77 · 15m SLA met',
          amount: 'SLA: 28s',
          refId: '#SSO-8912',
          status: 'Tier-3 engineer on standby',
        },
      },
    ],
  },
]

function Hero() {
  const [selectedThreadId, setSelectedThreadId] = useState('sarah')
  const [activeProfileTab, setActiveProfileTab] = useState<'details' | 'tickets'>('details')
  const [replyInput, setReplyInput] = useState('')
  const [extraMessages, setExtraMessages] = useState<Record<string, Array<{ text: string; time: string }>>>({})
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  const currentThread = DASHBOARD_THREADS.find((t) => t.id === selectedThreadId) || DASHBOARD_THREADS[0]
  const threadExtras = extraMessages[currentThread.id] || []

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e
    const rect = currentTarget.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width - 0.5
    const y = (clientY - rect.top) / rect.height - 0.5
    setMouseOffset({ x, y })
  }

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 })
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyInput.trim()) return

    setExtraMessages((prev) => ({
      ...prev,
      [currentThread.id]: [...(prev[currentThread.id] || []), { text: replyInput, time: 'Just now' }],
    }))
    setReplyInput('')
  }

  return (
    <>
      <section
        className="hero-section"
        id="top"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Hill (bottom.png) - Layer 1: Behind Dashboard */}
        <div className="hero-hills-back-wrap" aria-hidden="true">
          <img
            src="/bottom.png"
            alt=""
            className="hero-hill-img hero-hill-back"
            style={{
              transform: `translateX(calc(-50% + ${mouseOffset.x * 12}px)) translateY(${mouseOffset.y * 6}px)`,
            }}
          />
        </div>

        <div className="hero-container">
          {/* Heading */}
          <h1 className="hero-title">
            <span className="hero-title-main">Smarter AI agents.</span>
            <span className="hero-title-italic">Better conversations.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Build intelligent AI agents that handle customer calls, manage emails, and automate conversations — all from one platform.
          </p>

          {/* CTA Buttons: Dual Black Pill & White Pill */}
          <div className="hero-cta-row">
            <a className="hero-btn-dark-pill" href="#pricing">
              <span>Get Started</span>
            </a>
            <a className="hero-btn-light-pill" href="#features">
              <span>Book a Demo</span>
            </a>
          </div>

          {/* Sub-bullets / Footnote */}
          <div className="hero-trust-bullets">
            <span>Voice AI</span>
            <span className="bullet-sep" aria-hidden="true">&middot;</span>
            <span>Email Automation</span>
            <span className="bullet-sep" aria-hidden="true">&middot;</span>
            <span>24/7 Availability</span>
            <span className="bullet-sep" aria-hidden="true">&middot;</span>
            <span>Bi-Directional CRM Sync</span>
          </div>

          {/* Rating proof */}
          <div className="hero-rating-proof">
            <span className="rating-stars">★★★★★</span>
            <span className="rating-copy">Rated 4.9/5 by 1,400+ customer operations, support, and sales teams</span>
          </div>

          {/* Authentic Customer Operations AI Dashboard - Layer 2: Middle */}
          <div className="hero-window-wrapper hero-dash-wrapper">
            <div className="hero-window hero-dash-window">
              {/* Dashboard Top Navigation Bar */}
              <div className="dash-top-nav">
                <div className="dash-top-left">
                  <div className="dash-workspace-selector">
                    <span className="dash-workspace-icon"><DashIcon name="workspace" size={15} /></span>
                    <span className="dash-workspace-name">Synthio Workspace</span>
                    <span className="dash-dropdown-chevron"><DashIcon name="chevron-down" size={9} /></span>
                  </div>
                </div>

                <div className="dash-top-center">
                  <div className="dash-search-box">
                    <span className="dash-search-icon"><DashIcon name="search" size={13} /></span>
                    <input
                      type="text"
                      readOnly
                      value="Search customer, email, ticket, or phone number..."
                      className="dash-search-input"
                    />
                  </div>
                </div>

                <div className="dash-top-right">
                  <button type="button" className="dash-icon-btn" aria-label="Notifications">
                    <span className="dash-bell-icon"><DashIcon name="bell" size={15} /></span>
                    <span className="dash-bell-badge" />
                  </button>
                  <div className="dash-user-badge">
                    <span className="dash-user-avatar">J</span>
                    <span className="dash-user-name">John Ab.</span>
                    <span className="dash-user-chevron"><DashIcon name="chevron-down" size={9} /></span>
                  </div>
                  <button type="button" className="dash-more-btn">⋮</button>
                </div>
              </div>

              {/* Dashboard 4-Column Main Stage */}
              <div className="dash-stage-grid">
                {/* Column 1: Slim Left App Sidebar */}
                <aside className="dash-col-nav">
                  <div className="dash-nav-active-pill">
                    <span className="nav-pill-icon"><DashIcon name="inbox" size={15} /></span>
                    <span className="nav-pill-label">Inbox</span>
                  </div>

                  <div className="dash-nav-section-title">MANAGE</div>
                  <div className="dash-nav-item">
                    <span className="nav-item-icon"><DashIcon name="teams" size={15} /></span>
                    <span>Teams</span>
                  </div>
                  <div className="dash-nav-item">
                    <span className="nav-item-icon"><DashIcon name="integrations" size={15} /></span>
                    <span>Integrations</span>
                  </div>
                  <div className="dash-nav-item">
                    <span className="nav-item-icon"><DashIcon name="knowledge" size={15} /></span>
                    <span>Knowledge</span>
                  </div>
                  <div className="dash-nav-item">
                    <span className="nav-item-icon"><DashIcon name="ai-center" size={15} /></span>
                    <span>AI Center</span>
                  </div>
                  <div className="dash-nav-item">
                    <span className="nav-item-icon"><DashIcon name="automations" size={15} /></span>
                    <span>Automations</span>
                  </div>
                  <div className="dash-nav-item">
                    <span className="nav-item-icon"><DashIcon name="settings" size={15} /></span>
                    <span>Settings</span>
                  </div>

                  {/* Promo / Upgrade Card */}
                  <div className="dash-sidebar-promo">
                    <div className="promo-title">Get 40% discount</div>
                    <div className="promo-desc">Upgrade your free trial today!</div>
                    <button type="button" className="promo-btn">Upgrade</button>
                  </div>
                </aside>

                {/* Column 2: Inbox & Channel List */}
                <div className="dash-col-inbox">
                  <div className="inbox-header-row">
                    <span className="inbox-title">Inbox</span>
                    <button type="button" className="inbox-add-btn" title="New conversation">
                      <DashIcon name="plus" size={11} />
                    </button>
                  </div>

                  {/* Status Filters */}
                  <div className="inbox-filter-list">
                    <div className="inbox-filter-item is-active">
                      <span className="filter-icon"><DashIcon name="inbox" size={13} /></span>
                      <span className="filter-name">Open</span>
                    </div>
                    <div className="inbox-filter-item">
                      <span className="filter-icon"><DashIcon name="clock" size={13} /></span>
                      <span className="filter-name">Awaiting</span>
                      <span className="filter-count">5</span>
                    </div>
                    <div className="inbox-filter-item">
                      <span className="filter-icon"><DashIcon name="alarm" size={13} /></span>
                      <span className="filter-name">Snoozed</span>
                      <span className="filter-count">2</span>
                    </div>
                    <div className="inbox-filter-item">
                      <span className="filter-icon"><DashIcon name="alert-triangle" size={13} /></span>
                      <span className="filter-name">Overdue SLA</span>
                    </div>
                    <div className="inbox-filter-item">
                      <span className="filter-icon"><DashIcon name="check" size={13} /></span>
                      <span className="filter-name">Resolved</span>
                      <span className="filter-count">12</span>
                    </div>
                  </div>

                  {/* Channels */}
                  <div className="dash-section-subhead">Channels</div>
                  <div className="inbox-channel-list">
                    <div className="channel-item">
                      <span className="ch-icon"><DashIcon name="mail" size={13} /></span>
                      <span className="ch-name">Email</span>
                      <span className="ch-count">6</span>
                    </div>
                    <div className="channel-item">
                      <span className="ch-icon"><DashIcon name="chat" size={13} /></span>
                      <span className="ch-name">Chat</span>
                    </div>
                    <div className="channel-item">
                      <span className="ch-icon"><DashIcon name="whatsapp" size={13} /></span>
                      <span className="ch-name">WhatsApp</span>
                    </div>
                    <div className="channel-item">
                      <span className="ch-icon"><DashIcon name="phone" size={13} /></span>
                      <span className="ch-name">Voice Calls</span>
                      <span className="ch-count ch-live">Live</span>
                    </div>
                    <div className="channel-item">
                      <span className="ch-icon"><DashIcon name="slack" size={13} /></span>
                      <span className="ch-name">Slack</span>
                      <span className="ch-count">16</span>
                    </div>
                    <div className="channel-item">
                      <span className="ch-icon"><DashIcon name="stripe" size={13} /></span>
                      <span className="ch-name">Stripe</span>
                      <span className="ch-count">2</span>
                    </div>
                  </div>

                  {/* Direct Messages */}
                  <div className="dash-section-subhead">Direct Messages</div>
                  <div className="inbox-thread-list">
                    {DASHBOARD_THREADS.map((thread) => (
                      <div
                        key={thread.id}
                        onClick={() => setSelectedThreadId(thread.id)}
                        className={`inbox-thread-card ${selectedThreadId === thread.id ? 'is-selected' : ''}`}
                      >
                        <div className="thread-avatar" style={{ backgroundColor: thread.avatarBg }}>
                          {thread.avatarText}
                        </div>
                        <div className="thread-info">
                          <div className="thread-top">
                            <span className="thread-name">{thread.name}</span>
                            <span className={`thread-tag tag-${thread.tagType}`}>{thread.tag}</span>
                          </div>
                          <div className="thread-preview">{thread.preview}</div>
                          <div className="thread-time">{thread.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Active Conversation Feed */}
                <div className="dash-col-conversation">
                  {/* Conversation Header */}
                  <div className="conv-header">
                    <div className="conv-user-info">
                      <div className="conv-avatar" style={{ backgroundColor: currentThread.avatarBg }}>
                        {currentThread.avatarText}
                      </div>
                      <div className="conv-user-meta">
                        <span className="conv-user-name">{currentThread.name}</span>
                        <span className="conv-user-time">{currentThread.time}</span>
                      </div>
                    </div>

                    <div className="conv-header-actions">
                      <div className="conv-assignee-pill">
                        <span className="assignee-avatar">J</span>
                        <span>John Ab.</span>
                        <span className="assignee-chevron"><DashIcon name="chevron-down" size={9} /></span>
                      </div>
                      <div className="conv-channel-pill">
                        <DashIcon name="mail" size={12} />
                        <span>Email</span>
                      </div>
                      <button type="button" className="conv-opt-btn">⋮</button>
                    </div>
                  </div>

                  {/* Date Badge */}
                  <div className="conv-date-chip">
                    <span>09 Sept, 2025</span>
                  </div>

                  {/* Message History */}
                  <div className="conv-messages-area">
                    {currentThread.messages.map((msg) => (
                      <div key={msg.id} className={`conv-msg-row msg-is-${msg.sender}`}>
                        {msg.sender === 'customer' && (
                          <div className="msg-avatar" style={{ backgroundColor: currentThread.avatarBg }}>
                            {currentThread.avatarText}
                          </div>
                        )}

                        <div className="msg-content-wrapper">
                          <div className="msg-author-time">
                            <span className="msg-author">{msg.author}</span>
                            <span className="msg-time">{msg.time}</span>
                          </div>

                          {msg.text && (
                            <div className="msg-bubble">
                              <p>{msg.text}</p>
                              <span className="msg-emoji-react" title="Add reaction">
                                <DashIcon name="smiley" size={13} />
                              </span>
                            </div>
                          )}

                          {msg.isActionCard && msg.actionCard && (
                            <div className="dash-action-receipt-card">
                              <div className="receipt-card-header">
                                <div className="receipt-status-pill">
                                  <span className="receipt-check"><DashIcon name="check" size={11} /></span>
                                  <span>{msg.actionCard.title}</span>
                                </div>
                                <button type="button" className="receipt-download-btn" title="Download receipt">
                                  <DashIcon name="download" size={12} />
                                </button>
                              </div>
                              <div className="receipt-card-body">
                                <div className="receipt-sub">{msg.actionCard.sub}</div>
                                <div className="receipt-meta-row">
                                  <span className="receipt-id">{msg.actionCard.refId}</span>
                                  {msg.actionCard.amount && (
                                    <span className="receipt-amount">{msg.actionCard.amount}</span>
                                  )}
                                </div>
                                <div className="receipt-footer-tag">
                                  <span className="receipt-tag-icon"><DashIcon name="check" size={10} /></span>
                                  <span>{msg.actionCard.status}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {msg.sender === 'agent' && (
                          <div className="msg-avatar agent-avatar">J</div>
                        )}
                      </div>
                    ))}

                    {/* Appended User Replies */}
                    {threadExtras.map((extra, idx) => (
                      <div key={idx} className="conv-msg-row msg-is-agent">
                        <div className="msg-content-wrapper">
                          <div className="msg-author-time">
                            <span className="msg-author">You (Agent Support)</span>
                            <span className="msg-time">{extra.time}</span>
                          </div>
                          <div className="msg-bubble">
                            <p>{extra.text}</p>
                          </div>
                        </div>
                        <div className="msg-avatar agent-avatar">J</div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input Bar */}
                  <form className="conv-reply-bar" onSubmit={handleSendReply}>
                    <button type="button" className="reply-attach-btn" title="Attach file">
                      <DashIcon name="plus" size={13} />
                    </button>
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      className="reply-text-input"
                    />
                    <button type="submit" className="reply-send-btn" title="Send reply">
                      <DashIcon name="arrow-up" size={13} />
                    </button>
                  </form>
                </div>

                {/* Column 4: Customer Details & AI Insights */}
                <aside className="dash-col-profile">
                  {/* Details / Tickets Tabs */}
                  <div className="profile-top-tabs">
                    <button
                      type="button"
                      className={`profile-tab-btn ${activeProfileTab === 'details' ? 'is-active' : ''}`}
                      onClick={() => setActiveProfileTab('details')}
                    >
                      Profile details
                    </button>
                    <button
                      type="button"
                      className={`profile-tab-btn ${activeProfileTab === 'tickets' ? 'is-active' : ''}`}
                      onClick={() => setActiveProfileTab('tickets')}
                    >
                      Tickets
                    </button>
                  </div>

                  {/* Information Section */}
                  <div className="profile-section-heading">Information</div>
                  <div className="profile-info-table">
                    <div className="info-row">
                      <span className="info-key">Assignee</span>
                      <span className="info-val info-assignee">John Ab</span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">Email:</span>
                      <span className="info-val info-link">{currentThread.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">Plan:</span>
                      <span className="info-val">{currentThread.plan}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">LTV:</span>
                      <span className="info-val">{currentThread.ltv}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">Joined:</span>
                      <span className="info-val">{currentThread.joined}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">Priority:</span>
                      <span className={`info-val priority-${currentThread.priority.toLowerCase()}`}>
                        {currentThread.priority}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">Segment:</span>
                      <span className="info-val">{currentThread.segment}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-key">Language:</span>
                      <span className="info-val">{currentThread.language}</span>
                    </div>
                  </div>

                  {/* Orders / Billing Card */}
                  <div className="profile-section-heading">Orders / Billing:</div>
                  <div className="dash-payment-card">
                    <div className="payment-card-left">
                      <span className="stripe-icon-badge">S</span>
                      <div className="payment-meta">
                        <span className="payment-title">Last payment <DashIcon name="external-link" size={10} /></span>
                        <span className="payment-date">{currentThread.lastPayment.date}</span>
                      </div>
                    </div>
                    <div className="payment-amount">{currentThread.lastPayment.amount}</div>
                  </div>

                  {/* AI Insights Card */}
                  <div className="profile-section-heading">AI Insights:</div>
                  <div className="dash-ai-insights-box">
                    <p className="ai-summary-text">{currentThread.aiSummary}</p>
                    <div className="ai-status-row">
                      <span className="ai-status-label">Status:</span>
                      <span className="ai-status-pill">{currentThread.status}</span>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 3: Foreground Hill (top.png) - ON TOP of the dashboard */}
        <div className="hero-hills-front-wrap" aria-hidden="true">
          <img
            src="/top.png"
            alt=""
            className="hero-hill-img hero-hill-front"
            style={{
              transform: `translateX(calc(-50% + ${mouseOffset.x * 24}px)) translateY(${mouseOffset.y * 12}px)`,
            }}
          />
        </div>

        {/* Smooth Transition Gradient into White / Page Surface */}
        <div className="hero-bottom-gradient" aria-hidden="true" />
      </section>

      {/* Customer Logos Strip - On the clean white/warm page section */}
      <section className="hero-logos-section">
        <div className="section-container">
          <h2 className="logos-heading">Powering the front lines of engineering teams at</h2>
        </div>
        <div className="logos-marquee-wrapper" aria-label="Client logos">
          <div className="logos-marquee-track">
            <div className="logos-marquee-group">
              {clientLogos.map((logo, index) => (
                <div className="logo-item-wrapper" key={`logo-1-${index}`}>
                  <img
                    src={logo.file}
                    alt={logo.name}
                    className="customer-logo-img"
                    style={{ height: `${logo.height}px` }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="logos-marquee-group" aria-hidden="true">
              {clientLogos.map((logo, index) => (
                <div className="logo-item-wrapper" key={`logo-2-${index}`}>
                  <img
                    src={logo.file}
                    alt={logo.name}
                    className="customer-logo-img"
                    style={{ height: `${logo.height}px` }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}



/* ─── Section: Bento Grid (Smarter call summaries, Powered by AI) ─── */
function BentoFeatures() {
  return (
    <section className="bento-section" id="features">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-center bento-header-wrap">
          <h2 className="bento-new-heading">
            Smarter call summaries,<br />
            <span className="bento-heading-accent">Powered by Synthio AI</span>
          </h2>
          <p className="bento-new-subtext">
            Automatically turn every customer call into clear insights, transcripts, and compliance reports &mdash; all synced directly to your CRM. No more forgotten details, manual note-taking, or lost context.
          </p>
        </div>

        {/* Outer Bento Frame */}
        <div className="bento-outer-frame">
          <div className="bento-v2-grid">
            {/* Card 1: Generative AI Insights */}
            <article className="bento-v2-card bento-v2-third">
              <div className="bento-v2-art art-insights">
                <div className="faint-stage-grid" />
                <div className="insights-stage">
                  <div className="insight-pill pill-summary">Call Summary</div>
                  <div className="insight-pill pill-topic">Key Topics</div>
                  <div className="center-cms-card">
                    <span className="cms-label">CRM</span>
                  </div>
                  <div className="insight-pill pill-product">Action Items</div>
                  <div className="insight-pill pill-resolve">Resolved</div>
                </div>
              </div>
              <div className="bento-v2-body">
                <h3 className="bento-v2-title">Generative AI Insights</h3>
                <p className="bento-v2-desc">
                  Turn every call into clear, actionable insights with AI-generated summaries and automatic CRM sync.
                </p>
              </div>
            </article>

            {/* Card 2: Generative AI Query */}
            <article className="bento-v2-card bento-v2-third">
              <div className="bento-v2-art art-query">
                <div className="faint-stage-grid" />
                <div className="query-box-mock">
                  <span className="query-placeholder">Did customer agree to the enterprise plan?</span>
                  <button type="button" className="query-submit-btn">Ask AI</button>
                </div>
              </div>
              <div className="bento-v2-body">
                <h3 className="bento-v2-title">Generative AI Query</h3>
                <p className="bento-v2-desc">
                  Ask any question across your calls and inboxes to get instant, timestamped answers powered by Synthio.
                </p>
              </div>
            </article>

            {/* Card 3: Call Analytics Summary */}
            <article className="bento-v2-card bento-v2-third">
              <div className="bento-v2-art art-analytics-summary">
                <div className="analytics-summary-card">
                  <div className="summary-block">
                    <span className="summary-block-label">Issue</span>
                    <p className="summary-block-text">
                      Customer noticed duplicate billing on monthly Pro subscription and requested immediate reversal.
                    </p>
                  </div>
                  <div className="summary-block">
                    <span className="summary-block-label">Action Items</span>
                    <p className="summary-block-text">
                      Auto-issued $240 Stripe refund &amp; updated Zendesk ticket #4812
                    </p>
                  </div>
                  <div className="summary-block">
                    <span className="summary-block-label">Outcomes</span>
                    <p className="summary-block-text">
                      Refund confirmed to card ending 4242. Full audio &amp; receipt synced to Salesforce.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bento-v2-body">
                <h3 className="bento-v2-title">Call Analytics Summary</h3>
                <p className="bento-v2-desc">
                  Quickly review root issues, automated actions, and resolution outcomes from every customer call.
                </p>
              </div>
            </article>

            {/* Card 4: Transcript (Wide) */}
            <article className="bento-v2-card bento-v2-wide">
              <div className="bento-v2-art art-transcript">
                <div className="transcript-feed">
                  <div className="transcript-line">
                    <div className="transcript-speaker">
                      <span className="speaker-avatar-dot agent-dot">⚡</span>
                      <span className="speaker-name">Synthio Voice Agent</span>
                      <span className="speaker-time">00:00</span>
                    </div>
                    <p className="transcript-speech">
                      Hi, thank you for calling Synthio Support. How can I help you today?
                    </p>
                  </div>

                  <div className="transcript-line">
                    <div className="transcript-speaker">
                      <span className="speaker-avatar-dot caller-dot">👤</span>
                      <span className="speaker-name">Elena Rostova</span>
                      <span className="speaker-time">00:04</span>
                      <span className="tag-interruption">Interruption</span>
                    </div>
                    <p className="transcript-speech">
                      Yeah, <mark className="mark-interrupted">hi&mdash;sorry to jump in,</mark> I&apos;m having trouble logging into my account. <mark className="mark-highlight">I tried resetting my password,</mark> but it still won&apos;t work.
                    </p>
                  </div>

                  <div className="transcript-line">
                    <div className="transcript-speaker">
                      <span className="speaker-avatar-dot caller-dot">👤</span>
                      <span className="speaker-name">Elena Rostova</span>
                      <span className="speaker-time">00:09</span>
                    </div>
                    <p className="transcript-speech">
                      I keep getting an error that says <mark className="mark-error">&ldquo;session lock #8412,&rdquo;</mark> even though I just updated credentials.
                    </p>
                  </div>

                  <div className="transcript-line">
                    <div className="transcript-speaker">
                      <span className="speaker-avatar-dot agent-dot">⚡</span>
                      <span className="speaker-name">Synthio Voice Agent</span>
                      <span className="speaker-time">00:13</span>
                    </div>
                    <p className="transcript-speech">
                      I see the lock on your account. I&apos;ve cleared the session and sent a 1-click verification link to your registered mobile phone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bento-v2-body">
                <h3 className="bento-v2-title">Transcript</h3>
                <p className="bento-v2-desc">
                  Get accurate, AI-generated transcripts of every call with speaker detection, sentiment, and key topics.
                </p>
              </div>
            </article>

            {/* Card 5: Compliance Report (Narrow) */}
            <article className="bento-v2-card bento-v2-narrow">
              <div className="bento-v2-art art-compliance">
                <div className="faint-stage-grid" />
                <div className="compliance-stage">
                  <div className="compliance-badge badge-prohibited">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.4" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                    <span className="alert-red-dot" />
                  </div>

                  <div className="compliance-badge badge-flag">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" y1="22" x2="4" y2="15" />
                    </svg>
                    <span className="alert-red-dot" />
                  </div>

                  <div className="center-folder-icon">
                    <svg width="60" height="50" viewBox="0 0 56 46" fill="none">
                      <path d="M4 12C4 8.68629 6.68629 6 10 6H20.6863C22.2776 6 23.8038 6.63214 24.9289 7.75736L27.2426 10.0711C28.3679 11.1963 29.894 11.8284 31.4853 11.8284H46C49.3137 11.8284 52 14.5147 52 17.8284V36C52 39.3137 49.3137 42 46 42H10C6.68629 42 4 39.3137 4 36V12Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />
                      <path d="M4 18H52" stroke="#E5E7EB" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div className="compliance-badge badge-warning">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span className="alert-red-dot" />
                  </div>
                </div>
              </div>
              <div className="bento-v2-body">
                <h3 className="bento-v2-title">Compliance &amp; Redaction</h3>
                <p className="bento-v2-desc">
                  Automatically redact customer PII, detect compliance risks, and enforce PCI-DSS standards across every call.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section: Everything. All in one place. ─── */
const EVERYTHING_TABS = [
  {
    id: 'voice',
    title: 'Voice AI agents',
    desc: 'Deploy AI agents that handle inbound and outbound calls 24/7. 2.4M calls resolved autonomously in 2025.',
    backdrop: '/travel-backdrop.png',
    card: {
      label: 'Live call handled',
      title: 'Inbound · Support Queue',
      desc: 'Customer billing inquiry resolved in 47s. Sentiment: positive. No escalation needed.',
      alert: 'Real-time voice synthesis with <200ms latency.',
      tags: [
        { text: '98.6% Resolution', bg: '#EEF2FF', color: '#4F46E5' },
        { text: 'Zero Wait Time', bg: '#F3F4F6', color: '#4B5563' },
      ],
    },
  },
  {
    id: 'email',
    title: 'Email automation',
    desc: 'AI agents that read, draft, and send contextual email replies. 89% faster response times across teams.',
    backdrop: '/spend-backdrop.png',
    card: {
      label: 'Auto-drafted reply',
      title: 'RE: Invoice #4821 overdue',
      desc: 'Payment reminder sent with attached statement. Follow-up scheduled in 72hrs.',
      alert: 'Tone-matched to your brand voice guidelines.',
      tags: [
        { text: 'Smart Threading', bg: '#ECFDF5', color: '#047857' },
        { text: 'Auto Follow-up', bg: '#F3F4F6', color: '#4B5563' },
      ],
    },
  },
  {
    id: 'workflows',
    title: 'Conversation workflows',
    desc: 'Build multi-step conversation flows across channels — chat, SMS, WhatsApp, and voice — in one builder.',
    backdrop: '/group-backdrop.png',
    card: {
      label: 'Workflow completed',
      title: 'Onboarding · New customer',
      desc: 'Welcome sequence: intro call → setup email → 3-day check-in. All touchpoints delivered.',
      alert: 'Cross-channel orchestration with zero code.',
      tags: [
        { text: 'Multi-Channel', bg: '#FEF3C7', color: '#B45309' },
        { text: 'Auto-Trigger', bg: '#F3F4F6', color: '#4B5563' },
      ],
    },
  },
  {
    id: 'analytics',
    title: 'Unified analytics',
    desc: 'Track every conversation, measure agent performance, and surface insights — all from a single dashboard.',
    backdrop: '/sunset-backdrop.png',
    card: {
      label: 'Weekly report',
      title: '12,847 conversations',
      desc: 'Avg. resolution: 1m 23s. Customer satisfaction: 4.8/5. Escalation rate: 3.2%.',
      alert: 'AI-generated insights delivered every Monday.',
      tags: [
        { text: 'Live Dashboard', bg: '#EEF2FF', color: '#4F46E5' },
        { text: 'Custom Reports', bg: '#F3F4F6', color: '#4B5563' },
      ],
    },
  },
]

function EverythingSection() {
  const [activeTabIdx, setActiveTabIdx] = useState(0) // Default to Voice AI agents
  const current = EVERYTHING_TABS[activeTabIdx]

  return (
    <section className="everything-section" id="everything">
      <div className="section-container everything-container">
        <div className="everything-layout">
          {/* Left Column: Heading, Tabs List, CTAs */}
          <div className="everything-left-col">
            <div className="everything-header">
              <h2 className="everything-title">Everything. All in one place.</h2>
              <p className="everything-subtitle">
                Handle calls, automate emails, and orchestrate conversations — all from one unified platform.
              </p>
            </div>

            <div className="everything-tabs-list" role="tablist">
              {EVERYTHING_TABS.map((tab, idx) => {
                const isActive = idx === activeTabIdx
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`everything-tab-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveTabIdx(idx)}
                  >
                    <div className="everything-tab-title">{tab.title}</div>
                    <div className="everything-tab-desc">{tab.desc}</div>
                  </button>
                )
              })}
            </div>

            <div className="everything-actions">
              <a className="everything-btn-black" href="#pricing">
                Get started free
              </a>
              <a className="everything-btn-white" href="#demo">
                See it in action
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic Stage Showcase */}
          <div className="everything-right-col">
            <div className="everything-showcase-stage">
              <img
                src={current.backdrop}
                alt=""
                className="everything-stage-backdrop"
                key={current.backdrop}
              />
              <div className="everything-floating-card">
                <div className="floating-card-label">{current.card.label}</div>
                <div className="floating-card-price">{current.card.title}</div>
                <div className="floating-card-desc">{current.card.desc}</div>
                <div className="floating-card-green-pill">
                  <span className="green-dot-pulse" aria-hidden="true" />
                  <span>{current.card.alert}</span>
                </div>
                <div className="floating-card-tags">
                  {current.card.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="card-tag"
                      style={{ backgroundColor: tag.bg, color: tag.color }}
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section: Integrations ─── */
function IntegrationsSection() {
  const [filter, setFilter] = useState<'all' | IntegrationCategory>('all')
  const visible = filter === 'all'
    ? integrationsList
    : integrationsList.filter((item) => item.category === filter)

  return (
    <section className="connect-section" id="integrations">
      <div className="section-container">
        <div className="section-header-center">
          <h2 className="section-heading">
            The stack you already run.<br />
            One agent on top of it.
          </h2>
          <p className="section-subtext">
            Synthio connects to voice, inbox, CRM, and chat so every conversation writes back where your team already works. Standard setups take a few minutes. No glue code.
          </p>
        </div>

        <div className="connect-toolbar">
          <div className="connect-filters" role="tablist" aria-label="Filter integrations">
            {integrationFilters.map((item) => {
              const count = item.id === 'all'
                ? integrationsList.length
                : integrationsList.filter((entry) => entry.category === item.id).length
              const active = filter === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`connect-filter ${active ? 'is-active' : ''}`}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                  <span className="connect-filter-count">{count}</span>
                </button>
              )
            })}
          </div>
          <p className="connect-toolbar-note">Two-way sync · connects in under 2 minutes</p>
        </div>

        <div className="connect-grid">
          {visible.map((item) => (
            <article className="connect-card" key={item.name}>
              <div className="connect-card-top">
                {item.logo ? (
                  <span className="connect-mark connect-mark-lg connect-mark-has-img">
                    <img src={item.logo} alt={item.name} className="connect-logo-img" />
                  </span>
                ) : (
                  <span className="connect-mark connect-mark-lg" style={{ background: item.bg, color: item.fg }}>
                    {item.mark}
                  </span>
                )}
                <span className="connect-card-cat">{item.category}</span>
              </div>
              <h3 className="connect-card-name">{item.name}</h3>
              <p className="connect-card-blurb">{item.blurb}</p>
              <p className="connect-card-sync">
                <span>Syncs</span>
                {item.sync}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Botanic Logo ─── */
function BotanicLogo() {
  return (
    <span className="botanic-brand" aria-label="Botanic">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="12" cy="3.5" r="2.2" />
        <circle cx="12" cy="20.5" r="2.2" />
        <circle cx="3.5" cy="12" r="2.2" />
        <circle cx="20.5" cy="12" r="2.2" />
        <circle cx="6" cy="6" r="2.2" />
        <circle cx="18" cy="18" r="2.2" />
        <circle cx="6" cy="18" r="2.2" />
        <circle cx="18" cy="6" r="2.2" />
      </svg>
      <span className="botanic-text">Botanic.</span>
    </span>
  )
}

/* ─── Section: Case Study Banner (Dark Chocolate Background) ─── */
function TestimonialBanner() {
  return (
    <section className="testimonial-section">
      <div className="section-container">
        <div className="testimonial-card">
          <div className="testimonial-left">
            <div className="testimonial-brand">
              <BotanicLogo />
            </div>

            <blockquote className="testimonial-quote">
              &ldquo;Synthio changed how our whole customer team operates. We went from long hold queues and flooded inboxes to resolving over 70% of calls and emails automatically &mdash; with human-grade quality across every channel.&rdquo;
            </blockquote>

            <div className="testimonial-author">
              <div className="author-avatar-img">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <rect width="44" height="44" rx="8" fill="#F3ECE4" />
                  {/* Stylized Avatar Headshot matching Sarah Chen */}
                  <circle cx="22" cy="16" r="8" fill="#2D1A10" />
                  <path d="M14 18c0-5 3.5-9 8-9s8 4 8 9v4c0 3-1 6-3 8h-10c-2-2-3-5-3-8v-4z" fill="#1C1009" />
                  <circle cx="22" cy="17" r="6" fill="#F7D3B6" />
                  <path d="M16 16c2-4 8-4 12 0v2c0 2-1 4-2 5h-8c-1-1-2-3-2-5v-2z" fill="#1C1009" />
                  <path d="M9 38c0-7 6-12 13-12s13 5 13 12" fill="#3D2417" />
                  <rect x="19.5" y="26" width="5" height="9" rx="1.5" fill="#FFFFFF" />
                  <path d="M20 26l2 4 2-4" stroke="#714CB6" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="author-details">
                <b className="author-name">Sarah Chen</b>
                <span className="author-role">Head of Customer Operations, Botanic</span>
              </div>
            </div>

            <a className="testimonial-pill-btn" href="#case-study">
              <span>Read full case study</span>
            </a>
          </div>

          <div className="testimonial-right">
            <div className="testimonial-stat-item">
              <span className="stat-val">3x</span>
              <span className="stat-desc">Faster resolution</span>
            </div>
            <div className="testimonial-stat-item">
              <span className="stat-val">72%</span>
              <span className="stat-desc">Calls &amp; tickets automated</span>
            </div>
            <div className="testimonial-stat-item">
              <span className="stat-val">Zero</span>
              <span className="stat-desc">Customer hold time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Lightning Bolt SVG Helper for Pricing ─── */
function PricingBolts({ count = 1, color = '#A3E635' }: { count?: number; color?: string }) {
  return (
    <div className="pricing-bolts-row" style={{ color }} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="16"
          viewBox="0 0 13 16"
          fill="currentColor"
          className="pricing-bolt-icon"
        >
          <path d="M7.5 0L0 9.2h5.5L4.5 16 12.5 6.8H7l.5-6.8z" />
        </svg>
      ))}
    </div>
  )
}

/* ─── Section: Transparent Pricing (Matches media_1794506700549_4db97621.png) ─── */
function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="pricing-section" id="pricing">
      <div className="section-container pricing-container">
        {/* Section Header */}
        <div className="section-header-center pricing-header-center">
          <h2 className="pricing-main-heading">Simple, transparent pricing</h2>

          {/* Billing Switch: Monthly / Yearly */}
          <div className="pricing-toggle-wrap">
            <span className={`billing-opt-label ${!isYearly ? 'active' : ''}`}>Monthly</span>
            <button
              className="billing-slider-track"
              onClick={() => setIsYearly(!isYearly)}
              type="button"
              aria-label="Toggle billing duration"
            >
              <span className={`billing-slider-thumb ${isYearly ? 'is-yearly' : ''}`} />
            </button>
            <span className={`billing-opt-label ${isYearly ? 'active' : ''}`}>Yearly (Save 20%)</span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-cards-row modern-pricing-row">
          {/* Card 1: Startup (Light Card with Black Button) */}
          <div className="modern-price-card card-startup">
            <div className="modern-card-header">
              <PricingBolts count={1} color="#18181B" />
              <h3 className="modern-plan-name">Startup</h3>
              <div className="modern-price-hero">
                <span className="modern-price-val">Free</span>
              </div>
              <p className="modern-price-sub">Forever. No credit card.</p>
            </div>

            <ul className="modern-feature-list">
              <li><span className="modern-chk">✓</span> <span>100 autonomous voice call minutes/mo</span></li>
              <li><span className="modern-chk">✓</span> <span>500 automated email replies</span></li>
              <li><span className="modern-chk">✓</span> <span>1 AI agent persona</span></li>
              <li><span className="modern-chk">✓</span> <span>Multi-channel chat widget</span></li>
              <li><span className="modern-chk">✓</span> <span>Basic analytics &amp; reporting</span></li>
            </ul>

            <div className="modern-card-footer">
              <a className="modern-plan-btn btn-black-pill" href="#top">
                Sign up now
              </a>
            </div>
          </div>

          {/* Card 2: Pro (Dark Card with Most Popular Badge) */}
          <div className="modern-price-card card-pro">
            <div className="modern-card-header">
              <div className="pro-top-row">
                <PricingBolts count={2} color="#FFFFFF" />
                <span className="most-popular-tag">MOST POPULAR</span>
              </div>
              <h3 className="modern-plan-name">Pro</h3>
              <div className="modern-plan-userlimit">Allows 3+ users</div>
              <div className="modern-price-hero">
                <span className="modern-price-val">${isYearly ? '480' : '600'}</span>
                <span className="modern-price-term">/mo</span>
              </div>
              <p className="modern-price-sub">
                ${isYearly ? '160' : '200'}/mo per additional user. {isYearly ? 'Billed annually.' : 'Billed monthly.'}
              </p>
            </div>

            <ul className="modern-feature-list">
              <li><span className="modern-chk">✓</span> <span>Unlimited voice call minutes</span></li>
              <li><span className="modern-chk">✓</span> <span>Unlimited automated email replies</span></li>
              <li><span className="modern-chk">✓</span> <span>Unlimited conversation workflows</span></li>
              <li><span className="modern-chk">✓</span> <span>10,000 multi-channel touchpoints/mo</span></li>
              <li><span className="modern-chk">✓</span> <span>Custom voice cloning &amp; brand tone</span></li>
              <li><span className="modern-chk">✓</span> <span>Two-way CRM sync (HubSpot, Salesforce)</span></li>
              <li><span className="modern-chk">✓</span> <span>Omnichannel routing (WhatsApp, SMS, Slack)</span></li>
              <li><span className="modern-chk">✓</span> <span>Advanced sentiment &amp; escalation analytics</span></li>
              <li><span className="modern-chk">✓</span> <span>Dedicated account manager</span></li>
            </ul>

            <div className="modern-card-footer">
              <a className="modern-plan-btn btn-white-pill" href="#top">
                Sign up now
              </a>
            </div>
          </div>

          {/* Card 3: Max (Light Card with Schedule Call Button) */}
          <div className="modern-price-card card-max">
            <div className="modern-card-header">
              <PricingBolts count={3} color="#18181B" />
              <h3 className="modern-plan-name">Max</h3>
              <div className="modern-plan-userlimit">Unlimited users per organization</div>
              <div className="modern-price-hero">
                <span className="modern-price-val val-call">Let's talk</span>
              </div>
              <p className="modern-price-sub">A flat fee for the entire organization.</p>
            </div>

            <div className="modern-included-label">All from the Pro, plus enterprise scale:</div>

            <ul className="modern-feature-list">
              <li><span className="modern-chk">✓</span> <span><b>Enterprise analytics</b> on an agent level</span></li>
              <li><span className="modern-chk">✓</span> <span><b>Real-time queue</b> &amp; concurrency control</span></li>
              <li><span className="modern-chk">✓</span> <span><b>Custom LLM</b> &amp; on-prem model hosting</span></li>
              <li><span className="modern-chk">✓</span> <span><b>Dedicated SIP trunks</b> &amp; phone numbers</span></li>
              <li><span className="modern-chk">✓</span> <span><b>SOC 2 Type II</b>, HIPAA &amp; custom SLAs</span></li>
              <li><span className="modern-chk">✓</span> <span><b>White-glove onboarding</b> &amp; migration</span></li>
            </ul>

            <div className="modern-card-footer">
              <a className="modern-plan-btn btn-black-pill" href="#top">
                Schedule call
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section: FAQ ─── */
function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq-section">
      <div className="section-container faq-container">
        <div className="section-header-center">
          <h2 className="section-heading">Frequently Asked Questions</h2>
        </div>

        <div className="faq-accordion">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div className={`faq-card ${isOpen ? 'is-open' : ''}`} key={index}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFaq(index)}
                  type="button"
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{item.q}</span>
                  <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="faq-answer-body">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="faq-footer-note">
          Have more questions? <a href="#pricing">Talk directly to our engineering team →</a>
        </p>
      </div>
    </section>
  )
}

/* ─── Section: Pre-Footer CTA with Live Dashboard Preview (Intelligent AI Agent Platform) ─── */
function CtaBanner() {
  const [activeTab, setActiveTab] = useState<'voice' | 'email' | 'chat'>('voice')

  const agentSessionsData = [
    {
      customer: 'Marcus Sterling',
      id: '+1 (415) 892-4102',
      status: 'Live Voice Call',
      statusType: 'green',
      task: 'Billing & Invoice Inquiry',
      engine: '⚡ Voice AI (<140ms)',
      timestamp: 'Today 12:48 PM',
      result: 'Positive · 142ms',
      provider: 'Twilio Voice',
      providerBg: '#FEE2E2',
      providerColor: '#DC2626',
      providerIcon: 'Tw',
    },
    {
      customer: 'Elena Rostova',
      id: 'elena@fintechglobal.co',
      status: 'Email Resolved',
      statusType: 'green',
      task: 'Ticket Triage & Auto-Reply',
      engine: '✉ Smart Inbox AI',
      timestamp: 'Today 12:20 PM',
      result: 'Resolved in 38s',
      provider: 'Zendesk',
      providerBg: '#ECFDF5',
      providerColor: '#059669',
      providerIcon: 'ZD',
    },
    {
      customer: 'Dr. Julian Hayes',
      id: '+1 (212) 554-0199',
      status: 'Appointment Booked',
      statusType: 'green',
      task: 'Calendar Reschedule & SMS',
      engine: '⚡ Realtime SIP Trunk',
      timestamp: 'Today 11:55 AM',
      result: '100% Positive',
      provider: 'HubSpot',
      providerBg: '#FFEDD5',
      providerColor: '#EA580C',
      providerIcon: 'HS',
    },
    {
      customer: 'Aria Chen',
      id: 'aria.c@meridian.design',
      status: 'Auto-Categorized',
      statusType: 'amber',
      task: 'WhatsApp Live Assistant',
      engine: '💬 Multi-Turn Agent',
      timestamp: 'Today 11:53 AM',
      result: 'CRM Synced',
      provider: 'Salesforce',
      providerBg: '#E0F2FE',
      providerColor: '#0284C7',
      providerIcon: 'SF',
    },
  ]

  return (
    <section className="prefooter-cta-section" id="cta">
      <div className="section-container">
        {/* Header Block */}
        <div className="cta-showcase-header">
          <h2 className="cta-showcase-title">Ready to deploy intelligent AI agents?</h2>
          <p className="cta-showcase-desc">
            Handle customer phone calls with ultra-low latency, triage high-volume support inboxes, and automate conversations across every channel.
          </p>
          <div className="cta-showcase-buttons">
            <a className="cta-btn-primary" href="#pricing">
              <span>Talk to sales</span>
              <span className="cta-arrow" aria-hidden="true">→</span>
            </a>
            <a className="cta-btn-secondary" href="#demo">
              <span>Try our sandbox</span>
              <span className="cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Live Dashboard Card Window */}
        <div className="cta-dashboard-window">
          {/* Dashboard App Topbar */}
          <div className="dash-topbar">
            <div className="dash-topbar-left">
              <div className="dash-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h8v8H4V4zm0 10h6v6H4v-6zm8 2h8v4h-8v-4z" fill="#18181B" />
                </svg>
              </div>
              <div className="dash-org-pill">
                <span className="org-name">Synthio AI</span>
                <span className="org-env-badge">Live Agents</span>
                <span className="org-chevron">▾</span>
              </div>
            </div>

            <nav className="dash-nav-links">
              <span className="dash-link">Overview</span>
              <span className="dash-link">Voice Calls</span>
              <span className="dash-link">Email Queues</span>
              <span className="dash-link is-active">Active Sessions</span>
              <span className="dash-link">Integrations</span>
              <span className="dash-link">Analytics</span>
            </nav>

            <div className="dash-topbar-right">
              <div className="dash-user-avatar">
                <span>S</span>
                <span className="avatar-chevron">▾</span>
              </div>
            </div>
          </div>

          {/* Dashboard Main Content */}
          <div className="dash-content-area">
            {/* Title & Actions Row */}
            <div className="dash-title-row">
              <h3 className="dash-page-title">Active Agent Sessions</h3>
              <button className="dash-actions-btn" type="button">
                <span>Deploy Agent</span>
                <span className="btn-chevron">▾</span>
              </button>
            </div>

            {/* Sub-tabs: Voice Calls, Email Queues, Omnichannel Chat */}
            <div className="dash-subtabs-row">
              <button
                type="button"
                className={`dash-subtab ${activeTab === 'voice' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('voice')}
              >
                Voice Calls <span className="tab-count">14</span>
              </button>
              <button
                type="button"
                className={`dash-subtab ${activeTab === 'email' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('email')}
              >
                Email Queues <span className="tab-count">8</span>
              </button>
              <button
                type="button"
                className={`dash-subtab ${activeTab === 'chat' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                Omnichannel Chat <span className="tab-count">23</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="dash-filter-bar">
              <div className="dash-search-input-wrap">
                <svg className="dash-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search callers, emails, channels, or CRM records..."
                  className="dash-search-input"
                  readOnly
                />
              </div>
              <button className="dash-filter-btn" type="button">
                <span>Add Filter</span>
                <span className="filter-plus">+</span>
              </button>
            </div>

            {/* Data Table */}
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Caller / Contact <span className="col-sort">⇅</span></th>
                    <th>Agent Status <span className="col-sort">⇅</span></th>
                    <th>Task & Channel <span className="col-sort">⇅</span></th>
                    <th>AI Engine <span className="col-sort">⇅</span></th>
                    <th>Timestamp <span className="col-sort">⇅</span></th>
                    <th>Outcome / Latency <span className="col-sort">⇅</span></th>
                    <th>Synced CRM / PBX <span className="col-sort">⇅</span></th>
                  </tr>
                </thead>
                <tbody>
                  {agentSessionsData.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="cust-cell">
                          <span className="cust-name">{row.customer}</span>
                          <span className="cust-id">{row.id}</span>
                        </div>
                      </td>
                      <td>
                        <div className={`status-pill-cell ${row.statusType}`}>
                          <span className="status-dot-bullet" />
                          <span>{row.status}</span>
                        </div>
                      </td>
                      <td>
                        <div className="sync-cell">
                          <span className="sync-dot-bullet" />
                          <span>{row.task}</span>
                        </div>
                      </td>
                      <td>
                        <div className="conn-type-badges">
                          <span className="type-badge auto-badge">{row.engine}</span>
                        </div>
                      </td>
                      <td className="time-cell">{row.timestamp}</td>
                      <td className="time-cell" style={{ fontWeight: 600, color: '#166534' }}>
                        {row.result}
                      </td>
                      <td>
                        <div
                          className="provider-badge"
                          style={{ backgroundColor: row.providerBg, color: row.providerColor }}
                        >
                          <span className="prov-icon-box">{row.providerIcon}</span>
                          <span className="prov-label">{row.provider}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer (Blue with Leedlime UI layout & top/bottom rolling hill landscape) ─── */
function Footer() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e
    const rect = currentTarget.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width - 0.5
    const y = (clientY - rect.top) / rect.height - 0.5
    setMouseOffset({ x, y })
  }

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 })
  }

  return (
    <footer
      className="dark-footer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Hill (bottom-footer.png) - Layer 1 */}
      <div className="footer-hills-back-wrap" aria-hidden="true">
        <img
          src="/bottom-footer.png"
          alt=""
          className="footer-hill-img footer-hill-back"
          style={{
            transform: `translateX(calc(-50% + ${mouseOffset.x * 12}px)) translateY(${mouseOffset.y * 6}px)`,
          }}
        />
      </div>

      <div className="section-container footer-content-container">
        {/* Main Grid: Brand Column + 3 Link Columns */}
        <div className="footer-ui-grid">
          {/* Brand Info */}
          <div className="footer-ui-brand">
            <a className="footer-ui-logo-row" href="#top" aria-label="Synthio home">
              <img
                src="/logos/logo-on-blue.png"
                alt="Synthio"
                className="footer-brand-img"
              />
            </a>

            <p className="footer-ui-tagline">
              Build intelligent AI agents that handle customer calls, manage emails, and automate conversations across every channel.
            </p>

            <div className="footer-ui-socials">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-ui-social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-ui-social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: PRODUCT */}
          <div className="footer-ui-col">
            <h4 className="footer-ui-col-title">PRODUCT</h4>
            <a className="footer-ui-link" href="#features">How it works</a>
            <a className="footer-ui-link" href="#pricing">Pricing</a>
            <a className="footer-ui-link" href="#faq">FAQ</a>
            <a className="footer-ui-link" href="#features">Games</a>
            <a className="footer-ui-link" href="#top">Chrome Extension</a>
            <a className="footer-ui-link" href="#pricing">Start Free Trial</a>
            <a className="footer-ui-link" href="#demo">LinkedIn Preview</a>
          </div>

          {/* Column 2: COMPANY */}
          <div className="footer-ui-col">
            <h4 className="footer-ui-col-title">COMPANY</h4>
            <a className="footer-ui-link" href="#top">About</a>
            <a className="footer-ui-link" href="#top">Contact</a>
            <a className="footer-ui-link" href="#top">Blog</a>
            <a className="footer-ui-link" href="#top">Social</a>
          </div>

          {/* Column 3: LEGAL */}
          <div className="footer-ui-col">
            <h4 className="footer-ui-col-title">LEGAL</h4>
            <a className="footer-ui-link" href="#top">Privacy Policy</a>
            <a className="footer-ui-link" href="#top">Terms of Service</a>
            <a className="footer-ui-link" href="#top">Refund Policy</a>
            <a className="footer-ui-link" href="#top">Extension Privacy</a>
          </div>
        </div>

        {/* Middle Status Indicator */}
        <div className="footer-ui-status-row">
          <span className="footer-ui-status-pill">
            <span className="footer-ui-status-check" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>All services are online</span>
          </span>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-ui-bottom">
          <p className="footer-ui-copy">© 2026 Synthio. All rights reserved.</p>
          <div className="footer-ui-actions">
            <a className="footer-ui-login" href="#top">Log in</a>
            <a className="footer-ui-trial" href="#pricing">
              <span>Start free trial</span>
              <span className="footer-ui-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Foreground Hill (top-footer.png) - Layer 3 */}
      <div className="footer-hills-front-wrap" aria-hidden="true">
        <img
          src="/top-footer.png"
          alt=""
          className="footer-hill-img footer-hill-front"
          style={{
            transform: `translateX(calc(-50% + ${mouseOffset.x * 24}px)) translateY(${mouseOffset.y * 12}px)`,
          }}
        />
      </div>
    </footer>
  )
}

/* ─── Main Application Export ─── */
export default function App() {
  return (
    <div className="nexus-app" id="top">
      <Navbar />
      <main>
        <Hero />
        <BentoFeatures />
        <EverythingSection />
        <IntegrationsSection />
        <TestimonialBanner />
        <PricingSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  )
}
