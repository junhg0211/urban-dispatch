<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let screen: HTMLDivElement;

  onMount(() => {
    setTimeout(() => {
      screen.style.animation = "";
      void screen.offsetWidth; // Trigger reflow to restart the animation
      screen.style.animation = "screen-animation 2s forwards";
      setTimeout(() => {
        goto("/mainmenu");
      }, 2000);
    }, 4000);
  });
</script>

<div class="screen" bind:this={screen}>
  <div class="lettering">
    Urban Dispatch Studio
  </div>
</div>

<style>
  .screen {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: 900;
    letter-spacing: -2px;
    background-color: #19191e;
    color: #f7f7f9;
  }

  :global {
    @keyframes screen-animation {
      0% {
        background-color: #19191e;
      }

      100% {
        background-color: #f7f7f9;
      }
    }
  }

  .lettering {
    animation: letter-animation 4s forwards;
  }

  @keyframes letter-animation {
    0% {
      opacity: 0;
    }

    50%, 75% {
      opacity: 1;
    }

    90%, 100% {
      opacity: 0;
    }
  }
</style>
