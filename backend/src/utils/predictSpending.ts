import * as tf from '@tensorflow/tfjs-node';

export async function predictNextMonth(history: number[]): Promise<number> {
  const xs = tf.tensor1d(history.map((_, i) => i));
  const ys = tf.tensor1d(history);

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 1 }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

  await model.fit(xs, ys, { epochs: 150 });

  const predictionTensor = model.predict(tf.tensor2d([[history.length]]));
  if (!('data' in predictionTensor)) {
    throw new Error('Prediction did not return a single Tensor');
  }

  const value = await predictionTensor.data(); // ✅ `.data()` only on a Tensor
  return parseFloat(value[0].toFixed(2));
}
