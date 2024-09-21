"use client";

import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  shape: {
    borderRadius: 16,
  },
  palette: {
    primary: {
      main: "#0094FF",
    },
    secondary: {
      main: "#40aca6",
    },
    warning: {
      main: "#FFC107",
    },
    success: {
      main: "#4CAF50",
    },
  },
});

export default theme;