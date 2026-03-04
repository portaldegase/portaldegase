diff --git a/server/routers.ts b/server/routers.ts
index 0616defcd106fc730d1a395829c4c251616f4c64..5533933fb056aa58a6fd915ef719fa9f742345ab 100644
--- a/server/routers.ts
+++ b/server/routers.ts
@@ -1,51 +1,93 @@
 import { COOKIE_NAME } from "@shared/const";
 import { getSessionCookieOptions } from "./_core/cookies";
 import { systemRouter } from "./_core/systemRouter";
 import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
 import { TRPCError } from "@trpc/server";
 import { z } from "zod";
 import * as db from "./db";
 import { eq } from "drizzle-orm";
 import { mediaLibrary } from "../drizzle/schema";
 import { generateAnalyticsPDF, type AnalyticsReportData } from "./pdf-generator";
+import { verifyPassword } from "./password";
+import { sdk } from "./_core/sdk";
+import { ONE_YEAR_MS } from "@shared/const";
+import { ENV } from "./_core/env";
 
 const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
   if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores" });
   return next({ ctx });
 });
 
 const editorProcedure = protectedProcedure;
 
 function slugify(text: string): string {
   return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
 }
 
 export const appRouter = router({
   system: systemRouter,
   auth: router({
     me: publicProcedure.query(opts => opts.ctx.user),
+    login: publicProcedure
+      .input(
+        z.object({
+          email: z.string().email(),
+          password: z.string().min(1),
+        })
+      )
+      .mutation(async ({ ctx, input }) => {
+        if (ENV.authMode !== "local") {
+          throw new TRPCError({ code: "BAD_REQUEST", message: "Login local desabilitado" });
+        }
+
+        const user = await db.getUserByEmail(input.email);
+        if (!user || !user.passwordHash) {
+          throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciais inválidas" });
+        }
+
+        const isValid = await verifyPassword(input.password, user.passwordHash);
+        if (!isValid) {
+          throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciais inválidas" });
+        }
+
+        const sessionToken = await sdk.signSession({
+          openId: user.openId,
+          appId: ENV.appId || "local",
+          name: user.name || user.email || user.openId,
+        }, { expiresInMs: ONE_YEAR_MS });
+
+        const cookieOptions = getSessionCookieOptions(ctx.req);
+        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
+
+        await db.upsertUser({
+          openId: user.openId,
+          lastSignedIn: new Date(),
+        });
+
+        return { success: true } as const;
+      }),
     logout: publicProcedure.mutation(({ ctx }) => {
       const cookieOptions = getSessionCookieOptions(ctx.req);
       ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
       return { success: true } as const;
     }),
   }),
 
   users: router({
     list: adminProcedure.query(async () => db.listUsers()),
     getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => db.getUserById(input.id)),
     create: adminProcedure.input(z.object({
       openId: z.string().min(1),
       name: z.string().optional(),
       email: z.string().email().optional(),
       functionalId: z.string().optional(),
       password: z.string().min(8),
       role: z.enum(['user', 'admin', 'contributor']).default('user'),
       categoryId: z.number().optional(),
     })).mutation(async ({ input }) => {
       const { password, ...userData } = input;
       const existingUser = await db.getUserByOpenId(input.openId);
       if (existingUser) {
         throw new TRPCError({ code: 'CONFLICT', message: 'Usuário com este openId já existe' });
       }
       const { hashPassword } = await import('./password');
