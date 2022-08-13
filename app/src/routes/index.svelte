<script lang="ts">
  import "carbon-components-svelte/css/g90.css";

  import { Header, Content, ToastNotification } from "carbon-components-svelte";

  import Console from "../components/Console.svelte";
  import SerialControl from "../components/SerialControl.svelte";
  import CameraControl from "../components/CameraControl.svelte";
  import ScanningControl from "../components/ScanningControl.svelte";

  import CameraView from "../components/CameraView.svelte";
  import PrinterControl from "../components/PrinterControl.svelte";

  let errorContents: string;

  function displayError(err) {
    console.error(err);
    errorContents = `Error: ${err.message || err.toString()}`;
  }

  let serialConsole, serialControl, cameraView;

  let serialConnected: boolean = false;
</script>

<Header platformName="Printer Interface" />
<Content>
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
      <ScanningControl
        sendLine={(line) => serialControl.addLines([line])}
        savePhoto={() => {
          cameraView.capture();
          cameraView.save();
        }}
      />
      <PrinterControl sendLine={(line) => serialControl.addLines([line])} />
    </div>
    <Console
      bind:this={serialConsole}
      inputEnabled={serialConnected}
      on:data={(evt) => serialControl.addLines(evt.detail.lines)}
    />
    <CameraView bind:this={cameraView} />
  </div>

  {#if errorContents}
    <ToastNotification title="Error" subtitle={errorContents} timeout={5000} />
  {/if}
</Content>
