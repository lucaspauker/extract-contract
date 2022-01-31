import React from "react"
import "./Input.scss";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import sample_data from "./data/sample_data.txt";


class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
    }

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.addSampleData = this.addSampleData.bind(this);
    this.clearData = this.clearData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextFieldChange(event) {
    event.preventDefault();
    this.setState({
      input: event.target.value,
    });
  }

  addSampleData(event) {
    event.preventDefault();
    fetch(sample_data)
      .then(r => r.text())
      .then(text => {
        this.setState({
          input: text
        });
      });
  }

  clearData(event) {
    event.preventDefault();
    this.setState({
      input: ""
    });
  }


  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.input);

    axios({
      method: "post",
      url: "/dummy_predict",
      data: {
        input: this.state.input,
      }
    })
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
    this.clearData(event);
  }

  render () {
    return (
      <div id="input">
        <h3>
          Input your file text here:
        </h3>
        <Button variant="outlined" onClick={(e) => this.addSampleData(e)}>Add sample data</Button>
        <Button variant="outlined" onClick={(e) => this.clearData(e)}>Clear data</Button>
        <>
          <TextField label="Input text here!" multiline minRows={15} maxRows={15} onChange={(e) => this.handleTextFieldChange(e)} value={this.state.input} />
          <Button variant="contained" onClick={(e) => this.handleSubmit(e)}>Process</Button>
        </>
      </div>
    );
  }
}

export default Input
