# HeatmapManager API 文档

## 概述

HeatmapManager 负责管理热力图的创建、更新、删除和查询功能。热力图通过计算引擎生成纹理，支持自定义影响半径、衰减类型和纹理分辨率。

**命令路径格式**: `/heatmapManager/CommandName`

**包含命令组**:

- **热力图管理** (4个): 创建、更新、删除、查询

---

## 热力图命令

### 1. createHeatmap - 创建热力图

**功能描述**:

根据数据点数组创建热力图。系统会自动计算热力值分布，生成纹理，并在场景中显示。支持自定义影响半径、衰减类型和纹理分辨率。

**参数说明**:

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| DataPoints | Array[Array[Float]] | 是 | - | 数据点数组，每个点为 [x, y, intensity]，x和y使用系统单位（米），intensity为强度值（0-1） |
| InfluenceRadius | Float | 否 | 100.0 | 影响半径（米），控制每个数据点的影响范围 |
| FalloffType | Integer | 否 | 2 | 衰减类型：0=线性，1=平方，2=高斯（推荐） |
| TextureResolution | Object | 否 | {Width: 1024, Height: 1024} | 纹理分辨率配置 |
| TextureResolution.Width | Integer | 否 | 1024 | 纹理宽度（像素），范围 256-4096 |
| TextureResolution.Height | Integer | 否 | 1024 | 纹理高度（像素），范围 256-4096 |
| IntensityRange | Object | 否 | {Min: 0.0, Max: 1.0} | 强度范围配置 |
| IntensityRange.Min | Float | 否 | 0.0 | 最小强度值 |
| IntensityRange.Max | Float | 否 | 1.0 | 最大强度值 |

**调用示例**:

```json
{
  "CMD": "/heatmapManager/createHeatmap",
  "Data": {
    "DataPoints": [
      [0.0, 0.0, 0.8],
      [10.0, 0.0, 0.5],
      [10.0, 10.0, 0.9],
      [5.0, 5.0, 0.3]
    ],
    "InfluenceRadius": 150.0,
    "FalloffType": 2,
    "TextureResolution": {
      "Width": 1024,
      "Height": 1024
    }
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

**数据点格式说明**:

- **X, Y**: 世界坐标，使用系统单位（米），会自动转换为 UE5 单位（厘米）
- **Intensity**: 强度值，范围 0-1，其中 0=冷（蓝色），1=热（红色）
- 数据点数量建议：10-1000 个点，过多会影响性能

**衰减类型说明**:

- **0 - 线性衰减**: 强度随距离线性递减，边界清晰
- **1 - 平方衰减**: 强度随距离平方递减，过渡较快
- **2 - 高斯衰减** (推荐): 强度呈高斯分布，过渡平滑自然

**纹理分辨率建议**:

- **256x256**: 低精度，快速渲染，适合实时预览
- **512x512**: 中等精度，平衡性能和质量
- **1024x1024**: 高精度，推荐用于最终展示
- **2048x2048+**: 超高精度，仅在需要极高细节时使用

**注意事项**:

- 创建热力图前会自动清除旧的热力图
- 数据点必须至少有 1 个
- 影响半径过小会导致热力图不连贯，过大会导致细节丧失

---

### 2. updateHeatmap - 更新热力图

**功能描述**:

更新现有热力图的数据点和配置。可用于实时更新热力分布或调整显示参数。

**参数说明**:

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| DataPoints | Array[Array[Float]] | 是 | - | 新的数据点数组 [x, y, intensity] |
| InfluenceRadius | Float | 否 | 100.0 | 新的影响半径（米） |
| FalloffType | Integer | 否 | 2 | 新的衰减类型 |
| TextureResolution | Object | 否 | - | 新的纹理分辨率 |

**调用示例**:

```json
{
  "CMD": "/heatmapManager/updateHeatmap",
  "Data": {
    "DataPoints": [
      [0.0, 0.0, 0.9],
      [10.0, 0.0, 0.6],
      [10.0, 10.0, 0.8]
    ],
    "InfluenceRadius": 200.0,
    "FalloffType": 2
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

**注意事项**:

- 必须先调用 `createHeatmap` 创建热力图，才能调用此命令
- 更新会立即重新计算纹理，可能有短暂的性能开销
- 数据点数量变化较大时，建议调整纹理分辨率

---

### 3. deleteHeatmap - 删除热力图

**功能描述**:

删除场景中的热力图并释放所有相关资源。

**参数说明**:

无参数

**调用示例**:

```json
{
  "CMD": "/heatmapManager/deleteHeatmap",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

**注意事项**:

- 删除后无法恢复，如需保留数据请先调用 `getHeatmapInfo` 保存
- 删除会立即释放纹理资源

---

### 4. getHeatmapInfo - 获取热力图信息

**功能描述**:

查询当前热力图的详细信息，包括数据点数量、配置参数和包围盒。

**参数说明**:

无参数

**调用示例**:

```json
{
  "CMD": "/heatmapManager/getHeatmapInfo",
  "Data": {}
}

```

**返回示例**:

```json
{
  "DataPointCount": 4,
  "InfluenceRadius": 150.0,
  "FalloffType": 2,
  "IsActive": true,
  "BoundingBox": {
    "Min": [0.0, 0.0],
    "Max": [10.0, 10.0]
  }
}

```

**返回字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| DataPointCount | Integer | 当前热力图的数据点数量 |
| InfluenceRadius | Float | 当前的影响半径（米） |
| FalloffType | Integer | 当前的衰减类型 |
| IsActive | Boolean | 热力图是否处于活跃状态 |
| BoundingBox | Object | 热力图的包围盒 |
| BoundingBox.Min | Array[Float] | 包围盒最小点 [x, y]，已转换为系统单位 |
| BoundingBox.Max | Array[Float] | 包围盒最大点 [x, y]，已转换为系统单位 |

**注意事项**:

- 如果未创建热力图，会返回错误
- 包围盒坐标已自动转换为系统单位（米）

---

## 错误处理

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| INVALID_PARAMETERS | 参数验证失败 | 检查 DataPoints 是否为非空数组，每个点是否包含 [x, y, intensity] 三个值 |
| RESOURCE_NOT_FOUND | 未找到活动的热力图 | 确保已调用 `createHeatmap` 创建热力图 |
| EXECUTION_FAILED | 热力图创建/更新失败 | 检查数据点数量和参数范围，查看日志获取详细错误信息 |
| DEPENDENCY_FAILED | 无法获取必要的系统组件 | 确保游戏世界已正确初始化 |

**错误返回示例**:

```json
{
  "StatusCode": 400,
  "Message": "没有提供有效的数据点"
}

```

```json
{
  "StatusCode": 404,
  "Message": "未找到活动的热力图"
}

```

---

## 单位转换说明

### 需要单位转换的参数

- **DataPoints**: X, Y 坐标使用系统单位（米），自动转换为 UE5 单位（厘米）
- **InfluenceRadius**: 使用系统单位（米），自动转换为 UE5 单位（厘米）
- **getHeatmapInfo 返回值**: BoundingBox 坐标已转换为系统单位（米）

### 不需要单位转换的参数

- **Intensity**: 强度值（0-1 范围）
- **FalloffType**: 衰减类型（整数）
- **TextureResolution**: 纹理分辨率（像素）

---

## 使用注意事项

### 性能考虑

- **数据点数量**: 建议 10-1000 个点，过多会影响计算性能
- **纹理分辨率**: 高分辨率纹理会增加内存占用和计算时间
- **更新频率**: 避免频繁更新，建议每帧最多更新一次
- **影响半径**: 过大的影响半径会导致计算量增加

### 最佳实践

1. **初始化**: 先调用 `createHeatmap` 创建基础热力图
2. **实时更新**: 使用 `updateHeatmap` 更新数据点
3. **查询状态**: 定期调用 `getHeatmapInfo` 监控热力图状态
4. **清理资源**: 不需要时调用 `deleteHeatmap` 释放资源

### 数据点建议

- **稀疏数据**: 使用较大的影响半径（200-500米）
- **密集数据**: 使用较小的影响半径（50-150米）
- **混合数据**: 根据数据分布调整影响半径

### 衰减类型选择

- **线性衰减**: 适合需要清晰边界的场景
- **平方衰减**: 适合需要快速衰减的场景
- **高斯衰减**: 适合大多数场景，效果最自然

---

## 完整使用流程示例

### 场景1: 创建并显示热力图

```json
// 1. 创建热力图
{
  "CMD": "/heatmapManager/createHeatmap",
  "Data": {
    "DataPoints": [
      [0.0, 0.0, 0.8],
      [10.0, 0.0, 0.5],
      [10.0, 10.0, 0.9],
      [5.0, 5.0, 0.3]
    ],
    "InfluenceRadius": 150.0,
    "FalloffType": 2,
    "TextureResolution": {
      "Width": 1024,
      "Height": 1024
    }
  }
}

// 2. 查询热力图信息
{
  "CMD": "/heatmapManager/getHeatmapInfo",
  "Data": {}
}

// 3. 删除热力图
{
  "CMD": "/heatmapManager/deleteHeatmap",
  "Data": {}
}

```

### 场景2: 实时更新热力图

```json
// 1. 创建初始热力图
{
  "CMD": "/heatmapManager/createHeatmap",
  "Data": {
    "DataPoints": [[0.0, 0.0, 0.5]],
    "InfluenceRadius": 100.0
  }
}

// 2. 定期更新数据点（例如每秒）
{
  "CMD": "/heatmapManager/updateHeatmap",
  "Data": {
    "DataPoints": [
      [0.0, 0.0, 0.6],
      [5.0, 5.0, 0.7],
      [10.0, 10.0, 0.8]
    ]
  }
}

// 3. 调整影响半径以改善效果
{
  "CMD": "/heatmapManager/updateHeatmap",
  "Data": {
    "InfluenceRadius": 200.0
  }
}

// 4. 查询最终状态
{
  "CMD": "/heatmapManager/getHeatmapInfo",
  "Data": {}
}

```

---

## 技术实现说明

### 热力图计算流程

1. **数据点收集**: 接收前端发送的数据点数组
2. **单位转换**: 将系统单位（米）转换为 UE5 单位（厘米）
3. **纹理生成**: 使用计算着色器生成热力图纹理
4. **衰减计算**: 根据选定的衰减类型计算每个像素的热力值
5. **纹理应用**: 将生成的纹理应用到场景中的热力图 Actor

### 衰减算法

- **线性**: `intensity = max(0, 1 - distance / radius)`
- **平方**: `intensity = max(0, 1 - (distance / radius)^2)`
- **高斯**: `intensity = exp(-(distance / radius)^2)`

### 纹理格式

- **格式**: R8G8B8A8
- **通道**: R 通道存储热力值（0-255），G/B/A 通道预留
- **采样**: 双线性采样，支持 Clamp 和 Wrap 模式

### 性能优化

- **GPU 计算**: 使用计算着色器在 GPU 上计算热力值
- **纹理缓存**: 热力图纹理缓存在显存中
- **增量更新**: 支持部分更新而不是全量重新计算

---

## 版本历史

- **v1.0** - 初始版本，包含 4 个命令
  - createHeatmap - 创建热力图
  - updateHeatmap - 更新热力图
  - deleteHeatmap - 删除热力图
  - getHeatmapInfo - 查询热力图信息

---

## 参考资料

- **命令基类**: `UCommandBase` - WebFrameWork 插件
- **工厂基类**: `UCommandFactoryBase` - WebFrameWork 插件
- **日志宏**: `.kiro/steering/logging-macros.md`
- **单位转换**: `.kiro/steering/unit-conversion.md`
- **相关命令工厂**:

  - GlsCommandFactory - 场景和对象管理
  - CameraManager - 相机控制
  - MarkManager - 路径和贴花管理
