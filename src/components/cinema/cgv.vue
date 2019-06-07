<template>
  <div id="cgv">
    <div class="cgvFlex">
      <div class="cgvFlex4 paddingRight10">
        <label class="typo__label">지역 선택</label>
        <multiselect v-model="regionSelect" :options="cinemas" track-by="RegionName" label="RegionName" :searchable="false" placeholder="지역 선택!!" @select="changeRegion">
          <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.RegionName }}</strong></template>
        </multiselect>
      </div>
      <div v-if="cinemaList" class="cgvFlex7 paddingRight10">
        <label class="typo__label">영화관 선택</label>
        <multiselect :options="cinemaList" v-model="cinemaSelect" track-by="TheaterName" label="TheaterName" :multiple="true" :searchable="false" :close-on-select="false"></multiselect>
      </div>
      <div class="cgvFlex1 cgvFlex divCC">
        <v-btn color="success" @click="addTabBtn">탭 추가</v-btn>
      </div>
    </div>
    <div class="tabDiv">
      <div class="tab" v-for="(t, key) in targets" :key="key" @click="changeIframe" :data-code="t.code">
        {{ t.name }}<i class="material-icons clearIcon" @click.stop="removeTarget">clear</i>
      </div>
    </div>
    <iframe v-show="iframeSrc" :src="iframeSrc" ></iframe>
  </div>
</template>
<script>
import { common, request, $, _ } from '@/js/Common'
import cinemas from './cgvCinema.json'
import Multiselect from 'vue-multiselect'

export default {
  data () {
    return {
      cinemas,
      cinemaList: null,
      regionSelect: null,
      cinemaSelect: [],
      targets: [],
      iframeSrc: null
    }
  },
  created () {
    this.initTargets()
  },
  mounted () {
    window.request = request
    this.firstIframe()
  },
  methods: {
    openApi (url) {
      console.log(url)
      request().url('https://ahacross.me/apis/openApi').method('post').datas({ url }).run((res) => {
        // console.log(res);
      })
    },
    makeUrl (area, code) {
      return `http://www.cgv.co.kr/theaters/?areacode=${area}&theaterCode=${code}&date=${new Date().format('yyyyMMdd')}`
    },
    cgv_queryStr (code) {
      return `areacode=01&theaterCode=${code}&date=${new Date().format('yyyyMMdd')}`
    },
    cgv_iframe (code) {
      return `http://www.cgv.co.kr/common/showtimes/iframeTheater.aspx?${this.cgv_queryStr(code)}`
    },
    changeIframe (e) {
      this.iframeSrc = this.cgv_iframe(e.target.dataset.code)
      $('.tabDiv').find('.active').removeClass('active')
      $(e.target).addClass('active')
    },
    firstIframe () {
      this.iframeSrc = this.cgv_iframe(this.targets[0].code)
      $('.tabDiv .tab').first().addClass('active')
    },
    changeRegion (obj) {
      this.cinemaList = obj.AreaTheaterDetailList
      this.targets.map(target => {
        const usedCinema = this.cinemaList.filter(cine => cine.TheaterCode === target.code)
        usedCinema.map(cine => cine.$isDisabled = true)
      })
      this.cinemaSelect = []
    },
    clearAll () {
      this.cinemaSelect = []
    },
    addTabBtn () {
      const datas = this.cinemaSelect.map((cine) => {
        return {
          name: cine.TheaterName.substring(3),
          code: cine.TheaterCode
        }
      })
      this.targets.push(...datas)
      common.setData('cgvTabs', this.targets)
      this.clearAll()
      this.regionSelect = null
    },
    initTargets () {
      this.targets = common.getData('cgvTabs')
    },
    removeTarget (ev) {
      const code = $(ev.target).parent().data('code')
      const otherTargets = this.targets.filter(target => target.code !== code)
      common.setData('cgvTabs', otherTargets)
      this.targets = otherTargets
    }
  },
  components: {
    Multiselect
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
  iframe {
    width: 99.5%;
    height: 84%;
    overflow: scroll;
    border: none;
  }
  .tabDiv {
    display: flex;
    margin: 10px 0;
    cursor: pointer;
  }
  .tabDiv .tab {
    padding: 5px 10px;
  }
  .tabDiv .tab.active {
    background-color: skyblue;
    border-radius: 5px;
  }
  .tabDiv .clearIcon {
    font-size: 16px;
    position: relative;
    right: -4px;
    top: -3px;
  }
  #cgv {
    width: 100%;
    height: 100vh;
  }
  .v-list__tile__title {
    color: #86d808;
  }
  .cgvFlexBtn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .v-select--chips{
    padding-top: 6px;
  }
  .multiselect__tags {
    height: 40px;
  }
  .paddingRight10 {
    padding-right: 10px;
  }
  .cgvFlex {
    display: flex;
  }
  .cgvFlex1 {
    flex: 1;
  }
  .cgvFlex4 {
    flex: 4;
  }
  .cgvFlex7 {
    flex: 7;
  }
  .divCC {
    justify-content: center;
    align-items: center;
  }
</style>
