<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue'
import {
  uniq as _uniq,
  map as _map,
  filter as _filter,
  find as _find,
  uniqBy as _uniqBy,
  forEach as _forEach
} from 'lodash'

interface LooseObject {
  [key: string]: any
}

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const tableData = [
  {
    date: '2016-05-03',
    dateTest: randomDate(new Date(2012, 0, 1), new Date()),
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'IT',
    status: {
      id: 1,
      name: 'Active',
      tbllabel: 'Active'
    }
  } as LooseObject,
  {
    date: '2016-05-02',
    dateTest: randomDate(new Date(2012, 0, 1), new Date()),
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'IT',
    status: {
      id: 1,
      name: 'Active',
      tbllabel: 'Active'
    }
  } as LooseObject,
  {
    date: '2016-05-04',
    dateTest: randomDate(new Date(2012, 0, 1), new Date()),
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'Marketing',
    status: {
      id: 1,
      name: 'Active',
      tbllabel: 'Active'
    }
  } as LooseObject,
  {
    date: '2016-05-01',
    dateTest: randomDate(new Date(2012, 0, 1), new Date()),
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'Controlling',
    status: {
      id: 1,
      name: 'Active',
      tbllabel: 'Active'
    }
  } as LooseObject,
  {
    date: '2016-05-01',
    dateTest: randomDate(new Date(2012, 0, 1), new Date()),
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'HR',
    status: {
      id: 2,
      name: 'Done',
      tbllabel: 'Done'
    }
  } as LooseObject,
  {
    date: '2016-05-01',
    dateTest: randomDate(new Date(2012, 0, 1), new Date()),
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'HR',
    status: {
      id: 2,
      name: 'Done',
      tbllabel: 'Done'
    }
  } as LooseObject,
  {
    date: '2016-05-01',
    dateTest: randomDate(new Date(2012, 0, 1), new Date()),
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    department: 'HR',
    status: {
      id: 2,
      name: 'Done',
      tbllabel: 'Done'
    }
  } as LooseObject
]

const groupingOptions = new Map<string, string>([
  ['date', 'Date'],
  ['dateTest', 'Actual Date Test'],
  ['name', 'Name'],
  ['address', 'Address'],
  ['department', 'Department'],
  ['status', 'Status']
])

const distinctValuesOfColumn = computed(() => {
  if (!groupByColumnKey.value) return []
  const columnType = typeof tableData[0][groupByColumnKey.value]
  if (columnType === 'object') {
    const objectsOfRows = _map(tableData, groupByColumnKey.value)
    return _uniqBy(objectsOfRows, (obj: { tbllabel: any }) => obj.tbllabel)
  }
  // type string
  return _uniq(_map(tableData, groupByColumnKey.value))
})

const groupByColumnKey = ref()
const groupedData: Ref<{ group: string; rows: any[] }[]> = ref([])

watch(groupByColumnKey, (val: string) => {
  for (const distinctValue of distinctValuesOfColumn.value) {
    const filterObj: LooseObject = {}

    let filteredData: any[] = []
    if (typeof distinctValue === 'object') {
      const objectsOfRow = tableData.map((row) => {
        return {
          tbllabel: row[groupByColumnKey.value].tbllabel,
          row
        }
      })
      filteredData = _filter(objectsOfRow, ['tbllabel', distinctValue.tbllabel])
    } else {
      filterObj[val] = distinctValue
      filteredData = _filter(tableData, filterObj)
    }

    groupedData.value.push({
      group: distinctValue,
      rows: filteredData
    })
  }
})

const getRowsOfGroup = (groupKey: string | object) => {
  const data = _find(groupedData.value, { group: groupKey })
  if (data) {
    if (typeof groupKey === 'object') {
      // @ts-ignore
      return _map(data.rows, 'row')
    } else {
      // @ts-ignore
      return data.rows
    }
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
        <el-table v-if="!groupByColumnKey" :data="tableData" stripe border style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="dateTest" label="Actual Date Test" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
          <el-table-column prop="department" label="Department" />
          <el-table-column prop="status" label="Status">
            <template #default="{ row }">
              {{ row.status.tbllabel }}
            </template>
          </el-table-column>
        </el-table>

        <section v-for="(val, index) in distinctValuesOfColumn" :key="index">
          <div v-if="groupByColumnKey">
            <div class="mt-3 h-[3rem] bg-green-500 pl-2">
              <h3
                v-if="typeof val === 'object'"
                class="flex h-full items-center text-[.9rem] font-bold text-white"
              >
                {{
                  //@ts-ignore
                  val.tbllabel
                }}
              </h3>
              <h3 v-else class="flex h-full items-center text-[.9rem] font-bold text-white">
                {{
                  //@ts-ignore
                  val
                }}
              </h3>
            </div>
            <el-table :data="getRowsOfGroup(val)" stripe border style="width: 100%">
              <el-table-column prop="date" label="Date" width="180" />
              <el-table-column prop="dateTest" label="Actual Date Test" width="180" />
              <el-table-column prop="name" label="Name" width="180" />
              <el-table-column prop="address" label="Address" />
              <el-table-column prop="department" label="Department" />
              <el-table-column prop="status" label="Status">
                <template #default="{ row }">
                  {{ row.status.tbllabel }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </section>
      </el-col>
      <el-col :xs="4" :md="4" :lg="4" :xl="4"></el-col>
    </el-row>
  </main>
</template>
