<script lang="ts">
  import type { SnackbarComponentDev } from "@smui/snackbar";
  import Snackbar, { Label, Actions } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";

  import Console from "../components/Console.svelte";
  import SerialControl from "../components/SerialControl.svelte";
  import CameraControl from "../components/CameraControl.svelte";
  import { defaultMaxListeners } from "events";

  let errorSnackbar: SnackbarComponentDev;
  let errorSnackbarContents: string;

  function displayError(err) {
    console.error(err);
    errorSnackbarContents = `Error: ${err.message || err.toString()}`;
    errorSnackbar.open();
  }

  let serialConsole, serialControl;
</script>

<div style="display: flex;flex-direction: row; width: 100vw; height: 100vh;">
  <div style="display: flex;flex-direction: column">
    <SerialControl
      bind:this={serialControl}
      on:line={(evt) => serialConsole.addLine(evt.detail.text)}
      on:error={(evt) => displayError(evt.detail.error)}
    />
    <Console
      bind:this={serialConsole}
      on:data={(evt) => serialControl.addLines(evt.detail.lines)}
    />
  </div>
  <CameraControl on:error={(evt) => displayError(evt.detail.error)} />
</div>

<Snackbar bind:this={errorSnackbar} labelText={errorSnackbarContents}>
  <Label />
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>
