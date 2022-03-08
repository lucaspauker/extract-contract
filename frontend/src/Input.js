import React from "react"
import "./Input.scss";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import CircularProgress from '@mui/material/CircularProgress';

import sample_data from "./data/sample_data.txt";

import Output from "./Output.js";

async function getPdfText(pdf) {
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
      oldInput: "",
      data: null,
      loading: false,
    }

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.addSampleData = this.addSampleData.bind(this);
    this.clearData = this.clearData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.processPDF = this.processPDF.bind(this);
    this.returnOutput = this.returnOutput.bind(this);
  }

  returnOutput(data) {
    return  <div id="output">
              <h3>Results</h3>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Category</TableCell>
                      <TableCell align="center">Output</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((data) => (
                      <TableRow
                        key={data[0]}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }}}>
                        <TableCell align="center">{data[0]}</TableCell>
                        <TableCell align="center">{data[1]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button variant="contained" onClick={(e) => this.downloadData(e, data)}>Download Data</Button>
            </div>
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
      oldInput: this.state.input,
      input: "",
    });
  }


  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      loading: true,
      data: "",
    });

    axios({
      method: "post",
      url: "/predict",
      data: {
        input: this.state.input,
      }
    })
    .then((response) => {
      this.setState({
        data: response.data.result,
        loading: false,
      });
    }, (error) => {
      console.log(error);
    });
    this.clearData(event);
  }

  processPDF(event) {
    event.preventDefault();
    let file = event.target.files[0];
    let fileReader = new FileReader();

    pdfjsLib.GlobalWorkerOptions.workerSrc = "//cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.worker.js";
    let that = this;
    fileReader.onload = function() {
      let typedArray = new Uint8Array(this.result);

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
  }

  componentDidUpdate(prevProps, prevState) {
    const outElem = document.getElementById("output");
    if (!prevState.data && outElem) {
      outElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  render () {
    let output = "";
    if (this.state.data) {
      output = <>
                <Divider />
                <Output text={this.state.oldInput} data={this.state.data} />
               </>
    } else if (this.state.loading) {
      output = <>
                <Divider />
                <CircularProgress />
               </>
    }
    return (
      <>
        <div id="input">
          <div className="button-area">
            <Button variant="outlined" onClick={(e) => this.addSampleData(e)}>Add sample data</Button>
            <Button variant="outlined" component="label">
              Upload PDF File
              <input type="file" accept=".pdf" onChange={(e) => this.processPDF(e)} hidden/>
            </Button>
            <Button variant="outlined" onClick={(e) => this.clearData(e)}>Clear data</Button>
          </div>
          <TextField label="Input text here!" multiline minRows={15} maxRows={15} onChange={(e) => this.handleTextFieldChange(e)} value={this.state.input} />
          <Button id="process-button" variant="contained" onClick={(e) => this.handleSubmit(e)}>Process</Button>
        </div>
        <div id="output">
          {output}
        </div>
      </>
    );
  }
}

export default Input
