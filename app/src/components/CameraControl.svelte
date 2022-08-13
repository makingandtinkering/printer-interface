<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";

  import {
    Select,
    SelectItem,
    Loading,
    TooltipIcon,
  } from "carbon-components-svelte";
  import Warning from "carbon-icons-svelte/lib/Warning.svelte";

  import Tile from "./Tile.svelte";

  const dispatch = createEventDispatcher();

  let loading: boolean = true;
  let permissionDenied: boolean = false;
  let videoInputs: MediaDeviceInfo[] = [];

  let stream;

  onMount(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (error) {
      if (error.toString().includes("Permission denied")) {
        error =
          "Camera access has to be granted for this application to capture images.";
        permissionDenied = true;
      } else if (error.toString().includes("Requested device not found")) {
        // No media devices connected
        error = null;
      }

      if (error !== null) {
        dispatch("error", { error });
      }
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    videoInputs = devices.filter(
      (device) => device.label && device.kind === "videoinput"
    );
    loading = false;
  });

  async function onVideoSourceSelect(evt) {
    const deviceId = evt.detail;

    stream = null;
    if (deviceId) {
      loading = true;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: deviceId },
          },
        });

        stream.getVideoTracks()[0].onended = () => {
          stream = null;
          dispatch("stream", { stream });
        };
      } catch (error) {
        dispatch("error", { error });
      }
      loading = false;
    } else {
      stream = null;
    }

    dispatch("stream", { stream });
  }
</script>

<Tile>
  <h3 style="margin: 0; display: flex; flex-direction: row">
    <span style="margin-right: 4px;">Camera Control</span>
    {#if loading}
      <div style="all: initial; display: flex; align-items: center;">
        <!-- Some inherited style is causing the loading icon to be offset, reset all style as a quick bandaid-->
        <Loading withOverlay={false} small />
      </div>
    {/if}
    {#if permissionDenied}
      <TooltipIcon
        tooltipText="Camera access has to be granted for this application to capture
    images. Please grant the permission and refresh the page."
        icon={Warning}
      />
    {/if}
  </h3>
  <Select
    on:change={onVideoSourceSelect}
    labelText="Device"
    helperText="Usually USB2.0 UVC PC Camera"
    disabled={loading || permissionDenied}
  >
    {#each videoInputs as input}
      <SelectItem value={input.deviceId} text={input.label} />
    {/each}
  </Select>
</Tile>
