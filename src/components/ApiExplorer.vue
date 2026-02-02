<template>
  <div class="api-explorer fixed inset-0 z-10 pointer-events-none flex flex-col font-sans text-white">
    
    <!-- 右上角：System Commands 重置按钮 -->
    <div class="pointer-events-auto absolute top-4 right-4 flex items-center gap-2 z-20">
      <select v-model="selectedFactory" 
              class="bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-500 hover:bg-slate-700 transition-colors cursor-pointer">
        <option value="All">All Factories</option>
        <option v-for="factory in factoryList" :key="factory" :value="factory">{{ factory }}</option>
      </select>
      <button @click="resetFactory" 
              class="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded font-medium shadow-lg transition-all active:scale-95 flex items-center gap-2 text-sm">
        <RefreshCwIcon class="w-4 h-4" /> Reset
      </button>
    </div>

    <!-- 主体区域 -->
    <div class="flex-1 flex overflow-hidden">
      
      <!-- 左侧：功能导航 -->
      <div class="pointer-events-auto w-64 bg-slate-900/95 border-r border-slate-700 flex flex-col shadow-xl transition-transform duration-300"
           :class="{ '-translate-x-full': !isOpen }">
        
        <!-- 标题栏 -->
        <div class="h-12 flex items-center justify-between px-4 border-b border-slate-700 bg-slate-800">
          <span class="font-bold text-blue-400">UE5 API List</span>
          <button @click="isOpen = false" class="hover:text-white text-gray-400"><XIcon class="w-4 h-4"/></button>
        </div>

        <!-- 命令树 -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div v-for="(group, gKey) in apiSchema" :key="gKey">
            
            <!-- 分组标题 (点击可折叠) -->
            <div 
              @click="toggleGroup(String(gKey))"
              class="px-4 py-3 text-xs font-bold text-gray-400 uppercase bg-slate-950/80 mt-1 first:mt-0 cursor-pointer flex items-center justify-between hover:bg-slate-900 hover:text-gray-200 transition-colors select-none"
            >
              {{ group.title }}
              <ChevronDownIcon 
                class="w-3 h-3 transition-transform duration-200"
                :class="{ '-rotate-90': !expandedGroups.includes(String(gKey)) }"
              />
            </div>
            
            <!-- 命令列表 -->
            <div v-show="expandedGroups.includes(String(gKey))" class="bg-slate-900/30">
              <div v-for="(cmd, cIdx) in group.commands" :key="cIdx">
                <button 
                  @click="selectCommand(cmd)"
                  class="w-full text-left px-4 py-2 text-sm border-l-2 hover:bg-slate-800 transition-colors flex items-center justify-between group"
                  :class="selectedCmd?.cmd === cmd.cmd ? 'border-blue-500 bg-blue-900/20 text-blue-200' : 'border-transparent text-gray-400'"
                >
                  <span class="truncate">{{ cmd.name }}</span>
                  <ChevronRightIcon class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 打开侧边栏按钮 -->
      <button v-if="!isOpen" @click="isOpen = true" class="pointer-events-auto absolute top-4 left-4 p-2 bg-slate-800 border border-slate-600 rounded shadow hover:bg-slate-700">
        <MenuIcon class="w-5 h-5" />
      </button>

      <!-- 右侧：详情面板 -->
      <div v-if="selectedCmd && isOpen" class="pointer-events-auto w-80 bg-slate-900/90 backdrop-blur-md border-r border-slate-700 flex flex-col shadow-2xl animate-slide-in">
        <!-- 详情头 -->
        <div class="h-12 px-4 border-b border-slate-700 flex items-center bg-slate-800/80">
          <h3 class="font-bold truncate" :title="selectedCmd.name">{{ selectedCmd.name }}</h3>
        </div>

        <!-- 参数表单 -->
        <div class="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          <p class="text-xs text-gray-400 italic bg-slate-800 p-2 rounded border border-slate-700/50">
            {{ selectedCmd.desc || '暂无描述' }}
            <br>
            <span class="text-blue-500 font-mono mt-1 block break-all select-all">{{ selectedCmd.cmd }}</span>
          </p>

          <div v-if="selectedCmd.params?.length" class="space-y-4">
            <div v-for="param in selectedCmd.params" :key="param.key">
              <div class="flex justify-between mb-1">
                <label class="text-xs font-medium text-gray-300">{{ param.label }}</label>
                <span v-if="param.unit" class="text-[10px] text-gray-500 bg-slate-800 px-1 rounded">{{ param.unit }}</span>
              </div>

              <!-- Vector3 输入框 -->
              <div v-if="param.type === 'vector3'" class="flex gap-2">
                <div v-for="(axis, i) in ['X','Y','Z']" :key="i" class="relative flex-1">
                  <span class="absolute left-1.5 top-1.5 text-[10px] text-gray-600 select-none">{{axis}}</span>
                  <input type="number" v-model.number="currentFormData[param.key][i]" 
                         class="w-full bg-slate-950 border border-slate-700 rounded px-1 pl-4 py-1 text-xs outline-none focus:border-blue-500 text-right" />
                </div>
              </div>

              <!-- JSON 输入框 -->
              <div v-else-if="param.type === 'json'" class="relative">
                <textarea v-model="currentFormData[param.key]" rows="4" 
                          class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-[10px] font-mono text-green-400 outline-none resize-y"></textarea>
                <button @click="formatJson(param.key)" class="absolute bottom-1 right-1 text-[10px] text-gray-500 hover:text-white bg-slate-800 px-1 rounded">Format</button>
              </div>

              <!-- Select 下拉框 -->
              <select v-else-if="param.type === 'select'" v-model="currentFormData[param.key]"
                      class="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500">
                <option v-for="opt in param.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>

              <!-- 普通 Input -->
              <input v-else :type="param.type === 'float' || param.type === 'integer' ? 'number' : 'text'" 
                     v-model="currentFormData[param.key]"
                     class="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500" />
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-8 text-sm">此命令无需参数</div>
        </div>

        <!-- 底部发送按钮 -->
        <div class="p-4 border-t border-slate-700 bg-slate-800/50">
          <button @click="executeCommand" 
                  class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
            <SendIcon class="w-4 h-4" /> 发送指令
          </button>
        </div>
      </div>
    </div>

    <!-- 底部日志面板 -->
    <div class="pointer-events-auto bg-slate-900 border-t border-slate-700 flex flex-col transition-all duration-300 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]"
         :style="{ height: isLogOpen ? '200px' : '32px' }">
      
      <!-- 日志标题栏 -->
      <div @click="isLogOpen = !isLogOpen" 
           class="h-8 flex items-center justify-between px-4 bg-slate-800 cursor-pointer hover:bg-slate-750 select-none">
        <div class="flex items-center gap-2 text-xs font-bold text-gray-400">
          <TerminalIcon class="w-3 h-3" />
          通信日志
          <span v-if="logs.length" class="bg-blue-600 text-white px-1.5 rounded-full text-[10px]">{{ logs.length }}</span>
        </div>
        <div class="flex items-center gap-3">
          <button @click.stop="logs = []" class="text-[10px] text-gray-500 hover:text-red-400 flex items-center gap-1">
            <Trash2Icon class="w-3 h-3" /> 清空
          </button>
          <ChevronUpIcon class="w-4 h-4 text-gray-500 transition-transform" :class="{'rotate-180': isLogOpen}" />
        </div>
      </div>

      <!-- 日志内容 -->
      <div ref="logContainer" class="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs bg-black/50 custom-scrollbar">
        <div v-if="logs.length === 0" class="text-gray-600 text-center mt-4">暂无通信记录</div>
        
        <!-- 日志行：增加 relative 和 pr-8 为复制按钮留空间 -->
        <div v-for="(log, i) in logs" :key="i" class="relative flex gap-2 group hover:bg-white/5 p-1 rounded pr-8">
          <span class="text-gray-500 shrink-0 select-none">[{{ log.time }}]</span>
          <span class="font-bold shrink-0 select-none" 
                :class="log.type === 'TX' ? 'text-blue-400' : 'text-green-400'">
            {{ log.type === 'TX' ? '→ SENT' : '← RECV' }}
          </span>
          <!-- 增加 select-text 确保可选中，font-mono 方便看代码 -->
          <span class="text-gray-300 break-all whitespace-pre-wrap select-text font-mono">{{ log.msg }}</span>
          
          <!-- 复制按钮：Group Hover 时显示 -->
          <button 
            @click="copyLog(log.msg)" 
            class="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-slate-700/80 hover:bg-blue-600 rounded text-white shadow-sm"
            title="复制内容"
          >
            <CopyIcon class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
// 引入 CopyIcon 和 RefreshCwIcon
import { MenuIcon, XIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, SendIcon, Trash2Icon, TerminalIcon, CopyIcon, RefreshCwIcon } from 'lucide-vue-next';
import { apiSchema, type CommandDef } from '../config/apiSchema';
import { sendToUe, registerUEResponse } from '../utils/ue';

// UI 状态
const isOpen = ref(true);
const isLogOpen = ref(true);
const selectedCmd = ref<CommandDef | null>(null);
const currentFormData = reactive<Record<string, any>>({});
const logContainer = ref<HTMLElement>();
const expandedGroups = ref<string[]>(Object.keys(apiSchema));

// System Reset
const selectedFactory = ref('All');
// 动态获取所有 Factory 名称 (排除 System)
const factoryList = Object.keys(apiSchema).filter(k => k !== 'System');

interface LogEntry { type: 'TX' | 'RX'; time: string; msg: string; }
const logs = ref<LogEntry[]>([]);

// 复制日志功能 (兼容 HTTP)
const copyLog = (text: string) => {
  // 优先尝试现代 API
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(err => console.error('Copy failed:', err));
  } else {
    // 兼容 HTTP 环境的 Fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Copy fallback failed', err);
    }
    document.body.removeChild(textArea);
  }
};

const toggleGroup = (key: string) => {
  const idx = expandedGroups.value.indexOf(key);
  if (idx > -1) expandedGroups.value.splice(idx, 1);
  else expandedGroups.value.push(key);
};

const selectCommand = (cmd: CommandDef) => {
  selectedCmd.value = cmd;
  Object.keys(currentFormData).forEach(key => delete currentFormData[key]);
  if (cmd.params) {
    cmd.params.forEach(p => {
      if (p.default !== undefined) {
        // JSON 类型参数转为格式化字符串，其他类型深拷贝
        currentFormData[p.key] = p.type === 'json' 
          ? JSON.stringify(p.default, null, 2)
          : JSON.parse(JSON.stringify(p.default));
      } else {
        currentFormData[p.key] = null;
      }
    });
  }
};

const formatJson = (key: string) => {
  try {
    const val = currentFormData[key];
    const obj = typeof val === 'string' ? JSON.parse(val) : val;
    currentFormData[key] = JSON.stringify(obj, null, 2);
  } catch { alert('JSON 格式无效'); }
};

const executeCommand = () => {
  if (!selectedCmd.value) return;
  const payload: any = {};
  selectedCmd.value.params?.forEach(p => {
    let val = currentFormData[p.key];
    if (p.type === 'json' && typeof val === 'string') {
      try { val = JSON.parse(val); } catch { return; }
    }
    if (p.type === 'float') val = parseFloat(val);
    if (p.type === 'integer') val = parseInt(val);
    payload[p.key] = val;
  });
  sendToUe(selectedCmd.value.cmd, payload);
  addLog('TX', `${selectedCmd.value.cmd} ${JSON.stringify(payload)}`);
};

const addLog = (type: 'TX' | 'RX', msg: string | object) => {
  const msgStr = typeof msg === 'object' ? JSON.stringify(msg) : String(msg);
  logs.value.push({
    type,
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    msg: msgStr
  });
  nextTick(() => {
    if (logContainer.value) logContainer.value.scrollTop = logContainer.value.scrollHeight;
  });
};

// System Commands - 重置 Factory
const resetFactory = () => {
  if (selectedFactory.value === 'All') {
    sendToUe('/System/ResetAll', {});
    addLog('TX', '/System/ResetAll {}');
  } else {
    sendToUe('/System/ResetFactory', { factoryName: selectedFactory.value });
    addLog('TX', `/System/ResetFactory {"factoryName": "${selectedFactory.value}"}`);
  }
};

onMounted(() => {
  registerUEResponse((data) => {
    addLog('RX', data);
  });
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }

@keyframes slide-in {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-in {
  animation: slide-in 0.2s ease-out;
}
</style>