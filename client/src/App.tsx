import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import Welcome from "@/pages/welcome";
import Space from "@/pages/space";
import Power from "@/pages/power";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/auth" component={Auth} />
        
        <Route path="/welcome">
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        </Route>

        <Route path="/space">
          <ProtectedRoute>
            <Space />
          </ProtectedRoute>
        </Route>

        <Route path="/power">
          <ProtectedRoute>
            <Power />
          </ProtectedRoute>
        </Route>

        <Route>404 - Not Found</Route>
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
