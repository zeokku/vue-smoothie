<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Smoothie from './components/Smoothie.vue'

let images = [
  'alice-donovan-rouse-tMHAmxLyzvA-unsplash.jpg',
  'anthony-delanoix-VDS8ASoyzjw-unsplash.jpg',
  'kentaro-toma-30AwPGSEdsM-unsplash.jpg',
  'lance-anderson-PcCQgQ6KGkI-unsplash.jpg',
  'osman-rana-xhpMNieqBwA-unsplash.jpg',
]

let paragraphs = [
  'Sit amet mattis vulputate enim nulla aliquet. Facilisis leo vel fringilla est ullamcorper. Enim sit amet venenatis urna cursus eget nunc scelerisque viverra. Cursus turpis massa tincidunt dui. Tristique risus nec feugiat in fermentum posuere urna. Pharetra vel turpis nunc eget lorem dolor sed viverra.',

  'Quisque non tellus orci ac auctor augue mauris augue. Nisi quis eleifend quam adipiscing vitae proin sagittis. Varius sit amet mattis vulputate enim nulla aliquet. Egestas erat imperdiet sed euismod nisi porta. Leo duis ut diam quam nulla porttitor. Id volutpat lacus laoreet non curabitur gravida arcu ac tortor. Neque sodales ut etiam sit amet nisl purus. Eget gravida cum sociis natoque penatibus.',

  'Ipsum faucibus vitae aliquet nec ullamcorper sit. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Ullamcorper a lacus vestibulum sed arcu non odio. Sem integer vitae justo eget magna fermentum iaculis. Cras tincidunt lobortis feugiat vivamus at. Mi ipsum faucibus vitae aliquet nec. Dui id ornare arcu odio ut sem nulla pharetra. Volutpat consequat mauris nunc congue nisi vitae.',

  'Fermentum odio eu feugiat pretium nibh. Accumsan tortor posuere ac ut consequat semper. Nisl suscipit adipiscing bibendum est ultricies. Tempus egestas sed sed risus pretium quam vulputate dignissim. Dolor purus non enim praesent. Vel orci porta non pulvinar. Venenatis cras sed felis eget velit aliquet. Sed tempus urna et pharetra.',

  'Eget nulla facilisi etiam dignissim diam quis enim. Ac tincidunt vitae semper quis lectus nulla at. Facilisi nullam vehicula ipsum a arcu cursus vitae congue. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat. Adipiscing enim eu turpis egestas pretium aenean pharetra. Aliquet nec ullamcorper sit amet.',

  'Proin gravida hendrerit lectus a. Mi bibendum neque egestas congue quisque egestas diam in. Consectetur lorem donec massa sapien faucibus et molestie. Ultricies mi eget mauris pharetra. Sapien eget mi proin sed libero enim sed faucibus. Commodo odio aenean sed adipiscing diam donec. Tempor orci eu lobortis elementum nibh tellus molestie nunc. Proin gravida hendrerit lectus a. Mi bibendum neque egestas congue quisque egestas diam in.'
]
</script>

<template lang="pug">
Smoothie
  template(v-for="(image, index) in images")
    img(:src="'/images/' + image" lazy)
    p {{ paragraphs[index] }}

</template>

<style scoped>
</style>
