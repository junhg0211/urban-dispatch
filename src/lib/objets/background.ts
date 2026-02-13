import { Perlin } from '$lib/perlin/perlin';
import { Objet } from './objets';

const MULTIPLIER = 0.0001;
const UNIT_SIZE = 32;

const COLORS = [
	{ value: -0.4, color: '#aed9f2' },
	{ value: -0.1, color: '#def3ff' },
	{ value: 0.1, color: '#ffffff' },
	{ value: 0.4, color: '#e6fcec' },
	{ value: 1, color: '#c8e6d0' }
];

function getColorFromValue(value: number): string {
	for (let i = 0; i < COLORS.length - 1; i++) {
		const curr = COLORS[i];

		if (value < curr.value) {
			return curr.color;
		}
	}
	return COLORS[COLORS.length - 1].color;
}

class Tile {
	value: number;
	color: string;

	constructor(value: number) {
		this.value = value;
		this.color = getColorFromValue(value);
	}
}

export class Background extends Objet {
	private perlin: Perlin;
	public update: boolean;
	private cacheCanvas: HTMLCanvasElement;
	private cacheCtx: CanvasRenderingContext2D;

	constructor(seed: number) {
		super();
		this.perlin = new Perlin(4, 0.5, seed);
		this.update = true;
		this.cacheCanvas = document.createElement('canvas');
		this.cacheCtx = this.cacheCanvas.getContext('2d')!;
	}

	render(ctx: CanvasRenderingContext2D, camera: any, canvas: HTMLCanvasElement) {
		// 항상 cacheCanvas 크기를 동기화 (DPI 대응)
		if (this.cacheCanvas.width !== canvas.width || this.cacheCanvas.height !== canvas.height) {
			this.cacheCanvas.width = canvas.width;
			this.cacheCanvas.height = canvas.height;
		}
		if (!this.update) {
			ctx.drawImage(this.cacheCanvas, 0, 0, canvas.width, canvas.height);
			return;
		}

		// generate noise map (vertex-based, for Marching Squares)
		const unit_size = UNIT_SIZE / camera.zoom;

		const startX = Math.floor(camera.screenToWorldX(0, canvas) / unit_size) - 1;
		const endX = Math.ceil(camera.screenToWorldX(canvas.width, canvas) / unit_size) + 2; // +2 for vertex grid
		const startY = Math.floor(camera.screenToWorldY(0, canvas) / unit_size) - 1;
		const endY = Math.ceil(camera.screenToWorldY(canvas.height, canvas) / unit_size) + 2;

		// vertexNoise[y][x] 형태로 저장
		const vertexNoise: number[][] = [];
		for (let j = startY; j <= endY; j++) {
			const row: number[] = [];
			for (let i = startX; i <= endX; i++) {
				const worldX = i * unit_size;
				const worldY = j * unit_size;
				const noiseValue = this.perlin.noise(worldX * MULTIPLIER, worldY * MULTIPLIER);
				row.push(noiseValue);
			}
			vertexNoise.push(row);
		}

		// marching squares: 각 타일마다 네 꼭짓점의 값을 사용
		// threshold를 여러 단계로 나눠서 색상별로 폴리곤을 그릴 수 있음
		const thresholds = COLORS.map((c) => c.value);
		// 각 색상 구간별로 폴리곤을 그림
		for (let t = 0; t < thresholds.length - 1; t++) {
			const lower = thresholds[t];
			const upper = thresholds[t + 1];
			const color = COLORS[t].color;
			this.cacheCtx.beginPath();
			// marching squares
			for (let j = 0; j < vertexNoise.length - 1; j++) {
				for (let i = 0; i < vertexNoise[0].length - 1; i++) {
					// 네 꼭짓점의 값을 가져옴 (시계방향)
					const v0 = vertexNoise[j][i]; // top-left
					const v1 = vertexNoise[j][i + 1]; // top-right
					const v2 = vertexNoise[j + 1][i + 1]; // bottom-right
					const v3 = vertexNoise[j + 1][i]; // bottom-left
					// marching squares 패턴 결정 (lower~upper 사이만 영역)
					const mask =
						(v0 >= lower && v0 < upper ? 1 : 0) |
						(v1 >= lower && v1 < upper ? 2 : 0) |
						(v2 >= lower && v2 < upper ? 4 : 0) |
						(v3 >= lower && v3 < upper ? 8 : 0);
					if (mask === 0) continue; // 이 구간 없음
					// 각 패턴별로 폴리곤 경계 생성 (간단화, 실제로는 보간 필요)
					// 여기서는 각 꼭짓점 중심을 단순히 연결 (더 부드럽게 하려면 보간 추가)
					const sx = (startX + i) * unit_size;
					const sy = (startY + j) * unit_size;
					const ex = (startX + i + 1) * unit_size;
					const ey = (startY + j + 1) * unit_size;
					// 화면 좌표 변환
					const p = [
						[camera.worldToScreenX(sx, canvas), camera.worldToScreenY(sy, canvas)], // top-left
						[camera.worldToScreenX(ex, canvas), camera.worldToScreenY(sy, canvas)], // top-right
						[camera.worldToScreenX(ex, canvas), camera.worldToScreenY(ey, canvas)], // bottom-right
						[camera.worldToScreenX(sx, canvas), camera.worldToScreenY(ey, canvas)] // bottom-left
					];
					// 간단히 mask별로 사각형/삼각형/선분 등 그리기 (보간 없이)
					// 1,2,4,8: 꼭짓점 하나만 해당 -> 삼각형
					// 3,6,9,12: 두 꼭짓점 -> 사각형의 절반
					// 7,11,13,14: 세 꼭짓점 -> 사각형의 3/4
					// 15: 전체
					// 실제 marching squares는 보간점으로 경계선을 만듦
					// 여기서는 단순히 해당 꼭짓점만 연결
					this.cacheCtx.beginPath();
					for (let k = 0; k < 4; k++) {
						if (mask & (1 << k)) {
							this.cacheCtx.lineTo(p[k][0], p[k][1]);
						}
					}
					this.cacheCtx.closePath();
					this.cacheCtx.fillStyle = color;
					this.cacheCtx.fill();
				}
			}
		}

		// 기존 fillRect 반복문은 주석 처리 (다음 단계에서 완전 제거)
		// ...기존 타일별 fillRect 완전 제거 (Marching Squares 방식만 사용)

		// render map (Marching Squares 방식만 사용, map 관련 코드 완전 제거)
		// cacheCanvas 크기 동기화는 위에서 이미 처리

		// draw cache to main ctx (DPI 대응)
		ctx.drawImage(this.cacheCanvas, 0, 0, canvas.width, canvas.height);

		// disable update
		this.update = false;
	}
}
