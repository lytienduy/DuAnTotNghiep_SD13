import React, { } from "react";
import { AppBar, Toolbar, IconButton, Avatar, Paper, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom"; // Thêm để điều hướng

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate(); // Hook để điều hướng


  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
        padding: "0 16px",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
         {/* Icon Menu */}
         <IconButton edge="start" color="inherit" sx={{ marginRight: 2, color: "black" }} onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>


        {/* Notification và User Avatar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Notification Icon */}
          <IconButton
            sx={{
              backgroundColor: "#f5f5ff",
              color: "#6a5acd",
              marginRight: 2,
              "&:hover": {
                backgroundColor: "#e0dfff",
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>

          {/* User Avatar */}
          <IconButton onClick={() => navigate("/login")} sx={{ padding: 0 }}>
            <Paper
            elevation={3}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: "50px",
              marginRight: 2,
            }}
            >
            <Avatar sx={{ bgcolor: "#90caf9", width: 30, height: 30, marginRight: 1 }}>
              <PersonIcon />
            </Avatar>
            <SettingsIcon sx={{ color: "#6a5acd" }} />
            </Paper>
          </IconButton>
          
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
