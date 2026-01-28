# WebFrameWork System Command SDK 文档

## 概述
System 命令是 WebFrameWork 框架提供的系统级管理命令，用于管理和重置命令工厂（Factory）的状态。这些命令由 `UWebCommandDispatcher` 直接处理，不需要通过具体的 Factory 实例。

System 命令主要用于：
- 全局重置所有 Factory 状态
- 重置特定 Factory 的状态
- 系统级别的管理和维护操作

---

## Command 列表

### 1. ResetAll - 全局重置

#### 功能描述
重置所有已创建的 Factory 实例，清除它们的内部状态和缓存数据。这是一个全局操作，会影响系统中所有活动的 Factory。

**使用场景：**
- 场景切换时清理所有状态
- 测试环境重置
- 系统级别的状态清理
- 内存优化和资源释放

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| 无 | - | - | - | 此命令不需要任何参数 |

#### 调用示例
```json
{
  "CMD": "/System/ResetAll",
  "Data": {}
}
```

#### 演示视频
> 📹 [ResetAll 操作演示视频](待添加视频链接)

#### 返回示例
```json
{
  "StatusCode": 200,
  "resetCount": 5,
  "message": "全局重置完成"
}
```

#### 返回字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| StatusCode | Integer | 状态码，200 表示成功 |
| resetCount | Integer | 已重置的 Factory 数量 |
| message | String | 操作结果消息 |

---

### 2. ResetFactory - 重置指定 Factory

#### 功能描述
重置指定名称的 Factory 实例，清除该 Factory 的内部状态和缓存数据。这是一个精确的操作，只影响指定的 Factory。

**使用场景：**
- 重置特定功能模块的状态
- 清理某个 Factory 的缓存
- 修复特定 Factory 的异常状态
- 精确控制状态重置范围

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| factoryName | String | 是 | - | 要重置的 Factory 名称（如：CameraManager、MarkManager 等） |

#### 调用示例
```json
{
  "CMD": "/System/ResetFactory",
  "Data": {
    "factoryName": "CameraManager"
  }
}
```

#### 演示视频
> 📹 [ResetFactory 操作演示视频](待添加视频链接)

#### 返回示例

**成功情况：**
```json
{
  "StatusCode": 200,
  "factoryName": "CameraManager",
  "message": "Factory 重置完成"
}
```

**Factory 不存在：**
```json
{
  "StatusCode": 404,
  "ErrorMessage": "未找到 Factory 'InvalidFactoryName'"
}
```

**缺少参数：**
```json
{
  "StatusCode": 400,
  "ErrorMessage": "未提供 Factory 名称"
}
```

#### 返回字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| StatusCode | Integer | 状态码，200 表示成功 |
| factoryName | String | 已重置的 Factory 名称 |
| message | String | 操作结果消息 |
| ErrorMessage | String | 错误信息（仅在失败时返回） |

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 400 | 缺少必要参数 | 检查是否提供了 factoryName 参数 |
| 404 | Factory 不存在 | 确认 Factory 名称是否正确，检查该 Factory 是否已注册 |
| 500 | 未知的系统命令 | 检查命令路径是否正确，确认命令名称拼写 |

### 错误返回示例

**缺少参数：**
```json
{
  "StatusCode": 400,
  "ErrorMessage": "未提供 Factory 名称"
}
```

**Factory 不存在：**
```json
{
  "StatusCode": 404,
  "ErrorMessage": "未找到 Factory 'InvalidName'"
}
```

**未知命令：**
```json
{
  "StatusCode": 500,
  "ErrorMessage": "未知的系统命令: InvalidCommand"
}
```

---

## 使用注意事项

### 1. 重置操作的影响范围
- **ResetAll**：影响所有已创建的 Factory 实例
- **ResetFactory**：只影响指定的 Factory 实例
- 重置操作会清除 Factory 的内部状态，但不会销毁 Factory 实例

### 2. 状态清理内容
Factory 重置通常会清理以下内容：
- 缓存的数据和对象
- 临时创建的 Actor
- 内部状态标志
- 命令执行历史

具体清理内容取决于各个 Factory 的 `ResetFactory()` 实现。

### 3. 执行时机建议
- 在场景切换前执行 ResetAll
- 在功能模块切换时执行 ResetFactory
- 避免在命令执行过程中重置
- 建议在空闲时执行重置操作

### 4. Factory 名称规范
常见的 Factory 名称包括：
- `CameraManager` - 相机管理
- `MarkManager` - 标记管理
- `PoiManager` - POI 管理
- `HeatmapManager` - 热力图管理
- `MeasurementManager` - 测量管理
- `AnalysisTool` - 分析工具
- `AssetLibrary` - 资源库
- `PakLoadManager` - Pak 加载管理
- `SettingsManager` - 设置管理

### 5. 并发安全
- System 命令是同步执行的
- 避免在多个客户端同时执行重置操作
- 重置操作会立即生效

### 6. 性能考虑
- ResetAll 的执行时间取决于 Factory 数量
- 大量 Factory 的重置可能需要一定时间
- 建议在非关键路径上执行

---

## 完整调用流程示例

### 场景 1：场景切换时的全局重置

```json
// 1. 执行全局重置
{
  "CMD": "/System/ResetAll",
  "Data": {}
}

// 预期返回
{
  "StatusCode": 200,
  "resetCount": 8,
  "message": "全局重置完成"
}
```

### 场景 2：重置特定功能模块

```json
// 1. 重置相机管理器
{
  "CMD": "/System/ResetFactory",
  "Data": {
    "factoryName": "CameraManager"
  }
}

// 预期返回
{
  "StatusCode": 200,
  "factoryName": "CameraManager",
  "message": "Factory 重置完成"
}

// 2. 重置标记管理器
{
  "CMD": "/System/ResetFactory",
  "Data": {
    "factoryName": "MarkManager"
  }
}

// 预期返回
{
  "StatusCode": 200,
  "factoryName": "MarkManager",
  "message": "Factory 重置完成"
}
```

### 场景 3：错误处理示例

```json
// 尝试重置不存在的 Factory
{
  "CMD": "/System/ResetFactory",
  "Data": {
    "factoryName": "NonExistentFactory"
  }
}

// 错误返回
{
  "StatusCode": 404,
  "ErrorMessage": "未找到 Factory 'NonExistentFactory'"
}

// 处理方式：检查 Factory 名称是否正确
```

---

## 技术实现说明

### 命令处理流程

1. **命令接收**：`UWebCommandDispatcher::ProcessCommandMessage()`
2. **路径解析**：识别 `/System/` 前缀
3. **命令分发**：调用 `HandleSystemCommand()`
4. **执行操作**：根据命令名称执行相应操作
5. **返回响应**：通过 `FWebResponseSender` 发送结果

### ResetAll 实现逻辑

```cpp
// 遍历所有 Factory 实例
for (auto& Pair : FactoryInstances)
{
    if (Pair.Value)
    {
        Pair.Value->ResetFactory();  // 调用 Factory 的重置方法
        ResetCount++;
    }
}
```

### ResetFactory 实现逻辑

```cpp
// 1. 获取 Factory 实例
UCommandFactoryBase* Factory = GetFactory(FactoryName);

// 2. 执行重置
if (Factory)
{
    Factory->ResetFactory();
}
```

### 状态码定义

System 命令使用标准的 WebCommandStatusCodes：
- `200` - 成功
- `400` - BAD_REQUEST（参数错误）
- `404` - FACTORY_NOT_FOUND（Factory 不存在）
- `500` - INVALID_COMMAND_PATH（未知命令）

---

## 调试和监控

### 日志输出

System 命令会输出以下日志：

```cpp
// 成功重置
WEB_LOG_INFO(TEXT("全局重置完成，重置了 %d 个 Factory"), ResetCount);

// Factory 重置
WEB_LOG_INFO(TEXT("Factory '%s' 重置完成"), *FactoryName);

// 错误情况
WEB_LOG_ERROR(TEXT("未找到 Factory '%s'"), *FactoryName);
WEB_LOG_ERROR(TEXT("未知的系统命令: %s"), *CommandName);
```

### 监控建议

1. 记录重置操作的频率
2. 监控重置后的内存变化
3. 跟踪重置失败的情况
4. 统计各 Factory 的重置次数

---

## 最佳实践

### 1. 何时使用 ResetAll
- ✅ 场景完全切换
- ✅ 测试环境初始化
- ✅ 系统级别的状态清理
- ❌ 频繁的局部状态更新

### 2. 何时使用 ResetFactory
- ✅ 特定功能模块重置
- ✅ 单个 Factory 状态异常
- ✅ 精确控制重置范围
- ✅ 性能优化场景

### 3. 错误处理
```javascript
// 前端调用示例
async function resetFactory(factoryName) {
    try {
        const response = await sendCommand({
            CMD: "/System/ResetFactory",
            Data: { factoryName }
        });
        
        if (response.StatusCode === 200) {
            console.log(`Factory ${factoryName} 重置成功`);
        } else {
            console.error(`重置失败: ${response.ErrorMessage}`);
        }
    } catch (error) {
        console.error("命令发送失败:", error);
    }
}
```

### 4. 批量重置
如果需要重置多个特定 Factory，可以：
- 方案 1：多次调用 ResetFactory（精确控制）
- 方案 2：使用 ResetAll（简单但影响范围大）

---

## 相关文档

- [WebCommandDispatcher 架构文档](../Documentation/Framework_Guide_v2.md)
- [Factory 开发指南](../Documentation/Factory_Development_Guide.md)
- [命令系统概述](../Documentation/Command_System_Overview.md)

---

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| 1.0 | 2025-01-28 | 初始版本，包含 ResetAll 和 ResetFactory 命令 |
