import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Welcome from "@/pages/welcome";
import Space from "@/pages/space";
import Power from "@/pages/power";
import VoiceAgents from "@/pages/voice-agents";
import Leads from "@/pages/leads";
import Campaigns from "@/pages/campaigns";
import Billing from "@/pages/billing";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      
      {/* Alle Routes funktionieren ohne Auth */}
      <Route path="/app" component={Space} />
      <Route path="/space" component={Space} />
      <Route path="/power" component={Power} />
      <Route path="/voice-agents" component={VoiceAgents} />
      <Route path="/leads" component={Leads} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/billing" component={Billing} />
      <Route path="/settings" component={Settings} />
      
      <Route component={NotFound} />
    </Switch>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark aras-bg-animated">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}


export default App;
