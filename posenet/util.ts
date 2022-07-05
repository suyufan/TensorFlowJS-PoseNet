import * as posenet from '@tensorflow-models/posenet'

const color = 'aqua'
const boundingBoxColor = 'red'
const lineWidth = 2

function toTuple({ y, x}: { [key: string]: number }): [number, number] {
  return [y, x]
}

export function drawPoint(
  ctx: WechatMiniprogram.CanvasContext, y: number, x: number, r: number,
  color: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  }

export function drawSegment(
  [ay, ax]: [number, number], [by, bx]: [number, number], color: string, scale: number, ctx: WechatMiniprogram.CanvasContext) {
    ctx.beginPath()
    ctx.moveTo(ax * scale, ay * scale)
    ctx.lineTo(bx * scale, by * scale)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.stroke()
  }

export function drawSkeleton(
  keypoints: any, minConfidence: number, ctx: WechatMiniprogram.CanvasContext,
  scale = 1) {
  const adjacentKeyPoints =
    posenet.getAdjacentKeyPoints(keypoints, minConfidence);

  // tslint:disable-next-line:no-any
  adjacentKeyPoints.forEach((keypoints: any) => {
    drawSegment(
      toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
      scale, ctx);
  });
}

export function drawKeypoints(
  keypoints: any, minConfidence: number, ctx: WechatMiniprogram.CanvasContext,
  scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}

export function drawBoundingBox(
  keypoints: any, ctx: WechatMiniprogram.CanvasContext) {
  const boundingBox = posenet.getBoundingBox(keypoints);

  ctx.rect(
    boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
    boundingBox.maxY - boundingBox.minY);

  ctx.strokeStyle = boundingBoxColor;
  ctx.stroke();
}