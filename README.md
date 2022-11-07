# 🍹 Next-gen compact native smooth scrolling component library for Vue 3

⚡ **No** scrollbar reinventing using DOM elements, **no** weird logic, **only** native `scroll` event, a sprinkle of CSS magic and the power of `ResizeObserver`.

⚡ **Native** means the library doesn't interfere with scroll logic **at all**. Every scroll feature works as it should be.

## [DEMO](https://zeokku.github.io/vue-smoothie) ([EXAMPLE SOURCE](https://github.com/zeokku/vue-smoothie/blob/main/src/App.vue))

[![npm](https://img.shields.io/npm/v/vue-smoothie?color=pink&style=flat)](https://www.npmjs.com/package/vue-smoothie)
[![npm](https://img.shields.io/npm/dw/vue-smoothie?color=pink&style=flat)](https://www.npmjs.com/package/vue-smoothie)
[![Discord](https://img.shields.io/discord/405510915845390347?color=pink&label=join%20discord&style=flat)](https://zeokku.com/discord)

<hr>

## Installation:

```console
pnpm add vue-smoothie
# or
yarn add vue-smoothie
# or
npm i vue-smoothie
```

## Usage:

You should use the component as a container element for your scrollable content. The container has `overflow: auto` by default.

```vue
<script setup>
import { Smoothie } from "vue-smoothie";
</script>

<template>
  <Smoothie class="container">
    <div>
      <p>Test paragraph</p>
    </div>
  </Smoothie>
</template>

<style>
.container {
  /* define height and/or width */
}
</style>
```

### There are **two flavors** of the component:

- **`Smoothie`** - use this when you only need vertical scroll.
- **`OmniSmoothie`** - use this when you need both vertical and horizontal scroll. In this case prefer using OmniSmoothie component for all scrollable areas even if they're vertical-only to prevent bundling both flavors simultaneously.

```
⚠ Currently there's a bug on Firefox for horizontal scroll, which adds an extra scroll space based on scroll speed
```

### `weight` prop

You can setup how smooth the scrolling is by specifying an _optional_ `weight` prop:
`<Smoothie :weight="0.03">`
The lower the value the lazier transition

### Exposed properties

Both flavors expose an object via `ref` with properties:

- `el` - container DOM element (available in `onMounted` hook)
- `x` and `y` - current smooth scroll position (x only in Omni)

## Common issues

- To make root (App) view work with `smoothie` you have to pass down overflow to the `smoothie` element. One way of doing so is:

  ```css
  html,
  body,
  #app,
  .container {
    height: 100%;
  }
  ```

  where `#app` is the element you mount your Vue application on and `.container` a class applied to root `<smoothie>` element

- Instead of styling `#app` with `padding` and etc, better style scroll container

- Don't forget about `box-sizing: border-box` when a container has `border` and/or `padding` to accommodate it into its `width` and `height` to prevent multiple scrollbars, root-level (`<html>`) scrollbar overtaking overflow and other issues

- Scrollbar appears inside of page not at a side - you need to set `width` to `100%`
