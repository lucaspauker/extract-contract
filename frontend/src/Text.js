import React from "react"
import Typography from '@mui/material/Typography';
import "./Text.scss";
import { FaArrowDown } from 'react-icons/fa';
import Typewriter from 'typewriter-effect';

class Text extends React.Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    const elem = document.getElementById("input");
    elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render () {
    return (
      <div id="text">
        <div id="text-inner">
          <Typography variant="h2">
            Annotate legal contracts
            <Typewriter
              options = {{
                loop: true,
              }}
              onInit={(typewriter) => {
                typewriter
                .typeString("quickly")
                .pauseFor(1000)
                .deleteAll()
                .typeString("accurately")
                .pauseFor(1000)
                .deleteAll()
                .typeString("smoothly")
                .pauseFor(1000)
                .deleteAll()
                .typeString("magically")
                .pauseFor(1000)
                .deleteAll()
                .typeString("diligently")
                .pauseFor(1000)
                .deleteAll()
                .typeString("efficiently")
                .pauseFor(1000)
                .deleteAll()
                .typeString("adeptly")
                .start();
                }}
             />
          </Typography>
          <Typography variant="h6">
            Deep NLP models for helping lawyers and consumers understand long and complex legal documents. Simply upload your document, and we will do the rest!
          </Typography>
          <FaArrowDown onClick={this.handleScroll}/>
        </div>
      </div>
    );
  }
}

export default Text
