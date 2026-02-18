/**
 * HarleyVexx OAuth Authentication Module
 * Supports Google OAuth 2.0, email/password, and JWT token management
 */

import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "harleyvexx-secret-key-2026";
const TOKEN_EXPIRY = "7d";

class AuthManager {
  constructor() {
    this.users = new Map();
    this.tokens = new Map();
    this.sessions = new Map();

    // Initialize with artist account
    this.users.set("jada@harleyvexx.com", {
      id: "artist_harleyvexx",
      email: "jada@harleyvexx.com",
      name: "Jada M. Smith",
      artist: "HarleyVexx",
      password: "harleyvexx2026", // In production: use bcrypt
      verified: true,
      roles: ["artist", "admin"],
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Generate OAuth state for CSRF protection
   */
  generateOAuthState() {
    const state = uuidv4();
    this.sessions.set(state, {
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });
    return state;
  }

  /**
   * Verify OAuth state (CSRF token validation)
   */
  verifyOAuthState(state) {
    const session = this.sessions.get(state);

    if (!session) {
      return { valid: false, error: "State is not valid." };
    }

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(state);
      return { valid: false, error: "State has expired." };
    }

    this.sessions.delete(state);
    return { valid: true };
  }

  /**
   * Get Google OAuth URL
   */
  getGoogleOAuthUrl(clientId, redirectUri) {
    const state = this.generateOAuthState();
    const scope = encodeURIComponent(
      "openid profile email https://www.googleapis.com/auth/youtube.readonly"
    );

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.append("client_id", clientId);
    url.searchParams.append("redirect_uri", redirectUri);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", scope);
    url.searchParams.append("state", state);
    url.searchParams.append("access_type", "offline");
    url.searchParams.append("prompt", "consent");

    return { url: url.toString(), state };
  }

  /**
   * Exchange authorization code for access token (Google callback)
   */
  async handleGoogleCallback(code, state, clientId, clientSecret, redirectUri) {
    // Verify state
    const stateValid = this.verifyOAuthState(state);
    if (!stateValid.valid) {
      return {
        success: false,
        error: stateValid.error,
        status: 400,
      };
    }

    // In production: exchange code for Google tokens
    // For now, return mock response
    return {
      success: true,
      message: "OAuth state validated successfully",
      nextStep:
        "Exchange authorization code with Google for access token (implement in production)",
    };
  }

  /**
   * Email/password login
   */
  async loginWithEmail(email, password) {
    const user = this.users.get(email);

    if (!user) {
      return {
        success: false,
        error: "User not found",
        status: 404,
      };
    }

    // In production: use bcrypt for password comparison
    if (user.password !== password) {
      return {
        success: false,
        error: "Invalid password",
        status: 401,
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        artist: user.artist,
        roles: user.roles,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // Store token
    this.tokens.set(token, {
      userId: user.id,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        artist: user.artist,
        verified: user.verified,
      },
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const tokenData = this.tokens.get(token);

      if (!tokenData || tokenData.expiresAt < Date.now()) {
        return { valid: false, error: "Token expired" };
      }

      return { valid: true, user: decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Logout and invalidate token
   */
  logout(token) {
    this.tokens.delete(token);
    return { success: true, message: "Logged out successfully" };
  }

  /**
   * Register new user
   */
  async registerUser(email, password, name) {
    if (this.users.has(email)) {
      return {
        success: false,
        error: "User already exists",
        status: 409,
      };
    }

    const user = {
      id: `user_${uuidv4()}`,
      email,
      name,
      password, // In production: hash with bcrypt
      verified: false,
      roles: ["user"],
      createdAt: new Date().toISOString(),
    };

    this.users.set(email, user);

    return {
      success: true,
      message: "User registered successfully",
      userId: user.id,
    };
  }

  /**
   * Get current user by token
   */
  getCurrentUser(token) {
    const verification = this.verifyToken(token);

    if (!verification.valid) {
      return { success: false, error: verification.error };
    }

    const user = this.users.get(verification.user.email);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        artist: user.artist || null,
        verified: user.verified,
        roles: user.roles,
      },
    };
  }
}

export { AuthManager };
export default new AuthManager();
