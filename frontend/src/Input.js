import React from "react"
import "./Input.scss";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
  }

  handleTextFieldChange(event) {
    event.preventDefault();
    this.setState({
      input: event.target.value,
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
  }

  render () {
    return (
      <div id="input">
        <h3>
          Input your file text here:
        </h3>
        <>
          <TextField label="Input text here!" multiline minRows={10} onChange={(e) => this.handleTextFieldChange(e)} />
          <Button variant="contained" onClick={(e) => this.handleSubmit(e)}>Process</Button>
        </>
      </div>
    );
  }
}

export default Input
