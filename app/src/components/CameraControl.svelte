<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import Card, { Content } from "@smui/card";
  import Select, { Option } from "@smui/select";

  const dispatch = createEventDispatcher();

  let videoInputs: MediaDeviceInfo[] = [];

  onMount(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (error) {
      if (error.toString().includes("Permission denied")) {
        error =
          "Camera access has to be granted for this application to capture images.";
      }

      dispatch("error", { error });
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    videoInputs = devices.filter(
      (device) => device.label && device.kind === "videoinput"
    );
  });

  let selectedId: string = null;
</script>

<Card padded>
  <h3 style="margin: 0">Video Control</h3>
  <Content
    ><Select bind:value={selectedId} label="Input">
      {#each videoInputs as input}
        <Option value={input.deviceId}>{input.label}</Option>
      {/each}
      <svelte:fragment slot="helperText"
        >Usually USB2.0 UVC PC Camera</svelte:fragment
      >
    </Select></Content
  >
</Card>
