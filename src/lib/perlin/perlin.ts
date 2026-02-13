import random from 'random';

export class Perlin {
	private octaves: number;
	private persistence: number;
	private permutation: number[];

	constructor(octaves: number = 4, persistence: number = 0.5, seed: number = 0) {
		random.use(seed);

		this.octaves = octaves;
		this.persistence = persistence;
		this.permutation = this.generatePermutation();
	}

	private generatePermutation(): number[] {
		const p: number[] = [];
		for (let i = 0; i < 256; i++) {
			p[i] = i;
		}
		for (let i = 255; i > 0; i--) {
			const j = Math.floor(random.float() * (i + 1));
			[p[i], p[j]] = [p[j], p[i]];
		}
		return p.concat(p);
	}

	private fade(t: number): number {
		return t * t * t * (t * (t * 6 - 15) + 10);
	}

	private lerp(a: number, b: number, t: number): number {
		return a + t * (b - a);
	}

	private grad(hash: number, x: number, y: number): number {
		const h = hash & 3;
		const u = h < 2 ? x : y;
		const v = h < 2 ? y : x;
		return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
	}

	public noise(x: number, y: number): number {
		let total = 0;
		let frequency = 1;
		let amplitude = 1;
		let maxValue = 0;

		for (let i = 0; i < this.octaves; i++) {
			const xi = Math.floor(x * frequency) & 255;
			const yi = Math.floor(y * frequency) & 255;

			const xf = x * frequency - Math.floor(x * frequency);
			const yf = y * frequency - Math.floor(y * frequency);

			const u = this.fade(xf);
			const v = this.fade(yf);

			const aa = this.permutation[this.permutation[xi] + yi];
			const ab = this.permutation[this.permutation[xi] + yi + 1];
			const ba = this.permutation[this.permutation[xi + 1] + yi];
			const bb = this.permutation[this.permutation[xi + 1] + yi + 1];

			const x1 = this.lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
			const x2 = this.lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);

			total += this.lerp(x1, x2, v) * amplitude;

			maxValue += amplitude;
			amplitude *= this.persistence;
			frequency *= 2;
		}

		return total / maxValue;
	}
}
