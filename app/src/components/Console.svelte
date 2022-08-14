<script lang="ts">
  const LINE_BUFFER_SIZE = 256;
  const TEXTAREA_MAX_ROWS = 8;

  const ROW_SEPARATOR_REGEX = /[\r\n]/;

  import { createEventDispatcher } from "svelte";

  import { TextArea } from "carbon-components-svelte";
  import Tile from "./Tile.svelte";

  const dispatch = createEventDispatcher();

  let lines: string[] = [];

  function pad(num, n) {
    return num.toString().padStart(n, "0");
  }

  function getTimestampString() {
    const d = new Date();
    return `${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}:${pad(
      d.getSeconds(),
      2
    )}.${pad(d.getMilliseconds(), 3)}`;
  }

  export function addLine(line: string) {
    lines.push(`[${getTimestampString()}] ${line}`);

    while (lines.length > LINE_BUFFER_SIZE) {
      lines.shift();
    }

    lines = lines;
  }

  let textInput;
  let textInputContent: string = "";

  export let inputEnabled: boolean = false;

  function onKeypress(evt) {
    if (evt.key === "Enter" && evt.ctrlKey) {
      textInputContent += "\n";
      setTimeout(() => {
        // Scroll to bottom
        textInput.scrollTop = textInput.scrollHeight;
        textInput.focus();
      }, 100);
      evt.preventDefault();
    } else if (evt.key === "Enter" && textInputContent.trim().length > 0) {
      dispatch("data", {
        lines: textInputContent.split(ROW_SEPARATOR_REGEX),
      });
      textInputContent = "";
      evt.preventDefault();
    }
  }
</script>

<Tile style="width: 500px;">
  <h3 style="margin: 0">Console</h3>
  <div class="console-container">
    <div style="overflow: scroll; flex-grow: 1; margin-bottom: 8px;">
      <pre>{lines.join("\n")}</pre>
    </div>
    <TextArea
      style="width: 100%;"
      rows={Math.min(
        TEXTAREA_MAX_ROWS,
        textInputContent.split(ROW_SEPARATOR_REGEX).length
      )}
      bind:ref={textInput}
      bind:value={textInputContent}
      on:keydown={onKeypress}
      disabled={!inputEnabled}
      title={inputEnabled ? "" : "A serial port must be connected"}
      helperText="Ctrl-Enter to insert new line"
    />
  </div>
</Tile>

<style>
  .console-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 200px);
  }

  .console-container > :global(.bx--form-item) {
    flex: none !important;
    margin-bottom: 32px;
  }
</style>
