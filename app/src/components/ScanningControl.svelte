<script lang="ts">
  import Card, { Content } from "@smui/card";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Button, { Label } from "@smui/button";

  let distance_x: number = 4,
    distance_y: number = 4,
    step: number = 1;

  let feedrate: number = 3000,
    move_delay: number = 100;

  let total_photo_count: number = 0,
    photo_count: number = 0;

  let active: boolean = false;
  let step_x: number = 0,
    step_y: number = 0;
  let step_index: number = 0;

  $: if (!isNaN(distance_x) && !isNaN(distance_y) && !isNaN(step)) {
    total_photo_count = (distance_x / step) * (distance_y / step);
  }

  function toggleState() {
    active = !active;

    console.log("active", active);

    if (active) {
      step_index = 0;
      photo_count = 0;
      step_x = Math.floor(distance_x / step);
      step_y = Math.floor(distance_y / step);
      takeStep();
    } else {
    }
  }

  function takeStep() {
    if (!active) {
      return;
    }

    if (step_index === 0) {
      // take photo here
      photo_count++;
    }

    const cur_step_y = Math.floor(step_index / step_x);
    const cur_step_x = step_index % step_x;

    let done = false;

    if (cur_step_x == step_x - 1) {
      if (cur_step_y == step_y - 1) {
        done = true;
      } else {
        // Last step in this row, move up
        console.log("up");
      }
    } else {
      if (cur_step_y % 2 == 0) {
        console.log("right");
      } else {
        console.log("left");
      }
    }

    if (!done) {
      photo_count++;
      step_index++;
      setTimeout(takeStep, move_delay);
    } else {
      active = false;
    }
  }
</script>

<Card padded style="height: 100%">
  <h3 style="margin: 0">Scanning Controls</h3>
  <Content>
    <div>
      <Textfield
        bind:value={distance_x}
        disabled={active}
        label="X Distance (mm)"
        type="number"
        input$min="0.01"
        class="field"
      />
      <Textfield
        bind:value={distance_y}
        disabled={active}
        label="Y Distance (mm)"
        type="number"
        input$min="0.01"
        class="field"
      />
      <Textfield
        bind:value={step}
        disabled={active}
        label="Step Size (mm)"
        type="number"
        input$min="0.1"
        class="field"
      />
    </div>
    <div style="display: flex;" class="textfield-container">
      <div>
        <Textfield
          bind:value={feedrate}
          disabled={active}
          label="Move Speed (mm/s)"
          type="number"
          input$min="1000"
          input$max="3000"
          style="width: 150px"
        />
      </div>
      <div>
        <Textfield
          bind:value={move_delay}
          disabled={active}
          label="Move Delay (ms)"
          type="number"
          input$min="0"
          class="field"
        >
          <svelte:fragment slot="helper">
            <HelperText>Delay after move is completed</HelperText>
          </svelte:fragment>
        </Textfield>
      </div>
    </div>
    <div>
      <Button
        variant="outlined"
        on:click={toggleState}
        style="margin-right: 8px"
      >
        <Label>{active ? "Stop" : "Start"}</Label>
      </Button>
      {photo_count}/{total_photo_count} photos done
    </div>
  </Content>
</Card>

<style lang="scss">
  :global(.field) {
    width: 100px;
  }

  .textfield-container > * {
    padding-right: 4px;
  }
</style>
