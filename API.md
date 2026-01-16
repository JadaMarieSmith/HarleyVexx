# HarleyVexx API Documentation

## Overview

The HarleyVexx Creator Platform provides a complete JavaScript SDK for managing artist data, royalties, collaborations, and legal verification through Base44.

**Base App ID:** `harley-vexx-4-creators101-copy-6aa0dc21`  
**API Base URL:** `https://harley-vexx-4-creators101-copy-6aa0dc21.base44.app`

---

## Authentication

### Artist Login

```javascript
import { loginArtist } from "./src/base44Client.js";

const user = await loginArtist("jada@harleyvexx.com", "harleyvexx2026");
// Returns: { id, name, email, verified, ... }
```

**Response Example:**
```json
{
  "id": "artist_123",
  "name": "Jada M. Smith",
  "email": "jada@harleyvexx.com",
  "artist": "HarleyVexx",
  "verified": true,
  "createdAt": "2026-01-16T00:00:00Z"
}
```

---

## Core Endpoints

### 1. Artist Catalog

#### List Public Releases

```javascript
import { getArtistCatalog } from "./src/base44Client.js";

const releases = await getArtistCatalog();
```

**Response Example:**
```json
[
  {
    "id": "track_001",
    "title": "New RnB Track",
    "genre": "RnB",
    "releaseDate": "2026-01-10",
    "streams": 45000,
    "platforms": {
      "soundCloud": "https://on.soundcloud.com/...",
      "spotify": "https://open.spotify.com/...",
      "appleMusic": "https://music.apple.com/..."
    }
  }
]
```

---

### 2. Royalties

#### Get Royalty Dashboard

```javascript
import { getArtistRoyalties } from "./src/base44Client.js";

const royalties = await getArtistRoyalties();
```

**Response Example:**
```json
{
  "totalStreams": 625000,
  "soundExchange": 4500,
  "spotifyMonthly": 2100,
  "appleMusic": 1800,
  "soundCloud": 625000,
  "totalEarnings": 8400,
  "orders": [
    {
      "platform": "SoundExchange",
      "amount": 4500,
      "date": "2026-01-15",
      "status": "completed"
    }
  ]
}
```

---

### 3. Collaborations

#### Post Lyricist Job

```javascript
import { hireLyricist } from "./src/base44Client.js";

const job = await hireLyricist({
  genre: "RnB, Spoken Word",
  position: "Lyricist Collaborator",
  requirements: "Self-taught preferred"
});
```

**Response Example:**
```json
{
  "id": "job_001",
  "artistName": "HarleyVexx",
  "position": "Lyricist Collaborator",
  "genre": "RnB, Spoken Word",
  "createdAt": "2026-01-16T12:00:00Z",
  "applicants": []
}
```

---

### 4. Legal & Verification

#### Get Ownership Statement

```javascript
import { OwnershipStatement } from "./src/ownership.js";

const ownership = new OwnershipStatement();
const statement = ownership.getOfficialStatement();
```

#### Verify Artist Identity

```javascript
const verification = ownership.verifyOwnership("harleyvexx2026");
```

**Response Example:**
```json
{
  "artist": "HarleyVexx",
  "verified": true,
  "token": "HARLEYVEXX_VERIFIED_...",
  "verifiedAt": "2026-01-16T12:00:00Z",
  "expiresAt": "2027-01-16T12:00:00Z"
}
```

#### Get PRO Registration Statement

```javascript
const proStatement = ownership.getProRegistrationStatement();
```

**Response Example:**
```json
{
  "artist": "HarleyVexx",
  "legalName": "Jada M. Smith",
  "statement": "...",
  "verifications": {
    "BMI": "✓ Eligible",
    "ASCAP": "✓ Eligible",
    "MLC": "✓ Eligible",
    "SoundExchange": "✓ Direct licensing registered"
  }
}
```

---

### 5. Analytics

#### Get Platform Metrics

```javascript
import { getAnalytics } from "./src/base44Client.js";

const analytics = await getAnalytics();
```

**Response Example:**
```json
{
  "period": "month",
  "streams": 625000,
  "newStreams": 45000,
  "listeners": 15000,
  "engagementRate": 0.08,
  "topTracks": [
    { "title": "...", "streams": 50000 }
  ]
}
```

---

### 6. Twitter/X Promotion

#### Create Release Announcement

```javascript
import { TwitterIntegration } from "./src/twitter.js";

const twitter = new TwitterIntegration();
await twitter.promoteRelease("New RnB Track", { genre: "RnB" });
```

**Response Example:**
```json
{
  "id": "tweet_001",
  "text": "🎵 NEW DROP: New RnB Track...",
  "status": "posted",
  "timestamp": "2026-01-16T12:00:00Z",
  "engagement": {
    "likes": 0,
    "retweets": 0,
    "replies": 0
  }
}
```

#### Announce Stream Milestone

```javascript
await twitter.announceStreamMilestone(625000);
```

---

## Base44 Entities

### Products
Music releases and catalog items

```javascript
base44.entities.Products.list()
base44.entities.Products.create({ title, genre, releaseDate, streams })
base44.entities.Products.get(id)
```

### Orders
Royalties, payments, and orders

```javascript
base44.entities.Orders.list()
base44.entities.Orders.get(id)
```

### Lyricists
Collaborators and job applicants

```javascript
base44.entities.Lyricists.list()
base44.entities.Lyricists.create(jobData)
base44.entities.Lyricists.update(id, data)
```

### Pages
Legal documents and info pages

```javascript
base44.entities.Pages.create({ title, content, slug, isPublic })
base44.entities.Pages.list()
```

---

## Error Handling

All API calls return errors with standard format:

```javascript
try {
  const catalog = await getArtistCatalog();
} catch (error) {
  console.error(error.message);
  // "✗ Error loading catalog: [error details]"
}
```

**Common Errors:**
- `Authentication Required` - Must login first
- `Invalid Credentials` - Wrong email/password
- `Unauthorized` - Missing required permissions
- `Not Found` - Resource doesn't exist

---

## Rate Limiting

- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- Bulk operations: 10 requests/second

---

## Configuration

Access app configuration:

```javascript
import config from "./src/config.js";

console.log(config.artist.name);        // "HarleyVexx"
console.log(config.analytics.streams);  // 625000
console.log(config.base44.appId);       // "harley-vexx-4-creators101-copy-6aa0dc21"
```

---

## Integrations

### SoundExchange

```javascript
const soundExchangeData = {
  performer: "Jada M. Smith",
  stageName: "HarleyVexx",
  owner: true,
  accountStatus: "Active",
  directDeposit: {
    bank: "JPMorgan Chase",
    enabled: true
  }
};
```

### Twitter/X API v2

Requires elevated access. Environment variables:
```env
TWITTER_BEARER_TOKEN=...
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
```

### Stripe Payments

For fan subscriptions and merch:
```env
STRIPE_PUBLIC_KEY=...
STRIPE_SECRET_KEY=...
```

---

## Examples

### Complete Dashboard Flow

```javascript
import { ArtistDashboard } from "./src/dashboard.js";

const dashboard = new ArtistDashboard();

// 1. Initialize (load public data)
await dashboard.init();

// 2. Login
await dashboard.login("harleyvexx2026");

// 3. Show royalties
await dashboard.showRoyalties();

// 4. Post lyricist job
await dashboard.postLyricistJob();

// 5. Publish legal statement
await dashboard.publishLegalStatement();
```

### Promote New Release

```javascript
import { TwitterIntegration } from "./src/twitter.js";

const twitter = new TwitterIntegration({
  bearerToken: process.env.TWITTER_BEARER_TOKEN
});

const release = {
  trackName: "Midnight Dreams",
  genre: "RnB",
  emoji: "🌙"
};

await twitter.promoteRelease(release.trackName, release);
```

---

## Webhooks (Future)

Subscribe to events:
- `release.created` - New track published
- `order.completed` - Royalty payment processed
- `collaboration.accepted` - Lyricist hired
- `milestone.reached` - Stream milestone

---

## Support

**Documentation:** [README.md](./README.md)  
**GitHub:** [HarleyVexx](https://github.com/JadaMarieSmith/HarleyVexx)  
**Contact:** jada@harleyvexx.com  
**SoundCloud:** https://on.soundcloud.com/9BWtqT2nIcIiAubq3X

---

*API Documentation v1.0 | Last Updated: January 16, 2026*
