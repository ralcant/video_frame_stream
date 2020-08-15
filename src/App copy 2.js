import React from 'react';
// import logo from './logo.svg';
import './App.css';
import styled_frames from './styled_frames.json';
import get_styled_path from "./utils";

// const https = require("https");
// const agent = new https.Agent({
//   rejectUnauthorized: false
// });

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      num : 0,
      image_source: "",
      color: true,
      testServerResponse: "",
    }
    // this.pushFrames = this.pushFrames.bind(this);
    // this.backend_ip = "https://18.27.79.47:5000";
    this.backend_ip = "http://ec2-54-164-169-186.compute-1.amazonaws.com";
  }
  showVideo = ()=>{
    let n_frames = 152; //TODO: retrieve from json
    let w = 320;
    let h = 180;
    let model = 0;
    let video_name = "test_daily"
    let all_strings = new Set();
    for (let i = 0; i < n_frames; i++){
      let frame_name = get_styled_path(video_name, model, i, w, h);
      let frame_encoded = styled_frames.frames[frame_name];
      all_strings.add(frame_encoded);
      // document.getElementById("video").src = frame_encoded;
      this.setState({
        image_source: frame_encoded,
      }, ()=>{
        // this.forceUpdate();
              this.setState({ state: this.state });
        console.log(i)
      })
      // this.setState({ state: this.state });

    }
    console.log(all_strings.size)
  }
  
  render(){
    console.log("rendered again...")
    return (
      <div className="App">
        <header className="App-header">

          {/* <button onClick={()=>this.pushFrames("videos/test_daily.mp4")}>
            Push frames
          </button> */}
          {/* <button onClick={this.changeModel}>
            Change Model
          </button> */}
          <button  onClick={()=>this.showVideo()}>
            Get a frame!
          </button>
          {/* {
            this.state.image_source.length > 0 && */}
          <img 
          src ={`${this.state.image_source}`}
          id ="video"
          alt="this is me"
          width={500}
          height={500}
          />
          {/* } */}
            {/* <button onClick={this.showTestImage}>
              Test the server call!
            </button>
            {
            this.state.testServerResponse !== "" && 
            <span>Response: {this.state.testServerResponse}</span>
            } */}

        </header>
      </div>
    );
  }
}

export default App;
