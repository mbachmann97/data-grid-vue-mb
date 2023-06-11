<script setup lang="ts">
import { reactive } from 'vue'
import MbDataGrid from '@/components/MbDataGrid.vue'

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const data = [
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
    },
    amount: 1000
  },
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
    },
    amount: 2000
  },
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
    },
    amount: 3000
  },
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
    },
    amount: 4000
  },
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
    },
    amount: 5000
  },
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
    },
    amount: 6000
  },
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
    },
    amount: 8000
  }
]

const columnMetaData = reactive([
  {
    key: 'date',
    label: 'Date',
    type: 'string',
    sortable: true,
    groupable: true,
    sum: true
  },
  {
    key: 'dateTest',
    label: 'Actual Date Test',
    type: 'Date',
    sortable: true,
    groupable: true,
    sum: true
  },
  {
    key: 'name',
    label: 'Name',
    type: 'string',
    sortable: true,
    groupable: true,
    sum: true
  },
  {
    key: 'address',
    label: 'Address',
    type: 'string',
    sortable: true,
    groupable: true,
    sum: true
  },
  {
    key: 'department',
    label: 'Department',
    type: 'string',
    sortable: true,
    groupable: true,
    sum: true
  },
  {
    key: 'status',
    label: 'Status',
    type: 'object',
    sortable: true,
    groupable: true,
    sum: true
  },
  {
    key: 'amount',
    label: 'Amount',
    type: 'number',
    sortable: true,
    groupable: true,
    sum: true
  }
])
</script>

<template>
  <main>
    <mb-data-grid
      :data="data"
      :column-meta-data="columnMetaData"
      :selected-colums="columnMetaData"
    />
  </main>
</template>

<style scoped></style>
