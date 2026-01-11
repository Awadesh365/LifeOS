import React from "react";
import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import { DataTable } from "../../components/ui/DataTable/DataTable";
import {
  Column,
  RowAction,
} from "../../components/ui/DataTable/DataTable.types";
import { Edit, Visibility, Phone, Email } from "@mui/icons-material";

interface Officer {
  id: string;
  name: string;
  designation: string;
  department: string;
  status: "active" | "on_leave" | "meeting";
  phone: string;
  email: string;
}

const dummyOfficers: Officer[] = [
  {
    id: "OFF001",
    name: "Dr. Rajneesh Kumar",
    designation: "District Magistrate",
    department: "General Administration",
    status: "active",
    phone: "+91 98765 43210",
    email: "dm-office@city.gov.in",
  },
  {
    id: "OFF002",
    name: "Smt. Anjali Singh",
    designation: "Additional District Magistrate",
    department: "Revenue & Law",
    status: "meeting",
    phone: "+91 98765 43211",
    email: "adm-rev@city.gov.in",
  },
  {
    id: "OFF003",
    name: "Shri Vikram Aditya",
    designation: "Chief Development Officer",
    department: "Development",
    status: "active",
    phone: "+91 98765 43212",
    email: "cdo@city.gov.in",
  },
  {
    id: "OFF004",
    name: "Dr. Sameer Verma",
    designation: "City Magistrate",
    department: "Municipal Affairs",
    status: "on_leave",
    phone: "+91 98765 43213",
    email: "city-mag@city.gov.in",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "meeting":
      return "warning";
    case "on_leave":
      return "error";
    default:
      return "default";
  }
};

const DistrictMagistrateOffice: React.FC = () => {
  const columns: Column<Officer>[] = [
    {
      id: "name",
      label: "Officer Name",
      accessor: "name",
      sortable: true,
      filterable: true,
    },
    {
      id: "designation",
      label: "Designation",
      accessor: "designation",
      sortable: true,
      filterable: true,
    },
    {
      id: "department",
      label: "Department",
      accessor: "department",
      sortable: true,
      filterable: true,
    },
    {
      id: "status",
      label: "Current Status",
      accessor: "status",
      align: "center",
      renderCell: (value) => (
        <Chip
          label={value.replace("_", " ").toUpperCase()}
          color={getStatusColor(value) as any}
          size="small"
        />
      ),
    },
    {
      id: "contact",
      label: "Contact",
      renderCell: (_, row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={row.phone}>
            <IconButton size="small">
              <Phone fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.email}>
            <IconButton size="small">
              <Email fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rowActions: RowAction<Officer>[] = [
    {
      id: "view",
      label: "View Profile",
      icon: <Visibility />,
      onClick: (row) => console.log("View", row),
    },
    {
      id: "edit",
      label: "Edit record",
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
          District Magistrate Office
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Real-time availability and directory of senior administration
          officers.
        </Typography>
      </Box>

      <DataTable
        title="Officer Directory"
        columns={columns}
        data={dummyOfficers}
        searchable={true}
        filterable={true}
        paginated={true}
        rowActions={rowActions}
        glassmorphism={true}
      />
    </Box>
  );
};

export default DistrictMagistrateOffice;
