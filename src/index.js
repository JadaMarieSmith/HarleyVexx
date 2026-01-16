/**
 * HarleyVexx Index
 * Main entry point for the creator platform
 */

import { ArtistDashboard } from "./dashboard.js";
import { OwnershipStatement } from "./ownership.js";
import { TwitterIntegration } from "./twitter.js";
import config from "./config.js";

console.log(`
╔════════════════════════════════════════════════════════════════╗
║          🎵 HARLEYVEXX CREATOR PLATFORM 🎵                      ║
║       Base44 Artist Dashboard & Royalty Tracking               ║
╚════════════════════════════════════════════════════════════════╝
`);

// Initialize modules
const dashboard = new ArtistDashboard();
const ownership = new OwnershipStatement();
const twitter = new TwitterIntegration();

// Display configuration
console.log("📊 Configuration Loaded:");
console.log(`   Artist: ${config.artist.name} (${config.artist.legalName})`);
console.log(`   Streams: ${config.analytics.totalStreams.toLocaleString()}+`);
console.log(`   Base44 App: ${config.base44.appId}`);
console.log(`   Primary Platform: SoundCloud (${config.analytics.soundCloudStreams.toLocaleString()} streams)\n`);

// Export all modules
export {
  ArtistDashboard,
  OwnershipStatement,
  TwitterIntegration,
  config,
  dashboard,
  ownership,
  twitter,
};

// Quick start instructions
console.log("🚀 Quick Start:");
console.log("   1. Import dashboard: import { ArtistDashboard } from './dashboard.js'");
console.log("   2. Initialize: const dashboard = new ArtistDashboard()");
console.log("   3. Load catalog: await dashboard.init()");
console.log("   4. Login: await dashboard.login('password')");
console.log("   5. View royalties: await dashboard.showRoyalties()\n");

console.log("✓ Platform ready for deployment!\n");
