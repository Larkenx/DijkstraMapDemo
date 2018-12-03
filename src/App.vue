<template>
  <v-app
    dark
    class="black"
    id="app"
  >
    <Demo />
  </v-app>
</template>

<script>
import Demo from './components/Demo.vue'

export default {
	name: 'app',
	components: {
		Demo
	}
}
</script>

<style lang="css">
black {
	background-color: black;
}
</style