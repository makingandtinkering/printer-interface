<script lang="ts">
  import { Button, ContentSwitcher, Switch } from "carbon-components-svelte";

  import Tile from "./Tile.svelte";

  import ArrowUp from "carbon-icons-svelte/lib/ArrowUp.svelte";
  import ArrowDown from "carbon-icons-svelte/lib/ArrowDown.svelte";
  import ArrowLeft from "carbon-icons-svelte/lib/ArrowLeft.svelte";
  import ArrowRight from "carbon-icons-svelte/lib/ArrowRight.svelte";
  import Home from "carbon-icons-svelte/lib/Home.svelte";

  let move_distances = [0.1, 1, 10, 100];
  let move_distance_index = 1;

  $: move_distance = move_distances[move_distance_index];

  export let sendLine: Function;
</script>

<Tile style="height: 100%">
  <h3 style="margin: 0">Printer Controls</h3>
  <table>
    <tr>
      <td>
        <Button on:click={() => sendLine("G28 X")} icon={Home}>X</Button>
      </td>
      <td />
      <td>
        <Button
          class="no-description"
          on:click={() => sendLine(`G91\nG0 Y${move_distance}\nG90`)}
          icon={ArrowUp}
        />
      </td>
      <td />
      <td>
        <Button
          class="no-description"
          on:click={() => sendLine(`G91\nG0 Z${move_distance}\nG90`)}
          icon={ArrowUp}
        />
      </td>
    </tr>
    <tr>
      <td>
        <Button on:click={() => sendLine("G28 Y")} icon={Home}>Y</Button>
      </td>
      <td>
        <Button
          class="no-description"
          on:click={() => sendLine(`G91\nG0 X-${move_distance}\nG90`)}
          icon={ArrowLeft}
        />
      </td>
      <td />
      <td>
        <Button
          class="no-description"
          on:click={() => sendLine(`G91\nG0 X${move_distance}\nG90`)}
          icon={ArrowRight}
        />
      </td>
      <td style="text-align: center; vertical-align: middle">Z</td>
    </tr>
    <tr>
      <td>
        <Button on:click={() => sendLine("G28 Z")} icon={Home}>Z</Button>
      </td>
      <td />
      <td>
        <Button
          class="no-description"
          on:click={() => sendLine(`G91\nG0 Y-${move_distance}\nG90`)}
          icon={ArrowDown}
        />
      </td>
      <td />
      <td>
        <Button
          class="no-description"
          on:click={() => sendLine(`G91\nG0 Z-${move_distance}\nG90`)}
          icon={ArrowDown}
        />
      </td>
    </tr>
  </table>
  <div
    style="display: flex;align-items: center; text-align: center; margin-top: 8px;"
  >
    <Button on:click={() => sendLine("G28")} icon={Home}>XYZ</Button>
    <ContentSwitcher
      bind:selectedIndex={move_distance_index}
      class="move-distance-selector"
    >
      {#each move_distances as move_distance}
        <Switch text={move_distance.toString()} />
      {/each}
    </ContentSwitcher>
  </div>
</Tile>

<style>
  /* Hide tooltip */
  :global(.no-description .bx--assistive-text, .no-description::before) {
    display: none !important;
  }

  :global(.move-distance-selector > .bx--content-switcher-btn) {
    justify-content: center;
  }

  :global(.move-distance-selector) {
    margin-left: 16px;
    width: 300px;
  }
</style>
