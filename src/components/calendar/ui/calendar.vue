<script setup lang="ts">

import { Button } from '@/components/button';
import { useCalendar } from '@/components/calendar/composables/use-calendar';
import { cn } from '@/utils/cn';

const calendar = useCalendar();
</script>

<template>
  <div
      role="application"
      aria-label="Календарь"
      class='p-2 w-65 border-1 border-gray-400'
  >
    <header
        class='flex justify-between items-center'
        role="group"
        aria-label="Навигация по месяцам"
    >
      <Button
          type="button"
          class='aspect-square h-full'
          @click="calendar.handlePrevMonth"
          aria-label="Предыдущий месяц"
      >🞀</Button>
      <div
          class='semi-bold'
      >{{ calendar.months.value.get(calendar.date.value.getMonth()) }} {{ calendar.date.value.getFullYear() }}</div>
      <Button
          type="button"
          class='aspect-square h-full'
          @click="calendar.handleNextMonth"
          aria-label="Следующий месяц"
      >🞂</Button>
    </header>
    <ul
        class='grid grid-cols-7'
    >
      <li
          v-for='item in calendar.weeks.value.values()' :key='item'
          class='flex aspect-square items-center justify-center'
          :aria-label="item"
      >
        {{ item }}
      </li>
        <Button
            as='li'
            :class='cn(
          calendar.today.value.getDate() === item.value && calendar.today.value.getMonth() === item.monthIndex && calendar.today.value.getFullYear() === item.year && "border-1 border-blue-400",
              calendar.selected.value?.getDate() === item.value && calendar.selected.value?.getMonth() === item.monthIndex && calendar.selected.value?.getFullYear() === item.year && "border-1 border-gray-400",
              "aspect-square"
            )'
            v-for='item in calendar.days.value.values()' :key='item.value.toString() + item.monthIndex.toString()'
            @click="() => {
              calendar.handleSelectDay(item)
              console.log(new Date(calendar.date.value.getFullYear(), item.monthIndex, item.value).toLocaleDateString(calendar.locale.value, {dateStyle: 'full'}))
            }"
            :aria-disabled="calendar.date.value.getMonth() !== item.monthIndex"
        >
          {{ item.value }}
        </Button>
    </ul>
  </div>
</template>

<style scoped>
</style>