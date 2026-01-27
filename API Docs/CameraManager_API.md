# CameraManager API 文档

## 概述
CameraManager负责注册并执行所有与相机相关的Web命令，涵盖位置/旋转控制、变焦、分屏对比和相机漫游等功能。
本模块旨在提供一个统一的接口，用于从Web端控制UE中的相机行为，确保稳定性和可扩展性。

---

## 命令索引

### 1. setDesiredPosition - 设置相机综合状态

**功能描述**: 
此命令提供了一个强大的"一步到位"功能，允许您同时设置相机的位置和旋转。相机将移动到从目标点沿视线方向后退 Zoom 距离的位置。它利用 `SmoothTransitionManager` 来确保所有变换都以平滑的动画过渡，从而提供更优的视觉体验。您可以自定义过渡动画的时长。

**参数**:

| 参数 | 类型 | 必选 | 默认值 | 描述 |
|---|---|---|---|---|
| newLocation | Array[Float] | 是 | - | 目标世界坐标 `[x, y, z]`。系统会自动进行单位换算。 |
| NewRotation | Array[Float] | 否 | `[0,0,0]` | 目标旋转 `[pitch, yaw, roll]` (单位：度)。如果未提供，则保持当前旋转。 |
| Zoom | Float | 否 | `50.0` | 目标点到相机的距离（单位：米）。最终相机位置 = 目标点 - 朝向 × Zoom。有效范围：1m - 10km。 |
| duration | Float | 否 | `1.25` | 过渡动画的时长（单位：秒）。推荐范围：0-60。值为0将瞬时完成。 |

**调用示例**:

```json
{
  "CMD": "/cameraManager/setDesiredPosition",
  "Data": {
    "newLocation": [1000.0, 2000.0, 500.0],
    "NewRotation": [45.0, 90.0, 0.0],
    "Zoom": 100.0,
    "duration": 2.0
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

**注意点**:

- `newLocation` 是必需的，否则命令将失败。
- 如果您只想更新位置，可以省略 `NewRotation`。
- `Zoom` 参数表示目标点到相机的距离，相机最终位置 = 目标点 - 朝向 × Zoom。
- `duration` 值过大可能导致过渡动画看起来过于缓慢。
- 所有位置参数会自动从系统单位转换为 UE5 单位。

---

### 2. setDesiredLocation - 设置相机位置

**功能描述**: 
此命令专注于更新相机的位置，同时保持当前旋转不变。相机将移动到从目标点沿当前视线方向后退 Zoom 距离的位置。它使用 `SmoothTransitionManager` 来实现平滑的过渡动画。

**参数**

| 参数 | 类型 | 必选 | 默认值 | 描述 |
|---|---|---|---|---|
| Location | Array[Float] | 是 | - | 目标世界坐标 `[x, y, z]`。 |
| Zoom | Float | 否 | `50.0` | 目标点到相机的距离（单位：米）。最终相机位置 = 目标点 - 朝向 × Zoom。有效范围：1m - 10km。 |
| duration | Float | 否 | `0.75` | 过渡动画的时长。如果提供的值小于或等于0，系统将回退到默认值 `1.33` 秒。 |

**调用示例**

```json
{
  "CMD": "/cameraManager/setDesiredLocation",
  "Data": {
    "Location": [1500.0, 2500.0, 600.0],
    "Zoom": 80.0,
    "duration": 1.5
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

**注意点**:

- 此命令不会影响相机的旋转。
- `Zoom` 参数表示目标点到相机的距离，相机最终位置 = 目标点 - 当前朝向 × Zoom。
- 位置参数会自动从系统单位转换为 UE5 单位。

---

### 3. setDesiredYaw - 设置相机偏航角

**功能描述**: 
专门用于调整相机的水平朝向（偏航角）。使用默认的1秒平滑过渡。

**参数**

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| NewYaw | Float | 是 | 目标偏航角（单位：度）。 |

**调用示例**

```json
{
  "CMD": "/cameraManager/setDesiredYaw",
  "Data": {
    "NewYaw": 180.0
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

---

### 4. setDesiredPitch - 设置相机俯仰角

**功能描述**: 
专门用于调整相机的垂直朝向（俯仰角）。使用默认的1秒平滑过渡。

**参数**

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| NewPitch | Float | 是 | 目标俯仰角（单位：度）。 |

**调用示例**

```json
{
  "CMD": "/cameraManager/setDesiredPitch",
  "Data": {
    "NewPitch": -30.0
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

**注意点**:

- 俯仰角通常限制在-90到90度之间，以避免相机翻转。

---

### 5. setDesiredZoom - 设置相机变焦

**功能描述**: 
沿当前视线方向移动相机，实现变焦效果。正值向前移动（拉近），负值向后移动（拉远）。使用默认的1秒平滑过渡。

**参数**

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| Zoom | Float | 是 | 沿视线方向移动的距离（单位：米）。正值向前，负值向后。有效范围：-10km 到 10km。 |

**调用示例**

```json
{
  "CMD": "/cameraManager/setDesiredZoom",
  "Data": {
    "Zoom": 50.0
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

**注意点**:

- 此命令不会改变相机的旋转，只改变位置。
- 正值使相机向前移动（拉近），负值使相机向后移动（拉远）。
- 变焦参数会自动从系统单位转换为 UE5 单位。

---

### 6. getCameraTransform - 获取相机变换信息

**功能描述**: 
此命令用于获取相机在世界中的当前位置和旋转信息。这是一个同步操作，会立即返回相机的实时变换数据。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| - | - | - | 无需参数。 |

**请求示例**:

```json
{
  "CMD": "/cameraManager/getCameraTransform",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 200,
  "Location": [1000.0, 2000.0, 500.0],
  "Rotation": [45.0, 90.0, 0.0]
}

```

**返回字段说明**:

| 字段 | 类型 | 描述 |
|---|---|---|
| StatusCode | Integer | 状态码，200 表示成功 |
| Location | Array[Float] | 相机的世界坐标 `[x, y, z]`，已转换为系统单位 |
| Rotation | Array[Float] | 相机的旋转 `[pitch, yaw, roll]`，单位为度 |

**注意点**:

- 位置信息已自动从 UE5 单位转换为系统单位。
- 旋转信息以度为单位，顺序为 Pitch、Yaw、Roll。

---

### 7. splitScreen - 启用分屏对比

**功能描述**: 
创建一个分屏视图，用于并排比较两个不同的场景或方案。每个屏幕将只显示具有特定标签（Tag）的Actor。

**参数**

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| Tag1 | String | 是 | 主屏幕（左侧）中可见Actor的标签。 |
| Tag2 | String | 是 | 分屏（右侧）中可见Actor的标签。 |

**调用示例**

```json
{
  "CMD": "/cameraManager/splitScreen",
  "Data": {
    "Tag1": "PlanA",
    "Tag2": "PlanB"
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

**注意点**:

- 此命令会创建一个新的玩家控制器和相机，可能会对性能产生轻微影响。
- 确保场景中存在具有指定标签的Actor，否则对应的屏幕可能是空的。
- Tag1 和 Tag2 都是必需的参数。

---

### 8. endSplitScreen - 禁用分屏

**功能描述**: 
关闭分屏视图，恢复到正常的单屏模式。此命令会移除分屏时创建的额外玩家控制器，并恢复所有Actor的原始可见性。

**参数**:
无。

**调用示例**:

```json
{
  "CMD": "/cameraManager/endSplitScreen",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

**注意点**:

- 在调用 `endSplitScreen` 之前，不要手动修改由 `splitScreen` 命令设置的Actor可见性或所有权，否则可能导致状态不一致。

---

### 9. startCameraRoaming - 开始相机漫游

**功能描述**: 
根据预定义的路径点和旋转，启动一段自动化的相机漫游。漫游可以是平滑的曲线或线性移动。支持两种时长控制模式："分段时长"和"总时长"。漫游完成后会触发一个回调。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| waypoints | Array[Array[Float]] | 是 | 漫游路径的路径点 `[x, y, z]` 数组。至少需要2个点才能构成一段路径。 |
| rotations | Array[Array[Float]] | 是 | 与每个路径点对应的旋转 `[pitch, yaw, roll]` 数组。其数量必须与 `waypoints` 相同。 |
| segmentDurations | Array[Float] | 否 | 每个分段的持续时间数组。其长度应为 `waypoints` 数量 - 1。 |
| totalDuration | Float | 否 | 整个漫游的总时长（单位：秒）。此参数与 `segmentDurations` 互斥。 |

**重要**: 您必须提供 `segmentDurations` 或 `totalDuration` 中的一个，但不能同时提供。`rotations` 是必需的参数。

**总时长模式示例**:

```json
{
  "CMD": "/cameraManager/startCameraRoaming",
  "Data": {
    "waypoints": [
      [100.0, 200.0, 300.0],
      [400.0, 500.0, 600.0]
    ],
    "rotations": [
      [-30.0, 0.0, 0.0],
      [-45.0, 90.0, 0.0]
    ],
    "totalDuration": 10.0
  }
}

```

**分段时长模式示例**:

```json
{
  "CMD": "/cameraManager/startCameraRoaming",
  "Data": {
    "waypoints": [
      [100.0, 200.0, 300.0],
      [400.0, 500.0, 600.0],
      [600.0, 800.0, 700.0]
    ],
    "rotations": [
      [-30.0, 0.0, 0.0],
      [-45.0, 90.0, 0.0],
      [-20.0, 180.0, 0.0]
    ],
    "segmentDurations": [5.0, 6.5]
  }
}

```

**完成回调示例**

```json
{
  "CMD": "/cameraManager/startCameraRoaming_Callback",
  "Data": {
    "success": true,
    "message": "roaming finished",
    "event": "roamingCompleted"
  }
}

```

**注意点**:

- `waypoints` 和 `rotations` 数组的长度必须匹配。
- 如果同时提供了 `totalDuration` 和 `segmentDurations`，`totalDuration` 将被优先使用。
- 漫游开始后，用户的输入通常会被禁用，直到漫游结束或被手动停止。
- 所有位置参数会自动从系统单位转换为 UE5 单位。

---

### 10. pauseCameraRoaming - 暂停相机漫游

**功能描述**: 
暂停当前正在进行的相机漫游。相机将停留在当前位置和旋转。

**参数**:
无。

**调用示例**:

```json
{
  "CMD": "/cameraManager/pauseCameraRoaming",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

---

### 11. resumeCameraRoaming - 恢复相机漫游

**功能描述**: 
从上次暂停的位置继续相机漫游。

**参数**:
无。

**调用示例**:

```json
{
  "CMD": "/cameraManager/resumeCameraRoaming",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

---

### 12. stopCameraRoaming - 停止相机漫游

**功能描述**: 
立即终止当前的相机漫游，并重置漫游状态。相机将停留在停止时的位置。

**参数**:
无。

**调用示例**:

```json
{
  "CMD": "/cameraManager/stopCameraRoaming",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

---

### 13. getCameraRoamingStatus - 查询相机漫游状态

**功能描述**: 
同步查询并返回当前相机漫游的详细状态。这是一个非常有用的调试和监控工具，建议在需要显示漫游进度的UI上定期轮询此接口。

**参数**:
无。

**调用示例**

```json
{
  "CMD": "/cameraManager/getCameraRoamingStatus",
  "Data": {}
}

```

**返回示例**

```json
{
  "state": "Playing",
  "currentWaypointIndex": 1,
  "nextWaypointIndex": 2,
  "segmentProgress": 0.65,
  "totalProgress": 0.32,
  "currentPosition": [350.0, 420.0, 280.0],
  "targetPosition": [500.0, 600.0, 320.0],
  "remainingTime": 42.5
}

```

**返回字段说明**

| 字段 | 类型 | 描述 |
|---|---|---|
| state | String | 漫游状态: `Inactive` (未激活), `Ready` (准备就绪), `Playing` (播放中), `Paused` (已暂停), `Completed` (已完成)。 |
| currentWaypointIndex | Integer | 当前路径点的索引。 |
| nextWaypointIndex | Integer | 下一个路径点的索引。如果已是最后一点，则为-1。 |
| segmentProgress | Float | 当前分段的完成进度 (0.0 - 1.0)。 |
| totalProgress | Float | 整个漫游路径的完成进度 (0.0 - 1.0)。 |
| currentPosition | Array[Float] | 相机当前的世界坐标，已转换为系统单位。 |
| targetPosition | Array[Float] | 当前分段的目标世界坐标，已转换为系统单位。 |
| remainingTime | Float | 预计剩余的漫游时间（单位：秒）。 |

---

## 错误处理

| 错误码 | 描述 | 常见原因 | 建议处理 |
|---|---|---|---|
| `INVALID_PARAMETERS` | 输入参数缺失或格式错误。 | - 缺少必要的参数，如 `newLocation`、`Tag1`、`waypoints` 等。<br>- 数组长度不匹配，如 `waypoints` 和 `rotations` 数量不一致。<br>- 过渡时间为负数。 | - 仔细核对API文档，确保所有必需参数都已提供。<br>- 检查JSON格式是否正确。<br>- 验证数组长度是否匹配。 |
| `RESOURCE_NOT_FOUND` | 未找到执行命令所需的目标Pawn或Actor。 | - 游戏世界尚未完全初始化，导致无法获取玩家Pawn。<br>- `splitScreen` 中提供的标签（Tag）在场景中不存在。 | - 确保在调用相机命令前，UE场景已加载完毕且玩家Pawn已生成。<br>- 确认标签名称无误。 |
| `DEPENDENCY_FAILED` | 依赖的管理器（如 `SmoothTransitionManager` 或 `CameraRoamingManager`）未能成功获取。 | - 相关的插件或模块未正确加载。<br>- 初始化顺序问题，导致依赖项尚未准备好。 | - 检查UE编辑器的插件设置，确保所需插件已启用。<br>- 查看启动日志，排查初始化错误。 |
| `EXECUTION_FAILED` | 命令执行过程中发生错误。 | - 创建Actor或控制器失败。<br>- 漫游启动失败。 | - 查看详细的错误日志了解具体原因。<br>- 检查场景状态和资源可用性。 |
| `SERVICE_UNAVAILABLE` | 服务暂时不可用。 | - PlayerCameraManager 无法获取。 | - 确保游戏世界已正确初始化。 |

**错误返回示例**:

```json
{
  "StatusCode": 400,
  "Message": "缺少必需参数: Tag1"
}

```

---

## 使用注意事项

- **单位换算**: 所有与位置和距离相关的参数（如 `newLocation`, `Zoom`）都会自动从Web单位（米）换算为UE世界单位（厘米）。您无需在Web端进行手动换算。
- **Zoom 参数**: `Zoom` 表示目标点到相机的距离（用于 `setDesiredPosition`、`setDesiredLocation`）或沿视线移动的距离（用于 `setDesiredZoom`）。
- **旋转单位**: 所有旋转参数（Pitch, Yaw, Roll）都以"度"为单位。
- **互斥参数**: 在 `startCameraRoaming` 命令中，`segmentDurations` 和 `totalDuration` 是互斥的，请勿同时提供。
- **状态管理**: `splitScreen` 命令会修改Actor的所有权和可见性。在调用 `endSplitScreen` 恢复之前，请避免手动更改这些状态，以免引发冲突。
- **命令节流**: 避免在短时间内（如同一帧）重复发送相同的或冲突的命令（例如，连续调用 `setDesiredPosition`），这可能导致动画表现异常或状态不一致。建议在Web端加入适当的节流或防抖机制。

---

## 典型调用流程

**场景1: 设置相机位置和旋转**

```json
{
  "CMD": "/cameraManager/setDesiredPosition",
  "Data": {
    "newLocation": [1000.0, 2000.0, 500.0],
    "NewRotation": [45.0, 90.0, 0.0],
    "Zoom": 100.0,
    "duration": 2.0
  }
}

```

**场景2: 获取当前相机状态**

```json
{
  "CMD": "/cameraManager/getCameraTransform",
  "Data": {}
}

```

**场景3: 启动相机漫游**

```json
{
  "CMD": "/cameraManager/startCameraRoaming",
  "Data": {
    "waypoints": [
      [100.0, 200.0, 300.0],
      [400.0, 500.0, 600.0],
      [600.0, 800.0, 700.0]
    ],
    "rotations": [
      [-30.0, 0.0, 0.0],
      [-45.0, 90.0, 0.0],
      [-20.0, 180.0, 0.0]
    ],
    "segmentDurations": [5.0, 6.5]
  }
}

```

**场景4: 启用分屏对比**

```json
{
  "CMD": "/cameraManager/splitScreen",
  "Data": {
    "Tag1": "PlanA",
    "Tag2": "PlanB"
  }
}

```

**场景5: 查询漫游进度**

```json
{
  "CMD": "/cameraManager/getCameraRoamingStatus",
  "Data": {}
}

```
