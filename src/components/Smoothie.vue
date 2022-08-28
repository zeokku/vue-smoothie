<template lang="pug">
div(ref="wrap" @scroll="onScroll" :style="{ overflow: 'auto' }")
  div(:style="{ position: 'sticky', top: 0, height: 0, willChange: 'transform' }")
    div(ref="content")
      slot
  div(ref="spacer")
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, onUpdated, shallowRef } from 'vue';

let props = withDefaults(defineProps<{
  // the bigger, the faster transition
  weight?: number,
  // limit maximum transition speed (dx/dt) 
  clamp?: number
}>(), { weight: 0.06 });

let wrap = shallowRef<HTMLDivElement>();
let spacer = shallowRef<HTMLDivElement>();
let content = shallowRef<HTMLDivElement>();

let raf: number;

// target x, y
// smooth x, y
let
  ty = 0,
  y = 0;

const onScroll = (e: UIEvent) => {
  ({
    scrollTop: ty
  } = wrap.value!)
}

// don't forget this callback will be fired on old dom element removal, so technically it will update size twice, which shouldn't be a problem
function updateSpacer() {
  spacer.value!.style.height = content.value!.scrollHeight + 'px';
}

let resizeObserver = new ResizeObserver(() => {
  console.log('rs obs cb', content.value)

  updateSpacer()
})

onMounted(() => {
  console.log('on mounted')
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
  console.log('on updated', content.value)

  resizeObserver.observe(content.value!)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
})
</script>