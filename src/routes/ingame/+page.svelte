<script lang="ts">
	import { onMount } from 'svelte';
	import { Camera } from '$lib/objets/camera';
	import { FilledCircle } from '$lib/objets/objets';
	import { goto } from '$app/navigation';
	import { Background } from '$lib/objets/background';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	const camera = new Camera(0, 0, 1);
	const cameraTarget = new Camera(0, 0, 1);

	const objects = [new FilledCircle(0, 0, 50, '#0000003f')];
	const background = new Background(1);

	function lerp(start: number, end: number, t: number): number {
		return start + (end - start) * t;
	}

	function resize() {
		canvas.width = window.innerWidth * window.devicePixelRatio;
		canvas.height = window.innerHeight * window.devicePixelRatio;

		render(ctx);
	}

	function keydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			goto('/singleplay');
		}
	}

	let leftMouseDown = false;
	function mousedown(event: MouseEvent) {
		if (event.button === 0) {
			leftMouseDown = true;
			previousX = event.clientX;
			previousY = event.clientY;
		}
	}

	function mouseup(event: MouseEvent) {
		if (event.button === 0) {
			leftMouseDown = false;
		}
	}

	let previousX = 0;
	let previousY = 0;
	function mousemove(event: MouseEvent) {
		if (leftMouseDown) {
			const deltaX = (event.clientX - previousX) * window.devicePixelRatio;
			const deltaY = (event.clientY - previousY) * window.devicePixelRatio;

			cameraTarget.x -= deltaX / camera.zoom;
			cameraTarget.y -= deltaY / camera.zoom;
		}

		previousX = event.clientX;
		previousY = event.clientY;
	}

	function wheel(event: WheelEvent) {
		const zoomFactor = 1.1;
		if (event.deltaY < 0) {
			cameraTarget.zoom *= zoomFactor;
		} else {
			cameraTarget.zoom /= zoomFactor;
		}
	}

	let fps = 0;
	let lastTime = performance.now();
	function tick() {
		if (fps) {
			const lerpFactor = (0.1 * 60) / fps;
			const newX = lerp(camera.x, cameraTarget.x, lerpFactor);
			const newY = lerp(camera.y, cameraTarget.y, lerpFactor);
			const newZoom = lerp(camera.zoom, cameraTarget.zoom, lerpFactor);
			if (
				Math.abs(newX - cameraTarget.x) > 0.01 ||
				Math.abs(newY - cameraTarget.y) > 0.01 ||
				Math.abs(newZoom - cameraTarget.zoom) > 0.001
			) {
				camera.x = newX;
				camera.y = newY;
				camera.zoom = newZoom;
				background.update = true;
			} else {
				camera.x = cameraTarget.x;
				camera.y = cameraTarget.y;
				camera.zoom = cameraTarget.zoom;
			}
		}

		objects.forEach((obj) => obj.tick && obj.tick());

		const currentTime = performance.now();
		fps = 1000 / (currentTime - lastTime);
		lastTime = currentTime;
	}

	function render(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		background.render(ctx, camera, canvas);

		objects.forEach((obj) => obj.render && obj.render(ctx, camera, canvas));
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;

		window.addEventListener('resize', resize);
		window.addEventListener('keydown', keydown);
		window.addEventListener('mousedown', mousedown);
		window.addEventListener('mouseup', mouseup);
		window.addEventListener('mousemove', mousemove);
		window.addEventListener('wheel', wheel);
		resize();

		const interval = setInterval(() => {
			tick();
			render(ctx);
		});

		return () => {
			window.removeEventListener('resize', resize);
			window.removeEventListener('keydown', keydown);
			window.removeEventListener('mousedown', mousedown);
			window.removeEventListener('mouseup', mouseup);
			window.removeEventListener('mousemove', mousemove);
			window.removeEventListener('wheel', wheel);
			clearInterval(interval);
		};
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		width: 100vw;
		height: 100vh;
	}
</style>
