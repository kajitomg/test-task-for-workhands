import { ref, computed, onMounted, onUnmounted, Ref } from 'vue';
import { Calendar, Day, WeekFormats } from '../utils/calendar';

interface CalendarOptions {
  range: number
}

const useCalendar = (
  initLocale: string = 'ru-RU',
  initDate?: string,
  options: CalendarOptions = {
    range: 100
  }
) => {
  const timeoutId = ref<number>()
  
  const locale = ref(initLocale)
  const range = ref(options.range)
  
  const date = ref(initDate ? new Date(initDate) : new Date())
  const today = ref(initDate ? new Date(initDate) : new Date())
  const selected = ref<Date>()
  
  const firstDay = computed(() => Calendar.getFirstDayOfWeek(locale.value))
  const format = computed(() => (WeekFormats[firstDay.value] || 'iso') as keyof typeof WeekFormats)
  
  const years = computed(() => Calendar.getYearsRange(range.value, date.value.getFullYear()))
  const months = computed(() => Calendar.getMonthNames(locale.value, date.value.getFullYear()))
  const weeks = computed(() => Calendar.getWeekNames(locale.value, date.value.getFullYear(), date.value.getMonth(), 'short'))
  const days = computed(() => Calendar.getDays(date.value.getFullYear(), date.value.getMonth(), format.value))
  
  const handleNextMonth = () => {
    date.value = new Date(date.value.getFullYear(),date.value.getMonth() + 1)
  }
  const handlePrevMonth = () => {
    date.value = new Date(date.value.getFullYear(),date.value.getMonth() - 1)
  }
  const handleSelectDay = (item: Day) => {
    selected.value = new Date(item.year,item.monthIndex, item.value)
    return selected.value
  }
  
  const scheduleNextUpdate = (ref: Ref<Date, Date>, update: number | 'midnight')=> {
    const now = new Date()
    let timeout = update
    
    if (update === 'midnight') {
      const tomorrow = new Date(now)
      tomorrow.setHours(24, 0, 0, 0)
      timeout = tomorrow.getTime() - now.getTime()
    }
    
    return setTimeout(() => {
      ref.value = new Date()
      scheduleNextUpdate(ref, update)
      //@ts-ignore
    }, timeout)
  }
  
  if (!initDate) {
    onMounted(() => {
      timeoutId.value = scheduleNextUpdate(today, 'midnight')
    })
    
    onUnmounted(() => {
      clearTimeout(timeoutId.value)
    })
  }
  
  return { locale, date, today, selected, years, months, weeks, days, handleNextMonth, handlePrevMonth, handleSelectDay }
}

export { useCalendar }