# AnalysisToolFactory API 文档

## 概述

AnalysisToolFactory 负责管理场景分析工具的创建、激活和取消功能。支持天际线分析、可视域分析、通视分析和地形分析四大类分析工具，提供交互式和自动化两种使用模式。

---

## Command 列表

---

### 1. showSkyline - 显示天际线分析

#### 功能描述

启用天际线分析效果，通过后处理材质在场景中高亮显示建筑物的轮廓线。创建全局 PostProcessVolume 并应用天际线材质。

#### 参数说明

无参数

#### 调用示例

```json
{
  "CMD": "/analysisTool/showSkyline",
  "Data": {}
}

```

#### 返回示例

```json
{
  "StatusCode": 200
}

```

#### 注意事项

- 创建的 PostProcessVolume 为 Unbound 模式，影响整个场景
- 如果已激活天际线，重复调用会直接返回成功
- 天际线效果会持续显示，直到调用 `hideSkyline` 命令
- 后处理材质路径：`/WebCore/Res/Materials/OutLine/PP_SkylineAnalysis_Inst`

---

### 2. show2DSkyline - 显示/隐藏二维天际线

#### 功能描述

控制二维天际线视图的显示和隐藏。二维天际线通过 SceneCaptureComponent2D 捕获场景深度，并在 UI 中显示天际线轮廓图。

#### 前置条件

必须先调用 `showSkyline` 命令激活天际线分析

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| bShow | Boolean | 是 | - | true=显示二维天际线，false=隐藏二维天际线 |
| Position | Array[Float] | 否 | - | Widget 位置 [x, y]，屏幕坐标（像素） |

#### 调用示例

**显示二维天际线**:

```json
{
  "CMD": "/analysisTool/show2DSkyline",
  "Data": {
    "bShow": true,
    "Position": [100.0, 100.0]
  }
}

```

**隐藏二维天际线**:

```json
{
  "CMD": "/analysisTool/show2DSkyline",
  "Data": {
    "bShow": false
  }
}

```

#### 返回示例

```json
{
  "StatusCode": 200
}

```

#### 注意事项

- 必须先调用 `showSkyline`，否则会返回错误
- 显示时会创建 SceneCaptureComponent2D 和 Widget
- 隐藏时只移除 Widget，保留 SceneCaptureComponent2D
- Widget 会附加到 Pawn 上，跟随相机移动
- RenderTarget 路径：`/WebCore/Res/Materials/OutLine/RT_SkyLineAnalysis`
- Widget 蓝图路径：`/WebCore/UMG/UMG_SkyLineAnlysis`

---

### 3. hideSkyline - 隐藏天际线分析

#### 功能描述

完全关闭天际线分析，清理所有相关资源（PostProcessVolume、SceneCaptureComponent2D、Widget）。

#### 参数说明

无参数

#### 调用示例

```json
{
  "CMD": "/analysisTool/hideSkyline",
  "Data": {}
}

```

#### 返回示例

```json
{
  "StatusCode": 200
}

```

#### 注意事项

- 会销毁所有天际线相关资源
- 清理后需要重新调用 `showSkyline` 才能再次使用
- 如果未激活天际线，调用此命令也会返回成功

---

### 4. activateViewshed - 激活可视域分析

#### 功能描述

启动交互式可视域分析，用户通过两次鼠标点击确定观察者位置、方向和分析半径。可视域分析会在场景中显示从观察点可见的区域（绿色）和不可见的区域（红色）。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| FOV | Float | 否 | 90.0 | 视场角（度），范围 30-120 |
| Resolution | Integer | 否 | 1024 | 渲染目标分辨率，范围 256-2048 |
| DepthBias | Float | 否 | 20.0 | 深度偏移（厘米），用于避免 Z-fighting |

#### 交互流程

1. 调用命令启动可视域分析模式
2. 用户第1次左键点击：确定观察点位置
3. 创建预览 Observer，鼠标移动时实时更新方向和半径
4. 用户第2次左键点击：确定目标点位置
5. 自动计算方向和半径，完成可视域分析
6. 返回分析结果

#### 调用示例

```json
{
  "CMD": "/analysisTool/activateViewshed",
  "Data": {
    "FOV": 90.0,
    "Resolution": 1024,
    "DepthBias": 20.0
  }
}

```

#### 返回示例

```json
{
  "StatusCode": 200,
  "Radius": 1500.5
}

```

#### 鼠标操作

- **第1次左键点击**: 确定观察点位置
- **鼠标移动**: 实时更新预览方向和半径
- **第2次左键点击**: 确定目标点位置并完成分析

#### 注意事项

- 命令会延迟响应，直到用户完成两次点击
- 第1次点击后会创建预览 Observer，实时显示可视域效果
- 鼠标移动时会动态更新可视域方向和半径
- 半径由两次点击的距离自动计算
- 如果已存在可视域观察者，会自动清理旧的
- Observer 蓝图路径：`/WebCore/Res/ViewShed/BP_ViewShedObserver`
- 后处理材质路径：`/WebCore/Res/ViewShed/PP_Viewshed`
- **绿色区域**: 从观察点可见的区域
- **红色区域**: 从观察点不可见的区域（被遮挡）

---

### 5. deactivateViewshed - 取消可视域分析

#### 功能描述

关闭可视域分析，销毁可视域观察者 Actor 并清理所有相关资源。

#### 参数说明

无参数

#### 调用示例

```json
{
  "CMD": "/analysisTool/deactivateViewshed",
  "Data": {}
}

```

#### 返回示例

```json
{
  "StatusCode": 200
}

```

#### 注意事项

- 会销毁可视域观察者 Actor
- 清理后需要重新调用 `activateViewshed` 才能再次使用
- 如果未激活可视域，调用此命令也会返回成功

---

### 6. activateLineOfSight - 激活通视分析

#### 功能描述

启动交互式通视分析，用户通过两次鼠标点击确定通视线的起点和终点。通视分析会在场景中绘制连接两点的线段，绿色表示可见，红色表示被遮挡。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| LineThickness | Float | 否 | 2.0 | 线条粗细（像素） |

#### 交互流程

1. 调用命令启动通视分析模式
2. 用户第1次左键点击：确定起点位置
3. 鼠标移动时实时显示预览线段
4. 用户第2次左键点击：确定终点位置
5. 执行射线检测，判断通视情况
6. 返回分析结果

#### 调用示例

```json
{
  "CMD": "/analysisTool/activateLineOfSight",
  "Data": {
    "LineThickness": 3.0
  }
}

```

#### 返回示例

**通视成功（无遮挡）**:

```json
{
  "StatusCode": 200,
  "StartPoint": [0.0, 0.0, 100.0],
  "EndPoint": [1000.0, 0.0, 100.0],
  "IsBlocked": false
}

```

**通视失败（有遮挡）**:

```json
{
  "StatusCode": 200,
  "StartPoint": [0.0, 0.0, 100.0],
  "EndPoint": [1000.0, 0.0, 100.0],
  "IsBlocked": true,
  "HitPoint": [500.0, 0.0, 100.0]
}

```

#### 鼠标操作

- **第1次左键点击**: 确定起点位置
- **鼠标移动**: 实时更新预览线段
- **第2次左键点击**: 确定终点位置并完成分析

#### 注意事项

- 命令会延迟响应，直到用户完成两次点击
- 第1次点击后会显示预览线段，跟随鼠标移动
- 绿色线段表示通视成功，红色线段表示被遮挡
- 如果被遮挡，会返回遮挡点的坐标
- 坐标已自动转换为系统单位（米）

---

### 7. deactivateLineOfSight - 取消通视分析

#### 功能描述

关闭通视分析，移除通视分析 Widget 并清理所有相关资源。

#### 参数说明

无参数

#### 调用示例

```json
{
  "CMD": "/analysisTool/deactivateLineOfSight",
  "Data": {}
}

```

#### 返回示例

```json
{
  "StatusCode": 200
}

```

#### 注意事项

- 会移除通视分析 Widget
- 清理后需要重新调用 `activateLineOfSight` 才能再次使用
- 如果未激活通视分析，调用此命令也会返回成功

---

### 8. activateTerrainAnalysis - 激活地形分析（交互模式）

#### 功能描述

启动交互式地形分析，用户通过鼠标点击绘制分析区域多边形。支持等高线分析和坡度坡向分析两种类型。绘制过程中会实时显示预览效果。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| AnalysisType | String | 否 | "Contour" | 分析类型："Contour"=等高线，"SlopeAspect"=坡度坡向 |
| Resolution | Integer | 否 | 512 | 采样分辨率，范围 64-2048 |
| ContourSettings | Object | 否 | - | 等高线设置（当 AnalysisType="Contour" 时有效） |
| SlopeAspectSettings | Object | 否 | - | 坡度坡向设置（当 AnalysisType="SlopeAspect" 时有效） |

#### ContourSettings 参数

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Interval | Float | 否 | 5.0 | 等高线间隔（米） |
| MajorInterval | Integer | 否 | 5 | 主等高线间隔（每 N 条加粗） |
| ShowLabels | Boolean | 否 | true | 是否显示高程标注 |
| LabelInterval | Float | 否 | 100.0 | 标注间隔（米），控制高程标签的显示间距 |

#### SlopeAspectSettings 参数

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| SlopeOpacity | Float | 否 | 0.7 | 坡度热力图透明度 |
| ShowSlopeLegend | Boolean | 否 | true | 是否显示坡度图例 |
| ShowAspectArrows | Boolean | 否 | true | 是否显示坡向箭头 |
| ArrowSpacing | Float | 否 | 50.0 | 箭头间距（米） |
| ArrowOpacity | Float | 否 | 0.9 | 箭头透明度 |
| FlatThreshold | Float | 否 | 2.0 | 平坦区域阈值（度），坡度小于此值不显示箭头 |
| UseHSVColor | Boolean | 否 | true | 是否使用 HSV 颜色（否则使用单色） |

#### 交互流程

1. 调用命令启动地形分析模式，显示预览 Widget
2. 用户左键点击添加多边形顶点，实时显示预览线段
3. 鼠标移动时预览点跟随鼠标位置
4. 用户右键点击完成绘制（至少需要 3 个顶点）
5. 系统执行 GPU 深度采样和地形分析
6. 返回分析结果

#### 调用示例

**等高线分析**:

```json
{
  "CMD": "/analysisTool/activateTerrainAnalysis",
  "Data": {
    "AnalysisType": "Contour",
    "Resolution": 512,
    "ContourSettings": {
      "Interval": 5.0,
      "MajorInterval": 5,
      "ShowLabels": true
    }
  }
}

```

**坡度坡向分析**:

```json
{
  "CMD": "/analysisTool/activateTerrainAnalysis",
  "Data": {
    "AnalysisType": "SlopeAspect",
    "Resolution": 512,
    "SlopeAspectSettings": {
      "SlopeOpacity": 0.7,
      "ShowAspectArrows": true,
      "ArrowSpacing": 50.0,
      "FlatThreshold": 2.0
    }
  }
}

```

#### 返回示例

```json
{
  "StatusCode": 200,
  "Region": {
    "Points": [[0.0, 0.0], [100.0, 0.0], [100.0, 100.0], [0.0, 100.0]],
    "Area": 10000.0
  },
  "ElevationRange": {
    "Min": 0.0,
    "Max": 50.0
  },
  "SlopeRange": {
    "Min": 0.0,
    "Max": 45.0
  }
}

```

#### 鼠标操作

- **左键点击**: 添加多边形顶点
- **鼠标移动**: 预览点跟随鼠标位置
- **右键点击**: 完成绘制并开始分析

#### 注意事项

- 命令会延迟响应，直到用户完成绘制
- 至少需要 3 个顶点才能完成绘制
- 预览点会跟随鼠标实时更新，即使射线未命中物体也会显示
- 分析使用 GPU 深度采样，性能较好
- 坐标已自动转换为系统单位（米）

---

### 9. analyzeTerrainRegion - 分析指定区域（非交互模式）

#### 功能描述

直接传入多边形顶点进行地形分析，无需用户交互。适用于程序化调用或已知分析区域的场景。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Polygon | Array | 是 | - | 多边形顶点数组，每个顶点为 [x, y]（米） |
| AnalysisType | String | 否 | "Contour" | 分析类型："Contour"=等高线，"SlopeAspect"=坡度坡向 |
| Resolution | Integer | 否 | 512 | 采样分辨率，范围 64-2048 |
| ContourSettings | Object | 否 | - | 等高线设置（同 activateTerrainAnalysis） |
| SlopeAspectSettings | Object | 否 | - | 坡度坡向设置（同 activateTerrainAnalysis） |

#### 调用示例

```json
{
  "CMD": "/analysisTool/analyzeTerrainRegion",
  "Data": {
    "Polygon": [[0.0, 0.0], [100.0, 0.0], [100.0, 100.0], [0.0, 100.0]],
    "AnalysisType": "Contour",
    "Resolution": 512,
    "ContourSettings": {
      "Interval": 5.0,
      "MajorInterval": 5,
      "ShowLabels": true
    }
  }
}

```

#### 返回示例

```json
{
  "StatusCode": 200,
  "ElevationRange": {
    "Min": 0.0,
    "Max": 50.0
  },
  "SlopeRange": {
    "Min": 0.0,
    "Max": 45.0
  }
}

```

#### 注意事项

- 多边形至少需要 3 个顶点
- 坐标使用系统单位（米），内部自动转换为 UE5 单位
- 立即执行分析，无需用户交互

---

### 10. updateTerrainAnalysis - 更新地形分析设置

#### 功能描述

更新当前地形分析的显示设置，如显示/隐藏等高线、坡度、坡向等。

#### 前置条件

必须已有活动的地形分析（状态为 Displaying）

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| ShowContour | Boolean | 否 | - | 显示/隐藏等高线 |
| ShowSlope | Boolean | 否 | - | 显示/隐藏坡度热力图 |
| ShowAspect | Boolean | 否 | - | 显示/隐藏坡向箭头 |

#### 调用示例

```json
{
  "CMD": "/analysisTool/updateTerrainAnalysis",
  "Data": {
    "ShowContour": true,
    "ShowSlope": false,
    "ShowAspect": true
  }
}

```

#### 返回示例

```json
{
  "StatusCode": 200
}

```

#### 注意事项

- 只有在地形分析显示状态下才能调用
- 可以单独控制各个分析结果的显示/隐藏

---

### 11. deactivateTerrainAnalysis - 取消地形分析

#### 功能描述

关闭地形分析，清理所有相关资源（等高线渲染器、坡度坡向渲染器、高程场数据等）。

#### 参数说明

无参数

#### 调用示例

```json
{
  "CMD": "/analysisTool/deactivateTerrainAnalysis",
  "Data": {}
}

```

#### 返回示例

```json
{
  "StatusCode": 200
}

```

#### 注意事项

- 会销毁所有地形分析相关资源
- 清理后需要重新调用分析命令才能再次使用
- 如果未激活地形分析，调用此命令也会返回成功

---

### 12. getTerrainAnalysisInfo - 获取地形分析信息

#### 功能描述

获取当前地形分析的详细信息，包括状态、高程范围、坡度范围、网格信息和区域信息。

#### 前置条件

必须已有活动的地形分析

#### 参数说明

无参数

#### 调用示例

```json
{
  "CMD": "/analysisTool/getTerrainAnalysisInfo",
  "Data": {}
}

```

#### 返回示例

```json
{
  "StatusCode": 200,
  "State": 3,
  "ElevationRange": {
    "Min": 0.0,
    "Max": 50.0
  },
  "SlopeRange": {
    "Min": 0.0,
    "Max": 45.0
  },
  "GridSizeX": 512,
  "GridSizeY": 512,
  "CellSize": 0.5,
  "Region": {
    "VertexCount": 4,
    "Area": 10000.0
  }
}

```

#### 返回字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| State | Integer | 分析状态：0=未激活，1=绘制中，2=计算中，3=显示中 |
| ElevationRange.Min | Float | 最低高程（米） |
| ElevationRange.Max | Float | 最高高程（米） |
| SlopeRange.Min | Float | 最小坡度（度） |
| SlopeRange.Max | Float | 最大坡度（度） |
| GridSizeX | Integer | 网格 X 方向尺寸 |
| GridSizeY | Integer | 网格 Y 方向尺寸 |
| CellSize | Float | 网格单元大小（米） |
| Region.VertexCount | Integer | 区域顶点数量 |
| Region.Area | Float | 区域面积（平方米） |

#### 注意事项

- 如果没有活动的地形分析，会返回错误

---

## 错误处理

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| INVALID_PARAMETERS | 参数验证失败 | 检查必需参数是否提供，参数类型是否正确 |
| EXECUTION_FAILED | 分析工具创建/执行失败 | 检查蓝图资源是否存在，查看日志获取详细错误 |
| RESOURCE_NOT_FOUND | 资源加载失败 | 确保材质、蓝图、RenderTarget 等资源路径正确 |
| DEPENDENCY_FAILED | 依赖组件失败 | 确保 PlayerController、Pawn 等组件已正确初始化 |
| INTERNAL_ERROR | 内部错误 | 确保分析工具工厂已正确注册，World 对象有效 |

#### 错误返回示例

```json
{
  "StatusCode": 400,
  "Message": "必须先执行 showSkyline 命令"
}

```

```json
{
  "StatusCode": 400,
  "Message": "多边形至少需要 3 个顶点"
}

```

```json
{
  "StatusCode": 404,
  "Message": "无法加载后处理材质"
}

```

```json
{
  "StatusCode": 404,
  "Message": "没有活动的地形分析"
}

```

```json
{
  "StatusCode": 500,
  "Message": "创建 ViewshedObserver 失败"
}

```

```json
{
  "StatusCode": 500,
  "Message": "深度采样失败"
}

```

---

## 使用注意事项

### 天际线分析

- **显示顺序**: 必须先调用 `showSkyline`，再调用 `show2DSkyline`
- **资源管理**: 天际线效果会持续显示，不需要时应及时调用 `hideSkyline` 清理
- **性能影响**: 后处理材质会影响渲染性能，建议在需要时才启用

### 可视域分析

- **交互模式**: 需要用户两次点击完成，适合交互式场景
- **预览效果**: 第1次点击后会实时显示预览，方便用户调整
- **半径计算**: 半径由两次点击的距离自动计算，无需手动指定
- **参数调整**: FOV、Resolution、DepthBias 影响分析精度和性能

### 通视分析

- **射线检测**: 使用 ECC_Visibility 碰撞通道
- **遮挡判断**: 基于射线检测结果，精确判断通视情况
- **视觉反馈**: 绿色/红色线段直观显示通视结果

### 地形分析

- **交互模式**: `activateTerrainAnalysis` 需要用户绘制多边形，适合交互式场景
- **非交互模式**: `analyzeTerrainRegion` 直接传入坐标，适合程序化调用
- **预览效果**: 绘制过程中实时显示预览线段和鼠标跟随点
- **分析类型**: 等高线和坡度坡向两种类型互斥，每次只能选择一种
- **GPU 采样**: 使用 GPU 深度采样获取高程数据，性能较好
- **分辨率**: Resolution 参数影响分析精度和性能，建议 256-1024

### 性能考虑

- **天际线**: 后处理材质会影响帧率，建议在高性能设备上使用
- **可视域**: 高分辨率 RenderTarget 会增加显存占用
- **通视**: 射线检测性能开销较小，可频繁使用
- **地形分析**: GPU 深度采样性能较好，但高分辨率会增加计算时间

### 最佳实践

1. **按需启用**: 只在需要时启用分析工具，不用时及时清理
2. **参数优化**: 根据场景复杂度调整分辨率和精度参数
3. **用户引导**: 交互式命令需要提供清晰的用户提示
4. **错误处理**: 检查前置条件，避免无效调用
5. **地形分析**: 对于大面积区域，适当降低分辨率以提高性能
