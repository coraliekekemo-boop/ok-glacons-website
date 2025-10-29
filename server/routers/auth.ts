import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { admins } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authRouter = router({
  // Admin login
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Find admin by username
      const [admin] = await db
        .select()
        .from(admins)
        .where(eq(admins.username, input.username));

      if (!admin) {
        throw new Error("Nom d'utilisateur ou mot de passe incorrect");
      }

      // Verify password
      const isValid = await bcrypt.compare(input.password, admin.password);

      if (!isValid) {
        throw new Error("Nom d'utilisateur ou mot de passe incorrect");
      }

      // Set session cookie
      if (ctx.res) {
        ctx.res.cookie("admin_session", JSON.stringify({
          id: admin.id,
          username: admin.username,
          email: admin.email,
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: "lax",
        });
      }

      return {
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
        },
      };
    }),

  // Check if logged in
  checkAuth: publicProcedure.query(async ({ ctx }) => {
    const sessionCookie = ctx.req?.cookies?.admin_session;

    if (!sessionCookie) {
      return { isAuthenticated: false };
    }

    try {
      const session = JSON.parse(sessionCookie);
      
      // Verify admin still exists
      const [admin] = await db
        .select()
        .from(admins)
        .where(eq(admins.id, session.id));

      if (!admin) {
        return { isAuthenticated: false };
      }

      return {
        isAuthenticated: true,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
        },
      };
    } catch (error) {
      return { isAuthenticated: false };
    }
  }),

  // Logout
  logout: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.res) {
      ctx.res.clearCookie("admin_session");
    }

    return {
      success: true,
    };
  }),

  // Create admin (for initial setup - should be protected in production)
  createAdmin: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        password: z.string().min(6),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if username already exists
      const [existing] = await db
        .select()
        .from(admins)
        .where(eq(admins.username, input.username));

      if (existing) {
        throw new Error("Ce nom d'utilisateur existe déjà");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create admin
      const result = await db.insert(admins).values({
        username: input.username,
        password: hashedPassword,
        email: input.email,
      });

      return {
        success: true,
        message: "Administrateur créé avec succès",
      };
    }),
});
