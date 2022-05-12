<script lang="ts">
  import Card, { Content } from "@smui/card";
  import Button, { Label } from "@smui/button";

  import { takePhoto, saveImage } from "../utility/Utility";

  let videoDisplay, snapshotDisplay;

  let stream,
    snapshot = null;

  export function setStream(_stream) {
    stream = _stream;
    videoDisplay.srcObject = _stream;
  }

  export function capture() {
    snapshot = takePhoto(videoDisplay);
  }

  export function save() {
    saveImage(snapshot, "download.png");
  }
</script>

<Card padded style="width: 500px">
  <h3 style="margin: 0">Live View</h3>
  <Content>
    <video bind:this={videoDisplay} style="width: 100%" playsinline autoplay>
      <track kind="captions" />
    </video>
  </Content>
  <h3 style="margin: 0">Snapshot</h3>
  <Content>
    <Button disabled={!stream} on:click={capture}>
      <Label>Capture</Label>
    </Button>
    <Button disabled={!snapshot} on:click={save}>
      <Label>Download</Label>
    </Button>
    <div>
      {#if snapshot}
        <img src={snapshot} style="width: 100%" alt="Capture" />
      {/if}
    </div>
  </Content>
</Card>
