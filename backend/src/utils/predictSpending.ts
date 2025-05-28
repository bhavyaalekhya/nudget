// import * as tf from '@tensorflow/tfjs-node';
//
// export async function predictNextMonth(history: number[]): Promise<number> {
//   if (history.length < 2) throw new Error('Need at least 2 data points');
//
//   const xs = tf.tensor1d(history.map((_, i) => i));
//   const ys = tf.tensor1d(history);
//
//   const model = tf.sequential();
//   model.add(tf.layers.dense({ inputShape: [1], units: 10, activation: 'relu' }));
//   model.add(tf.layers.dense({ units: 1 }));
//
//   model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
//
//   await model.fit(xs, ys, {
//     epochs: 200,
//     verbose: 0
//   });
//
//   const nextX = tf.tensor1d([history.length]).expandDims(1);
//   const prediction = model.predict(nextX) as tf.Tensor;
//
//   const value = (await prediction.data())[0];
//
//   tf.dispose([xs, ys, nextX, prediction]);
//
//   return parseFloat(value.toFixed(2));
// }
