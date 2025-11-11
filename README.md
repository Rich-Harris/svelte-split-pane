# svelte-split-pane

A `<SplitPane>` component.

## Usage

```svelte
<script>
  import { SplitPane } from '@rich_harris/svelte-split-pane';

  const dividerColor = 'black';
  const dividerThickness = '20px';
</script>

<SplitPane
  type="columns"
  id="main"
  min="100px"
  max="-100px"
  pos="50%"
  --color={dividerColor}
  --thickness={dividerThickness}
>
  {#snippet a()}
    <section>this is on the left</section>
  {/snippet}

  {#snippet b()}
    <section>this is on the right</section>
  {/snippet}
</SplitPane>
```

Of the properties that can be set on the component, only `type` is required:

- `type` can be `columns`, in which case the panes will be split left-right, or `rows` in which case it will be split top-bottom
- `id` will be added to the element as a `data-pane={id}` attribute, allowing you to (for example) override the `--pos` CSS custom property on mobile
- `min`, `max` and `pos` can be expressed as `${number}%`, `${number}px`, `${number}em` or `${number}rem`. Positive numbers are measured from the left/top, negative numbers are measured from the right/bottom
- `disabled` turns off the interactive dragging
- `--color` determines the color of the divider between panes, and defaults to `transparent`
- `--thickness` determines how thick the 'hit area' is for the divider, and defaults to `8px`
