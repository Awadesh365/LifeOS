import React from "react";
import { Box, Typography } from "@mui/material";
import { DataTable } from "./DataTable";
import { Column } from "./DataTable.types";

interface ResourceTablePageProps {
  title: string;
  description?: string;
}

const ResourceTablePage: React.FC<ResourceTablePageProps> = ({
  title,
  description,
}) => {
  // Define some generic columns since we don't have real data yet
  const columns: Column<any>[] = [
    { id: "id", label: "ID", minWidth: 70 },
    { id: "name", label: "Name", minWidth: 170 },
    { id: "status", label: "Status", minWidth: 100 },
    { id: "updatedAt", label: "Last Updated", minWidth: 170 },
    { id: "actions", label: "Actions", minWidth: 100, align: "right" },
  ];

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            {description}
          </Typography>
        )}
      </Box>

      <DataTable
        title={`${title} List`}
        columns={columns}
        data={[]}
        searchable={true}
        filterable={true}
        paginated={true}
        glassmorphism={true}
      />
    </Box>
  );
};

export default ResourceTablePage;
