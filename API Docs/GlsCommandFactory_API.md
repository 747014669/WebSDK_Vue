# Gls Command SDK 文档

## 概述
Gls 命令工厂管理场景、对象和UI相关的命令，提供模型显隐控制、属性操作、方法调用、关卡流送、序列播放、UI管理等功能。

**命令路径格式**: `/gls/CommandName`

**包含命令组**:

- **场景命令** (10个): 模型显隐、高亮、关卡流送、序列播放
- **对象命令** (9个): 属性获取/设置、方法执行、交互选择
- **UI命令** (1个): 工具取消

---

## 场景命令 (Scene Commands)

### 1. ShowModelByTags - 根据Tag显示/隐藏模型

#### 功能描述
批量控制带有指定Tag的Actor的显示/隐藏状态，支持同时设置多个Tag的显隐。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Tags | Array | 是 | - | Tag配置数组，每项包含Tag和Show字段 |
| Tags[].Tag | String | 是 | - | Actor的Tag标识 |
| Tags[].Show | Boolean | 是 | - | true=显示，false=隐藏 |

#### 调用示例
```json
{
  "CMD": "/gls/ShowModelByTags",
  "Data": {
    "Tags": [
      { "Tag": "Building_A", "Show": true },
      { "Tag": "Building_B", "Show": false },
      { "Tag": "Road_01", "Show": true }
    ]
  }
}

```

#### 返回示例
```json
{
  "StatusCode": 200
}

```

---

### 2. ShowModelChildrenByTag - 显示/隐藏模型及其子对象

#### 功能描述
控制带有指定Tag的Actor及其所有子Actor的显示/隐藏状态。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Tags | Array | 是 | - | Tag配置数组 |
| Tags[].Tag | String | 是 | - | Actor的Tag标识 |
| Tags[].Show | Boolean | 是 | - | true=显示，false=隐藏 |

#### 调用示例
```json
{
  "CMD": "/gls/ShowModelChildrenByTag",
  "Data": {
    "Tags": [
      { "Tag": "ParentActor", "Show": true }
    ]
  }
}

```

---

### 3. ShowModelByLayers - 根据Layer显示/隐藏模型

#### 功能描述
根据UE5的Layer系统控制Actor的显示/隐藏状态。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Layers | Array | 是 | - | Layer配置数组 |
| Layers[].Layer | String | 是 | - | Layer名称 |
| Layers[].Show | Boolean | 是 | - | true=显示，false=隐藏 |

#### 调用示例
```json
{
  "CMD": "/gls/ShowModelByLayers",
  "Data": {
    "Layers": [
      { "Layer": "Architecture", "Show": true },
      { "Layer": "Vegetation", "Show": false }
    ]
  }
}

```

---

### 4. DestroyModelByTags - 根据Tag删除模型

#### 功能描述
永久删除带有指定Tag的所有Actor。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Tags | Array[String] | 是 | - | 需要删除的Tag数组 |

#### 调用示例
```json
{
  "CMD": "/gls/DestroyModelByTags",
  "Data": {
    "Tags": ["TempObject", "DebugMarker"]
  }
}

```

#### 返回示例
```json
{
  "DestroyedCount": 15
}

```

---

### 5. HighlightModelByTag - 根据Tag高亮模型

#### 功能描述
使用 CustomDepth 和后处理材质实现模型描边高亮效果。系统会自动创建全局后处理盒子并加载 Outline 材质。

**技术实现**:

- 使用 UE5 的 CustomDepth 和 Stencil Value 机制
- 自动创建并管理 PostProcessVolume
- 加载材质: `/WebCore/Res/Materials/OutLine/PPI_OutlineMain.PPI_OutlineMain`
- 支持多通道高亮（1-6），不同通道可显示不同颜色

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Tag | String | 是 | - | 模型Tag标识 |
| Channel | Integer | 是 | - | 高亮通道（1-6），对应不同的描边颜色 |

#### 调用示例
```json
{
  "CMD": "/gls/HighlightModelByTag",
  "Data": {
    "Tag": "SelectedBuilding",
    "Channel": 1
  }
}

```

#### 返回示例
```json
{
  "StatusCode": 200
}

```

#### 特性说明

- **自动管理**: 首次调用时自动创建后处理盒子
- **多Tag支持**: 同一个模型可以被多个Tag高亮，只要包含该Tag即可
- **Channel覆盖**: 重复高亮同一Tag时，新的Channel会覆盖旧值
- **组件级别**: 对Actor的所有PrimitiveComponent生效（StaticMesh、SkeletalMesh等）

#### 注意事项

- 确保后处理材质资源存在于指定路径
- Channel值必须在1-6范围内
- 如果Tag不存在，命令会返回成功但记录警告日志

---

### 6. CancelHighlightByTag - 取消模型高亮

#### 功能描述
取消指定Tag或所有模型的高亮效果。智能检测组件是否被多个Tag使用，避免误关闭。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Tag | String | 否 | "" | 模型Tag，为空则取消所有高亮 |

#### 调用示例

**取消指定Tag的高亮**:

```json
{
  "CMD": "/gls/CancelHighlightByTag",
  "Data": {
    "Tag": "SelectedBuilding"
  }
}

```

**取消所有高亮**:

```json
{
  "CMD": "/gls/CancelHighlightByTag",
  "Data": {
    "Tag": ""
  }
}

```

或省略Tag参数:

```json
{
  "CMD": "/gls/CancelHighlightByTag",
  "Data": {}
}

```

#### 返回示例
```json
{
  "StatusCode": 200
}

```

#### 智能取消机制

- **多Tag检测**: 如果一个组件同时被多个Tag高亮，只有当所有Tag都取消后才会真正关闭CustomDepth
- **安全清理**: 取消所有高亮时会遍历所有组件，确保完全清理
- **状态管理**: 自动维护Tag到组件的映射关系

---

### 7. LoadStreamingLevel - 加载流送关卡

#### 功能描述
异步加载一个或多个流送关卡。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Levels | Array[String] | 是 | - | 关卡名称数组 |

#### 调用示例
```json
{
  "CMD": "/gls/LoadStreamingLevel",
  "Data": {
    "Levels": ["Level_District_A", "Level_District_B"]
  }
}

```

#### 返回示例
```json
{
  "Finished": true,
  "LoadedCount": 2
}

```

---

### 8. UnloadStreamingLevel - 卸载流送关卡

#### 功能描述
卸载已加载的流送关卡。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Levels | Array[String] | 是 | - | 关卡名称数组 |

#### 调用示例
```json
{
  "CMD": "/gls/UnloadStreamingLevel",
  "Data": {
    "Levels": ["Level_District_A"]
  }
}

```

#### 返回示例
```json
{
  "UnloadedCount": 1
}

```

---

### 9. PlaySequence - 播放序列动画

#### 功能描述
控制Level Sequence的播放、暂停、重置和重播。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Sequence | String | 否 | "" | 序列资源路径 |
| State | String | 否 | "play" | 状态：play/pause/reset/replay |
| Speed | Float | 否 | 1.0 | 播放速度倍率 |
| Progress | Float | 否 | 0.0 | 播放进度（0.0-1.0） |

#### 状态说明

- **play**: 播放序列
- **pause**: 暂停播放
- **reset**: 重置到起始位置
- **replay**: 从头重新播放

#### 调用示例
```json
{
  "CMD": "/gls/PlaySequence",
  "Data": {
    "Sequence": "/Game/Sequences/CameraFlythrough",
    "State": "play",
    "Speed": 1.5,
    "Progress": 0.0
  }
}

```

---

## 对象命令 (Object Commands)

### 10. GetPropertyById - 根据ID获取Actor属性

#### 功能描述
通过Actor的Tag标识获取其属性值。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Id | String | 是 | - | Actor的Tag标识 |
| Property | String | 是 | - | 属性名称 |

#### 调用示例
```json
{
  "CMD": "/gls/GetPropertyById",
  "Data": {
    "Id": "Building_001",
    "Property": "ActorLocation"
  }
}

```

#### 返回示例
```json
{
  "ActorLocation": {
    "X": 1000.0,
    "Y": 2000.0,
    "Z": 0.0
  }
}

```

---

### 11. GetPropertyByObjectPath - 根据ObjectPath获取对象属性

#### 功能描述
通过对象的完整路径获取其属性值。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| ObjectPath | String | 是 | - | 对象的完整路径 |
| Property | String | 是 | - | 属性名称 |

#### 调用示例
```json
{
  "CMD": "/gls/GetPropertyByObjectPath",
  "Data": {
    "ObjectPath": "/Game/Maps/MainLevel.MainLevel:PersistentLevel.StaticMeshActor_0",
    "Property": "bHidden"
  }
}

```

---

### 12. SetPropertyById - 根据ID设置Actor属性

#### 功能描述
通过Actor的Tag标识设置其属性值。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Id | String | 是 | - | Actor的Tag标识 |
| Property | String | 是 | - | 属性名称 |
| PropertyValue | Any | 是 | - | 属性值 |

#### 调用示例
```json
{
  "CMD": "/gls/SetPropertyById",
  "Data": {
    "Id": "Building_001",
    "Property": "ActorLocation",
    "PropertyValue": {
      "X": 1500.0,
      "Y": 2500.0,
      "Z": 100.0
    }
  }
}

```

---

### 13. SetPropertyByObjectPath - 根据ObjectPath设置对象属性

#### 功能描述
通过对象的完整路径设置其属性值。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| ObjectPath | String | 是 | - | 对象的完整路径 |
| Property | String | 是 | - | 属性名称 |
| PropertyValue | Any | 是 | - | 属性值 |

#### 调用示例
```json
{
  "CMD": "/gls/SetPropertyByObjectPath",
  "Data": {
    "ObjectPath": "/Game/Maps/MainLevel.MainLevel:PersistentLevel.StaticMeshActor_0",
    "Property": "bHidden",
    "PropertyValue": false
  }
}

```

---

### 14. ExecuteFunctionById - 根据ID执行Actor方法

#### 功能描述
通过Actor的Tag标识调用其蓝图或C++方法，支持传递参数和接收返回值。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Id | String | 是 | - | Actor的Tag标识 |
| Function | String | 是 | - | 方法名称 |
| (其他参数) | Any | 否 | - | 函数的输入参数 |

#### 调用示例
```json
{
  "CMD": "/gls/ExecuteFunctionById",
  "Data": {
    "Id": "Door_001",
    "Function": "OpenDoor",
    "Speed": 2.0,
    "bPlaySound": true
  }
}

```

#### 返回示例
```json
{
  "ReturnValue": true,
  "OutputParam": "Door opened successfully"
}

```

---

### 15. ExecuteFunctionByObjectPath - 根据ObjectPath执行对象方法

#### 功能描述
通过对象的完整路径调用其蓝图或C++方法。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| ObjectPath | String | 是 | - | 对象的完整路径 |
| Function | String | 是 | - | 方法名称 |
| (其他参数) | Any | 否 | - | 函数的输入参数 |

#### 调用示例
```json
{
  "CMD": "/gls/ExecuteFunctionByObjectPath",
  "Data": {
    "ObjectPath": "/Game/Blueprints/BP_Door.Default__BP_Door_C",
    "Function": "SetDoorState",
    "bOpen": true
  }
}

```

---

### 16. FrameSelect - 框选功能

#### 功能描述
通过鼠标框选在屏幕上选择多个Actor。用户需要进行两次点击：第一次点击设置框选的起点，第二次点击设置终点。框选过程中会实时显示选框矩形。支持按Tag前缀过滤和隐藏Actor的包含/排除。

**交互流程**:

1. 激活框选模式
2. 用户左键点击设置起点（显示选框Widget）
3. 鼠标移动时实时更新选框显示
4. 用户左键点击设置终点
5. 延迟0.5秒后返回选中的Actor列表
6. 右键点击可取消框选操作

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| bActive | Boolean | 否 | true | true=激活框选模式，false=取消框选 |
| TagPatterns | Array[String] | 否 | [] | Tag前缀排除列表，匹配这些前缀的Actor不会被框选 |
| bIncludeHidden | Boolean | 否 | false | 是否包含隐藏的Actor（IsHidden=true或IsHiddenEd=true） |

#### 调用示例

**激活框选模式**:

```json
{
  "CMD": "/gls/FrameSelect",
  "Data": {
    "bActive": true,
    "TagPatterns": ["System_", "Debug_"],
    "bIncludeHidden": false
  }
}

```

**取消框选模式**:

```json
{
  "CMD": "/gls/FrameSelect",
  "Data": {
    "bActive": false
  }
}

```

#### 返回示例

**成功框选（返回选中的Actor列表）**:

```json
{
  "Count": 3,
  "SelectedActors": [
    {
      "Tag": "Building_001",
      "ObjectPath": "/Game/Maps/MainLevel.MainLevel:PersistentLevel.Building_001"
    },
    {
      "Tag": "Building_002",
      "ObjectPath": "/Game/Maps/MainLevel.MainLevel:PersistentLevel.Building_002"
    },
    {
      "Tag": "Road_01",
      "ObjectPath": "/Game/Maps/MainLevel.MainLevel:PersistentLevel.Road_01"
    }
  ]
}

```

**取消框选（右键点击或调用bActive=false）**:

```json
{
  "StatusCode": 20001,
  "Message": "框选已取消",
  "Cancelled": true
}

```

#### 返回字段说明

| 字段 | 类型 | 描述 |
|---|---|---|
| Count | Integer | 选中的Actor数量 |
| SelectedActors | Array | 选中的Actor列表 |
| SelectedActors[].Tag | String | Actor的第一个Tag标识 |
| SelectedActors[].ObjectPath | String | Actor的完整对象路径 |
| StatusCode | Integer | 错误码（仅在取消时返回，值为20001） |
| Message | String | 操作消息 |
| Cancelled | Boolean | 是否被取消 |

#### 特性说明

**选框显示**:

- 激活后第一次点击显示选框Widget
- 鼠标移动时实时更新选框矩形
- 第二次点击后保持选框显示0.5秒，然后返回结果

**Actor过滤**:

- 自动排除系统Actor（AWorldSettings、APlayerController、APlayerCameraManager等）
- 只选择有可渲染组件的Actor（StaticMesh或SkeletalMesh）
- 支持按Tag前缀排除（TagPatterns参数）
- 支持隐藏Actor的包含/排除（bIncludeHidden参数）

**隐藏检测**:

- 检查 `IsHidden()` 状态
- 检查 `IsHiddenEd()` 状态（编辑器隐藏）
- 检查根组件的可见性

**屏幕空间投影**:

- 使用PlayerController的ProjectWorldLocationToScreen进行投影
- 基于Actor的ComponentsBoundingBox进行碰撞检测
- 支持部分在屏幕外的Actor选择

#### 注意事项

- 此命令使用延迟响应机制，激活后需要等待用户交互
- 右键点击会立即取消框选并返回取消响应
- 框选结果返回前会延迟0.5秒，让用户看到最终的选框
- TagPatterns是排除列表，不是包含列表
- 如果Actor没有Tag，则不会被TagPatterns过滤排除

---

### 17. GetHitResultUnderCursor - 获取鼠标下的碰撞结果

#### 功能描述
激活鼠标点击监听，返回点击位置的射线检测结果。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| bActive | Boolean | 否 | true | true=激活监听，false=取消监听 |

#### 调用示例
```json
{
  "CMD": "/gls/GetHitResultUnderCursor",
  "Data": {
    "bActive": true
  }
}

```

#### 返回示例（点击后）
```json
{
  "bSucceed": true,
  "Location": [1234.5, 5678.9, 0.0],
  "ObjectPath": "/Game/Maps/MainLevel.MainLevel:PersistentLevel.Floor_0"
}

```

**注意**: 

- 此命令使用延迟响应机制
- 激活后每次点击都会返回结果
- 坐标使用系统单位（米）

---

### 18. GetTagsWithPattern - 根据模式获取Tag列表

#### 功能描述
查找场景中所有以指定前缀开头的Actor Tag。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Pattern | String | 是 | - | Tag前缀模式 |

#### 调用示例
```json
{
  "CMD": "/gls/GetTagsWithPattern",
  "Data": {
    "Pattern": "Building_"
  }
}

```

#### 返回示例
```json
{
  "Tags": [
    "Building_001",
    "Building_002",
    "Building_Tower_A"
  ]
}

```

---

## UI命令 (UI Commands)

### 19. ToolCancel - 工具取消

#### 功能描述
广播工具取消事件，用于中断当前正在进行的工具操作。

#### 参数说明
无参数。

#### 调用示例
```json
{
  "CMD": "/gls/ToolCancel",
  "Data": {}
}

```

#### 事件说明
此命令会触发 `UGlsCommandFactory::OnToolCancel` 委托，其他系统可以监听此事件来响应取消操作。

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 400 | 参数验证失败 | 检查必选参数是否提供，参数类型是否正确 |
| 404 | 资源未找到 | 检查Tag、ObjectPath或资源路径是否正确 |
| 500 | 执行失败 | 检查日志获取详细错误信息 |
| 501 | 功能未实现 | 该功能正在开发中 |
| 503 | 服务不可用 | 系统正忙，稍后重试 |

### 错误返回示例
```json
{
  "StatusCode": 404,
  "ErrorMessage": "无法查找Id为 Building_999 的对象"
}

```

---

## 单位转换说明

### 需要单位转换的参数
以下参数使用**系统单位（米）**，会自动转换为**UE5单位（厘米）**：

- **SetRegionHighlight**: `Corner1`, `Corner2`
- **GetHitResultUnderCursor**: 返回的 `Location`
- **GetPropertyById/GetPropertyByObjectPath**: 位置相关属性
- **SetPropertyById/SetPropertyByObjectPath**: 位置相关属性

### 不需要单位转换的参数

- 角度值（Rotation）
- 缩放值（Scale）
- 颜色值（Color）
- 布尔值、整数、字符串
- UI坐标（屏幕像素）

---

## 使用注意事项

### 1. Tag命名规范

- 使用有意义的前缀（如 `Building_`, `Road_`, `Tree_`）
- 避免使用特殊字符
- 保持命名一致性

### 2. ObjectPath格式
```
/Game/Maps/MapName.MapName:PersistentLevel.ActorName_0

```

### 3. 性能考虑

- **批量操作**: 使用数组参数一次处理多个对象
- **Tag查询**: 避免频繁查询，考虑缓存结果
- **截图**: 高分辨率截图会消耗较多资源

### 4. 资源依赖
以下功能需要用户提供额外资源：

- **区域高亮**: `/WebCore/Materials/HighlightRegion_Inst`
- **模型高亮**: `/WebCore/Res/Materials/OutLine/PPI_OutlineMain.PPI_OutlineMain` (后处理材质)

### 5. 异步操作
以下命令使用延迟响应：

- `LoadStreamingLevel`
- `GetHitResultUnderCursor`（激活后）

---

## 完整调用流程示例

### 场景1: 显示特定区域的建筑

```json
// 1. 隐藏所有建筑
{
  "CMD": "/gls/ShowModelByTags",
  "Data": {
    "Tags": [
      { "Tag": "Building", "Show": false }
    ]
  }
}

// 2. 只显示A区建筑
{
  "CMD": "/gls/GetTagsWithPattern",
  "Data": {
    "Pattern": "Building_A_"
  }
}

// 3. 根据返回的Tag列表显示
{
  "CMD": "/gls/ShowModelByTags",
  "Data": {
    "Tags": [
      { "Tag": "Building_A_001", "Show": true },
      { "Tag": "Building_A_002", "Show": true }
    ]
  }
}

// 4. 高亮选中的建筑（通道1 - 例如红色描边）
{
  "CMD": "/gls/HighlightModelByTag",
  "Data": {
    "Tag": "Building_A_001",
    "Channel": 1
  }
}

// 5. 同时高亮另一栋建筑（通道2 - 例如蓝色描边）
{
  "CMD": "/gls/HighlightModelByTag",
  "Data": {
    "Tag": "Building_A_002",
    "Channel": 2
  }
}

```

### 场景2: 交互式对象选择

```json
// 1. 激活鼠标点击监听
{
  "CMD": "/gls/GetHitResultUnderCursor",
  "Data": {
    "bActive": true
  }
}

// 2. 用户点击后获取对象路径
// 返回: { "ObjectPath": "...", "Location": [...] }

// 3. 获取对象属性
{
  "CMD": "/gls/GetPropertyByObjectPath",
  "Data": {
    "ObjectPath": "/Game/Maps/MainLevel.MainLevel:PersistentLevel.Building_0",
    "Property": "Tags"
  }
}

// 4. 高亮选中的对象
{
  "CMD": "/gls/HighlightModelByTag",
  "Data": {
    "Tag": "Building_001",
    "Channel": 1
  }
}

// 5. 取消监听
{
  "CMD": "/gls/GetHitResultUnderCursor",
  "Data": {
    "bActive": false
  }
}

```

### 场景3: 多通道高亮分类显示

```json
// 1. 高亮不同类型的建筑使用不同通道
// 通道1 - 住宅建筑（例如红色）
{
  "CMD": "/gls/HighlightModelByTag",
  "Data": {
    "Tag": "Residential",
    "Channel": 1
  }
}

// 通道2 - 商业建筑（例如蓝色）
{
  "CMD": "/gls/HighlightModelByTag",
  "Data": {
    "Tag": "Commercial",
    "Channel": 2
  }
}

// 通道3 - 工业建筑（例如绿色）
{
  "CMD": "/gls/HighlightModelByTag",
  "Data": {
    "Tag": "Industrial",
    "Channel": 3
  }
}

// 2. 更新某个分类的高亮通道
{
  "CMD": "/gls/HighlightModelByTag",
  "Data": {
    "Tag": "Residential",
    "Channel": 4
  }
}

// 3. 取消特定分类的高亮
{
  "CMD": "/gls/CancelHighlightByTag",
  "Data": {
    "Tag": "Commercial"
  }
}

// 4. 清除所有高亮
{
  "CMD": "/gls/CancelHighlightByTag",
  "Data": {}
}

```

### 场景4: 动态加载和播放序列

```json
// 1. 加载流送关卡
{
  "CMD": "/gls/LoadStreamingLevel",
  "Data": {
    "Levels": ["CinematicLevel"]
  }
}

// 2. 播放序列动画
{
  "CMD": "/gls/PlaySequence",
  "Data": {
    "Sequence": "/Game/Sequences/Intro",
    "State": "play",
    "Speed": 1.0
  }
}

// 3. 暂停播放
{
  "CMD": "/gls/PlaySequence",
  "Data": {
    "State": "pause"
  }
}

// 4. 从50%位置继续播放
{
  "CMD": "/gls/PlaySequence",
  "Data": {
    "State": "play",
    "Progress": 0.5
  }
}

```

---

## 参考资料

- **命令基类**: `UCommandBase` - WebFrameWork插件
- **工厂基类**: `UCommandFactoryBase` - WebFrameWork插件
- **日志宏**: `.kiro/steering/logging-macros.md`
- **单位转换**: `.kiro/steering/unit-conversion.md`
- **相关命令工厂**:
  - CameraManager - 相机控制
  - PoiManager - POI管理
  - AssetLibraryManager - 资源库管理

---
