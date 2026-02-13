<script lang="ts">
	let container: HTMLDivElement;

	export async function fadeIn() {
		return new Promise<void>((resolve) => {
			container.style.animation = '';
			container.style.animation = 'fade-in 1s ease forwards';
			setTimeout(() => resolve(), 1000);
		});
	}

	export async function fadeOut() {
		return new Promise<void>((resolve) => {
			container.style.animation = '';
			container.style.animation = 'fade-out 1s ease forwards';
			setTimeout(() => resolve(), 1000);
		});
	}
</script>

<div class="container" bind:this={container}>
	<slot />
</div>

<style>
	.container {
		display: flex;
		height: 100vh;
		align-items: center;
		justify-content: center;
		gap: 64px;
		animation: fade-in 1s ease;
	}

	:global {
		@keyframes fade-in {
			from {
				transform: translateX(100vw);
			}
			to {
				transform: translateX(0);
			}
		}

		@keyframes fade-out {
			from {
				transform: translateX(0);
			}
			to {
				transform: translateX(-100vw);
			}
		}
	}
</style>
