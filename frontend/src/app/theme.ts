import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563EB",
    },
    background: {
      default: "#F8FAFC",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;