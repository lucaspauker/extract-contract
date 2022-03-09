import React from "react"
import "./Header.scss";
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

class Input extends React.Component {
  render () {
    return (
      <div id="header">
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <img src="eagle_head.svg" alt="Eagle Head" />
            <Typography variant="h4">
              Legal<b>Eagle</b>
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Input
