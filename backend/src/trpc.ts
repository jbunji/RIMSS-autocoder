import { initTRPC } from '@trpc/server'
import { z } from 'zod'

/**
 * tRPC initialization and router setup for RIMSS
 * This provides type-safe API endpoints
 */

// Initialize tRPC with error formatter to hide stack traces
// This prevents sensitive internal paths from being exposed to clients
const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Remove stack trace to prevent exposing internal file paths
        stack: undefined,
      },
    };
  },
})

// Export reusable router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure

/**
 * Main tRPC router
 * This is where all tRPC endpoints are defined
 */
export const appRouter = router({
  // Health check endpoint
  health: router({
    check: publicProcedure
      .query(() => {
        return {
          status: 'ok',
          timestamp: new Date().toISOString(),
          service: 'RIMSS tRPC API',
          version: '0.1.0'
        }
      }),
  }),

  // Example ping endpoint
  ping: publicProcedure
    .input(z.object({ message: z.string().optional() }))
    .query(({ input }) => {
      return {
        pong: true,
        message: input.message || 'Hello from tRPC!',
        timestamp: new Date().toISOString()
      }
    }),
})

// Export type definition for use in frontend
export type AppRouter = typeof appRouter
