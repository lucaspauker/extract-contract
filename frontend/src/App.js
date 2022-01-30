import React, { useState, useEffect } from "react";
import "./App.scss";

import Input from "./Input.js"
import Header from "./Header.js"

import Divider from "@mui/material/Divider";

function App() {
  return (
    <div id="app">
      <Header />
      <Divider />
      <Input />
    </div>
  );
}

export default App;
