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
  type="horizontal"
  id="main"
  min="100px"
  max="-100px"
  pos="50%"
  priority="min"
  --color={dividerColor}
  --thickness={dividerThickness}
>
  <section slot="a">this is on the left</section>
  <section slot="b">this is on the right</section>
</SplitPane>
```

Of the properties that can be set on the component, only `type` is required:

- `type` can be `horizontal`, in which case the panes will be split left-right, or `vertical` in which case it will be split top-bottom
- `id` will be added to the element as a `data-pane={id}` attribute, allowing you to (for example) override the `--pos` CSS custom property on mobile
- `min`, `max` and `pos` can be expressed as `${number}%`, `${number}px`, `${number}em` or `${number}rem`. Positive numbers are measured from the left/top, negative numbers are measured from the right/bottom
- `priority` determines whether the `min` or `max` constraint wins in cases where they conflict
- `--color` determines the color of the divider between panes, and defaults to `transparent`
- `--thickness` determines how thick the 'hit area' is for the divider, and defaults to `8px`
