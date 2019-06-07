<template>
  <div>
    <v-toolbar flat>
      <v-list>
        <v-list-tile>
          <v-icon x-large>account_box</v-icon>로그인
        </v-list-tile>
      </v-list>
    </v-toolbar>

    <v-divider></v-divider>

    <v-list dense class="pt-0">
      <v-list-tile
        v-for="item in items"
        :key="item.title"
      @click="routerMove(item.routerName)">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import { common } from '@/js/Common'

export default {
  name: 'Menus',
  data () {
    return {
      items: [
        { title: 'Home', icon: 'dashboard', routerName: 'home' },
        { title: 'About', icon: 'question_answer', routerName: 'about' },
        { title: 'Xlsx', icon: 'question_answer', routerName: 'xlsx' },
        { title: '영화관(CGV)', icon: 'question_answer', routerName: 'cgv' }
      ],
      right: null
    }
  },
  methods: {
    routerMove (name) {
      common.moveRouter(this, { name })
    }
  }
}
</script>

<style scoped>

</style>
