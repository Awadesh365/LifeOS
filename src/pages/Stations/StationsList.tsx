import { Box, Chip } from "@mui/material";
import { DataTable } from "../../components/organisms/DataTable/DataTable";
import { Column } from "../../components/organisms/DataTable/DataTable.types";

interface Station {
  id: string;
  name: string;
  location: string;
  status: "active" | "inactive" | "maintenance";
  chargingPoints: number;
  operationalHours: string;
  lastMaintenance: string;
  createdDate: string;
}

// Dummy data
const dummyStations: Station[] = [
  {
    id: "1",
    name: "Downtown Station Alpha",
    location: "123 Main St, City Center",
    status: "active",
    chargingPoints: 12,
    operationalHours: "24/7",
    lastMaintenance: "2024-11-15",
    createdDate: "2024-01-10",
  },
  {
    id: "2",
    name: "Airport Plaza Charging Hub",
    location: "Airport Rd, Terminal 2",
    status: "active",
    chargingPoints: 24,
    operationalHours: "6:00 AM - 11:00 PM",
    lastMaintenance: "2024-11-20",
    createdDate: "2024-02-15",
  },
  {
    id: "3",
    name: "Shopping Mall Station",
    location: "456 Mall Drive, West Side",
    status: "active",
    chargingPoints: 8,
    operationalHours: "9:00 AM - 9:00 PM",
    lastMaintenance: "2024-11-10",
    createdDate: "2024-03-20",
  },
  {
    id: "4",
    name: "Harbor District Station",
    location: "789 Waterfront Ave, Harbor",
    status: "maintenance",
    chargingPoints: 6,
    operationalHours: "Closed for Maintenance",
    lastMaintenance: "2024-11-22",
    createdDate: "2024-04-05",
  },
  {
    id: "5",
    name: "Industrial Park Charging",
    location: "321 Industrial Blvd, North",
    status: "inactive",
    chargingPoints: 4,
    operationalHours: "Temporarily Closed",
    lastMaintenance: "2024-10-30",
    createdDate: "2024-05-12",
  },
  {
    id: "6",
    name: "University Campus Station",
    location: "654 College Road, Campus",
    status: "active",
    chargingPoints: 16,
    operationalHours: "7:00 AM - 10:00 PM",
    lastMaintenance: "2024-11-18",
    createdDate: "2024-06-01",
  },
  {
    id: "7",
    name: "Central Park Station",
    location: "111 Park Lane, Central Park",
    status: "active",
    chargingPoints: 10,
    operationalHours: "24/7",
    lastMaintenance: "2024-11-21",
    createdDate: "2024-07-08",
  },
  {
    id: "8",
    name: "Train Station Hub",
    location: "222 Station Road, Downtown",
    status: "active",
    chargingPoints: 20,
    operationalHours: "5:00 AM - 12:00 AM",
    lastMaintenance: "2024-11-19",
    createdDate: "2024-08-22",
  },
];

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "error";
    case "maintenance":
      return "warning";
    default:
      return "default";
  }
};

export const StationsList = () => {
  const columns: Column<Station>[] = [
    {
      id: "name",
      label: "Station Name",
      accessor: "name",
      width: "200px",
      sortable: true,
      filterable: true,
    },
    {
      id: "location",
      label: "Location",
      accessor: "location",
      width: "220px",
      sortable: true,
      filterable: true,
    },
    {
      id: "status",
      label: "Status",
      accessor: "status",
      width: "120px",
      align: "center",
      sortable: true,
      filterable: true,
      renderCell: (value) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={getStatusColor(value) as any}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      id: "chargingPoints",
      label: "Charging Points",
      accessor: "chargingPoints",
      width: "130px",
      align: "center",
      sortable: true,
      filterable: true,
      dataType: "number",
    },
    {
      id: "operationalHours",
      label: "Operational Hours",
      accessor: "operationalHours",
      width: "160px",
      sortable: true,
      filterable: true,
    },
    {
      id: "lastMaintenance",
      label: "Last Maintenance",
      accessor: "lastMaintenance",
      width: "150px",
      sortable: true,
      filterable: true,
      dataType: "date",
      renderCell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      id: "createdDate",
      label: "Created",
      accessor: "createdDate",
      width: "130px",
      sortable: true,
      filterable: true,
      dataType: "date",
      renderCell: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <DataTable
        data={dummyStations}
        columns={columns}
        title="Charging Stations Management"
        keyExtractor={(row) => row.id}
        sortable={true}
        filterable={true}
        searchable={true}
        selectable="multiple"
        paginated={true}
        columnVisibility={true}
        stickyHeader={true}
        glassmorphism={true}
        dense={false}
        maxHeight="70vh"
        rowsPerPageOptions={[5, 10, 25, 50]}
        defaultRowsPerPage={10}
        onRowClick={(row) => {
          console.log("Station clicked:", row);
        }}
        exportData={{
          csv: true,
          xlsx: true,
          filename: "stations-export",
        }}
      />
    </Box>
  );
};
