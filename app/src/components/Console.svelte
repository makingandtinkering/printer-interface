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

  export function addLine(line: string) {
    const date = new Date();
    lines.push(
      `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}] ${line}`
    );

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
      evt.preventDefault();
    }
  }
</script>

<Card padded>
  <h3 style="margin: 0">Console</h3>
  <Content>
    <pre>{lines.join("\n")}</pre>
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
