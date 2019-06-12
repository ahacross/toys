<template>
  <div id="grid"></div>
</template>

<script>
import { mapActions } from 'vuex'
import Constant from '../store/constant'
import Grid from 'tui-grid'

export default {
  name: 'tuiGrid',
  props: ['columns', 'data', 'bodyHeight'],
  mounted () {
    this.initTable()
    Grid.applyTheme('striped')
  },
  methods: {
    ...mapActions([Constant.DATA_SET]),
    initTable () {
      const params = {
        el: document.getElementById('grid'),
        // rowHeight: 35,
        // rowHeaders: ['rowNum'],
        // header: {
        //   height: 40
        // },
        columns: this.columns,
        data: this.data,
        scrollX: true,
        scrollY: true,
        bodyHeight: 500
      }

      this.instance = new Grid(params)
      setTimeout(() => {
        this.instance.refreshLayout()
      }, 1000)

      Constant.actionWrapFn(this.dataSet, 'tuiGrid', { instance: this.instance, Grid })
    }
  }
}
</script>
<style src="tui-grid/dist/tui-grid.min.css"></style>
