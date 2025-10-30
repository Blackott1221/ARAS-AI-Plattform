import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Bot, Cpu, Signal, ArrowRight, Eye, EyeOff, Check, ShieldCheck, TrendingUp, Award, Lock, KeyRound, Zap, AlertCircle, CheckCircle2, Mail, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const formRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  const features = [
    { 
      icon: <Bot className="w-6 h-6" />, 
      title: "Menschenähnliche Stimme", 
      desc: "Outbound-KI, die wirklich Gespräche führt.",
      stat: "98.7%",
      statLabel: "Success Rate"
    },
    { 
      icon: <Cpu className="w-6 h-6" />, 
      title: "Eigenes ARAS-Modell", 
      desc: "Ein LLM je Anruf – hunderte parallel.",
      stat: "500+",
      statLabel: "Parallel Calls"
    },
    { 
      icon: <Signal className="w-6 h-6" />, 
      title: "Live-Kennzahlen", 
      desc: "Conversion, Ergebnis, Dauer – sofort sichtbar.",
      stat: "<100ms",
      statLabel: "Response"
    },
  ];

  const requirements = [
    { text: "Mindestens 8 Zeichen", met: password.length >= 8 },
    { text: "Mind. ein Großbuchstabe", met: /[A-Z]/.test(password) },
    { text: "Mind. ein Kleinbuchstabe", met: /[a-z]/.test(password) },
    { text: "Mind. eine Zahl", met: /\d/.test(password) },
  ];

  const strength = useMemo(() => requirements.filter(r => r.met).length, [requirements]);
  const strengthPercentage = (strength / requirements.length) * 100;

  const strengthConfig = useMemo(() => {
    if (strength <= 1) return { 
      label: "Schwach", 
      color: "#ef4444",
      gradient: "from-red-500 via-orange-600 to-red-500" 
    };
    if (strength === 2) return { 
      label: "Mittel", 
      color: "#f59e0b",
      gradient: "from-orange-500 via-amber-500 to-orange-500" 
    };
    if (strength === 3) return { 
      label: "Gut", 
      color: "#10b981",
      gradient: "from-emerald-500 via-green-500 to-emerald-500" 
    };
    return { 
      label: "Sehr stark", 
      color: "#FE9100",
      gradient: "from-[#FE9100] via-[#e9d7c4] to-[#FE9100]" 
    };
  }, [strength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailValid) {
      toast({ 
        title: "Ungültige E-Mail", 
        description: "Bitte gib eine gültige E-Mail-Adresse ein.", 
        variant: "destructive" 
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({ 
        title: "Passwörter stimmen nicht überein", 
        description: "Bitte überprüfe deine Eingabe.", 
        variant: "destructive" 
      });
      return;
    }

    if (strength < 4) {
      toast({ 
        title: "Passwort zu schwach", 
        description: "Dein Passwort muss alle Anforderungen erfüllen.", 
        variant: "destructive" 
      });
      return;
    }

    if (!agreeToTerms) {
      toast({ 
        title: "Zustimmung erforderlich", 
        description: "Bitte akzeptiere AGB und Datenschutzerklärung.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      toast({ 
        title: "🎉 Willkommen bei ARAS AI!", 
        description: "Dein Account wurde erfolgreich erstellt." 
      });
      setLocation("/welcome");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <UltraPremiumBackground />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
        {/* Left Stage - Ultra Premium */}
        <div className="hidden lg:flex lg:w-[52%] items-center justify-center p-12 xl:p-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl"
          >
            {/* Logo Section */}
            <div className="mb-14">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="font-orbitron text-[5rem] font-bold tracking-tight leading-none mb-8">
                  <AnimatedGoldText text="ARAS AI" />
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#FE9100]/30 bg-gradient-to-r from-[#FE9100]/10 to-transparent backdrop-blur-xl"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2.5 h-2.5 rounded-full bg-[#FE9100] shadow-[0_0_15px_#FE9100]"
                />
                <span className="text-sm font-semibold text-[#e9d7c4] uppercase tracking-widest">
                  Pre-Launch Phase
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 text-xl text-white/90 leading-relaxed font-light"
              >
                Starte in Minuten. Skaliere Gespräche, nicht Teamgrößen.{" "}
                <motion.span 
                  className="relative inline-block font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  <AnimatedGoldText text="Swiss-backed. Performance-driven." size="text-xl" />
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#FE9100] via-[#e9d7c4] to-[#FE9100]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </motion.span>
              </motion.p>
            </div>

            {/* Feature Cards - Ultra Premium */}
            <div className="space-y-5 mb-12">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.7 + i * 0.15, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ x: 12, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#FE9100]/0 via-[#FE9100]/20 to-[#FE9100]/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
                    
                    <div className="relative flex items-start gap-6 p-7 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent backdrop-blur-xl hover:border-[#FE9100]/40 transition-all duration-700">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                        className="relative flex-shrink-0"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FE9100]/30 to-[#a34e00]/30 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative grid h-16 w-16 place-items-center rounded-xl bg-gradient-to-br from-[#e9d7c4] via-[#FE9100] to-[#a34e00] text-black shadow-xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl" />
                          {f.icon}
                        </div>
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-orbitron text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#e9d7c4] group-hover:via-[#FE9100] group-hover:to-[#e9d7c4] transition-all duration-500">
                          {f.title}
                        </h3>
                        <p className="text-sm text-white/70 leading-relaxed mb-4 font-light">
                          {f.desc}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <motion.span 
                            className="font-orbitron text-3xl font-bold"
                            whileHover={{ scale: 1.1 }}
                          >
                            <AnimatedGoldText text={f.stat} size="text-3xl" />
                          </motion.span>
                          <span className="text-xs text-white/50 uppercase tracking-widest font-medium">
                            {f.statLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Stats Grid - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="grid grid-cols-3 gap-5 mb-10"
            >
              {[
                { icon: <TrendingUp className="w-5 h-5" />, value: "99.9%", label: "Uptime", color: "#10b981" },
                { icon: <Zap className="w-5 h-5" />, value: "<100ms", label: "Latenz", color: "#FE9100" },
                { icon: <Award className="w-5 h-5" />, value: "A+", label: "Trust", color: "#e9d7c4" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -6, scale: 1.05 }}
                  className="relative group overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent backdrop-blur-xl p-6 text-center"
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at center, ${stat.color}15, transparent 70%)`
                    }}
                  />
                  <div className="relative">
                    <motion.div 
                      className="inline-flex items-center justify-center mb-3"
                      style={{ color: stat.color }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <div className="font-orbitron text-4xl font-bold mb-2">
                      <AnimatedGoldText text={stat.value} size="text-4xl" />
                    </div>
                    <div className="text-xs text-white/60 uppercase tracking-widest font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="flex items-center gap-4 text-sm text-white/70 font-light"
            >
              <ShieldCheck className="h-5 w-5 text-[#FE9100]" />
              <span>DSGVO-konform • ISO 27001 • SOC 2 Type II • Audit-ready</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Dark Premium Form */}
        <div className="flex w-full items-center justify-center p-6 lg:w-[48%] lg:p-12" ref={formRef}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg"
          >
            <Card className="relative overflow-hidden border-white/20 bg-gradient-to-br from-black/90 via-[#0a0a0a]/95 to-black/90 backdrop-blur-2xl shadow-2xl">
              {/* Animated Border Glow */}
              <div className="absolute -inset-[1px] rounded-[22px] overflow-hidden">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 0%, #FE9100 10%, transparent 20%, transparent 80%, #e9d7c4 90%, transparent 100%)`,
                  }}
                />
              </div>

              {/* Inner Border */}
              <div className="absolute inset-[1px] rounded-[21px] bg-gradient-to-br from-black via-[#0a0a0a] to-black" />

              {/* Mouse Tracking Spotlight */}
              <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[21px]"
                style={{
                  background: `radial-gradient(600px circle at ${springX.get() * 100}% ${springY.get() * 100}%, rgba(254,145,0,0.12), transparent 50%)`,
                }}
              />

              <CardContent className="relative z-10 p-10">
                {/* Header */}
                <div className="mb-10 text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-4 font-orbitron text-5xl font-bold"
                  >
                    <AnimatedGoldText text="Konto erstellen" size="text-5xl" />
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-white/60 font-light"
                  >
                    Dein Zugang zur ARAS-Konsole
                  </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <DarkPremiumInput
                      id="firstName"
                      label="Vorname"
                      value={firstName}
                      onChange={setFirstName}
                      placeholder="z. B. Lisa"
                      autoComplete="given-name"
                      icon={<User className="w-4 h-4" />}
                      focused={focusedField === "firstName"}
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <DarkPremiumInput
                      id="lastName"
                      label="Nachname"
                      value={lastName}
                      onChange={setLastName}
                      placeholder="z. B. Becka"
                      autoComplete="family-name"
                      icon={<User className="w-4 h-4" />}
                      focused={focusedField === "lastName"}
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  {/* Email */}
                  <DarkPremiumInput
                    id="email"
                    label="E-Mail"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="dein.name@unternehmen.com"
                    autoComplete="email"
                    icon={<Mail className="w-4 h-4" />}
                    focused={focusedField === "email"}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    valid={email.length > 0 ? emailValid : undefined}
                  />

                  {/* Password */}
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-white/90 mb-3 block">
                      Passwort
                    </Label>
                    <div className="relative group">
                      {focusedField === "password" && (
                        <motion.div
                          layoutId="input-glow"
                          className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-[#FE9100]/30 via-[#e9d7c4]/30 to-[#FE9100]/30 blur-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                      
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="••••••••"
                          required
                          autoComplete="new-password"
                          className={`h-12 pr-12 bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 transition-all duration-300 ${
                            focusedField === "password"
                              ? "border-[#FE9100]/50 bg-white/[0.05]"
                              : "hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-4 hover:bg-transparent"
                          onClick={() => setShowPassword((s) => !s)}
                        >
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-white/40" />
                            ) : (
                              <Eye className="h-4 w-4 text-white/40" />
                            )}
                          </motion.div>
                        </Button>
                      </div>
                    </div>

                    {/* Strength Indicator */}
                    <AnimatePresence>
                      {password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-5 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/60 font-medium">Passwortstärke</span>
                            <motion.span
                              key={strengthConfig.label}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-xs font-bold px-3 py-1 rounded-full border"
                              style={{
                                color: strengthConfig.color,
                                borderColor: `${strengthConfig.color}40`,
                                backgroundColor: `${strengthConfig.color}10`
                              }}
                            >
                              {strengthConfig.label}
                            </motion.span>
                          </div>
                          
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                            <motion.div
                              className="absolute inset-y-0 left-0 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${strengthPercentage}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              style={{ backgroundColor: strengthConfig.color }}
                            >
                              <motion.div
                                className="absolute inset-0 rounded-full"
                                animate={{
                                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}
                                style={{
                                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                                  backgroundSize: "200% 100%",
                                }}
                              />
                            </motion.div>
                          </div>

                          <div className="grid gap-3 text-xs sm:grid-cols-2">
                            {requirements.map((r, idx) => (
                              <motion.div
                                key={r.text}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                className="flex items-center gap-3"
                              >
                                <motion.div
                                  animate={r.met ? { 
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 360]
                                  } : {}}
                                  transition={{ duration: 0.5 }}
                                  className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${
                                    r.met
                                      ? "bg-[#FE9100]/20 text-[#FE9100] shadow-[0_0_12px_rgba(254,145,0,0.4)]"
                                      : "bg-white/5 text-white/30 border border-white/10"
                                  }`}
                                >
                                  <Check className="h-3 w-3" strokeWidth={3} />
                                </motion.div>
                                <span className={`transition-colors duration-300 font-light ${
                                  r.met ? "text-white/90" : "text-white/40"
                                }`}>
                                  {r.text}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-white/90 mb-3 block">
                      Passwort bestätigen
                    </Label>
                    <div className="relative group">
                      {focusedField === "confirmPassword" && (
                        <motion.div
                          layoutId="input-glow-confirm"
                          className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-[#FE9100]/30 via-[#e9d7c4]/30 to-[#FE9100]/30 blur-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                      
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setFocusedField("confirmPassword")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="erneut eingeben"
                          required
                          autoComplete="new-password"
                          className={`h-12 pr-12 bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 transition-all duration-300 ${
                            focusedField === "confirmPassword"
                              ? "border-[#FE9100]/50 bg-white/[0.05]"
                              : "hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-4 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword((s) => !s)}
                        >
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-white/40" />
                            ) : (
                              <Eye className="h-4 w-4 text-white/40" />
                            )}
                          </motion.div>
                        </Button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {confirmPassword && password !== confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.95 }}
                          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30"
                        >
                          <AlertCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                          <span className="text-xs text-red-400 font-light">
                            Passwörter stimmen nicht überein
                          </span>
                        </motion.div>
                      )}
                      {confirmPassword && password === confirmPassword && confirmPassword.length >= 8 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.95 }}
                          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="text-xs text-emerald-400 font-light">
                            Passwörter stimmen überein
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Terms & Conditions */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-[#FE9100]/30 hover:bg-white/[0.03] transition-all duration-300 group"
                  >
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(c) => setAgreeToTerms(c === true)}
                      className="mt-0.5 data-[state=checked]:bg-[#FE9100] data-[state=checked]:border-[#FE9100] data-[state=checked]:shadow-[0_0_12px_rgba(254,145,0,0.4)]"
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed text-white/70 cursor-pointer font-light group-hover:text-white/90 transition-colors">
                      Ich akzeptiere die{" "}
                      <Link 
                        href="/terms" 
                        className="text-[#FE9100] hover:text-[#e9d7c4] underline-offset-2 hover:underline transition-colors font-medium"
                      >
                        AGB
                      </Link>
                      {" "}und die{" "}
                      <Link 
                        href="/privacy" 
                        className="text-[#FE9100] hover:text-[#e9d7c4] underline-offset-2 hover:underline transition-colors font-medium"
                      >
                        Datenschutzerklärung
                      </Link>
                      .
                    </Label>
                  </motion.div>

                  {/* Submit Button - Ultra Premium */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="relative pt-2"
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="relative w-full h-14 rounded-xl font-orbitron font-bold text-base overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#e9d7c4] via-[#FE9100] to-[#a34e00]" />
                      
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                          backgroundSize: "200% 100%",
                        }}
                      />
                      
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            backgroundPosition: ["-200% 0", "200% 0"],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          style={{
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                            backgroundSize: "50% 100%",
                          }}
                        />
                      </div>
                      
                      <span className="relative z-10 flex items-center justify-center gap-3 text-black">
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="h-5 w-5 rounded-full border-3 border-black/30 border-t-black"
                            />
                            <span>Account wird erstellt…</span>
                          </>
                        ) : (
                          <>
                            <span>Konto erstellen</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </span>
                    </button>
                  </motion.div>
                </form>

                {/* Security Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex items-center justify-center gap-2 text-xs text-white/50 font-light"
                >
                  <Lock className="h-4 w-4 text-[#FE9100]" />
                  <span>256-bit Verschlüsselung • 2FA nach Login verfügbar</span>
                </motion.div>

                {/* Trust Badges Grid */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { icon: <KeyRound className="h-4 w-4" />, label: "SSO Ready", color: "#10b981" },
                    { icon: <ShieldCheck className="h-4 w-4" />, label: "Audit Ready", color: "#FE9100" },
                    { icon: <Lock className="h-4 w-4" />, label: "DSGVO", color: "#e9d7c4" },
                  ].map((badge, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ y: -4, scale: 1.05 }}
                      className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center backdrop-blur-sm hover:border-white/20 transition-all duration-300"
                    >
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, ${badge.color}15, transparent 70%)`
                        }}
                      />
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                        style={{ color: badge.color }}
                      >
                        {badge.icon}
                      </motion.div>
                      <span className="relative text-[10px] text-white/60 font-medium uppercase tracking-wider">
                        {badge.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Login Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mt-10 text-center text-sm text-white/60 font-light"
                >
                  Bereits ein Konto?{" "}
                  <Link
                    href="/login"
                    className="font-semibold group inline-flex items-center gap-1.5 hover:gap-2 transition-all"
                  >
                    <AnimatedGoldText text="Jetzt anmelden" size="text-sm" />
                    <ArrowRight className="h-4 w-4 text-[#FE9100] transition-transform duration-300" />
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Dark Premium Input Component
function DarkPremiumInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  icon,
  focused,
  onFocus,
  onBlur,
  valid,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
  icon?: React.ReactNode;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  valid?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium text-white/90 mb-3 block">
        {label}
      </Label>
      <div className="relative group">
        {focused && (
          <motion.div
            layoutId={`input-glow-${id}`}
            className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-[#FE9100]/30 via-[#e9d7c4]/30 to-[#FE9100]/30 blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        
        <div className="relative flex items-center">
          {icon && (
            <div className={`absolute left-4 transition-colors duration-300 ${
              focused ? "text-[#FE9100]" : "text-white/30"
            }`}>
              {icon}
            </div>
          )}
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            required
            autoComplete={autoComplete}
            className={`h-12 bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 transition-all duration-300 ${
              icon ? "pl-11" : ""
            } ${
              focused
                ? "border-[#FE9100]/50 bg-white/[0.05]"
                : "hover:border-white/20 hover:bg-white/[0.04]"
            } ${
              valid !== undefined && !focused
                ? valid
                  ? "border-emerald-500/30"
                  : "border-red-500/30"
                : ""
            }`}
          />
          {valid !== undefined && !focused && value && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute right-4"
            >
              {valid ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Animated Gold Text Component (Website Style)
function AnimatedGoldText({ text, size = "text-[5rem]" }: { text: string; size?: string }) {
  return (
    <span className={`font-orbitron font-bold ${size} relative inline-block`}>
      <span className="relative z-10 text-[#e9d7c4] drop-shadow-[0_2px_8px_rgba(233,215,196,0.3)]">
        {text}
      </span>
      <motion.span
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: "linear-gradient(90deg, #e9d7c4, #FE9100, #a34e00, #e9d7c4)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: [0.25, 0.8, 0.25, 1],
        }}
      >
        {text}
      </motion.span>
    </span>
  );
}

// Ultra Premium Background (Black/Orange/Gold)
function UltraPremiumBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />

      <motion.div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(254,145,0,0.4) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="absolute inset-0">
        <motion.div
          className="absolute left-[15%] top-[10%] h-[800px] w-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(254,145,0,0.18) 0%, rgba(254,145,0,0.05) 40%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute right-[10%] bottom-[15%] h-[700px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(233,215,196,0.15) 0%, rgba(233,215,196,0.04) 40%, transparent 70%)",
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(163,78,0,0.12) 0%, rgba(163,78,0,0.03) 40%, transparent 70%)",
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <svg className="absolute inset-0 w-full h-full opacity-25">
        <defs>
          <linearGradient id="orangeLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(254,145,0,0)" />
            <stop offset="50%" stopColor="rgba(254,145,0,0.9)" />
            <stop offset="100%" stopColor="rgba(254,145,0,0)" />
          </linearGradient>
          <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(233,215,196,0)" />
            <stop offset="50%" stopColor="rgba(233,215,196,0.7)" />
            <stop offset="100%" stopColor="rgba(233,215,196,0)" />
          </linearGradient>
        </defs>
        
        {[20, 40, 60, 80].map((y, i) => (
          <motion.line
            key={i}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke={i % 2 === 0 ? "url(#orangeLine)" : "url(#goldLine)"}
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.2,
            }}
          />
        ))}
      </svg>

      {Array.from({ length: 50 }).map((_, i) => {
        const isOrange = i % 3 !== 0;
        const size = 1.5 + Math.random() * 2.5;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: isOrange ? "#FE9100" : "#e9d7c4",
              boxShadow: isOrange 
                ? `0 0 ${size * 8}px rgba(254,145,0,0.6)` 
                : `0 0 ${size * 6}px rgba(233,215,196,0.5)`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
          />
        );
      })}

      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="absolute top-0 left-0 h-[600px] w-[600px] bg-gradient-to-br from-[#FE9100]/12 via-[#FE9100]/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[600px] w-[600px] bg-gradient-to-tl from-[#e9d7c4]/10 via-[#e9d7c4]/4 to-transparent blur-3xl" />
      
      <motion.div
        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FE9100]/40 to-transparent"
        animate={{
          top: ["-1px", "100%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
    </div>
  );
}