<script lang="ts">
  import MenuItem from "$lib/components/MenuItem.svelte";
  import Container from "$lib/components/Container.svelte";
  import { goto } from "$app/navigation";

  let container: Container;

  async function back() {
    await container.fadeOut();
    goto("/mainmenu");
  }
</script>

<Container bind:this={container}>
  <div class="left">
    <div class="title">혼자서<br>플레이</div>
    <div class="subtitle">Singleplay</div>
  </div>
  <div class="right">
    <MenuItem><i class="bi bi-airplane-fill"></i> 플레이</MenuItem>
    <MenuItem onclick={back}><i class="bi bi-sign-turn-left-fill"></i> 뒤로</MenuItem>
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

  .right {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
</style>
