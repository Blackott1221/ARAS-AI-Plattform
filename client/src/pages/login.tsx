import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { GradientText } from "@/components/ui/gradient-text";
import { GlowButton } from "@/components/ui/glow-button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Users, Phone, ArrowRight, Eye, EyeOff, ShieldCheck, Cpu, Signal, Stars, Sparkles, KeyRound, Lock } from "lucide-react";
import { Link, useLocation } from "wouter";

/**
 * ARAS AI – Login (High‑End Redesign)
 *
 * CI‑Hinweise:
 *  - Headlines: Orbitron
 *  - Dark, luxuriös, mit subtilen Glow-Highlights
 *  - Primärakzent: ARAS Orange (#ff6a00) – nicht hard einsetzen, eher als Glow/Gradient
 *  - Secondary Neutrals: #0f1115, #16181d, #23262d
 */

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <Bot className="w-5 h-5" />,
      title: "Stimmen, die verkaufen",
      subtitle: "KI‑Outbound mit echter Gesprächsführung.",
      accent: "from-orange-400 to-amber-500",
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Eigenes ARAS‑Modell",
      subtitle: "Ein LLM je Anruf – hundertfach parallel.",
      accent: "from-blue-400 to-cyan-500",
    },
    {
      icon: <Signal className="w-5 h-5" />,
      title: "Live‑Leistung",
      subtitle: "Metriken in Echtzeit: Conversion, Dauer, Ergebnis.",
      accent: "from-emerald-400 to-teal-500",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Zielgruppenpräzision",
      subtitle: "Treffsichere Selektion & Kampagnensteuerung.",
      accent: "from-violet-400 to-fuchsia-500",
    },
  ];

  const taglines = [
    "ARAS AI – die menschenähnlichste Outbound‑KI",
    "Skaliere Vertrieb, nicht das Team.",
    "Gespräche, die wirklich konvertieren.",
    "Swiss‑backed. Performance‑driven.",
  ];

  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  // Partikelpositionen nur einmal berechnen – vermeidet Re‑Layouts
  const particles = useMemo(() => (
    Array.from({ length: 28 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 6,
    }))
  ), []);

  useEffect(() => {
    const f = setInterval(() => setCurrentFeatureIndex((p) => (p + 1) % features.length), 3200);
    return () => clearInterval(f);
  }, [features.length]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTaglineIndex((p) => (p + 1) % taglines.length), 4200);
    return () => clearInterval(t);
  }, [taglines.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulierter Login (Wireframe)
    setTimeout(() => {
      toast({
        title: "Erfolgreich angemeldet",
        description: "Willkommen zurück bei ARAS AI.",
      });
      setLocation("/app");
    }, 1400);
  };

  const handleForgotPassword = () => setLocation("/forgot-password");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f1115] text-foreground">
      {/* Hintergrund: dezentes Grid + Aurora + Glow */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid */}
        <div
          className="absolute inset-0 [background:radial-gradient(1200px_480px_at_50%_-10%,rgba(254,145,0,.08),transparent_60%),linear-gradient(to_bottom,transparent,transparent),repeating-linear-gradient(0deg,rgba(255,255,255,.05)_0_1px,transparent_1px_48px),repeating-linear-gradient(90deg,rgba(255,255,255,.04)_0_1px,transparent_1px_48px)]"
        />
        {/* Aurora */}
        <div className="absolute -inset-32 opacity-70 mix-blend-screen">
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute left-1/3 top-1/4 h-[42rem] w-[42rem] rounded-full blur-[90px] bg-gradient-to-tr from-orange-500/30 via-amber-300/20 to-fuchsia-400/20"
          />
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 14, repeat: Infinity, delay: 2 }}
            className="absolute right-1/4 top-1/3 h-[36rem] w-[36rem] rounded-full blur-[100px] bg-gradient-to-tr from-cyan-400/20 via-blue-400/20 to-purple-500/20"
          />
        </div>
        {/* Particles */}
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/8 shadow-[0_0_25px_rgba(255,170,90,.35)]"
            style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 6 + p.delay, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
        {/* Linke Bühne */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-10">
          <div className="relative w-full max-w-xl">
            {/* 3D‑Sphere Illusion */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-square rounded-[36px] border border-white/10 bg-gradient-to-br from-[#12151b] to-[#0c0f14] shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_10px_40px_rgba(0,0,0,.35)] overflow-hidden"
            >
              {/* Wire / orbit lines */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute inset-0 rounded-full border border-white/5" style={{ transform: `scale(${0.3 + i * 0.1})` }} />
                ))}
              </div>

              {/* Rotating glow ring */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full [mask-image:radial-gradient(closest-side,transparent_55%,black_56%)]">
                  <div className="absolute -inset-24 rounded-full blur-[60px] bg-gradient-to-r from-orange-500/40 via-amber-300/20 to-pink-500/30" />
                </div>
              </motion.div>

              {/* Headline + Tagline */}
              <div className="relative z-10 flex h-full flex-col justify-between p-8">
                <div>
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="font-orbitron text-5xl font-bold tracking-tight"
                  >
                    <GradientText>ARAS&nbsp;AI</GradientText>
                  </motion.h1>

                  <div className="mt-4 h-16 text-lg text-muted-foreground/90">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={currentTaglineIndex}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.45 }}
                        className="leading-relaxed"
                      >
                        {taglines[currentTaglineIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="mt-6 space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFeatureIndex}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="relative"
                    >
                      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-5 backdrop-blur-md">
                        <div className={`grid place-items-center rounded-xl p-3 text-white shadow-lg bg-gradient-to-r ${features[currentFeatureIndex].accent}`}>
                          {features[currentFeatureIndex].icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-orbitron text-base font-semibold">
                            {features[currentFeatureIndex].title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {features[currentFeatureIndex].subtitle}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Dots */}
                  <div className="flex justify-center gap-2 pt-1">
                    {features.map((_, index) => (
                      <motion.button
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${index === currentFeatureIndex ? "w-7 bg-white/90" : "w-3 bg-white/30"}`}
                        onClick={() => setCurrentFeatureIndex(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Feature ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { label: "Anrufe", value: "50K+", icon: <Phone className="w-4 h-4" /> },
                    { label: "Leads", value: "12K+", icon: <Users className="w-4 h-4" /> },
                    { label: "Umsatz", value: "$2M+", icon: <Sparkles className="w-4 h-4" /> },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -2, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 280 }}
                      className="rounded-xl border border-white/10 bg-white/[.04] p-3 text-center backdrop-blur-md"
                    >
                      <div className="mb-1 flex justify-center text-orange-300/90">{s.icon}</div>
                      <div className="font-orbitron text-lg font-bold">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Corner shine */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-400/20 blur-[80px]" />
            </motion.div>

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 flex items-center gap-2 text-sm text-white/70"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Swiss‑backed Infrastruktur • DSGVO‑konform • 24/7 Monitoring
            </motion.div>
          </div>
        </div>

        {/* Rechte Seite – Login */}
        <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="relative overflow-hidden border-white/10 bg-white/[.05] backdrop-blur-xl">
              {/* Animated border glow */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-[1px] rounded-xl"
              >
                <motion.div
                  animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="h-full w-full rounded-xl [background:linear-gradient(90deg,rgba(255,255,255,.14),rgba(255,138,76,.55),rgba(255,255,255,.14))] [background-size:200%_100%] opacity-30"
                />
              </motion.div>

              <CardContent className="relative z-10 p-8">
                <div className="mb-7 text-center">
                  <h1 className="mb-2 font-orbitron text-3xl font-bold">
                    <GradientText>Willkommen zurück</GradientText>
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Melde dich an, um die ARAS‑Konsole zu öffnen.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-sm">E‑Mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dein.name@unternehmen.com"
                      required
                      className="mt-1"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm">Passwort</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="pr-10"
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(c) => setRememberMe(c === true)}
                      />
                      <label htmlFor="remember" className="text-sm leading-none">
                        Angemeldet bleiben
                      </label>
                    </div>

                    <Button
                      type="button"
                      variant="link"
                      className="px-0 font-normal"
                      onClick={handleForgotPassword}
                    >
                      Passwort vergessen?
                    </Button>
                  </div>

                  <GlowButton type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Anmeldung läuft…" : (
                      <span className="inline-flex items-center gap-2">
                        Anmelden <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </GlowButton>
                </form>

                {/* Security hint */}
                <div className="mt-6 flex items-center gap-2 text-xs text-white/70">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Deine Daten sind Ende‑zu‑Ende verschlüsselt. 2FA in den Konto‑Einstellungen aktivieren.</span>
                </div>

                {/* Secondary CTA */}
                <div className="mt-7 text-center text-sm text-muted-foreground">
                  Noch kein Zugang?{" "}
                  <Link href="/signup" className="text-orange-300 hover:underline">
                    Kostenlose Testphase starten
                  </Link>
                </div>

                {/* Tiny badges */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { icon: <KeyRound className="h-3.5 w-3.5" />, label: "SSO demnächst" },
                    { icon: <Stars className="h-3.5 w-3.5" />, label: "Beta v1.0" },
                    { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: "Audit ready" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[.04] p-2 text-[11px] text-white/80">
                      {b.icon}
                      {b.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
