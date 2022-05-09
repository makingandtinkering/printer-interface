<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import Card, { Content } from "@smui/card";
  import Select, { Option } from "@smui/select";
  import CircularProgress from "@smui/circular-progress";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import Button, { Label } from "@smui/button";
  import { Icon } from "@smui/common";

  const dispatch = createEventDispatcher();

  let loading: boolean = true;
  let permissionDenied: boolean = false;
  let validStreamSource: boolean = false;
  let videoInputs: MediaDeviceInfo[] = [];

  let videoDisplay, snapshotDisplay;
  let snapshot: string = null;

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

  function onVideoSourceSelect(evt) {
    const deviceId = evt.detail.value;

    validStreamSource = false;
    if (deviceId) {
      loading = true;
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: { exact: deviceId },
          },
        })
        .then((stream) => {
          videoDisplay.srcObject = stream;
          validStreamSource = true;
        })
        .catch((error) => {
          dispatch("error", { error });
        })
        .finally(() => {
          loading = false;
        });
    } else {
      videoDisplay.srcObject = undefined;
    }
  }

  async function takePhoto() {
    if (!validStreamSource) {
      throw "No valid stream source available";
    }

    const stream = videoDisplay.srcObject;
    const settings = stream.getVideoTracks()[0].getSettings();

    snapshotDisplay.width = settings.width;
    snapshotDisplay.height = settings.height;

    const ctx = snapshotDisplay.getContext("2d");

    ctx.drawImage(
      videoDisplay,
      0,
      0,
      snapshotDisplay.width,
      snapshotDisplay.height
    );

    return snapshotDisplay.toDataURL("image/png");
  }

  function saveImage(imageStr, fileName) {
    const ele = document.createElement("a");
    ele.href = imageStr.replace("image/png", "application/octet-stream");
    ele.download = fileName;
    document.body.appendChild(ele);
    ele.click();
    ele.remove();
  }
</script>

<Card padded style="width: 500px">
  <h3 style="margin: 0">
    Video Control
    {#if loading}
      <CircularProgress style="height: 0.95em; width: 0.95em;" indeterminate />
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
  <Content>
    <Select
      on:MDCSelect:change={onVideoSourceSelect}
      label="Device"
      disabled={loading || permissionDenied}
    >
      {#each videoInputs as input}
        <Option value={input.deviceId}>{input.label}</Option>
      {/each}
      <svelte:fragment slot="helperText"
        >Usually USB2.0 UVC PC Camera</svelte:fragment
      >
    </Select>
  </Content>
  <h3 style="margin: 0">Live View</h3>
  <Content>
    <video bind:this={videoDisplay} style="width: 100%" playsinline autoplay>
      <track kind="captions" />
    </video>
  </Content>
  <h3 style="margin: 0">Snapshot</h3>
  <Content>
    <Button
      disabled={!validStreamSource}
      on:click={async () => (snapshot = await takePhoto())}
    >
      <Label>Capture</Label>
    </Button>
    <Button
      disabled={snapshot === null}
      on:click={() => saveImage(snapshot, "download.png")}
    >
      <Label>Download</Label>
    </Button>
    <canvas bind:this={snapshotDisplay} style="width: 100%" />
  </Content>
</Card>
