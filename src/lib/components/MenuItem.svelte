<script lang="ts">
	export let onclick: () => Promise<void> = async () => {};
	export let icon: string = '';
	export let align: string = '';
</script>

<div class="menu-item" {onclick} class:left={align === 'left'}>
	{#if icon}
		<img src={`/icon.${icon}.svg`} alt={icon} class="icon" />
	{/if}
	<slot />
</div>

<style>
	.menu-item {
		font-size: 32px;
		font-weight: 900;
		width: fit-content;
		padding: 2px 6px;
		transition:
			color 0.2s ease,
			background-color 0.2s ease;
	}

	.menu-item:hover {
		background-color: #19191e;
		color: #f7f7f9;
	}

	.icon {
		width: 32px;
		height: 32px;
		margin-right: 8px;
		transform: translateY(4px);
		transition: filter 0.2s ease;
	}

	.menu-item:hover .icon {
		filter: invert(100%) sepia(100%) grayscale(100%);
	}

	.left {
		margin-left: auto;
	}
</style>
