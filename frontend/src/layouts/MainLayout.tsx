import { useState } from "react";
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
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
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
  const theme = useTheme();

  const esMovil = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [menuAbierto, setMenuAbierto] =
    useState(false);

  const contenidoMenu = (
    <Box
      sx={{
        width: drawerWidth,
      }}
    >
      <Toolbar />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={() => {
              if (esMovil) {
                setMenuAbierto(false);
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.text}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Barra superior */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) =>
            theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: 60,
              sm: 64,
            },
            px: {
              xs: 1.5,
              sm: 2,
            },
          }}
        >
          {esMovil && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() =>
                setMenuAbierto(true)
              }
              sx={{
                mr: 1,
              }}
              aria-label="Abrir menú"
            >
              <MenuRoundedIcon />
            </IconButton>
          )}

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: {
                  xs: "1.05rem",
                  sm: "1.25rem",
                },
                lineHeight: 1.2,
              }}
            >
              SocioHub
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              Gestión de socios
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menú escritorio */}
      {!esMovil && (
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
          {contenidoMenu}
        </Drawer>
      )}

      {/* Menú móvil */}
      {esMovil && (
        <Drawer
          variant="temporary"
          open={menuAbierto}
          onClose={() =>
            setMenuAbierto(false)
          }
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {contenidoMenu}
        </Drawer>
      )}

      {/* Contenido */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100vh",
          backgroundColor: "#F8FAFC",

          p: {
            xs: 1.5,
            sm: 2,
            md: 4,
          },
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: 60,
              sm: 64,
            },
          }}
        />

        <Outlet />
      </Box>
    </Box>
  );
}