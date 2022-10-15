import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import LoadObject from "./LoadObject";
import { App } from "./App.js";

export default class SceneBuilder {
  constructor() {
    console.log("scene builder");
    this.sizes = {
      width: 800,
      height: 600,
    };
    this.cursor = {
      x: 0,
      y: 0,
    };

    window.addEventListener("mousemove", (event) => {
      this.cursor.x = event.clientX / this.sizes.width - 0.5;
      this.cursor.y = -(event.clientY / this.sizes.height - 0.5);
    });

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.sizes.width;
    this.canvas.height = this.sizes.height;
    document.querySelector("body").appendChild(this.canvas);

    // Scene
    this.scene = new THREE.Scene();

    // Object
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    // this.scene.add(this.mesh);

    this.myLoader = new LoadObject(this.scene);

    // Camera
    // Fist parameter is the vertical field of view, something between 45/75
    // Near and Far parameter, we are goint to see just the things between this range
    this.aspectRatio = this.sizes.width / this.sizes.height;
    this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 1000);

    this.camera.position.x = 220;
    this.camera.position.y = 100;
    this.camera.position.z = 100;
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);

    //Light
    this.light = new THREE.AmbientLight(0xffffff, 0.3);
    this.pointLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.pointLight.position.set(0.8, 7.4, 1.0);
    this.scene.add(this.pointLight);

    // Animate
    this.clock = new THREE.Clock();

    this.tick = () => {
      this.elapsedTime = this.clock.getElapsedTime();

      // Update Camera
      // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
      // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
      // camera.position.y = cursor.y * 5
      // camera.lookAt(mesh.position)

      // Render
      this.controls.update();
      this.renderer.render(this.scene, this.camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(this.tick);
    };
    this.tick();
  }
}
