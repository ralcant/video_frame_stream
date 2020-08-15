import React from 'react';
// import logo from './logo.svg';
import ReactHLS from 'react-hls';
// import ReactHlsPlayer from 'react-hls-player'
// import Player from "./Player"

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
      n: 0,
    }

  }
  componentDidMount(){
    this.timer = setInterval(()=>{
      this.setState({
        n : (this.state.n + 1 ) %5
      })
    }, 1000)
  }
  showVideo = ()=>{

  }
  
  render(){
    console.log("rendered again...")
    const videoJsOptions = {
      autoplay: true,
      controls: true,
      sources: [{
        src: '/path/to/video.mp4',
        type: 'video/mp4  '
      }]
    }
    return (
      <div className="App">
        <header className="App-header">
          {/* <Player 
          ref = {player => this.player = player}
          width = "600"
          height = "400"
          // source = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
          source = "https://www.art-news.club/stream/test_daily.m3u8"
          /> */}
        {/* <ReactHlsPlayer
          url='https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
          // url='https://art-news.club/static/test_daily.m3u8'

          autoplay={false}
          controls={true}
          width="100%"
          height="auto"
      /> */}
          {/* <ReactHlsPlayer
          // url='https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
          url='https://www.art-news.club/stream/test_daily.m3u8'

          autoplay={false}
          controls={true}
          width="100%"
          height="auto"
      /> */}
          <ReactHLS autoplay={true} fluid={true} url={`https://www.art-news.club/stream/writer-${this.state.n}.m3u8`}/>
          <ReactHLS autoplay={true} fluid={true} url={`https://www.art-news.club/stream/test_daily.m3u8`}/>

          {/* <button  onClick={()=>this.showVideo()}>
            Get a frame!
          </button> */}
        </header>
      </div>
    );
  }
}

export default App;
