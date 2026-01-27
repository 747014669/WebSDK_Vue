// src/utils/ue.ts

declare global {
  interface Window {
    loadUE: (url: string, isDirect: boolean, useHttps: boolean, callback?: () => void) => void;
    emitUIInteraction: (payload: any) => void;
    // UE5 像素流提供的监听回传消息的函数
    addResponseEventListener: (name: string, listener: (data: string) => void) => void;
    ue: any;
  }
}

export function isPixelStreaming(): boolean {
  return typeof window.emitUIInteraction === 'function' || 
         (window.ue && window.ue.interface && typeof window.ue.interface.emitUIInteraction === 'function');
}

// 发送指令
export function sendToUe(cmd: string, params: any) {
  const payload = { CMD: cmd, Data: params };
  
  // 仅在控制台留底，主要日志逻辑移交给外部回调
  console.debug('[UE] Send:', payload);

  if (isPixelStreaming()) {
    if (window.emitUIInteraction) window.emitUIInteraction(payload);
    else if (window.ue?.interface) window.ue.interface.emitUIInteraction(payload);
  } else {
    console.warn('⚠️ 未连接像素流环境');
  }
}

// 连接函数
export function connectUEDirect(ip: string, port: number = 80) {
  const signalUrl = `${ip}:${port}`;
  console.log(`🔌 连接信令: ${signalUrl}`);

  if (typeof window.loadUE === 'function') {
    window.loadUE(signalUrl, true, false, () => {
      console.log("✅ 像素流加载成功");
    });
  } else {
    console.error("❌ 缺少 app_51.js");
  }
}

/**
 * 【新增】注册 UE 回传消息监听器
 * 用于接收 UE5 C++ 发回来的类似 { "StatusCode": 200, "Data": ... } 的 JSON
 */
export function registerUEResponse(callback: (data: any) => void) {
  // 轮询检查 addResponseEventListener 是否就绪（因为 app_51.js 加载需要时间）
  const checkTimer = setInterval(() => {
    if (typeof window.addResponseEventListener === 'function') {
      clearInterval(checkTimer);
      
      // 注册监听器，名字叫 'VueListener'
      window.addResponseEventListener('VueListener', (rawString: string) => {
        try {
          // 尝试解析 JSON，如果解析失败则原样返回
          const json = JSON.parse(rawString);
          callback(json);
        } catch {
          callback(rawString);
        }
      });
      console.log("✅ UE 消息监听器已注册");
    }
  }, 500);
}