<template>
  <div id="app" class="relative w-screen h-screen overflow-hidden bg-black text-white select-none">
    
    <!-- 1. 视频层：放在最底层 (Z-Index 0) -->
    <!-- 这是我们用来承载 UE5 视频流的容器 -->
    <div class="absolute inset-0 z-0">
      <UEBase />
    </div>

    <!-- 2. 连接面板：未连接时显示 (Z-Index 50) -->
    <div v-if="!isConnected" class="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div class="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700 w-[400px]">
        
        <h2 class="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-2">
          <span class="p-2 bg-blue-500/10 rounded-lg">🔗</span> 
          连接 UE5
        </h2>
        
        <div class="space-y-4">
          <!-- IP 输入框 -->
          <div>
            <label class="text-xs text-gray-400 uppercase font-bold tracking-wider">IP 地址</label>
            <input 
              v-model="config.ip" 
              type="text" 
              placeholder="127.0.0.1"
              class="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 font-mono transition-colors" 
            />
          </div>

          <!-- 端口输入框 -->
          <div>
            <label class="text-xs text-gray-400 uppercase font-bold tracking-wider">端口 (Port)</label>
            <input 
              v-model.number="config.port" 
              type="number" 
              placeholder="80"
              class="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 font-mono transition-colors" 
            />
            <p class="text-[10px] text-gray-500 mt-2">* 编辑器模式默认端口通常为 80 或 8888</p>
          </div>

          <!-- 连接按钮 -->
          <button 
            @click="handleConnect" 
            :disabled="isConnecting" 
            class="w-full bg-blue-600 hover:bg-blue-500 py-3.5 rounded-xl font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          >
            {{ isConnecting ? '正在连接...' : '开始连接' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 3. 功能面板：连接成功后显示 -->
    <!-- 这是一个过渡动画，让面板淡入显示 -->
    <transition name="fade">
      <div v-if="isConnected" class="absolute inset-0 pointer-events-none z-10">
        <!-- 核心 API 控制台 -->
        <ApiExplorer />
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 引入我们自己写的组件 (注意路径是 ./components/...)
import UEBase from './components/UEBase.vue';       
import ApiExplorer from './components/ApiExplorer.vue'; 
import { connectUEDirect } from './utils/ue'; 

// 状态管理
const isConnected = ref(false);
const isConnecting = ref(false);

// 配置对象 (优先读取本地存储，没有则用默认值)
const config = reactive({
  ip: localStorage.getItem('ue_ip') || '127.0.0.1', 
  port: Number(localStorage.getItem('ue_port')) || 80
});

// 处理连接点击事件
const handleConnect = () => {
  if (isConnecting.value) return;
  isConnecting.value = true;
  
  // 记住用户的输入，下次不用重填
  localStorage.setItem('ue_ip', config.ip);
  localStorage.setItem('ue_port', String(config.port));

  try {
    // 调用 utils/ue.ts 中的连接函数
    connectUEDirect(config.ip, config.port);
    
    // 这里做一个简单的延时模拟，给 app_51.js 一点时间去建立 WebRTC
    // 如果连接成功，app_51.js 会自动把视频塞进 UEBase 组件里
    setTimeout(() => {
      isConnected.value = true;
      isConnecting.value = false;
    }, 1500); 
    
  } catch (e) {
    console.error("连接错误:", e);
    isConnecting.value = false;
    alert("连接启动失败，请检查控制台 (F12)");
  }
};

// 支持 URL 参数自动连接 (方便分享链接)
// 例如: http://localhost:5173/?autostart=1&ip=192.168.1.50
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('ip')) config.ip = params.get('ip')!;
  if (params.get('port')) config.port = Number(params.get('port'));
  if (params.get('autostart')) handleConnect();
});
</script>

<style scoped>
/* Vue 的过渡动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>