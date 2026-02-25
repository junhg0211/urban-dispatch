<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import Container from '$lib/components/Container.svelte';
	import { goto } from '$app/navigation';

	let container: Container;

	async function back() {
		await container.fadeOut();
		goto('/mainmenu');
	}
</script>

<Container bind:this={container}>
	<div class="left">
		<div class="back">
			<MenuItem onclick={back} icon="back" align="left">뒤로가기</MenuItem>
		</div>
		<div class="title">
			혼자서<br />플레이
		</div>
		<div class="subtitle">Singleplay</div>
	</div>
	<div class="right">
		<div class="horizontal" />
		<MenuItem icon="world">새 월드 만들기</MenuItem>
	</div>
</Container>

<style>
	.left {
		text-align: right;
	}

	.back {
		margin-left: auto;
	}

	.title {
		font-size: 96px;
		font-weight: 900;
	}

	.subtitle {
		font-size: 24px;
		font-weight: 900;
	}

	.right {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.horizontal {
		width: 100%;
		height: 1px;
		background-color: #19191e;
	}
</style>
