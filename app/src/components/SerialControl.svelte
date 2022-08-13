<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";

  import { Select, SelectItem, Modal, Button } from "carbon-components-svelte";
  import Tile from "./Tile.svelte";

  import MarlinSerial from "../utility/MarlinSerial";

  const serial = new MarlinSerial();

  const dispatch = createEventDispatcher();

  // We use this to handle server side where `navigator` does not exist
  let mounted: boolean = false;

  onMount(() => {
    mounted = true;
  });

  const BAUDRATES: number[] = [250000, 115200, 9600];
  let baudRate = BAUDRATES[0];

  let connected: boolean = false;

  serial.on("connect", () => {
    connected = true;

    dispatch("connect");
  });

  serial.on("disconnect", () => {
    connected = false;
    dispatch("disconnect");
  });

  serial.on("line", (line: string) => {
    dispatch("line", {
      text: line,
    });
  });

  async function connect() {
    try {
      const port = await serial.selectPort();
      if (!port) return;

      await serial.open(port, baudRate);
    } catch (error) {
      dispatch("error", { error });
    }
  }

  async function disconnect() {
    await serial.close();
  }

  export async function addLines(lines: string[]) {
    try {
      for (const line of lines) {
        // Send to console for display too
        dispatch("line", {
          text: line,
        });
        await serial.writeLine(line);
      }
    } catch (error) {
      dispatch("error", { error });
    }
  }

  let unsupportedModalOpen = true;
</script>

{#if mounted && !MarlinSerial.isSupported()}
  <Modal
    danger
    open={unsupportedModalOpen}
    on:click:button--primary={() => (unsupportedModalOpen = false)}
    primaryButtonText="Acknowledge"
    modalHeading="Unsupported browser operation"
  >
    <p>
      Your browser does not support Serial connections. You will not be able to
      connect to your printer. Try Chrome, Edge or Firefox?
    </p>
  </Modal>
{/if}

<Tile>
  <h3 style="margin: 0">Serial Port</h3>
  <div style="display: flex; flex-direction: row">
    <Select
      bind:selected={baudRate}
      labelText="Baud Rate"
      helperText="Usually 250000"
    >
      {#each BAUDRATES as br}
        <SelectItem value={br} text={br.toString()} />
      {/each}
    </Select>
    <div style="display: flex; align-items: center">
      {#if !connected}
        <Button kind="primary" on:click={connect}>Connect</Button>
      {:else}
        <Button kind="secondary" on:click={disconnect}>Disconnect</Button>
      {/if}
    </div>
  </div>
</Tile>
