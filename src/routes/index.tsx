import { lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import Loadable from "../components/ui/Loadable";
import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import { PlaceholderPage } from "../components/ui/PlaceholderPage";

// Lazy imports for pages
const LandingPage = Loadable(
  lazy(() => import("../pages/Landing/LandingPage"))
);
const LoginPage = Loadable(lazy(() => import("../pages/Auth/LoginPage")));

// Handle named export for StationsList
const StationsList = Loadable(
  lazy(() =>
    import("../pages/Stations/StationsList").then((module) => ({
      default: module.StationsList,
    }))
  )
);

const ResourceList = Loadable(
  lazy(() => import("../pages/Resources/ResourceList"))
);
const ResourceDetail = Loadable(
  lazy(() => import("../pages/Resources/ResourceDetail"))
);

// Inline components from App.tsx - extracted for clarity
const DashboardPage = () => (
  <PlaceholderPage
    title="City Overview Dashboard"
    description="Real-time metrics, safety index, and active emergency summaries."
  />
);

export default function Router() {
  const routes: RouteObject[] = [
    // Public Routes
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },

    // Protected Routes
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <AppLayout />,
          children: [
            { path: "dashboard", element: <DashboardPage /> },

            // District Admin Routes (Detailed)
            {
              path: "district",
              children: [
                {
                  path: "collectorate",
                  element: (
                    <PlaceholderPage title="Collectorate (District Magistrate)" />
                  ),
                },
                {
                  path: "sub-divisions",
                  element: (
                    <PlaceholderPage title="Sub-Divisions (SDM Offices)" />
                  ),
                },
                {
                  path: "tehsils",
                  element: (
                    <PlaceholderPage title="Tehsils (Tehsildar Offices)" />
                  ),
                },
                {
                  path: "blocks",
                  element: (
                    <PlaceholderPage title="Development Blocks (BDO Offices)" />
                  ),
                },
                {
                  path: "calendar",
                  element: <PlaceholderPage title="Meeting Calendar" />,
                },
                {
                  path: "minutes",
                  element: <PlaceholderPage title="Meeting Minutes" />,
                },
                {
                  path: "vip-visits",
                  element: <PlaceholderPage title="VIP Visits Protocol" />,
                },
                {
                  path: "orders",
                  element: <PlaceholderPage title="District Orders" />,
                },
                {
                  path: "circulars",
                  element: <PlaceholderPage title="Official Circulars" />,
                },
                {
                  path: "directives",
                  element: <PlaceholderPage title="Central Directives" />,
                },
                {
                  path: "officers",
                  element: <PlaceholderPage title="Officer Directory" />,
                },
                {
                  path: "transfers",
                  element: <PlaceholderPage title="Transfers & Postings" />,
                },
                {
                  path: "attendance",
                  element: <PlaceholderPage title="Staff Attendance" />,
                },
              ],
            },

            // Emergency / Command Center Routes (Refactored)
            {
              path: "emergency",
              children: [
                // Incidents Group
                {
                  path: "incidents",
                  children: [
                    {
                      path: "active",
                      element: (
                        <PlaceholderPage title="Active Incidents (Aapatkaleen)" />
                      ),
                    },
                    {
                      path: "resolved",
                      element: <PlaceholderPage title="Resolved Incidents" />,
                    },
                  ],
                },
                // Dispatch (Direct route as per config)
                {
                  path: "dispatch",
                  element: <PlaceholderPage title="Dispatch Queue" />,
                },
                // Map & Command Center Group
                {
                  path: "map",
                  children: [
                    {
                      path: "overview",
                      element: (
                        <PlaceholderPage title="Command Center (Live Map)" />
                      ),
                    },
                    {
                      path: "resources",
                      element: <PlaceholderPage title="Resource Locations" />,
                    },
                    {
                      path: "hotspots",
                      element: <PlaceholderPage title="Incident Hotspots" />,
                    },
                    {
                      path: "traffic",
                      element: <PlaceholderPage title="Traffic Status" />,
                    },
                  ],
                },
                // Emergency Resources Group
                {
                  path: "resources",
                  children: [
                    {
                      path: "fire",
                      element: <PlaceholderPage title="Fire Stations" />,
                    },
                    {
                      path: "ambulance",
                      element: <PlaceholderPage title="Ambulance Services" />,
                    },
                    {
                      path: "police",
                      element: <PlaceholderPage title="Police Vehicles" />,
                    },
                    {
                      path: "equipment",
                      element: <PlaceholderPage title="Emergency Equipment" />,
                    },
                  ],
                },
              ],
            },

            // Operations Routes (Maintained)
            {
              path: "ops",
              children: [
                {
                  path: "police",
                  element: <PlaceholderPage title="Police & Security Ops" />,
                },
                {
                  path: "health",
                  element: <PlaceholderPage title="Health & Medical Ops" />,
                },
                {
                  path: "fire",
                  element: <PlaceholderPage title="Fire & Safety Ops" />,
                },
                {
                  path: "public-works",
                  element: <PlaceholderPage title="Public Works Ops" />,
                },
              ],
            },

            // Grievance Routes (Maintained)
            {
              path: "grievance",
              children: [
                {
                  path: "reports",
                  element: (
                    <PlaceholderPage title="Citizen Reports (Jan Shikayat)" />
                  ),
                },
                {
                  path: "tickets",
                  element: <PlaceholderPage title="Ticket Status (Nivaran)" />,
                },
              ],
            },

            // State Admin Routes
            {
              path: "state",
              children: [
                {
                  path: "dashboard",
                  element: (
                    <PlaceholderPage title="Rajya Dashboard (State Overview)" />
                  ),
                },
                {
                  path: "districts",
                  children: [
                    {
                      path: "performance",
                      element: (
                        <PlaceholderPage title="District Performance Metrics" />
                      ),
                    },
                    {
                      path: "compare",
                      element: <PlaceholderPage title="Comparative Analysis" />,
                    },
                    {
                      path: "reports",
                      element: (
                        <PlaceholderPage title="Monthly District Reports" />
                      ),
                    },
                  ],
                },
                {
                  path: "schemes",
                  children: [
                    {
                      path: "central",
                      element: (
                        <PlaceholderPage title="Central Schemes (PM Yojana)" />
                      ),
                    },
                    {
                      path: "state",
                      element: (
                        <PlaceholderPage title="State Schemes (CM Yojana)" />
                      ),
                    },
                    {
                      path: "status",
                      element: (
                        <PlaceholderPage title="Implementation Status" />
                      ),
                    },
                  ],
                },
                {
                  path: "reports",
                  children: [
                    {
                      path: "high-command",
                      element: <PlaceholderPage title="High Command Reports" />,
                    },
                    {
                      path: "cabinet",
                      element: <PlaceholderPage title="Cabinet Briefings" />,
                    },
                    {
                      path: "legislature",
                      element: <PlaceholderPage title="Legislature Reports" />,
                    },
                  ],
                },
              ],
            },

            // Citizen Services Routes
            {
              path: "services",
              children: [
                {
                  path: "overview",
                  element: <PlaceholderPage title="Suvidha Overview" />,
                },
                {
                  path: "certificates",
                  children: [
                    {
                      path: "birth",
                      element: <PlaceholderPage title="Birth Certificate" />,
                    },
                    {
                      path: "death",
                      element: <PlaceholderPage title="Death Certificate" />,
                    },
                    {
                      path: "caste",
                      element: <PlaceholderPage title="Caste Certificate" />,
                    },
                    {
                      path: "income",
                      element: <PlaceholderPage title="Income Certificate" />,
                    },
                    {
                      path: "domicile",
                      element: <PlaceholderPage title="Domicile Certificate" />,
                    },
                    {
                      path: "character",
                      element: (
                        <PlaceholderPage title="Character Certificate" />
                      ),
                    },
                  ],
                },
                {
                  path: "payments",
                  children: [
                    {
                      path: "property-tax",
                      element: <PlaceholderPage title="Property Tax" />,
                    },
                    {
                      path: "water",
                      element: <PlaceholderPage title="Water Bill" />,
                    },
                    {
                      path: "electricity",
                      element: <PlaceholderPage title="Electricity Bill" />,
                    },
                    {
                      path: "trade-license",
                      element: <PlaceholderPage title="Trade License" />,
                    },
                  ],
                },
                {
                  path: "grievances",
                  children: [
                    {
                      path: "new",
                      element: <PlaceholderPage title="File Complaint" />,
                    },
                    {
                      path: "track",
                      element: <PlaceholderPage title="Track Status" />,
                    },
                    {
                      path: "cm-helpline",
                      element: <PlaceholderPage title="CM Helpline" />,
                    },
                  ],
                },
                {
                  path: "e-district",
                  children: [
                    {
                      path: "rti",
                      element: <PlaceholderPage title="RTI Applications" />,
                    },
                    {
                      path: "arms",
                      element: <PlaceholderPage title="Arms License" />,
                    },
                    {
                      path: "other",
                      element: <PlaceholderPage title="Other Services" />,
                    },
                  ],
                },
              ],
            },

            // Development Schemes Routes
            {
              path: "schemes",
              children: [
                {
                  path: "dashboard",
                  element: <PlaceholderPage title="Yojana Dashboard" />,
                },
                {
                  path: "central",
                  children: [
                    {
                      path: "pm-awas",
                      element: <PlaceholderPage title="PM Awas Yojana" />,
                    },
                    {
                      path: "pm-kisan",
                      element: <PlaceholderPage title="PM Kisan Samman" />,
                    },
                    {
                      path: "mgnrega",
                      element: <PlaceholderPage title="MGNREGA" />,
                    },
                    {
                      path: "ujjwala",
                      element: <PlaceholderPage title="Ujjwala Yojana" />,
                    },
                    {
                      path: "ayushman",
                      element: <PlaceholderPage title="Ayushman Bharat" />,
                    },
                  ],
                },
                {
                  path: "state",
                  children: [
                    {
                      path: "cm",
                      element: <PlaceholderPage title="CM Schemes" />,
                    },
                    {
                      path: "subsidies",
                      element: <PlaceholderPage title="State Subsidies" />,
                    },
                    {
                      path: "local",
                      element: <PlaceholderPage title="Local Development" />,
                    },
                  ],
                },
                {
                  path: "implementation",
                  children: [
                    {
                      path: "beneficiaries",
                      element: <PlaceholderPage title="Beneficiary List" />,
                    },
                    {
                      path: "funds",
                      element: <PlaceholderPage title="Fund Utilization" />,
                    },
                    {
                      path: "progress",
                      element: <PlaceholderPage title="Progress Reports" />,
                    },
                    {
                      path: "geo",
                      element: <PlaceholderPage title="Geo-tagging" />,
                    },
                  ],
                },
              ],
            },

            // Revenue & Land Routes
            {
              path: "revenue",
              children: [
                {
                  path: "dashboard",
                  element: <PlaceholderPage title="Rajya Revenue Dashboard" />,
                },
                {
                  path: "land",
                  children: [
                    {
                      path: "khatauni",
                      element: (
                        <PlaceholderPage title="Khatauni/Khasra Records" />
                      ),
                    },
                    {
                      path: "maps",
                      element: <PlaceholderPage title="Digital Land Maps" />,
                    },
                    {
                      path: "mutation",
                      element: <PlaceholderPage title="Mutation Records" />,
                    },
                    {
                      path: "digitization",
                      element: <PlaceholderPage title="Digitization Status" />,
                    },
                  ],
                },
                {
                  path: "disputes",
                  children: [
                    {
                      path: "pending",
                      element: (
                        <PlaceholderPage title="Pending Revenue Cases" />
                      ),
                    },
                    {
                      path: "court",
                      element: <PlaceholderPage title="Revenue Court" />,
                    },
                    {
                      path: "appeals",
                      element: <PlaceholderPage title="Appeals & Tribunals" />,
                    },
                  ],
                },
                {
                  path: "collection",
                  children: [
                    {
                      path: "stamp",
                      element: (
                        <PlaceholderPage title="Stamp Duty Collection" />
                      ),
                    },
                    {
                      path: "registration",
                      element: (
                        <PlaceholderPage title="Property Registration" />
                      ),
                    },
                    {
                      path: "land",
                      element: <PlaceholderPage title="Land Revenue (Lagan)" />,
                    },
                  ],
                },
                {
                  path: "patwari",
                  children: [
                    {
                      path: "daily",
                      element: (
                        <PlaceholderPage title="Patwari Daily Reports" />
                      ),
                    },
                    {
                      path: "visits",
                      element: <PlaceholderPage title="Field Visit Logs" />,
                    },
                    {
                      path: "crop",
                      element: <PlaceholderPage title="Crop Survey Data" />,
                    },
                  ],
                },
              ],
            },

            // Health Services Routes
            {
              path: "health",
              children: [
                {
                  path: "dashboard",
                  element: <PlaceholderPage title="Swasthya Dashboard" />,
                },
                {
                  path: "facilities",
                  children: [
                    {
                      path: "district",
                      element: <PlaceholderPage title="District Hospital" />,
                    },
                    {
                      path: "chc-phc",
                      element: <PlaceholderPage title="CHC/PHC Network" />,
                    },
                    {
                      path: "sub-centers",
                      element: <PlaceholderPage title="Sub-Centers" />,
                    },
                    {
                      path: "private",
                      element: <PlaceholderPage title="Private Hospitals" />,
                    },
                  ],
                },
                {
                  path: "programs",
                  children: [
                    {
                      path: "immunization",
                      element: <PlaceholderPage title="Immunization" />,
                    },
                    {
                      path: "maternal",
                      element: <PlaceholderPage title="Maternal Health" />,
                    },
                    {
                      path: "family",
                      element: <PlaceholderPage title="Family Planning" />,
                    },
                    {
                      path: "disease",
                      element: <PlaceholderPage title="Disease Control" />,
                    },
                  ],
                },
                {
                  path: "surveillance",
                  children: [
                    {
                      path: "outbreaks",
                      element: <PlaceholderPage title="Outbreak Alerts" />,
                    },
                    {
                      path: "epidemic",
                      element: <PlaceholderPage title="Epidemic Tracking" />,
                    },
                    {
                      path: "lab",
                      element: <PlaceholderPage title="Lab Reports" />,
                    },
                  ],
                },
                {
                  path: "resources",
                  children: [
                    {
                      path: "doctors",
                      element: <PlaceholderPage title="Doctor Availability" />,
                    },
                    {
                      path: "medicine",
                      element: <PlaceholderPage title="Medicine Stock" />,
                    },
                    {
                      path: "equipment",
                      element: <PlaceholderPage title="Equipment Status" />,
                    },
                    {
                      path: "ambulance",
                      element: <PlaceholderPage title="Ambulance Fleet" />,
                    },
                  ],
                },
              ],
            },

            // Education Routes
            {
              path: "education",
              children: [
                {
                  path: "dashboard",
                  element: <PlaceholderPage title="Shiksha Dashboard" />,
                },
                {
                  path: "schools",
                  children: [
                    {
                      path: "government",
                      element: <PlaceholderPage title="Government Schools" />,
                    },
                    {
                      path: "private",
                      element: <PlaceholderPage title="Private Schools" />,
                    },
                    {
                      path: "madarsa",
                      element: <PlaceholderPage title="Madarsas" />,
                    },
                    {
                      path: "special",
                      element: <PlaceholderPage title="Special Schools" />,
                    },
                  ],
                },
                {
                  path: "students",
                  children: [
                    {
                      path: "enrollment",
                      element: <PlaceholderPage title="Enrollment Data" />,
                    },
                    {
                      path: "dropout",
                      element: <PlaceholderPage title="Dropout Tracking" />,
                    },
                    {
                      path: "scholarship",
                      element: <PlaceholderPage title="Scholarship Status" />,
                    },
                    {
                      path: "mdm",
                      element: <PlaceholderPage title="Mid-Day Meal" />,
                    },
                  ],
                },
                {
                  path: "teachers",
                  children: [
                    {
                      path: "directory",
                      element: <PlaceholderPage title="Teacher Directory" />,
                    },
                    {
                      path: "training",
                      element: <PlaceholderPage title="Training Programs" />,
                    },
                    {
                      path: "transfers",
                      element: <PlaceholderPage title="Transfer Requests" />,
                    },
                    {
                      path: "attendance",
                      element: <PlaceholderPage title="Teacher Attendance" />,
                    },
                  ],
                },
                {
                  path: "exams",
                  children: [
                    {
                      path: "board",
                      element: <PlaceholderPage title="Board Exams" />,
                    },
                    {
                      path: "competitive",
                      element: <PlaceholderPage title="Competitive Exams" />,
                    },
                    {
                      path: "results",
                      element: <PlaceholderPage title="Result Analysis" />,
                    },
                  ],
                },
              ],
            },

            // Police & Security Routes
            {
              path: "police",
              children: [
                {
                  path: "dashboard",
                  element: <PlaceholderPage title="Police Dashboard" />,
                },
                {
                  path: "stations",
                  children: [
                    {
                      path: "all",
                      element: <PlaceholderPage title="All Thanas" />,
                    },
                    {
                      path: "outposts",
                      element: <PlaceholderPage title="Police Outposts" />,
                    },
                    {
                      path: "checkposts",
                      element: <PlaceholderPage title="Check Posts" />,
                    },
                  ],
                },
                {
                  path: "fir",
                  children: [
                    {
                      path: "register",
                      element: <PlaceholderPage title="Register FIR" />,
                    },
                    {
                      path: "pending",
                      element: <PlaceholderPage title="Pending Cases" />,
                    },
                    {
                      path: "challan",
                      element: <PlaceholderPage title="Challan Status" />,
                    },
                    {
                      path: "court",
                      element: <PlaceholderPage title="Court Cases" />,
                    },
                  ],
                },
                {
                  path: "analytics",
                  children: [
                    {
                      path: "hotspots",
                      element: <PlaceholderPage title="Crime Hotspots" />,
                    },
                    {
                      path: "trends",
                      element: <PlaceholderPage title="Crime Trends" />,
                    },
                    {
                      path: "reports",
                      element: <PlaceholderPage title="Monthly Reports" />,
                    },
                  ],
                },
                {
                  path: "personnel",
                  children: [
                    {
                      path: "directory",
                      element: <PlaceholderPage title="Staff Directory" />,
                    },
                    {
                      path: "roster",
                      element: <PlaceholderPage title="Duty Roster" />,
                    },
                    {
                      path: "training",
                      element: <PlaceholderPage title="Training" />,
                    },
                    {
                      path: "welfare",
                      element: <PlaceholderPage title="Welfare" />,
                    },
                  ],
                },
                {
                  path: "emergency",
                  children: [
                    {
                      path: "112",
                      element: <PlaceholderPage title="112 Calls" />,
                    },
                    {
                      path: "women",
                      element: <PlaceholderPage title="Women Safety" />,
                    },
                    {
                      path: "vip",
                      element: <PlaceholderPage title="VIP Security" />,
                    },
                  ],
                },
              ],
            },

            // Environment & Sanitation Routes
            {
              path: "environment",
              children: [
                {
                  path: "dashboard",
                  element: <PlaceholderPage title="Paryavaran Dashboard" />,
                },
                {
                  path: "swachh",
                  children: [
                    {
                      path: "odf",
                      element: <PlaceholderPage title="ODF Status" />,
                    },
                    {
                      path: "toilets",
                      element: <PlaceholderPage title="Toilet Construction" />,
                    },
                    {
                      path: "garbage",
                      element: <PlaceholderPage title="Garbage Collection" />,
                    },
                    {
                      path: "waste",
                      element: <PlaceholderPage title="Waste Processing" />,
                    },
                  ],
                },
                {
                  path: "green",
                  children: [
                    {
                      path: "plantation",
                      element: <PlaceholderPage title="Plantation Drives" />,
                    },
                    {
                      path: "forest",
                      element: <PlaceholderPage title="Forest Cover" />,
                    },
                    {
                      path: "pollution",
                      element: <PlaceholderPage title="Pollution Control" />,
                    },
                    {
                      path: "river",
                      element: <PlaceholderPage title="River Cleaning" />,
                    },
                  ],
                },
                {
                  path: "urban",
                  children: [
                    {
                      path: "lights",
                      element: <PlaceholderPage title="Street Lights" />,
                    },
                    {
                      path: "roads",
                      element: <PlaceholderPage title="Road Maintenance" />,
                    },
                    {
                      path: "drainage",
                      element: <PlaceholderPage title="Drainage Systems" />,
                    },
                    {
                      path: "parks",
                      element: <PlaceholderPage title="Parks & Gardens" />,
                    },
                  ],
                },
                {
                  path: "compliance",
                  children: [
                    {
                      path: "ngt",
                      element: <PlaceholderPage title="NGT Orders" />,
                    },
                    {
                      path: "reports",
                      element: <PlaceholderPage title="Pollution Reports" />,
                    },
                    {
                      path: "inspections",
                      element: <PlaceholderPage title="Site Inspections" />,
                    },
                  ],
                },
              ],
            },

            // Analytics & Reports Routes
            {
              path: "analytics",
              children: [
                {
                  path: "dashboard",
                  element: <PlaceholderPage title="Vishleshan Dashboard" />,
                },
                {
                  path: "performance",
                  children: [
                    {
                      path: "scorecard",
                      element: <PlaceholderPage title="District Scorecard" />,
                    },
                    {
                      path: "kpis",
                      element: <PlaceholderPage title="Department KPIs" />,
                    },
                    {
                      path: "compare",
                      element: <PlaceholderPage title="Comparative Analysis" />,
                    },
                  ],
                },
                {
                  path: "reports",
                  children: [
                    {
                      path: "builder",
                      element: <PlaceholderPage title="Report Builder" />,
                    },
                    {
                      path: "saved",
                      element: <PlaceholderPage title="Saved Reports" />,
                    },
                    {
                      path: "scheduled",
                      element: <PlaceholderPage title="Scheduled Reports" />,
                    },
                  ],
                },
                {
                  path: "gis",
                  children: [
                    {
                      path: "spatial",
                      element: <PlaceholderPage title="Spatial Analysis" />,
                    },
                    {
                      path: "heatmaps",
                      element: <PlaceholderPage title="Heatmaps" />,
                    },
                    {
                      path: "infrastructure",
                      element: <PlaceholderPage title="Infrastructure Maps" />,
                    },
                  ],
                },
                {
                  path: "statutory",
                  children: [
                    {
                      path: "monthly",
                      element: <PlaceholderPage title="Monthly Reports" />,
                    },
                    {
                      path: "quarterly",
                      element: <PlaceholderPage title="Quarterly Reviews" />,
                    },
                    {
                      path: "annual",
                      element: <PlaceholderPage title="Annual Reports" />,
                    },
                  ],
                },
              ],
            },

            // System Administration Routes
            {
              path: "admin",
              children: [
                {
                  path: "status",
                  element: <PlaceholderPage title="System Status" />,
                },
                {
                  path: "users",
                  children: [
                    {
                      path: "directory",
                      element: <PlaceholderPage title="User Directory" />,
                    },
                    {
                      path: "roles",
                      element: <PlaceholderPage title="Roles & Permissions" />,
                    },
                    {
                      path: "logs",
                      element: <PlaceholderPage title="Access Logs" />,
                    },
                    {
                      path: "password",
                      element: <PlaceholderPage title="Password Reset" />,
                    },
                  ],
                },
                {
                  path: "tenant",
                  children: [
                    {
                      path: "settings",
                      element: <PlaceholderPage title="District Settings" />,
                    },
                    {
                      path: "features",
                      element: <PlaceholderPage title="Feature Flags" />,
                    },
                    {
                      path: "branding",
                      element: <PlaceholderPage title="Branding Config" />,
                    },
                    {
                      path: "integrations",
                      element: <PlaceholderPage title="Integrations" />,
                    },
                  ],
                },
                {
                  path: "settings",
                  children: [
                    {
                      path: "email-sms",
                      element: <PlaceholderPage title="Email/SMS Config" />,
                    },
                    {
                      path: "notifications",
                      element: <PlaceholderPage title="Notification Rules" />,
                    },
                    {
                      path: "backup",
                      element: <PlaceholderPage title="Backup & Restore" />,
                    },
                    {
                      path: "api",
                      element: <PlaceholderPage title="API Management" />,
                    },
                  ],
                },
                {
                  path: "audit",
                  children: [
                    {
                      path: "activity",
                      element: <PlaceholderPage title="Activity Logs" />,
                    },
                    {
                      path: "errors",
                      element: <PlaceholderPage title="Error Logs" />,
                    },
                    {
                      path: "security",
                      element: <PlaceholderPage title="Security Events" />,
                    },
                  ],
                },
              ],
            },

            // Legacy Routes
            {
              path: "station-management",
              children: [
                { path: "stations/all", element: <StationsList /> },
                {
                  path: "stations/add",
                  element: <PlaceholderPage title="Add Station" />,
                },
              ],
            },
            {
              path: "user-management",
              children: [
                {
                  path: "users/all",
                  element: <PlaceholderPage title="All Users" />,
                },
              ],
            },
            // Catch-all route for unmatched paths
            {
              path: "*",
              element: <Navigate to="/dashboard" replace />,
            },
          ],
        },
      ],
    },
  ];

  return useRoutes(routes);
}
