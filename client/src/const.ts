diff --git a/client/src/const.ts b/client/src/const.ts
index 99990633c211f1d46b3e65dec069142288c449c6..29c856b16e541c7e26986086a484e756f6ceb47d 100644
--- a/client/src/const.ts
+++ b/client/src/const.ts
@@ -1,17 +1,22 @@
 export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
 
 // Generate login URL at runtime so redirect URI reflects the current origin.
 export const getLoginUrl = () => {
+  const authMode = import.meta.env.VITE_AUTH_MODE || "manus";
+  if (authMode === "local") {
+    return "/login";
+  }
+
   const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
   const appId = import.meta.env.VITE_APP_ID;
   const redirectUri = `${window.location.origin}/api/oauth/callback`;
   const state = btoa(redirectUri);
 
   const url = new URL(`${oauthPortalUrl}/app-auth`);
   url.searchParams.set("appId", appId);
   url.searchParams.set("redirectUri", redirectUri);
   url.searchParams.set("state", state);
   url.searchParams.set("type", "signIn");
 
   return url.toString();
 };
