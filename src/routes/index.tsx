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

            // Emergency / Command Center Routes (Expanded)
            {
              path: "emergency",
              children: [
                {
                  path: "incidents/active",
                  element: (
                    <PlaceholderPage title="Active Incidents (Aapatkaleen)" />
                  ),
                },
                {
                  path: "incidents/resolved",
                  element: <PlaceholderPage title="Resolved Incidents" />,
                },
                {
                  path: "dispatch",
                  element: <PlaceholderPage title="Dispatch Queue" />,
                },
                {
                  path: "map",
                  element: <PlaceholderPage title="Live Resource Map" />,
                },
                {
                  path: "map/resources",
                  element: <PlaceholderPage title="Resource Locations" />,
                },
                {
                  path: "map/hotspots",
                  element: <PlaceholderPage title="Incident Hotspots" />,
                },
                {
                  path: "map/traffic",
                  element: <PlaceholderPage title="Traffic Status" />,
                },
                {
                  path: "resources/fire",
                  element: <PlaceholderPage title="Fire Stations" />,
                },
                {
                  path: "resources/ambulance",
                  element: <PlaceholderPage title="Ambulance Services" />,
                },
                {
                  path: "resources/police",
                  element: <PlaceholderPage title="Police Vehicles" />,
                },
                {
                  path: "resources/equipment",
                  element: <PlaceholderPage title="Emergency Equipment" />,
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
                  ],
                },
                {
                  path: "reports",
                  element: <PlaceholderPage title="High Command Reports" />,
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
                  path: "registry",
                  element: (
                    <PlaceholderPage title="Janam-Mrityu (Birth & Death)" />
                  ),
                },
                {
                  path: "utilities",
                  element: (
                    <PlaceholderPage title="Utilities & Billing (Bijli/Pani)" />
                  ),
                },
                {
                  path: "tax",
                  element: (
                    <PlaceholderPage title="Sampatti Kar (Property Tax)" />
                  ),
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
