<template>
  <HelloWorld />
</template>

<script>
import HelloWorld from '../components/HelloWorld'
import { request } from '../js/Common'
window.r = request

export default {
  components: { HelloWorld }
}
</script>
