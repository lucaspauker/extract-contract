import React, { useState, useEffect } from "react";
import "./App.scss";

import Text from "./Text.js"
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
      light: '#ffe97d',
      main: '#ffb74d',
      dark: '#c88719',
      contrastText: '#000',
    },
  },
});

function App() {
  return (
    <div id="app">
      <ThemeProvider theme={theme}>
        <Header />
        <Text />
        <Input />
      </ThemeProvider>
    </div>
  );
}

export default App;
