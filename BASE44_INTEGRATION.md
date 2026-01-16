# HarleyVexx - Complete Base44 Integration Guide

## Overview

This guide shows how to use the HarleyVexx Creator Platform with Base44 SDK to manage your artist catalog, royalties, and collaborations.

---

## Quick Start

### 1. Initialize the Client

```javascript
import { createClient } from "./src/base44SDK.js";

const base44 = createClient({
  appId: "harley-vexx-4-creators101-copy-6aa0dc21",
  domain: "base44.app"
});
```

### 2. Authenticate

```javascript
// Login with email/password
await base44.auth.loginViaEmailPassword(
  "jada@harleyvexx.com",
  "harleyvexx2026"
);

// Get current user
const user = await base44.auth.getCurrentUser();
console.log(user);
// Output: { id, email, name, artist, verified, roles }
```

### 3. Access Your Data

```javascript
// List all your releases (public - no auth required)
const catalog = await base44.entities.Products.list();
console.log(`${catalog.length} tracks in catalog`);

// List your royalties (private - auth required)
const royalties = await base44.entities.Orders.list();
console.log(`Total royalties: $${royalties.reduce((s, r) => s + r.amount, 0)}`);
```

---

## Entity Management

### Products (Music Releases)

#### List All Products

```javascript
const products = await base44.entities.Products.list({
  genre: "RnB",
  sortBy: "releaseDate",
  limit: 10
});
```

#### Get Single Product

```javascript
const track = await base44.entities.Products.get("prod_001");
console.log(track.title, track.streams);
```

#### Create New Release

```javascript
const newTrack = await base44.entities.Products.create({
  title: "New Song Title",
  genre: "RnB",
  releaseDate: "2026-01-20",
  streams: 0,
  platforms: {
    soundCloud: "https://on.soundcloud.com/...",
    spotify: "https://open.spotify.com/..."
  },
  duration: 180, // seconds
  description: "Track description"
});

console.log(`Created: ${newTrack.title}`);
```

#### Update Existing Product

```javascript
await base44.entities.Products.update("prod_001", {
  streams: 50000,
  title: "Updated Title"
});
```

#### Delete Product

```javascript
await base44.entities.Products.delete("prod_001");
```

---

### Orders (Royalties & Revenue)

#### List All Royalties

```javascript
const orders = await base44.entities.Orders.list();

orders.forEach(order => {
  console.log(`${order.platform}: $${order.amount} (${order.date})`);
});
```

#### Track Earnings by Platform

```javascript
const royalties = await base44.entities.Orders.list();

const byPlatform = royalties.reduce((acc, order) => {
  acc[order.platform] = (acc[order.platform] || 0) + order.amount;
  return acc;
}, {});

console.log("Earnings by Platform:", byPlatform);
// Output:
// {
//   SoundExchange: 4500,
//   Spotify: 2100,
//   Apple Music: 1800
// }
```

#### Create Manual Order Entry

```javascript
await base44.entities.Orders.create({
  platform: "Direct License",
  amount: 500,
  date: "2026-01-16",
  status: "pending",
  description: "TV sync license"
});
```

---

### Lyricists (Collaboration)

#### Post Hiring Job

```javascript
const job = await base44.entities.Lyricists.create({
  artistName: "HarleyVexx",
  jobTitle: "Poetic RnB Lyricist Collaboration",
  genre: "RnB, Spoken Word",
  description: `Independent artist HarleyVexx seeks talented lyricists for 
    collaborative projects. You retain 100% of your rights.`,
  budget: "Negotiable",
  deadline: "2026-02-28",
  applicants: []
});

console.log(`Job posted: ${job.id}`);
```

#### Update Job Status

```javascript
await base44.entities.Lyricists.update(lyricistJobId, {
  status: "closed",
  selectedApplicant: applicantId
});
```

#### List Collaboration Opportunities

```javascript
const jobs = await base44.entities.Lyricists.list();
jobs.forEach(job => {
  console.log(`${job.jobTitle} - ${job.applicants.length} applications`);
});
```

---

### Pages (Legal Documents)

#### Create Ownership Statement Page

```javascript
import ownershipDocuments from "./src/ownershipStatement.js";

const page = await base44.entities.Pages.create({
  title: "Ownership & Legal",
  slug: "ownership-legal",
  content: ownershipDocuments.officialStatement,
  isPublic: true,
  metadata: {
    category: "legal",
    version: "1.0"
  }
});

console.log(`Published: ${page.url}`);
```

#### Get Published Page

```javascript
const legalPage = await base44.entities.Pages.get("ownership-legal");
console.log(legalPage.content);
```

---

## Analytics

### Get Platform Metrics

```javascript
const metrics = await base44.analytics.getMetrics({
  period: "month" // "day", "week", "month", "year"
});

console.log(`
  Streams: ${metrics.streams}
  Listeners: ${metrics.listeners}
  Engagement: ${(metrics.engagementRate * 100).toFixed(1)}%
  Top Track: ${metrics.topTracks[0].title}
`);
```

### Get Stream Data

```javascript
const streams = await base44.analytics.getStreams("month");

console.log(`
  Total: ${streams.total}
  SoundCloud: ${streams.soundCloud}
  Spotify: ${streams.spotify}
  Apple Music: ${streams.appleMusic}
`);
```

### Get Royalty Data

```javascript
const royalties = await base44.analytics.getRoyalties("month");

console.log(`
  SoundExchange: $${royalties.soundExchange}
  Spotify: $${royalties.spotify}
  Apple Music: $${royalties.appleMusic}
  Total: $${royalties.total}
`);
```

---

## Authentication

### Email/Password Login

```javascript
const result = await base44.auth.loginViaEmailPassword(
  "jada@harleyvexx.com",
  "harleyvexx2026"
);

if (result.success) {
  localStorage.setItem("authToken", result.token);
  console.log("Logged in as:", result.user.name);
}
```

### Get OAuth URL (Google)

```javascript
// Frontend
const response = await fetch("/api/auth/google/url");
const { url, state } = await response.json();

localStorage.setItem("oauth_state", state);
window.location.href = url;
```

### Handle OAuth Callback

```javascript
// After Google redirects with code
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const state = localStorage.getItem("oauth_state");

const response = await fetch("/api/auth/google", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code, state })
});

const result = await response.json();
if (result.success) {
  localStorage.setItem("authToken", result.token);
}
```

### Register New User

```javascript
const result = await base44.auth.register(
  "newuser@email.com",
  "password123",
  "User Name"
);

if (result.success) {
  console.log("Account created:", result.userId);
}
```

### Logout

```javascript
await base44.auth.logout();
localStorage.removeItem("authToken");
```

---

## Complete Dashboard Example

```javascript
import { createClient } from "./src/base44SDK.js";

async function displayDashboard() {
  // Initialize
  const base44 = createClient({
    appId: "harley-vexx-4-creators101-copy-6aa0dc21",
    domain: "base44.app"
  });

  // Login
  await base44.auth.loginViaEmailPassword(
    "jada@harleyvexx.com",
    "harleyvexx2026"
  );

  // Get catalog
  const products = await base44.entities.Products.list();
  console.log(`📀 Catalog: ${products.length} tracks`);

  // Get royalties
  const orders = await base44.entities.Orders.list();
  const totalEarnings = orders.reduce((s, o) => s + o.amount, 0);
  console.log(`💰 Royalties: $${totalEarnings}`);

  // Get metrics
  const metrics = await base44.analytics.getMetrics({ period: "month" });
  console.log(`📊 Streams: ${metrics.streams}`);

  // Get jobs
  const jobs = await base44.entities.Lyricists.list();
  console.log(`🎤 Active Jobs: ${jobs.length}`);

  console.log(`
    🎵 HarleyVexx Dashboard
    Catalog: ${products.length} tracks
    Earnings: $${totalEarnings}
    Streams: ${metrics.streams}
    Collaborations: ${jobs.length}
  `);
}

await displayDashboard();
```

---

## Error Handling

```javascript
try {
  const products = await base44.entities.Products.list();
} catch (error) {
  if (error.message.includes("401")) {
    console.error("Authentication required");
    // Redirect to login
  } else if (error.message.includes("404")) {
    console.error("Resource not found");
  } else {
    console.error("API Error:", error.message);
  }
}
```

---

## Token Management

```javascript
// Store token after login
const loginResult = await base44.auth.loginViaEmailPassword(email, password);
localStorage.setItem("authToken", loginResult.token);

// Restore token on page load
const token = localStorage.getItem("authToken");
if (token) {
  base44.setToken(token);
  const user = await base44.auth.getCurrentUser();
  console.log("Restored session:", user.name);
}

// Clear token on logout
localStorage.removeItem("authToken");
```

---

## Environment Setup

Create `.env` file:

```env
BASE44_APP_ID=harley-vexx-4-creators101-copy-6aa0dc21
BASE44_DOMAIN=base44.app

ARTIST_EMAIL=jada@harleyvexx.com
ARTIST_PASSWORD=harleyvexx2026

# Server
PORT=3000
CORS_ORIGIN=http://localhost:5173

# JWT
JWT_SECRET=your_secret_key
```

---

## Production Checklist

- [ ] Update Base44 app ID from production URL
- [ ] Configure CORS for your domain
- [ ] Set JWT_SECRET to a secure random string
- [ ] Enable HTTPS/SSL
- [ ] Configure Google OAuth credentials
- [ ] Test all entity operations
- [ ] Verify authentication flow
- [ ] Monitor API error logs
- [ ] Set up database backup
- [ ] Document custom entities

---

## Support

**API Docs:** See [API.md](./API.md)  
**Config:** See [.env.example](./.env.example)  
**Auth Module:** [src/auth.js](./src/auth.js)  
**Ownership:** [src/ownershipStatement.js](./src/ownershipStatement.js)  
**Backend:** [src/server.js](./src/server.js)

---

*HarleyVexx Creator Platform v1.0 | Complete Base44 Integration Guide*
