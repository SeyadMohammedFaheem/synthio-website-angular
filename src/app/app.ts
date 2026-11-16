import { Component, HostListener, signal, computed, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from './icon.component';

export interface DashboardThread {
  id: string;
  name: string;
  avatarText: string;
  avatarBg: string;
  time: string;
  tag: string;
  tagType: 'ai' | 'draft' | 'escalated';
  preview: string;
  email: string;
  plan: string;
  ltv: string;
  joined: string;
  priority: 'High' | 'Normal' | 'Urgent';
  segment: string;
  language: string;
  lastPayment: { amount: string; date: string };
  aiSummary: string;
  status: string;
  messages: Array<{
    id: string;
    sender: 'customer' | 'agent';
    author: string;
    time: string;
    text?: string;
    isActionCard?: boolean;
    actionCard?: {
      title: string;
      sub: string;
      amount?: string;
      refId: string;
      status: string;
    };
  }>;
}

export type IntegrationCategory = 'crm' | 'support' | 'inbox' | 'automation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Navigation state
  readonly mobileOpen = signal(false);
  readonly activeMenu = signal<string | null>(null);
  readonly navTheme = signal<'blue' | 'white'>('blue');
  private menuTimer: any = null;

  // Hero interactive state
  readonly selectedThreadId = signal('sarah');
  readonly activeProfileTab = signal<'details' | 'tickets'>('details');
  readonly replyInput = signal('');
  readonly extraMessages = signal<Record<string, Array<{ text: string; time: string }>>>({});
  readonly heroMouseOffset = signal({ x: 0, y: 0 });
  readonly footerMouseOffset = signal({ x: 0, y: 0 });

  // Everything tabs state
  readonly activeTabIdx = signal(0);

  // Integrations state
  readonly integrationFilter = signal<'all' | IntegrationCategory>('all');

  // Pricing state
  readonly isYearly = signal(false);

  // FAQ state
  readonly openFaqIndex = signal<number | null>(0);

  // CTA Pre-footer state
  readonly activeCtaTab = signal<'voice' | 'email' | 'chat'>('voice');

  // Static Data
  readonly clientLogos = [
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
  ];

  readonly integrationFilters: { id: 'all' | IntegrationCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'crm', label: 'CRM' },
    { id: 'support', label: 'Support' },
    { id: 'inbox', label: 'Mail & Chat' },
    { id: 'automation', label: 'Automation' },
  ];

  readonly integrationsList: {
    name: string;
    category: IntegrationCategory;
    blurb: string;
    sync: string;
    mark: string;
    bg: string;
    fg: string;
    logo?: string;
  }[] = [
    { name: 'Zapier', category: 'automation', mark: 'Zp', bg: '#FF4A00', fg: '#FFFFFF', blurb: 'Fire any downstream workflow the moment a conversation resolves.', sync: 'Triggers, payloads, retries', logo: '/zapier.webp' },
    { name: 'WhatsApp', category: 'inbox', mark: 'Wa', bg: '#128C7E', fg: '#FFFFFF', blurb: 'Keep Business API threads on the same agent that handles the phone.', sync: 'Threads, templates, media', logo: '/whatsapp.webp' },
    { name: 'Slack', category: 'automation', mark: 'Sl', bg: '#4A154B', fg: '#FFFFFF', blurb: 'Post the handoff into the channel that owns the account, with the transcript.', sync: 'Channels, threads, mentions', logo: '/slack.webp' },
    { name: 'Mail (Gmail)', category: 'inbox', mark: 'Gm', bg: '#EA4335', fg: '#FFFFFF', blurb: 'Read the thread, draft the reply, and send it in your brand voice.', sync: 'Threads, drafts, labels', logo: '/mail.webp' },
    { name: 'Salesforce', category: 'crm', mark: 'Sf', bg: '#00A1E0', fg: '#FFFFFF', blurb: 'Write the call, the contact, and the case back while it is still live.', sync: 'Contacts, cases, activities', logo: '/salesforce.webp' },
    { name: 'Zendesk', category: 'support', mark: 'Zd', bg: '#03363D', fg: '#FFFFFF', blurb: 'Open, update, and close the ticket without a second screen.', sync: 'Tickets, macros, CSAT', logo: '/zendesk.webp' },
  ];

  readonly faqItems = [
    {
      q: "How do Synthio's AI agents handle complex customer conversations?",
      a: "Synthio agents use advanced natural language understanding to follow multi-turn conversations, detect intent shifts, and escalate to human agents when needed. They maintain full context across channels — so a customer who starts on chat and moves to a call never has to repeat themselves.",
    },
    {
      q: "Can I customize the AI agent's voice and personality?",
      a: "Yes. You can choose from 30+ natural-sounding voices, adjust speaking pace and tone, and define brand-specific guidelines. The agent adapts its personality to match your brand — professional, friendly, or anywhere in between.",
    },
    {
      q: "How long does it take to deploy our first AI agent?",
      a: "Most teams deploy a production-ready agent in under 30 minutes. Import your knowledge base, connect your phone number or email, set routing rules, and you're live. No code required for basic setups.",
    },
    {
      q: "What happens if the AI agent can't resolve a customer issue?",
      a: "Synthio automatically detects when a conversation requires human intervention — based on sentiment, complexity, or custom rules you set. It seamlessly hands off to your team with full conversation context, so agents can pick up exactly where the AI left off.",
    },
    {
      q: "Is my customer data secure with Synthio?",
      a: "Absolutely. All conversations are encrypted end-to-end with AES-256. We're SOC 2 Type II certified, GDPR compliant, and HIPAA eligible. Customer data is never used to train models, and you retain full ownership and control.",
    },
  ];

  readonly dashboardThreads: DashboardThread[] = [
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
      aiSummary: 'Customer reported duplicate billing on Sep 8. AI detected Stripe transaction #tx_98124 and drafted a $29 refund confirmation pending human one-click signoff.',
      status: 'Open · AI drafted',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          author: 'Sarah Mitchell',
          time: '10:41 AM',
          text: 'Hi there, I noticed on my bank statement that I was billed twice on Sep 8th for $29. Could someone please look into this and refund the duplicate charge?',
        },
        {
          id: 'm2',
          sender: 'agent',
          author: 'Synthio Assistant',
          time: '10:42 AM',
          isActionCard: true,
          actionCard: {
            title: 'Refund Prepared',
            sub: 'Stripe duplicate charge #ch_891a24 detected',
            amount: '$29.00 USD',
            refId: 'REF-2025-0982',
            status: 'Ready to execute',
          },
        },
        {
          id: 'm3',
          sender: 'agent',
          author: 'Synthio Assistant (Draft)',
          time: '10:42 AM',
          text: "Hi Sarah! I've located the duplicate $29 charge on Sep 8th from our billing processor. I've initiated an immediate refund of $29.00 back to your original payment card ending in 4242. You should see this credited to your account within 2-3 business days.",
        },
      ],
    },
    {
      id: 'marcus',
      name: 'Marcus Vance',
      avatarText: 'MV',
      avatarBg: '#FEF3C7',
      time: '8m ago',
      tag: 'Pending',
      tagType: 'draft',
      preview: 'Can we add 15 more seats to our team license before Friday?',
      email: 'marcus.v@apextech.io',
      plan: 'Team ($199/mo)',
      ltv: '$4,800',
      joined: 'Jan 2023',
      priority: 'Normal',
      segment: 'Enterprise EU',
      language: 'English',
      lastPayment: { amount: '$199', date: 'Aug 28, 2025' },
      aiSummary: 'Customer requesting seat expansion before Q3 planning deadline. Pro-rated quote of $420/quarter drafted automatically with volume tier discount applied.',
      status: 'Open · Quote drafted',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          author: 'Marcus Vance',
          time: '10:35 AM',
          text: 'Hello team, our engineering team is expanding this sprint and we need 15 additional seats added to our workspace before this Friday. Can you send over a pro-rated invoice?',
        },
        {
          id: 'm2',
          sender: 'agent',
          author: 'Synthio Assistant (Draft)',
          time: '10:36 AM',
          text: "Hi Marcus! Absolutely, I can add those 15 seats right away. With your Team tier volume discount, the pro-rated cost through the end of your billing cycle is $420.00. Would you like me to apply this directly to your card on file?",
        },
      ],
    },
    {
      id: 'elena',
      name: 'Elena Rostova',
      avatarText: 'ER',
      avatarBg: '#DCFCE7',
      time: '14m ago',
      tag: 'Escalated',
      tagType: 'escalated',
      preview: 'Webhook delivery failures on endpoint /v1/events/crm...',
      email: 'elena@novasystems.de',
      plan: 'Enterprise ($999/mo)',
      ltv: '$18,500',
      joined: 'Jun 2020',
      priority: 'Urgent',
      segment: 'EMEA Enterprise',
      language: 'English',
      lastPayment: { amount: '$999', date: 'Sep 1, 2025' },
      aiSummary: 'API client receiving 504 gateway timeouts on webhook payload delivery. AI checked Datadog traces, found IP rate limit trip, and escalated to on-call engineer.',
      status: 'Escalated to Tier-3',
      messages: [
        {
          id: 'm1',
          sender: 'customer',
          author: 'Elena Rostova',
          time: '10:28 AM',
          text: 'Our webhook listener at /v1/events/crm has missed 14 batches over the last hour. Error log returns 504 Gateway Timeout. This is blocking our lead sync.',
        },
        {
          id: 'm2',
          sender: 'agent',
          author: 'Synthio Assistant',
          time: '10:29 AM',
          isActionCard: true,
          actionCard: {
            title: 'Diagnostic Alert Raised',
            sub: 'Datadog latency spike: 2,400ms on /crm endpoint',
            refId: 'INC-7741',
            status: 'Assigned to DevOps On-Call',
          },
        },
        {
          id: 'm3',
          sender: 'agent',
          author: 'Synthio Assistant',
          time: '10:30 AM',
          text: 'Hi Elena, our automated telemetry caught the timeout spike. I have temporarily re-routed your events to the backup ingestion queue (0 dropped payloads) and escalated ticket INC-7741 to our platform engineering on-call.',
        },
      ],
    },
  ];

  readonly everythingTabs = [
    {
      id: 'voice',
      title: 'Voice AI agents',
      desc: 'Deploy AI agents that handle inbound and outbound calls 24/7. 2.4M calls resolved autonomously in 2025.',
      backdrop: '/travel-backdrop.webp',
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
      backdrop: '/spend-backdrop.webp',
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
      backdrop: '/group-backdrop.webp',
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
      backdrop: '/sunset-backdrop.webp',
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
  ];

  readonly agentSessionsData = [
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
  ];

  // Computed properties
  readonly currentThread = computed(() => {
    return this.dashboardThreads.find(t => t.id === this.selectedThreadId()) || this.dashboardThreads[0];
  });

  readonly threadExtras = computed(() => {
    return this.extraMessages()[this.currentThread().id] || [];
  });

  readonly currentEverythingTab = computed(() => {
    return this.everythingTabs[this.activeTabIdx()];
  });

  readonly visibleIntegrations = computed(() => {
    const filter = this.integrationFilter();
    if (filter === 'all') return this.integrationsList;
    return this.integrationsList.filter(item => item.category === filter);
  });

  constructor(private elementRef: ElementRef) {}

  // Navigation handlers
  handleMouseEnter(menu: string): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 900) return;
    if (this.menuTimer) clearTimeout(this.menuTimer);
    this.activeMenu.set(menu);
  }

  handleMouseLeave(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 900) return;
    this.menuTimer = setTimeout(() => {
      this.activeMenu.set(null);
    }, 180);
  }

  toggleMenu(menu: string): void {
    this.activeMenu.set(this.activeMenu() === menu ? null : menu);
  }

  closeMenu(): void {
    this.activeMenu.set(null);
    this.mobileOpen.set(false);
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.coda-nav-center')) {
      this.activeMenu.set(null);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.activeMenu.set(null);
    this.mobileOpen.set(false);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (typeof document === 'undefined') return;
    const heroEl = document.querySelector('.hero-section');
    const footerEl = document.querySelector('.dark-footer');

    if (heroEl) {
      const heroBottom = heroEl.getBoundingClientRect().bottom;
      if (footerEl) {
        const footerTop = footerEl.getBoundingClientRect().top;
        if (footerTop <= 80) {
          this.navTheme.set('blue');
          return;
        }
      }
      this.navTheme.set(heroBottom <= 80 ? 'white' : 'blue');
    }
  }

  // Parallax handlers
  onHeroMouseMove(e: MouseEvent): void {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    this.heroMouseOffset.set({ x, y });
  }

  onHeroMouseLeave(): void {
    this.heroMouseOffset.set({ x: 0, y: 0 });
  }

  onFooterMouseMove(e: MouseEvent): void {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    this.footerMouseOffset.set({ x, y });
  }

  onFooterMouseLeave(): void {
    this.footerMouseOffset.set({ x: 0, y: 0 });
  }

  // Hero dashboard methods
  selectThread(id: string): void {
    this.selectedThreadId.set(id);
  }

  selectProfileTab(tab: 'details' | 'tickets'): void {
    this.activeProfileTab.set(tab);
  }

  sendReply(event: Event): void {
    event.preventDefault();
    const text = this.replyInput().trim();
    if (!text) return;

    const id = this.currentThread().id;
    this.extraMessages.update(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), { text, time: 'Just now' }]
    }));
    this.replyInput.set('');
  }

  // Everything section methods
  selectEverythingTab(idx: number): void {
    this.activeTabIdx.set(idx);
  }

  // Integrations filter methods
  setIntegrationFilter(id: 'all' | IntegrationCategory): void {
    this.integrationFilter.set(id);
  }

  getFilterCount(id: 'all' | IntegrationCategory): number {
    if (id === 'all') return this.integrationsList.length;
    return this.integrationsList.filter(item => item.category === id).length;
  }

  // Pricing methods
  toggleYearly(): void {
    this.isYearly.update(v => !v);
  }

  // FAQ methods
  toggleFaq(idx: number): void {
    this.openFaqIndex.set(this.openFaqIndex() === idx ? null : idx);
  }

  // CTA Pre-footer methods
  setCtaTab(tab: 'voice' | 'email' | 'chat'): void {
    this.activeCtaTab.set(tab);
  }
}
