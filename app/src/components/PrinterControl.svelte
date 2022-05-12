<script lang="ts">
  import Card, { Content } from "@smui/card";
  import IconButton from "@smui/icon-button";
  import Button, { Label, Icon } from "@smui/button";
  import SegmentedButton, { Segment } from "@smui/segmented-button";

  let move_distances = ["0.1", "1", "10", "100"];
  let move_distance = "1";

  export let sendLine: Function;
</script>

<Card padded style="height: 100%">
  <h3 style="margin: 0">Printer Controls</h3>
  <Content>
    <table>
      <tr>
        <td>
          <Button variant="outlined" on:click={() => sendLine("G28 X")}>
            <Icon class="material-icons">home</Icon>
            <Label>X</Label>
          </Button>
        </td>
        <td />
        <td>
          <IconButton
            class="material-icons"
            size="button"
            on:click={() => sendLine(`G91\nG0 Y${move_distance}\nG90`)}
            >arrow_upward</IconButton
          >
        </td>
        <td />
        <td>
          <IconButton
            class="material-icons"
            size="button"
            on:click={() => sendLine(`G91\nG0 Z${move_distance}\nG90`)}
            >arrow_upward</IconButton
          >
        </td>
      </tr>
      <tr>
        <td>
          <Button variant="outlined" on:click={() => sendLine("G28 Y")}>
            <Icon class="material-icons">home</Icon>
            <Label>Y</Label>
          </Button>
        </td>
        <td>
          <IconButton
            class="material-icons"
            size="button"
            on:click={() => sendLine(`G91\nG0 X-${move_distance}\nG90`)}
            >arrow_back</IconButton
          >
        </td>
        <td />
        <td
          ><IconButton
            class="material-icons"
            size="button"
            on:click={() => sendLine(`G91\nG0 X${move_distance}\nG90`)}
            >arrow_forward</IconButton
          >
        </td>
        <td style="text-align: center">Z</td>
      </tr>
      <tr>
        <td>
          <Button variant="outlined" on:click={() => sendLine("G28 Z")}>
            <Icon class="material-icons">home</Icon>
            <Label>Z</Label>
          </Button>
        </td>
        <td />
        <td>
          <IconButton
            class="material-icons"
            size="button"
            on:click={() => sendLine(`G91\nG0 Y-${move_distance}\nG90`)}
            >arrow_downward</IconButton
          >
        </td>
        <td />
        <td>
          <IconButton
            class="material-icons"
            size="button"
            on:click={() => sendLine(`G91\nG0 Z-${move_distance}\nG90`)}
            >arrow_downward</IconButton
          >
        </td>
      </tr>
    </table>
    <div
      style="display: flex;align-items: center; text-align: center; margin-top: 8px;"
    >
      <Button variant="outlined" on:click={() => sendLine("G28")}>
        <Icon class="material-icons">home</Icon>
        <Label>XYZ</Label>
      </Button>
      <SegmentedButton
        segments={move_distances}
        let:segment
        singleSelect
        bind:selected={move_distance}
      >
        <Segment {segment}>
          <Label>{segment}</Label>
        </Segment>
      </SegmentedButton>
    </div>
  </Content>
</Card>

<style>
  :global(.mdc-icon-button__ripple::before) {
    border-radius: 4px !important;
  }
</style>
