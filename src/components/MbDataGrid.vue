<script setup lang="ts">
import { type PropType, type Ref } from 'vue'
import { defineProps, computed, ref, onMounted, watch } from 'vue'
import {
  uniq as _uniq,
  map as _map,
  filter as _filter,
  find as _find,
  uniqBy as _uniqBy,
  forEach as _forEach,
  values as _values,
  minBy as _minBy
} from 'lodash'
import { rowContextKey } from 'element-plus'

interface LooseObject {
  [key: string]: any
}

const props = defineProps({
  data: {
    type: Array as PropType<LooseObject[]>,
    required: true
  },
  columnMetaData: {
    type: Array as PropType<LooseObject[]>,
    required: true
  },
  selectedColums: {
    type: Array as PropType<LooseObject[]>,
    required: true
  }
})

onMounted(() => {
  selectedColums.value = props.selectedColums.map((col) => col.key)
})

const selectedColums = ref<string[]>([])

const groupingOptions = computed<Map<string, string>>(() => {
  const groupableColumns = props.columnMetaData.filter((col) => col.groupable === true)
  return new Map(
    groupableColumns.map((col) => {
      return [col.key, col.label]
    })
  )
})

const keyToHumanReadable = computed<Map<string, string>>(() => {
  return new Map(
    props.columnMetaData.map((col) => {
      return [col.key, col.label]
    })
  )
})

const dynamicKeys = computed(() => {
  if (props.columnMetaData.length <= 0) return []
  return Object.keys(props.data[0]).map((key) => {
    return {
      key,
      label: keyToHumanReadable.value.get(key) ? keyToHumanReadable.value.get(key) : key
    }
  })
})
const visibleCols = computed(() => {
  if (dynamicKeys.value.length <= 0) return []
  return props.columnMetaData.filter((key) => {
    return _values(selectedColums.value).some((col) => col === key.key)
  })
})

const distinctValuesOfColumn = computed(() => {
  if (!groupByColumnKey.value) return []
  const columnType = typeof props.data[0][groupByColumnKey.value]
  const columnIsDate = props.data[0][groupByColumnKey.value] instanceof Date
  if (columnType === 'object' && !columnIsDate) {
    const objectsOfRows = _map(props.data, groupByColumnKey.value)
    return _uniqBy(objectsOfRows, (obj: { tbllabel: any }) => obj.tbllabel)
  }
  // type string
  return _uniq(_map(props.data, groupByColumnKey.value))
})

const groupByColumnKey = ref()
const groupedData: Ref<{ group: string; rows: any[] }[]> = ref([])

watch(groupByColumnKey, (val: string) => {
  for (const distinctValue of distinctValuesOfColumn.value) {
    const filterObj: LooseObject = {}

    let filteredData: any[] = []
    if (typeof distinctValue === 'object' && !(distinctValue instanceof Date)) {
      const objectsOfRow = props.data.map((row) => {
        return {
          tbllabel: row[groupByColumnKey.value].tbllabel,
          row
        }
      })
      filteredData = _filter(objectsOfRow, ['tbllabel', distinctValue.tbllabel])
    } else {
      filterObj[val] = distinctValue
      filteredData = _filter(props.data, filterObj)
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
    if (typeof groupKey === 'object' && !(groupKey instanceof Date)) {
      // @ts-ignore
      return data.rows.map((row) => row.row)
    } else {
      // @ts-ignore
      return data.rows
    }
  }
  return []
}

const selectedAggregation: Ref<'count' | 'sum' | 'avg' | 'min' | 'max' | undefined> = ref()
const selectedAggregationColumn: Ref<string | undefined> = ref()

const sumOfColumn = (columnKey: string, groupValue: string | object | undefined = undefined) => {
  if (!groupByColumnKey.value) {
    return props.data.reduce((acc: number, row: LooseObject) => acc + row[columnKey], 0)
  } else {
    if (!groupValue) return 0
    const rows = getRowsOfGroup(groupValue) as LooseObject[]
    console.log(rows)
    return rows.reduce((acc: number, row: LooseObject) => acc + row[columnKey], 0)
  }
}

const avgOfColumn = (columnKey: string, groupValue: string | object | undefined = undefined) => {
  if (!groupByColumnKey.value) {
    return (
      props.data.reduce((acc: number, row: LooseObject) => acc + row[columnKey], 0) /
      props.data.length
    )
  } else {
    if (!groupValue) return 0
    const rows = getRowsOfGroup(groupValue) as LooseObject[]
    return rows.reduce((acc: number, row: LooseObject) => acc + row[columnKey], 0) / rows.length
  }
}

const minOfColumn = (columnKey: string) => {
  if (!groupByColumnKey.value) {
    const minRow = _minBy(props.data, (r) => r[columnKey])
    return minRow ? minRow[columnKey] : 0
  } else {
    const rows = getRowsOfGroup(groupByColumnKey.value) as LooseObject[]
    const minRow = _minBy(rows, (r) => r[columnKey])
    return minRow ? minRow[columnKey] : 0
  }
}

const countOfColumn = (groupValue: string | object | undefined = undefined) => {
  if (!groupByColumnKey.value) {
    return props.data.length
  } else {
    console.log('zte')
    if (!groupValue) return 0
    const rows = getRowsOfGroup(groupValue) as LooseObject[]
    console.log(rows)
    return rows.length
  }
}

watch(selectedAggregationColumn, (val) => {
  if (selectedAggregation.value === 'sum' && val) {
    sumOfColumn(val)
  }
  if (selectedAggregation.value === 'avg' && val) {
    avgOfColumn(val)
  }
  if (selectedAggregation.value === 'min' && val) {
    minOfColumn(val)
  }
})

watch(selectedAggregation, (val) => {
  if (val === 'count') {
    countOfColumn()
  }
})
</script>

<template>
  <el-row class="mt-10">
    <el-col :xs="4" :md="4" :lg="4" :xl="4"></el-col>
    <el-col :xs="16" :md="16" :lg="16" :xl="16">
      <div class="flex h-[2.6rem] items-center rounded-md bg-black">
        <el-select
          v-model="groupByColumnKey"
          clearable
          class="ml-2"
          placeholder="Group By"
          size="small"
          filterable
          no-match-text="No matching grouping options"
        >
          <el-option
            v-for="(item, index) in groupingOptions"
            :key="index"
            :value="item[0]"
            :label="item[1]"
          />
        </el-select>
        <el-divider direction="vertical"></el-divider>
        <el-popover placement="bottom" :width="590" trigger="hover">
          <template #reference>
            <el-button class="mr-2" size="small">Columns</el-button>
          </template>
          <el-transfer
            :data="dynamicKeys"
            v-model="selectedColums"
            :titles="['Hidden', 'Shown']"
            filterable
            filter-placeholder="Search Columns"
          />
        </el-popover>
        <el-select
          v-model="selectedAggregation"
          clearable
          placeholder="Aggregate"
          size="small"
          class="mr-2 w-[6rem]"
        >
          <el-option label="COUNT" value="count" />
          <el-option label="SUM" value="sum" />
          <el-option label="AVG" value="avg" />
          <el-option label="MIN" value="min" />
          <el-option label="MAX" value="max" />
        </el-select>
        <el-select
          v-model="selectedAggregationColumn"
          v-if="
            selectedAggregation !== 'count' &&
            selectedAggregation !== undefined &&
            selectedAggregation
          "
          clearable
          filterable
          :placeholder="selectedAggregation?.toUpperCase() + '(column)'"
          no-data-text="No compatible column"
          no-match-text="No matching compatible column"
          size="small"
        >
          <el-option
            v-for="(column, index) in visibleCols.filter((col) => col.type === 'number')"
            :key="index"
            :value="column.key"
            :label="column.label"
          />
        </el-select>
      </div>
      <el-table
        v-if="
          !groupByColumnKey &&
          !(selectedAggregation === 'count') &&
          !(selectedAggregation && selectedAggregationColumn)
        "
        :data="data"
        stripe
        border
        style="width: 100%"
        class="basic-fade-in mt-3"
      >
        <el-table-column
          v-for="(cd, index) in visibleCols"
          :key="index"
          :prop="cd.key"
          :label="cd.label"
          show-overflow-tooltip
        >
          <template v-if="cd.type === 'object'" #default="{ row }">
            {{ row.status.tbllabel }}
          </template>
        </el-table-column>
      </el-table>
      <!--TABLE HIDING AGGREGATIONS (MAIN)-->
      <section id="aggr-of-main-tbl">
        <el-text
          v-if="
            selectedAggregationColumn &&
            selectedAggregation &&
            selectedAggregation === 'sum' &&
            !groupByColumnKey
          "
        >
          <b>SUM(</b>{{ selectedAggregationColumn }}<b>)</b>
          {{ sumOfColumn(selectedAggregationColumn) }}
        </el-text>
        <el-text
          v-if="
            selectedAggregationColumn &&
            selectedAggregation &&
            selectedAggregation === 'avg' &&
            !groupByColumnKey
          "
        >
          <b>AVG(</b>{{ selectedAggregationColumn }}<b>)</b>
          {{ avgOfColumn(selectedAggregationColumn).toFixed(2) }}
        </el-text>
        <el-text v-if="selectedAggregation && selectedAggregation === 'count' && !groupByColumnKey">
          <b>COUNT(*)</b>
          {{ countOfColumn() }}
        </el-text>
      </section>

      <section v-for="(val, index) in distinctValuesOfColumn" :key="index">
        <div v-if="groupByColumnKey" class="basic-fade-in">
          <div class="mt-3 h-[2.3rem] rounded-t-md border border-gray-800 bg-yellow-500 pl-2">
            <h3
              v-if="typeof val === 'object' && !(val instanceof Date)"
              class="flex h-full items-center text-[0.9rem] font-bold text-white"
            >
              {{
                //@ts-ignore
                val.tbllabel
              }}
            </h3>
            <h3 v-else class="flex h-full items-center text-[0.9rem] font-bold text-white">
              {{
                //@ts-ignore
                val
              }}
            </h3>
          </div>
          <section id="aggr-of-group">
            <el-text
              v-if="
                selectedAggregationColumn &&
                selectedAggregation &&
                selectedAggregation === 'sum' &&
                groupByColumnKey
              "
            >
              <b>SUM(</b>{{ selectedAggregationColumn }}<b>)</b>
              {{ sumOfColumn(selectedAggregationColumn, val) }}
            </el-text>
            <el-text
              v-if="
                selectedAggregationColumn &&
                selectedAggregation &&
                selectedAggregation === 'avg' &&
                groupByColumnKey
              "
            >
              <b>AVG(</b>{{ selectedAggregationColumn }}<b>)</b>
              {{ avgOfColumn(selectedAggregationColumn, val).toFixed(2) }}
            </el-text>
            <el-text
              v-if="selectedAggregation && selectedAggregation === 'count' && groupByColumnKey"
            >
              <b
                >COUNT({{ keyToHumanReadable.get(groupByColumnKey) }} EQUALS "{{
                  typeof val === 'string' ? val : val instanceof Date ? val.toISOString() : val
                }}")</b
              >
              {{ countOfColumn(val) }}
            </el-text>
          </section>
          <el-table :data="getRowsOfGroup(val)" stripe border style="width: 100%">
            <el-table-column
              v-for="(cd, index) in visibleCols"
              :key="index"
              :prop="cd.key"
              :label="cd.label"
              show-overflow-tooltip
            >
              <template v-if="cd.type === 'object'" #default="{ row }">
                {{ row.status.tbllabel }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
    </el-col>
    <el-col :xs="4" :md="4" :lg="4" :xl="4"></el-col>
  </el-row>
</template>
