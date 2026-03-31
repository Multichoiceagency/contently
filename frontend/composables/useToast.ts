import type { Toast } from '~/types'

const toasts = ref<Toast[]>([])

export function useToast() {
  const addToast = (message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2)
    const toast: Toast = { id, type, message, duration }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
  }
}
