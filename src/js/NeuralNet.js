import Utils from "./Utils.js";
import mymodel from "../model/model.json";
import mymetadata from "../model/model_meta.json";
import myweights from "../model/model.weights.bin";

export default class NeuralNet {
  constructor(inputs, outputs, debug = true) {
    const options = {
      task: "regression",
      inputs: inputs,
      outputs: outputs,
      debug: debug,
      learningRate: 0.001,
    };

    //Initialize your neural network
    this.nn = ml5.neuralNetwork(options);

    const modelInfo = {
      model: mymodel,
      metadata: mymetadata,
      weights: myweights,
    };

    // ML5 issue WHEN adding data with values of zero
    // Let's prevent that
    Utils.fixDividedByZero(this.nn);
  }

  addData(inputs, values) {
    this.nn.addData(inputs, values);
  }

  train(callback) {
    this.nn.normalizeData();
    //set some default training config
    const options = {
      epochs: 120,
      batchSize: 32,
    };
    this.nn.train(options, callback);
  }
  predict(inputs, callback, scope) {
    this.nn.predict(inputs, callback);
  }
  saveModel() {
    this.nn.save();
  }
  loadModel(callback) {
    const modelInfo = {
      model: "./model/model.json",
      metadata: "./model/model_meta.json",
      weights: "./model/model.weights.bin",
    };
    this.nn.load(modelInfo, callback);
  }
}
