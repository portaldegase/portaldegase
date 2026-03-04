diff --git a/client/src/App.tsx b/client/src/App.tsx
index 4b8632d856c70c508b825211163aaf0ebca06630..33732b8044ea4534d1aeca5951454dc1ed0f58c3 100644
--- a/client/src/App.tsx
+++ b/client/src/App.tsx
@@ -20,50 +20,51 @@ import SearchResults from "./pages/SearchResults";
 import InstitutionalPage from "./pages/InstitutionalPage";
 import Privacy from "./pages/Privacy";
 import Terms from "./pages/Terms";
 import Documents from "./pages/Documents";
 import Page from "./pages/Page";
 
 // Admin pages
 import AdminLayout from "./pages/admin/AdminLayout";
 import AdminDashboard from "./pages/admin/AdminDashboard";
 import AdminPosts from "./pages/admin/AdminPosts";
 import AdminCategories from "./pages/admin/AdminCategories";
 import AdminPages from "./pages/admin/AdminPages";
 import AdminBanners from "./pages/admin/AdminBanners";
 import AdminVideos from "./pages/admin/AdminVideos";
 import AdminServices from "./pages/admin/AdminServices";
 import AdminServiceAnalytics from "./pages/admin/AdminServiceAnalytics";
 import AdminUnits from "./pages/admin/AdminUnits";
 import AdminTransparency from "./pages/admin/AdminTransparency";
 import AdminSettings from "./pages/admin/AdminSettings";
 import AdminUsers from "./pages/admin/AdminUsers";
 import AdminDocuments from "./pages/admin/AdminDocuments";
 import AdminDocumentStats from "./pages/admin/AdminDocumentStats";
 import AdminMenu from "./pages/admin/AdminMenu";
 import AdminMenuAccess from "./pages/admin/AdminMenuAccess";
 import { ResetPassword } from "./pages/ResetPassword";
+import Login from "./pages/Login";
 import { AdminAudit } from "./pages/admin/AdminAudit";
 
 // Layout components
 import SiteHeader from "./components/SiteHeader";
 import SiteFooter from "./components/SiteFooter";
 import CookieBanner from "./components/CookieBanner";
 
 function PublicLayout({ children }: { children: React.ReactNode }) {
   return (
     <div className="min-h-screen flex flex-col bg-white">
       <SiteHeader />
       <div className="flex-1">{children}</div>
       <SiteFooter />
       <CookieBanner />
     </div>
   );
 }
 
 function PublicPage({ component: Component }: { component: React.ComponentType }) {
   return (
     <PublicLayout>
       <Component />
     </PublicLayout>
   );
 }
@@ -96,49 +97,50 @@ function Router() {
       <Route path="/documentos">{() => <PublicPage component={Documents} />}</Route>
 
       {/* Admin routes */}
       <Route path="/admin">{() => <AdminPage component={AdminDashboard} />}</Route>
       <Route path="/admin/posts">{() => <AdminPage component={AdminPosts} />}</Route>
       <Route path="/admin/categorias">{() => <AdminPage component={AdminCategories} />}</Route>
       <Route path="/admin/paginas">{() => <AdminPage component={AdminPages} />}</Route>
       <Route path="/admin/banners">{() => <AdminPage component={AdminBanners} />}</Route>
       <Route path="/admin/videos">{() => <AdminPage component={AdminVideos} />}</Route>
       <Route path="/admin/servicos">{() => <AdminPage component={AdminServices} />}</Route>
       <Route path="/admin/servicos/analytics">{() => <AdminPage component={AdminServiceAnalytics} />}</Route>
       <Route path="/admin/unidades">{() => <AdminPage component={AdminUnits} />}</Route>
       <Route path="/admin/transparencia">{() => <AdminPage component={AdminTransparency} />}</Route>
       <Route path="/admin/usuarios">{() => <AdminPage component={AdminUsers} />}</Route>
       <Route path="/admin/configuracoes">{() => <AdminPage component={AdminSettings} />}</Route>
       <Route path="/admin/documentos">{() => <AdminPage component={AdminDocuments} />}</Route>
       <Route path="/admin/documentos/estatisticas">{() => <AdminPage component={AdminDocumentStats} />}</Route>
       <Route path="/admin/documents">{() => <AdminPage component={AdminDocuments} />}</Route>
       <Route path="/admin/documents/stats">{() => <AdminPage component={AdminDocumentStats} />}</Route>
       <Route path="/admin/menu">{() => <AdminPage component={AdminMenu} />}</Route>
       <Route path="/admin/permissoes">{() => <AdminPage component={AdminMenuAccess} />}</Route>
       <Route path="/admin/auditoria">{() => <AdminPage component={AdminAudit} />}</Route>
 
       {/* Public routes - continued */}
       <Route path="/reset-senha">{() => <PublicLayout><ResetPassword /></PublicLayout>}</Route>
+      <Route path="/login">{() => <PublicLayout><Login /></PublicLayout>}</Route>
 
       {/* 404 */}
       <Route path="/404" component={NotFound} />
       <Route component={NotFound} />
     </Switch>
   );
 }
 
 function App() {
   return (
     <ErrorBoundary>
       <ThemeProvider defaultTheme="light">
         <AccessibilityProvider>
           <TooltipProvider>
             <Toaster />
             <Router />
           </TooltipProvider>
         </AccessibilityProvider>
       </ThemeProvider>
     </ErrorBoundary>
   );
 }
 
 export default App;
