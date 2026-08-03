import React from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import { DataTable } from "../../components/ui/DataTable/DataTable";
import {
  Column,
  RowAction,
} from "../../components/ui/DataTable/DataTable.types";
import {
  Edit,
  Visibility,
  LocationOn,
  Call,
  Shield,
} from "@mui/icons-material";

interface PoliceStation {
  id: string;
  name: string;
  sho: string;
  coverageArea: string;
  status: "operational" | "under_construction" | "sensitive";
  manpower: number;
  contact: string;
}

const dummyStations: PoliceStation[] = [
  {
    id: "PS001",
    name: "City Central Police Station",
    sho: "Insp. Arvind Sharma",
    coverageArea: "Downtown, Sector 1-12",
    status: "operational",
    manpower: 45,
    contact: "011-2345678",
  },
  {
    id: "PS002",
    name: "Airport Perimeter Station",
    sho: "Insp. Megha Rao",
    coverageArea: "Airport, Highway Area",
    status: "sensitive",
    manpower: 30,
    contact: "011-2345679",
  },
  {
    id: "PS003",
    name: "North Gate Outpost",
    sho: "SI Vikram Handa",
    coverageArea: "Industrial Zone A",
    status: "operational",
    manpower: 12,
    contact: "011-2345680",
  },
  {
    id: "PS004",
    name: "West Extension Precinct",
    sho: "Insp. Sanjay Dutt",
    coverageArea: "New Residential Blocks",
    status: "under_construction",
    manpower: 0,
    contact: "N/A",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "operational":
      return "success";
    case "sensitive":
      return "error";
    case "under_construction":
      return "info";
    default:
      return "default";
  }
};

const PoliceStationsPage: React.FC = () => {
  const columns: Column<PoliceStation>[] = [
    {
      id: "name",
      label: "Station Name",
      accessor: "name",
      sortable: true,
      filterable: true,
      minWidth: 200,
    },
    {
      id: "sho",
      label: "In-Charge (SHO)",
      accessor: "sho",
      sortable: true,
      minWidth: 150,
    },
    {
      id: "coverageArea",
      label: "Coverage Area",
      accessor: "coverageArea",
      minWidth: 200,
    },
    {
      id: "status",
      label: "Operational Status",
      accessor: "status",
      align: "center",
      renderCell: (value) => (
        <Chip
          label={value.replace("_", " ").toUpperCase()}
          color={getStatusColor(value) as any}
          size="small"
          icon={<Shield sx={{ fontSize: "14px !important" }} />}
        />
      ),
    },
    {
      id: "manpower",
      label: "Staff Count",
      accessor: "manpower",
      align: "center",
      sortable: true,
    },
    {
      id: "actions_custom",
      label: "Quick Access",
      renderCell: () => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Map">
            <IconButton size="small" color="primary">
              <LocationOn fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Emergency Call">
            <IconButton size="small" color="error">
              <Call fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const rowActions: RowAction<PoliceStation>[] = [
    {
      id: "view",
      label: "View Assets",
      icon: <Visibility />,
      onClick: (row) => console.log("View", row),
    },
    {
      id: "edit",
      label: "Update Roster",
      icon: <Edit />,
      onClick: (row) => console.log("Edit", row),
    },
  ];

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}
        >
          Police Stations & Outposts
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Overview of all law enforcement stations, staff strength, and area
          coverage.
        </Typography>
      </Box>

      <DataTable
        title="Station Registry"
        columns={columns}
        data={dummyStations}
        searchable={true}
        filterable={true}
        paginated={true}
        rowActions={rowActions}
        glassmorphism={true}
      />
    </Box>
  );
};

export default PoliceStationsPage;
