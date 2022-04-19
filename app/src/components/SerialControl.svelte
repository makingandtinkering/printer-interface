<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";

  import Select, { Option } from "@smui/select";
  import Card, { Content } from "@smui/card";
  import Button, { Label } from "@smui/button";
  import Dialog from "@smui/dialog";
  import type { SnackbarComponentDev } from "@smui/snackbar";
  import Snackbar, { Actions } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";

  import Serial from "../utility/Serial";

  const serial = new Serial();
  let errorSnackbar: SnackbarComponentDev;
  let errorSnackbarContents: string;

  const dispatch = createEventDispatcher();

  // We use this to handle server side where `navigator` does not exist
  let mounted: boolean = false;

  onMount(() => {
    mounted = true;
  });

  // This should technically be a string but smui/select seems to misbehave when passing a number
  //   numbers don't get "matched" correctly to the values and the select thinks its still empty
  const BAUDRATES: string[] = ["250000", "115200", "9600"];
  let baudRate: string = BAUDRATES[0];

  let connected: boolean = false;

  serial.on("connect", () => {
    connected = true;
  });

  serial.on("disconnect", () => {
    connected = false;
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

      await serial.open(port, parseInt(baudRate, 10));
    } catch (err) {
      errorSnackbarContents = `Error: ${err.message}`;
      errorSnackbar.open();
    }
  }

  async function disconnect() {
    await serial.close();
  }
</script>

{#if mounted && !Serial.isSupported()}
  <Dialog open scrimClickAction="" escapeKeyAction="">
    <Content>
      Your browser does not support Serial connections. Try Chrome, Edge or
      Firefox?
    </Content>
  </Dialog>
{/if}

<Snackbar bind:this={errorSnackbar} labelText={errorSnackbarContents}>
  <Label />
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<Card padded>
  <h3 style="margin: 0">Serial Port</h3>
  <Content>
    <Select bind:value={baudRate} label="Baud Rate">
      {#each BAUDRATES as br}
        <Option value={br}>{br}</Option>
      {/each}
      <svelte:fragment slot="helperText">Usually 250000</svelte:fragment>
    </Select>
    {#if !connected}
      <Button variant="unelevated" on:click={connect}>
        <Label>Connect</Label>
      </Button>
    {:else}
      <Button variant="unelevated" on:click={disconnect}>
        <Label>Disconnect</Label>
      </Button>
    {/if}
  </Content>
</Card>
