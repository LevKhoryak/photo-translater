import React, { useRef, useState, useEffect } from "react";
import Webcam from 'react-webcam';
import './style.css';

require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const cocossd = require('@tensorflow-models/coco-ssd');

function Detector() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const drawRect = (predictions, ctx) =>{
    // Loop through each prediction
    predictions.forEach(prediction => {
      console.log(prediction)
      // Extract boxes and classes
      const [x, y, width, height] = prediction['bbox']; 
      const text = prediction['class']; 
  
      // Set styling
      const color = '000000';
      ctx.strokeStyle = '#' + color;
      ctx.font = '20px Montserrat';
  
      // Draw rectangles and text
      ctx.beginPath();   
      ctx.fillStyle = '#' + color
      ctx.fillText(text, x, y);
      ctx.rect(x, y, width, height); 
      ctx.stroke();
    });
  }

  const runModel = async () => {
    const net = await cocossd.load();
    //  Loop and detect hands
    const detectionLoop = () => {
      detect(net)
      requestAnimationFrame(detectionLoop)
    }
    requestAnimationFrame(detectionLoop)
  };

  const detect = async (net) => {
    console.log("detect")
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const predictions = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(predictions, ctx); 
    }
  };

  useEffect(() => { runModel() }, [])

  return(
    <div className="Detector">
      <Webcam className="webcam" ref={webcamRef} muted={true} />
      <canvas ref={canvasRef} />
    </div>
  );
}


export default Detector;
