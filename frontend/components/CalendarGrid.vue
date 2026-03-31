<script setup lang="ts">
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'
import type { Post, Platform, CalendarDay } from '~/types'

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
const transitionDirection = ref<'left' | 'right'>('right')
const transitionKey = ref(0)

const monthLabel = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed((): CalendarDay[] => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
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
  transitionDirection.value = 'right'
  transitionKey.value++
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  transitionDirection.value = 'left'
  transitionKey.value++
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const goToToday = () => {
  const targetMonth = today.getMonth()
  if (targetMonth > currentMonth.value || today.getFullYear() > currentYear.value) {
    transitionDirection.value = 'left'
  } else {
    transitionDirection.value = 'right'
  }
  transitionKey.value++
  currentMonth.value = targetMonth
  currentYear.value = today.getFullYear()
}

const platformColor = (platforms: Platform[]): string => {
  if (!platforms.length) return 'bg-gray-200 border-gray-300'
  const colors: Record<Platform, string> = {
    linkedin: 'bg-[#0077B5]/10 border-[#0077B5]/30 text-[#0077B5]',
    facebook: 'bg-[#1877F2]/10 border-[#1877F2]/30 text-[#1877F2]',
    twitter: 'bg-[#1DA1F2]/10 border-[#1DA1F2]/30 text-[#1DA1F2]',
    instagram: 'bg-[#E4405F]/10 border-[#E4405F]/30 text-[#E4405F]',
  }
  return colors[platforms[0]]
}

const statusAccent = (status: string): string => {
  const accents: Record<string, string> = {
    draft: 'border-l-gray-400',
    scheduled: 'border-l-amber-500',
    published: 'border-l-emerald-500',
    failed: 'border-l-red-500',
  }
  return accents[status] || 'border-l-gray-400'
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div class="flex items-center gap-4">
        <h2 class="text-lg font-semibold text-gray-900 min-w-[200px]">{{ monthLabel }}</h2>
        <button
          class="px-3 py-1 text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-full transition-all duration-200"
          @click="goToToday"
        >
          Today
        </button>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
          @click="prevMonth"
        >
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        <button
          class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
          @click="nextMonth"
        >
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Day Headers -->
    <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50/80">
      <div
        v-for="day in dayHeaders"
        :key="day"
        class="px-3 py-2.5 text-xs font-semibold text-gray-500 text-center uppercase tracking-wider"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid with Transition -->
    <Transition
      :name="transitionDirection === 'left' ? 'slide-left' : 'slide-right'"
      mode="out-in"
    >
      <div :key="transitionKey" class="grid grid-cols-7">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="min-h-[120px] border-b border-r border-gray-100 p-2 cursor-pointer transition-all duration-200 group/cell relative"
          :class="{
            'bg-gray-50/60 text-gray-300': !day.isCurrentMonth,
            'hover:bg-brand-50/40': day.isCurrentMonth,
            'bg-brand-50/20': day.isToday,
          }"
          @click="emit('selectDate', day.date)"
        >
          <!-- Date Number -->
          <div class="flex items-center justify-between mb-1.5">
            <span
              class="text-sm font-medium relative"
              :class="{
                'text-gray-300': !day.isCurrentMonth,
                'text-gray-700': day.isCurrentMonth && !day.isToday,
              }"
            >
              <!-- Today Pulsing Ring -->
              <span
                v-if="day.isToday"
                class="relative inline-flex items-center justify-center w-8 h-8"
              >
                <span class="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-20" />
                <span class="relative w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-brand-500/30">
                  {{ day.date.getDate() }}
                </span>
              </span>
              <span v-else>{{ day.date.getDate() }}</span>
            </span>

            <!-- Hover "+" icon for empty days -->
            <span
              v-if="day.posts.length === 0 && day.isCurrentMonth"
              class="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-all duration-200 bg-brand-100 text-brand-600 hover:bg-brand-200"
            >
              <PlusIcon class="w-3.5 h-3.5" />
            </span>
          </div>

          <!-- Post Mini-Cards -->
          <div class="space-y-1">
            <div
              v-for="post in day.posts.slice(0, 3)"
              :key="post.id"
              class="rounded-md px-1.5 py-1 text-[10px] leading-tight border-l-2 cursor-pointer transition-all duration-150 hover:shadow-sm hover:scale-[1.02]"
              :class="[platformColor(post.platforms), statusAccent(post.status)]"
              @click.stop="emit('selectPost', post)"
            >
              <div class="flex items-center gap-1">
                <PlatformIcon
                  v-if="post.platforms.length > 0"
                  :platform="post.platforms[0]"
                  size="xs"
                  class="!w-3 !h-3 !text-[6px] !rounded-sm flex-shrink-0"
                />
                <span class="truncate font-medium">{{ post.content.slice(0, 28) }}</span>
              </div>
            </div>
            <div
              v-if="day.posts.length > 3"
              class="text-[10px] text-gray-400 font-semibold pl-1 hover:text-brand-600 transition-colors duration-150"
            >
              +{{ day.posts.length - 3 }} more
            </div>
          </div>

          <!-- Drag-and-drop visual indicator zone (CSS only) -->
          <div
            v-if="day.isCurrentMonth"
            class="absolute inset-1 rounded-lg border-2 border-dashed border-transparent pointer-events-none group-hover/cell:border-brand-200/0 transition-all duration-200"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Month transition animations */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Drag-and-drop indicator when item dragged over */
.drag-over {
  @apply border-brand-400 bg-brand-50/50;
  border-style: dashed;
}

/* Pulsing animation for today */
@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
