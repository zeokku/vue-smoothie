<template lang="pug">
div(ref="wrap" @scroll="onScroll" :style="{ overflow: 'auto' }")
  div(:style="contentWrapStyle")
    div(ref="content" :style="{ willChange: 'transform' }")
      slot
  div(ref="spacer")
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, onUpdated, shallowRef, StyleValue } from 'vue';

let props = withDefaults(
  defineProps<{
    // the bigger, the faster transition
    weight?: number,
    // @todo limit maximum transition speed (dx/dt) 
    // clamp?: number
  }>(),
  { weight: 0.06 }
);

let contentWrapStyle: StyleValue =
  import.meta.env.__OMNI ?
    { position: 'sticky', top: 0, height: 0, left: 0, width: 0 } :
    { position: 'sticky', top: 0, height: 0 };

let wrap = shallowRef<HTMLDivElement>();
let spacer = shallowRef<HTMLDivElement>();
let content = shallowRef<HTMLDivElement>();

let exposed = import.meta.env.__OMNI ?
  {
    el: wrap,
    x: 0,
    y: 0
  } :
  {
    el: wrap,
    y: 0
  };

defineExpose(exposed);

let raf: number;

// target
// smooth
let
  tx = 0,
  ty = 0,
  x = 0,
  y = 0;

const onScroll = () => {
  if (import.meta.env.__OMNI) {
    ({
      scrollLeft: tx,
      scrollTop: ty
    } = wrap.value!)
  }
  else {
    ({
      scrollTop: ty
    } = wrap.value!)
  }
}

// don't forget this callback will be fired on old dom element removal, so technically it will update size twice, which shouldn't be a problem, though
const updateSpacer = () => {
  if (import.meta.env.__OMNI) {
    spacer.value!.style.width = content.value!.scrollWidth + 'px';
    spacer.value!.style.height = content.value!.scrollHeight + 'px';
  }
  else {
    spacer.value!.style.height = content.value!.scrollHeight + 'px';
  }
}


let resizeObserver = new ResizeObserver(updateSpacer)


onMounted(() => {
  // observing a child div because contentWrap element has fixed size, thus resize observer won't trigger and since slot can be a set of elements it's handy to have just one wrapping div
  resizeObserver.observe(content.value!)

  // in case of hard defined dimensions, resize observer won't trigger, so do init run
  updateSpacer()

  let aspect = 1000 / 60;
  let prev = performance.now();

  requestAnimationFrame(function rafCb() {
    raf = requestAnimationFrame(rafCb);

    let now = performance.now();
    let dt = now - prev;
    prev = now;

    let k = props.weight * dt / aspect;

    // lerp = a + (b-a) * k = a + bk - ak = a(1-k) + bk
    y += k * (ty - y);
    // y = y * (1 - k) + ty * k;

    exposed.y = y;

    if (import.meta.env.__OMNI) {
      x += k * (tx - x);

      exposed.x = x;
    }

    if (import.meta.env.__OMNI) {
      content.value!.style.transform = `translate3D(${-x}px, ${-y}px, 0)`
    }
    else {
      content.value!.style.transform = `translate3D(0, ${-y}px, 0)`
    }
  })
})

onUpdated(() => {
  // update observer with a new element
  resizeObserver.observe(content.value!)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  resizeObserver.disconnect()
})
</script>