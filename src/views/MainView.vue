<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue'
import { uniq as _uniq, map as _map, filter as _filter, find as _find } from 'lodash'

interface LooseObject {
  [key: string]: any
}

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'IT'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'IT'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'Marketing'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'Controlling'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'HR'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'HR'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'HR'
  }
]

const groupingOptions = new Map<string, string>([
  ['date', 'Date'],
  ['name', 'Name'],
  ['address', 'Address'],
  ['department', 'Department']
])

const destictValuesOfColumn = computed(() => {
  if (!groupByColumnKey.value) return []
  return _uniq(_map(tableData, groupByColumnKey.value))
})

const groupByColumnKey = ref()
const groupedData: Ref<{ group: string; rows: any[] }[]> = ref([])

watch(groupByColumnKey, (val: string) => {
  for (const destinctValue of destictValuesOfColumn.value) {
    const filterObj: LooseObject = {}
    filterObj[val] = destinctValue
    let filteredData = _filter(tableData, filterObj)
    groupedData.value.push({
      group: destinctValue,
      rows: filteredData
    })
  }
})

const getRowsOfGroup = (groupKey: string) => {
  const data = _find(groupedData.value, { group: groupKey })
  if (data) {
    return data.rows
  }
  return []
}
</script>

<template>
  <main>
    <el-row class="mt-10">
      <el-col :xs="4" :md="4" :lg="4" :xl="4"></el-col>
      <el-col :xs="16" :md="16" :lg="16" :xl="16">
        <div class="flex h-[3rem] items-center bg-red-500">
          <el-select
            v-if="!groupByColumnKey"
            v-model="groupByColumnKey"
            class="ml-2"
            placeholder="Group By"
            size="small"
          >
            <el-option
              v-for="(item, index) in groupingOptions"
              :key="index"
              :value="item[0]"
              :label="item[1]"
            />
          </el-select>
          <div v-if="groupByColumnKey" class="ml-2 flex items-center">
            <span class="mr-1 text-[.9rem] text-white">Grouped By:</span>
            <el-tag type="info" closable disable-transitions @close="groupByColumnKey = ''">{{
              groupingOptions.get(groupByColumnKey)
            }}</el-tag>
          </div>
          <el-divider direction="vertical"></el-divider>
        </div>
        <el-table v-if="!groupByColumnKey" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
          <el-table-column prop="department" label="Department" />
        </el-table>

        <section v-for="(val, index) in destictValuesOfColumn" :key="index">
          <div v-if="groupByColumnKey">
            <div class="mt-3 h-[3rem] bg-green-500 pl-2">
              <h3 class="flex h-full items-center text-[.9rem] font-bold text-white">
                {{ val }}
              </h3>
            </div>
            <el-table :data="getRowsOfGroup(val)" stripe style="width: 100%">
              <el-table-column prop="date" label="Date" width="180" />
              <el-table-column prop="name" label="Name" width="180" />
              <el-table-column prop="address" label="Address" />
              <el-table-column prop="department" label="Department" />
            </el-table>
          </div>
        </section>
      </el-col>
      <el-col :xs="4" :md="4" :lg="4" :xl="4"></el-col>
    </el-row>
  </main>
</template>
