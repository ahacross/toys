<template>
  <div class="width100">
    <input type="file" id="fileUpload" accept=".xlsx, .xls" @change="Upload" />
    <textarea id="fileDataObj" rows="10"  />
    <div v-if="excelDatas">
      <div class="center">
        <v-btn color="cyan" dark @click="makeTable">table 변환</v-btn>
      </div>
      <div v-if="viewTable">
        <TuiGrid  :columns="table.columns" :data="table.data" ></TuiGrid>
      </div>

<!--      <textarea id="resultQuery" rows="30" style="width:100%;"></textarea>-->
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import TuiGrid from '../components/tuiGrid'
import $ from 'jquery'
import { common } from '../js/Common'
import { mapGetters } from 'vuex'
import Constant from '../store/constant'

export default {
  name: 'XlsxParser',
  data () {
    return {
      excelDatas: false,
      viewTable: false,
      table: null
    }
  },
  methods: {
    ...mapGetters([Constant.DATA_GET]),
    Upload () {
      const that = this
      const fileUpload = document.getElementById('fileUpload')

      const regex = /^.+(.xls|.xlsx)$/
      if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) !== 'undefined') {
          const reader = new FileReader()

          if (reader.readAsBinaryString) {
            reader.onload = function (e) {
              that.ProcessExcel(e.target.result)
            }
            reader.readAsBinaryString(fileUpload.files[0])
          } else {
            reader.onload = function (e) {
              let data = ''
              const bytes = new Uint8Array(e.target.result)
              for (let i = 0; i < bytes.byteLength; i++) {
                data += String.fromCharCode(bytes[i])
              }
              console.log(data)
              // that.ProcessExcel(data)
            }
            reader.readAsArrayBuffer(fileUpload.files[0])
          }
        } else {
          alert('This browser does not support HTML5.')
        }
      } else {
        alert('Please upload a valid Excel file.')
      }
    },
    ProcessExcel (data) {
      // Read the Excel File data.
      const workbook = XLSX.read(data, {
        type: 'binary'
      })

      // Fetch the name of First Sheet.
      const firstSheet = workbook.SheetNames[0]

      // Read all rows from First Sheet into an JSON array.
      const excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet])

      this.excelDatas = excelRows
      $('#fileDataObj').val(JSON.stringify(excelRows))
      console.log(excelRows)
    },
    makeTable () {
      const datas = common.deepCopy(this.excelDatas)
      const columns = Object.keys(datas[0]).map(key => {
        return { title: key, name: key }
      })

      this.table = { columns: columns, data: datas, bodyHeight: 500 }
      this.viewTable = true
      setTimeout(() => {
        console.log(Constant.getterUnwrapFn(this.dataGet, 'tuiGrid.instance'))
      }, 500)
    }
  },
  components: {
    TuiGrid
  }
}
</script>

<style scoped>
textarea {
  background-color: white;
  border-radius: 5px;
  color: #333;
  width: 100%;
}
.width100 {
  width: 100%;
}
.center {
  text-align: center;
}
</style>
