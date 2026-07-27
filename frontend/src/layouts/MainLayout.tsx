import { Outlet, NavLink } from "react-router-dom";

import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const drawerWidth = 240;

const menuItems = [
  {
    text: "Inicio",
    icon: <HomeRoundedIcon />,
    path: "/",
  },
  {
    text: "Socios",
    icon: <GroupsRoundedIcon />,
    path: "/socios",
  },
  {
    text: "Pagos",
    icon: <PaidRoundedIcon />,
    path: "/pagos",
  },
  {
    text: "Estadísticas",
    icon: <BarChartRoundedIcon />,
    path: "/estadisticas",
  },
  {
    text: "Configuración",
    icon: <SettingsRoundedIcon />,
    path: "/configuracion",
  },
];

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Barra superior */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              SocioHub
            </Typography>

            <Typography variant="caption">
              Gestión de socios
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menú lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Contenido */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: "#F8FAFC",
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}