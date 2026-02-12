export class Camera {
	x: number;
	y: number;
	zoom: number;

	constructor(x: number = 0, y: number = 0, zoom: number = 1) {
		this.x = x;
		this.y = y;
		this.zoom = zoom;
	}

	worldToScreenX(worldX: number, canvas: HTMLCanvasElement): number {
		return worldX * this.zoom + canvas.width / 2 - this.x * this.zoom;
	}

	worldToScreenY(worldY: number, canvas: HTMLCanvasElement): number {
		return worldY * this.zoom + canvas.height / 2 - this.y * this.zoom;
	}

	screenToWorldX(screenX: number, canvas: HTMLCanvasElement): number {
		return (screenX - canvas.width / 2) / this.zoom + this.x;
	}

	screenToWorldY(screenY: number, canvas: HTMLCanvasElement): number {
		return (screenY - canvas.height / 2) / this.zoom + this.y;
	}
}
