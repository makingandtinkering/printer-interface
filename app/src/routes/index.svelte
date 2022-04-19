<script lang="ts">
  import Console from "../components/Console.svelte";
  import SerialControl from "../components/SerialControl.svelte";

  let serialConsole, serialControl;
</script>

<SerialControl
  bind:this={serialControl}
  on:line={(evt) => serialConsole.addLine(evt.detail.text)}
/>
<Console
  bind:this={serialConsole}
  on:data={(evt) => serialControl.addLines(evt.detail.lines)}
/>
