import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, Bot, Target, ChevronDown, ChevronUp, Sparkles, Zap } from "lucide-react";
import type { SubscriptionResponse } from "@shared/schema";
import arasLogo from "@/assets/aras_logo_1755067745303.png";
import { useLocation } from "wouter";

export default function Space() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [heroCollapsed, setHeroCollapsed] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: userSubscription } = useQuery<SubscriptionResponse>({
    queryKey: ["/api/user/subscription"],
    enabled: !!user,
  });

  const subscriptionData: SubscriptionResponse = userSubscription || {
    plan: "starter",
    status: "active",
    aiMessagesUsed: 0,
    voiceCallsUsed: 0,
    aiMessagesLimit: 100,
    voiceCallsLimit: 10,
    renewalDate: null,
    hasPaymentMethod: false,
    requiresPaymentSetup: false,
    isTrialActive: false,
    canUpgrade: true,
    trialMessagesRemaining: 0,
  };

  const firstName = (user as any)?.firstName || (user as any)?.username || "Champion";

  const handleSectionChange = (section: string) => {
    if (section !== "space") navigate(`/${section}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => setHeroCollapsed(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Modern Clean Background */}
      <ModernBackground />

      <Sidebar
        activeSection="space"
        onSectionChange={handleSectionChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <TopBar
          currentSection="space"
          subscriptionData={subscriptionData}
          user={user as any}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Hero Section - Modern & Clean */}
          <AnimatePresence mode="wait">
            {!heroCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="relative overflow-hidden border-b border-white/[0.06]"
              >
                <div className="px-6 py-6 md:px-8 md:py-8">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      {/* Logo */}
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                      >
                        <motion.div
                          animate={{
                            boxShadow: [
                              "0 0 20px rgba(254,145,0,0.2)",
                              "0 0 30px rgba(254,145,0,0.4)",
                              "0 0 20px rgba(254,145,0,0.2)"
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="h-12 w-12 rounded-xl border border-[#FE9100]/30 bg-gradient-to-br from-[#FE9100]/10 to-[#e9d7c4]/5 p-2.5 backdrop-blur-sm"
                        >
                          <img src={arasLogo} alt="ARAS AI" className="h-full w-full object-contain" />
                        </motion.div>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#FE9100]"
                        />
                      </motion.div>

                      {/* Greeting */}
                      <div>
                        <motion.h1
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="text-xl md:text-2xl font-semibold tracking-tight"
                        >
                          <span className="text-white">Hey {firstName}</span>
                          <span className="text-[#FE9100] ml-2">✨</span>
                        </motion.h1>
                        <motion.p
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="mt-1 text-sm text-white/60"
                        >
                          Dein Command Center für Sales Excellence
                        </motion.p>
                      </div>
                    </div>

                    {/* Stats */}
                    <motion.div
                      initial={{ x: 10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="hidden lg:flex items-center gap-3"
                    >
                      <StatCard
                        icon={<Sparkles className="h-3.5 w-3.5" />}
                        label="Messages"
                        value={`${subscriptionData.aiMessagesUsed}/${subscriptionData.aiMessagesLimit}`}
                        delay={0.2}
                      />
                      <StatCard
                        icon={<Phone className="h-3.5 w-3.5" />}
                        label="Calls"
                        value={`${subscriptionData.voiceCallsUsed}/${subscriptionData.voiceCallsLimit}`}
                        delay={0.3}
                      />
                      <StatCard
                        icon={<Zap className="h-3.5 w-3.5" />}
                        label="Plan"
                        value={subscriptionData.plan.toUpperCase()}
                        delay={0.4}
                      />
                    </motion.div>
                  </div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    <ActionCard
                      icon={<Phone className="h-5 w-5" />}
                      title="Outbound Calls"
                      desc="KI-gesteuerte Voice-Kampagnen starten"
                      onClick={() => navigate("/power")}
                      delay={0.4}
                    />
                    <ActionCard
                      icon={<Bot className="h-5 w-5" />}
                      title="Voice Agents"
                      desc="Agenten-Performance optimieren"
                      onClick={() => navigate("/voice-agents")}
                      delay={0.5}
                    />
                    <ActionCard
                      icon={<Target className="h-5 w-5" />}
                      title="Kampagnen"
                      desc="Multi-Channel Sequenzen managen"
                      onClick={() => navigate("/campaigns")}
                      delay={0.6}
                    />
                  </motion.div>

                  {/* Collapse Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setHeroCollapsed(true)}
                    className="mx-auto mt-6 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white/80 transition-all"
                  >
                    <span>Minimieren</span>
                    <ChevronUp className="h-3.5 w-3.5" />
                  </motion.button>
                </div>

                {/* Bottom Border Glow */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FE9100]/30 to-transparent"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-b border-white/[0.06] px-6 py-3 md:px-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg border border-[#FE9100]/30 bg-[#FE9100]/5 p-1.5">
                      <img src={arasLogo} alt="ARAS AI" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">ARAS Command Center</div>
                      <div className="text-xs text-white/50">
                        {subscriptionData.aiMessagesUsed}/{subscriptionData.aiMessagesLimit} Messages · 
                        {subscriptionData.voiceCallsUsed}/{subscriptionData.voiceCallsLimit} Calls
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setHeroCollapsed(false)}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white/80 transition-all"
                  >
                    <span className="hidden md:inline">Erweitern</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Interface */}
          <div className={`relative ${heroCollapsed ? 'h-[calc(100vh-110px)]' : 'h-[calc(100vh-340px)]'} transition-all duration-500`}>
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Stat Card Component */
function StatCard({ icon, label, value, delay }: { icon: React.ReactNode; label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.03, y: -1 }}
      className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-[#FE9100]/10 p-1.5 text-[#FE9100]">
          {icon}
        </div>
        <div>
          <div className="text-[10px] font-medium text-white/50">{label}</div>
          <div className="text-sm font-bold text-white">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* Action Card Component */
function ActionCard({ icon, title, desc, onClick, delay }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void; delay: number }) {
  return (
    <motion.button
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-left transition-all hover:border-[#FE9100]/30 hover:bg-white/[0.04]"
    >
      {/* Hover Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#FE9100]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="flex-shrink-0 rounded-lg bg-gradient-to-br from-[#FE9100] to-[#e9d7c4] p-2.5 text-white shadow-lg shadow-[#FE9100]/20"
        >
          {icon}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            {title}
            <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#FE9100]" />
          </div>
          <div className="text-sm text-white/60 leading-snug">{desc}</div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FE9100] to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
    </motion.button>
  );
}

/* Modern Clean Background */
function ModernBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Subtle Orange Gradient Orbs */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[20%] top-[20%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#FE9100]/20 to-[#e9d7c4]/10 blur-[100px]"
        />
        <motion.div
          animate={{
            opacity: [0.15, 0.3, 0.15],
            scale: [1.1, 1, 1.1],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute right-[15%] bottom-[15%] h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-[#FE9100]/15 to-[#e9d7c4]/8 blur-[120px]"
        />
      </div>

      {/* Minimal Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(254,145,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(254,145,0,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating Particles - Orange Only */}
      {Array.from({ length: 12 }).map((_, i) => {
        const size = 1.5 + Math.random() * 2;
        const duration = 12 + Math.random() * 15;
        const delay = Math.random() * 10;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#FE9100]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              filter: `blur(${size * 0.8}px)`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0, 0.4, 0],
              scale: [0, 1.3, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Top Edge Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FE9100]/20 to-transparent" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
    </div>
  );
}