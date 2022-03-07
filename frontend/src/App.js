import React, { useState, useEffect } from "react";
import "./App.scss";

import Input from "./Input.js"
import Header from "./Header.js"

import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#ff5f52',
      main: '#c62828',
      dark: '#8e0000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#fff263',
      main: '#fbc02d',
      dark: '#c49000',
      contrastText: '#000',
    },
  },
});

function App() {
  return (
    <div id="app">
      <ThemeProvider theme={theme}>
        <Header />
        <Input />
      </ThemeProvider>
    </div>
  );
}

export default App;
