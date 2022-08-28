<template lang="pug">
div(ref="wrap" @scroll="onScroll")
  div(ref="content" :style="{ position: 'sticky', height: 0, willChange: 'transform' }")
    slot
  div(ref="spacer")
</template>

<script lang="ts" setup>
import { onMounted, onUpdated, shallowRef } from 'vue';

let wrap = shallowRef<HTMLDivElement>();
let spacer = shallowRef<HTMLDivElement>();
let content = shallowRef<HTMLDivElement>();

let raf;

const onScroll = (e: UIEvent) => {
  let { scrollLeft: x, scrollTop: y } = wrap.value!;

  // @todo transition

  console.log('onscroll', x, y)

  content.value!.style.transform = `translate3D(${x}, ${y}, 0)`
}

// don't forget this callback will be fired on old dom element removal, so technically it will update size twice, which shouldn't be a problem
let resizeObserver = new ResizeObserver(() => {
  console.log('rs obs cb', content.value)

  spacer.value!.style.height = content.value!.scrollHeight + 'px';
})

onMounted(() => {
  console.log('on mounted')
  resizeObserver.observe(content.value!)
})

onUpdated(() => {
  console.log('on updated', content.value)


  resizeObserver.observe(content.value!)
})
</script>