<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup


import { onMounted, onUnmounted, shallowRef } from 'vue';

import { Pane } from 'tweakpane';

import { Smoothie, OmniSmoothie } from "../dist_lib"

// import Smoothie from './components/Smoothie.vue'
// const OmniSmoothie = Smoothie;


let scrollWeight = shallowRef(0.06);
let pane = new Pane();

let paneFolder = pane
  .addFolder({
    title: 'Main content scroll weight'
  })

paneFolder
  .addInput(scrollWeight, 'value', {
    min: 0,
    max: 0.5,
    step: 0.01
  })

let container = shallowRef<typeof Smoothie>();

onMounted(() => {
  let c = container.value!;
  paneFolder.addMonitor(c, 'y', {
    view: 'graph',
    min: 0,
    max: c.el.scrollHeight
  })

  console.log('Exposed object:', c)
})



onUnmounted(() => { pane.dispose() })

let images = [
  'alice-donovan-rouse-tMHAmxLyzvA-unsplash.jpg',
  'anthony-delanoix-VDS8ASoyzjw-unsplash.jpg',
  'kentaro-toma-30AwPGSEdsM-unsplash.jpg',
  'lance-anderson-PcCQgQ6KGkI-unsplash.jpg',
  'osman-rana-xhpMNieqBwA-unsplash.jpg',
].map(name => import.meta.env.BASE_URL + 'images/' + name)

let paragraphs = [
  'Sit amet mattis vulputate enim nulla aliquet. Facilisis leo vel fringilla est ullamcorper. Enim sit amet venenatis urna cursus eget nunc scelerisque viverra. Cursus turpis massa tincidunt dui. Tristique risus nec feugiat in fermentum posuere urna. Pharetra vel turpis nunc eget lorem dolor sed viverra.',

  'Quisque non tellus orci ac auctor augue mauris augue. Nisi quis eleifend quam adipiscing vitae proin sagittis. Varius sit amet mattis vulputate enim nulla aliquet. Egestas erat imperdiet sed euismod nisi porta. Leo duis ut diam quam nulla porttitor. Id volutpat lacus laoreet non curabitur gravida arcu ac tortor. Neque sodales ut etiam sit amet nisl purus. Eget gravida cum sociis natoque penatibus.',

  'Ipsum faucibus vitae aliquet nec ullamcorper sit. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Ullamcorper a lacus vestibulum sed arcu non odio. Sem integer vitae justo eget magna fermentum iaculis. Cras tincidunt lobortis feugiat vivamus at. Mi ipsum faucibus vitae aliquet nec. Dui id ornare arcu odio ut sem nulla pharetra. Volutpat consequat mauris nunc congue nisi vitae.',

  'Fermentum odio eu feugiat pretium nibh. Accumsan tortor posuere ac ut consequat semper. Nisl suscipit adipiscing bibendum est ultricies. Tempus egestas sed sed risus pretium quam vulputate dignissim. Dolor purus non enim praesent. Vel orci porta non pulvinar. Venenatis cras sed felis eget velit aliquet. Sed tempus urna et pharetra.',

  'Eget nulla facilisi etiam dignissim diam quis enim. Ac tincidunt vitae semper quis lectus nulla at. Facilisi nullam vehicula ipsum a arcu cursus vitae congue. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat. Adipiscing enim eu turpis egestas pretium aenean pharetra. Aliquet nec ullamcorper sit amet.',

  'Proin gravida hendrerit lectus a. Mi bibendum neque egestas congue quisque egestas diam in. Consectetur lorem donec massa sapien faucibus et molestie. Ultricies mi eget mauris pharetra. Sapien eget mi proin sed libero enim sed faucibus. Commodo odio aenean sed adipiscing diam donec. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Proin gravida hendrerit lectus a. Mi bibendum neque egestas congue quisque egestas diam in.'
]

let longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Iaculis at erat pellentesque adipiscing commodo. Consequat nisl vel pretium lectus quam id. Duis tristique sollicitudin nibh sit amet commodo. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Integer quis auctor elit sed vulputate mi. At risus viverra adipiscing at in tellus integer. Mollis nunc sed id semper risus in hendrerit gravida rutrum. Senectus et netus et malesuada fames ac turpis. Amet porttitor eget dolor morbi non arcu risus. Molestie a iaculis at erat pellentesque adipiscing commodo elit. Mus mauris vitae ultricies leo integer malesuada nunc vel risus. Ut venenatis tellus in metus vulputate eu. Elementum integer enim neque volutpat ac tincidunt vitae semper quis. Arcu cursus vitae congue mauris. Quam vulputate dignissim suspendisse in est ante in nibh mauris. Cursus turpis massa tincidunt dui ut ornare lectus sit. Magna fringilla urna porttitor rhoncus dolor purus. Ut consequat semper viverra nam libero justo laoreet sit. Enim facilisis gravida neque convallis. Turpis egestas integer eget aliquet nibh praesent tristique magna sit. Et tortor at risus viverra. Vitae aliquet nec ullamcorper sit. Volutpat blandit aliquam etiam erat. Mauris vitae ultricies leo integer malesuada nunc vel. Urna condimentum mattis pellentesque id. Dui id ornare arcu odio ut sem nulla pharetra. Ut pharetra sit amet aliquam id. Eget magna fermentum iaculis eu non diam phasellus vestibulum. Egestas pretium aenean pharetra magna. Arcu non odio euismod lacinia at. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Cursus vitae congue mauris rhoncus aenean. In arcu cursus euismod quis viverra nibh cras. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Pretium lectus quam id leo in vitae turpis massa. Eget est lorem ipsum dolor. Nunc scelerisque viverra mauris in aliquam sem fringilla. Egestas purus viverra accumsan in nisl nisi scelerisque eu. Gravida neque convallis a cras semper."
</script>

<template lang="pug">

Smoothie.container(:weight="scrollWeight" ref="container")
  .content-wrap
    a#top(href="#bottom") {{ 'Go to the #bottom' }}
    .content
      Smoothie.nested-container(:weight="0.1")
        div
          span(:style="{color: 'orangered'}") NESTED CONTAINER 
          | {{longText }}
      OmniSmoothie.nested-container(:weight="0.3")
        div
          span(:style="{color: 'orangered'}") NESTED VERTICAL WITH OMNI FLAVOR 
          | {{longText }}
      OmniSmoothie.horizontal-container
        div(:style="{ width: '200rem' }") 
          span(:style="{color: 'orangered'}") HORIZONTAL SCROLL 
          | {{longText }}
      OmniSmoothie.bidirectional-container
        div(:style="{ width: '75rem', background: '#6d3300' }") 
          span(:style="{color: 'orangered'}") BIDERECTIONAL SCROLL 
          | {{longText }}
      template(v-for="(image, index) in images")
        img(:src="image" :style="{ gridColumn: index % 2 + 1, gridRow: index + 4 }")
        div(:style="{ gridColumn: (index + 1) % 2 + 1, gridRow: index + 4 }") {{ paragraphs[index] }}
    a#bottom(href="#top") {{ 'Go to the #top' }}
</template>

<style>
/* IMPORTANT */
html,
body,
#app {
  /* pass down scroll handling to content wrap by setting concrete height */
  height: 100%;
}

.container {
  /* firefox breaks if container is flex... */
  /* display: flex;
  justify-content: center; */

  /* margin: auto; */

  /* important when using borders, padding */
  /* box-sizing: border-box;
  padding: 3rem; */

  /* ! better not style container at all, only set dimensions */

  /* and setting height of container itself */
  height: 100%;
}

.content-wrap {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;
  padding: 3rem;
}

.content {
  display: grid;
  gap: 1rem 3rem;
  grid-template-columns: 1fr 1fr;

  max-width: 1000px;

  align-items: center;

}

.nested-container {
  height: 20rem;
}

.horizontal-container {
  width: 100%;

  grid-row: 2;
  grid-column: 1 / 3;
}

.bidirectional-container {
  height: 10rem;
  width: 100%;

  grid-row: 3;
  grid-column: 1 / 3;
}

a {
  display: block;
  margin: 1rem 0;
}

img {
  width: 100%;
  object-fit: cover;
}
</style>
