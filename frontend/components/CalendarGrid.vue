<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import type { Post, CalendarDay } from '~/types'

const props = defineProps<{
  posts: Post[]
}>()

const emit = defineEmits<{
  (e: 'selectDate', date: Date): void
  (e: 'selectPost', post: Post): void
}>()

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const monthLabel = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed((): CalendarDay[] => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days: CalendarDay[] = []
  const current = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    const date = new Date(current)
    const isCurrentMonth = date.getMonth() === month
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    const dayPosts = props.posts.filter((post) => {
      const postDate = new Date(post.scheduledAt || post.publishedAt || post.createdAt)
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      )
    })

    days.push({ date, isCurrentMonth, isToday, posts: dayPosts })
    current.setDate(current.getDate() + 1)
  }

  return days
})

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const goToToday = () => {
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
}

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    draft: 'bg-gray-400',
    scheduled: 'bg-amber-400',
    published: 'bg-green-400',
    failed: 'bg-red-400',
  }
  return colors[status] || 'bg-gray-400'
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <h2 class="text-lg font-semibold text-gray-900">{{ monthLabel }}</h2>
        <button
          class="text-xs text-brand-600 hover:text-brand-700 font-medium"
          @click="goToToday"
        >
          Today
        </button>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          @click="prevMonth"
        >
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        <button
          class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          @click="nextMonth"
        >
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Day Headers -->
    <div class="grid grid-cols-7 border-b border-gray-200">
      <div
        v-for="day in dayHeaders"
        :key="day"
        class="px-3 py-2 text-xs font-semibold text-gray-500 text-center uppercase tracking-wider"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="min-h-[100px] border-b border-r border-gray-100 p-2 cursor-pointer hover:bg-gray-50 transition-all duration-200"
        :class="{
          'bg-gray-50/50': !day.isCurrentMonth,
          'bg-brand-50/30': day.isToday,
        }"
        @click="emit('selectDate', day.date)"
      >
        <div class="flex items-center justify-between mb-1">
          <span
            class="text-sm font-medium"
            :class="{
              'text-gray-300': !day.isCurrentMonth,
              'text-gray-900': day.isCurrentMonth && !day.isToday,
              'text-white bg-brand-500 w-7 h-7 flex items-center justify-center rounded-full': day.isToday,
            }"
          >
            {{ day.date.getDate() }}
          </span>
        </div>
        <div class="space-y-1">
          <div
            v-for="post in day.posts.slice(0, 3)"
            :key="post.id"
            class="flex items-center gap-1 group/post"
            @click.stop="emit('selectPost', post)"
          >
            <div :class="statusColor(post.status)" class="w-1.5 h-1.5 rounded-full flex-shrink-0" />
            <span class="text-[10px] text-gray-600 truncate group-hover/post:text-brand-600">
              {{ post.content.slice(0, 30) }}
            </span>
          </div>
          <div
            v-if="day.posts.length > 3"
            class="text-[10px] text-gray-400 font-medium"
          >
            +{{ day.posts.length - 3 }} more
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
