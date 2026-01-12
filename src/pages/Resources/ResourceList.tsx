import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  IconButton,
  InputBase,
} from "@mui/material";
import { resourceService } from "../../services/resourceService";
import { Resource } from "../../types";
import { useNavigate } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { PageLoader } from "../../components/common";

const ResourceList: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await resourceService.getAll();
        setResources(data);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return <LocalHospitalIcon sx={{ color: "#ef4444" }} />;
      case "police_station":
        return <LocalPoliceIcon sx={{ color: "#3b82f6" }} />;
      case "school":
        return <SchoolIcon sx={{ color: "#f59e0b" }} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}
          >
            Resource Catalog
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Manage and monitor all city infrastructure and facilities.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#fff",
            borderRadius: 2,
            px: 2,
            py: 1,
            border: "1px solid #e2e8f0",
            width: 300,
          }}
        >
          <SearchIcon sx={{ color: "#94a3b8", mr: 1 }} />
          <InputBase placeholder="Search resources..." sx={{ width: "100%" }} />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={resource._id}>
            <Card
              onClick={() => navigate(`/admin/resources/${resource._id}`)}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: "pointer",
                transition: "all 0.2s",
                border: "1px solid transparent",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                  borderColor: "#e2e8f0",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getIcon(resource.type)}
                </Box>
                <Chip
                  label={resource.type.replace("_", " ")}
                  size="small"
                  sx={{
                    textTransform: "capitalize",
                    bgcolor: "#f1f5f9",
                    fontWeight: 600,
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}
              >
                {resource.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#64748b", mb: 3, minHeight: 40 }}
              >
                {resource.address}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pt: 2,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#94a3b8", display: "block" }}
                  >
                    Head of Dept
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {resource.head_of_dept?.split(" ")[0]}...
                  </Typography>
                </Box>
                <IconButton size="small" sx={{ bgcolor: "#f8fafc" }}>
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ResourceList;
