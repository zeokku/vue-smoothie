<template lang="pug">
div(ref="wrap" @scroll="onScroll" :style="{ overflow: 'auto' }")
  div(:style="{ position: 'sticky', top: 0, height: 0 }")
    div(ref="content" :style="{ willChange: 'transform' }")
      slot
  div(ref="spacer")
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, onUpdated, shallowRef } from 'vue';

let props = withDefaults(
  defineProps<{
    // the bigger, the faster transition
    weight?: number,
    // @todo limit maximum transition speed (dx/dt) 
    // clamp?: number
  }>(),
  { weight: 0.06 }
);

let wrap = shallowRef<HTMLDivElement>();
let spacer = shallowRef<HTMLDivElement>();
let content = shallowRef<HTMLDivElement>();

let raf: number;

// target y
// smooth y
let
  ty = 0,
  y = 0;

const onScroll = () => ({ scrollTop: ty } = wrap.value!)

// don't forget this callback will be fired on old dom element removal, so technically it will update size twice, which shouldn't be a problem, though
function updateSpacer() {
  spacer.value!.style.height = content.value!.scrollHeight + 'px';
}

let resizeObserver = new ResizeObserver(updateSpacer)

onMounted(() => {
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

    y += props.weight * dt / aspect * (ty - y);

    content.value!.style.transform = `translate3D(0, ${-y}px, 0)`
  })
})

onUpdated(() => {
  // update observer with a new element
  resizeObserver.observe(content.value!)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
})
</script>