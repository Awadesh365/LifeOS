import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
} from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useAppSelector } from "./hooks/redux";
import AppLayout from "./layout/AppLayout";
import { premiumTheme } from "./theme/premiumTheme";
import { StationsList } from "./pages/Stations/StationsList";
import { PlaceholderPage } from "./components/common/PlaceholderPage";
import LandingPage from "./pages/Landing/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import ResourceList from "./pages/Resources/ResourceList";
import ResourceDetail from "./pages/Resources/ResourceDetail";
import "./styles/premium.css";

// Sample page components (placeholders)
const DashboardPage = () => (
  <PlaceholderPage
    title="City Overview Dashboard"
    description="Real-time metrics, safety index, and active emergency summaries."
  />
);

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={premiumTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AppLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />

                {/* District Admin / Command Center Routes */}
                <Route path="emergency">
                  <Route
                    path="incidents/active"
                    element={
                      <PlaceholderPage title="Active Incidents (Aapatkaleen)" />
                    }
                  />
                  <Route
                    path="dispatch"
                    element={<PlaceholderPage title="Dispatch Queue" />}
                  />
                  <Route
                    path="map"
                    element={<PlaceholderPage title="Live Resource Map" />}
                  />
                </Route>
                <Route path="ops">
                  <Route
                    path="police"
                    element={<PlaceholderPage title="Police & Security Ops" />}
                  />
                  <Route
                    path="health"
                    element={<PlaceholderPage title="Health & Medical Ops" />}
                  />
                  <Route
                    path="fire"
                    element={<PlaceholderPage title="Fire & Safety Ops" />}
                  />
                  <Route
                    path="public-works"
                    element={<PlaceholderPage title="Public Works Ops" />}
                  />
                </Route>
                <Route path="grievance">
                  <Route
                    path="reports"
                    element={
                      <PlaceholderPage title="Citizen Reports (Jan Shikayat)" />
                    }
                  />
                  <Route
                    path="tickets"
                    element={
                      <PlaceholderPage title="Ticket Status (Nivaran)" />
                    }
                  />
                </Route>

                {/* State Admin Routes (New) */}
                <Route path="state">
                  <Route
                    path="dashboard"
                    element={
                      <PlaceholderPage title="Rajya Dashboard (State Overview)" />
                    }
                  />
                  <Route path="districts">
                    <Route
                      path="performance"
                      element={
                        <PlaceholderPage title="District Performance Metrics" />
                      }
                    />
                    <Route
                      path="reports"
                      element={
                        <PlaceholderPage title="Monthly District Reports" />
                      }
                    />
                  </Route>
                  <Route path="schemes">
                    <Route
                      path="central"
                      element={
                        <PlaceholderPage title="Central Schemes (PM Yojana)" />
                      }
                    />
                    <Route
                      path="state"
                      element={
                        <PlaceholderPage title="State Schemes (CM Yojana)" />
                      }
                    />
                  </Route>
                  <Route
                    path="reports"
                    element={<PlaceholderPage title="High Command Reports" />}
                  />
                </Route>

                {/* Citizen Services Routes */}
                <Route path="services">
                  <Route
                    path="overview"
                    element={<PlaceholderPage title="Suvidha Overview" />}
                  />
                  <Route
                    path="registry"
                    element={
                      <PlaceholderPage title="Janam-Mrityu (Birth & Death)" />
                    }
                  />
                  <Route
                    path="utilities"
                    element={
                      <PlaceholderPage title="Utilities & Billing (Bijli/Pani)" />
                    }
                  />
                  <Route
                    path="tax"
                    element={
                      <PlaceholderPage title="Sampatti Kar (Property Tax)" />
                    }
                  />
                </Route>

                {/* Analytics Routes */}
                <Route path="analytics">
                  <Route
                    path="overview"
                    element={<PlaceholderPage title="Vishleshan Dashboard" />}
                  />
                  <Route path="crime">
                    <Route
                      path="hotspots"
                      element={<PlaceholderPage title="Crime Hotspots" />}
                    />
                    <Route
                      path="trends"
                      element={<PlaceholderPage title="Crime Trends" />}
                    />
                  </Route>
                  <Route path="health">
                    <Route
                      path="outbreaks"
                      element={<PlaceholderPage title="Disease Outbreaks" />}
                    />
                    <Route
                      path="capacity"
                      element={<PlaceholderPage title="Hospital Capacity" />}
                    />
                  </Route>
                  {/* Legacy route support */}
                  <Route
                    path="reports/usage"
                    element={<PlaceholderPage title="Usage Reports" />}
                  />
                  <Route
                    path="reports/revenue"
                    element={<PlaceholderPage title="Revenue Reports" />}
                  />
                </Route>

                {/* System Admin Routes */}
                <Route path="admin">
                  <Route
                    path="status"
                    element={<PlaceholderPage title="System Status" />}
                  />
                  <Route path="users">
                    <Route
                      path="staff"
                      element={<PlaceholderPage title="Staff Directory" />}
                    />
                    <Route
                      path="roles"
                      element={<PlaceholderPage title="Roles & Permissions" />}
                    />
                  </Route>
                  <Route path="resources">
                    <Route path="stations" element={<ResourceList />} />{" "}
                    {/* Updated to use ResourceList */}
                    <Route path="hospitals" element={<ResourceList />} />{" "}
                    {/* Updated to use ResourceList */}
                    <Route path=":id" element={<ResourceDetail />} />{" "}
                    {/* Dynamic Resource Detail */}
                  </Route>
                  <Route path="settings">
                    <Route
                      path="routing"
                      element={<PlaceholderPage title="Routing Rules" />}
                    />
                    <Route
                      path="tenant"
                      element={
                        <PlaceholderPage title="District/Tenant Configuration" />
                      }
                    />
                  </Route>
                </Route>

                {/* Legacy Routes (Redirect or Keep) */}
                <Route path="station-management">
                  <Route path="stations/all" element={<StationsList />} />
                  <Route
                    path="stations/add"
                    element={<PlaceholderPage title="Add Station" />}
                  />
                </Route>
                <Route path="user-management">
                  <Route
                    path="users/all"
                    element={<PlaceholderPage title="All Users" />}
                  />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
