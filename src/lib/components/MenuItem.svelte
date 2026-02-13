<script lang="ts">
	export let onclick: () => Promise<void> = async () => {};
</script>

<div class="menu-item" {onclick}><slot /></div>

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
</style>
