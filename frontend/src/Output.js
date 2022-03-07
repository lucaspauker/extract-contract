import React from "react"
import "./Output.scss";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

class Output extends React.Component {
  constructor(props) {
    super(props);
    this.downloadData = this.downloadData.bind(this);

    let text = this.props.text;
    let data = this.props.data;

    let paragraphs = text.split(/\r?\n/);
    paragraphs = paragraphs.filter(p => p.length > 0);

    // Get all the questions with text in the paragraphs
    // Also make dict of paragraph to queston/answers
    let filtered_paragraphs = [];
    let filtered_paragraphs_list = [];
    let data_indices_dict = {};
    for (let i=0; i<paragraphs.length; i++) {
      for (let j=0; j<data.length; j++) {
        if (paragraphs[i].includes(data[j][1])) {
          let start_index = paragraphs[i].indexOf(data[j][1]);
          let end_index = start_index + data[j][1].length;
          data_indices_dict[data[j][0]] = [start_index, end_index];
          let data_arr = [data[j][0], data[j][1], start_index, end_index];

          if (filtered_paragraphs.includes(paragraphs[i])) {
            filtered_paragraphs_list[filtered_paragraphs_list.length - 1].push(data_arr);
          } else {
            filtered_paragraphs.push(paragraphs[i]);
            filtered_paragraphs_list.push([data_arr]);
          }
        }
      }
    }

    this.state = {
      filtered_paragraphs: filtered_paragraphs,
      filtered_paragraphs_list: filtered_paragraphs_list,
      data: data,
      data_indices_dict: data_indices_dict,
    }
  }

  downloadData(event, data) {
    event.preventDefault();
    let csvContent = "data:text/csv;charset=utf-8,";

    data.forEach(function(rowArray) {
      let row = rowArray.join('","');
      csvContent += '"' + row + '"\r\n';
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  }

  highlightWord(q, paragraph_num) {
    let [start_index, end_index] = this.state.data_indices_dict[q];
    let new_fp = this.state.filtered_paragraphs;
    new_fp[paragraph_num] = new_fp[paragraph_num].slice(0, start_index) + "<span class='active'>" + new_fp[paragraph_num].slice(start_index, end_index) + "</span>" + new_fp[paragraph_num].slice(end_index);
    this.setState({
      filtered_paragraphs: new_fp
    });
  }

  unhighlightWord(q, paragraph_num) {
    let [start_index, end_index] = this.state.data_indices_dict[q];
    let new_fp = this.state.filtered_paragraphs;
    const first_len = 21;
    const second_len = 7;
    new_fp[paragraph_num] = new_fp[paragraph_num].slice(0, start_index) + new_fp[paragraph_num].slice(start_index+first_len, end_index+first_len) + new_fp[paragraph_num].slice(end_index+first_len+second_len);
    this.setState({
      filtered_paragraphs: new_fp
    });
  }

  render () {
    return (
      <div id="output">
        <Typography variant="h4">
          Results
        </Typography>
        {this.state.filtered_paragraphs.map((p, i) => (
          <div className="qa" key={i}>
            <div className="qa-text">
              <Typography variant="body1"
                dangerouslySetInnerHTML={{__html: p}}
              />
            </div>
            <div className="qa-questions" key={i}>
              {this.state.filtered_paragraphs_list[i].map((q, j) => (
                <div className="question" key={j}
                  onMouseEnter={() => this.highlightWord(q[0], i)}
                  onMouseLeave={() => this.unhighlightWord(q[0], i)}>
                  <Typography variant="body1">
                    <b>{q[0]}:</b> {q[1]}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button variant="contained" onClick={(e) => this.downloadData(e, this.state.data)}>Download Data</Button>
      </div>
    );
  }
}

export default Output
