import { lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import Loadable from "../components/ui/Loadable";

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
  "debts",
  "funds",
  "networking",
  "career",
  "future-plans",
  "diet",
  "training",
];

export default function Router() {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/app/*",
      element: <PersonalTracker />,
    },
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
