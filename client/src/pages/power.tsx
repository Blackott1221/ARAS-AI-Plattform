import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Upload, Loader2, X, Users, Zap, ArrowRight, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { SubscriptionResponse, VoiceAgent } from "@shared/schema";

export default function Power() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [saveContact, setSaveContact] = useState(true);
  const [callData, setCallData] = useState({
    name: "",
    phoneNumber: "",
    message: "",
  });
  const [bulkData, setBulkData] = useState({
    campaignName: "",
    csvFile: null as File | null,
  });

  const queryClient = useQueryClient();

  const { data: userSubscription } = useQuery<SubscriptionResponse>({
    queryKey: ["/api/user/subscription"],
    enabled: !!user && !authLoading,
    retry: false,
  });

  const { data: voiceAgents } = useQuery<VoiceAgent[]>({
    queryKey: ["/api/voice-agents"],
    enabled: !!user && !authLoading,
    retry: false,
  });

  if (authLoading) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white/10 border-t-white/60 rounded-full"
        />
      </div>
    );
  }

  const subscriptionData: SubscriptionResponse = userSubscription || {
    plan: 'starter',
    status: 'trial',
    aiMessagesUsed: 0,
    voiceCallsUsed: 0,
    aiMessagesLimit: 5,
    voiceCallsLimit: 0,
    renewalDate: null,
    hasPaymentMethod: false,
    requiresPaymentSetup: false,
    isTrialActive: false,
    canUpgrade: true,
    trialMessagesRemaining: 0,
  };

  const defaultVoiceAgent = voiceAgents && voiceAgents.length > 0 ? voiceAgents[0] : null;

  const callMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/calls", {
        phoneNumber: data.phoneNumber,
        leadName: data.name,
        message: data.message,
        voiceAgentId: defaultVoiceAgent?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Anruf gestartet ✓",
        description: "Der AI Voice Call wurde erfolgreich initiiert",
      });
      setShowCallDialog(false);
      setCallData({ name: "", phoneNumber: "", message: "" });
      setSaveContact(true);
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscription"] });
    },
    onError: (error: any) => {
      let errorData = null;
      try {
        errorData = error.message ? JSON.parse(error.message) : { message: error.message };
      } catch {
        errorData = { message: "Anruf fehlgeschlagen" };
      }

      if (errorData?.requiresPayment || errorData?.requiresUpgrade) {
        toast({
          title: "Upgrade erforderlich",
          description: errorData.message || "Voice Calls benötigen einen aktiven Plan",
          variant: "destructive",
          action: (
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/billing'}>
              Jetzt upgraden
            </Button>
          ),
        });
        return;
      }

      toast({
        title: "Fehler",
        description: errorData?.message || "Anruf konnte nicht gestartet werden",
        variant: "destructive",
      });
    },
  });

  const bulkMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append("campaignName", data.campaignName);
      formData.append("voiceAgentId", defaultVoiceAgent?.id?.toString() || "");
      if (data.csvFile) {
        formData.append("csvFile", data.csvFile);
      }
      
      const response = await fetch("/api/campaigns/bulk-upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload fehlgeschlagen");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Kampagne gestartet ✓",
        description: `"${data.campaignName}" läuft jetzt`,
      });
      setShowBulkDialog(false);
      setBulkData({ campaignName: "", csvFile: null });
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscription"] });
    },
    onError: (error: any) => {
      let errorData = null;
      try {
        errorData = error.message ? JSON.parse(error.message) : { message: error.message };
      } catch {
        errorData = { message: "Kampagne fehlgeschlagen" };
      }

      if (errorData?.requiresPayment || errorData?.requiresUpgrade) {
        toast({
          title: "Upgrade erforderlich",
          description: errorData.message || "Mass Calling benötigt einen höheren Plan",
          variant: "destructive",
          action: (
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/billing'}>
              Jetzt upgraden
            </Button>
          ),
        });
        return;
      }

      toast({
        title: "Fehler",
        description: errorData?.message || "Kampagne konnte nicht gestartet werden",
        variant: "destructive",
      });
    },
  });

  const handleCall = () => {
    if (!callData.name || !callData.phoneNumber) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte Name und Telefonnummer eingeben",
        variant: "destructive",
      });
      return;
    }

    if (subscriptionData.voiceCallsUsed >= (subscriptionData.voiceCallsLimit || 0) && subscriptionData.voiceCallsLimit !== null) {
      toast({
        title: "Limit erreicht",
        description: `${subscriptionData.voiceCallsUsed}/${subscriptionData.voiceCallsLimit} Calls genutzt`,
        variant: "destructive",
      });
      return;
    }

    callMutation.mutate(callData);
  };

  const handleBulk = () => {
    if (!bulkData.campaignName || !bulkData.csvFile) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte Name und CSV-Datei angeben",
        variant: "destructive",
      });
      return;
    }

    bulkMutation.mutate(bulkData);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <CleanBackground />
      <Sidebar activeSection="power" onSectionChange={() => {}} />
      
      <div className="flex-1 flex flex-col relative z-10">
        <TopBar 
          currentSection="power" 
          subscriptionData={subscriptionData}
          user={user as import("@shared/schema").User}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">
            <div className="max-w-4xl w-full space-y-16">
              
              {/* Single Call Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.02]"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#FE9100]" />
                    <span className="text-sm text-white/60">
                      {subscriptionData.voiceCallsUsed} / {subscriptionData.voiceCallsLimit || '∞'} Calls
                    </span>
                  </motion.div>

                  <h1 className="text-5xl md:text-6xl font-bold">
                    Jetzt Anruf starten
                  </h1>
                  <p className="text-xl text-white/60 max-w-2xl mx-auto">
                    AI-Voice-Agent startet in Sekunden – präzise, persönlich, effektiv
                  </p>
                </div>

                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCallDialog(true)}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#FE9100] to-[#e9d7c4] text-white text-lg font-semibold shadow-[0_0_40px_rgba(254,145,0,0.3)] hover:shadow-[0_0_60px_rgba(254,145,0,0.5)] transition-all"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FE9100] to-[#e9d7c4] opacity-0 group-hover:opacity-20 blur-xl"
                  />
                  <Phone className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Anruf starten</span>
                </motion.button>
              </motion.div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
              </div>

              {/* Mass Calling Section - HERVORGEHOBEN */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FE9100]/10 to-transparent rounded-3xl blur-3xl" />
                
                <div className="relative rounded-3xl border border-[#FE9100]/20 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-8 md:p-12">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Left: Icon & Info */}
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#FE9100]/10 border border-[#FE9100]/20">
                        <Zap className="w-4 h-4 text-[#FE9100]" />
                        <span className="text-sm font-medium text-[#FE9100]">Mass Calling Power</span>
                      </div>

                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                          Bis zu 10.000 Anrufe
                        </h2>
                        <p className="text-lg text-white/60">
                          Skaliere deine Sales-Outreach mit automatisierten Voice-Kampagnen. 
                          CSV hochladen und tausende Kontakte gleichzeitig erreichen.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FE9100]" />
                          CSV Bulk Upload
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FE9100]" />
                          Parallel Processing
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FE9100]" />
                          Real-time Analytics
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FE9100]" />
                          Auto-Scheduling
                        </div>
                      </div>
                    </div>

                    {/* Right: Stats & CTA */}
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-[#FE9100] to-[#e9d7c4] rounded-full blur-xl opacity-20"
                        />
                        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#FE9100] to-[#e9d7c4] flex items-center justify-center">
                          <div className="text-center">
                            <Users className="w-12 h-12 text-white mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">10K</div>
                            <div className="text-xs text-white/80">Calls</div>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowBulkDialog(true)}
                        className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FE9100] to-[#e9d7c4] text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Mass Calling starten</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* Call Dialog - SPEKTAKULÄR */}
      <AnimatePresence>
        {showCallDialog && (
          <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
            <DialogContent className="max-w-2xl bg-[#0a0a0a] border-none text-white p-0 overflow-hidden">
              {/* Header mit Gradient */}
              <div className="relative px-8 pt-8 pb-6 border-b border-white/[0.06]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FE9100]/5 to-transparent" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FE9100] to-[#e9d7c4] flex items-center justify-center shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Anruf einrichten</h2>
                      <p className="text-sm text-white/50">Konfiguriere deinen AI Voice Call</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCallDialog(false)}
                    className="w-10 h-10 rounded-lg hover:bg-white/[0.06] flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-6">
                {/* Contact Name - Clean Style */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">Kontakt Name</Label>
                  <Input 
                    placeholder="Max Mustermann"
                    value={callData.name}
                    onChange={(e) => setCallData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-14 bg-white/[0.03] border-white/[0.1] text-white text-base placeholder:text-white/30 focus:border-[#FE9100]/50 focus:bg-white/[0.05] transition-all rounded-xl"
                  />
                </div>

                {/* Save Contact - Elegant */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer"
                  onClick={() => setSaveContact(!saveContact)}
                >
                  <Checkbox
                    id="save-contact"
                    checked={saveContact}
                    onCheckedChange={setSaveContact}
                    className="w-5 h-5 border-white/[0.2] data-[state=checked]:bg-[#FE9100] data-[state=checked]:border-[#FE9100]"
                  />
                  <label htmlFor="save-contact" className="text-white/80 cursor-pointer flex-1">
                    Kontakt für zukünftige Anrufe speichern
                  </label>
                  <Sparkles className="w-4 h-4 text-[#FE9100]" />
                </motion.div>

                {/* Phone Number */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">Telefonnummer</Label>
                  <Input 
                    placeholder="+49 151 12345678"
                    value={callData.phoneNumber}
                    onChange={(e) => setCallData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="h-14 bg-white/[0.03] border-white/[0.1] text-white text-base placeholder:text-white/30 focus:border-[#FE9100]/50 focus:bg-white/[0.05] transition-all rounded-xl"
                  />
                </div>

                {/* Message - Animated Label */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">
                    <TypewriterLabel 
                      texts={[
                        "Was darf ich im Gespräch mitteilen?",
                        "Welche Nachricht soll übermittelt werden?",
                        "Was ist der Grund des Anrufs?",
                      ]}
                    />
                  </Label>
                  <Textarea 
                    placeholder="z.B. Ich rufe bezüglich unseres letzten Gesprächs an..."
                    value={callData.message}
                    onChange={(e) => setCallData(prev => ({ ...prev, message: e.target.value }))}
                    className="min-h-[120px] bg-white/[0.03] border-white/[0.1] text-white text-base placeholder:text-white/30 focus:border-[#FE9100]/50 focus:bg-white/[0.05] transition-all rounded-xl resize-none"
                  />
                  <p className="text-xs text-white/40 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Personalisierte Nachrichten erhöhen die Erfolgsrate
                  </p>
                </div>

                {/* Usage Bar */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#FE9100]/5 to-transparent border border-[#FE9100]/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">Verfügbare Calls</span>
                    <span className="text-lg font-bold text-white">
                      {(subscriptionData.voiceCallsLimit || 0) - subscriptionData.voiceCallsUsed}
                    </span>
                  </div>
                  <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${((subscriptionData.voiceCallsLimit || 0) - subscriptionData.voiceCallsUsed) / (subscriptionData.voiceCallsLimit || 1) * 100}%` 
                      }}
                      className="h-full bg-gradient-to-r from-[#FE9100] to-[#e9d7c4]"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 pb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCall}
                  disabled={callMutation.isPending || !callData.name || !callData.phoneNumber}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-[#FE9100] to-[#e9d7c4] text-white text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
                >
                  {callMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Anruf wird gestartet...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      Jetzt anrufen
                    </>
                  )}
                </motion.button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Bulk Dialog */}
      <AnimatePresence>
        {showBulkDialog && (
          <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
            <DialogContent className="max-w-2xl bg-[#0a0a0a] border-none text-white p-0 overflow-hidden">
              <div className="relative px-8 pt-8 pb-6 border-b border-white/[0.06]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FE9100]/5 to-transparent" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FE9100] to-[#e9d7c4] flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Mass Calling Campaign</h2>
                      <p className="text-sm text-white/50">Bis zu 10.000 parallele Anrufe</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowBulkDialog(false)}
                    className="w-10 h-10 rounded-lg hover:bg-white/[0.06] flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </motion.button>
                </div>
              </div>

              <div className="px-8 py-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">Kampagnen Name</Label>
                  <Input 
                    placeholder="Q1 Sales Outreach"
                    value={bulkData.campaignName}
                    onChange={(e) => setBulkData(prev => ({ ...prev, campaignName: e.target.value }))}
                    className="h-14 bg-white/[0.03] border-white/[0.1] text-white text-base placeholder:text-white/30 focus:border-[#FE9100]/50 transition-all rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">CSV-Datei hochladen</Label>
                  <div 
                    className="relative border-2 border-dashed border-white/[0.15] rounded-xl p-10 text-center cursor-pointer hover:border-[#FE9100]/40 hover:bg-white/[0.02] transition-all group"
                    onClick={() => document.getElementById('csv-upload-bulk')?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto text-white/30 group-hover:text-[#FE9100] transition-colors mb-3" />
                    {bulkData.csvFile ? (
                      <div>
                        <p className="text-base font-medium text-white">{bulkData.csvFile.name}</p>
                        <p className="text-sm text-white/50 mt-1">{(bulkData.csvFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base text-white/70 mb-1">CSV hier ablegen</p>
                        <p className="text-sm text-white/40">oder klicken zum Durchsuchen</p>
                      </div>
                    )}
                    <input 
                      id="csv-upload-bulk"
                      type="file" 
                      accept=".csv" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setBulkData(prev => ({ ...prev, csvFile: file }));
                      }}
                    />
                  </div>
                  <p className="text-xs text-white/40">Format: name, phone, email (optional)</p>
                </div>
              </div>

              <div className="px-8 pb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBulk}
                  disabled={bulkMutation.isPending || !bulkData.campaignName || !bulkData.csvFile}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-[#FE9100] to-[#e9d7c4] text-white text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {bulkMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Kampagne wird gestartet...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Mass Calling starten
                    </>
                  )}
                </motion.button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypewriterLabel({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useState(() => {
    const currentText = texts[currentIndex];
    
    if (!isDeleting && displayText.length < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, 80);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && displayText.length === currentText.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 3000);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 40);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setCurrentIndex((currentIndex + 1) % texts.length);
    }
  });

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-4 bg-[#FE9100] ml-1"
      />
    </span>
  );
}

function CleanBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#FE9100]/30 to-transparent blur-[150px]"
        />
      </div>
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
    </div>
  );
}