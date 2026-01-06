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
                      index: true,
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

            // Analytics Routes
            {
              path: "analytics",
              children: [
                {
                  path: "overview",
                  element: <PlaceholderPage title="Vishleshan Dashboard" />,
                },
                {
                  path: "crime",
                  children: [
                    {
                      path: "hotspots",
                      element: <PlaceholderPage title="Crime Hotspots" />,
                    },
                    {
                      path: "trends",
                      element: <PlaceholderPage title="Crime Trends" />,
                    },
                  ],
                },
                {
                  path: "health",
                  children: [
                    {
                      path: "outbreaks",
                      element: <PlaceholderPage title="Disease Outbreaks" />,
                    },
                    {
                      path: "capacity",
                      element: <PlaceholderPage title="Hospital Capacity" />,
                    },
                  ],
                },
                {
                  path: "reports/usage",
                  element: <PlaceholderPage title="Usage Reports" />,
                },
                {
                  path: "reports/revenue",
                  element: <PlaceholderPage title="Revenue Reports" />,
                },
              ],
            },

            // System Admin Routes
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
                      path: "staff",
                      element: <PlaceholderPage title="Staff Directory" />,
                    },
                    {
                      path: "roles",
                      element: <PlaceholderPage title="Roles & Permissions" />,
                    },
                  ],
                },
                {
                  path: "resources",
                  children: [
                    { path: "stations", element: <ResourceList /> },
                    { path: "hospitals", element: <ResourceList /> },
                    { path: ":id", element: <ResourceDetail /> },
                  ],
                },
                {
                  path: "settings",
                  children: [
                    {
                      path: "routing",
                      element: <PlaceholderPage title="Routing Rules" />,
                    },
                    {
                      path: "tenant",
                      element: (
                        <PlaceholderPage title="District/Tenant Configuration" />
                      ),
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
