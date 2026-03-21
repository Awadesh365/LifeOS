import React, { useState } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltIcon from "@mui/icons-material/Bolt";
import ShieldIcon from "@mui/icons-material/Shield";
import PublicIcon from "@mui/icons-material/Public";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import FireTruckIcon from "@mui/icons-material/FireTruck";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import RouteIcon from "@mui/icons-material/Route";
import PeopleIcon from "@mui/icons-material/People";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GavelIcon from "@mui/icons-material/Gavel";
import NatureIcon from "@mui/icons-material/Nature";
import SettingsIcon from "@mui/icons-material/Settings";
import VerifiedIcon from "@mui/icons-material/Verified";
import SpeedIcon from "@mui/icons-material/Speed";
import TranslateIcon from "@mui/icons-material/Translate";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

// ── Design tokens ─────────────────────────────────────────────
const C = {
  bg: "#FAFAFA",
  fg: "#0D1117",
  muted: "#667085",
  muted2: "#98A2B3",
  border: "rgba(216,224,234,0.9)",
  navy: "#1E2530",
  navyLight: "rgba(30,37,48,0.06)",
  primary: "#E55555",
  primaryLight: "rgba(229,85,85,0.08)",
  green: "#027900",
  blue: "#156BBA",
  yellow: "#C17400",
  purple: "#7215BA",
  teal: "#239CE8",
  surface: "rgba(255,255,255,0.92)",
};
// ── Shared section label ──────────────────────────────────────
const SectionBadge = ({ color = C.primary, children }: { color?: string; children: React.ReactNode }) => (
  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.5, py: 0.625, mb: 2.5, borderRadius: "9999px", border: `1px solid ${color}36`, bgcolor: `${color}10` }}>
    <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{children}</Typography>
  </Box>
);

const SectionHeading = ({ children, sx = {} }: { children: React.ReactNode; sx?: object }) => (
  <Typography sx={{ fontWeight: 800, fontSize: { xs: "2.4rem", md: "3.5rem", lg: "4rem" }, letterSpacing: "-0.05em", color: C.fg, lineHeight: 1.05, ...sx }}>{children}</Typography>
);

const SectionSub = ({ children }: { children: React.ReactNode }) => (
  <Typography sx={{ fontSize: { xs: "1.0625rem", md: "1.2rem" }, color: C.muted, lineHeight: 1.75, mt: 2 }}>{children}</Typography>
);

// ── Grid line background helper ───────────────────────────────
const GridBg = ({ opacity = 0.035 }: { opacity?: number }) => (
  <Box sx={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(30,37,48,${opacity}) 1px,transparent 1px),linear-gradient(90deg,rgba(30,37,48,${opacity}) 1px,transparent 1px)`, backgroundSize: "72px 72px", pointerEvents: "none" }} />
);

// ── Data ──────────────────────────────────────────────────────
const heroStats = [
  { value: "720+", label: "Departments" },
  { value: "12",   label: "Gov. modules" },
  { value: "99.9%",label: "Uptime SLA" },
  { value: "23",   label: "Languages" },
];

const modules = [
  { icon: <AccountTreeIcon sx={{ fontSize: 22 }} />,      label: "District Administration", desc: "District collector's office, sub-divisions, and tehsil management with full workflow automation.", color: C.blue, bg: "rgba(21,107,186,0.08)" },
  { icon: <AccountBalanceIcon sx={{ fontSize: 22 }} />,   label: "State Administration",    desc: "State secretariat, ministers, and IAS officer dashboards with legislative tracking.", color: C.navy, bg: "rgba(30,37,48,0.07)" },
  { icon: <PeopleIcon sx={{ fontSize: 22 }} />,           label: "Citizen Services",        desc: "Online grievance redressal, certificate issuance, utility payments, and service tracking.", color: C.green, bg: "rgba(2,121,0,0.08)" },
  { icon: <RouteIcon sx={{ fontSize: 22 }} />,            label: "Development Schemes",     desc: "Monitor scheme disbursements, beneficiary lists, and fund utilisation across all departments.", color: C.yellow, bg: "rgba(193,116,0,0.09)" },
  { icon: <FireTruckIcon sx={{ fontSize: 22 }} />,        label: "Emergency Management",    desc: "Real-time incident dispatch, ambulance tracking, fire response, and disaster alert systems.", color: C.primary, bg: "rgba(229,85,85,0.09)" },
  { icon: <GavelIcon sx={{ fontSize: 22 }} />,            label: "Revenue & Taxation",      desc: "Land records, property tax, stamp duty, and revenue court case management.", color: C.purple, bg: "rgba(114,21,186,0.08)" },
  { icon: <LocalHospitalIcon sx={{ fontSize: 22 }} />,    label: "Health Department",       desc: "Hospital capacity, patient flow, vaccination drives, and public health alerts.", color: "#C13838", bg: "rgba(193,56,56,0.08)" },
  { icon: <SchoolIcon sx={{ fontSize: 22 }} />,           label: "Education Department",    desc: "School performance, enrolment data, mid-day meal tracking, and exam results.", color: C.teal, bg: "rgba(35,156,232,0.08)" },
  { icon: <LocalPoliceIcon sx={{ fontSize: 22 }} />,      label: "Police & Law Enforcement",desc: "FIR filing, beat management, crime analytics, and station resource allocation.", color: C.navy, bg: "rgba(30,37,48,0.07)" },
  { icon: <NatureIcon sx={{ fontSize: 22 }} />,           label: "Environment",             desc: "Air quality index, water body monitoring, waste management, and pollution alerts.", color: C.green, bg: "rgba(2,121,0,0.08)" },
  { icon: <AnalyticsIcon sx={{ fontSize: 22 }} />,        label: "Analytics & Reports",     desc: "Custom dashboards, KPI tracking, data exports, and cross-department intelligence.", color: C.blue, bg: "rgba(21,107,186,0.08)" },
  { icon: <SettingsIcon sx={{ fontSize: 22 }} />,         label: "System Administration",   label2: "Admin", desc: "User roles, access control, audit logs, integrations, and platform configuration.", color: C.muted, bg: "rgba(102,112,133,0.08)" },
];

const howItWorks = [
  { step: "01", icon: <AccountBalanceIcon sx={{ fontSize: 28 }} />, title: "Select your department", desc: "Officers log in with their government credentials and select the relevant module — district, state, health, police, or any of the 12 specialised departments." },
  { step: "02", icon: <DashboardIcon sx={{ fontSize: 28 }} />,      title: "Monitor in real time",   desc: "A live, role-aware dashboard surfaces the data that matters most — incidents, KPIs, citizen complaints, resource utilisation, and scheme progress." },
  { step: "03", icon: <BoltIcon sx={{ fontSize: 28 }} />,           title: "Act & resolve",          desc: "Assign tasks, dispatch resources, approve requests, or escalate incidents — all within CityOS. Every action is logged for full accountability." },
];

const features = [
  { icon: <SpeedIcon sx={{ fontSize: 22 }} />,                      color: C.primary, bg: "rgba(229,85,85,0.09)", title: "Sub-60s Emergency Dispatch",    desc: "Incident-to-dispatch in under 60 seconds with automatic resource allocation and real-time tracking." },
  { icon: <ShieldIcon sx={{ fontSize: 22 }} />,                     color: C.navy,    bg: "rgba(30,37,48,0.07)", title: "Role-Based Access Control",      desc: "Granular permissions down to field-level. Every user sees only what their role permits — nothing more." },
  { icon: <TranslateIcon sx={{ fontSize: 22 }} />,                  color: C.blue,    bg: "rgba(21,107,186,0.08)", title: "23 Indian Languages",           desc: "All 22 scheduled languages plus English, with full RTL support for Urdu, Kashmiri, and Sindhi." },
  { icon: <AnalyticsIcon sx={{ fontSize: 22 }} />,                  color: C.purple,  bg: "rgba(114,21,186,0.08)", title: "Unified Analytics Engine",      desc: "Cross-department dashboards, custom KPI widgets, and one-click data exports in CSV and Excel." },
  { icon: <NotificationsActiveIcon sx={{ fontSize: 22 }} />,        color: C.yellow,  bg: "rgba(193,116,0,0.09)", title: "Citizen Alert System",          desc: "Push notifications, SMS, and in-app alerts for residents — watercuts, road closures, health drives." },
  { icon: <StorageIcon sx={{ fontSize: 22 }} />,                    color: C.green,   bg: "rgba(2,121,0,0.08)", title: "Offline-First Architecture",      desc: "Designed for low-connectivity regions. Data syncs automatically when network is restored." },
  { icon: <IntegrationInstructionsIcon sx={{ fontSize: 22 }} />,    color: C.teal,    bg: "rgba(35,156,232,0.08)", title: "Open API & Integrations",      desc: "Connect DigiLocker, UIDAI Aadhaar, PFMS, NIC systems, and third-party city sensors via REST APIs." },
  { icon: <VerifiedIcon sx={{ fontSize: 22 }} />,                   color: C.primary, bg: "rgba(229,85,85,0.09)", title: "MeITY Compliance Ready",        desc: "Built to NIC security standards with STQC-compatible audit trails and data localisation by default." },
];

const securityPoints = [
  "End-to-end TLS 1.3 encryption for all data in transit",
  "AES-256 encryption for all data at rest",
  "Multi-factor authentication for every officer login",
  "Complete audit trail — every action is timestamped and attributed",
  "Data residency within India — no data leaves sovereign servers",
  "Automated vulnerability scanning and penetration testing",
  "Session-level anomaly detection with instant lockout",
  "ISO 27001 and STQC-aligned security framework",
];

const languages = [
  "English", "हिन्दी", "বাংলা", "తెలుగు", "मराठी", "தமிழ்",
  "ગુજરાતી", "ಕನ್ನಡ", "മലയാളം", "ਪੰਜਾਬੀ", "ଓଡ଼ିଆ", "অসমীয়া",
  "اردو", "मैथिली", "संस्कृतम्", "कॉशुर", "नेपाली", "सिन्धी",
  "कोंकणी", "डोगरी", "মৈতৈলোন্", "ᱥᱟᱱᱛᱟᱲᱤ", "बड़ो",
];

const portals = [
  { id: "official", icon: <AccountBalanceIcon sx={{ fontSize: 22 }} />, label: "Government Official", desc: "Administrative access for public officers", iconBg: "rgba(30,37,48,0.08)", iconFg: C.navy, hoverBorder: C.navy, hoverBg: "rgba(30,37,48,0.03)" },
  { id: "citizen",  icon: <PersonIcon sx={{ fontSize: 22 }} />,         label: "Citizen Services",    desc: "Public portal for city residents",       iconBg: "rgba(2,121,0,0.09)",   iconFg: C.green, hoverBorder: C.green, hoverBg: "rgba(2,121,0,0.03)" },
];

// ─────────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("official");

  const handleContinue = () => navigate("/login", { state: { portal: selected } });

  return (
    <Box sx={{ bgcolor: C.bg, overflowX: "hidden" }}>

      {/* ══════════════════════════════════════════════════════
          TOP NAV
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, height: 60, display: "flex", alignItems: "center", px: { xs: "20px", md: "80px" }, justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, background: "rgba(250,250,250,0.9)", backdropFilter: "blur(14px)", zIndex: 100 }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box sx={{ width: 30, height: 30, borderRadius: "8px", background: "linear-gradient(135deg,#E55555 0%,#C13838 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(229,85,85,0.28)" }}>
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.85rem", lineHeight: 1 }}>C</Typography>
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: C.fg, letterSpacing: "-0.02em" }}>CityOS</Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
          {["Modules", "Features", "Security", "Languages"].map((l) => (
            <Button key={l} sx={{ textTransform: "none", color: C.muted, fontSize: "0.8125rem", fontWeight: 600, px: 1.5, py: 0.75, borderRadius: "8px", "&:hover": { bgcolor: C.navyLight, color: C.fg } }}>{l}</Button>
          ))}
        </Stack>

        <Button onClick={handleContinue} sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.8125rem", px: 2, py: 0.875, borderRadius: "9999px", border: `1px solid ${C.border}`, color: C.fg, background: "rgba(255,255,255,0.8)", "&:hover": { background: "#fff", borderColor: "rgba(30,37,48,0.25)" } }}>
          Sign in →
        </Button>
      </Box>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", pt: 8, pb: 6,
        backgroundImage: `radial-gradient(ellipse 80% 60% at 0% 0%,rgba(30,37,48,0.055) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 100% 100%,rgba(229,85,85,0.06) 0%,transparent 55%)` }}>
        <GridBg />
        <Container maxWidth="xl" sx={{ px: { xs: "20px", md: "80px" }, position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 6, lg: 10 }} alignItems="center">

            {/* LEFT */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Box sx={{ maxWidth: 680 }}>
                <SectionBadge><>⚡ Live City Infrastructure</></SectionBadge>

                <Typography sx={{ fontWeight: 800, fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4.2rem", lg: "4.8rem" }, lineHeight: 1.04, color: C.fg, letterSpacing: "-0.05em", mb: 1 }}>
                  One OS for every
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4.2rem", lg: "4.8rem" }, lineHeight: 1.04, letterSpacing: "-0.05em", mb: 3.5, background: "linear-gradient(120deg,#1E2530 0%,#E55555 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  department, officer,<br />and citizen.
                </Typography>

                <Typography sx={{ fontSize: { xs: "1rem", md: "1.125rem" }, color: C.muted, lineHeight: 1.7, maxWidth: 560, mb: 5 }}>
                  CityOS connects administrative nodes to real-time city intelligence. Track deployments, resource health, and emergency response from a single mission control view.
                </Typography>

                {/* Stats */}
                <Grid container spacing={2} sx={{ mb: 5 }}>
                  {heroStats.map((s) => (
                    <Grid size={{ xs: 6, sm: 3 }} key={s.label}>
                      <Box sx={{ p: "14px 16px", borderRadius: "14px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
                        <Typography sx={{ fontWeight: 800, fontSize: "1.6rem", color: C.fg, letterSpacing: "-0.04em", lineHeight: 1.1 }}>{s.value}</Typography>
                        <Typography sx={{ fontSize: "0.6875rem", color: C.muted, fontWeight: 500, mt: 0.4, lineHeight: 1.3 }}>{s.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Feature bullets */}
                <Stack spacing={1.5}>
                  {[
                    { icon: <PublicIcon sx={{ fontSize: 18 }} />,    dark: true,  text: "Statewide asset monitoring from a single dashboard" },
                    { icon: <AnalyticsIcon sx={{ fontSize: 18 }} />, dark: false, text: "Real-time intelligence across all city departments" },
                    { icon: <ShieldIcon sx={{ fontSize: 18 }} />,    dark: true,  text: "Role-based access with full government audit trail" },
                    { icon: <BoltIcon sx={{ fontSize: 18 }} />,      dark: false, text: "Emergency response & dispatch in under 60 seconds" },
                  ].map((f, i) => (
                    <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ width: 32, height: 32, borderRadius: "9px", bgcolor: f.dark ? C.navyLight : C.primaryLight, color: f.dark ? C.navy : C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f.icon}</Box>
                      <Typography sx={{ fontSize: "0.9rem", color: C.muted, fontWeight: 500 }}>{f.text}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* RIGHT — Access card */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Card elevation={0} sx={{ borderRadius: "24px", border: "1px solid rgba(216,224,234,0.8)", background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)", boxShadow: "0 32px 80px -24px rgba(16,24,40,0.18),0 0 0 1px rgba(216,224,234,0.5)", overflow: "hidden" }}>
                {/* Card header */}
                <Box sx={{ px: 4, pt: 4, pb: 3, borderBottom: `1px solid ${C.border}`, background: "linear-gradient(180deg,rgba(248,250,252,0.9) 0%,rgba(255,255,255,0) 100%)" }}>
                  <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg,#E55555 0%,#C13838 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(229,85,85,0.3)" }}>
                      <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1rem", lineHeight: 1 }}>C</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "0.9375rem", color: C.fg, letterSpacing: "-0.02em", lineHeight: 1.1 }}>CityOS</Typography>
                      <Typography sx={{ fontSize: "0.6875rem", color: C.muted, fontWeight: 500 }}>Secure Government Platform</Typography>
                    </Box>
                  </Stack>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.375rem", color: C.fg, letterSpacing: "-0.03em", lineHeight: 1.2, mb: 0.75 }}>Access portal</Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: C.muted, lineHeight: 1.6 }}>Choose the public agency or department you represent to continue to secure login.</Typography>
                </Box>

                {/* Portal options */}
                <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                  <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted2, mb: 1.5, px: 0.5 }}>Select your role</Typography>
                  <Stack spacing={1.5}>
                    {portals.map((p) => {
                      const active = selected === p.id;
                      return (
                        <Box key={p.id} onClick={() => setSelected(p.id)} sx={{ display: "flex", alignItems: "center", gap: 2, p: "14px 16px", borderRadius: "14px", border: "1.5px solid", borderColor: active ? p.hoverBorder : C.border, bgcolor: active ? p.hoverBg : "transparent", cursor: "pointer", transition: "all 0.18s ease", "&:hover": { borderColor: p.hoverBorder, bgcolor: p.hoverBg } }}>
                          <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: p.iconBg, color: p.iconFg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.icon}</Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: "0.9375rem", color: C.fg, letterSpacing: "-0.01em" }}>{p.label}</Typography>
                            <Typography sx={{ fontSize: "0.8rem", color: C.muted, mt: 0.2 }}>{p.desc}</Typography>
                          </Box>
                          <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid", borderColor: active ? p.hoverBorder : C.border, bgcolor: active ? p.hoverBorder : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s ease" }}>
                            {active && <CheckCircleIcon sx={{ fontSize: 14, color: "#fff" }} />}
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>

                {/* CTA */}
                <Box sx={{ px: 3, pb: 3 }}>
                  <Button fullWidth onClick={handleContinue} endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />} sx={{ mt: 1, py: 1.625, borderRadius: "14px", fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "-0.01em", textTransform: "none", background: "linear-gradient(135deg,#1E2530 0%,#2D3748 100%)", color: "#FFFFFF", boxShadow: "0 4px 20px -4px rgba(30,37,48,0.4)", transition: "all 0.18s ease", "&:hover": { boxShadow: "0 6px 28px -4px rgba(30,37,48,0.5)", transform: "translateY(-1px)" } }}>
                    Continue to Login
                  </Button>
                </Box>

                {/* Security note */}
                <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${C.border}`, background: "rgba(248,250,252,0.6)", display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                  <LockIcon sx={{ fontSize: 15, color: C.muted2, mt: "2px", flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, color: C.muted, mb: 0.2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Security note</Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: C.muted2, lineHeight: 1.5 }}>Sessions are protected with secure protocols and MFA verification for sensitive modules.</Typography>
                  </Box>
                </Box>
              </Card>

              {/* Trust badge */}
              <Box sx={{ mt: 2.5, display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
                <CheckCircleIcon sx={{ fontSize: 14, color: C.green }} />
                <Typography sx={{ fontSize: "0.75rem", color: C.muted2, fontWeight: 500 }}>Trusted by 200+ government agencies across India</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          TRUSTED BY STRIP
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, py: 3, bgcolor: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
        <Container maxWidth="xl" sx={{ px: { xs: "20px", md: "80px" } }}>
          <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="center" spacing={{ xs: 2, sm: 6 }} divider={<Box sx={{ width: "1px", height: 20, bgcolor: C.border, display: { xs: "none", sm: "block" } }} />}>
            {[
              { v: "200+",   l: "Government agencies" },
              { v: "50 Cr+", l: "Citizens served" },
              { v: "₹2,400Cr", l: "Schemes tracked" },
              { v: "28",     l: "States & UTs" },
            ].map((s) => (
              <Stack key={s.l} direction="row" alignItems="center" spacing={1.5}>
                <Typography sx={{ fontWeight: 800, fontSize: "1.75rem", color: C.fg, letterSpacing: "-0.04em" }}>{s.v}</Typography>
                <Typography sx={{ fontSize: "1rem", color: C.muted, fontWeight: 500 }}>{s.l}</Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          WHAT IS CITYOS
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, position: "relative", overflow: "hidden" }}>
        {/* Subtle radial accent top-right */}
        <Box sx={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,37,48,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" } }}>

          {/* ── Top: badge + heading centred ── */}
          <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
            <SectionBadge color={C.navy}>Platform Overview</SectionBadge>
            <SectionHeading sx={{ maxWidth: 760, mx: "auto" }}>
              The operating system<br />cities never had.
            </SectionHeading>
            <Typography sx={{ fontSize: { xs: "1.0625rem", md: "1.25rem" }, color: C.muted, lineHeight: 1.75, maxWidth: 640, mx: "auto", mt: 2.5 }}>
              India's government machinery runs across thousands of disconnected systems. CityOS unifies them into one coherent, real-time platform built specifically for Indian governance at every level.
            </Typography>
          </Box>

          {/* ── Bottom: bullets left | dark dashboard card right ── */}
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="stretch">

            {/* Left — bullet points */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3} sx={{ height: "100%", justifyContent: "center" }}>
                {[
                  { title: "Single sign-on", desc: "One login across all 12 government modules — no juggling portals." },
                  { title: "Works everywhere", desc: "Mobile, tablet, and desktop — optimised even for 2G networks." },
                  { title: "India's governance structure", desc: "Configured for all 3 tiers — union, state, and local bodies." },
                  { title: "Multilingual from day one", desc: "23 Indian languages built in, including full RTL script support." },
                ].map((item) => (
                  <Stack key={item.title} direction="row" spacing={2} alignItems="flex-start">
                    <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: C.navyLight, color: C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: "2px" }}>
                      <CheckCircleIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: "1.0625rem", color: C.fg, letterSpacing: "-0.01em", mb: 0.4 }}>{item.title}</Typography>
                      <Typography sx={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.6 }}>{item.desc}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            {/* Right — dark mock dashboard panel */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "linear-gradient(160deg, #1E2530 0%, #0D1117 100%)",
                boxShadow: "0 32px 80px -20px rgba(16,24,40,0.35)",
                p: { xs: 3, md: 4 },
              }}>
                {/* Mini topbar */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3, pb: 2.5, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ width: 28, height: 28, borderRadius: "7px", background: "linear-gradient(135deg,#E55555,#C13838)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.75rem", lineHeight: 1 }}>C</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em" }}>CityOS Dashboard</Typography>
                  </Stack>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {[C.primary, C.yellow, C.green].map((col, i) => (
                      <Box key={i} sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: col, opacity: 0.7 }} />
                    ))}
                  </Box>
                </Stack>

                {/* Stat cards grid */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
                  {[
                    { label: "Active Incidents", value: "24",   sub: "City-wide right now",    color: C.primary },
                    { label: "Resolved Today",   value: "156",  sub: "Avg. 18 min resolution", color: C.green   },
                    { label: "Schemes Active",   value: "47",   sub: "₹340Cr disbursed MTD",   color: C.blue    },
                    { label: "Safety Index",     value: "92%",  sub: "↑ 1.4% this quarter",    color: "#a78bfa" },
                  ].map((c) => (
                    <Box key={c.label} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.04)" }}>
                      <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", mb: 1 }}>{c.label}</Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: "2.25rem", color: c.color, letterSpacing: "-0.05em", lineHeight: 1 }}>{c.value}</Typography>
                      <Typography sx={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.35)", mt: 0.75 }}>{c.sub}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Mini progress bars */}
                <Box sx={{ p: 2.5, borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
                  <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", mb: 2 }}>Departmental Load</Typography>
                  <Stack spacing={1.75}>
                    {[
                      { label: "Hospitals",    pct: 42, color: C.primary },
                      { label: "Police",       pct: 67, color: C.blue    },
                      { label: "Schools",      pct: 81, color: C.yellow  },
                      { label: "Fire Stations",pct: 28, color: C.teal    },
                    ].map((r) => (
                      <Box key={r.label}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                          <Typography sx={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{r.label}</Typography>
                          <Typography sx={{ fontSize: "0.8125rem", fontWeight: 700, color: r.color }}>{r.pct}%</Typography>
                        </Stack>
                        <Box sx={{ height: 5, borderRadius: "9999px", bgcolor: "rgba(255,255,255,0.06)" }}>
                          <Box sx={{ height: "100%", width: `${r.pct}%`, borderRadius: "9999px", bgcolor: r.color, opacity: 0.8 }} />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          12 MODULES
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, position: "relative", bgcolor: "rgba(248,250,252,0.8)" }}>
        <GridBg opacity={0.028} />
        <Container maxWidth="xl" sx={{ px: { xs: "20px", md: "80px" }, position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <SectionBadge color={C.blue}>12 Specialised Modules</SectionBadge>
            <SectionHeading sx={{ maxWidth: 640, mx: "auto" }}>Every department.<br />One platform.</SectionHeading>
            <Typography sx={{ fontSize: "1.2rem", color: C.muted, lineHeight: 1.75, maxWidth: 600, mx: "auto", mt: 2 }}>
              From policing to public health — each module is purpose-built for the workflows, data, and compliance requirements of that department.
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {modules.map((m) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={m.label}>
                <Box sx={{ p: 4, height: "100%", borderRadius: "20px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(8px)", boxShadow: "0 2px 12px -4px rgba(16,24,40,0.06)", transition: "all 0.2s ease", cursor: "default", "&:hover": { boxShadow: "0 8px 28px -8px rgba(16,24,40,0.12)", transform: "translateY(-2px)", borderColor: `${m.color}40` } }}>
                  <Box sx={{ width: 46, height: 46, borderRadius: "13px", bgcolor: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>{m.icon}</Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.125rem", color: C.fg, letterSpacing: "-0.02em", lineHeight: 1.25, mb: 1.5 }}>{m.label}</Typography>
                  <Typography sx={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.65 }}>{m.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, position: "relative" }}>
        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" } }}>
          <Box sx={{ textAlign: "center", mb: 9 }}>
            <SectionBadge color={C.green}>How it works</SectionBadge>
            <SectionHeading>Up and running in minutes.</SectionHeading>
            <SectionSub>No complex setup. No long onboarding. Officers are productive from day one.</SectionSub>
          </Box>

          <Grid container spacing={4} alignItems="stretch">
            {howItWorks.map((h, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={h.step}>
                <Box sx={{ p: 4, height: "100%", borderRadius: "20px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.9)", position: "relative", overflow: "hidden" }}>
                  {/* Step number watermark */}
                  <Typography sx={{ position: "absolute", top: 12, right: 20, fontWeight: 900, fontSize: "4rem", color: "rgba(30,37,48,0.04)", lineHeight: 1, userSelect: "none" }}>{h.step}</Typography>
                  <Box sx={{ width: 52, height: 52, borderRadius: "14px", bgcolor: i === 0 ? C.navyLight : i === 1 ? C.primaryLight : "rgba(2,121,0,0.08)", color: i === 0 ? C.navy : i === 1 ? C.primary : C.green, display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>{h.icon}</Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.3rem", color: C.fg, letterSpacing: "-0.03em", mb: 1.75 }}>{h.title}</Typography>
                  <Typography sx={{ fontSize: "1.0625rem", color: C.muted, lineHeight: 1.7 }}>{h.desc}</Typography>
                  {i < howItWorks.length - 1 && (
                    <Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", right: -28, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}>
                      <ArrowForwardIcon sx={{ fontSize: 22, color: C.muted2 }} />
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, bgcolor: "rgba(248,250,252,0.8)", position: "relative" }}>
        <GridBg opacity={0.028} />
        <Container maxWidth="xl" sx={{ px: { xs: "20px", md: "80px" }, position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <SectionBadge color={C.purple}>Platform Capabilities</SectionBadge>
            <SectionHeading>Built for the complexity<br />of Indian governance.</SectionHeading>
            <SectionSub>Every feature designed around real workflows used by collectors, officers, and field staff across India.</SectionSub>
          </Box>

          <Grid container spacing={2.5}>
            {features.map((f) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={f.title}>
                <Box sx={{ p: "32px", height: "100%", borderRadius: "20px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.88)", transition: "all 0.2s ease", "&:hover": { boxShadow: "0 8px 28px -8px rgba(16,24,40,0.12)", transform: "translateY(-2px)" } }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: f.bg, color: f.color, display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5 }}>{f.icon}</Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.125rem", color: C.fg, letterSpacing: "-0.02em", mb: 1.5 }}>{f.title}</Typography>
                  <Typography sx={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.65 }}>{f.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          EMERGENCY HIGHLIGHT
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg,#0D1117 0%,#1E2530 50%,#0D1117 100%)" }}>
        <Box sx={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(229,85,85,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(229,85,85,0.06) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <Box sx={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(229,85,85,0.12) 0%,transparent 70%)" }} />
        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" }, position: "relative", zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <SectionBadge color={C.primary}>Emergency Response</SectionBadge>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "2.4rem", md: "3.5rem", lg: "4rem" }, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 1.05, mb: 2.5 }}>
                Every second counts.<br />CityOS makes them count.
              </Typography>
              <Typography sx={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, mb: 5 }}>
                From the moment an incident is reported to ambulance dispatch, fire response, or police deployment — the entire chain runs inside CityOS with sub-60 second response loops.
              </Typography>
              <Stack spacing={2}>
                {["Auto-dispatch based on proximity and availability", "Live GPS tracking for all emergency vehicles", "Multi-agency coordination in a shared ops room", "Automated escalation if response thresholds are breached"].map((t) => (
                  <Stack key={t} direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: C.primary, mt: "8px", flexShrink: 0 }} />
                    <Typography sx={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{t}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Mock response time card */}
              <Box sx={{ p: 4, borderRadius: "20px", border: "1px solid rgba(229,85,85,0.25)", background: "rgba(229,85,85,0.07)", backdropFilter: "blur(12px)" }}>
                <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", mb: 3 }}>Live Response Metrics</Typography>
                <Stack spacing={3}>
                  {[
                    { label: "Avg. Dispatch Time", value: "48s",  bar: 80,  color: C.primary },
                    { label: "Ambulance ETA",       value: "6.2m", bar: 55,  color: C.yellow },
                    { label: "Incident Resolution", value: "18m",  bar: 65,  color: C.blue },
                    { label: "Cases Closed Today",  value: "156",  bar: 90,  color: C.green },
                  ].map((r) => (
                    <Box key={r.label}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography sx={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{r.label}</Typography>
                        <Typography sx={{ fontSize: "1.375rem", fontWeight: 800, color: r.color, letterSpacing: "-0.03em" }}>{r.value}</Typography>
                      </Stack>
                      <Box sx={{ height: 5, borderRadius: "9999px", bgcolor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <Box sx={{ height: "100%", width: `${r.bar}%`, borderRadius: "9999px", bgcolor: r.color, opacity: 0.8 }} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          SECURITY
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, position: "relative" }}>
        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" } }}>
          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <SectionBadge color={C.navy}>Security & Compliance</SectionBadge>
              <SectionHeading>Government-grade<br />security, by default.</SectionHeading>
              <SectionSub>Every design decision in CityOS starts with security. Built for India's regulatory landscape, including MeITY, NIC, and STQC compliance requirements.</SectionSub>
              <Box sx={{ mt: 5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                {securityPoints.map((p) => (
                  <Stack key={p} direction="row" spacing={1.25} alignItems="flex-start">
                    <ShieldIcon sx={{ fontSize: 15, color: C.navy, mt: "3px", flexShrink: 0 }} />
                    <Typography sx={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.6 }}>{p}</Typography>
                  </Stack>
                ))}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                {[
                  { icon: <LockIcon sx={{ fontSize: 26 }} />,    title: "Zero-trust architecture",  desc: "Every request is verified regardless of network origin or prior trust.", color: C.navy, bg: C.navyLight },
                  { icon: <VerifiedIcon sx={{ fontSize: 26 }} />, title: "MFA enforcement",          desc: "All officer logins require multi-factor authentication — no exceptions.", color: C.green, bg: "rgba(2,121,0,0.08)" },
                  { icon: <StorageIcon sx={{ fontSize: 26 }} />,  title: "Data stays in India",      desc: "All data is stored on sovereign servers within Indian territory.", color: C.blue, bg: "rgba(21,107,186,0.08)" },
                  { icon: <AnalyticsIcon sx={{ fontSize: 26 }} />,title: "Full audit trail",         desc: "Every action is logged — who did what, when, and from where.", color: C.purple, bg: "rgba(114,21,186,0.08)" },
                ].map((s) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={s.title}>
                    <Box sx={{ p: 3, borderRadius: "16px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.9)", height: "100%" }}>
                      <Box sx={{ width: 46, height: 46, borderRadius: "12px", bgcolor: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>{s.icon}</Box>
                      <Typography sx={{ fontWeight: 700, fontSize: "1.125rem", color: C.fg, mb: 1 }}>{s.title}</Typography>
                      <Typography sx={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.6 }}>{s.desc}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          LANGUAGE SUPPORT
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, bgcolor: "rgba(248,250,252,0.8)", position: "relative" }}>
        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" } }}>
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <SectionBadge color={C.teal}>Language Support</SectionBadge>
            <SectionHeading>Speak every citizen's language.</SectionHeading>
            <SectionSub>All 22 constitutionally recognised languages of India, plus English — with complete RTL support for Urdu, Kashmiri, and Sindhi.</SectionSub>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
            {languages.map((lang) => (
              <Box key={lang} sx={{ px: 2.5, py: 1.125, borderRadius: "9999px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)", transition: "all 0.15s ease", "&:hover": { borderColor: C.teal, bgcolor: "rgba(35,156,232,0.05)", transform: "translateY(-1px)" } }}>
                <Typography sx={{ fontSize: "1.0625rem", color: C.fg, fontWeight: 600 }}>{lang}</Typography>
              </Box>
            ))}
          </Box>
          <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 5 }}>
            {[{ color: C.green, label: "RTL support for 3 languages" }, { color: C.blue, label: "Automatic script detection" }, { color: C.navy, label: "Browser language auto-detection" }].map((b) => (
              <Stack key={b.label} direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 15, color: b.color }} />
                <Typography sx={{ fontSize: "1rem", color: C.muted }}>{b.label}</Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 16 }, position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg,#1E2530 0%,#0D1117 100%)" }}>
        <Box sx={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)`, backgroundSize: "72px 72px" }} />
        <Box sx={{ position: "absolute", top: -160, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(229,85,85,0.1) 0%,transparent 70%)" }} />
        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" }, position: "relative", zIndex: 1, textAlign: "center" }}>
          <SectionBadge color={C.primary}>Get started today</SectionBadge>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: "2.2rem", md: "3.5rem" }, letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 1.08, mb: 2.5 }}>
            Your city deserves<br />better infrastructure.
          </Typography>
          <Typography sx={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 620, mx: "auto", mb: 7 }}>
            Join 200+ government agencies already running on CityOS. One platform. Every department. Full accountability.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button onClick={handleContinue} endIcon={<ArrowForwardIcon />} sx={{ textTransform: "none", fontWeight: 700, fontSize: "1rem", px: 4, py: 1.75, borderRadius: "14px", background: "linear-gradient(135deg,#E55555 0%,#C13838 100%)", color: "#fff", boxShadow: "0 8px 28px -6px rgba(229,85,85,0.5)", transition: "all 0.18s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 36px -6px rgba(229,85,85,0.6)" } }}>
              Access CityOS
            </Button>
            <Button sx={{ textTransform: "none", fontWeight: 600, fontSize: "1rem", px: 4, py: 1.75, borderRadius: "14px", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.3)" } }}>
              Request a demo
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <Box sx={{ bgcolor: "#0D1117", py: 5, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Container maxWidth="xl" sx={{ px: { xs: "20px", md: "80px" } }}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between" spacing={3}>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Box sx={{ width: 28, height: 28, borderRadius: "7px", background: "linear-gradient(135deg,#E55555 0%,#C13838 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.8rem", lineHeight: 1 }}>C</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "0.875rem", color: "#F9FAFB" }}>CityOS</Typography>
                <Typography sx={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.35)" }}>Smart City Management Platform</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ display: { xs: "none", md: "flex" } }}>
              {["Modules", "Security", "Languages", "Privacy Policy", "Terms"].map((l) => (
                <Typography key={l} sx={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", "&:hover": { color: "rgba(255,255,255,0.7)" }, transition: "color 0.15s" }}>{l}</Typography>
              ))}
            </Stack>
            <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>© 2026 CityOS · Government of India Initiative</Typography>
          </Stack>
        </Container>
      </Box>

    </Box>
  );
};

export default LandingPage;
