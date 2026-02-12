import type { Camera } from "./camera";

class Objet {
  tick() {}

  render(
    _ctx: CanvasRenderingContext2D,
    _camera: Camera,
    _canvas: HTMLCanvasElement,
  ) {}
}

export class FilledCircle extends Objet {
  x: number;
  y: number;
  radius: number;
  color: string;

  constructor(x: number, y: number, radius: number, color: string) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  render(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    canvas: HTMLCanvasElement,
  ) {
    const screenX = camera.worldToScreenX(this.x, canvas);
    const screenY = camera.worldToScreenY(this.y, canvas);
    const screenRadius = this.radius * camera.zoom;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}
