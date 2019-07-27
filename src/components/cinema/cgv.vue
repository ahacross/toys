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
    <div class="cgvFlex">
      <div id="cinemaDiv" style="background-color: #fdfcf0;width: 100%; height: 75vh; overflow-y: auto;"></div>
    </div>

  </div>
</template>
<script>
import { request, common, $, days } from '@/js/Common/'
import cinemas from './cgvCinema.json'
import Multiselect from 'vue-multiselect'
window.request = request

export default {
  data () {
    return {
      cinemas,
      cinemaList: null,
      regionSelect: null,
      cinemaSelect: [],
      targets: []
    }
  },
  created () {
    this.initTargets()
  },
  mounted () {
    this.firstIframe()
  },
  methods: {
    cgv_queryStr (code, date) {
      return `areacode=01&theaterCode=${code}&date=${date || days().format('YYYYMMDD')}`
    },
    cgv_iframe (code, date) {
      return `http://www.cgv.co.kr/common/showtimes/iframeTheater.aspx?${this.cgv_queryStr(code, date)}`
    },
    changeIframe (e) {
      this.changeCinemaDiv(this.cgv_iframe(e.target.dataset.code))
      $('.tabDiv').find('.active').removeClass('active')
      $(e.target).addClass('active')
    },
    firstIframe () {
      this.changeCinemaDiv(this.cgv_iframe(this.targets[0].code))
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
      this.targets = common.getData('cgvTabs') || [{ 'name': '왕십리', 'code': '0074' }, { 'name': '용산', 'code': '0013' }]
    },
    removeTarget (ev) {
      const code = $(ev.target).parent().data('code')
      const otherTargets = this.targets.filter(target => target.code !== code)
      common.setData('cgvTabs', otherTargets)
      this.targets = otherTargets
    },
    changeCinemaDiv (url) {
      request().openApi().datas({ url }).run(res => {
        $('#cinemaDiv').html(`<div class="showtimes-wrap">${res.$('.showtimes-wrap').html()}</div>`)

        $('#cinemaDiv .item').on('click', 'a', e => {
          e.preventDefault()
          let code, date

          e.currentTarget.href.split('?')[1].split('&').map(queryStr => {
            const queryArr = queryStr.split('=')
            if (queryArr[0] === 'theatercode') {
              code = queryArr[1]
            } else if (queryArr[0] === 'date') {
              date = queryArr[1]
            }
          })

          this.changeCinemaDiv(this.cgv_iframe(code, date))
        })
        $('#cinemaDiv .info-timetable').on('click', 'a', e => {
          e.preventDefault()
        })
      })
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
    width: 50%;
    height: 76vh;
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
<style>
  /* Display:block */
  .sect-showtimes .info-timetable a {display:block;}

   .slider {overflow:hidden; position:relative; z-index:1; width:100%; height:100%;}
  .slider > button[type='button'] {position:absolute; background-image:url(../../assets/cgv/sprite_btn.png); background-repeat:no-repeat; font:0/0 a; zoom:1;}
  .slider > .btn-prev,
  .slider > .btn-next,
  .slider > .btn-prev.dim,
  .slider > .btn-next.dim {overflow:hidden; top:50%; width:26px; height:52px; text-indent:100%; white-space:nowrap; margin-top:-26px;}
  .slider > .btn-prev {left:19px; background-position:0 -97px;}
  .slider > .btn-prev.dim {background-position:0 -155px;}
  .slider > .btn-next {right:19px; background-position:-30px -97px;}
  .slider > .btn-next.dim {background-position:-30px -155px;}
  /* .slider ul {clear:both;} */
  /* .slider li - item으로 대체 */

  .slider .item-wrap {display:inline-block; float:left;}
  *+html .slider .item-wrap {display:inline;}
  .slider button[type='button'] {z-index:20;}
  .slider button[type='button'].btn-pause,
  .slider button[type='button'].btn-play,
  .slider .item-wrap > button[type='button'] {overflow:hidden; position:absolute; top:415px; width:13px; height:13px; background:url(../../assets/cgv/sprite_icon.png) no-repeat 0 -90px; text-indent:100%; white-space:nowrap;}
  .slider .item-wrap button[type='button'].on {background-position:-16px -90px;}
  .slider .item-wrap > .item {position:absolute; z-index:5; text-align:center;}
  .slider .item-wrap.on > .item {z-index:10;}
  .slider .item-wrap.move > .item {z-index:15;}
  .slider .item-wrap.on > .item > a {display:block;}
  .slider .item-wrap > .item .ico-play {top:50%; left:50%; width:66px; height:66px; margin:-33px 0 0 -33px; background-position: -121px -21px;}

  /* .slider .item-wrap > button[type='button'] {display:none;} */
  .slider button[type='button'].btn-play {left:534px; background-position:-32px -90px;}
  .slider button[type='button'].btn-pause {left:551px; background-position:-48px -90px;}

  /* ===========================================
     Showtimes Module
  ============================================ */
  .showtimes-wrap {width:800px;}

  /* Showtimes Common Css */
  .showtimes-wrap .early {padding-left:18px; background-position:0 -176px;}
  .showtimes-wrap .midnight {padding-left:13px; background-position:0 -195px;}
  .showtimes-wrap .early, .showtimes-wrap .midnight, .showtimes-wrap .ico_script, .sect-city li > a, /* .sect-guide .descri-timezone p, */
  .sect-showtimes .col-theater {font-weight:500;}
  .showtimes-wrap .early, .showtimes-wrap .midnight
  {background-image:url(../../assets/cgv/sprite_icon.png); background-repeat:no-repeat;}
  .showtimes-wrap .early,
  .showtimes-wrap .midnight,
  .showtimes-wrap .early,
  .showtimes-wrap .midnight,
  .showtimes-wrap .ico_script,
  .sect-showtimes .info-timetable a > em {color:#333;}
  .sect-showtimes .info-timetable a > span {color:#2275a4; font-weight:500;}
  .sect-schedule li > .day a {width:77px; height:48px;}
  .sect-city li > a, .sect-schedule li > .day a {display:block;}
  .sect-schedule li:first-child, .sect-guide .descri-timezone li:first-child {margin-left:0;}
  .showtimes-wrap .ico_script > em {width:10px;height:10px;display:inline-block;*display:inline;border:2px solid #ff6c00;vertical-align:middle;margin-right:4px;margin-bottom:1px;}
  .showtimes-wrap .ico_script > span{}

  .showtimes-wrap.eng .sect-guide {padding-left:0;}
  .showtimes-wrap.eng .descri-timezone,

  /* 일 선택 */
  .showtimes-wrap .sect-schedule {width:100%; border-top:3px solid #241d1e;}
  .showtimes-wrap .slider {position:relative; /*width:640px;*/ height:48px; padding:12px 80px;}
  .showtimes-wrap .slider .item-wrap {overflow:hidden; height:48px;}
  .showtimes-wrap .slider .item-wrap > .item {position:static;}
  .showtimes-wrap .slider > button[type='button'] {position:absolute; top:27px; width:54px; height:19px; margin:0; font:0/0 a; background-image:url(../../assets/cgv/sprite_btn.png); background-repeat:no-repeat; zoom:1;}
  .showtimes-wrap .slider > button[type='button'].btn-prev {left:0px; background-position:-117px -174px;}
  .showtimes-wrap .slider > button[type='button'].btn-next {right:0px; background-position:-117px -155px;}
  .showtimes-wrap .slider > button[type='button'].btn-prev.dim {background-position:-61px -155px;}
  .showtimes-wrap .slider > button[type='button'].btn-next.dim {background-position:-61px -174px;}
  .showtimes-wrap .slider li {float:left; margin-left:2px;}
  .showtimes-wrap .slider li > .day {position:relative; width:77px; height:48px; color:#717171;}
  .showtimes-wrap .slider li > .day span, .showtimes-wrap .slider li > .day em, .showtimes-wrap .slider li > .day strong {position:absolute; font-weight:300; font-size:11px;}
  .showtimes-wrap .slider li > .day span {top:14px; left:8px;}
  .showtimes-wrap .slider li > .day em {top:28px; left:15px;}
  .showtimes-wrap .slider li > .day strong {top:8px; left:31px; font-family:verdana, sans-serif; font-size:32px; line-height:32px;}
  .showtimes-wrap .slider li.on > .day {background:#fff url(../../assets/cgv/sprite_btn.png) no-repeat -61px -97px;}
  .showtimes-wrap .slider li.on > .day > a {height:48px;}
  *+html .showtimes-wrap .slider li.on > .day > a {cursor:pointer;}
  .showtimes-wrap .slider li.on > .day span, .showtimes-wrap .slider li.on > .day em, .showtimes-wrap .slider li.on > .day strong {color:#000;}

  /* 조조,심야,안내 */
  .sect-guide {position:relative; height:37px; padding:0 0 0 13px;  border-top:2px solid #474746; border-bottom:1px solid #474746; line-height:37px;}
  .sect-guide .descri-timezone ul {float:left;}
  .sect-guide .descri-timezone ul:after {clear:none;}
  .sect-guide .descri-timezone li, .descri-info > ul  > li {float:left; position:relative; margin-left:15px;}
  .sect-guide .descri-timezone p {float:left; margin-left:20px; color:#794624;}

  /* 영화관 및 일정 리스트 */
  .sect-showtimes {}
  .sect-showtimes > ul > li {padding:40px 0; border-top:1px solid #474746;}
  .sect-showtimes > ul > li.nodata {text-align:center;}
  .sect-showtimes > ul > li.nodata strong {color:#222; font-size:13px;}
  .sect-showtimes > ul > li:first-child {border-top:0 none;}
  .sect-showtimes > ul > li:after {content:''; clear:both; display:block;}
  .sect-showtimes > ul > li {zoom:1;}
  .sect-showtimes .col-theater, .sect-showtimes .col-times {float:left;}
  .sect-showtimes .col-theater {width:97px; padding:14px 0 0 14px; color:#000; font-size:16px; line-height:1.2em;}
  .sect-showtimes .col-times {position:relative; margin-left:14px;padding-left: 30px;padding-top: 5px;}
  .sect-showtimes .col-times > .info-movie {vertical-align:middle;}
  .sect-showtimes .col-times > .info-movie strong {margin-right:5px; color:#000; font-size:16px;}

  .sect-showtimes .col-times > .info-movie .round { line-height:16px; vertical-align:top;}
  .sect-showtimes .col-times > .info-movie .round.red{ font-family:Verdana, Geneva, sans-serif; font-weight:bold;}
  .sect-showtimes .col-times .ico-grade {top:-2px; left:-1px;}

  /* 영화관 정보 */
  .sect-showtimes .type-hall {margin-top:10px; padding-top:10px;}
  .sect-showtimes .type-hall:after, .sect-showtimes .info-hall:after {content:''; clear:both; display:block;}
  .sect-showtimes .type-hall, .sect-showtimes .info-hall {zoom:1;}
  .sect-showtimes .type-hall:first-child {margin-top:0; border-top:0 none;}
  .sect-showtimes .info-hall {clear:both; margin-bottom:5px; padding-left:16px; background:url(../../assets/cgv/ico_arrow03.png) no-repeat 2px 50%;}
  .sect-showtimes .info-hall li {float:left; padding:0 8px; background:url(../../assets/cgv/bg_li_vline.gif) no-repeat 0 50%; color:#333; font-weight:500; font-size:11px; line-height:17px;}
  .sect-showtimes .info-hall li:first-child {padding-left:0; background-image:none;}

  /* Screen Type */
  .sect-showtimes .type-hall .screentype {display:inline-block;}
  .sect-showtimes .type-hall .screentype span,
  .sect-showtimes .type-hall .screentype a {width:82px; height:17px; background:url(../../assets/cgv/sprite_screentype02.png) no-repeat 0 0; font:0/0 a; vertical-align:middle;}
  .sect-showtimes .type-hall .screentype .gold {background-position:-99px 0;}
  .sect-showtimes .type-hall .screentype .imax {background-position:-99px -18px;}
  .sect-showtimes .type-hall .screentype .forDX {background-position:-99px -36px;}
  .sect-showtimes .type-hall .screentype .cine {background-position:-99px -126px;}
  .sect-showtimes .type-hall .screentype .collage {background-position:-99px -235px;}
  .sect-showtimes .type-hall .screentype .soundX {background-position:-99px -144px;}
  .sect-showtimes .type-hall .screentype .arthouse {background-position:-99px -272px;}
  .sect-showtimes .type-hall .screentype .sphereX {background-position:-99px -291px;}
  .sect-showtimes .type-hall .screentype .tempurcinema {background-position:-99px -310px;}
  .sect-showtimes .type-hall .screentype .screenx {background-position:-99px -162px;}
  .sect-showtimes .type-hall .screentype .skybox {background-position:-99px -367px;}

  .sect-showtimes .info-timetable em, .sect-showtimes .info-timetable span {color:#888;}
  .sect-showtimes .info-timetable em {display:block; font-family:verdana, sans-serif; font-size:12px; font-weight:bold;}
  .sect-showtimes .info-timetable span {display:inline-block; font-size:11px;}

  .sect-showtimes .info-timetable > ul > li {float:left; position:relative; width:70px; height:44px; margin-right:-1px; padding-top:5px; border:1px solid #cbcabe; line-height:1.4; text-align:center;}
  .sect-showtimes .info-timetable > ul > li > a > .timeset {display:none; position:absolute; top:-1px; left:0; z-index:100;}
  .sect-showtimes .info-timetable > ul > li.on > a > .timeset,
  .sect-showtimes .info-timetable > ul > li > a:hover > .timeset,
  .sect-showtimes .info-timetable > ul > li > a:focus > .timeset {display:block;}
  .sect-showtimes .info-timetable > ul > li .timeset > .start-time {display:inline-block; width:68px; height:39px; border:2px solid #333;}
  .sect-showtimes .info-timetable > ul > li .timeset > .end-time {display:inline-block; position:absolute; top:-30px; left:4px; width:63px; height:24px; background-color:#fff; border:1px solid #333; color:#333; font-weight:500; font-size:12px; line-height:26px; text-align:center;}
  .sect-showtimes .info-timetable > ul > li .timeset > .end-time > i {position:absolute; left:50%; bottom:-6px; width:10px; height:6px; margin-left:-5px; background:url(../../assets/cgv/ico_endtime_arrow.png) no-repeat 50% 0;}
  /* 영문자막 */
  .sect-showtimes .info-timetable > ul > li.script {border:2px solid #ff6c00;}
  .sect-showtimes .info-timetable > ul > li.script:hover {border:2px solid #333;}
  .sect-showtimes .info-timetable > ul > li.script > a > .timeset {left:-1px}
  .sect-showtimes .info-timetable > ul > li .timeset > .start-time {border:none}

  /* 큐레이터 상영일정 */
  .sect-schedule .slider {overflow:visible; position:relative; height:48px; padding:12px 0;}
  .sect-schedule .slider:after {display:block; content:'';}
  .sect-schedule .slider .item-wrap {height:48px; margin:0 80px;}

  #cgv ol, #cgv ul {
    list-style: none;
    padding: 0;
  }

  #cgv a {
    color: inherit;
    text-decoration: none;
  }

  #cgv .screentype span,#cgv .screentype a {
    display: inline-block;
  }

  #cgv .ico-grade{ display:block; position:absolute; left:5px; top:5px; width:21px; height:21px; background: url(../../assets/cgv/sprite_icon.png) no-repeat;font:0/0 a;zoom:1;}
  #cgv .ico-grade.grade-all{ background-position:-30px 0;}/* 전체 */
  #cgv .ico-grade.grade-12{ background-position:-51px 0;}/* 12세 */
  #cgv .ico-grade.grade-15{ background-position:-72px 0;}/* 15세 */
  #cgv .ico-grade.grade-19{ background-position:-93px 0;}/* 청불 */
  #cgv .ico-grade.grade-none{ background-position:-114px 0;}/* 미정 */

  #cgv div[class^="sect-"] {
    clear: both;
    zoom: 1;
  }

  #cgv .round > * {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 5px 0;
  }

  #cgv .round, #cgv .round > * {
    display: inline-block;
    position: relative;
  }

  #cgv em {
    font-style: normal;
  }

  #cgv .round {
    line-height: 23px;
    font-weight: 500;
    font-size: 12px;
    text-align: center;
    vertical-align: middle;
  }

  #cgv .info-movie {
    font-style: normal;
    line-height: 1.2;
    color: #666;
    font-weight: 300;
  }

  #cgv .info-movie {
    font-size: 13px;
  }

  #cgv body {
    font-size: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
    word-break: break-all;
  }

  #cgv .hidden {
    font: 0/0 a;
    height: 0;
    overflow: hidden;
    position: absolute;
    visibility: hidden;
    width: 0;
    zoom: 1;
  }

  #cgv .round ,#cgv .round > *{ display:inline-block; position:relative;  }
  #cgv .round {line-height:23px; font-weight:500; font-size:12px; text-align:center; vertical-align:middle; background-color: inherit!important;}
  #cgv .round > *{ box-sizing:border-box; -moz-box-sizing:border-box; width:100%; height:100%; padding:0 5px 0;} /* 20140620 Del padding-top:2px !important; */
  *+html #cgv .round{ white-space:nowrap; }
  *+html #cgv .round > *{  border:none !important; padding:0; cursor:pointer; }
  #cgv .round:before, #cgv .round:after , #cgv .round > *:before, #cgv .round > *:after{ content:''; display:block; position:absolute; width:5px; height:5px; background:#fdfcf0 url('../../assets/cgv/sprite_corner01.png') no-repeat;}
  #cgv .round.red{ border:2px solid #e71a0f; color:#e71a0f; }
  #cgv .round.red:before{ left:-2px; top:-2px; background-position:0 0;}
  #cgv .round.red:after{ left:-2px; bottom:-2px; background-position: 0 -5px;}
  #cgv .round.red > *:before{ right:-2px; top:-2px; background-position:-5px 0;}
  #cgv .round.red > *:after{ right:-2px; bottom:-2px; background-position:-5px -5px;}
  #cgv .round.black{ border:2px solid #333333; color:#333333; }
  #cgv .round.black:before{ left:-2px; top:-2px; background-position:-10px 0;}
  #cgv .round.black:after{ left:-2px; bottom:-2px; background-position: -10px -5px;}
  #cgv .round.black > *:before{ right:-2px; top:-2px; background-position:-15px 0;}
  #cgv .round.black > *:after{ right:-2px; bottom:-2px; background-position:-15px -5px;}
  #cgv .round.lightblue{ border:2px solid #3e82a4; color:#3e82a4; }
  #cgv .round.lightblue:before{ left:-2px; top:-2px; background-position:-20px 0;}
  #cgv .round.lightblue:after{ left:-2px; bottom:-2px; background-position: -20px -5px;}
  #cgv .round.lightblue > *:before{ right:-2px; top:-2px; background-position:-25px 0;}
  #cgv .round.lightblue > *:after{ right:-2px; bottom:-2px; background-position:-25px -5px;}
  #cgv .round.brown{ border:2px solid #a16423; color:#a16423; }
  #cgv .round.brown:before{ left:-2px; top:-2px; background-position:-30px 0;}
  #cgv .round.brown:after{ left:-2px; bottom:-2px; background-position: -30px -5px;}
  #cgv .round.brown > *:before{ right:-2px; top:-2px; background-position:-35px 0;}
  #cgv .round.brown > *:after{ right:-2px; bottom:-2px; background-position:-35px -5px;}
  #cgv .round.gray{ border:2px solid #7b7b7b; color:#7b7b7b; }
  #cgv .round.gray:before{ left:-2px; top:-2px; background-position:-40px 0;}
  #cgv .round.gray:after{ left:-2px; bottom:-2px; background-position: -40px -5px;}
  #cgv .round.gray > *:before{ right:-2px; top:-2px; background-position:-45px 0;}
  #cgv .round.gray > *:after{ right:-2px; bottom:-2px; background-position:-45px -5px;}

  #cgv .round.white{ border:2px solid #fff; color:#fff; }
  #cgv .round.white:before{ left:-2px; top:-2px; background-position:-90px 0;}
  #cgv .round.white:after{ left:-2px; bottom:-2px; background-position: -90px -5px;}
  #cgv .round.white > *:before{ right:-2px; top:-2px; background-position:-95px 0;}
  #cgv .round.white > *:after{ right:-2px; bottom:-2px; background-position:-95px -5px;}
</style>
