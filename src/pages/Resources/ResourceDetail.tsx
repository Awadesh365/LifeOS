import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import { DUMMY_RESOURCES } from "../../lib/constants/dummyResources";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import SchoolIcon from "@mui/icons-material/School";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resource = DUMMY_RESOURCES.find((r) => r.id === id);

  if (!resource) {
    return <Typography>Resource not found</Typography>;
  }

  const getIcon = () => {
    switch (resource.type) {
      case "hospital":
        return <LocalHospitalIcon sx={{ fontSize: 40, color: "#ef4444" }} />;
      case "police_station":
        return <LocalPoliceIcon sx={{ fontSize: 40, color: "#3b82f6" }} />;
      case "school":
        return <SchoolIcon sx={{ fontSize: 40, color: "#f59e0b" }} />;
      default:
        return <PersonIcon sx={{ fontSize: 40 }} />;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: "#64748b" }}
      >
        Back to List
      </Button>

      {/* Header Section */}
      <Card
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                bgcolor: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {getIcon()}
            </Box>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}
            >
              {resource.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {resource.address} •{" "}
              <Chip
                label={resource.district}
                size="small"
                sx={{ bgcolor: "#e2e8f0" }}
              />
            </Typography>
          </Grid>
          <Grid item sx={{ textAlign: "right" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              <Chip
                icon={<PhoneIcon sx={{ fontSize: 16 }} />}
                label={resource.contact_number}
                color="primary"
                variant="outlined"
              />
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Head: {resource.head_of_dept}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={4}>
        {/* Left Column: Stats & Vehicles */}
        <Grid item xs={12} md={4}>
          {/* Capacity & Stats */}
          <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Live Status
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  {resource.capacity?.label} Occupancy
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {resource.capacity?.occupied} / {resource.capacity?.total}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: 8,
                  bgcolor: "#f1f5f9",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${(resource.capacity!.occupied / resource.capacity!.total) * 100}%`,
                    height: "100%",
                    bgcolor:
                      resource.type === "hospital" ? "#ef4444" : "#3b82f6",
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              {Object.entries(resource.stats || {}).map(([key, value]) => (
                <Grid item xs={6} key={key}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", textTransform: "capitalize" }}
                  >
                    {key.replace("_", " ")}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Card>

          {/* Vehicles */}
          {resource.vehicles && (
            <Card sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Fleet Status
              </Typography>
              <List disablePadding>
                {resource.vehicles.map((vehicle) => (
                  <ListItem
                    key={vehicle.id}
                    sx={{ px: 0, py: 1.5, borderBottom: "1px solid #f1f5f9" }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            vehicle.status === "available"
                              ? "#dcfce7"
                              : "#fee2e2",
                          color:
                            vehicle.status === "available"
                              ? "#166534"
                              : "#991b1b",
                        }}
                      >
                        <DirectionsCarIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={vehicle.plate_number}
                      secondary={vehicle.type.replace("_", " ").toUpperCase()}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                    <Chip
                      label={vehicle.status}
                      size="small"
                      color={
                        vehicle.status === "available" ? "success" : "warning"
                      }
                      variant="soft"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </Grid>

        {/* Right Column: Staff Roster */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Staff Roster & Duty
              </Typography>
              <Chip
                label={`${resource.staff.filter((s) => s.status === "on_duty").length} On Duty`}
                color="success"
                size="small"
              />
            </Box>

            <Grid container spacing={2}>
              {resource.staff.map((staff) => (
                <Grid item xs={12} sm={6} key={staff.id}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #e2e8f0",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#e2e8f0", color: "#64748b" }}>
                      {staff.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {staff.name}
                        </Typography>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor:
                              staff.status === "on_duty"
                                ? "#22c55e"
                                : "#cbd5e1",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", display: "block", mb: 0.5 }}
                      >
                        {staff.role}{" "}
                        {staff.specialization && `• ${staff.specialization}`}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 1,
                        }}
                      >
                        <AccessTimeIcon
                          sx={{ fontSize: 14, color: "#94a3b8" }}
                        />
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {staff.shift_start} - {staff.shift_end}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <PhoneIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {staff.contact}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourceDetail;
