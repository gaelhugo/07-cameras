import * as THREE from "three";
import * as ml from "ml5";

import SceneBuilder from "./SceneBuilder.js";
import LoadObject from "./LoadObject.js";
import Slider from "./Slider.js";
import NeuralNet from "./NeuralNet.js";
import MediaDevices from "media-devices";
import getUserMedia from "getusermedia";

// await MediaDevices.enumerateDevices()

const PARAMS = [
  { name: "cameraX", range: [-100, 100] },
  { name: "cameraY", range: [-100, 100] },
  { name: "cameraZ", range: [-100, 100] },
];

const MESH_POINTS = 468 * 3;

export default class App {
  constructor() {
    this.handlers = {
      keydown: this.onkeydown.bind(this),
      click: this.presetWithFaceMesh.bind(this),
      slide: this.onSlide.bind(this),
      modelReady: this.modelReady.bind(this),
      onPrediction: this.gotPrediction.bind(this),
    };

    this.myScene = new SceneBuilder();

    this.controllers = [];
    // SLIDERS INITIALISATION
    // for (const param of PARAMS) {
    for (let i = 0; i < PARAMS.length; i++) {
      const param = PARAMS[i];

      const options = {
        min: param.range[0],
        max: param.range[1],
        step: 1,
        change: "input",
        param: param.name,
        callback: this.handlers.slide,
      };
      const slider = new Slider(
        50,
        options,
        document.getElementById("sliders")
      );
      this.controllers.push(slider);
    }

    this.videoIsReady = false;
    this.meshColor = "rgb(0,0,255,0.3)";
    document.addEventListener("click", this.handlers.click);
    document.addEventListener("keydown", this.handlers.keydown);
  }

  onkeydown(e) {
    if (e.keyCode == 13) {
      this.customNeuraNet.train(this.handlers.modelReady);
    }

    if (e.keyCode == 32) {
      console.log("space bar");
      if (!this.modelIsTrained) {
        console.log("go add data");
        this.target = {};
        // for (let i = 0; i < this.controllers.length; i++) {
        //   const slider = this.controllers[i].slider;
        //   this.target[i] = parseInt(slider.value);
        //   console.log(this.myScene.camera.position);
        //   // console.log(this.myScene.camera.position[i]);
        // }

        // console.log(this.myScene.camera.position);

        for (
          let i = 0;
          i < Object.entries(this.myScene.camera.position).length;
          i++
        ) {
          // console.log(Object.entries(this.myScene.camera.position));
          const myValue = parseInt(
            Object.entries(this.myScene.camera.position)[i][1]
          );
          console.log(myValue);

          this.target[i] = parseInt(myValue);
        }

        // for (let i of Object.values(this.myScene.camera.position)) {
        //   this.target[i] = parseInt(
        //     Object.values(this.myScene.camera.position)[i]
        //   );
        // }

        // for (const [key, value] of Object.entries(
        //   this.myScene.camera.position
        // )) {
        //   let i = 0;
        //   const slider = this.controllers[i].slider;

        //   this.target[i] = parseInt(`${value}`);
        //   console.log(this.target[i]);
        //   i++;
        //   if (i == Object.entries.length) i = 0;
        //   // console.log(`${key}: ${value}`);
        // }

        console.log(this.myScene.camera.position);

        this.meshColor = "rgb(255,0,0,0.3)";
        this.recordMeshData = true;
        setTimeout(() => {
          this.recordMeshData = false;
          this.meshColor = "rgb(0,0,255,0.3)";
        }, 6000);
      }
    }

    if (e.keyCode == 83) {
      this.customNeuraNet.saveModel();
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (e.keyCode == 76) {
      this.customNeuraNet.loadModel(this.handlers.modelReady);
      // this.customNeuraNet.loadModel(this.customNeuraNet.modelInfo);
    }
  }

  presetWithFaceMesh() {
    /*
    INIT CAMERA 
    */
    if (!this.videoIsReady) {
      console.log("video ready");
      this.video = document.createElement("video");
      this.video_wrapper = document.getElementById("video");
      this.video_wrapper.appendChild(this.video);
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.video_wrapper.appendChild(this.canvas);
      this.video.width = this.canvas.width = 640;
      this.video.height = this.canvas.height = 480;
      this.loadVideo();
      this.loadFaceMeshModel();
      //neural net
      this.modelIsTrained = false;
      this.customNeuraNet = new NeuralNet(MESH_POINTS, PARAMS.length);

      // this.customNeuraNet.loadModel(this.handlers.modelReady);
    }
  }

  loadVideo() {
    console.log(MediaDevices.getUserMedia);
    // console.log(navigator.mediaDevices.getUserMedia);

    if (MediaDevices.getUserMedia) {
      console.log("got user media");
      MediaDevices.getUserMedia({ video: true }).then((stream) => {
        console.log("is streaming");
        // this.video.src = window.URL.createObjectURL(stream);
        this.video.srcObject = stream;
        this.video.play();
        this.videoIsReady = true;
      });
    }
  }

  loadFaceMeshModel() {
    this.facemesh = ml5.facemesh(
      this.video,
      this.faceMeshModelReady.bind(this)
    );
  }

  faceMeshModelReady() {
    console.log("MODEL READY");
    this.facemesh.on("predict", (results) => {
      // console.log(results);
      this.predictions = results;
      this.ctx.clearRect(0, 0, 640, 480);
      if (this.predictions[0]) {
        const data = this.predictions[0].scaledMesh.flat(1);
        if (this.recordMeshData) {
          this.customNeuraNet.addData(data, this.target);
          // console.log(data, this.target);
        }

        if (this.canPredict) {
          this.customNeuraNet.predict(data, this.handlers.onPrediction);
        }

        this.ctx.fillStyle = this.meshColor;
        this.predictions[0].scaledMesh.forEach((item, index) => {
          this.ctx.beginPath();
          this.ctx.arc(item[0], item[1], 2, 0, Math.PI * 2, false);
          this.ctx.fill();
          this.ctx.closePath();
        });
      }
    });
  }

  onSlide(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const param = e.target.getAttribute("data-param");
    const value = e.target.value;
    document.documentElement.style.setProperty(param, value);
  }

  modelReady(e) {
    this.modelIsTrained = true;
    this.canPredict = true;

    this.meshColor = "rgb(0,255,0,0.3)";

    //  this.customNeuraNet.saveModel();
    console.log("MODEL READY");
    this.video.style.opacity = 0.1;
    document.getElementById("sliders").style.opacity = 0.1;
  }

  gotPrediction(error, result) {
    for (let i = 0; i < result.length; i++) {
      const value = result[i].value;
      const slider = this.controllers[i].slider;
      // console.log(this.myScene.camera.position);

      slider.value = value;
      const param = slider.getAttribute("data-param");
      document.documentElement.style.setProperty(param, value);
      this.myScene.camera.position.x = value;
    }
  }
}
