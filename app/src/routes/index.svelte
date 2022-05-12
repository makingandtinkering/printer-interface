<script lang="ts">
  import type { SnackbarComponentDev } from "@smui/snackbar";
  import Snackbar, { Label, Actions } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";

  import Console from "../components/Console.svelte";
  import SerialControl from "../components/SerialControl.svelte";
  import CameraControl from "../components/CameraControl.svelte";
  import ScanningControl from "../components/ScanningControl.svelte";

  import CameraView from "../components/CameraView.svelte";

  let errorSnackbar: SnackbarComponentDev;
  let errorSnackbarContents: string;

  function displayError(err) {
    console.error(err);
    errorSnackbarContents = `Error: ${err.message || err.toString()}`;
    errorSnackbar.open();
  }

  let serialConsole, serialControl, cameraView;

  let serialConnected: boolean = false;
</script>

<div style="display: flex;flex-direction: row;">
  <div style="display: flex;flex-direction: column">
    <SerialControl
      bind:this={serialControl}
      on:line={(evt) => serialConsole.addLine(evt.detail.text)}
      on:error={(evt) => displayError(evt.detail.error)}
      on:connect={() => (serialConnected = true)}
      on:disconnect={() => (serialConnected = false)}
    />
    <CameraControl
      on:error={(evt) => displayError(evt.detail.error)}
      on:stream={(evt) => cameraView.setStream(evt.detail.stream)}
    />
    <ScanningControl />
  </div>
  <Console
    bind:this={serialConsole}
    inputEnabled={serialConnected}
    on:data={(evt) => serialControl.addLines(evt.detail.lines)}
  />
  <CameraView bind:this={cameraView} />
</div>

<Snackbar bind:this={errorSnackbar} labelText={errorSnackbarContents}>
  <Label />
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>
