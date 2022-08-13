<script lang="ts">
  import { Tile } from "carbon-components-svelte";

  export let style = "";
</script>

<Tile class="tile" {style}>
  <slot />
</Tile>

<style>
  :global(.tile) {
    min-height: unset;
    margin: 16px;
  }
</style>
