import React from 'react';
// import logo from './logo.svg';
import ReactHLS from 'react-hls';
import ReactHlsPlayer from 'react-hls-player'

import './App.css';
import styled_frames from './styled_frames.json';
import get_styled_path from "./utils";

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      num : 0,
      image_source: "",
      color: true,
      testServerResponse: "",
    }

  }
  showVideo = ()=>{

  }
  
  render(){
    console.log("rendered again...")
    return (
      <div className="App">
        <header className="App-header">
        <ReactHlsPlayer
          url='https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
          // url='https://art-news.club/static/test_daily.m3u8'

          autoplay={false}
          controls={true}
          width="100%"
          height="auto"
      />
          <ReactHlsPlayer
          // url='https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
          url='https://www.art-news.club/static/test_daily.m3u8'

          autoplay={false}
          controls={true}
          width="100%"
          height="auto"
      />
          {/* <ReactHLS url="https://www.art-news.club/static/test_daily.m3u8"/> */}

          <button  onClick={()=>this.showVideo()}>
            Get a frame!
          </button>
        </header>
      </div>
    );
  }
}

export default App;
