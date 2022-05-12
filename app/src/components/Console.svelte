<script lang="ts">
  const LINE_BUFFER_SIZE = 256;
  const TEXTAREA_MAX_ROWS = 8;

  const ROW_SEPARATOR_REGEX = /[\r\n]/;

  import { createEventDispatcher } from "svelte";
  import Card, { Content } from "@smui/card";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";

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
  let textArea: boolean = false;

  function onKeypress(evt) {
    if (evt.key === "\n") {
      textArea = true;
      textInputContent += "\n";
      setTimeout(() => {
        const e = textInput.getElement().querySelector("textarea");
        // Scroll to bottom
        e.scrollTop = e.scrollHeight;
        e.focus();
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

<Card padded style="width: 500px;">
  <h3 style="margin: 0">Console</h3>
  <Content style="display: flex; flex-direction: column; height: 100%">
    <div style="overflow-x: scroll; flex-grow: 1; margin-bottom: 8px;">
      <pre>{lines.join("\n")}</pre>
    </div>
    <Textfield
      style="width: 100%;"
      variant="filled"
      textarea={textArea}
      input$rows={Math.min(
        TEXTAREA_MAX_ROWS,
        textInputContent.split(ROW_SEPARATOR_REGEX).length
      )}
      bind:this={textInput}
      bind:value={textInputContent}
      on:keypress={onKeypress}
    >
      <HelperText slot="helper">Ctrl-Enter to insert new line</HelperText>
    </Textfield>
  </Content>
</Card>
