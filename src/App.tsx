import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppLayout from './layout/AppLayout';
import { premiumTheme } from './theme/premiumTheme';
import './styles/premium.css';

// Sample page components (placeholders)
const DashboardPage = () => (
  <div>
    <h1>Dashboard</h1>
    <p>Welcome to CityOS Dashboard</p>
  </div>
);

const StationsListPage = () => (
  <div>
    <h1>All Stations</h1>
    <p>Manage your charging stations here</p>
  </div>
);

const AddStationPage = () => (
  <div>
    <h1>Add Station</h1>
    <p>Add a new charging station</p>
  </div>
);

const UsersListPage = () => (
  <div>
    <h1>All Users</h1>
    <p>Manage system users</p>
  </div>
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
            <Route path="station-management">
              <Route path="stations/all" element={<StationsListPage />} />
              <Route path="stations/add" element={<AddStationPage />} />
            </Route>
            <Route path="user-management">
              <Route path="users/all" element={<UsersListPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
