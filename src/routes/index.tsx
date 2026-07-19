import { lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import Loadable from "../components/ui/Loadable";
import { OfficialLayout as AppLayout } from "../layouts";
import ProtectedRoute from "./ProtectedRoute";
import { PlaceholderPage } from "../components/ui/PlaceholderPage";
import { LifeOSScopePlaceholder } from "../app/LifeOSScopePlaceholder";

// Lazy imports for pages
const LifeOSHome = Loadable(lazy(() => import("../pages/LifeOSHome/LifeOSHome")));

const LandingPage = Loadable(
  lazy(() => import("../pages/Landing/LandingPage")),
);
const LoginPage = Loadable(lazy(() => import("../pages/Auth/LoginPage")));
const PersonalScope = Loadable(
  lazy(() => import("../scopes/personal/PersonalScope")),
);

const DistrictMagistrateOffice = Loadable(
  lazy(() => import("../pages/District/DistrictMagistrateOffice")),
);

const PoliceStationsPage = Loadable(
  lazy(() => import("../pages/Police/PoliceStationsPage")),
);

// Handle named export for StationsList
const StationsList = Loadable(
  lazy(() =>
    import("../pages/Stations/StationsList").then((module) => ({
      default: module.StationsList,
    })),
  ),
);

const ResourceTablePage = Loadable(
  lazy(() => import("../components/ui/DataTable/ResourceTablePage")),
);

const DashboardPage = Loadable(
  lazy(() => import("../pages/Dashboard/Dashboard")),
);

export default function Router() {
  const routes: RouteObject[] = [
    // Public Routes
    {
      path: "/",
      element: <LifeOSHome />,
    },
    {
      path: "/personal/*",
      element: <PersonalScope />,
    },
    {
      path: "/societal",
      element: <LifeOSScopePlaceholder scopeId="societal" />,
    },
    {
      path: "/state",
      element: <LifeOSScopePlaceholder scopeId="state" />,
    },
    {
      path: "/country",
      element: <LifeOSScopePlaceholder scopeId="country" />,
    },
    {
      path: "/world",
      element: <LifeOSScopePlaceholder scopeId="world" />,
    },
    {
      path: "/city/landing",
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
            { path: "city", element: <DashboardPage /> },
            { path: "city/dashboard", element: <DashboardPage /> },
            { path: "dashboard", element: <DashboardPage /> },

            // District Admin Routes (Detailed)
            {
              path: "district",
              children: [
                {
                  path: "collectorate",
                  element: <DistrictMagistrateOffice />,
                },
                {
                  path: "sub-divisions",
                  element: <ResourceTablePage title="Sub-Divisions" />,
                },
                {
                  path: "tehsils",
                  element: <ResourceTablePage title="Sub-Districts" />,
                },
                {
                  path: "blocks",
                  element: <ResourceTablePage title="Development Blocks" />,
                },
                {
                  path: "calendar",
                  element: <ResourceTablePage title="Meeting Calendar" />,
                },
                {
                  path: "minutes",
                  element: <ResourceTablePage title="Meeting Minutes" />,
                },
                {
                  path: "vip-visits",
                  element: <ResourceTablePage title="VIP Visits Protocol" />,
                },
                {
                  path: "orders",
                  element: <ResourceTablePage title="District Orders" />,
                },
                {
                  path: "circulars",
                  element: <ResourceTablePage title="Official Circulars" />,
                },
                {
                  path: "directives",
                  element: <ResourceTablePage title="Central Directives" />,
                },
                {
                  path: "officers",
                  element: <ResourceTablePage title="Officer Directory" />,
                },
                {
                  path: "transfers",
                  element: <ResourceTablePage title="Transfers & Postings" />,
                },
                {
                  path: "attendance",
                  element: <ResourceTablePage title="Staff Attendance" />,
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
                      element: <ResourceTablePage title="Active Incidents" />,
                    },
                    {
                      path: "resolved",
                      element: <ResourceTablePage title="Closed Incidents" />,
                    },
                  ],
                },
                // Dispatch (Direct route as per config)
                {
                  path: "dispatch",
                  element: <ResourceTablePage title="Dispatch Operations" />,
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
                      element: <ResourceTablePage title="Asset Tracking" />,
                    },
                    {
                      path: "hotspots",
                      element: <ResourceTablePage title="Risk Heatmaps" />,
                    },
                    {
                      path: "traffic",
                      element: <ResourceTablePage title="Traffic Conditions" />,
                    },
                  ],
                },
                // Emergency Resources Group
                {
                  path: "resources",
                  children: [
                    {
                      path: "fire",
                      element: <ResourceTablePage title="Fire Stations" />,
                    },
                    {
                      path: "ambulance",
                      element: <ResourceTablePage title="Ambulance Fleet" />,
                    },
                    {
                      path: "police",
                      element: <ResourceTablePage title="Patrol Vehicles" />,
                    },
                    {
                      path: "equipment",
                      element: (
                        <ResourceTablePage title="Emergency Equipment" />
                      ),
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
                  element: <ResourceTablePage title="Police & Security Ops" />,
                },
                {
                  path: "health",
                  element: <ResourceTablePage title="Health & Medical Ops" />,
                },
                {
                  path: "fire",
                  element: <ResourceTablePage title="Fire & Safety Ops" />,
                },
                {
                  path: "public-works",
                  element: <ResourceTablePage title="Public Works Ops" />,
                },
              ],
            },

            // Grievance Routes (Maintained)
            {
              path: "grievance",
              children: [
                {
                  path: "reports",
                  element: <ResourceTablePage title="Citizen Reports" />,
                },
                {
                  path: "tickets",
                  element: <ResourceTablePage title="Ticket Status" />,
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
                        <ResourceTablePage title="District Performance Metrics" />
                      ),
                    },
                    {
                      path: "compare",
                      element: (
                        <ResourceTablePage title="Comparative Analysis" />
                      ),
                    },
                    {
                      path: "reports",
                      element: (
                        <ResourceTablePage title="Monthly District Reports" />
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
                        <ResourceTablePage title="Central Gov Schemes" />
                      ),
                    },
                    {
                      path: "state",
                      element: <ResourceTablePage title="State Gov Schemes" />,
                    },
                    {
                      path: "status",
                      element: (
                        <ResourceTablePage title="Implementation Status" />
                      ),
                    },
                  ],
                },
                {
                  path: "reports",
                  children: [
                    {
                      path: "high-command",
                      element: <ResourceTablePage title="Ministry Reports" />,
                    },
                    {
                      path: "cabinet",
                      element: <ResourceTablePage title="Cabinet Briefings" />,
                    },
                    {
                      path: "legislature",
                      element: (
                        <ResourceTablePage title="Legislative Reports" />
                      ),
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
                  element: (
                    <ResourceTablePage title="Citizen Portal Overview" />
                  ),
                },
                {
                  path: "certificates",
                  children: [
                    {
                      path: "birth",
                      element: <ResourceTablePage title="Birth Certificate" />,
                    },
                    {
                      path: "death",
                      element: <ResourceTablePage title="Death Certificate" />,
                    },
                    {
                      path: "caste",
                      element: <ResourceTablePage title="Caste Certificate" />,
                    },
                    {
                      path: "income",
                      element: <ResourceTablePage title="Income Certificate" />,
                    },
                    {
                      path: "domicile",
                      element: (
                        <ResourceTablePage title="Domicile Certificate" />
                      ),
                    },
                    {
                      path: "character",
                      element: (
                        <ResourceTablePage title="Character Certificate" />
                      ),
                    },
                  ],
                },
                {
                  path: "payments",
                  children: [
                    {
                      path: "property-tax",
                      element: <ResourceTablePage title="Property Tax" />,
                    },
                    {
                      path: "water",
                      element: <ResourceTablePage title="Water Charges" />,
                    },
                    {
                      path: "electricity",
                      element: (
                        <ResourceTablePage title="Electricity Charges" />
                      ),
                    },
                    {
                      path: "trade-license",
                      element: <ResourceTablePage title="Trade License" />,
                    },
                  ],
                },
                {
                  path: "grievances",
                  children: [
                    {
                      path: "new",
                      element: <ResourceTablePage title="File Complaint" />,
                    },
                    {
                      path: "track",
                      element: <ResourceTablePage title="Track Status" />,
                    },
                    {
                      path: "cm-helpline",
                      element: <ResourceTablePage title="State Helpline" />,
                    },
                  ],
                },
                {
                  path: "e-district",
                  children: [
                    {
                      path: "rti",
                      element: (
                        <ResourceTablePage title="RTI (Right to Info)" />
                      ),
                    },
                    {
                      path: "arms",
                      element: <ResourceTablePage title="Arms License" />,
                    },
                    {
                      path: "other",
                      element: <ResourceTablePage title="Other Services" />,
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
                      element: <ResourceTablePage title="PM Housing Scheme" />,
                    },
                    {
                      path: "pm-kisan",
                      element: <ResourceTablePage title="PM Farmers Fund" />,
                    },
                    {
                      path: "mgnrega",
                      element: (
                        <ResourceTablePage title="Rural Employment (MGNREGA)" />
                      ),
                    },
                    {
                      path: "ujjwala",
                      element: (
                        <ResourceTablePage title="PM Clean Fuel Scheme" />
                      ),
                    },
                    {
                      path: "ayushman",
                      element: <ResourceTablePage title="PM Health Scheme" />,
                    },
                  ],
                },
                {
                  path: "state",
                  children: [
                    {
                      path: "cm",
                      element: (
                        <ResourceTablePage title="Chief Minister Schemes" />
                      ),
                    },
                    {
                      path: "subsidies",
                      element: <ResourceTablePage title="Subsidies & Grants" />,
                    },
                    {
                      path: "local",
                      element: (
                        <ResourceTablePage title="Local Area Development" />
                      ),
                    },
                  ],
                },
                {
                  path: "implementation",
                  children: [
                    {
                      path: "beneficiaries",
                      element: <ResourceTablePage title="Beneficiary List" />,
                    },
                    {
                      path: "funds",
                      element: <ResourceTablePage title="Fund Utilization" />,
                    },
                    {
                      path: "progress",
                      element: <ResourceTablePage title="Progress Reports" />,
                    },
                    {
                      path: "geo",
                      element: <ResourceTablePage title="Geo-Tagging Status" />,
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
                      element: (
                        <ResourceTablePage title="Rights Records (RoR)" />
                      ),
                    },
                    {
                      path: "maps",
                      element: <ResourceTablePage title="Digital Land Maps" />,
                    },
                    {
                      path: "mutation",
                      element: <ResourceTablePage title="Mutation Records" />,
                    },
                    {
                      path: "digitization",
                      element: (
                        <ResourceTablePage title="Digitization Status" />
                      ),
                    },
                  ],
                },
                {
                  path: "disputes",
                  children: [
                    {
                      path: "pending",
                      element: (
                        <ResourceTablePage title="Pending Revenue Cases" />
                      ),
                    },
                    {
                      path: "court",
                      element: <ResourceTablePage title="Land Court" />,
                    },
                    {
                      path: "appeals",
                      element: (
                        <ResourceTablePage title="Appeals & Tribunals" />
                      ),
                    },
                  ],
                },
                {
                  path: "collection",
                  children: [
                    {
                      path: "stamp",
                      element: <ResourceTablePage title="Stamp Duties" />,
                    },
                    {
                      path: "registration",
                      element: <ResourceTablePage title="Land Registration" />,
                    },
                    {
                      path: "land",
                      element: <ResourceTablePage title="Land Revenue" />,
                    },
                  ],
                },
                {
                  path: "patwari",
                  children: [
                    {
                      path: "daily",
                      element: (
                        <ResourceTablePage title="Revenue Officer Reports" />
                      ),
                    },
                    {
                      path: "visits",
                      element: <ResourceTablePage title="Field Visit Logs" />,
                    },
                    {
                      path: "crop",
                      element: <ResourceTablePage title="Crop Survey Data" />,
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
                      element: <ResourceTablePage title="District Hospital" />,
                    },
                    {
                      path: "chc-phc",
                      element: (
                        <ResourceTablePage title="Health Centers (CHC/PHC)" />
                      ),
                    },
                    {
                      path: "sub-centers",
                      element: <ResourceTablePage title="Health Sub-Centers" />,
                    },
                    {
                      path: "private",
                      element: <ResourceTablePage title="Private Hospitals" />,
                    },
                  ],
                },
                {
                  path: "programs",
                  children: [
                    {
                      path: "immunization",
                      element: <ResourceTablePage title="Immunization" />,
                    },
                    {
                      path: "maternal",
                      element: <ResourceTablePage title="Maternal Care" />,
                    },
                    {
                      path: "family",
                      element: <ResourceTablePage title="Family Welfare" />,
                    },
                    {
                      path: "disease",
                      element: <ResourceTablePage title="Disease Control" />,
                    },
                  ],
                },
                {
                  path: "surveillance",
                  children: [
                    {
                      path: "outbreaks",
                      element: <ResourceTablePage title="Disease Alerts" />,
                    },
                    {
                      path: "epidemic",
                      element: <ResourceTablePage title="Epidemic Tracking" />,
                    },
                    {
                      path: "lab",
                      element: <ResourceTablePage title="Lab Reports" />,
                    },
                  ],
                },
                {
                  path: "resources",
                  children: [
                    {
                      path: "doctors",
                      element: (
                        <ResourceTablePage title="Doctor Availability" />
                      ),
                    },
                    {
                      path: "medicine",
                      element: <ResourceTablePage title="Medical Inventory" />,
                    },
                    {
                      path: "equipment",
                      element: <ResourceTablePage title="Equipment Status" />,
                    },
                    {
                      path: "ambulance",
                      element: <ResourceTablePage title="Ambulance Fleet" />,
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
                      element: <ResourceTablePage title="Government Schools" />,
                    },
                    {
                      path: "private",
                      element: <ResourceTablePage title="Private Schools" />,
                    },

                    {
                      path: "special",
                      element: <ResourceTablePage title="Special Schools" />,
                    },
                  ],
                },
                {
                  path: "students",
                  children: [
                    {
                      path: "enrollment",
                      element: <ResourceTablePage title="Enrollment Data" />,
                    },
                    {
                      path: "dropout",
                      element: <ResourceTablePage title="Retention Tracking" />,
                    },
                    {
                      path: "scholarship",
                      element: <ResourceTablePage title="Scholarships" />,
                    },
                    {
                      path: "mdm",
                      element: <ResourceTablePage title="Nutrition Program" />,
                    },
                  ],
                },
                {
                  path: "teachers",
                  children: [
                    {
                      path: "directory",
                      element: <ResourceTablePage title="Teacher Directory" />,
                    },
                    {
                      path: "training",
                      element: <ResourceTablePage title="Training Programs" />,
                    },
                    {
                      path: "transfers",
                      element: <ResourceTablePage title="Transfer Requests" />,
                    },
                    {
                      path: "attendance",
                      element: <ResourceTablePage title="Teacher Attendance" />,
                    },
                  ],
                },
                {
                  path: "exams",
                  children: [
                    {
                      path: "board",
                      element: <ResourceTablePage title="Board Examinations" />,
                    },
                    {
                      path: "competitive",
                      element: <ResourceTablePage title="Competitive Tests" />,
                    },
                    {
                      path: "results",
                      element: (
                        <ResourceTablePage title="Performance Analysis" />
                      ),
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
                      element: <PoliceStationsPage />,
                    },
                    {
                      path: "outposts",
                      element: <ResourceTablePage title="Police Outposts" />,
                    },
                    {
                      path: "checkposts",
                      element: <ResourceTablePage title="Checkpoints" />,
                    },
                  ],
                },
                {
                  path: "fir",
                  children: [
                    {
                      path: "register",
                      element: <ResourceTablePage title="File New Report" />,
                    },
                    {
                      path: "pending",
                      element: <ResourceTablePage title="Pending Cases" />,
                    },
                    {
                      path: "challan",
                      element: <ResourceTablePage title="Traffic Fines" />,
                    },
                    {
                      path: "court",
                      element: <ResourceTablePage title="Court Cases" />,
                    },
                  ],
                },
                {
                  path: "analytics",
                  children: [
                    {
                      path: "hotspots",
                      element: <ResourceTablePage title="Crime Hotspots" />,
                    },
                    {
                      path: "trends",
                      element: <ResourceTablePage title="Crime Trends" />,
                    },
                    {
                      path: "reports",
                      element: <ResourceTablePage title="Monthly Reports" />,
                    },
                  ],
                },
                {
                  path: "personnel",
                  children: [
                    {
                      path: "directory",
                      element: <ResourceTablePage title="Staff Directory" />,
                    },
                    {
                      path: "roster",
                      element: <ResourceTablePage title="Duty Roster" />,
                    },
                    {
                      path: "training",
                      element: <ResourceTablePage title="Training" />,
                    },
                    {
                      path: "welfare",
                      element: <ResourceTablePage title="Welfare" />,
                    },
                  ],
                },
                {
                  path: "emergency",
                  children: [
                    {
                      path: "112",
                      element: (
                        <ResourceTablePage title="Emergency Calls (112)" />
                      ),
                    },
                    {
                      path: "women",
                      element: <ResourceTablePage title="Women's Safety" />,
                    },
                    {
                      path: "vip",
                      element: <ResourceTablePage title="VIP Protection" />,
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
                        <ResourceTablePage title="Open Defecation Free (ODF)" />
                      ),
                    },
                    {
                      path: "toilets",
                      element: (
                        <ResourceTablePage title="Sanitation Infrastructure" />
                      ),
                    },
                    {
                      path: "garbage",
                      element: <ResourceTablePage title="Garbage Collection" />,
                    },
                    {
                      path: "waste",
                      element: <ResourceTablePage title="Waste Processing" />,
                    },
                  ],
                },
                {
                  path: "green",
                  children: [
                    {
                      path: "plantation",
                      element: <ResourceTablePage title="Plantation Drives" />,
                    },
                    {
                      path: "forest",
                      element: <ResourceTablePage title="Forest Cover" />,
                    },
                    {
                      path: "pollution",
                      element: <ResourceTablePage title="Pollution Control" />,
                    },
                    {
                      path: "river",
                      element: <ResourceTablePage title="River Cleaning" />,
                    },
                  ],
                },
                {
                  path: "urban",
                  children: [
                    {
                      path: "lights",
                      element: <ResourceTablePage title="Street Lighting" />,
                    },
                    {
                      path: "roads",
                      element: <ResourceTablePage title="Road Maintenance" />,
                    },
                    {
                      path: "drainage",
                      element: <ResourceTablePage title="Drainage Systems" />,
                    },
                    {
                      path: "parks",
                      element: (
                        <ResourceTablePage title="Public Parks & Gardens" />
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
                        <ResourceTablePage title="Green Tribunal Orders" />
                      ),
                    },
                    {
                      path: "reports",
                      element: <ResourceTablePage title="Pollution Reports" />,
                    },
                    {
                      path: "inspections",
                      element: <ResourceTablePage title="Site Inspections" />,
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
                      element: <ResourceTablePage title="District Scorecard" />,
                    },
                    {
                      path: "kpis",
                      element: <ResourceTablePage title="Departmental KPIs" />,
                    },
                    {
                      path: "compare",
                      element: (
                        <ResourceTablePage title="Comparative Analysis" />
                      ),
                    },
                  ],
                },
                {
                  path: "reports",
                  children: [
                    {
                      path: "builder",
                      element: <ResourceTablePage title="Report Builder" />,
                    },
                    {
                      path: "saved",
                      element: <ResourceTablePage title="Saved Reports" />,
                    },
                    {
                      path: "scheduled",
                      element: <ResourceTablePage title="Scheduled Reports" />,
                    },
                  ],
                },
                {
                  path: "gis",
                  children: [
                    {
                      path: "spatial",
                      element: <ResourceTablePage title="Spatial Analysis" />,
                    },
                    {
                      path: "heatmaps",
                      element: <ResourceTablePage title="Heatmaps" />,
                    },
                    {
                      path: "infrastructure",
                      element: (
                        <ResourceTablePage title="Infrastructure Mapping" />
                      ),
                    },
                  ],
                },
                {
                  path: "statutory",
                  children: [
                    {
                      path: "monthly",
                      element: <ResourceTablePage title="Monthly Reports" />,
                    },
                    {
                      path: "quarterly",
                      element: <ResourceTablePage title="Quarterly Reports" />,
                    },
                    {
                      path: "annual",
                      element: <ResourceTablePage title="Annual Reports" />,
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
                  element: <ResourceTablePage title="System Status" />,
                },
                {
                  path: "users",
                  children: [
                    {
                      path: "directory",
                      element: <ResourceTablePage title="User Directory" />,
                    },
                    {
                      path: "roles",
                      element: (
                        <ResourceTablePage title="Roles & Permissions" />
                      ),
                    },
                    {
                      path: "logs",
                      element: <ResourceTablePage title="Access Logs" />,
                    },
                    {
                      path: "password",
                      element: <ResourceTablePage title="Password Reset" />,
                    },
                  ],
                },
                {
                  path: "tenant",
                  children: [
                    {
                      path: "settings",
                      element: <ResourceTablePage title="District Settings" />,
                    },
                    {
                      path: "features",
                      element: <ResourceTablePage title="Feature Flags" />,
                    },
                    {
                      path: "branding",
                      element: <ResourceTablePage title="Branding Settings" />,
                    },
                    {
                      path: "integrations",
                      element: <ResourceTablePage title="Integrations" />,
                    },
                  ],
                },
                {
                  path: "settings",
                  children: [
                    {
                      path: "email-sms",
                      element: (
                        <ResourceTablePage title="Communication Channels" />
                      ),
                    },
                    {
                      path: "notifications",
                      element: (
                        <ResourceTablePage title="Notification Policies" />
                      ),
                    },
                    {
                      path: "backup",
                      element: <ResourceTablePage title="Backup & Restore" />,
                    },
                    {
                      path: "api",
                      element: <ResourceTablePage title="API Management" />,
                    },
                  ],
                },
                {
                  path: "audit",
                  children: [
                    {
                      path: "activity",
                      element: <ResourceTablePage title="Activity Logs" />,
                    },
                    {
                      path: "errors",
                      element: <ResourceTablePage title="Error Logs" />,
                    },
                    {
                      path: "security",
                      element: <ResourceTablePage title="Security Events" />,
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
                  element: <ResourceTablePage title="Add Station" />,
                },
              ],
            },
            {
              path: "user-management",
              children: [
                {
                  path: "users/all",
                  element: <ResourceTablePage title="All Users" />,
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
