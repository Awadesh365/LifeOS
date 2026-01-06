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
                    <PlaceholderPage title="District Magistrate Office" />
                  ),
                },
                {
                  path: "sub-divisions",
                  element: <PlaceholderPage title="Sub-Divisions" />,
                },
                {
                  path: "tehsils",
                  element: <PlaceholderPage title="Sub-Districts" />,
                },
                {
                  path: "blocks",
                  element: <PlaceholderPage title="Development Blocks" />,
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
                      element: <PlaceholderPage title="Active Incidents" />,
                    },
                    {
                      path: "resolved",
                      element: <PlaceholderPage title="Closed Incidents" />,
                    },
                  ],
                },
                // Dispatch (Direct route as per config)
                {
                  path: "dispatch",
                  element: <PlaceholderPage title="Dispatch Operations" />,
                },
                // Map & Command Center Group
                {
                  path: "map",
                  children: [
                    {
                      path: "overview",
                      element: <PlaceholderPage title="Command Center" />,
                    },
                    {
                      path: "resources",
                      element: <PlaceholderPage title="Asset Tracking" />,
                    },
                    {
                      path: "hotspots",
                      element: <PlaceholderPage title="Risk Heatmaps" />,
                    },
                    {
                      path: "traffic",
                      element: <PlaceholderPage title="Traffic Conditions" />,
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
                      element: <PlaceholderPage title="Ambulance Fleet" />,
                    },
                    {
                      path: "police",
                      element: <PlaceholderPage title="Patrol Vehicles" />,
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
                  element: <PlaceholderPage title="Citizen Reports" />,
                },
                {
                  path: "tickets",
                  element: <PlaceholderPage title="Ticket Status" />,
                },
              ],
            },

            // State Admin Routes
            {
              path: "state",
              children: [
                {
                  path: "dashboard",
                  element: <PlaceholderPage title="State Dashboard" />,
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
                      element: <PlaceholderPage title="Central Gov Schemes" />,
                    },
                    {
                      path: "state",
                      element: <PlaceholderPage title="State Gov Schemes" />,
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
                      element: <PlaceholderPage title="Ministry Reports" />,
                    },
                    {
                      path: "cabinet",
                      element: <PlaceholderPage title="Cabinet Briefings" />,
                    },
                    {
                      path: "legislature",
                      element: <PlaceholderPage title="Legislative Reports" />,
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
                  element: <PlaceholderPage title="Citizen Portal Overview" />,
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
                      element: <PlaceholderPage title="Water Charges" />,
                    },
                    {
                      path: "electricity",
                      element: <PlaceholderPage title="Electricity Charges" />,
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
                      element: <PlaceholderPage title="State Helpline" />,
                    },
                  ],
                },
                {
                  path: "e-district",
                  children: [
                    {
                      path: "rti",
                      element: <PlaceholderPage title="RTI (Right to Info)" />,
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
                  element: <PlaceholderPage title="Schemes Dashboard" />,
                },
                {
                  path: "central",
                  children: [
                    {
                      path: "pm-awas",
                      element: <PlaceholderPage title="PM Housing Scheme" />,
                    },
                    {
                      path: "pm-kisan",
                      element: <PlaceholderPage title="PM Farmers Fund" />,
                    },
                    {
                      path: "mgnrega",
                      element: (
                        <PlaceholderPage title="Rural Employment (MGNREGA)" />
                      ),
                    },
                    {
                      path: "ujjwala",
                      element: <PlaceholderPage title="PM Clean Fuel Scheme" />,
                    },
                    {
                      path: "ayushman",
                      element: <PlaceholderPage title="PM Health Scheme" />,
                    },
                  ],
                },
                {
                  path: "state",
                  children: [
                    {
                      path: "cm",
                      element: (
                        <PlaceholderPage title="Chief Minister Schemes" />
                      ),
                    },
                    {
                      path: "subsidies",
                      element: <PlaceholderPage title="Subsidies & Grants" />,
                    },
                    {
                      path: "local",
                      element: (
                        <PlaceholderPage title="Local Area Development" />
                      ),
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
                      element: <PlaceholderPage title="Geo-Tagging Status" />,
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
                  element: <PlaceholderPage title="Revenue Dashboard" />,
                },
                {
                  path: "land",
                  children: [
                    {
                      path: "khatauni",
                      element: <PlaceholderPage title="Rights Records (RoR)" />,
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
                      element: <PlaceholderPage title="Land Court" />,
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
                      element: <PlaceholderPage title="Stamp Duties" />,
                    },
                    {
                      path: "registration",
                      element: <PlaceholderPage title="Land Registration" />,
                    },
                    {
                      path: "land",
                      element: <PlaceholderPage title="Land Revenue" />,
                    },
                  ],
                },
                {
                  path: "patwari",
                  children: [
                    {
                      path: "daily",
                      element: (
                        <PlaceholderPage title="Revenue Officer Reports" />
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
                  element: <PlaceholderPage title="Health Dashboard" />,
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
                      element: (
                        <PlaceholderPage title="Health Centers (CHC/PHC)" />
                      ),
                    },
                    {
                      path: "sub-centers",
                      element: <PlaceholderPage title="Health Sub-Centers" />,
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
                      element: <PlaceholderPage title="Maternal Care" />,
                    },
                    {
                      path: "family",
                      element: <PlaceholderPage title="Family Welfare" />,
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
                      element: <PlaceholderPage title="Disease Alerts" />,
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
                      element: <PlaceholderPage title="Medical Inventory" />,
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
                  element: <PlaceholderPage title="Education Dashboard" />,
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
                      element: <PlaceholderPage title="Retention Tracking" />,
                    },
                    {
                      path: "scholarship",
                      element: <PlaceholderPage title="Scholarships" />,
                    },
                    {
                      path: "mdm",
                      element: <PlaceholderPage title="Nutrition Program" />,
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
                      element: <PlaceholderPage title="Board Examinations" />,
                    },
                    {
                      path: "competitive",
                      element: <PlaceholderPage title="Competitive Tests" />,
                    },
                    {
                      path: "results",
                      element: <PlaceholderPage title="Performance Analysis" />,
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
                      element: <PlaceholderPage title="Police Stations" />,
                    },
                    {
                      path: "outposts",
                      element: <PlaceholderPage title="Police Outposts" />,
                    },
                    {
                      path: "checkposts",
                      element: <PlaceholderPage title="Checkpoints" />,
                    },
                  ],
                },
                {
                  path: "fir",
                  children: [
                    {
                      path: "register",
                      element: <PlaceholderPage title="File New Report" />,
                    },
                    {
                      path: "pending",
                      element: <PlaceholderPage title="Pending Cases" />,
                    },
                    {
                      path: "challan",
                      element: <PlaceholderPage title="Traffic Fines" />,
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
                      element: (
                        <PlaceholderPage title="Emergency Calls (112)" />
                      ),
                    },
                    {
                      path: "women",
                      element: <PlaceholderPage title="Women's Safety" />,
                    },
                    {
                      path: "vip",
                      element: <PlaceholderPage title="VIP Protection" />,
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
                  element: <PlaceholderPage title="Environment Dashboard" />,
                },
                {
                  path: "swachh",
                  children: [
                    {
                      path: "odf",
                      element: (
                        <PlaceholderPage title="Open Defecation Free (ODF)" />
                      ),
                    },
                    {
                      path: "toilets",
                      element: (
                        <PlaceholderPage title="Sanitation Infrastructure" />
                      ),
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
                      element: <PlaceholderPage title="Street Lighting" />,
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
                      element: (
                        <PlaceholderPage title="Public Parks & Gardens" />
                      ),
                    },
                  ],
                },
                {
                  path: "compliance",
                  children: [
                    {
                      path: "ngt",
                      element: (
                        <PlaceholderPage title="Green Tribunal Orders" />
                      ),
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
                  element: <PlaceholderPage title="Analytics Dashboard" />,
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
                      element: <PlaceholderPage title="Departmental KPIs" />,
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
                      element: (
                        <PlaceholderPage title="Infrastructure Mapping" />
                      ),
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
                      element: <PlaceholderPage title="Quarterly Reports" />,
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
                      element: <PlaceholderPage title="Branding Settings" />,
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
                      element: (
                        <PlaceholderPage title="Communication Channels" />
                      ),
                    },
                    {
                      path: "notifications",
                      element: (
                        <PlaceholderPage title="Notification Policies" />
                      ),
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
