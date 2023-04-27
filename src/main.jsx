import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import new_theme from "./theme";

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import "./App.css";
import Paper from '@mui/material/Paper';



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={new_theme}>
      <Paper>
        <App />
      </Paper>
    </ThemeProvider>
  </React.StrictMode>
);
