# HarleyVexx Creator Platform

## 🎵 Artist Dashboard & Royalty Tracking

A complete Base44-powered creator platform for **HarleyVexx** (Jada M. Smith) featuring artist catalog management, royalty tracking, lyricist hiring, and verified ownership verification.

**Live App:** https://harley-vexx-4-creators101-copy-6aa0dc21.base44.app

---

## 📋 Features

### 1. **Artist Catalog** (Public)
- Display music releases and portfolio
- Stream counts and engagement metrics
- SoundCloud integration (625K+ streams)
- Genre tagging and release dates

### 2. **Royalty Dashboard** (Private - Auth Required)
- SoundExchange direct licensing
- Spotify & Apple Music monthly earnings
- Total streams and revenue tracking
- Monthly earnings summary

### 3. **Lyricist Hiring**
- Post collaboration opportunities
- Manage applicants and portfolios
- 100% rights retention for contributors
- Collaborative project tracking

### 4. **Ownership Verification**
- Official legal statement (PRO-eligible)
- eSignature integration
- BMI/ASCAP/MLC registration support
- SoundExchange verification

### 5. **Analytics & Insights**
- Monthly metrics and trends
- Engagement tracking
- Platform-specific analytics
- Growth projections

### 6. **Twitter/X Integration**
- Automated promotion posts
- Release announcements
- Stream milestone announcements
- Lyricist job promotions

---

## 🔐 Artist Identity

**Artist Name:** HarleyVexx  
**Legal Name:** Jada M. Smith  
**Alternate Names:** Jada Marie Smith  
**Location:** North Carolina, USA  
**Ownership:** 100% - No third-party claims  

**Verified Stats:**
- 625,000+ SoundCloud streams
- 550+ tracks released
- Self-taught producer
- Independent artist (unsigned)

**Primary Platform:** [SoundCloud](https://on.soundcloud.com/9BWtqT2nIcIiAubq3X)

---

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file:

```env
# Base44 Configuration
BASE44_APP_ID=harley-vexx-4-creators101-copy-6aa0dc21
BASE44_DOMAIN=base44.app

# Artist Authentication
ARTIST_EMAIL=jada@harleyvexx.com
ARTIST_PASSWORD=harleyvexx2026

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Google OAuth (Optional - for production)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/callback

# Twitter API v2 (Optional - for promotion features)
TWITTER_BEARER_TOKEN=your_bearer_token
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
```

### Development

```bash
npm run dev
```

Starts Vite dev server at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication

### Login Methods

**1. Email/Password (Default)**
```
Email: jada@harleyvexx.com
Password: harleyvexx2026
```

**2. Google OAuth (In Dashboard)**
- Click "Login with Google"
- Authorize access to profile and YouTube data
- Token automatically saved to browser localStorage

### Authentication Flow

1. User clicks "Login" or "Sign Up"
2. Modal opens with email/password or Google OAuth options
3. Credentials verified server-side
4. JWT token generated and stored in localStorage
5. User info displayed in dashboard header
6. Logout clears token and session

### JWT Token Management

Tokens include:
- Artist ID
- Email
- Artist name (HarleyVexx)
- User roles
- Expiration (7 days)

---

## 📁 Project Structure

```
src/
├── index.js              # Main entry point
├── config.js             # Configuration & metadata
├── base44Client.js       # Base44 SDK setup & core functions
├── dashboard.js          # Artist dashboard implementation
├── ownership.js          # Legal statements & verification
├── twitter.js            # Twitter/X integration & promotion
├── auth.js               # OAuth & JWT authentication
```

---

## 💻 Usage Examples

### Load Public Catalog

```javascript
import { getArtistCatalog } from "./src/base44Client.js";

const catalog = await getArtistCatalog();
console.log(`${catalog.length} tracks loaded`);
```

### View Royalty Dashboard

```javascript
import { ArtistDashboard } from "./src/dashboard.js";

const dashboard = new ArtistDashboard();
await dashboard.login("harleyvexx2026");
await dashboard.showRoyalties();
```

### Publish Ownership Statement

```javascript
import { OwnershipStatement } from "./src/ownership.js";

const ownership = new OwnershipStatement();
const statement = ownership.getOfficialStatement();
console.log(statement);
```

### Promote on Twitter/X

```javascript
import { TwitterIntegration } from "./src/twitter.js";

const twitter = new TwitterIntegration();
await twitter.promoteRelease("New RnB Track", { genre: "RnB" });
```

---

## 🔗 Integrations

### Base44
- Artist catalog management
- Royalty order tracking
- Lyricist collaboration platform
- Page hosting (legal documents)

### SoundExchange
- Direct licensing verification
- Royalty collection & payouts
- Performer & recording owner registration
- Digital performance royalties

### Twitter/X API v2
- Release announcements
- Stream milestone posts
- Engagement tracking
- Fan interaction

### Payment Processing
- JPMorgan Chase Direct Deposit
- Stripe (for fan subscriptions)
- Base44 Payments integration

---

## 📊 Revenue Model

| Source | Monthly | Annual |
|--------|---------|--------|
| SoundExchange | $4,500 | $54,000 |
| Spotify | $2,100 | $25,200 |
| Apple Music | $1,800 | $21,600 |
| SoundCloud | Variable | - |
| **Total Monthly** | **~$8,400** | **~$100,800** |

*(Based on current 625K+ stream count)*

---

## 🎤 Lyricist Collaboration

Looking for co-writers? Post opportunities directly in the app:

**Requirements:**
- Creative & self-taught preferred
- Poetic/RnB/Spoken word specialization
- Portfolio samples

**Benefits:**
- 100% rights retention by collaborators
- Exposure to 625K+ listener base
- Professional collaboration experience
- Potential ongoing work

---

## ⚖️ Legal & Ownership

### Official Statement

**VERIFIED:** Jada M. Smith is the sole 100% owner of all HarleyVexx works, compositions, and sound recordings. No third parties, labels, or administrators have any claims on these works.

**Eligible for:**
- ✓ BMI/ASCAP PRO Registration
- ✓ SoundExchange Direct Licensing
- ✓ MLC Mechanical Licensing
- ✓ Global Distribution Rights

**Signed:** January 16, 2026

---

## 🔒 Security

- Artist authentication (email/password)
- Role-based access (public/private)
- Ownership verification tokens
- eSignature support for legal documents
- JPMorgan Chase DSA compliance

---

## � Configuration Reference

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secret_key` |
| `GOOGLE_CLIENT_ID` | Google OAuth app ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | From Google Console |
| `TWITTER_BEARER_TOKEN` | Twitter API authentication | From Developer Portal |

### Deployment Checklist

- [ ] Update `.env` with production keys
- [ ] Run `npm run build`
- [ ] Configure CORS for your domain
- [ ] Set up SSL/HTTPS
- [ ] Configure OAuth redirect URLs
- [ ] Test all authentication flows
- [ ] Deploy to hosting platform
- [ ] Verify token validation

---

## 🐛 Troubleshooting

**OAuth State Not Valid Error**
- Clear browser cache/localStorage
- Verify redirect URI matches OAuth config
- Check state parameter generation

**Login Always Fails**
- Ensure JWT_SECRET is set
- Verify email/password are correct
- Check browser localStorage is enabled

**Dashboard Not Loading**
- Verify Base44 app ID is correct
- Check network requests in DevTools
- Ensure CORS headers are set

---

## 📞 Support & Contact

**Artist Email:** jada@harleyvexx.com  
**SoundCloud:** https://on.soundcloud.com/9BWtqT2nIcIiAubq3X  
**App URL:** https://harley-vexx-4-creators101-copy-6aa0dc21.base44.app  
**GitHub:** https://github.com/JadaMarieSmith/HarleyVexx  

---

## 📄 License

MIT License - See LICENSE.md for details

---

## 🎯 Next Steps

1. **Deploy App** → Base44 dashboard → Publish → Live
2. **Add Sample Data** → Import top 5 tracks
3. **Test Authentication** → Artist login with credentials
4. **Configure Integrations:**
   - SoundExchange API keys
   - Twitter API v2 credentials
   - Stripe payment gateway
5. **Launch Features:**
   - Royalty calculator
   - Lyricist hiring page
   - Fan subscription tier
   - Merch integration

---

**Made for independent artists with 100% creative control. 🎵**

*HarleyVexx - 625K+ Streams & Growing*
