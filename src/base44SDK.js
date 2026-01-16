/**
 * HarleyVexx Base44 SDK Mock
 * Production-ready implementation matching Base44 API patterns
 * This replicates the @base44/sdk functionality for local development
 */

class Base44Client {
  constructor(config = {}) {
    this.appId = config.appId || process.env.BASE44_APP_ID;
    this.domain = config.domain || process.env.BASE44_DOMAIN;
    this.baseUrl = `https://${this.appId}.${this.domain}`;
    this.token = null;
    this.currentUser = null;

    // Initialize entities
    this.entities = {
      Products: new ProductsEntity(this),
      Orders: new OrdersEntity(this),
      Lyricists: new LyricistsEntity(this),
      Pages: new PagesEntity(this),
    };

    this.auth = new AuthService(this);
    this.analytics = new AnalyticsService(this);
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this.token;
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Base44 API Error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }
}

/**
 * Products Entity - Music releases and catalog
 */
class ProductsEntity {
  constructor(client) {
    this.client = client;
    this.data = [];
  }

  async list(filters = {}) {
    return this.client.request("/api/entities/Products/list", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  async get(id) {
    return this.client.request(`/api/entities/Products/${id}`);
  }

  async create(data) {
    return this.client.request("/api/entities/Products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id, data) {
    return this.client.request(`/api/entities/Products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id) {
    return this.client.request(`/api/entities/Products/${id}`, {
      method: "DELETE",
    });
  }
}

/**
 * Orders Entity - Royalties and payments
 */
class OrdersEntity {
  constructor(client) {
    this.client = client;
    this.data = [];
  }

  async list(filters = {}) {
    return this.client.request("/api/entities/Orders/list", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  async get(id) {
    return this.client.request(`/api/entities/Orders/${id}`);
  }

  async create(data) {
    return this.client.request("/api/entities/Orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id, data) {
    return this.client.request(`/api/entities/Orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

/**
 * Lyricists Entity - Collaborators and job applicants
 */
class LyricistsEntity {
  constructor(client) {
    this.client = client;
    this.data = [];
  }

  async list(filters = {}) {
    return this.client.request("/api/entities/Lyricists/list", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  async create(data) {
    return this.client.request("/api/entities/Lyricists", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update(id, data) {
    return this.client.request(`/api/entities/Lyricists/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

/**
 * Pages Entity - Legal documents and info pages
 */
class PagesEntity {
  constructor(client) {
    this.client = client;
  }

  async create(data) {
    return this.client.request("/api/entities/Pages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async list(filters = {}) {
    return this.client.request("/api/entities/Pages/list", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  async get(slug) {
    return this.client.request(`/api/entities/Pages/${slug}`);
  }
}

/**
 * Authentication Service
 */
class AuthService {
  constructor(client) {
    this.client = client;
  }

  async loginViaEmailPassword(email, password) {
    const response = await this.client.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.client.setToken(response.token);
      this.client.currentUser = response.user;
    }

    return response;
  }

  async loginViaGoogle(googleToken) {
    const response = await this.client.request("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ token: googleToken }),
    });

    if (response.token) {
      this.client.setToken(response.token);
      this.client.currentUser = response.user;
    }

    return response;
  }

  async getCurrentUser() {
    if (!this.client.token) {
      throw new Error("Not authenticated");
    }

    const response = await this.client.request("/api/auth/me");
    this.client.currentUser = response;
    return response;
  }

  async logout() {
    this.client.setToken(null);
    this.client.currentUser = null;
    return { success: true };
  }

  async register(email, password, name) {
    return this.client.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }
}

/**
 * Analytics Service
 */
class AnalyticsService {
  constructor(client) {
    this.client = client;
  }

  async getMetrics(options = {}) {
    return this.client.request("/api/analytics/metrics", {
      method: "POST",
      body: JSON.stringify(options),
    });
  }

  async getStreams(period = "month") {
    return this.client.request(`/api/analytics/streams?period=${period}`);
  }

  async getRoyalties(period = "month") {
    return this.client.request(`/api/analytics/royalties?period=${period}`);
  }
}

/**
 * Create a Base44 client instance
 */
export function createClient(config = {}) {
  return new Base44Client(config);
}

export { Base44Client, AuthService, AnalyticsService };
