<template>
  <v-app>
    <v-main style="background-color: rgb(50, 50, 50);">
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
