export interface StoryItem {
  id: string;
  title: string;
  teaser: string;
  photographer: string;
  tag: string;
  exif: string;
  image: string;
  aspect?: string;
  storyBody?: string;
  plateLabel?: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  target: string;
}

export interface LogoPlacements {
  header: boolean;
  hero: boolean;
  footer: boolean;
}

export interface LogoConfig {
  prefix: string;
  suffix: string;
  subtitle: string;
  showPillars: boolean;
  customImageUrl?: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  placements?: LogoPlacements;
}

export interface MagazineData {
  siteInfo: {
    magazineName: string;
    issueNumber: string;
    theme: string;
    publishedFrequency: string;
    instagramHandle: string;
    instagramUrl: string;
    email: string;
    headerCtaText?: string;
    navLinks?: NavLinkItem[];
    logo: LogoConfig;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    excerpt: string;
    curators: string;
    curatorsPrefix?: string;
    details: string;
    coverImage: string;
    ctaFlipbookText?: string;
    ctaStoriesText?: string;
  };
  quote: {
    categoryTag?: string;
    text: string;
    author: string;
    citation: string;
  };
  foundersStory: {
    tag: string;
    title: string;
    subtitle: string;
    p1: string;
    p2: string;
    p3: string;
    curatorsSectionTag?: string;
    curatorsSectionTitle?: string;
    founder1Name: string;
    founder1Role: string;
    founder1Tag?: string;
    founder1Bio?: string;
    founder2Name: string;
    founder2Role: string;
    founder2Tag?: string;
    founder2Bio?: string;
    noteSignoff: string;
    foundedLabel?: string;
    foundedValue?: string;
    mediumLabel?: string;
    mediumValue?: string;
  };
  featuredSection?: {
    tag: string;
    title: string;
    description: string;
    platesCountSuffix?: string;
  };
  stories: StoryItem[];
  flipbook: {
    tag?: string;
    title: string;
    subtitle: string;
    description: string;
    embedUrl: string;
    heyzineUrl?: string;
    buttonText?: string;
    badgeText?: string;
    metaDetails?: string;
    totalPages: number;
    colophon?: string;
  };
  issue02: {
    badge: string;
    title: string;
    description: string;
    pollPrompt?: string;
    targetWord: string;
    clue?: string;
    revealedIndices?: number[];
    successMessage?: string;
    options?: string[];
  };
  submission: {
    tag: string;
    title: string;
    subtitle: string;
    guidelinesTitle?: string;
    guidelines: string;
    directInquiryPrefix?: string;
    instagramPrefix?: string;
  };
  footer: {
    newsletterTitle: string;
    newsletterDesc: string;
    directoryHeading?: string;
    connectHeading?: string;
    returnToTopText?: string;
    footerTagline?: string;
    address: string;
    editorialManifesto: string;
    copyright: string;
  };
}
