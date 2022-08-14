<script lang="ts">
  import "carbon-components-svelte/css/g90.css";

  import {
    Header,
    Content,
    ToastNotification,
    Accordion,
    AccordionItem,
  } from "carbon-components-svelte";

  import Console from "../components/Console.svelte";
  import SerialControl from "../components/SerialControl.svelte";
  import CameraControl from "../components/CameraControl.svelte";
  import ScanningControl from "../components/ScanningControl.svelte";

  import CameraView from "../components/CameraView.svelte";
  import PrinterControl from "../components/PrinterControl.svelte";

  let errors = new Map();

  function displayError(err) {
    console.error(err);
    const id = new Date().getTime();
    const errorContents = `Error: ${err.message || err.toString()}`;
    errors.set(id, errorContents);
    errors = errors;
  }

  let serialConsole, serialControl, cameraView;

  let serialConnected: boolean = false;
  let stream = null;
</script>

<Header platformName="Printer Interface" />
<Content style="position: fixed;">
  <div style="display: flex;flex-direction: row;">
    <div style="display: flex;flex-direction: column">
      <Accordion
        ><AccordionItem open title="Configuration">
          <SerialControl
            bind:this={serialControl}
            on:line={(evt) => serialConsole.addLine(evt.detail.text)}
            on:error={(evt) => displayError(evt.detail.error)}
            on:connect={() => (serialConnected = true)}
            on:disconnect={() => (serialConnected = false)}
          />
          <CameraControl
            on:error={(evt) => displayError(evt.detail.error)}
            on:stream={(evt) => {
              stream = evt.detail.stream;
              cameraView.setStream(stream);
            }}
          />
        </AccordionItem></Accordion
      >

      <ScanningControl
        sendLine={(line) => serialControl.addLines([line])}
        savePhoto={() => {
          cameraView.capture();
          cameraView.save();
        }}
        disabled={!serialConnected || stream === null}
      />
      <PrinterControl
        sendLine={(line) => serialControl.addLines([line])}
        disabled={!serialConnected}
      />
    </div>
    <Console
      bind:this={serialConsole}
      inputEnabled={serialConnected}
      on:data={(evt) => serialControl.addLines(evt.detail.lines)}
    />
    <CameraView bind:this={cameraView} />
  </div>

  <div style="position: absolute; top: 64px; right: 16px; text-align: right;">
    {#each [...errors] as [id, error]}
      <ToastNotification
        title="Error"
        subtitle={error}
        timeout={5000}
        on:close={() => {
          errors.delete(id);
          errors = errors;
        }}
      />
    {/each}
  </div>
</Content>
