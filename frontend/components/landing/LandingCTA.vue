<template>
  <section class="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Main CTA Card -->
      <div class="relative rounded-3xl bg-gradient-to-br from-cs-blue-light to-blue-100 py-16 px-8 md:px-12 overflow-hidden">
        <!-- Floating Platform Icons -->
        <!-- Facebook -->
        <div class="absolute top-8 left-8 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>

        <!-- Instagram -->
        <div class="absolute top-20 right-12 w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center text-white text-2xl shadow-lg">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.588.147-1.093.345-1.523.645-.385.297-.72.645-.923 1.023-.386.743-.566 1.498-.684 2.315-.048.503-.061.868-.061 2.465v11.97c0 1.597.013 1.962.061 2.465.118.822.298 1.577.684 2.315.205.378.538.726.923 1.023.43.3.935.498 1.523.645.788.267 1.658.468 2.936.528 1.28.057 1.687.072 4.947.072s3.667-.015 4.947-.072c1.280-.06 2.149-.261 2.936-.528.588-.147 1.093-.345 1.523-.645.385-.297.72-.645.923-1.023.386-.743.566-1.498.684-2.315.048-.503.061-.868.061-2.465V5.338c0-1.597-.013-1.962-.061-2.465-.118-.822-.298-1.577-.684-2.315-.205-.378-.538-.726-.923-1.023-.43-.3-.935-.498-1.523-.645-.788-.267-1.658-.468-2.936-.528C15.667.015 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.070 1.171.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.061 1.264.07 1.645.07 4.849 0 3.205-.009 3.584-.07 4.849-.055 1.171-.249 1.805-.415 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.38.896-.422.164-1.057.36-2.228.413-1.264.061-1.644.07-4.849.07-3.206 0-3.584-.009-4.849-.07-1.171-.055-1.806-.249-2.228-.413-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.82-.896-1.382-.164-.422-.36-1.057-.413-2.227-.061-1.264-.07-1.644-.07-4.849 0-3.205.009-3.584.07-4.849.055-1.171.249-1.805.413-2.227.217-.562.477-.96.896-1.382.42-.419.82-.679 1.382-.896.422-.164 1.057-.36 2.227-.413 1.265-.061 1.645-.07 4.849-.07zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
          </svg>
        </div>

        <!-- YouTube -->
        <div class="absolute bottom-20 left-16 w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl shadow-lg">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>

        <!-- Pinterest -->
        <div class="absolute bottom-12 right-20 w-16 h-16 rounded-full bg-red-700 flex items-center justify-center text-white text-2xl shadow-lg">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.42-.09-.024-.779-.084-.779-.057-.29-.11-.743-.11-1.194 0-1.448.873-2.503.992-2.691.09-.148.048-.315-.048-.361-1.307-.573-2.008-1.793-2.008-3.11 0-1.776 1.182-3.303 2.942-3.303.552 0 1.054.167 1.495.492-.016-.003-.032-.003-.047-.003-1.504 0-2.719 1.215-2.719 2.719 0 .535.175 1.03.473 1.45-1.396.24-2.633 1.342-2.633 2.87 0 1.3.672 2.446 1.716 3.112-.03.036-.06.084-.06.138 0 .295.236.625.563.767-.164.494-.446 1.493-.446 1.493-.27.81-.888 1.407-1.71 1.677.426.034.859.054 1.295.054 5.627 0 10.186-4.559 10.186-10.186C22.186 5.373 16.813 0 12 0z"/>
          </svg>
        </div>

        <!-- TikTok -->
        <div class="absolute top-1/3 right-8 w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-2xl shadow-lg">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.591 14.235c0 0 1.392.625 2.404 1.948.604.771.922 1.625.922 2.56 0 1.286-.474 2.381-1.422 3.285-.949.904-2.147 1.356-3.594 1.356-1.562 0-2.889-.556-3.98-1.667-.55-.556-.99-1.27-1.319-2.143h-3.66c.33 2.286 1.429 4.119 3.297 5.496 1.869 1.377 4.147 2.065 6.835 2.065 1.93 0 3.73-.452 5.402-1.356 1.671-.905 2.967-2.126 3.888-3.664.921-1.538 1.381-3.232 1.381-5.082 0-.99-.165-1.92-.495-2.79-.33-.87-.82-1.667-1.47-2.39-.65-.722-1.419-1.305-2.31-1.751-.89-.445-1.859-.74-2.904-.884-.857-.119-1.515-.386-1.973-.801-.458-.414-.687-.995-.687-1.743 0-.718.19-1.301.57-1.75.381-.448.94-.735 1.678-.86.63-.106 1.283-.028 1.96.235.677.263 1.282.697 1.815 1.301.533.604.957 1.368 1.27 2.29h3.66c-.33-1.675-1.092-3.137-2.287-4.386-1.195-1.25-2.75-2.143-4.665-2.681-1.915-.539-3.949-.598-6.1-.177-2.15.42-4.014 1.505-5.591 3.254-1.577 1.749-2.471 4.01-2.682 6.784v.177c.22 2.893 1.202 5.23 2.95 7.013 1.748 1.783 4.057 2.729 6.927 2.839 1.93.074 3.708-.41 5.335-1.452 1.626-1.042 2.75-2.4 3.37-4.072"/>
          </svg>
        </div>

        <!-- X (Twitter) -->
        <div class="absolute bottom-20 right-12 w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-2xl shadow-lg">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.654l-5.207-6.807-5.979 6.807H2.424l7.723-8.835L1.899 2.25h6.822l4.713 6.231 5.486-6.231zM17.002 18.335h1.828L6.822 4.156H4.881l12.121 14.179z"/>
          </svg>
        </div>

        <!-- Center Content -->
        <div class="relative z-10 text-center">
          <h2 class="text-3xl md:text-4xl font-semibold text-cs-heading mb-8">
            Powerful social media management software
          </h2>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button class="bg-cs-blue text-white rounded-full px-8 py-4 text-sm font-medium hover:bg-blue-600 transition-colors">
              Start your free trial
            </button>
            <button class="bg-white text-cs-body rounded-full px-10 py-4 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
              Book a demo
            </button>
          </div>

          <!-- Subtext -->
          <p class="text-sm text-cs-muted mb-12">
            14-day free trial · No credit card required.
          </p>

          <!-- Decorative Mockup Preview -->
          <div class="rounded-2xl shadow-xl overflow-hidden bg-white border border-gray-200">
            <div class="p-4 md:p-6">
              <!-- Media Library Grid -->
              <div class="grid grid-cols-4 md:grid-cols-6 gap-3">
                <div class="aspect-square rounded-lg bg-gradient-to-br from-blue-400 to-blue-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-purple-400 to-purple-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-pink-400 to-pink-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-red-400 to-red-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-green-400 to-green-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-teal-400 to-teal-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-orange-400 to-orange-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-rose-400 to-rose-600"></div>
                <div class="aspect-square rounded-lg bg-gradient-to-br from-violet-400 to-violet-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Component setup
</script>

<style scoped>
/* Additional styling if needed */
</style>
