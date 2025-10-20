// This file creates the NextAuth API endpoints
// It handles /api/auth/signin, /api/auth/signout, /api/auth/session, etc.

import { handlers } from "@/lib/auth";

// Export the handlers that NextAuth generated for us
// GET: Handles requests like /api/auth/session, /api/auth/providers
// POST: Handles login attempts, logout, etc.
export const { GET, POST } = handlers;
