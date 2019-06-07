<template>
  <div id="app">
    <v-app id="sandbox" :dark="dark">
      <v-navigation-drawer
        v-model="primaryDrawer.model"
        :permanent="primaryDrawer.type === 'permanent'"
        :temporary="primaryDrawer.type === 'temporary'"
        :clipped="primaryDrawer.clipped"
        :floating="primaryDrawer.floating"
        :mini-variant="primaryDrawer.mini"
        absolute
        overflow
        app
      >
        <Menus />
      </v-navigation-drawer>
      <v-toolbar :clipped-left="primaryDrawer.clipped" app absolute>
        <v-toolbar-side-icon
          v-if="primaryDrawer.type !== 'permanent'"
          @click.stop="primaryDrawer.model = !primaryDrawer.model"
        ></v-toolbar-side-icon>
        <v-toolbar-title>장난감들...</v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <v-layout align-center justify-center>
            <router-view />
          </v-layout>
        </v-container>
      </v-content>
      <v-footer v-if="footer.inset" :inset="footer.inset" app>
<!--        <span class="px-3">&copy; {{ new Date().getFullYear() }}</span>-->
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import Menus from '@/components/Menus'
export default {
  data: () => ({
    dark: true,
    drawers: ['Default (no property)', 'Permanent', 'Temporary'],
    primaryDrawer: {
      model: null,
      type: 'temporary',
      clipped: false,
      floating: false,
      mini: false
    },
    footer: {
      inset: false
    }
  }),
  components: { Menus }
}
</script>

<style>
  html {
    overflow: hidden;
    margin: 0 auto;
  }
</style>
