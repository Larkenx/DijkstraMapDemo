<template>
  <v-container>
    <v-layout justify-center>
      <div id="canvas_container" />
    </v-layout>
  </v-container>
</template>

<script>
import { mountCanvas, drawDungeon } from '../assets/dijkstra.js'
export default {
	name: 'Demo',
	mounted() {
		mountCanvas()
		drawDungeon()
	}
}
</script>