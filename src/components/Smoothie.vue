<template lang="pug">
div(ref="wrap" @scroll="onScroll" :style="wrapStyle")
  div(:style="contentWrapStyle")
    div(ref="content" :style="contentStyle")
      slot
  div(ref="spacer")
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, onUpdated, reactive, shallowReactive, } from 'vue';

import type { StyleValue, CSSProperties } from 'vue';

// import { smoother } from '../b';

// https://easings.net/#easeOutCubic
// let curve = bezier(0.33, 1, 0.67, 1);

let props = withDefaults(
  defineProps<{
    weight: number
    // fn?(t: number): number;
    // clamp?: number
  }>(),
  {
    weight: 0.06
    // fn: x => x,
    // clamp: Infinity
  }
);

let wrap = $shallowRef<HTMLDivElement>();
let content = $shallowRef<HTMLDivElement>();
let spacer = $shallowRef<HTMLDivElement>();

let wrapStyle: StyleValue = { overflow: 'auto' } /*satisfies StyleValue*/;
let contentWrapStyle: StyleValue =
  import.meta.env.__OMNI ?
    // width: 0 is needed (because for some reason it's counted towards horizontal overflow when by any logic it should not) and obv it's a problem on firefox only...
    // well width breaks vertical omni
    ({ position: 'sticky', top: 0, left: 0 } /*satisfies StyleValue*/) :
    ({ position: 'sticky', top: 0 } /*satisfies StyleValue*/);


// @note to make resize observer to work yet prevent stupid ass firefox bug, it's better to set maxHeight instead of height, because with static dimensions resize observer won't ever update
// but this causes problems with initial scroll height calculation even on chrome omg
// alternative is to set this pos: abs
let contentStyle = ({
  willChange: 'transform',
  // width: '100%', // inherit parent size

  position: 'absolute',
  width: '100%'
  // left: 0,
  // right: 0

  // maxHeight: 0
} as CSSProperties
/*satisfies StyleValue*/);


let exposed = import.meta.env.__OMNI ?
  {
    el: $$(wrap),
    x: 0,
    y: 0
  } :
  {
    el: $$(wrap),
    y: 0
  };

defineExpose(exposed);

let af: number;

// let smooth = smoother(1000, (value) => {
//   if (import.meta.env.__OMNI) {
//     // content!.style.transform = `translate3D(${-x}px, ${-y}px, 0)`
//   }
//   else {
//     content!.style.transform = `translate3D(0, ${-value}px, 0)`

//     exposed.y = value;

//   }
// })

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
    } = wrap!)
  }
  else {
    ({
      scrollTop: ty
    } = wrap!)
  }

  // smooth(wrap!.scrollTop)
}

// don't forget this callback will be fired on old dom element removal, so technically it will update size twice, which shouldn't be a problem, though
const update = () => {
  console.log(
    'content', content!.scrollHeight, //
    'content wrap', content!.parentElement!.scrollHeight,
    'wrap', wrap!.scrollHeight
  )

  if (import.meta.env.__OMNI) {
    //#region firefox horizontal scroll width fix
    // the fix below works well, BUT resize observer won't trigger for the content element
    // so stash it for later

    // @note on firefox if sticky has any width, container's scroll width will always bug out and randomly add some extra width based on scroll speed.
    // one fix is to set sticky's width to 0 BUT in this case vertical scroll breaks,
    // as content has width: 100%
    // the solution is to set 

    let contentWrap = content!.parentElement!;

    contentWrap.style.width = '';
    // // @note this is required so we get a correct scrollWidth from the content wrap
    // content!.style.maxWidth = '';

    content!.style.minWidth = contentWrap.scrollWidth + 'px';
    content!.style.width = '';

    contentWrap.style.width = '0';

    //#endregion

    // update spacer
    spacer!.style.width = content!.scrollWidth + 'px';
    spacer!.style.height = content!.scrollHeight + 'px';
  }
  else {
    spacer!.style.height = content!.scrollHeight + 'px';
  }

  // applying height after first update didn't work, because there are multiple updates and there's no way to realize which one is the last
  // if (entries) {
  //   if (!contentStyle.maxHeight)
  //     contentStyle.maxHeight = '0'
  // }
}


let resizeObserver = new ResizeObserver(update)


onMounted(() => {
  // observing a child div because contentWrap element has fixed size, thus resize observer won't trigger and since slot can be a set of elements it's handy to have just one wrapping div
  resizeObserver.observe(content!)


  // in case of hard defined dimensions, resize observer won't trigger, so do init run
  update()



  // setTimeout(() => {
  //   updateSpacer()
  // }, 0);


  let aspect = 1000 / 60;
  let prev = performance.now();

  // let xc = { v: 0 }
  // let yc = { v: 0 }

  requestAnimationFrame(function cb() {
    af = requestAnimationFrame(cb);

    let now = performance.now();
    let dt = now - prev;
    prev = now;

    let k = props.weight * dt / aspect;

    // lerp = a + (b-a) * k = a + bk - ak = a(1-k) + bk
    y += k * (ty - y);
    // y = y * (1 - k) + ty * k;

    // damp
    // @todo use `keyof` in source
    // damp(yc, 'v', ty)
    // y = yc.v

    exposed.y = y;

    if (import.meta.env.__OMNI) {
      x += k * (tx - x);

      exposed.x = x;
    }

    if (import.meta.env.__OMNI) {
      content!.style.transform = `translate3D(${-x}px, ${-y}px, 0)`
    }
    else {
      content!.style.transform = `translate3D(0, ${-y}px, 0)`
    }
  })
})

onUpdated(() => {
  // update observer with a new element
  resizeObserver.observe(content!)
})

onUnmounted(() => {
  cancelAnimationFrame(af)
  resizeObserver.disconnect()
})
</script>