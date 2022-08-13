<script lang="ts">
  import { NumberInput, Button } from "carbon-components-svelte";
  import Tile from "./Tile.svelte";

  let distance_x: number = 4,
    distance_y: number = 4,
    step: number = 1;

  let feedrate: number = 3000,
    move_delay: number = 500;

  let total_photo_count: number = 0,
    photo_count: number = 0;

  let active: boolean = false;
  let step_x: number = 0,
    step_y: number = 0;
  let step_index: number = 0;

  $: if (!isNaN(distance_x) && !isNaN(distance_y) && !isNaN(step)) {
    const _dx = Math.max(Math.floor(distance_x * 100) / 100, 1);
    const _dy = Math.max(Math.floor(distance_y * 100) / 100, 1);
    const _step = Math.max(Math.floor(step * 100) / 100, 0.1);

    total_photo_count = Math.floor(_dx / _step) * Math.floor(_dy / _step);
  }

  function toggleState() {
    active = !active;

    if (active) {
      step_index = 0;
      photo_count = 0;
      step_x = Math.floor(distance_x / step);
      step_y = Math.floor(distance_y / step);
      takeStep();
    } else {
    }
  }

  async function takeStep() {
    try {
      await doStep();
    } catch (_) {
      active = false;
    }
  }

  async function doStep() {
    if (!active) {
      return;
    }

    if (step_index === 0) {
      // take photo here
      savePhoto();
      photo_count++;

      await sendLineRaise("G91");
    }

    const cur_step_y = Math.floor(step_index / step_x);
    const cur_step_x = step_index % step_x;

    let done = false;

    if (cur_step_x == step_x - 1) {
      if (cur_step_y == step_y - 1) {
        done = true;
      } else {
        // Last step in this row, move up
        await sendLineRaise(`G0 Y${step} F${feedrate}`);
      }
    } else {
      if (cur_step_y % 2 == 0) {
        // Right
        await sendLineRaise(`G0 X${step} F${feedrate}`);
      } else {
        // Left
        await sendLineRaise(`G0 X-${step} F${feedrate}`);
      }
    }

    savePhoto();

    if (!done) {
      // Wait for move to be done
      await sendLine("M400");
      photo_count++;
      step_index++;
      setTimeout(takeStep, move_delay);
    } else {
      active = false;
    }
  }

  async function sendLineRaise(line) {
    if (!sendLine) return;

    if (!(await sendLine(line))) {
      throw new Error("Timeout, no ok");
    }
  }

  export let sendLine: Function = null;
  export let savePhoto: Function = null;

  export let disabled = true;
</script>

<Tile style="width: 500px">
  <h3 style="margin: 0">Scanning Controls</h3>
  <div class="textfield-container">
    <div>
      <NumberInput
        bind:value={distance_x}
        disabled={active}
        label="X Distance (mm)"
        type="number"
        min={0.01}
        class="field"
        hideSteppers={true}
      />
    </div>
    <div>
      <NumberInput
        bind:value={distance_y}
        disabled={active}
        label="Y Distance (mm)"
        type="number"
        min={0.01}
        class="field"
        hideSteppers={true}
      />
    </div>
    <div>
      <NumberInput
        bind:value={step}
        disabled={active}
        label="Step Size (mm)"
        type="number"
        min={0.1}
        class="field"
        hideSteppers={true}
      />
    </div>
  </div>
  <div class="textfield-container">
    <div>
      <NumberInput
        bind:value={feedrate}
        disabled={active}
        label="Move Speed (mm/s)"
        type="number"
        min={1000}
        max={3000}
        step={100}
      />
    </div>
    <div>
      <NumberInput
        bind:value={move_delay}
        disabled={active}
        label="Move Delay (ms)"
        type="number"
        min={0}
        step={100}
        class="field"
        helperText="Delay after move is completed"
      />
    </div>
  </div>
  <div style="display: flex; align-items: center;">
    <Button
      kind="primary"
      on:click={toggleState}
      style="margin-right: 8px"
      disabled={!active && disabled}
      title={disabled ? "Connect to your printer and camera first!" : undefined}
    >
      {active ? "Stop" : "Start"}
    </Button>
    {#if active}
      {photo_count}/{total_photo_count} photos done
    {:else}
      Full scan will take {total_photo_count} photos
    {/if}
  </div>
</Tile>

<style lang="scss">
  :global(.field) {
    width: 100px;
  }

  .textfield-container {
    display: flex;
    flex-direction: row;
  }

  .textfield-container > * {
    padding-right: 4px;
  }
</style>
