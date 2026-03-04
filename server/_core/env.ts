diff --git a/server/_core/env.ts b/server/_core/env.ts
index 2792b99ebd9d9a07c1194237822d8adf06ba2441..8a72d3aa87006b30f977b9086901ca662d39495c 100644
--- a/server/_core/env.ts
+++ b/server/_core/env.ts
@@ -1,10 +1,11 @@
 export const ENV = {
   appId: process.env.VITE_APP_ID ?? "",
+  authMode: process.env.AUTH_MODE ?? "manus",
   cookieSecret: process.env.JWT_SECRET ?? "",
   databaseUrl: process.env.DATABASE_URL ?? "",
   oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
   ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
   isProduction: process.env.NODE_ENV === "production",
   forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
   forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
 };
