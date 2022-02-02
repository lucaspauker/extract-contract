import React from "react"
import "./Input.scss";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import sample_data from "./data/sample_data.txt";

async function getPdfText(pdf) {
  //const pdf = await pdfjsLib.getDocument(path);
  const pagePromises = [];
  for (let j = 1; j <= pdf.numPages; j++) {
    const page = pdf.getPage(j);
    pagePromises.push(page.then((page) => {
      const textContent = page.getTextContent();
      return textContent.then((text) => {
        return text.items.map((s) =>  s.str).join('');
      });
    }));
  }
  const texts = await Promise.all(pagePromises);
  return texts.join('');
}

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
    this.processPDF = this.processPDF.bind(this);
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
      console.log(response.data);
    }, (error) => {
      console.log(error);
    });
    this.clearData(event);
  }

  processPDF(event) {
    event.preventDefault();
    var file = event.target.files[0];
    var fileReader = new FileReader();
    var pdfText = "";

    pdfjsLib.GlobalWorkerOptions.workerSrc = "//cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.worker.js";
    var that = this;
    fileReader.onload = function() {
      var typedArray = new Uint8Array(this.result);

      pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
        console.log("The pdf has " + pdf.numPages + " pages.")
        getPdfText(pdf).then(function(text) {
          this.setState({
            input: text
          });
        }.bind(this));
      }.bind(that));
    };
    fileReader.readAsArrayBuffer(file);

    console.log(pdfText);
  }

  render () {
    return (
      <div id="input">
        <h3>
          Input your file text here:
        </h3>
        <div className="button-area">
          <Button variant="outlined" onClick={(e) => this.addSampleData(e)}>Add sample data</Button>
          <Button variant="outlined" component="label">
            Upload PDF File
            <input type="file" accept=".pdf" onChange={(e) => this.processPDF(e)}hidden/>
          </Button>
          <Button variant="outlined" onClick={(e) => this.clearData(e)}>Clear data</Button>
        </div>
        <TextField label="Input text here!" multiline minRows={15} maxRows={15} onChange={(e) => this.handleTextFieldChange(e)} value={this.state.input} />
        <Button variant="contained" onClick={(e) => this.handleSubmit(e)}>Process</Button>
      </div>
    );
  }
}

export default Input
