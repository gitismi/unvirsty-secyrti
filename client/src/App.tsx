import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>

import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import AuthPage from "./pages/auth-page";
import LoginHistoryPage from "./pages/login-history";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/login-history" component={LoginHistoryPage} />
        <Route path="/">
          <h1>الصفحة الرئيسية</h1>
          <a href="/login-history">عرض سجل الدخول</a>
        </Route>
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
