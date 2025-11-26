import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AppLayout from "./layout/AppLayout";
import { premiumTheme } from "./theme/premiumTheme";
import { StationsList } from "./pages/Stations/StationsList";
import { PlaceholderPage } from "./components/common/PlaceholderPage";
import "./styles/premium.css";

// Sample page components (placeholders)
const DashboardPage = () => (
  <PlaceholderPage 
    title="City Overview Dashboard" 
    description="Real-time metrics, safety index, and active emergency summaries." 
  />
);

const App = () => {
  return (
    <ThemeProvider theme={premiumTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Command Center Routes */}
            <Route path="emergency">
              <Route path="incidents/active" element={<PlaceholderPage title="Active Incidents" />} />
              <Route path="dispatch" element={<PlaceholderPage title="Dispatch Queue" />} />
              <Route path="map" element={<PlaceholderPage title="Live Resource Map" />} />
            </Route>
            <Route path="ops">
              <Route path="police" element={<PlaceholderPage title="Police & Security Ops" />} />
              <Route path="health" element={<PlaceholderPage title="Health & Medical Ops" />} />
              <Route path="fire" element={<PlaceholderPage title="Fire & Safety Ops" />} />
              <Route path="public-works" element={<PlaceholderPage title="Public Works Ops" />} />
            </Route>
            <Route path="grievance">
              <Route path="reports" element={<PlaceholderPage title="Citizen Reports" />} />
              <Route path="tickets" element={<PlaceholderPage title="Ticket Status" />} />
            </Route>

            {/* City Services Routes */}
            <Route path="services">
              <Route path="overview" element={<PlaceholderPage title="Services Overview" />} />
              <Route path="registry" element={<PlaceholderPage title="Birth & Death Registry" />} />
              <Route path="utilities" element={<PlaceholderPage title="Utilities & Billing" />} />
              <Route path="tax" element={<PlaceholderPage title="Property Tax" />} />
            </Route>

            {/* Analytics Routes */}
            <Route path="analytics">
              <Route path="overview" element={<PlaceholderPage title="Insights Dashboard" />} />
              <Route path="crime">
                <Route path="hotspots" element={<PlaceholderPage title="Crime Hotspots" />} />
                <Route path="trends" element={<PlaceholderPage title="Crime Trends" />} />
              </Route>
              <Route path="health">
                <Route path="outbreaks" element={<PlaceholderPage title="Disease Outbreaks" />} />
                <Route path="capacity" element={<PlaceholderPage title="Hospital Capacity" />} />
              </Route>
              {/* Legacy route support */}
              <Route path="reports/usage" element={<PlaceholderPage title="Usage Reports" />} />
              <Route path="reports/revenue" element={<PlaceholderPage title="Revenue Reports" />} />
            </Route>

            {/* Admin Routes */}
            <Route path="admin">
              <Route path="status" element={<PlaceholderPage title="System Status" />} />
              <Route path="users">
                <Route path="staff" element={<PlaceholderPage title="Staff Directory" />} />
                <Route path="roles" element={<PlaceholderPage title="Roles & Permissions" />} />
              </Route>
              <Route path="resources">
                <Route path="stations" element={<StationsList />} /> {/* Keeping existing component */}
                <Route path="hospitals" element={<PlaceholderPage title="Manage Hospitals" />} />
              </Route>
              <Route path="settings">
                <Route path="routing" element={<PlaceholderPage title="Routing Rules" />} />
                <Route path="tenant" element={<PlaceholderPage title="Tenant Configuration" />} />
              </Route>
            </Route>

            {/* Legacy Routes (Redirect or Keep) */}
            <Route path="station-management">
              <Route path="stations/all" element={<StationsList />} />
              <Route path="stations/add" element={<PlaceholderPage title="Add Station" />} />
            </Route>
            <Route path="user-management">
              <Route path="users/all" element={<PlaceholderPage title="All Users" />} />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
