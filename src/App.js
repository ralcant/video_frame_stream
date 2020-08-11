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
      testServerResponse: "",
    }
    // this.pushFrames = this.pushFrames.bind(this);
    this.backend_ip = "http://18.27.79.47:5000";
  }
  testServerCall = ()=>{
    let requestOptions = {
      method: 'GET',
      mode: "cors",
      redirect: 'follow',
      headers:{
        "Access-Control-Allow-Origin": "*"
      }
    };
    let that = this;
    fetch(`${this.backend_ip}/test`, requestOptions)
    .then(res=>res.json())
    .then(result =>{
      console.log(result);
      that.setState({
        testServerResponse: result.toString(),
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
  changeColor = ()=>{
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
  }
  getImage2 = ()=>{
    let that = this;
    console.log("getting image...")
    fetch(`${this.backend_ip}/image`)//, params)
    .then(res => res.body)
    .then(body => body.getReader())
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
        return btoa(atob(str)) ===  str;
    } catch (err) {
        return false;
    }
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
            <button onClick={this.testServerCall}>
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
