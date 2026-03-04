diff --git a/server/_core/sdk.ts b/server/_core/sdk.ts
index 230e762ad6af3ed753df21a8102a081c5759d7db..6b12032553637be41e4ae6493ab1e210d16757a9 100644
--- a/server/_core/sdk.ts
+++ b/server/_core/sdk.ts
@@ -149,51 +149,51 @@ class SDKServer {
     if (!cookieHeader) {
       return new Map<string, string>();
     }
 
     const parsed = parseCookieHeader(cookieHeader);
     return new Map(Object.entries(parsed));
   }
 
   private getSessionSecret() {
     const secret = ENV.cookieSecret;
     return new TextEncoder().encode(secret);
   }
 
   /**
    * Create a session token for a Manus user openId
    * @example
    * const sessionToken = await sdk.createSessionToken(userInfo.openId);
    */
   async createSessionToken(
     openId: string,
     options: { expiresInMs?: number; name?: string } = {}
   ): Promise<string> {
     return this.signSession(
       {
         openId,
-        appId: ENV.appId,
+        appId: ENV.appId || "local",
         name: options.name || "",
       },
       options
     );
   }
 
   async signSession(
     payload: SessionPayload,
     options: { expiresInMs?: number } = {}
   ): Promise<string> {
     const issuedAt = Date.now();
     const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
     const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
     const secretKey = this.getSessionSecret();
 
     return new SignJWT({
       openId: payload.openId,
       appId: payload.appId,
       name: payload.name,
     })
       .setProtectedHeader({ alg: "HS256", typ: "JWT" })
       .setExpirationTime(expirationSeconds)
       .sign(secretKey);
   }
 
@@ -248,50 +248,61 @@ class SDKServer {
     const loginMethod = this.deriveLoginMethod(
       (data as any)?.platforms,
       (data as any)?.platform ?? data.platform ?? null
     );
     return {
       ...(data as any),
       platform: loginMethod,
       loginMethod,
     } as GetUserInfoWithJwtResponse;
   }
 
   async authenticateRequest(req: Request): Promise<User> {
     // Regular authentication flow
     const cookies = this.parseCookies(req.headers.cookie);
     const sessionCookie = cookies.get(COOKIE_NAME);
     const session = await this.verifySession(sessionCookie);
 
     if (!session) {
       throw ForbiddenError("Invalid session cookie");
     }
 
     const sessionUserId = session.openId;
     const signedInAt = new Date();
     let user = await db.getUserByOpenId(sessionUserId);
 
+    if (ENV.authMode === "local") {
+      if (!user) {
+        throw ForbiddenError("User not found");
+      }
+      await db.upsertUser({
+        openId: user.openId,
+        lastSignedIn: signedInAt,
+      });
+      return user;
+    }
+
     // If user not in DB, sync from OAuth server automatically
     if (!user) {
       try {
         const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
         await db.upsertUser({
           openId: userInfo.openId,
           name: userInfo.name || null,
           email: userInfo.email ?? null,
           loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
           lastSignedIn: signedInAt,
         });
         user = await db.getUserByOpenId(userInfo.openId);
       } catch (error) {
         console.error("[Auth] Failed to sync user from OAuth:", error);
         throw ForbiddenError("Failed to sync user info");
       }
     }
 
     if (!user) {
       throw ForbiddenError("User not found");
     }
 
     await db.upsertUser({
       openId: user.openId,
       lastSignedIn: signedInAt,
