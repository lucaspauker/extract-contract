import React from "react"
import "./Header.scss";
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { GiEagleEmblem } from 'react-icons/gi';

class Input extends React.Component {
  render () {
    return (
      <div id="header">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h4">
              <GiEagleEmblem /> LegalEagle Contract Extractor
            </Typography>
            <Typography variant="h6">
              Beri Kohen, Lucas Pauker, Shashank Rammoorthy
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Input
