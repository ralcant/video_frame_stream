import React from 'react';
// import logo from './logo.svg';
import './App.css';
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
  testServerCall = ()=>{
    let requestOptions = {
      method: 'GET',
      mode: "cors",
      redirect: 'follow',
      headers:{
        "Access-Control-Allow-Origin": "*"
      },
      // agent: agent,
    };
    let that = this;
    console.log(`Fetching from ${this.backend_ip}/changeModel `);
    fetch(`${this.backend_ip}/changeModel`, requestOptions)
    .then(res=>res.json())
    .then(result =>{
      console.log(result);
      that.setState({
        testServerResponse: result.message,
      })
    })
    .catch(err =>{
      that.setState({
        testServerResponse: err.message,
      })
    })
  }
  changeModel = () =>{
    let requestOptions = {
      method: 'GET',
      mode: "cors",
      redirect: 'follow',
      headers:{
        "Access-Control-Allow-Origin": "*"
      }
    };
    console.log("Trying to change model...")
    fetch(`${this.backend_ip}/changeModel`, requestOptions)
    .then(res=>res.json())
    .then(result =>{
      console.log(result);
      // console.log("Returned post with status "+ result.status);
      // console.log("Message: "+ result.message);
    })
    return
  }
  
  getIndividualFrame = (i)=>{
    let requestOptions = {
      method: 'GET',
      mode: "cors",
      redirect: 'follow',
      headers:{
        "Access-Control-Allow-Origin": "*"
      }
    };
    let that = this;
    console.log(`Fetching from ${this.backend_ip}/get_individual_frame`);
    fetch(`${this.backend_ip}/get_individual_frame/${i}`, requestOptions)
    .then(res => res.blob())
    .then(blob =>{
      let img = URL.createObjectURL(blob);
      this.setState({
      image_source: img,
      }, ()=>{
        console.log("received!")
      });
    })
    return;
    fetch(`${this.backend_ip}/get_individual_frame`, requestOptions)
    // .then(res => res.text())
    .then(res => res.body)
    .then(body => body.getReader())
    .then(async function(reader){ 
      let full = "";
      while (true){
        const {done, value} = await reader.read(); //value is Uint8Array
        if (done){
          console.log("it's done!")
          break;
        }
        const STRING_CHAR = value.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
          }, ''); //binary string
        full += STRING_CHAR;
      }
      that.setState({
        image_source: full,
      })
    })
    
    // .then(result =>{
    //   console.log(result);
    //   // console.log(result.slice(0, 10));
    //   // console.log(result.slice(result.length-10, result.length));
    //   that.setState({
    //     image_source: result,
    //   })
    // })
  }
  showTestImage = ()=>{
    let requestOptions = {
      method: 'GET',
      mode: "cors",
      redirect: 'follow',
      headers:{
        "Access-Control-Allow-Origin": "*"
      }
    };
    console.log(`Fetching from ${this.backend_ip}/imageTest`)
    fetch(`${this.backend_ip}/imageTest`, requestOptions)
    .then(res => res.blob())
    .then(blob =>{
      let img = URL.createObjectURL(blob);
      this.setState({
      image_source: img,
      }, ()=>{
        console.log("changed Frame")
      });
    })
  }
  showVideo = () =>{
    let requestOptions = {
      method: 'GET',
      mode: "cors",
      redirect: 'follow',
      headers:{
        "Access-Control-Allow-Origin": "*"
      }
    };
    let num_frames;
    let that = this;
    fetch(`${this.backend_ip}/num_frames`, requestOptions)
    .then(res =>res.json())
    .then(async function(response){
      num_frames =  parseInt(response.num_frames);
      console.log(num_frames);
      for (let i = 0; i < num_frames; i++){
        console.log("Frame #" + (i+1))
        await that.getIndividualFrame(i);
      }
    })

  }
  getImage2 = ()=>{
    let requestOptions = {
      method: 'GET',
      mode: "cors",
      redirect: 'follow',
      headers:{
        "Access-Control-Allow-Origin": "*"
      }
    };
    let that = this;
    console.log("getting image...")
    console.log(`Fetching from ${this.backend_ip}/image `);
    fetch(`${this.backend_ip}/image`, requestOptions)
    .then(res => res.body)
    .then(body => body.getReader())
    .then(async function(reader){ 
      let runs = 0;
      let full = "";
      let took = 0;
      while (true){
        console.log("run# "+runs)
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
        took +=1
        let index_delimiter = STRING_CHAR.indexOf("#");
        if (index_delimiter !== -1){
          runs+=1;
          console.log("frame #"+runs+ ", took "+took+" frames")
          took = 0;
          full += STRING_CHAR.slice(0, index_delimiter);

          if (!full.startsWith("data:image")){
            console.log("error!"+ full.slice(0, 10))
          }
          that.setState({
            image_source: full,
          })

          full = STRING_CHAR.slice(index_delimiter+1, STRING_CHAR.length);
        } else{
          //didnt exist
          full += STRING_CHAR;

        }
        // console.log(`String_char = ${STRING_CHAR}`)
        // if (STRING_CHAR.endsWith("#")){
        //   // that.setFrame("data:image/png;base64,"+full.slice(0, full.length-1));
        //   runs+=1
        //   console.log("frame #"+runs+ ", took "+took+" frames")
        //   took = 0;
        //   that.setState({
        //     image_source: full.slice(0, full.length-1),
        //   })
        //   full = ""
        // }
      } 
      // that.setFrame("data:image/png;base64,"+full)

    })
  }
  isBase64 =(str) =>{
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(str);
    // if (str ==='' || str.trim() ===''){ return false; }
    // try {
    //     return btoa(atob(str)) ===  str;
    // } catch (err) {
    //     return false;
    // }
  }
  setFrame = (frame)=>{
    this.setState({
      image_source: frame,
    })
  }
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
          <button onClick={()=>this.showVideo()}>
            Get a frame!
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
            <button onClick={this.showTestImage}>
              Test the server call!
            </button>
            {
            this.state.testServerResponse !== "" && 
            <span>Response: {this.state.testServerResponse}</span>
            }

        </header>
      </div>
    );
  }
}

export default App;
