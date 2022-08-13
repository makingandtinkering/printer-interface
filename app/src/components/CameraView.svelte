<script lang="ts">
  import { Button } from "carbon-components-svelte";
  import Tile from "./Tile.svelte";

  import { takePhoto, saveImage } from "../utility/Utility";

  let videoDisplay;

  let stream,
    snapshot = null;

  export function setStream(_stream) {
    stream = _stream;
    videoDisplay.srcObject = _stream;
  }

  export function capture() {
    snapshot = takePhoto(videoDisplay);
  }

  export function save(filename) {
    saveImage(snapshot, filename || "download.png");
  }
</script>

<Tile style="width: 500px">
  <h3 style="margin: 0">Camera Live View</h3>
  <div>
    <video bind:this={videoDisplay} style="width: 100%" playsinline autoplay>
      <track kind="captions" />
    </video>
  </div>
  <h3 style="margin: 0">Camera Snapshot</h3>
  <div>
    <Button disabled={!stream} on:click={capture}>Capture</Button>
    <Button disabled={!snapshot} on:click={save}>Download</Button>
    <div>
      {#if snapshot}
        <img src={snapshot} style="width: 100%" alt="Capture" />
      {/if}
    </div>
  </div>
</Tile>
