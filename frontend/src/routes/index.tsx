import { lazy } from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import Loadable from "../components/ui/Loadable";

const PersonalTracker = Loadable(
  lazy(() => import("../scopes/personal/PersonalScope")),
);

export default function Router() {
  const routes: RouteObject[] = [
    {
      path: "/*",
      element: <PersonalTracker />,
    },
  ];

  return useRoutes(routes);
}
