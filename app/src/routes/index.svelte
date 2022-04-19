<script lang="ts">
  import Console from "../components/Console.svelte";
  import SerialControl from "../components/SerialControl.svelte";

  let serialConsole;
</script>

<SerialControl on:line={(evt) => serialConsole.addLine(evt.detail.text)} />
<Console bind:this={serialConsole} />
