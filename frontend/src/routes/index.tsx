import { lazy } from "react";
import { Navigate, RouteObject, useRoutes, useLocation } from "react-router-dom";
import Loadable from "../components/ui/Loadable";
import LoginPage from '../auth/LoginPage';
import RequireAuth from '../auth/RequireAuth';

const Home = Loadable(lazy(() => import("../scopes/home/HomePage")));
const PersonalTracker = Loadable(
  lazy(() => import("../scopes/personal/PersonalScope")),
);

const legacyWorkspacePaths = [
  "habits",
  "routine",
  "learning",
  "jobs",
  "goals",
  "projects",
  "philosophy",
  "articles",
  "health",
  "wealth",
  "money",
  "debts",
  "funds",
  "networking",
  "career",
  "future-plans",
  "diet",
  "training",
  "maintenance",
];

function IntelligenceRedirect() {
  const location = useLocation();
  return <Navigate to={`/app${location.pathname}${location.search}`} replace />;
}

export default function Router() {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/app/*",
      element: <RequireAuth><PersonalTracker /></RequireAuth>,
    },
    { path: '/login', element: <LoginPage /> },
    { path: '/intelligence/*', element: <IntelligenceRedirect /> },
    ...legacyWorkspacePaths.map((path) => ({
      path: `/${path}`,
      element: <Navigate to={`/app/${path}`} replace />,
    })),
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ];

  return useRoutes(routes);
}
