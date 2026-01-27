<template>
  <!-- 
    关键点：
    1. id="player" 是 app_51.js 默认寻找的目标。
    2. 隐藏元素 stream-select 是为了防止 app_51.js 报错。
  -->
  <div id="player" class="w-full h-full relative bg-black overflow-hidden group">
    
    <!-- 加载占位符 -->
    <!-- <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span class="text-gray-600 text-sm">视频容器就绪 (id=player)</span>
    </div> -->

  </div>
</template>

<script setup lang="ts">
// 逻辑很简单，主要是为了提供 DOM 结构
</script>

<style scoped>
:deep(video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>