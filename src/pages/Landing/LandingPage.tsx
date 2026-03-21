import React, { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import CountUp from "react-countup";
import {
  Box,
  Card,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
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
};

// ── Animation system ──────────────────────────────────────────
// Premium easing curves
const ease    = [0.22, 1, 0.36, 1]    as const; // expo out — snappy
const easeOut = [0.16, 1, 0.3, 1]     as const; // softer expo out
const easeSpr = [0.34, 1.56, 0.64, 1] as const; // spring-like overshoot

const V = {
  fadeUp: {
    hidden: { opacity: 0, y: 56, scale: 0.97, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.85, ease } },
  },
  fadeIn: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeOut } },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -80, scale: 0.97 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.9, ease } },
  },
  slideRight: {
    hidden: { opacity: 0, x: 80, scale: 0.97 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.9, ease } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.82, y: 28 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.75, ease: easeSpr } },
  },
  stagger:     { hidden: {}, visible: { transition: { staggerChildren: 0.085, delayChildren: 0.04 } } },
  staggerFast: { hidden: {}, visible: { transition: { staggerChildren: 0.042, delayChildren: 0.03 } } },
  staggerSlow: { hidden: {}, visible: { transition: { staggerChildren: 0.13,  delayChildren: 0.08 } } },
  // Card: slight rotation + scale gives kinetic "falling into place" feel
  card: {
    hidden: { opacity: 0, y: 40, scale: 0.94, rotate: -1.2 },
    visible: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.62, ease: easeSpr } },
  },
  pill: {
    hidden: { opacity: 0, scale: 0.65, y: 18 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.42, ease: easeSpr } },
  },
};

// ── Scroll-triggered wrapper ──────────────────────────────────
const InView = ({
  children,
  variants = V.fadeUp,
  style,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants?: any;
  style?: React.CSSProperties;
}) => (
  <motion.div
    variants={variants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    style={style}
  >
    {children}
  </motion.div>
);

// ── Stagger section ───────────────────────────────────────────
const StaggerIn = ({
  children,
  variants = V.stagger,
  style,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants?: any;
  style?: React.CSSProperties;
}) => (
  <motion.div
    variants={variants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    style={style}
  >
    {children}
  </motion.div>
);

// ── Typewriter hook ───────────────────────────────────────────
const useTypewriter = (text: string, startDelay = 700, speed = 26) => {
  const [displayed, setDisplayed] = React.useState("");
  const [started, setStarted] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);
  React.useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [started, text, speed]);
  return displayed;
};

// ── 3D Tilt Card ──────────────────────────────────────────────
const TiltCard = ({
  children,
  style,
  maxTilt = 7,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  maxTilt?: number;
}) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [maxTilt, -maxTilt]), { stiffness: 420, damping: 44, mass: 0.38 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-maxTilt, maxTilt]), { stiffness: 420, damping: 44, mass: 0.38 });
  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) / r.width);
    my.set((e.clientY - r.top - r.height / 2) / r.height);
  };
  const onLeave = () => { mx.set(0); my.set(0); };
  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000, ...style }}
    >
      {children}
    </motion.div>
  );
};

// ── Floating particles ────────────────────────────────────────
const PARTICLES = [
  { id:0,  x:5,  y:10, size:4,  dur:10, delay:0,   color:C.primary,  shape:"ring"  },
  { id:1,  x:15, y:25, size:3,  dur:13, delay:1.8, color:C.navy,     shape:"dot"   },
  { id:2,  x:25, y:5,  size:5,  dur:9,  delay:0.5, color:C.blue,     shape:"ring"  },
  { id:3,  x:38, y:18, size:2,  dur:14, delay:3.2, color:C.primary,  shape:"dot"   },
  { id:4,  x:50, y:8,  size:4,  dur:11, delay:1.2, color:C.teal,     shape:"ring"  },
  { id:5,  x:62, y:30, size:3,  dur:8,  delay:2.5, color:C.navy,     shape:"dot"   },
  { id:6,  x:72, y:12, size:5,  dur:12, delay:0.8, color:C.primary,  shape:"ring"  },
  { id:7,  x:82, y:22, size:2,  dur:10, delay:4.1, color:C.blue,     shape:"dot"   },
  { id:8,  x:90, y:40, size:4,  dur:9,  delay:1.5, color:C.teal,     shape:"ring"  },
  { id:9,  x:8,  y:55, size:3,  dur:13, delay:3.8, color:C.navy,     shape:"dot"   },
  { id:10, x:20, y:68, size:5,  dur:11, delay:0.3, color:C.primary,  shape:"ring"  },
  { id:11, x:33, y:75, size:2,  dur:8,  delay:2.0, color:C.blue,     shape:"dot"   },
  { id:12, x:45, y:82, size:4,  dur:14, delay:4.5, color:C.teal,     shape:"ring"  },
  { id:13, x:58, y:62, size:3,  dur:10, delay:1.0, color:C.primary,  shape:"dot"   },
  { id:14, x:70, y:88, size:5,  dur:12, delay:3.0, color:C.navy,     shape:"ring"  },
  { id:15, x:80, y:70, size:2,  dur:9,  delay:0.6, color:C.blue,     shape:"dot"   },
  { id:16, x:92, y:55, size:4,  dur:11, delay:2.2, color:C.primary,  shape:"ring"  },
  { id:17, x:55, y:48, size:3,  dur:13, delay:1.6, color:C.teal,     shape:"dot"   },
  { id:18, x:28, y:42, size:6,  dur:16, delay:0.9, color:C.primary,  shape:"ring"  },
  { id:19, x:75, y:45, size:6,  dur:15, delay:3.5, color:C.navy,     shape:"ring"  },
] as const;

// ── Premium curtain-reveal heading ────────────────────────────
// Each word slides up from behind an overflow:hidden mask — the
// same technique used by Apple, Stripe and Linear landing pages.
const AnimWords = ({ text, sx = {}, tag = "h2" }: { text: string; sx?: object; tag?: string }) => {
  const words = text.split(" ");
  return (
    <motion.div
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.058, delayChildren: 0 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
    >
      <Typography
        component={tag as "h2"}
        sx={{ fontWeight: 800, fontSize: { xs: "2.4rem", md: "3.5rem", lg: "4rem" }, letterSpacing: "-0.05em", color: C.fg, lineHeight: 1.1, ...sx }}
      >
        {words.map((word, i) => (
          // outer span = the "mask" — hides the y-overflow
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.24em" }}>
            <motion.span
              variants={{
                hidden: { y: "115%", opacity: 0, rotate: 3 },
                visible: { y: "0%", opacity: 1, rotate: 0, transition: { duration: 0.72, ease } },
              }}
              style={{ display: "block" }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </Typography>
    </motion.div>
  );
};

// ── Magnetic Button wrapper ────────────────────────────────────
const MagButton = ({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 520, damping: 38, mass: 0.45 });
  const y = useSpring(0, { stiffness: 520, damping: 38, mass: 0.45 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x, y, display: "inline-block" }}>
      {children}
    </motion.div>
  );
};

// ── Premium double-ring live dot ──────────────────────────────
const PulseDot = ({ color = C.green }: { color?: string }) => (
  <Box sx={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
    {/* slow outer ring */}
    <motion.div
      animate={{ scale: [1, 3.8, 1], opacity: [0.55, 0, 0.55] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
      style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: color }}
    />
    {/* faster middle ring */}
    <motion.div
      animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0.55 }}
      style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: color }}
    />
    {/* solid core */}
    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color, position: "relative", zIndex: 2, boxShadow: `0 0 8px ${color}cc` }} />
  </Box>
);

// ── Animated progress bar with shimmer sweep ──────────────────
const AnimBar = ({
  pct,
  color,
  delay = 0,
  height = 5,
}: {
  pct: number;
  color: string;
  delay?: number;
  height?: number;
}) => (
  <Box sx={{ height, borderRadius: 9999, bgcolor: `${color}18`, overflow: "hidden", position: "relative" }}>
    <motion.div
      initial={{ width: "0%", opacity: 0.7 }}
      whileInView={{ width: `${pct}%`, opacity: 1 }}
      transition={{ duration: 1.5, ease: easeOut, delay }}
      viewport={{ once: true, margin: "-50px" }}
      style={{ height: "100%", borderRadius: 9999, background: `linear-gradient(90deg,${color}cc,${color})`, position: "relative", overflow: "hidden" }}
    >
      {/* shimmer sweep after bar fills */}
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: "250%" }}
        transition={{ duration: 0.65, ease: easeOut, delay: delay + 1.55 }}
        viewport={{ once: true }}
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "45%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)", borderRadius: 9999 }}
      />
    </motion.div>
  </Box>
);

// ── Grid background ───────────────────────────────────────────
const GridBg = ({ opacity = 0.035 }: { opacity?: number }) => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      backgroundImage: `linear-gradient(rgba(30,37,48,${opacity}) 1px,transparent 1px),linear-gradient(90deg,rgba(30,37,48,${opacity}) 1px,transparent 1px)`,
      backgroundSize: "72px 72px",
      pointerEvents: "none",
    }}
  />
);

// ── Section badge ─────────────────────────────────────────────
const SectionBadge = ({
  color = C.primary,
  children,
}: {
  color?: string;
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.75,
      px: 1.5,
      py: 0.625,
      mb: 2.5,
      borderRadius: "9999px",
      border: `1px solid ${color}36`,
      bgcolor: `${color}10`,
    }}
  >
    <Typography
      sx={{
        fontSize: "0.6875rem",
        fontWeight: 700,
        color,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}
    >
      {children}
    </Typography>
  </Box>
);

const SectionHeading = ({
  children,
  sx = {},
}: {
  children: React.ReactNode;
  sx?: object;
}) => (
  <Typography
    sx={{
      fontWeight: 800,
      fontSize: { xs: "2.4rem", md: "3.5rem", lg: "4rem" },
      letterSpacing: "-0.05em",
      color: C.fg,
      lineHeight: 1.05,
      ...sx,
    }}
  >
    {children}
  </Typography>
);

const SectionSub = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{ fontSize: { xs: "1.0625rem", md: "1.2rem" }, color: C.muted, lineHeight: 1.75, mt: 2 }}
  >
    {children}
  </Typography>
);

// ── Data ──────────────────────────────────────────────────────
const heroStats = [
  { end: 720, suffix: "+", label: "Departments" },
  { end: 12, suffix: "", label: "Gov. modules" },
  { end: 99.9, suffix: "%", decimals: 1, label: "Uptime SLA" },
  { end: 23, suffix: "", label: "Languages" },
];

const trustNumbers = [
  { end: 200, suffix: "+", label: "Government agencies" },
  { end: 50, suffix: " Cr+", label: "Citizens served" },
  { end: 2400, prefix: "₹", suffix: "Cr", label: "Schemes tracked" },
  { end: 28, suffix: "", label: "States & UTs" },
];

const modules = [
  {
    icon: <AccountTreeIcon sx={{ fontSize: 22 }} />,
    label: "District Administration",
    desc: "District collector's office, sub-divisions, and tehsil management with full workflow automation.",
    color: C.blue,
    bg: "rgba(21,107,186,0.08)",
  },
  {
    icon: <AccountBalanceIcon sx={{ fontSize: 22 }} />,
    label: "State Administration",
    desc: "State secretariat, ministers, and IAS officer dashboards with legislative tracking.",
    color: C.navy,
    bg: "rgba(30,37,48,0.07)",
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 22 }} />,
    label: "Citizen Services",
    desc: "Online grievance redressal, certificate issuance, utility payments, and service tracking.",
    color: C.green,
    bg: "rgba(2,121,0,0.08)",
  },
  {
    icon: <RouteIcon sx={{ fontSize: 22 }} />,
    label: "Development Schemes",
    desc: "Monitor scheme disbursements, beneficiary lists, and fund utilisation across all departments.",
    color: C.yellow,
    bg: "rgba(193,116,0,0.09)",
  },
  {
    icon: <FireTruckIcon sx={{ fontSize: 22 }} />,
    label: "Emergency Management",
    desc: "Real-time incident dispatch, ambulance tracking, fire response, and disaster alert systems.",
    color: C.primary,
    bg: "rgba(229,85,85,0.09)",
  },
  {
    icon: <GavelIcon sx={{ fontSize: 22 }} />,
    label: "Revenue & Taxation",
    desc: "Land records, property tax, stamp duty, and revenue court case management.",
    color: C.purple,
    bg: "rgba(114,21,186,0.08)",
  },
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 22 }} />,
    label: "Health Department",
    desc: "Hospital capacity, patient flow, vaccination drives, and public health alerts.",
    color: "#C13838",
    bg: "rgba(193,56,56,0.08)",
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 22 }} />,
    label: "Education Department",
    desc: "School performance, enrolment data, mid-day meal tracking, and exam results.",
    color: C.teal,
    bg: "rgba(35,156,232,0.08)",
  },
  {
    icon: <LocalPoliceIcon sx={{ fontSize: 22 }} />,
    label: "Police & Law Enforcement",
    desc: "FIR filing, beat management, crime analytics, and station resource allocation.",
    color: C.navy,
    bg: "rgba(30,37,48,0.07)",
  },
  {
    icon: <NatureIcon sx={{ fontSize: 22 }} />,
    label: "Environment",
    desc: "Air quality index, water body monitoring, waste management, and pollution alerts.",
    color: C.green,
    bg: "rgba(2,121,0,0.08)",
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 22 }} />,
    label: "Analytics & Reports",
    desc: "Custom dashboards, KPI tracking, data exports, and cross-department intelligence.",
    color: C.blue,
    bg: "rgba(21,107,186,0.08)",
  },
  {
    icon: <SettingsIcon sx={{ fontSize: 22 }} />,
    label: "System Administration",
    desc: "User roles, access control, audit logs, integrations, and platform configuration.",
    color: C.muted,
    bg: "rgba(102,112,133,0.08)",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: <AccountBalanceIcon sx={{ fontSize: 28 }} />,
    title: "Select your department",
    desc: "Officers log in with their government credentials and select the relevant module — district, state, health, police, or any of the 12 specialised departments.",
  },
  {
    step: "02",
    icon: <DashboardIcon sx={{ fontSize: 28 }} />,
    title: "Monitor in real time",
    desc: "A live, role-aware dashboard surfaces the data that matters most — incidents, KPIs, citizen complaints, resource utilisation, and scheme progress.",
  },
  {
    step: "03",
    icon: <BoltIcon sx={{ fontSize: 28 }} />,
    title: "Act & resolve",
    desc: "Assign tasks, dispatch resources, approve requests, or escalate incidents — all within CityOS. Every action is logged for full accountability.",
  },
];

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 22 }} />,
    color: C.primary,
    bg: "rgba(229,85,85,0.09)",
    title: "Sub-60s Emergency Dispatch",
    desc: "Incident-to-dispatch in under 60 seconds with automatic resource allocation and real-time tracking.",
  },
  {
    icon: <ShieldIcon sx={{ fontSize: 22 }} />,
    color: C.navy,
    bg: "rgba(30,37,48,0.07)",
    title: "Role-Based Access Control",
    desc: "Granular permissions down to field-level. Every user sees only what their role permits — nothing more.",
  },
  {
    icon: <TranslateIcon sx={{ fontSize: 22 }} />,
    color: C.blue,
    bg: "rgba(21,107,186,0.08)",
    title: "23 Indian Languages",
    desc: "All 22 scheduled languages plus English, with full RTL support for Urdu, Kashmiri, and Sindhi.",
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 22 }} />,
    color: C.purple,
    bg: "rgba(114,21,186,0.08)",
    title: "Unified Analytics Engine",
    desc: "Cross-department dashboards, custom KPI widgets, and one-click data exports in CSV and Excel.",
  },
  {
    icon: <NotificationsActiveIcon sx={{ fontSize: 22 }} />,
    color: C.yellow,
    bg: "rgba(193,116,0,0.09)",
    title: "Citizen Alert System",
    desc: "Push notifications, SMS, and in-app alerts for residents — watercuts, road closures, health drives.",
  },
  {
    icon: <StorageIcon sx={{ fontSize: 22 }} />,
    color: C.green,
    bg: "rgba(2,121,0,0.08)",
    title: "Offline-First Architecture",
    desc: "Designed for low-connectivity regions. Data syncs automatically when network is restored.",
  },
  {
    icon: <IntegrationInstructionsIcon sx={{ fontSize: 22 }} />,
    color: C.teal,
    bg: "rgba(35,156,232,0.08)",
    title: "Open API & Integrations",
    desc: "Connect DigiLocker, UIDAI Aadhaar, PFMS, NIC systems, and third-party city sensors via REST APIs.",
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 22 }} />,
    color: C.primary,
    bg: "rgba(229,85,85,0.09)",
    title: "MeITY Compliance Ready",
    desc: "Built to NIC security standards with STQC-compatible audit trails and data localisation by default.",
  },
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
  {
    id: "official",
    icon: <AccountBalanceIcon sx={{ fontSize: 22 }} />,
    label: "Government Official",
    desc: "Administrative access for public officers",
    iconBg: "rgba(30,37,48,0.08)",
    iconFg: C.navy,
    hoverBorder: C.navy,
    hoverBg: "rgba(30,37,48,0.03)",
  },
  {
    id: "citizen",
    icon: <PersonIcon sx={{ fontSize: 22 }} />,
    label: "Citizen Services",
    desc: "Public portal for city residents",
    iconBg: "rgba(2,121,0,0.09)",
    iconFg: C.green,
    hoverBorder: C.green,
    hoverBg: "rgba(2,121,0,0.03)",
  },
];

// ─────────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("official");
  const [heroMouse, setHeroMouse] = useState({ x: -500, y: -500 });
  const [liveStats, setLiveStats] = useState({ incidents: 24, resolved: 156, schemes: 47, safety: 92 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const blob1Y = useTransform(scrollY, [0, 800], [0, -100]);
  const blob2Y = useTransform(scrollY, [0, 800], [0, -60]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, -60]);

  const heroSubtitle = useTypewriter(
    "CityOS connects administrative nodes to real-time city intelligence. Track deployments, resource health, and emergency response from a single mission control view.",
    1100,
    22
  );

  // Live dashboard ticker — numbers breathe every 4s
  React.useEffect(() => {
    const iv = setInterval(() => {
      setLiveStats((p) => ({
        incidents: Math.max(18, p.incidents + (Math.random() > 0.55 ? 1 : -1)),
        resolved: p.resolved + (Math.random() > 0.4 ? 1 : 0),
        schemes: Math.max(40, p.schemes + (Math.random() > 0.7 ? 1 : 0)),
        safety: Math.min(99, Math.max(88, p.safety + (Math.random() > 0.6 ? 0.1 : -0.1))),
      }));
    }, 3800);
    return () => clearInterval(iv);
  }, []);

  const handleContinue = () => navigate("/login", { state: { portal: selected } });

  return (
    <Box sx={{ bgcolor: C.bg, overflowX: "hidden" }}>

      {/* ══ SCROLL PROGRESS BAR ════════════════════════════════ */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, #E55555 0%, #C13838 50%, #E55555 100%)",
          scaleX: scrollYProgress, transformOrigin: "left", zIndex: 9999,
        }}
      />

      {/* ══ TOP NAV — slides down on load ══════════════════════ */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.85, ease }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}
      >
        <Box
          sx={{
            height: 60,
            display: "flex",
            alignItems: "center",
            px: { xs: "20px", md: "80px" },
            justifyContent: "space-between",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(250,250,250,0.9)",
            backdropFilter: "blur(14px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
          >
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Box
                sx={{
                  width: 30, height: 30, borderRadius: "8px",
                  background: "linear-gradient(135deg,#E55555 0%,#C13838 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(229,85,85,0.28)",
                }}
              >
                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.85rem", lineHeight: 1 }}>C</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: C.fg, letterSpacing: "-0.02em" }}>CityOS</Typography>
            </Stack>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
              {["Modules", "Features", "Security", "Languages"].map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                >
                  <Button
                    sx={{
                      textTransform: "none", color: C.muted, fontSize: "0.8125rem",
                      fontWeight: 600, px: 1.5, py: 0.75, borderRadius: "8px",
                      "&:hover": { bgcolor: C.navyLight, color: C.fg },
                    }}
                  >
                    {l}
                  </Button>
                </motion.div>
              ))}
            </Stack>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleContinue}
                sx={{
                  textTransform: "none", fontWeight: 700, fontSize: "0.8125rem",
                  px: 2, py: 0.875, borderRadius: "9999px", border: `1px solid ${C.border}`,
                  color: C.fg, background: "rgba(255,255,255,0.8)",
                  "&:hover": { background: "#fff", borderColor: "rgba(30,37,48,0.25)" },
                }}
              >
                Sign in →
              </Button>
            </motion.div>
          </motion.div>
        </Box>
      </motion.div>

      {/* ══ HERO ═══════════════════════════════════════════════ */}
      <Box
        ref={heroRef}
        onMouseMove={(e) => {
          const r = heroRef.current?.getBoundingClientRect();
          if (r) setHeroMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onMouseLeave={() => setHeroMouse({ x: -500, y: -500 })}
        sx={{
          minHeight: "100vh", display: "flex", alignItems: "center",
          position: "relative", pt: 8, pb: 6, overflow: "hidden",
          backgroundImage: `radial-gradient(ellipse 80% 60% at 0% 0%,rgba(30,37,48,0.055) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 100% 100%,rgba(229,85,85,0.06) 0%,transparent 55%)`,
        }}
      >
        <GridBg />

        {/* Mouse spotlight */}
        <Box
          sx={{
            position: "absolute", pointerEvents: "none", zIndex: 0,
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(229,85,85,0.11) 0%, transparent 68%)",
            transition: "left 0.06s ease, top 0.06s ease",
            left: heroMouse.x - 250,
            top: heroMouse.y - 250,
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            animate={{
              y: [0, -36, 10, -18, 0],
              x: [0, p.id % 2 === 0 ? 16 : -14, 6, p.id % 2 === 0 ? -8 : 10, 0],
              opacity: [0.18, 0.65, 0.35, 0.55, 0.18],
              rotate: p.shape === "ring" ? [0, 90, 180, 270, 360] : [0, 0, 0, 0, 0],
              scale: [1, 1.35, 0.85, 1.2, 1],
            }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size, pointerEvents: "none", zIndex: 0,
              borderRadius: "50%",
              background: p.shape === "ring" ? "transparent" : p.color,
              border: p.shape === "ring" ? `1.5px solid ${p.color}` : "none",
              boxShadow: p.shape === "dot" ? `0 0 ${p.size * 3}px ${p.color}55` : "none",
              opacity: 0.4,
            }}
          />
        ))}

        {/* Floating animated orbs — 5 layers for rich depth */}
        <motion.div
          style={{ position: "absolute", top: "-5%", left: "-12%", width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,37,48,0.09) 0%, transparent 60%)", pointerEvents: "none", y: blob1Y }}
          animate={{ scale: [1, 1.1, 0.95, 1], x: [0, 30, -10, 0], rotate: [0, 8, -4, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ position: "absolute", bottom: "-8%", right: "-14%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(229,85,85,0.09) 0%, transparent 60%)", pointerEvents: "none", y: blob2Y }}
          animate={{ scale: [1, 1.12, 0.93, 1], x: [0, -30, 12, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          style={{ position: "absolute", top: "35%", left: "38%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(21,107,186,0.06) 0%, transparent 65%)", pointerEvents: "none" }}
          animate={{ scale: [1, 1.18, 0.88, 1], y: [0, -40, 16, 0], x: [0, 20, -10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          style={{ position: "absolute", top: "10%", right: "10%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(114,21,186,0.05) 0%, transparent 65%)", pointerEvents: "none" }}
          animate={{ scale: [1, 1.25, 0.85, 1], y: [0, -20, 30, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div
          style={{ position: "absolute", bottom: "20%", left: "20%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(35,156,232,0.07) 0%, transparent 65%)", pointerEvents: "none" }}
          animate={{ scale: [1, 1.3, 0.9, 1], x: [0, -18, 25, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        <Container maxWidth="xl" sx={{ px: { xs: "20px", md: "80px" }, position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 6, lg: 10 }} alignItems="center">

            {/* LEFT — headline */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <motion.div style={{ y: heroTextY }}>
              <Box sx={{ maxWidth: 680 }}>

                {/* Badge — bounces in */}
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.65, ease: easeSpr, delay: 0.05 }}
                >
                  <SectionBadge>⚡ Live City Infrastructure</SectionBadge>
                </motion.div>

                {/* Headline — word-by-word curtain reveal */}
                <Box sx={{ mb: 0.5 }}>
                  {/* "One OS for every" — 4 words, plain dark */}
                  <motion.div
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
                    initial="hidden"
                    animate="visible"
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4.2rem", lg: "4.8rem" }, lineHeight: 1.04, color: C.fg, letterSpacing: "-0.05em" }}>
                      {["One", "OS", "for", "every"].map((w, i) => (
                        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.22em" }}>
                          <motion.span
                            variants={{ hidden: { y: "115%", opacity: 0 }, visible: { y: "0%", opacity: 1, transition: { duration: 0.75, ease } } }}
                            style={{ display: "block" }}
                          >{w}</motion.span>
                        </span>
                      ))}
                    </Typography>
                  </motion.div>

                  {/* "department, officer, and citizen." — gradient shimmer words */}
                  <motion.div
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.075, delayChildren: 0.42 } } }}
                    initial="hidden"
                    animate="visible"
                    style={{ marginBottom: "1.2rem" }}
                  >
                    <Typography sx={{
                      fontWeight: 800, fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4.2rem", lg: "4.8rem" },
                      lineHeight: 1.04, letterSpacing: "-0.05em",
                      background: "linear-gradient(120deg,#1E2530 0%,#E55555 40%,#C13838 55%,#1E2530 100%)",
                      backgroundSize: "260% 100%",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      animation: "heroShimmer 5s ease infinite",
                      "@keyframes heroShimmer": {
                        "0%": { backgroundPosition: "0% 50%" },
                        "50%": { backgroundPosition: "100% 50%" },
                        "100%": { backgroundPosition: "0% 50%" },
                      },
                    }}>
                      {["department,", "officer,", "and", "citizen."].map((w, i) => (
                        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.22em" }}>
                          <motion.span
                            variants={{ hidden: { y: "115%", opacity: 0 }, visible: { y: "0%", opacity: 1, transition: { duration: 0.78, ease } } }}
                            style={{ display: "block" }}
                          >{w}</motion.span>
                        </span>
                      ))}
                    </Typography>
                  </motion.div>
                </Box>

                {/* Subtext — typewriter effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.125rem" }, color: C.muted,
                      lineHeight: 1.7, maxWidth: 560, mb: 5, minHeight: "5em",
                    }}
                  >
                    {heroSubtitle}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      style={{ display: "inline-block", width: 2, height: "1em", background: C.primary, marginLeft: 2, verticalAlign: "text-bottom", borderRadius: 1 }}
                    />
                  </Typography>
                </motion.div>

                {/* Stats — count up + stagger */}
                <motion.div
                  variants={V.stagger}
                  initial="hidden"
                  animate="visible"
                  transition={{ delayChildren: 0.7 }}
                >
                  <Grid container spacing={2} sx={{ mb: 5 }}>
                    {heroStats.map((s) => (
                      <Grid size={{ xs: 6, sm: 3 }} key={s.label}>
                        <motion.div variants={V.card}>
                          <TiltCard style={{ height: "100%", position: "relative" }}>
                          <Box
                            sx={{
                              p: "14px 16px", borderRadius: "14px",
                              border: `1px solid ${C.border}`,
                              background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)",
                              position: "relative", overflow: "hidden",
                              transition: "border-color 0.2s, box-shadow 0.2s",
                              "&:hover": { borderColor: `${C.primary}50`, boxShadow: `0 8px 24px -8px ${C.primary}28` },
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 800, fontSize: "1.6rem", color: C.fg,
                                letterSpacing: "-0.04em", lineHeight: 1.1,
                              }}
                            >
                              <CountUp
                                start={0}
                                end={s.end}
                                suffix={s.suffix}
                                decimals={s.decimals ?? 0}
                                duration={2.5}
                                enableScrollSpy
                                scrollSpyOnce
                              />
                            </Typography>
                            <Typography
                              sx={{ fontSize: "0.6875rem", color: C.muted, fontWeight: 500, mt: 0.4, lineHeight: 1.3 }}
                            >
                              {s.label}
                            </Typography>
                          </Box>
                          </TiltCard>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>

                {/* Feature bullets — stagger */}
                <motion.div
                  variants={V.staggerSlow}
                  initial="hidden"
                  animate="visible"
                  transition={{ delayChildren: 0.9 }}
                >
                  <Stack spacing={1.5}>
                    {[
                      { icon: <PublicIcon sx={{ fontSize: 18 }} />, dark: true, text: "Statewide asset monitoring from a single dashboard" },
                      { icon: <AnalyticsIcon sx={{ fontSize: 18 }} />, dark: false, text: "Real-time intelligence across all city departments" },
                      { icon: <ShieldIcon sx={{ fontSize: 18 }} />, dark: true, text: "Role-based access with full government audit trail" },
                      { icon: <BoltIcon sx={{ fontSize: 18 }} />, dark: false, text: "Emergency response & dispatch in under 60 seconds" },
                    ].map((f, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          hidden: { opacity: 0, x: -30 },
                          visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease, delay: 0.9 + i * 0.08 } },
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            sx={{
                              width: 32, height: 32, borderRadius: "9px",
                              bgcolor: f.dark ? C.navyLight : C.primaryLight,
                              color: f.dark ? C.navy : C.primary,
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}
                          >
                            {f.icon}
                          </Box>
                          <Typography sx={{ fontSize: "0.9rem", color: C.muted, fontWeight: 500 }}>{f.text}</Typography>
                        </Stack>
                      </motion.div>
                    ))}
                  </Stack>
                </motion.div>
              </Box>
              </motion.div>
            </Grid>

            {/* RIGHT — access card slides from right */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <motion.div
                initial={{ opacity: 0, x: 80, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1, ease, delay: 0.4 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "24px", border: "1px solid rgba(216,224,234,0.8)",
                    background: "rgba(255,255,255,0.94)", backdropFilter: "blur(20px)",
                    boxShadow: "0 32px 80px -24px rgba(16,24,40,0.18),0 0 0 1px rgba(216,224,234,0.5)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      px: 4, pt: 4, pb: 3, borderBottom: `1px solid ${C.border}`,
                      background: "linear-gradient(180deg,rgba(248,250,252,0.9) 0%,rgba(255,255,255,0) 100%)",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 36, height: 36, borderRadius: "10px",
                          background: "linear-gradient(135deg,#E55555 0%,#C13838 100%)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(229,85,85,0.3)",
                        }}
                      >
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

                  <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted2, mb: 1.5, px: 0.5 }}>Select your role</Typography>
                    <Stack spacing={1.5}>
                      {portals.map((p, pi) => {
                        const active = selected === p.id;
                        return (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease, delay: 0.7 + pi * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <Box
                              onClick={() => setSelected(p.id)}
                              sx={{
                                display: "flex", alignItems: "center", gap: 2,
                                p: "14px 16px", borderRadius: "14px", border: "1.5px solid",
                                borderColor: active ? p.hoverBorder : C.border,
                                bgcolor: active ? p.hoverBg : "transparent",
                                cursor: "pointer", transition: "all 0.18s ease",
                                "&:hover": { borderColor: p.hoverBorder, bgcolor: p.hoverBg },
                              }}
                            >
                              <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: p.iconBg, color: p.iconFg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.icon}</Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: "0.9375rem", color: C.fg, letterSpacing: "-0.01em" }}>{p.label}</Typography>
                                <Typography sx={{ fontSize: "0.8rem", color: C.muted, mt: 0.2 }}>{p.desc}</Typography>
                              </Box>
                              <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid", borderColor: active ? p.hoverBorder : C.border, bgcolor: active ? p.hoverBorder : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s ease" }}>
                                {active && <CheckCircleIcon sx={{ fontSize: 14, color: "#fff" }} />}
                              </Box>
                            </Box>
                          </motion.div>
                        );
                      })}
                    </Stack>
                  </Box>

                  <Box sx={{ px: 3, pb: 3 }}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        fullWidth onClick={handleContinue}
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                        sx={{
                          mt: 1, py: 1.625, borderRadius: "14px", fontSize: "0.9375rem",
                          fontWeight: 700, letterSpacing: "-0.01em", textTransform: "none",
                          background: "linear-gradient(135deg,#1E2530 0%,#2D3748 100%)", color: "#FFFFFF",
                          boxShadow: "0 4px 20px -4px rgba(30,37,48,0.4)", transition: "all 0.18s ease",
                          "&:hover": { boxShadow: "0 6px 28px -4px rgba(30,37,48,0.5)", transform: "translateY(-1px)" },
                        }}
                      >
                        Continue to Login
                      </Button>
                    </motion.div>
                  </Box>

                  <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${C.border}`, background: "rgba(248,250,252,0.6)", display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                    <LockIcon sx={{ fontSize: 15, color: C.muted2, mt: "2px", flexShrink: 0 }} />
                    <Box>
                      <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, color: C.muted, mb: 0.2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Security note</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: C.muted2, lineHeight: 1.5 }}>Sessions are protected with secure protocols and MFA verification for sensitive modules.</Typography>
                    </Box>
                  </Box>
                </Card>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                >
                  <Box sx={{ mt: 2.5, display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
                    <CheckCircleIcon sx={{ fontSize: 14, color: C.green }} />
                    <Typography sx={{ fontSize: "0.75rem", color: C.muted2, fontWeight: 500 }}>Trusted by 200+ government agencies across India</Typography>
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══ TRUST STRIP — count up on scroll ══════════════════ */}
      <Box
        sx={{
          borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
          py: 4.5, bgcolor: "rgba(255,255,255,0.82)", backdropFilter: "blur(16px)",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: "20px", md: "80px" } }}>
          <StaggerIn variants={V.stagger}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              justifyContent="center"
              spacing={{ xs: 2, sm: 6 }}
              divider={
                <Box sx={{ width: "1px", height: 20, bgcolor: C.border, display: { xs: "none", sm: "block" } }} />
              }
            >
              {trustNumbers.map((s, si) => (
                <motion.div key={s.label} variants={V.card}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Typography
                      sx={{
                        fontWeight: 900, fontSize: "2.5rem", color: C.fg, letterSpacing: "-0.05em", lineHeight: 1,
                        background: si % 2 === 0
                          ? "linear-gradient(135deg,#0D1117 0%,#E55555 100%)"
                          : "linear-gradient(135deg,#156BBA 0%,#1E2530 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      }}
                    >
                      <CountUp
                        start={0}
                        end={s.end}
                        suffix={s.suffix ?? ""}
                        prefix={s.prefix ?? ""}
                        duration={2.5}
                        enableScrollSpy
                        scrollSpyOnce
                      />
                    </Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: C.muted, fontWeight: 500, textAlign: "center" }}>{s.label}</Typography>
                  </Stack>
                </motion.div>
              ))}
            </Stack>
          </StaggerIn>
        </Container>
      </Box>

      {/* ══ WHAT IS CITYOS ═════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, position: "relative", overflow: "hidden" }}>
        {/* ambient orbs */}
        <motion.div
          style={{ position: "absolute", top: -120, right: -120, width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,37,48,0.06) 0%, transparent 68%)", pointerEvents: "none" }}
          animate={{ scale: [1, 1.14, 0.92, 1], rotate: [0, 12, -6, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(229,85,85,0.055) 0%, transparent 68%)", pointerEvents: "none" }}
          animate={{ scale: [1, 1.18, 0.9, 1], x: [0, 20, -10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" } }}>
          <StaggerIn variants={V.stagger}>
            <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
              <motion.div variants={V.fadeIn}><SectionBadge color={C.navy}>Platform Overview</SectionBadge></motion.div>
              <motion.div variants={V.fadeUp}>
                <SectionHeading sx={{ maxWidth: 760, mx: "auto" }}>
                  The operating system<br />cities never had.
                </SectionHeading>
              </motion.div>
              <motion.div variants={V.fadeUp}>
                <Typography
                  sx={{ fontSize: { xs: "1.0625rem", md: "1.25rem" }, color: C.muted, lineHeight: 1.75, maxWidth: 640, mx: "auto", mt: 2.5 }}
                >
                  India's government machinery runs across thousands of disconnected systems. CityOS unifies them into one coherent, real-time platform built specifically for Indian governance at every level.
                </Typography>
              </motion.div>
            </Box>
          </StaggerIn>

          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="stretch">
            <Grid size={{ xs: 12, md: 5 }}>
              <InView variants={V.slideLeft}>
                <StaggerIn variants={V.staggerSlow}>
                  <Stack spacing={3} sx={{ height: "100%", justifyContent: "center" }}>
                    {[
                      { title: "Single sign-on", desc: "One login across all 12 government modules — no juggling portals." },
                      { title: "Works everywhere", desc: "Mobile, tablet, and desktop — optimised even for 2G networks." },
                      { title: "India's governance structure", desc: "Configured for all 3 tiers — union, state, and local bodies." },
                      { title: "Multilingual from day one", desc: "23 Indian languages built in, including full RTL script support." },
                    ].map((item) => (
                      <motion.div key={item.title} variants={V.card}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 36, height: 36, borderRadius: "10px", bgcolor: C.navyLight,
                              color: C.navy, display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0, mt: "2px",
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: "1.0625rem", color: C.fg, letterSpacing: "-0.01em", mb: 0.4 }}>{item.title}</Typography>
                            <Typography sx={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.6 }}>{item.desc}</Typography>
                          </Box>
                        </Stack>
                      </motion.div>
                    ))}
                  </Stack>
                </StaggerIn>
              </InView>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <InView variants={V.slideRight}>
                <Box
                  sx={{
                    borderRadius: "24px", overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "linear-gradient(160deg, #1E2530 0%, #0D1117 100%)",
                    boxShadow: "0 32px 80px -20px rgba(16,24,40,0.35)",
                    p: { xs: 3, md: 4 },
                  }}
                >
                  {/* Mini topbar */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3, pb: 2.5, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ width: 28, height: 28, borderRadius: "7px", background: "linear-gradient(135deg,#E55555,#C13838)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.75rem", lineHeight: 1 }}>C</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em" }}>CityOS Dashboard</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PulseDot color={C.green} />
                      <Typography sx={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Live</Typography>
                    </Stack>
                  </Stack>

                  {/* Stat cards with count up */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
                    {[
                      { label: "Active Incidents", value: liveStats.incidents, suffix: "", sub: "City-wide right now", color: C.primary },
                      { label: "Resolved Today", value: liveStats.resolved, suffix: "", sub: "Avg. 18 min resolution", color: C.green },
                      { label: "Schemes Active", value: liveStats.schemes, suffix: "", sub: "₹340Cr disbursed MTD", color: C.blue },
                      { label: "Safety Index", value: Math.round(liveStats.safety), suffix: "%", sub: "↑ 1.4% this quarter", color: "#a78bfa" },
                    ].map((c, ci) => (
                      <motion.div
                        key={c.label}
                        initial={{ opacity: 0, scale: 0.9, y: 16 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease, delay: ci * 0.08 }}
                        viewport={{ once: true, margin: "-50px" }}
                      >
                        <Box sx={{ p: 2.5, borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.04)", transition: "background 0.4s ease" }}>
                          <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", mb: 1 }}>{c.label}</Typography>
                          <motion.div
                            key={c.value}
                            initial={{ opacity: 0.5, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                          >
                            <Typography sx={{ fontWeight: 800, fontSize: "2.25rem", color: c.color, letterSpacing: "-0.05em", lineHeight: 1 }}>
                              {c.value}{c.suffix}
                            </Typography>
                          </motion.div>
                          <Typography sx={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.35)", mt: 0.75 }}>{c.sub}</Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>

                  {/* Animated progress bars */}
                  <Box sx={{ p: 2.5, borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
                    <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", mb: 2 }}>Departmental Load</Typography>
                    <Stack spacing={1.75}>
                      {[
                        { label: "Hospitals", pct: 42, color: C.primary },
                        { label: "Police", pct: 67, color: C.blue },
                        { label: "Schools", pct: 81, color: C.yellow },
                        { label: "Fire Stations", pct: 28, color: C.teal },
                      ].map((r, ri) => (
                        <Box key={r.label}>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                            <Typography sx={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{r.label}</Typography>
                            <Typography sx={{ fontSize: "0.8125rem", fontWeight: 700, color: r.color }}>{r.pct}%</Typography>
                          </Stack>
                          <AnimBar pct={r.pct} color={r.color} delay={0.2 + ri * 0.12} height={5} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </InView>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══ 12 MODULES ═════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, position: "relative", bgcolor: "rgba(248,250,252,0.8)" }}>
        <GridBg opacity={0.028} />
        <Container maxWidth="xl" sx={{ px: { xs: "20px", md: "80px" }, position: "relative", zIndex: 1 }}>
          <StaggerIn variants={V.stagger}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <motion.div variants={V.fadeIn}><SectionBadge color={C.blue}>12 Specialised Modules</SectionBadge></motion.div>
              <AnimWords text="Every department. One platform." sx={{ maxWidth: 640, mx: "auto", textAlign: "center" }} />
              <motion.div variants={V.fadeUp}>
                <Typography sx={{ fontSize: "1.2rem", color: C.muted, lineHeight: 1.75, maxWidth: 600, mx: "auto", mt: 2 }}>
                  From policing to public health — each module is purpose-built for the workflows, data, and compliance requirements of that department.
                </Typography>
              </motion.div>
            </Box>
          </StaggerIn>

          <motion.div
            variants={V.staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <Grid container spacing={2.5}>
              {modules.map((m) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={m.label}>
                  <motion.div variants={V.card} style={{ height: "100%", position: "relative" }}>
                    <TiltCard style={{ height: "100%", position: "relative" }}>
                      <Box
                        sx={{
                          p: 4, height: "100%", borderRadius: "20px",
                          border: `1px solid ${C.border}`,
                          background: "rgba(255,255,255,0.88)",
                          backdropFilter: "blur(8px)",
                          boxShadow: "0 2px 12px -4px rgba(16,24,40,0.06)",
                          transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                          cursor: "default", position: "relative", overflow: "hidden",
                          "&:hover": { borderColor: `${m.color}55`, boxShadow: `0 16px 48px -12px ${m.color}30` },
                        }}
                      >
                        <motion.div
                          whileHover={{ rotate: 12, scale: 1.18, transition: { type: "spring", stiffness: 500, damping: 18 } }}
                          style={{ display: "inline-block", marginBottom: 16 }}
                        >
                          <Box
                            sx={{
                              width: 46, height: 46, borderRadius: "13px",
                              bgcolor: m.bg, color: m.color,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            {m.icon}
                          </Box>
                        </motion.div>
                        <Typography sx={{ fontWeight: 700, fontSize: "1.125rem", color: C.fg, letterSpacing: "-0.02em", lineHeight: 1.25, mb: 1.5 }}>{m.label}</Typography>
                        <Typography sx={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.65 }}>{m.desc}</Typography>
                      </Box>
                    </TiltCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ══ HOW IT WORKS ═══════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, position: "relative" }}>
        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" } }}>
          <StaggerIn variants={V.stagger}>
            <Box sx={{ textAlign: "center", mb: 9 }}>
              <motion.div variants={V.fadeIn}><SectionBadge color={C.green}>How it works</SectionBadge></motion.div>
              <AnimWords text="Up and running in minutes." />
              <motion.div variants={V.fadeUp}><SectionSub>No complex setup. No long onboarding. Officers are productive from day one.</SectionSub></motion.div>
            </Box>
          </StaggerIn>

          <motion.div
            variants={V.staggerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <Grid container spacing={4} alignItems="stretch">
              {howItWorks.map((h, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={h.step}>
                  <motion.div
                    variants={V.card}
                    whileHover={{ y: -8, scale: 1.015, transition: { type: "spring", stiffness: 360, damping: 26 } }}
                    style={{ height: "100%" }}
                  >
                    <Box
                      sx={{
                        p: 4, height: "100%", borderRadius: "20px",
                        border: `1px solid ${C.border}`,
                        background: "rgba(255,255,255,0.9)",
                        position: "relative", overflow: "hidden",
                      }}
                    >
                      {/* Step watermark */}
                      <motion.div
                        initial={{ opacity: 0, scale: 1.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, ease, delay: i * 0.15 }}
                        viewport={{ once: true }}
                        style={{ position: "absolute", top: 12, right: 20 }}
                      >
                        <Typography
                          sx={{ fontWeight: 900, fontSize: "4.5rem", color: "rgba(30,37,48,0.045)", lineHeight: 1, userSelect: "none" }}
                        >
                          {h.step}
                        </Typography>
                      </motion.div>

                      <Box
                        sx={{
                          width: 52, height: 52, borderRadius: "14px", mb: 3,
                          bgcolor: i === 0 ? C.navyLight : i === 1 ? C.primaryLight : "rgba(2,121,0,0.08)",
                          color: i === 0 ? C.navy : i === 1 ? C.primary : C.green,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {h.icon}
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: "1.3rem", color: C.fg, letterSpacing: "-0.03em", mb: 1.75 }}>{h.title}</Typography>
                      <Typography sx={{ fontSize: "1.0625rem", color: C.muted, lineHeight: 1.7 }}>{h.desc}</Typography>

                      {i < howItWorks.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                          viewport={{ once: true }}
                          style={{ display: "block", position: "absolute", right: -28, top: "50%", transform: "translateY(-50%)", zIndex: 2 }}
                        >
                          <Box sx={{ display: { xs: "none", md: "block" } }}>
                            <ArrowForwardIcon sx={{ fontSize: 22, color: C.muted2 }} />
                          </Box>
                        </motion.div>
                      )}
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ══ FEATURES GRID ══════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, bgcolor: "rgba(248,250,252,0.8)", position: "relative" }}>
        <GridBg opacity={0.028} />
        <Container maxWidth="xl" sx={{ px: { xs: "20px", md: "80px" }, position: "relative", zIndex: 1 }}>
          <StaggerIn variants={V.stagger}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <motion.div variants={V.fadeIn}><SectionBadge color={C.purple}>Platform Capabilities</SectionBadge></motion.div>
              <motion.div variants={V.fadeUp}>
                <AnimWords text="Built for the complexity of Indian governance." sx={{ textAlign: "center" }} />
              </motion.div>
              <motion.div variants={V.fadeUp}><SectionSub>Every feature designed around real workflows used by collectors, officers, and field staff across India.</SectionSub></motion.div>
            </Box>
          </StaggerIn>

          <motion.div
            variants={V.staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <Grid container spacing={2.5}>
              {features.map((f) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={f.title}>
                  <motion.div variants={V.card} style={{ height: "100%", position: "relative" }}>
                    <TiltCard style={{ height: "100%", position: "relative" }}>
                      <Box
                        sx={{
                          p: "32px", height: "100%", borderRadius: "20px",
                          border: `1px solid ${C.border}`,
                          background: "rgba(255,255,255,0.88)",
                          position: "relative", overflow: "hidden",
                          transition: "border-color 0.25s, box-shadow 0.25s",
                          "&:hover": { borderColor: `${f.color}55`, boxShadow: `0 16px 48px -12px ${f.color}30` },
                        }}
                      >
                        <motion.div
                          whileHover={{ rotate: 12, scale: 1.15, transition: { type: "spring", stiffness: 400 } }}
                          style={{ display: "inline-block", marginBottom: 20 }}
                        >
                          <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: f.bg, color: f.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {f.icon}
                          </Box>
                        </motion.div>
                        <Typography sx={{ fontWeight: 700, fontSize: "1.125rem", color: C.fg, letterSpacing: "-0.02em", mb: 1.5 }}>{f.title}</Typography>
                        <Typography sx={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.65 }}>{f.desc}</Typography>
                      </Box>
                    </TiltCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ══ EMERGENCY HIGHLIGHT ════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: 12, md: 18 }, position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg,#0D1117 0%,#1E2530 50%,#0D1117 100%)",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(229,85,85,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(229,85,85,0.06) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />

        {/* Pulsing glow */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(229,85,85,0.18) 0%,transparent 70%)", pointerEvents: "none" }}
        />
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(229,85,85,0.1) 0%,transparent 70%)", pointerEvents: "none" }}
        />

        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" }, position: "relative", zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <InView variants={V.slideLeft}>
                <SectionBadge color={C.primary}>Emergency Response</SectionBadge>
                <Box sx={{ overflow: "hidden", mb: 2.5 }}>
                  <motion.div
                    initial={{ y: "100%" }}
                    whileInView={{ y: 0 }}
                    transition={{ duration: 0.9, ease }}
                    viewport={{ once: true }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800, fontSize: { xs: "2.4rem", md: "3.5rem", lg: "4rem" },
                        letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 1.05,
                      }}
                    >
                      Every second counts.<br />CityOS makes them count.
                    </Typography>
                  </motion.div>
                </Box>
                <Typography sx={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, mb: 5 }}>
                  From the moment an incident is reported to ambulance dispatch, fire response, or police deployment — the entire chain runs inside CityOS with sub-60 second response loops.
                </Typography>
                <StaggerIn variants={V.staggerSlow}>
                  <Stack spacing={2}>
                    {[
                      "Auto-dispatch based on proximity and availability",
                      "Live GPS tracking for all emergency vehicles",
                      "Multi-agency coordination in a shared ops room",
                      "Automated escalation if response thresholds are breached",
                    ].map((t) => (
                      <motion.div key={t} variants={V.card}>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: C.primary, mt: "8px", flexShrink: 0 }} />
                          <Typography sx={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{t}</Typography>
                        </Stack>
                      </motion.div>
                    ))}
                  </Stack>
                </StaggerIn>
              </InView>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InView variants={V.slideRight}>
                <Box sx={{ p: 4, borderRadius: "20px", border: "1px solid rgba(229,85,85,0.25)", background: "rgba(229,85,85,0.07)", backdropFilter: "blur(12px)" }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                    <PulseDot color={C.primary} />
                    <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)" }}>Live Response Metrics</Typography>
                  </Stack>
                  <Stack spacing={3}>
                    {[
                      { label: "Avg. Dispatch Time", end: 48, suffix: "s", bar: 80, color: C.primary },
                      { label: "Ambulance ETA", end: 6.2, suffix: "m", decimals: 1, bar: 55, color: C.yellow },
                      { label: "Incident Resolution", end: 18, suffix: "m", bar: 65, color: C.blue },
                      { label: "Cases Closed Today", end: 156, suffix: "", bar: 90, color: C.green },
                    ].map((r, ri) => (
                      <Box key={r.label}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography sx={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{r.label}</Typography>
                          <Typography sx={{ fontSize: "1.375rem", fontWeight: 800, color: r.color, letterSpacing: "-0.03em" }}>
                            <CountUp start={0} end={r.end} suffix={r.suffix} decimals={r.decimals ?? 0} duration={2.5} enableScrollSpy scrollSpyOnce />
                          </Typography>
                        </Stack>
                        <AnimBar pct={r.bar} color={r.color} delay={0.15 + ri * 0.12} height={5} />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </InView>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══ SECURITY ═══════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, position: "relative" }}>
        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" } }}>
          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <InView variants={V.slideLeft}>
                <SectionBadge color={C.navy}>Security & Compliance</SectionBadge>
                <AnimWords text="Government-grade security, by default." />
                <SectionSub>Every design decision in CityOS starts with security. Built for India's regulatory landscape, including MeITY, NIC, and STQC compliance requirements.</SectionSub>
                <StaggerIn variants={V.stagger}>
                  <Box sx={{ mt: 5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                    {securityPoints.map((p) => (
                      <motion.div key={p} variants={V.card}>
                        <Stack direction="row" spacing={1.25} alignItems="flex-start">
                          <ShieldIcon sx={{ fontSize: 15, color: C.navy, mt: "3px", flexShrink: 0 }} />
                          <Typography sx={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.6 }}>{p}</Typography>
                        </Stack>
                      </motion.div>
                    ))}
                  </Box>
                </StaggerIn>
              </InView>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InView variants={V.slideRight}>
                <StaggerIn variants={V.stagger}>
                  <Grid container spacing={2}>
                    {[
                      { icon: <LockIcon sx={{ fontSize: 26 }} />, title: "Zero-trust architecture", desc: "Every request is verified regardless of network origin or prior trust.", color: C.navy, bg: C.navyLight },
                      { icon: <VerifiedIcon sx={{ fontSize: 26 }} />, title: "MFA enforcement", desc: "All officer logins require multi-factor authentication — no exceptions.", color: C.green, bg: "rgba(2,121,0,0.08)" },
                      { icon: <StorageIcon sx={{ fontSize: 26 }} />, title: "Data stays in India", desc: "All data is stored on sovereign servers within Indian territory.", color: C.blue, bg: "rgba(21,107,186,0.08)" },
                      { icon: <AnalyticsIcon sx={{ fontSize: 26 }} />, title: "Full audit trail", desc: "Every action is logged — who did what, when, and from where.", color: C.purple, bg: "rgba(114,21,186,0.08)" },
                    ].map((s) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={s.title}>
                        <motion.div
                          variants={V.card}
                          whileHover={{ y: -7, scale: 1.02, transition: { type: "spring", stiffness: 360, damping: 26 } }}
                        >
                          <Box sx={{ p: 3, borderRadius: "16px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.9)", height: "100%", transition: "border-color 0.2s", "&:hover": { borderColor: `${s.color}40` } }}>
                            <motion.div whileHover={{ rotate: 8, scale: 1.1, transition: { type: "spring", stiffness: 400 } }} style={{ display: "inline-block", marginBottom: 16 }}>
                              <Box sx={{ width: 46, height: 46, borderRadius: "12px", bgcolor: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</Box>
                            </motion.div>
                            <Typography sx={{ fontWeight: 700, fontSize: "1.125rem", color: C.fg, mb: 1 }}>{s.title}</Typography>
                            <Typography sx={{ fontSize: "0.9375rem", color: C.muted, lineHeight: 1.6 }}>{s.desc}</Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </StaggerIn>
              </InView>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══ LANGUAGE SUPPORT ═══════════════════════════════════ */}
      <Box sx={{ py: { xs: 12, md: 18 }, bgcolor: "rgba(248,250,252,0.8)", position: "relative" }}>
        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" } }}>
          <StaggerIn variants={V.stagger}>
            <Box sx={{ textAlign: "center", mb: 7 }}>
              <motion.div variants={V.fadeIn}><SectionBadge color={C.teal}>Language Support</SectionBadge></motion.div>
              <AnimWords text="Speak every citizen's language." sx={{ textAlign: "center" }} />
              <motion.div variants={V.fadeUp}><SectionSub>All 22 constitutionally recognised languages of India, plus English — with complete RTL support for Urdu, Kashmiri, and Sindhi.</SectionSub></motion.div>
            </Box>
          </StaggerIn>

          <motion.div
            variants={V.staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
              {languages.map((lang) => (
                <motion.div
                  key={lang}
                  variants={V.pill}
                  whileHover={{ scale: 1.12, y: -5, transition: { duration: 0.18, ease } }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Box
                    sx={{
                      px: 2.5, py: 1.125, borderRadius: "9999px",
                      border: `1px solid ${C.border}`,
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(6px)",
                      cursor: "default",
                      transition: "border-color 0.15s ease, background 0.15s ease",
                      "&:hover": { borderColor: C.teal, bgcolor: "rgba(35,156,232,0.06)" },
                    }}
                  >
                    <Typography sx={{ fontSize: "1.0625rem", color: C.fg, fontWeight: 600 }}>{lang}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          <InView variants={V.fadeUp} style={{ marginTop: 40 }}>
            <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
              {[
                { color: C.green, label: "RTL support for 3 languages" },
                { color: C.blue, label: "Automatic script detection" },
                { color: C.navy, label: "Browser language auto-detection" },
              ].map((b) => (
                <Stack key={b.label} direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon sx={{ fontSize: 15, color: b.color }} />
                  <Typography sx={{ fontSize: "1rem", color: C.muted }}>{b.label}</Typography>
                </Stack>
              ))}
            </Stack>
          </InView>
        </Container>
      </Box>

      {/* ══ FINAL CTA ══════════════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: 12, md: 16 }, position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg,#1E2530 0%,#0D1117 100%)",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)`, backgroundSize: "72px 72px" }} />

        {/* Animated glow orb */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: -160, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(229,85,85,0.12) 0%,transparent 70%)", pointerEvents: "none" }}
        />

        <Container maxWidth="lg" sx={{ px: { xs: "20px", md: "80px" }, position: "relative", zIndex: 1, textAlign: "center" }}>
          <InView variants={V.scaleIn}>
            <SectionBadge color={C.primary}>Get started today</SectionBadge>
            <Box sx={{ overflow: "hidden", mb: 2.5 }}>
              <motion.div
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.9, ease }}
                viewport={{ once: true }}
              >
                <Typography
                  sx={{
                    fontWeight: 800, fontSize: { xs: "2.2rem", md: "3.5rem" },
                    letterSpacing: "-0.05em", color: "#FFFFFF", lineHeight: 1.08,
                  }}
                >
                  Your city deserves<br />better infrastructure.
                </Typography>
              </motion.div>
            </Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography sx={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 620, mx: "auto", mb: 7 }}>
                Join 200+ government agencies already running on CityOS. One platform. Every department. Full accountability.
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.35 }}
              viewport={{ once: true }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <MagButton strength={0.4}>
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={handleContinue}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        textTransform: "none", fontWeight: 700, fontSize: "1rem",
                        px: 4, py: 1.75, borderRadius: "14px",
                        background: "linear-gradient(135deg,#E55555 0%,#C13838 100%)", color: "#fff",
                        boxShadow: "0 8px 28px -6px rgba(229,85,85,0.5)",
                        animation: "ctaGlow 3s ease infinite",
                        "@keyframes ctaGlow": {
                          "0%,100%": { boxShadow: "0 8px 28px -6px rgba(229,85,85,0.5)" },
                          "50%": { boxShadow: "0 12px 40px -4px rgba(229,85,85,0.75)" },
                        },
                      }}
                    >
                      Access CityOS
                    </Button>
                  </motion.div>
                </MagButton>
                <MagButton strength={0.3}>
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      sx={{
                        textTransform: "none", fontWeight: 600, fontSize: "1rem",
                        px: 4, py: 1.75, borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.3)" },
                      }}
                    >
                      Request a demo
                    </Button>
                  </motion.div>
                </MagButton>
              </Stack>
            </motion.div>
          </InView>
        </Container>
      </Box>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <InView variants={V.fadeIn}>
        <Box sx={{ bgcolor: "#0D1117", py: 5, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Container maxWidth="xl" sx={{ px: { xs: "20px", md: "80px" } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              spacing={3}
            >
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
                  <Typography
                    key={l}
                    sx={{
                      fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)", cursor: "pointer",
                      "&:hover": { color: "rgba(255,255,255,0.7)" }, transition: "color 0.15s",
                    }}
                  >
                    {l}
                  </Typography>
                ))}
              </Stack>
              <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
                © 2026 CityOS · Government of India Initiative
              </Typography>
            </Stack>
          </Container>
        </Box>
      </InView>

    </Box>
  );
};

export default LandingPage;
