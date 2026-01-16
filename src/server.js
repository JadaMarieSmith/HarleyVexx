/**
 * HarleyVexx Backend Server
 * Express API for Base44 integration, authentication, and entity management
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AuthManager } from "./auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const authManager = new AuthManager();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing authentication token" });
  }

  const verification = authManager.verifyToken(token);
  if (!verification.valid) {
    return res.status(401).json({ error: verification.error });
  }

  req.user = verification.user;
  next();
};

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * POST /api/auth/login - Email/password login
 */
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const result = await authManager.loginWithEmail(email, password);

  if (!result.success) {
    return res.status(result.status || 400).json({ error: result.error });
  }

  res.json(result);
});

/**
 * POST /api/auth/register - Create new user
 */
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: "Email, password, and name required" });
  }

  const result = await authManager.registerUser(email, password, name);

  if (!result.success) {
    return res.status(result.status || 400).json({ error: result.error });
  }

  res.json(result);
});

/**
 * GET /api/auth/me - Get current user
 */
app.get("/api/auth/me", requireAuth, (req, res) => {
  const result = authManager.getCurrentUser(req.headers.authorization.split(" ")[1]);

  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }

  res.json(result.user);
});

/**
 * POST /api/auth/logout - Logout
 */
app.post("/api/auth/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    authManager.logout(token);
  }
  res.json({ success: true });
});

/**
 * POST /api/auth/google - Google OAuth callback
 */
app.post("/api/auth/google", async (req, res) => {
  const { code, state } = req.body;

  const stateValid = authManager.verifyOAuthState(state);
  if (!stateValid.valid) {
    return res.status(400).json({ error: stateValid.error });
  }

  // In production: exchange code for Google tokens
  // For now, return mock success
  res.json({
    success: true,
    message: "OAuth state validated successfully",
    nextStep: "Exchange authorization code with Google",
  });
});

/**
 * GET /api/auth/google/url - Get Google OAuth URL
 */
app.get("/api/auth/google/url", (req, res) => {
  const { url, state } = authManager.getGoogleOAuthUrl(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_REDIRECT_URI
  );

  res.json({ url, state });
});

// ============================================================================
// ENTITY ENDPOINTS - PRODUCTS
// ============================================================================

// In-memory storage for demo
const database = {
  products: [
    {
      id: "prod_001",
      title: "Midnight Dreams",
      genre: "RnB",
      releaseDate: "2026-01-10",
      streams: 45000,
      platforms: {
        soundCloud: "https://on.soundcloud.com/...",
      },
    },
  ],
  orders: [
    {
      id: "order_001",
      platform: "SoundExchange",
      amount: 4500,
      date: "2026-01-15",
      status: "completed",
    },
  ],
  lyricists: [],
  pages: [
    {
      id: "page_001",
      title: "Ownership & Legal",
      slug: "ownership-legal",
      content: "...",
      isPublic: true,
    },
  ],
};

/**
 * POST /api/entities/Products/list - List products
 */
app.post("/api/entities/Products/list", (req, res) => {
  res.json(database.products);
});

/**
 * GET /api/entities/Products/:id - Get product by ID
 */
app.get("/api/entities/Products/:id", (req, res) => {
  const product = database.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

/**
 * POST /api/entities/Products - Create product
 */
app.post("/api/entities/Products", requireAuth, (req, res) => {
  const product = {
    id: `prod_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  database.products.push(product);
  res.status(201).json(product);
});

/**
 * PUT /api/entities/Products/:id - Update product
 */
app.put("/api/entities/Products/:id", requireAuth, (req, res) => {
  const product = database.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  Object.assign(product, req.body);
  res.json(product);
});

/**
 * DELETE /api/entities/Products/:id - Delete product
 */
app.delete("/api/entities/Products/:id", requireAuth, (req, res) => {
  const index = database.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  database.products.splice(index, 1);
  res.json({ success: true });
});

// ============================================================================
// ENTITY ENDPOINTS - ORDERS (Royalties)
// ============================================================================

/**
 * POST /api/entities/Orders/list - List orders (private)
 */
app.post("/api/entities/Orders/list", requireAuth, (req, res) => {
  res.json(database.orders);
});

/**
 * GET /api/entities/Orders/:id - Get order by ID
 */
app.get("/api/entities/Orders/:id", requireAuth, (req, res) => {
  const order = database.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

/**
 * POST /api/entities/Orders - Create order
 */
app.post("/api/entities/Orders", requireAuth, (req, res) => {
  const order = {
    id: `order_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  database.orders.push(order);
  res.status(201).json(order);
});

// ============================================================================
// ENTITY ENDPOINTS - LYRICISTS
// ============================================================================

/**
 * POST /api/entities/Lyricists/list - List lyricist jobs
 */
app.post("/api/entities/Lyricists/list", (req, res) => {
  res.json(database.lyricists);
});

/**
 * POST /api/entities/Lyricists - Create lyricist job
 */
app.post("/api/entities/Lyricists", requireAuth, (req, res) => {
  const lyricist = {
    id: `lyricist_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    applicants: [],
  };

  database.lyricists.push(lyricist);
  res.status(201).json(lyricist);
});

// ============================================================================
// ENTITY ENDPOINTS - PAGES
// ============================================================================

/**
 * POST /api/entities/Pages - Create page
 */
app.post("/api/entities/Pages", requireAuth, (req, res) => {
  const page = {
    id: `page_${Date.now()}`,
    url: `/pages/${req.body.slug}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  database.pages.push(page);
  res.status(201).json(page);
});

/**
 * GET /api/entities/Pages/:slug - Get page by slug
 */
app.get("/api/entities/Pages/:slug", (req, res) => {
  const page = database.pages.find((p) => p.slug === req.params.slug);
  if (!page) {
    return res.status(404).json({ error: "Page not found" });
  }
  res.json(page);
});

/**
 * POST /api/entities/Pages/list - List pages
 */
app.post("/api/entities/Pages/list", (req, res) => {
  const pages = database.pages.filter((p) => p.isPublic);
  res.json(pages);
});

// ============================================================================
// ANALYTICS ENDPOINTS
// ============================================================================

/**
 * POST /api/analytics/metrics - Get analytics metrics
 */
app.post("/api/analytics/metrics", (req, res) => {
  res.json({
    period: req.body.period || "month",
    streams: 625000,
    newStreams: 45000,
    listeners: 15000,
    engagementRate: 0.08,
    topTracks: [{ title: "Midnight Dreams", streams: 50000 }],
  });
});

/**
 * GET /api/analytics/streams - Get stream data
 */
app.get("/api/analytics/streams", (req, res) => {
  res.json({
    period: req.query.period || "month",
    total: 625000,
    soundCloud: 625000,
    spotify: 0,
    appleMusic: 0,
  });
});

/**
 * GET /api/analytics/royalties - Get royalty data
 */
app.get("/api/analytics/royalties", (req, res) => {
  res.json({
    period: req.query.period || "month",
    soundExchange: 4500,
    spotify: 2100,
    appleMusic: 1800,
    total: 8400,
  });
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "HarleyVexx Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║          🎵 HarleyVexx Backend Server 🎵                        ║
║                     v1.0.0                                      ║
╚════════════════════════════════════════════════════════════════╝

✓ Server running at http://localhost:${port}
✓ API Base: http://localhost:${port}/api
✓ Health Check: http://localhost:${port}/api/health

Endpoints:
  AUTH:
    POST   /api/auth/login              - Email/password login
    POST   /api/auth/register           - Create account
    GET    /api/auth/me                 - Get current user
    GET    /api/auth/google/url         - Get Google OAuth URL

  PRODUCTS:
    POST   /api/entities/Products/list  - List all products
    POST   /api/entities/Products       - Create product
    GET    /api/entities/Products/:id   - Get product
    PUT    /api/entities/Products/:id   - Update product
    DELETE /api/entities/Products/:id   - Delete product

  ORDERS (Royalties):
    POST   /api/entities/Orders/list    - List orders
    POST   /api/entities/Orders         - Create order
    GET    /api/entities/Orders/:id     - Get order

  LYRICISTS:
    POST   /api/entities/Lyricists/list - List lyricists
    POST   /api/entities/Lyricists      - Create lyricist job

  PAGES:
    POST   /api/entities/Pages          - Create page
    GET    /api/entities/Pages/:slug    - Get page

  ANALYTICS:
    POST   /api/analytics/metrics       - Get metrics
    GET    /api/analytics/streams       - Get stream data
    GET    /api/analytics/royalties     - Get royalty data

Default Test Credentials:
  Email: jada@harleyvexx.com
  Password: harleyvexx2026

Ready for Base44 integration! 🚀
  `);
});

export default app;
