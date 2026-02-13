<script lang="ts">
	import { invoke } from '@tauri-apps/api/core';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import Container from '$lib/components/Container.svelte';
	import { goto } from '$app/navigation';
	import 'bootstrap-icons/font/bootstrap-icons.css';

	let container: Container;

	async function quit() {
		await invoke('quit');
	}

	async function singleplay() {
		await container.fadeOut();
		goto('/singleplay');
	}
</script>

<Container bind:this={container}>
	<div class="left">
		<div class="title">
			교통량<br />안정도<br />평가보고
		</div>
		<div class="subtitle">Urban Dispatch <span class="version">v0.1.0</span></div>
	</div>
	<div class="right">
		<MenuItem onclick={singleplay}><i class="bi bi-person-walking"></i> 혼자서 플레이</MenuItem>
		<MenuItem><i class="bi bi-bus-front-fill"></i> 여럿이서 플레이</MenuItem>
		<MenuItem><i class="bi bi-train-front-fill"></i> 설정</MenuItem>
		<MenuItem onclick={quit}><i class="bi bi-airplane-fill"></i> 종료</MenuItem>
	</div>
</Container>

<style>
	.left {
		text-align: right;
	}

	.title {
		font-size: 128px;
		font-weight: 900;
	}

	.subtitle {
		font-size: 32px;
		font-weight: 900;
	}

	.version {
		font-size: 16px;
		font-weight: 400;
		margin-left: 8px;
	}

	.right {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}
</style>
