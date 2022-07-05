import * as tf from '@tensorflow/tfjs-core'

import {drawKeypoints, drawSkeleton} from './util'

export const videoWidth = 288
export const videoHeight = 352
// export interface Point {
//   x: Number;
//   y: Number
// }
// export interface CanvasNode {
//   width: number;
//   height: number;
//   getContext: Function;
//   createImage: Function;
// }

export async function detectPoseInRealTime(image, net, mirror) {
  // const video : tf.Tensor = tf.tidy(() => {}
  const video = tf.tidy(() => {
    const temp = tf.tensor(new Uint8Array(image.data), [image.height, image.width, 4])
    return tf.slice(temp, [0, 0, 0], [-1, -1, 3])
  })

  const flipHorizontal = mirror
  const pose = await net.estimateSinglePose(
    video, {flipHorizontal});
  video.dispose();
  return [pose];
}

export function drawPoses(page) {
  if (page.poses == null || page.ctx == null) return;
  const ctx = page.ctx;
  const poses = page.poses;
  const minPoseConfidence = 0.3;
  const minPartConfidence = 0.3;
  // For each pose (i.e. person) detected in an image, loop through the poses
  // and draw the resulting skeleton and keypoints if over certain confidence
  // scores
  poses.forEach(({score, keypoints}) => {
    if (score >= minPoseConfidence) {
      drawKeypoints(keypoints, minPartConfidence, ctx);
      drawSkeleton(keypoints, minPartConfidence, ctx);
    }
  });
  ctx.draw();
  return poses;
}