<template>
  <v-container>
    <v-layout justify-center>
      <div id="canvas_container" />
    </v-layout>
  </v-container>
</template>

<script>
import { mountCanvas, render, init } from '../assets/dijkstra.js'
export default {
	name: 'Demo',
	mounted() {
		init()
		mountCanvas()
		render()
	}
}
</script>