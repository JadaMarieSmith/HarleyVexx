/**
 * HarleyVexx Configuration
 * Environment variables and app settings
 */

export const config = {
  // Base44 Configuration
  base44: {
    appId: "harley-vexx-4-creators101-copy-6aa0dc21",
    domain: "base44.app",
    fullUrl: "https://harley-vexx-4-creators101-copy-6aa0dc21.base44.app",
  },

  // Artist Information
  artist: {
    name: "HarleyVexx",
    legalName: "Jada M. Smith",
    alternateNames: ["Jada Marie Smith"],
    email: "jada@harleyvexx.com",
    location: "North Carolina, USA",
    bio: "Independent Artist | Self-Taught Producer | 625K+ Streams | 100% Rights Owner",
  },

  // Stream & Revenue Data
  analytics: {
    totalStreams: 625000,
    soundCloudStreams: 625000,
    spotifyMonthly: 2100,
    appleMusicMonthly: 1800,
    soundExchangeRoyalty: 4500,
    totalEarnings: 8400,
    tracksReleased: 550,
  },

  // Platform Links
  platforms: {
    soundCloud: "https://on.soundcloud.com/9BWtqT2nIcIiAubq3X",
    twitter: "https://twitter.com/harleyvexx", // Update with actual handle
    instagram: "", // Add if available
    spotify: "", // Add if available
  },

  // Features
  features: {
    artistCatalog: true,
    royaltyDashboard: true,
    lyricistHiring: true,
    ownershipVerification: true,
    analyticsTracking: true,
    fanEngagement: true,
    merch: false,
    subscriptions: false,
  },

  // Integrations
  integrations: {
    soundExchange: {
      enabled: true,
      status: "Direct Licensed",
      accountStatus: "Active",
    },
    spotify: {
      enabled: true,
      status: "Verified",
    },
    appleMusic: {
      enabled: true,
      status: "Verified",
    },
    twitter: {
      enabled: true,
      apiVersion: "v2",
      accessLevel: "Elevated",
    },
    base44: {
      enabled: true,
      functions: "artistDashboard",
    },
  },

  // Security & Verification
  security: {
    ownershipVerified: true,
    artistAuthority: "100%",
    thirdPartyClaims: "None",
    proRegistrationEligible: true,
  },

  // Monetization Settings
  monetization: {
    directDeposit: {
      bank: "JPMorgan Chase",
      enabled: true,
    },
    royaltyCollection: {
      soundExchange: true,
      spotifyDirects: false,
      appleDirects: false,
    },
    pricing: {
      licensingRate: "Contact artist",
      collaborationFee: "Negotiable",
    },
  },

  // App Entities (Base44)
  entities: {
    Products: {
      name: "Music Releases",
      fields: ["title", "genre", "releaseDate", "streams", "link"],
    },
    Orders: {
      name: "Royalties & Orders",
      fields: ["platform", "amount", "date", "status"],
    },
    Lyricists: {
      name: "Collaborators",
      fields: ["name", "specialization", "portfolio", "rates"],
    },
    Pages: {
      name: "Legal & Info",
      fields: ["title", "content", "slug", "isPublic"],
    },
  },

  // Metadata
  meta: {
    version: "1.0.0",
    lastUpdated: "2026-01-16",
    owner: "Jada M. Smith",
    license: "MIT",
  },
};

// Export configuration
export default config;
