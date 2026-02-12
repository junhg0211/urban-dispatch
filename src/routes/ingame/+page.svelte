<script lang="ts">
	import { onMount } from 'svelte';
	import { Camera } from '$lib/objets/camera';
	import { FilledCircle } from '$lib/objets/objets';
	import { goto } from '$app/navigation';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	const camera = new Camera(0, 0, 1);
	const cameraTarget = new Camera(0, 0, 1);

	const objects = [new FilledCircle(0, 0, 50, '#0000003f')];

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
			camera.x = lerp(camera.x, cameraTarget.x, lerpFactor);
			camera.y = lerp(camera.y, cameraTarget.y, lerpFactor);
			camera.zoom = lerp(camera.zoom, cameraTarget.zoom, lerpFactor);
		}

		objects.forEach((obj) => obj.tick && obj.tick());

		const currentTime = performance.now();
		fps = 1000 / (currentTime - lastTime);
		lastTime = currentTime;
	}

	function render(ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

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
			document.removeEventListener('resize', resize);
			document.removeEventListener('keydown', keydown);
			document.removeEventListener('mousedown', mousedown);
			document.removeEventListener('mouseup', mouseup);
			document.removeEventListener('mousemove', mousemove);
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
