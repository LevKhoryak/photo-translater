import React, { useRef, useState, useEffect } from "react";
import renderPrediction from "./Tools";

import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const app = initializeApp({
  apiKey: "AIzaSyAfZI6cTz5FXOhUMpfc1fApcN-OykXNUlw",
  authDomain: "photo-translater.firebaseapp.com",
  projectId: "photo-translater",
  storageBucket: "photo-translater.appspot.com",
  messagingSenderId: "356110128112",
  appId: "1:356110128112:web:9af42b48b030883c38c335"
});

function App() {
  const videoRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
      },
    }).then(stream => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play();
    }).catch(err => {
      console.error(err);
    })
  }

  const analyzeFeed = () => {
    let video = videoRef.current;
    if (video === null)
      return(null);
    cocoSsd.load()
      .then(model => {
        setLoaded(true);
        setInterval(() => {
          model.detect(video)
            .then(predictions => { setPredictions(predictions) });
        }, 10);
      });
  }

  useEffect(() => {
    getVideo();
  }, [videoRef])

  useEffect(() => {
    analyzeFeed();  
  }, [])

  return (
    <div className="App">
    {!loaded && <LoadingScreen />}
    <LoadVideo videoRef={videoRef} predictions={predictions} loaded={loaded}/>
    </div>
  );
}

function LoadVideo({videoRef, predictions, loaded}) {
  return(
    <div className={"video " + (loaded ? "loaded" : "")}>
      <video autoPlay={true} playsInline={true} muted={true} ref={videoRef}></video>
      {predictions.map((prediction, idx) => renderPrediction(idx, prediction))}
    </div>
  );
}

function LoadingScreen() {
  return(
    <div className="LoadingScreen">
      <h1>Please wait!</h1>
      <h3>The app is loading...</h3>
    </div>
  );
}

export default App;
