<template>
  <v-app>
    <v-main style="background-color: #202124;">
      <MainList/>
    </v-main>
  </v-app>
</template>

<script>
import MainList from './components/MainList.vue'

export default {
  name: 'App',

  components: {
    MainList,
  },

  data: () => ({
    //
  }),
}
</script>
