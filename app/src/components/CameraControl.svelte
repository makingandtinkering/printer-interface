<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import Card, { Content } from "@smui/card";
  import Select, { Option } from "@smui/select";
  import CircularProgress from "@smui/circular-progress";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import { Icon } from "@smui/common";

  const dispatch = createEventDispatcher();

  let loading: boolean = true;
  let permissionDenied: boolean = false;
  let videoInputs: MediaDeviceInfo[] = [];

  onMount(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (error) {
      if (error.toString().includes("Permission denied")) {
        error =
          "Camera access has to be granted for this application to capture images.";
        permissionDenied = true;
      }

      dispatch("error", { error });
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    videoInputs = devices.filter(
      (device) => device.label && device.kind === "videoinput"
    );
    loading = false;
  });

  let selectedId: string = null;
</script>

<Card padded>
  <h3 style="margin: 0">
    Video Control
    {#if loading}
      <CircularProgress style="height: 1em; width: 1em;" indeterminate />
    {/if}
    {#if permissionDenied}
      <Wrapper>
        <Icon class="material-icons" style="font-size: 1em;">warning</Icon>
        <Tooltip
          >Camera access has to be granted for this application to capture
          images. Please grant the permission and refresh the page.</Tooltip
        >
      </Wrapper>
    {/if}
  </h3>
  <Content
    ><Select
      bind:value={selectedId}
      label="Input"
      disabled={loading || permissionDenied}
    >
      {#each videoInputs as input}
        <Option value={input.deviceId}>{input.label}</Option>
      {/each}
      <svelte:fragment slot="helperText"
        >Usually USB2.0 UVC PC Camera</svelte:fragment
      >
    </Select></Content
  >
</Card>
