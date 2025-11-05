import { CaseTransform, transformCase } from '@/components/calendar/utils/transform-case';

type WeekFormatBuilder = (date: Date) => number
enum WeekFormats {
  'iso' = 1,
  'us' = 7,
  'me' = 6
}

const weekFormatBuilder: Record<keyof typeof WeekFormats, WeekFormatBuilder> = {
  iso: (date) => {
    return ((date.getDay() + 6) % 7) + 1;
  },
  us: (date) => {
    return date.getDay() + 1;
  },
  me: (date) => {
    return ((date.getDay() + 1) % 7) + 1;
  }
}

type ViewFormats = 'long' | 'short' | 'narrow' | 'numeric' | '2-digit'

interface Day {
  year: number
  monthIndex: number,
  value: number
}

class Calendar {
  static getYearsRange(range: number, pivot: number = (new Date()).getFullYear()) {
    const result = new Map<number, number>()
    
    for (let i = 0; i < range * 2 + 1; i++) {
      result.set(i, pivot + (i - range))
    }
    
    return result
  }
  
  static getFirstDayOfWeek (locale: string): number {
    const intl = new Intl.Locale(locale);
    //@ts-ignore
    return intl.getWeekInfo?.().firstDay ?? 7;
  };
  
  static getWeekNames(locale: string, year: number, monthIndex: number, format: Extract<ViewFormats, 'long' | 'short' | 'narrow'> = 'long') {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
    
    const baseDate = new Date(year, monthIndex, 1);
    const { first } = this.getFirstAndLastWeekdays(year, monthIndex, weekFormatBuilder.iso)
    
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      return formatter.format(date);
    });
    
    const firstDay = this.getFirstDayOfWeek(locale);

    const pivot = firstDay - first;
    return new Map<number, string>([
      ...days.slice(pivot),
      ...days.slice(0, pivot),
    ].entries());
  };
  
  static getMonthNames(
    locale: string,
    year: number,
    format: ViewFormats = 'long',
    caseTransform: CaseTransform = 'capitalize'
  ) {
    const result = new Map<number, string>()
    const formatter = new Intl.DateTimeFormat(locale, { month: format })
    
    for (let i = 0; i < 12; i++) {
      const monthName = formatter.format(new Date(year, i))
      result.set(i, transformCase(monthName, caseTransform))
    }
    
    return result
  }
  
  static getNumberDaysInMonth(
    year: number,
    monthIndex: number
  ) {
    return new Date(year, monthIndex + 1, 0).getDate()
  }
  
  static getNumberWeeksInMonth(
    year: number,
    monthIndex: number,
    weekFormat: keyof typeof WeekFormats
  ) {
    const {last, first} = this.getFirstAndLastWeekdays(year, monthIndex, weekFormatBuilder[weekFormat]);
    const days = this.getNumberDaysInMonth(year, monthIndex);
    const firstDays = 7 - first + 1
    const overload = 1 - Math.floor((firstDays + last - 1) / 7)
    
    return Math.ceil(days / 7) + overload;
  }
  
  static getFirstAndLastWeekdays(
    year: number,
    monthIndex: number,
    formatBuilder: (date: Date) => number
  ) {
    const firstDate = new Date(year, monthIndex, 1);
    const lastDate = new Date(year, monthIndex + 1, 0);
    
    return { first: formatBuilder(firstDate), last: formatBuilder(lastDate) };
  }
  
  static getDays(
    year: number,
    monthIndex: number,
    weekFormat: keyof typeof WeekFormats
  ): Map<number, Day> {
    const result = new Map<number, Day>();
    const { first, last } = this.getFirstAndLastWeekdays(year, monthIndex, weekFormatBuilder[weekFormat])

    const numberWeeks = this.getNumberWeeksInMonth(year, monthIndex, weekFormat)
    const numberDays = this.getNumberDaysInMonth(year, monthIndex)

    const prevDays = this.getNumberDaysInMonth(year, monthIndex - 1);
    
    let tmpFirst = first - 1
    let tmpLast = (7 - last)
    let tmpDays = numberDays
    
    for (let i = 0; i < numberWeeks * 7; i++) {
      if (tmpFirst > 0) {
        result.set(i, { year: year, monthIndex: monthIndex - 1, value: prevDays - tmpFirst-- + 1 })
        continue;
      }
      if (tmpDays > 0) {
        result.set(i, { year: year, monthIndex: monthIndex, value: numberDays - tmpDays-- + 1 })
        continue;
      }
      if (tmpLast > 0) {
        result.set(i, { year: year, monthIndex: monthIndex + 1, value: (7 - last) - tmpLast-- + 1 })
      }
    }
    return result
  }
}

export { Calendar, WeekFormats, weekFormatBuilder, type Day }