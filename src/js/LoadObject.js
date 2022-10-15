import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SceneBuilder from "./SceneBuilder";

export default class LoadObject {
  constructor(scene) {
    this.scene = scene;

    // this.meshes = [
    //   { fileLocation: "./obj/dish.obj", posX: 10, posY: 10, posZ: 10 },
    // ];

    // let myUrl = new URL("../static/dish.gltf", import.meta.url);
    // const url = window.URL.createObjectURL(new Blob([myUrl]));

    // console.log("url:  " + url);

    this.myLoader = new GLTFLoader();
    this.myLoader.load("assets/dish.gltf", (gltf) => {
      gltf.scene.children[0].material = new THREE.MeshLambertMaterial({
        color: 0xff00ff,
      });
      this.scene.add(gltf.scene);
    });

    // this.myLoader.load("dish.gltf", (gltf) => {
    //   this.scene.add(gltf.scene);
    // });

    //   this.myLoader.load(
    //     this.path,
    //     (object) => {
    //       // object.traverse(function (child) {
    //       //     if ((child as THREE.Mesh).isMesh) {
    //       //         // (child as THREE.Mesh).material = material
    //       //         if ((child as THREE.Mesh).material) {
    //       //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
    //       //         }
    //       //     }
    //       // })
    //       // object.scale.set(.01, .01, .01)
    //       this.mesh = new THREE.Mesh(
    //         object,
    //         new THREE.MeshBasicMaterial({ color: 0xff0000 })
    //       );
    //       this.scene.add(this.mesh);
    //     },
    //     (xhr) => {
    //       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
  }
}
