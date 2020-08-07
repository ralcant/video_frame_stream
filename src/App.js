import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      num : 0,
      image_source: "",
      color: true,
    }
    this.pushFrames = this.pushFrames.bind(this);
  }
  changeModel = () =>{
    console.log("Trying to change model...")
    // changing to 
    fetch('/changeModel')
    .then(res=>res.json())
    .then(result =>{
      console.log("Returned post with status "+ result.status);
      console.log("Message: "+ result.message);
    })
    return
  }
  changeColor = ()=>{
    console.log("pressed!")
    // changing to 
    fetch('/changeColor')
    .then(res=>res.json())
    .then(result =>{
      console.log("Returned post with status "+ result.status);
      console.log("Message: "+ result.message);
    })
    this.setState({
      color: !this.state.color,
    })
    return
    let body = JSON.stringify(this.state);
    let params = {
      method: "POST",
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: body,
    }
    fetch('/test', params)
    .then(res => res.body.getReader())
    .then(reader =>{
      while (true){
        const {done, value} = reader.read();
        if (done){
          break;
        }
        this.setState({
          num: value.result
        })
      }
    })
    // .then(data =>{
    //   console.log(data)
    //   this.setState({
    //       num: data.result
    //   })
    // })
  }
  async pushFrames(videoUrl, fps=25){
      return new Promise(async (resolve) => {
    
        // fully download it first (no buffering):
        let videoBlob = await fetch(videoUrl).then(r => r.blob());
        let videoObjectUrl = URL.createObjectURL(videoBlob);
        let video = document.createElement("video");
    
        let seekResolve;
        video.addEventListener('seeked', async function() {
          if(seekResolve) seekResolve();
        });
    
        video.src = videoObjectUrl;
    
        // workaround chromium metadata bug (https://stackoverflow.com/q/38062864/993683)
        while((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2) {
          await new Promise(r => setTimeout(r, 1000));
          video.currentTime = 10000000*Math.random();
        }
        let duration = video.duration;
    
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let [w, h] = [video.videoWidth, video.videoHeight]
        canvas.width =  w;
        canvas.height = h;
    
        let frames = [];
        let interval = 1 / fps;
        let currentTime = 0;
    
        while(currentTime < duration) {
          video.currentTime = currentTime;
          await new Promise(r => seekResolve=r);
    
          context.drawImage(video, 0, 0, w, h);
          let base64ImageData = canvas.toDataURL();
          frames.push(base64ImageData);
    
          currentTime += interval;
        }
        resolve(frames);
      });
  }
  getImage = ()=>{
    console.log("getting image...")
    fetch("/image")
    .then(res => res.json())
    .then(result => {
        console.log(result)
        this.setFrame(result.frame)
    })
  }
  getImage2 = ()=>{
    let that = this;
    console.log("getting image...")
    fetch("/image")
    .then(res => res.body.getReader())
    .then(async function(reader){ 
      let runs = 0;
      let full = "";
      let took = 0;
      while (true){
        // console.log(reader.read())
        const {done, value} = await reader.read(); //value is Uint8Array
        if (done){
          console.log("it's done!")
          break;
        }
        let ImageDataArrayBuffer = value //new Uint8Array(value); //from https://medium.com/@koteswar.meesala/convert-array-buffer-to-base64-string-to-display-images-in-angular-7-4c443db242cd
                                                          // unclear why I don't need to do Step #3 from ^^^
        const STRING_CHAR = ImageDataArrayBuffer.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
          }, ''); //binary string
        full += STRING_CHAR;
        took +=1
        if (STRING_CHAR.endsWith("#")){
          // that.setFrame("data:image/png;base64,"+full.slice(0, full.length-1));
          runs+=1
          console.log("frame #"+runs+ ", took "+took+" frames")
          took = 0;
          that.setState({
            image_source: full.slice(0, full.length-1),
          })
          full = ""
        }
      } 
      // that.setFrame("data:image/png;base64,"+full)

    })
  }
  isBase64 =(str) =>{
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(str);
    if (str ==='' || str.trim() ===''){ return false; }
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
  }
  setFrame = (frame)=>{
    this.setState({
      image_source: frame,
    })
  }
  // getStream =()=>{
  //   this.timer = setInterval(()=>{
  //     this.getImage();
  //   }, 1000)
  // }
  render(){
    return (
      <div className="App">
        <header className="App-header">
          {/* <button onClick={()=>this.pushFrames("videos/test_daily.mp4")}>
            Push frames
          </button> */}
          <button onClick={this.changeModel}>
            Change Model
          </button>
          <button onClick={()=>this.getImage2()}>
            Wanna see yourself?
          </button>
          {
            this.state.image_source.length > 0 &&
            <img 
            src ={`${this.state.image_source}`}
            alt="this is me"
            with={500}
            height={500}
            />
          }

          {this.state.num}

        </header>
      </div>
    );
  }
}

export default App;
