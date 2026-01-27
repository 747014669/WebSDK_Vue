# MeasurementFactory API 文档

## 概述

MeasurementFactory 负责管理测量工具的创建、交互和结果查询功能。支持坐标测量、距离测量、面积测量和高度测量四种类型，提供一步到位和鼠标交互两种使用模式。

**命令路径格式**: `/measurement/CommandName`

**包含命令组**:

- **测量命令** (3个): 一步测量、鼠标交互测量、清除测量

---

## 测量命令

### 1. measure - 一步到位测量

**功能描述**:

根据提供的点数组直接完成测量并返回结果。适用于前端已知所有测量点坐标的场景，无需用户交互。

**参数说明**:

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Type | String | 是 | - | 测量类型："coordinate"（坐标）、"distance"（距离）、"area"（面积）、"height"（高度） |
| Points | Array[Array[Float]] | 是 | - | 测量点数组，每个点为 [x, y, z]，使用系统单位（米） |

**测量类型要求**:

| 类型 | 最少点数 | 说明 |
|------|----------|------|
| coordinate | 1 | 单点坐标测量 |
| distance | 2 | 两点间距离测量 |
| area | 3 | 多边形面积测量（至少3个点） |
| height | 2 | 两点间高度差测量 |

**调用示例**:

**坐标测量**:

```json
{
  "CMD": "/measurement/measure",
  "Data": {
    "Type": "coordinate",
    "Points": [
      [100.0, 200.0, 50.0]
    ]
  }
}

```

**距离测量**:

```json
{
  "CMD": "/measurement/measure",
  "Data": {
    "Type": "distance",
    "Points": [
      [0.0, 0.0, 0.0],
      [100.0, 0.0, 0.0]
    ]
  }
}

```

**面积测量**:

```json
{
  "CMD": "/measurement/measure",
  "Data": {
    "Type": "area",
    "Points": [
      [0.0, 0.0, 0.0],
      [100.0, 0.0, 0.0],
      [100.0, 100.0, 0.0],
      [0.0, 100.0, 0.0]
    ]
  }
}

```

**高度测量**:

```json
{
  "CMD": "/measurement/measure",
  "Data": {
    "Type": "height",
    "Points": [
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 50.0]
    ]
  }
}

```

**返回示例**:

**坐标测量返回**:

```json
{
  "StatusCode": 200,
  "MeasurementId": 1,
  "Result": {
    "Coordinate": [100.0, 200.0, 50.0]
  }
}

```

**距离测量返回**:

```json
{
  "StatusCode": 200,
  "MeasurementId": 2,
  "Result": {
    "Distance": 100.0
  }
}

```

**面积测量返回**:

```json
{
  "StatusCode": 200,
  "MeasurementId": 3,
  "Result": {
    "Area": 10000.0
  }
}

```

**高度测量返回**:

```json
{
  "StatusCode": 200,
  "MeasurementId": 4,
  "Result": {
    "HeightDifference": 50.0
  }
}

```

**注意事项**:

- 点坐标使用系统单位（米），会自动转换为 UE5 单位（厘米）
- 距离和高度结果使用系统单位（米）
- 面积结果使用平方米（m²）
- 测量完成后会在场景中显示测量标签
- 每次测量会生成唯一的 MeasurementId，用于后续清除操作

---

### 2. mouseMeasurement - 鼠标交互测量

**功能描述**:

启动鼠标交互测量模式，用户通过鼠标点击场景添加测量点，右键完成测量。适用于需要用户在场景中手动选点的场景。

**参数说明**:

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Type | String | 是 | - | 测量类型："coordinate"、"distance"、"area"、"height" |

**交互流程**:

1. 调用命令启动测量模式
2. 用户左键点击场景添加测量点
3. 鼠标移动时显示预览线/面
4. 用户右键完成测量
5. 返回测量结果

**特殊行为**:

- **高度测量**: 添加第2个点后自动完成，无需右键
- **其他测量**: 需要右键完成，点数不足时会取消测量

**调用示例**:

```json
{
  "CMD": "/measurement/mouseMeasurement",
  "Data": {
    "Type": "distance"
  }
}

```

**返回示例**:

**成功返回**（用户完成测量后）:

```json
{
  "StatusCode": 200,
  "Result": {
    "Distance": 150.5
  }
}

```

**取消返回**（用户右键但点数不足）:

```json
{
  "StatusCode": 400,
  "Message": "测量点数不足，已取消"
}

```

**注意事项**:

- 命令会延迟响应，直到用户完成或取消测量
- 同一时间只能有一个活动的鼠标测量
- 启动新的鼠标测量会自动禁用之前的测量
- 鼠标移动时会实时更新预览标签
- 高度测量添加第2个点后自动完成并返回结果

**鼠标操作**:

- **左键点击**: 添加测量点
- **右键点击**: 完成测量（高度测量除外）
- **鼠标移动**: 更新预览标签位置

---

### 3. clearMeasurement - 清除测量

**功能描述**:

清除指定的测量或清除所有测量，移除场景中的测量标签和线条。

**参数说明**:

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| MeasurementId | Integer | 否 | - | 要清除的测量 ID，不提供则清除所有测量 |

**调用示例**:

**清除指定测量**:

```json
{
  "CMD": "/measurement/clearMeasurement",
  "Data": {
    "MeasurementId": 1
  }
}

```

**清除所有测量**:

```json
{
  "CMD": "/measurement/clearMeasurement",
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

- 清除后无法恢复测量结果
- 清除会立即移除场景中的所有相关 UI 元素
- 如果指定的 MeasurementId 不存在，会返回错误

---

## 错误处理

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| INVALID_PARAMETERS | 参数验证失败 | 检查 Type 是否为有效值，Points 数组是否符合要求 |
| EXECUTION_FAILED | 测量创建/执行失败 | 检查场景是否正确初始化，查看日志获取详细错误 |
| INTERNAL_ERROR | 内部错误 | 确保测量工厂已正确注册，World 对象有效 |
| DEPENDENCY_FAILED | 依赖组件失败 | 确保 PlayerController 和相关组件已正确初始化 |

**错误返回示例**:

```json
{
  "StatusCode": 400,
  "Message": "无效的测量类型: invalid_type"
}

```

```json
{
  "StatusCode": 400,
  "Message": "点数不足，需要至少 2 个点，实际 1 个"
}

```

```json
{
  "StatusCode": 500,
  "Message": "创建测量失败"
}

```

---

## 单位转换说明

### 需要单位转换的参数

- **Points**: [x, y, z] 坐标使用系统单位（米），自动转换为 UE5 单位（厘米）
- **Distance**: 距离结果使用系统单位（米）
- **HeightDifference**: 高度差结果使用系统单位（米）
- **Coordinate**: 坐标结果已转换为系统单位（米）

### 不需要单位转换的参数

- **Area**: 面积结果使用平方米（m²），已自动从平方厘米转换
- **Type**: 测量类型（字符串）
- **MeasurementId**: 测量 ID（整数）

---

## 使用注意事项

### 测量类型选择

- **坐标测量**: 获取单点的世界坐标
- **距离测量**: 测量两点间的直线距离
- **面积测量**: 测量多边形的投影面积（XY 平面）
- **高度测量**: 测量两点间的垂直高度差（Z 轴）

### 性能考虑

- **测量数量**: 建议同时显示的测量不超过 50 个
- **面积测量**: 点数过多（>100）会影响计算性能
- **鼠标更新**: 鼠标测量模式下每帧更新预览，注意性能开销

### 最佳实践

1. **一步测量**: 适用于已知坐标的批量测量
2. **鼠标测量**: 适用于需要用户交互选点的场景
3. **及时清理**: 不需要的测量及时清除，避免场景混乱
4. **保存结果**: 重要的测量结果应保存到前端，清除后无法恢复

### 坐标系统

- **世界坐标**: 使用 UE5 世界坐标系（Z 轴向上）
- **单位转换**: 前端使用米，UE5 使用厘米，自动转换
- **精度**: 坐标精度为厘米级，距离精度为米级（小数点后2位）

---

## 完整使用流程示例

### 场景1: 批量测量（一步到位）

```json
// 1. 测量多个点的坐标
{
  "CMD": "/measurement/measure",
  "Data": {
    "Type": "coordinate",
    "Points": [[100.0, 200.0, 50.0]]
  }
}
// 返回: { "StatusCode": 200, "MeasurementId": 1, "Result": { "Coordinate": [100.0, 200.0, 50.0] } }

// 2. 测量两点间距离
{
  "CMD": "/measurement/measure",
  "Data": {
    "Type": "distance",
    "Points": [
      [0.0, 0.0, 0.0],
      [100.0, 0.0, 0.0]
    ]
  }
}
// 返回: { "StatusCode": 200, "MeasurementId": 2, "Result": { "Distance": 100.0 } }

// 3. 测量区域面积
{
  "CMD": "/measurement/measure",
  "Data": {
    "Type": "area",
    "Points": [
      [0.0, 0.0, 0.0],
      [100.0, 0.0, 0.0],
      [100.0, 100.0, 0.0],
      [0.0, 100.0, 0.0]
    ]
  }
}
// 返回: { "StatusCode": 200, "MeasurementId": 3, "Result": { "Area": 10000.0 } }

// 4. 清除所有测量
{
  "CMD": "/measurement/clearMeasurement",
  "Data": {}
}

```

### 场景2: 交互式测量（鼠标取点）

```json
// 1. 启动距离测量
{
  "CMD": "/measurement/mouseMeasurement",
  "Data": {
    "Type": "distance"
  }
}
// 用户操作：
// - 左键点击第1个点
// - 鼠标移动（显示预览线）
// - 左键点击第2个点
// - 右键完成测量
// 返回: { "StatusCode": 200, "Result": { "Distance": 150.5 } }

// 2. 启动面积测量
{
  "CMD": "/measurement/mouseMeasurement",
  "Data": {
    "Type": "area"
  }
}
// 用户操作：
// - 左键点击多个点（至少3个）
// - 鼠标移动（显示预览面）
// - 右键完成测量
// 返回: { "StatusCode": 200, "Result": { "Area": 2500.0 } }

// 3. 启动高度测量（自动完成）
{
  "CMD": "/measurement/mouseMeasurement",
  "Data": {
    "Type": "height"
  }
}
// 用户操作：
// - 左键点击第1个点
// - 左键点击第2个点（自动完成，无需右键）
// 返回: { "StatusCode": 200, "Result": { "HeightDifference": 25.5 } }

```

### 场景3: 混合使用

```json
// 1. 一步测量已知点
{
  "CMD": "/measurement/measure",
  "Data": {
    "Type": "distance",
    "Points": [
      [0.0, 0.0, 0.0],
      [50.0, 0.0, 0.0]
    ]
  }
}
// 返回: { "StatusCode": 200, "MeasurementId": 1, "Result": { "Distance": 50.0 } }

// 2. 启动鼠标测量让用户选点
{
  "CMD": "/measurement/mouseMeasurement",
  "Data": {
    "Type": "area"
  }
}
// 用户完成后返回: { "StatusCode": 200, "Result": { "Area": 3000.0 } }

// 3. 清除第一个测量
{
  "CMD": "/measurement/clearMeasurement",
  "Data": {
    "MeasurementId": 1
  }
}

// 4. 清除所有剩余测量
{
  "CMD": "/measurement/clearMeasurement",
  "Data": {}
}

```

---

## 技术实现说明

### 测量计算方法

**坐标测量**:

- 直接返回点的世界坐标

**距离测量**:

```cpp
Distance = sqrt((x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2)

```

**面积测量**:

- 使用多边形投影到 XY 平面
- 应用 Shoelace 公式计算面积

```cpp
Area = 0.5 * |Σ(xi * yi+1 - xi+1 * yi)|

```

**高度测量**:

```cpp
HeightDifference = |z2 - z1|

```

### UI 显示

**测量标签**:

- 使用 UMG Widget 显示测量结果
- 标签位置跟随测量点
- 支持自定义样式和颜色

**预览显示**:

- 鼠标测量模式下实时显示预览
- 距离：显示虚线和临时距离值
- 面积：显示多边形轮廓和临时面积值
- 高度：显示垂直线和临时高度值

### 射线检测

**鼠标取点**:

- 使用 `GetHitResultUnderCursor` 进行射线检测
- 碰撞通道：ECC_Visibility
- 每帧更新鼠标位置（约 60 FPS）

### 生命周期管理

**Widget 管理**:

- 每个测量创建独立的 UMeasurementWidget
- Widget 添加到视口的高层级（Z-Order: 100）
- 清除测量时自动移除 Widget

**ID 管理**:

- 使用递增计数器生成唯一 ID
- ID 从 1 开始，每次创建测量递增
- 重置工厂时计数器归零

---

## 蓝图支持

MeasurementFactory 提供完整的蓝图接口，可在蓝图中调用：

**可用函数**:

- `StartMeasurement(Type, bEnableMouseInput)` - 开始测量
- `CreateMeasurement(Type, Points)` - 创建测量
- `AddPoint(MeasurementId, WorldPos)` - 添加测量点
- `FinishMeasurement(MeasurementId)` - 完成测量
- `ClearMeasurement(MeasurementId)` - 清除测量
- `ClearAllMeasurements()` - 清除所有测量
- `GetMeasurementResult(MeasurementId, OutData)` - 获取测量结果
- `IsMeasurementComplete(MeasurementId)` - 检查是否完成
- `CancelMeasurement(MeasurementId)` - 取消测量
- `EnableMouseInputMode(MeasurementId, bEnable)` - 启用鼠标模式

**委托事件**:

- `OnMeasurementPointAdded(MeasurementId, Point)` - 添加点时触发
- `OnMeasurementCompleted(MeasurementId, Data)` - 完成测量时触发

---

## 版本历史

- **v1.0** - 初始版本，包含 3 个命令
  - measure - 一步到位测量
  - mouseMeasurement - 鼠标交互测量
  - clearMeasurement - 清除测量

---

## 参考资料

- **命令基类**: `UCommandBase` - WebFrameWork 插件
- **交互命令基类**: `UInteractiveCommandBase` - WebFrameWork 插件
- **工厂基类**: `UCommandFactoryBase` - WebFrameWork 插件
- **测量 Widget**: `UMeasurementWidget` - WebCore 插件
- **日志宏**: `.kiro/steering/logging-macros.md`
- **单位转换**: `.kiro/steering/unit-conversion.md`
- **相关命令工厂**:

  - CameraManager - 相机控制
  - MarkManager - 路径和贴花管理
  - GlsCommandFactory - 场景和对象管理
