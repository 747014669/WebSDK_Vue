# MarkManager API 文档

## 概述

MarkManager 负责管理场景中的路径标记和贴花功能，支持路径的创建、绘制、样式管理以及沿路径漫游等功能。所有路径相关的坐标参数都会自动进行单位转换（前端使用米，UE5使用厘米）。

### 路径类型系统

路径系统采用**组合模式**设计，支持多种高级路径类型。每种路径类型由两部分组成：

- **通用样式（CommonStyle）**：所有路径类型共享的基础属性（颜色、宽度、材质等）
- **类型专属配置（Config）**：每种路径类型特有的参数

#### 已注册的路径类型

| 类型 | 说明 | Actor 类 | 适用场景 |
|------|------|----------|----------|
| `Default` | 基础路径 | `APathTracerActor` | 简单路径，蓝图自定义 |
| `SplineMesh` | 样条网格路径 | `ASplineMeshPathActor` | 管线、道路、装饰 |
| `Beveled` | 倒角路径 | `ABeveledPathActor` | 建筑边缘、导航线 |
| `SegmentedColor` | 分段着色路径 | `ASegmentedColorPathActor` | 进度指示、区域划分 |
| `ColorCurve` | 颜色曲线路径 | `AColorCurvePathActor` | 特效、动画路径 |

---

## Command 列表

### 路径命令组

#### 1. CreatePathFromPoints - 从点数组创建路径

**功能描述**：根据给定的世界坐标点数组，一次性创建并渲染整条路径。支持多种路径类型和高级配置。

**参数说明**

##### 通用参数

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pathType | String | 是 | - | 路径类型：`Default`, `SplineMesh`, `Beveled`, `SegmentedColor`, `ColorCurve` |
| points | Array | 是 | - | 路径点数组，每个点为 [x, y, z] 格式（米） |
| commonStyle | Object | 否 | - | 通用样式配置（所有类型共享） |
| config | Object | 否 | - | 类型专属配置（根据 pathType 不同而不同） |

##### 通用样式（commonStyle）

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| LinearColor | Array | `[1, 1, 1, 1]` | 线条颜色 [R, G, B, A]，范围 0-1 |
| lineWidth | Number | 0.1 | 线条宽度（米） |
| pathMaterial | String | - | 材质资源路径 |
| bEnableUV | Boolean | true | 是否启用UV |
| uvScale | Array | `[1, 1]` | UV缩放 [U, V] |
| uvOffset | Array | `[0, 0]` | UV偏移 [U, V] |
| bCastShadow | Boolean | false | 是否投射阴影 |
| bEnableCollision | Boolean | false | 是否启用碰撞 |

**类型专属配置（config）**

详见下方各路径类型的配置说明。

**调用示例 - 基础路径**

```json
{
  "CMD": "/markManager/CreatePathFromPoints",
  "Data": {
    "pathType": "Default",
    "points": [
      [0, 0, 0],
      [10, 0, 0],
      [10, 10, 0]
    ],
    "commonStyle": {
      "LinearColor": [1.0, 0.0, 0.0, 1.0],
      "lineWidth": 0.5
    }
  }
}

```

**返回示例**

```json
{
  "StatusCode": 200,
  "pathId": "path_1"
}

```

---

### 路径类型详细配置

#### 类型1：SplineMesh - Spline 网格路径

**功能描述**：沿 Spline 曲线生成带首尾 Mesh 的路径，支持小线段清理和路径裁剪。

**适用场景**：管线、道路、装饰性路径、导航线

##### config 参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| smallSegmentLength | Number | 0.5 | 小线段清理长度（米），移除首尾小于此长度的线段 |
| startMesh | String | - | 起点 Mesh 资源路径 |
| startMeshMaterial | String | - | 起点 Mesh 材质资源路径 |
| startMeshScale | Number | 1.0 | 起点 Mesh 缩放 |
| startMeshOffset | Number | 0.5 | 起点 Mesh 偏移（0-1），控制 Mesh 相对于路径起点的对齐方式 |
| endMesh | String | - | 终点 Mesh 资源路径 |
| endMeshMaterial | String | - | 终点 Mesh 材质资源路径 |
| endMeshScale | Number | 1.0 | 终点 Mesh 缩放 |
| endMeshOffset | Number | 0.5 | 终点 Mesh 偏移（0-1），控制 Mesh 相对于路径终点的对齐方式 |

**技术特点**

- **小线段清理**：自动移除首尾小于指定长度的线段，避免路径起点和终点的不规则形状
- **路径裁剪**：根据首尾 Mesh 的深度自动裁剪路径，确保 Mesh 与路径无缝衔接
- **Mesh 对齐**：通过 Offset 参数控制 Mesh 的对齐方式（0.0=完全在路径外，0.5=中心对齐，1.0=完全在路径内）
- **动态材质**：支持为首尾 Mesh 设置独立的材质，并自动应用路径颜色

**调用示例**

```json
{
  "CMD": "/markManager/CreatePathFromPoints",
  "Data": {
    "pathType": "SplineMesh",
    "points": [[0,0,0], [10,0,0], [10,10,0]],
    "commonStyle": {
      "LinearColor": [1.0, 1.0, 1.0, 1.0],
      "lineWidth": 0.3
    },
    "config": {
      "smallSegmentLength": 0.5,
      "startMesh": "/Game/Meshes/Arrow_Start.Arrow_Start",
      "startMeshMaterial": "/Game/Materials/M_Arrow.M_Arrow",
      "startMeshScale": 1.0,
      "startMeshOffset": 0.5,
      "endMesh": "/Game/Meshes/Arrow_End.Arrow_End",
      "endMeshMaterial": "/Game/Materials/M_Arrow.M_Arrow",
      "endMeshScale": 1.0,
      "endMeshOffset": 0.5
    }
  }
}

```

---

#### 类型2：Beveled - 倒角路径

**功能描述**：程序化生成带倒角效果的路径网格，支持多种倒角类型。

**适用场景**：建筑边缘、导航线、装饰性边框

##### config 参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| bevelType | String | `"Round"` | 倒角类型：`None`, `Round`, `Chamfer`, `Step` |
| bevelRadius | Number | 0.2 | 倒角半径（米） |
| bevelSegments | Number | 8 | 倒角分段数（仅Round类型有效） |
| bBevelEdges | Boolean | false | 是否应用边缘倒角 |
| edgeBevelRadius | Number | 0.05 | 边缘倒角半径（米） |
| pathThickness | Number | 0.0 | 路径厚度（0=平面）（米） |

**倒角类型说明**

- **None**：无倒角，尖角
- **Round**：圆角，平滑过渡
- **Chamfer**：斜角，45度切角
- **Step**：阶梯，多级台阶

**调用示例**

```json
{
  "CMD": "/markManager/CreatePathFromPoints",
  "Data": {
    "pathType": "Beveled",
    "points": [[0,0,0], [10,0,0], [10,10,0], [0,10,0]],
    "commonStyle": {
      "LinearColor": [1.0, 0.0, 0.0, 1.0],
      "lineWidth": 0.15
    },
    "config": {
      "bevelType": "Round",
      "bevelRadius": 0.2,
      "bevelSegments": 8,
      "bBevelEdges": false,
      "pathThickness": 0.0
    }
  }
}

```

---

#### 类型3：SegmentedColor - 分段着色路径

**功能描述**：按累计长度数组分段并应用不同颜色，使用多 Section + 动态材质实现精确分段。

**适用场景**：进度指示、区域划分、多阶段路径、工程进度展示

**技术特点**：

- 每个分段使用独立的 Mesh Section
- 每个 Section 使用独立的动态材质实例
- 分段边界精确，无颜色插值

##### config 参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| segmentLengths | Array | `[]` | 累计长度数组（米），例如 [10, 20, 35] |
| segmentColors | Array | `[]` | 每段颜色数组 [[R,G,B,A], ...] |

**segmentLengths 说明**

- 累计长度数组，每个值表示该段的**结束位置**
- 例如：`[10, 20, 35]` 表示：
  - 第1段：0-10米
  - 第2段：10-20米
  - 第3段：20-35米
- 每段的起点是前一段的终点（第一段从0开始）
- 路径超过最后一个长度值的部分不再分段

**颜色补充规则**

- 如果颜色数量**少于**分段数，用**第一个颜色**补充后续分段
- 如果颜色数量**多于**分段数，多余的颜色被忽略
- 例如：5个分段，2个颜色 → 第3、4、5段都使用第1个颜色

**完整调用示例**

```json
{
  "CMD": "/markManager/CreatePathFromPoints",
  "Data": {
    "pathType": "SegmentedColor",
    "points": [
      [0, 0, 0],
      [10, 0, 0],
      [20, 0, 0],
      [30, 5, 0],
      [40, 10, 0]
    ],
    "commonStyle": {
      "LinearColor": [1.0, 1.0, 1.0, 1.0],
      "lineWidth": 0.3,
      "bCastShadow": true,
      "pathMaterial": "/Game/Materials/M_SegmentedPath"
    },
    "config": {
      "segmentLengths": [10, 20, 30, 40],
      "segmentColors": [
        [1.0, 0.0, 0.0, 1.0],
        [1.0, 0.5, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0]
      ]
    }
  }
}

```

##### 示例详解

| 项目 | 说明 |
|------|------|
| **pathType** | `SegmentedColor` - 分段着色路径类型 |
| **points** | 5个路径点，总长度约 40 米 |
| **lineWidth** | 0.3 米（30厘米）的线条宽度 |
| **pathMaterial** | 基础材质路径（颜色通过动态材质参数设置） |
| **segmentLengths** | `[10, 20, 30, 40]` - 4个分段 |
| **segmentColors** | 4种颜色：红→橙→绿→蓝 |

**分段效果**

- **第1段**（0-10m）：红色 - 独立 Section
- **第2段**（10-20m）：橙色 - 独立 Section
- **第3段**（20-30m）：绿色 - 独立 Section
- **第4段**（30-40m）：蓝色 - 独立 Section
- **边界**：精确分段，无颜色插值

**颜色补充示例**

```json
{
  "config": {
    "segmentLengths": [10, 20, 30, 40, 50],
    "segmentColors": [
      [1.0, 0.0, 0.0, 1.0],
      [0.0, 1.0, 0.0, 1.0]
    ]
  }
}

```

**效果**：

- 第1段红色，第2段绿色，第3-5段都使用红色补充
- 每个分段独立的 Section

**材质要求**

- 材质需要支持 `BaseColor`、`Color` 或 `Tint` 参数
- 颜色通过动态材质实例设置
- 如果未指定材质，使用默认材质

**返回示例**

```json
{
  "StatusCode": 200,
  "pathId": "path_1"
}

```

---

#### 类型4：ColorCurve - 颜色曲线路径

**功能描述**：基于颜色曲线生成带顶点颜色的路径。材质中可根据顶点颜色实现流动效果。

**适用场景**：特效路径、渐变效果、流动动画

**技术特点**：

- 使用 `RoundingPathCorners` 进行路径倒角
- 使用 `GetPathData` 生成网格
- 使用 `GetVertexColorData` 设置顶点颜色
- 材质中根据顶点颜色实现流动效果

##### config 参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| colorCurve | String | - | 颜色曲线资源路径（UCurveLinearColor），用于生成顶点颜色 |
| cornerRadius | Number | 0.5 | 圆角半径（米），用于平滑路径拐角 |
| cornerSegments | Number | 8 | 圆角分段数（0=不应用平滑，值越大越平滑） |
| bEnableStartOpacity | Boolean | false | 是否启用起点透明度渐变 |
| startOpacityDistance | Number | 1.0 | 起点渐变距离（米） |
| bEnableEndOpacity | Boolean | false | 是否启用终点透明度渐变 |
| endOpacityDistance | Number | 1.0 | 终点渐变距离（米） |
| curveHardness | Number | 1.0 | 曲线硬度（用于 GetVertexColorData） |
| bUnitCurve | Boolean | true | 是否单位曲线（用于 GetVertexColorData） |

**调用示例**

```json
{
  "CMD": "/markManager/CreatePathFromPoints",
  "Data": {
    "pathType": "ColorCurve",
    "points": [[0,0,0], [10,0,0], [10,10,0], [20,10,0]],
    "commonStyle": {
      "LinearColor": [1.0, 1.0, 1.0, 1.0],
      "lineWidth": 0.3,
      "pathMaterial": "/Game/Materials/M_ColorCurvePath"
    },
    "config": {
      "colorCurve": "/Game/Curves/RainbowCurve.RainbowCurve",
      "cornerRadius": 0.5,
      "cornerSegments": 8,
      "bEnableStartOpacity": true,
      "startOpacityDistance": 1.5,
      "bEnableEndOpacity": true,
      "endOpacityDistance": 1.5,
      "curveHardness": 1.0,
      "bUnitCurve": true
    }
  }
}

```

**材质要求**

- 材质需要支持顶点颜色（VertexColor）
- 顶点颜色的 RGB 通道存储颜色信息
- 顶点颜色的 Alpha 通道存储透明度信息
- 材质中可使用顶点颜色驱动流动效果

**材质实现示例**

```hlsl
// 基础用法：直接使用顶点颜色
float4 FinalColor = BaseColor * VertexColor;

// 流动效果：使用顶点颜色的 R 通道作为流动速度
float FlowSpeed = VertexColor.r * 2.0;
float2 UV = TexCoord + Time * FlowSpeed;
float4 FlowTexture = Texture2D_Sample(FlowTex, UV);

```

**参数说明**：

- **colorCurve**: 颜色曲线资源，定义沿路径的颜色变化
- **cornerRadius**: 圆角半径，值越大拐角越圆滑
- **cornerSegments**: 圆角分段数，0 表示不平滑（尖角），值越大越平滑
- **bEnableStartOpacity**: 启用后，起点处透明度从 0 渐变到 1
- **startOpacityDistance**: 起点透明度渐变的距离范围
- **bEnableEndOpacity**: 启用后，终点处透明度从 1 渐变到 0
- **endOpacityDistance**: 终点透明度渐变的距离范围
- **curveHardness**: 曲线硬度，影响颜色变化的陡峭程度
- **bUnitCurve**: 是否使用单位曲线（0-1 范围）

**注意事项**：

- 所有长度参数（cornerRadius、startOpacityDistance、endOpacityDistance）使用米为单位
- 颜色曲线应该是 UCurveLinearColor 类型
- 如果不提供 colorCurve，将使用 commonStyle.LinearColor 作为默认颜色
- 流动效果需要在材质中实现，顶点颜色只提供数据源

---

#### 类型5：Heatmap - 热力图路径

**功能描述**：根据热力线分段生成热力图纹理并应用到路径上，支持权重分配和平滑过渡。

**适用场景**：热力分析、数据可视化、强度分布展示

##### config 参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| segments | Array | `[]` | 热力线分段数组，每个分段包含长度、权重、热力值 |
| transitionPixels | Number | 8 | 过渡像素数（分段间的平滑过渡） |
| textureWidth | Number | 256 | 热力图纹理宽度（16-2048） |
| bLoopHeatmap | Boolean | false | 是否循环热力图 |

##### segments 数组元素

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| segmentLength | Number | 1.0 | 分段长度（米） |
| segmentWeight | Number | 1.0 | 分段权重（用于纹理分配） |
| heatValue | Number | 0.5 | 热力值（0-1，0=冷，1=热） |

**技术特点**

- **热力图纹理**：自动生成 256x1 的热力图纹理
- **权重分配**：根据分段权重分配纹理像素
- **平滑过渡**：分段间支持可配置的像素过渡
- **UV 映射**：自动计算沿路径的 UV 坐标
- **材质集成**：热力图纹理通过 `HeatmapTexture` 参数传递给材质

**材质要求**

- 材质需要包含名为 `HeatmapTexture` 的纹理参数
- 建议使用支持热力图颜色映射的材质
- 纹理采样使用 U 坐标（沿路径方向）

**调用示例**

```json
{
  "CMD": "/markManager/CreatePathFromPoints",
  "Data": {
    "pathType": "Heatmap",
    "points": [
      [0, 0, 0],
      [30, 0, 0],
      [30, 30, 0]
    ],
    "commonStyle": {
      "lineWidth": 2.0,
      "pathMaterial": "/Game/Materials/HeatmapMaterial"
    },
    "config": {
      "segments": [
        {
          "segmentLength": 10.0,
          "segmentWeight": 1.0,
          "heatValue": 0.2
        },
        {
          "segmentLength": 10.0,
          "segmentWeight": 2.0,
          "heatValue": 0.6
        },
        {
          "segmentLength": 10.0,
          "segmentWeight": 1.0,
          "heatValue": 0.9
        }
      ],
      "transitionPixels": 8,
      "textureWidth": 256,
      "bLoopHeatmap": false
    }
  }
}

```

**热力图纹理说明**

- 纹理格式：R8G8B8A8，热力值存储在 R 通道
- 纹理尺寸：TextureWidth x 1
- 采样模式：Clamp + Bilinear
- 权重分配：每个分段占用的像素数 = (分段权重 / 总权重) × 纹理宽度
- 过渡效果：在分段末尾的 TransitionPixels 个像素中进行线性插值

---

#### 2. BeginDrawPath - 开始交互式绘制路径

**功能描述**：开启交互式路径绘制会话，绑定鼠标事件。用户可通过左键点击添加路径点，右键点击结束绘制。

##### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pathType | String | 是 | - | 路径类型（必须在 PathTracerRegistry 中注册） |
| style | Object | 否 | - | 路径样式配置（同 CreatePathFromPoints） |

**调用示例**

```json
{
  "CMD": "/markManager/BeginDrawPath",
  "Data": {
    "pathType": "DottedLine",
    "style": {
      "color": [0.0, 1.0, 0.0, 1.0],
      "width": 0.3
    }
  }
}

```

**返回示例**

```json
{
  "StatusCode": 200,
  "pathId": "path_2"
}

```

**使用说明**

- 调用后自动绑定鼠标事件
- 左键点击场景添加路径点
- 右键点击结束绘制
- 绘制过程中会显示实时预览

---

#### 3. AddPathPoint - 添加路径点

**功能描述**：向当前绘制会话中的路径添加一个点（通常由鼠标点击自动触发，也可手动调用）。

##### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| position | Array | 是 | - | 路径点坐标 [x, y, z]（米） |

**调用示例**

```json
{
  "CMD": "/markManager/AddPathPoint",
  "Data": {
    "position": [5.0, 5.0, 0.0]
  }
}

```

**返回示例**

```json
{
  "StatusCode": 200
}

```

---

#### 4. FinishDrawPath - 完成路径绘制

**功能描述**：结束当前绘制会话并固定路径，解绑鼠标事件。

**参数说明**
无参数

**调用示例**

```json
{
  "CMD": "/markManager/FinishDrawPath",
  "Data": {}
}

```

**返回示例**

```json
{
  "StatusCode": 200,
  "pathId": "path_2",
  "success": true
}

```

**注意事项**

- 如果路径点数少于2个，路径会被自动删除
- 调用后会自动解绑鼠标事件

---

#### 5. UpdatePathStyle - 更新路径样式

**功能描述**：更新已存在路径的样式属性。

##### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pathId | String | 是 | - | 路径ID |
| style | Object | 是 | - | 新的样式配置 |
| style.color | Array | 否 | - | 线条颜色 [R, G, B, A] |
| style.width | Number | 否 | - | 线条宽度（米） |
| style.dotted | Boolean | 否 | - | 是否为虚线 |
| style.dottedInterval | Number | 否 | - | 虚线间隔（米） |
| style.loop | Boolean | 否 | - | 是否闭合路径 |

**调用示例**

```json
{
  "CMD": "/markManager/UpdatePathStyle",
  "Data": {
    "pathId": "path_1",
    "style": {
      "color": [0.0, 0.0, 1.0, 1.0],
      "width": 0.8
    }
  }
}

```

**返回示例**

```json
{
  "StatusCode": 200
}

```

---

#### 6. DeletePath - 删除路径

**功能描述**：删除指定的路径并释放资源。

##### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pathId | String | 是 | - | 要删除的路径ID |

**调用示例**

```json
{
  "CMD": "/markManager/DeletePath",
  "Data": {
    "pathId": "path_1"
  }
}

```

**返回示例**

```json
{
  "StatusCode": 200
}

```

---

#### 7. ClearAllPaths - 清除所有路径

**功能描述**：删除场景中的所有路径，停止漫游，解绑绘制事件。

**参数说明**
无参数

**调用示例**

```json
{
  "CMD": "/markManager/ClearAllPaths",
  "Data": {}
}

```

**返回示例**

```json
{
  "StatusCode": 200
}

```

---

### 漫游命令组

#### 8. StartTravel - 开始沿路径漫游

**功能描述**：驱动相机或目标对象沿指定路径移动，支持三种漫游模式。

##### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pathId | String | 是 | - | 路径ID |
| duration | Number | 否 | 10.0 | 漫游时长（秒） |
| travelType | String | 否 | "Fly" | 漫游类型："Fly"（飞行）、"Vehicle"（车辆）、"Character"（角色） |
| loop | Boolean | 否 | false | 是否循环漫游 |

**调用示例**

```json
{
  "CMD": "/markManager/StartTravel",
  "Data": {
    "pathId": "path_1",
    "duration": 15.0,
    "travelType": "Fly",
    "loop": false
  }
}

```

**返回示例**

```json
{
  "StatusCode": 200,
  "pathId": "path_1",
  "duration": 15.0
}

```

**漫游类型说明**

- **Fly**：自由飞行视角，适合鸟瞰和快速浏览
- **Vehicle**：车辆模式，贴地行驶
- **Character**：角色模式，第一人称行走视角

---

#### 9. StopTravel - 停止漫游

**功能描述**：停止当前的漫游，恢复原始视角。

**参数说明**
无参数

**调用示例**

```json
{
  "CMD": "/markManager/StopTravel",
  "Data": {}
}

```

**返回示例**

```json
{
  "StatusCode": 200
}

```

---

#### 10. PauseTravel - 暂停/恢复漫游

**功能描述**：暂停或恢复当前的漫游。

##### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| paused | Boolean | 否 | true | true=暂停，false=恢复 |

**调用示例**

```json
{
  "CMD": "/markManager/PauseTravel",
  "Data": {
    "paused": true
  }
}

```

**返回示例**

```json
{
  "StatusCode": 200,
  "paused": true
}

```

---

#### 11. SetTravelProgress - 设置漫游进度

**功能描述**：直接设置漫游的当前进度，可用于跳转到路径的特定位置。

##### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| progress | Number | 是 | - | 漫游进度，范围 0.0-1.0（0=起点，1=终点） |

**调用示例**

```json
{
  "CMD": "/markManager/SetTravelProgress",
  "Data": {
    "progress": 0.5
  }
}

```

**返回示例**

```json
{
  "StatusCode": 200,
  "progress": 0.5
}

```

---

### 贴花命令组

#### 12. CreateColorDecal - 创建纯色贴花

**功能描述**：在指定位置创建一个纯色贴花。

**状态**：⚠️ 待实现 - 需要 WebCoreMarkDecalActor 支持

##### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| position | Array | 是 | - | 贴花位置 [x, y, z]（米） |
| color | Array | 否 | `[1, 1, 1, 1]` | 贴花颜色 [R, G, B, A] |
| style | Object | 否 | - | 贴花样式 |

---

#### 13. CreateImageDecal - 创建图像贴花

**功能描述**：在指定位置创建一个图像贴花。

**状态**：⚠️ 待实现 - 需要 WebCoreMarkDecalActor 支持

##### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| position | Array | 是 | - | 贴花位置 [x, y, z]（米） |
| imagePath | String | 是 | - | 图片路径 |
| style | Object | 否 | - | 贴花样式 |

---

#### 14-16. 其他贴花命令

UpdateColorDecal、UpdateImageDecal、DeleteDecal、SetDecalVisibility、DisableDecalCursor 等命令当前为占位实现，待后续完善。

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 50004 | 参数验证失败 | 检查必需参数是否提供，参数格式是否正确 |
| 50004 | 路径类型未注册 | 检查 pathType 是否在 PathTracerRegistry 中配置 |
| 50004 | 路径不存在 | 检查 pathId 是否正确 |
| 50004 | 未在漫游中 | 确保在调用漫游控制命令前已开始漫游 |
| 50004 | 未在绘制状态 | 确保在调用 AddPathPoint 前已调用 BeginDrawPath |

### 错误返回示例
```json
{
  "StatusCode": 50004,
  "ErrorMessage": "缺少必需参数: pathType"
}

```

```json
{
  "StatusCode": 50004,
  "ErrorMessage": "创建路径失败: 未知的路径类型 'InvalidType'"
}

```

---

## 路径类型配置

### 配置 PathTracerRegistry

在 `UMarkManagerFactory` 的蓝图子类或 C++ 中配置：

```cpp
// C++ 配置示例
PathTracerRegistry.Add(TEXT("SolidLine"), ASolidLinePathActor::StaticClass());
PathTracerRegistry.Add(TEXT("DottedLine"), ADottedLinePathActor::StaticClass());
PathTracerRegistry.Add(TEXT("Arrow"), AArrowPathActor::StaticClass());

```

### 获取已注册的路径类型

可通过 `GetRegisteredPathTypes()` 方法获取所有已注册的路径类型列表。

---

## 使用注意事项

1. **路径类型必需**：`CreatePathFromPoints` 和 `BeginDrawPath` 必须提供 `pathType` 参数
2. **单位转换**：所有位置、距离参数自动进行单位转换（前端米 ↔ UE5厘米）
3. **路径ID管理**：路径ID由系统自动生成（格式：path_N），请妥善保存返回的ID
4. **绘制状态**：同一时间只能有一个路径处于绘制状态
5. **漫游互斥**：同一时间只能有一个漫游任务
6. **鼠标事件**：绘制路径时会占用鼠标事件，完成后自动释放
7. **路径可视化**：路径的实际渲染由蓝图子类实现 OnPathUpdated 事件

---

## 完整使用流程示例

### 场景1：创建固定路径并漫游

```json
// 1. 创建路径（注意 pathType 参数）
{
  "CMD": "/markManager/CreatePathFromPoints",
  "Data": {
    "pathType": "SolidLine",
    "points": [
      [0, 0, 0],
      [50, 0, 0],
      [50, 50, 0],
      [0, 50, 0]
    ],
    "style": {
      "color": [1.0, 0.5, 0.0, 1.0],
      "width": 0.5,
      "loop": true
    }
  }
}
// 返回: {"StatusCode": 200, "pathId": "path_1"}

// 2. 开始漫游
{
  "CMD": "/markManager/StartTravel",
  "Data": {
    "pathId": "path_1",
    "duration": 20.0,
    "travelType": "Fly"
  }
}

// 3. 暂停漫游
{
  "CMD": "/markManager/PauseTravel",
  "Data": {
    "paused": true
  }
}

// 4. 跳转到中间位置
{
  "CMD": "/markManager/SetTravelProgress",
  "Data": {
    "progress": 0.5
  }
}

// 5. 恢复漫游
{
  "CMD": "/markManager/PauseTravel",
  "Data": {
    "paused": false
  }
}

// 6. 停止漫游
{
  "CMD": "/markManager/StopTravel",
  "Data": {}
}

```

### 场景2：交互式绘制路径

```json
// 1. 开始绘制（注意 pathType 参数）
{
  "CMD": "/markManager/BeginDrawPath",
  "Data": {
    "pathType": "DottedLine",
    "style": {
      "color": [0.0, 1.0, 1.0, 1.0],
      "width": 0.3
    }
  }
}
// 返回: {"StatusCode": 200, "pathId": "path_2"}

// 2. 用户通过鼠标左键点击场景添加点
//    （自动调用 AddPathPoint）

// 3. 用户右键点击结束绘制
//    （自动调用 FinishDrawPath）

// 4. 更新路径样式
{
  "CMD": "/markManager/UpdatePathStyle",
  "Data": {
    "pathId": "path_2",
    "style": {
      "color": [1.0, 0.0, 1.0, 1.0],
      "width": 0.8,
      "loop": true
    }
  }
}

// 5. 删除路径
{
  "CMD": "/markManager/DeletePath",
  "Data": {
    "pathId": "path_2"
  }
}

```

---

## 技术实现说明

### 路径类型系统（v2.0）

#### 组合模式设计

- **通用样式（FPathStyle）**：所有路径类型共享的基础属性
- **类型专属配置**：每种路径类型独立的配置结构
  - `FSplineMeshConfig` - 样条网格配置
  - `FBevelConfig` - 倒角配置
  - `FSegmentedColorConfig` - 分段着色配置
  - `FColorCurveConfig` - 颜色曲线配置

#### 类型注册表

- 使用 `TMap<FString, TSubclassOf<APathTracerActor>>` 存储类型映射
- 创建路径时根据 pathType 查找对应的 Actor 类
- 支持运行时动态注册新类型
- 默认注册 5 种类型：Default, SplineMesh, Beveled, SegmentedColor, ColorCurve

#### Actor 类层次
```
APathTracerActor (基类)
├─ 提供静态工具方法（网格生成、路径处理）
├─ 管理通用样式（CommonStyle）
└─ 虚函数：OnPathUpdated()

    ├─ ASplineMeshPathActor
    │   └─ 管理 USplineMeshComponent 数组
    │
    ├─ ABeveledPathActor
    │   └─ 管理 UProceduralMeshComponent
    │
    ├─ ASegmentedColorPathActor
    │   └─ 管理 UProceduralMeshComponent + 顶点颜色
    │
    └─ AColorCurvePathActor
        └─ 管理 UProceduralMeshComponent + 曲线采样

```

### 路径计算

- **路径长度计算**：支持开放和闭合路径
- **路径插值**：根据百分比或距离获取路径上的位置和旋转
- **样条曲线**：使用 USplineComponent 进行路径平滑
- **静态工具方法**：所有算法都是静态方法，可在任何地方调用
  - `GetPathData()` - 生成路径网格
  - `RoundingPathCorners()` - 圆角处理
  - `GetPointsAlongPath()` - 等距采样
  - 等 40+ 个工具方法

### 网格生成

- **SplineMesh**：使用 USplineMeshComponent 沿样条放置静态网格
- **Beveled**：程序化生成带倒角的网格，复用 `RoundingPathCorners` 算法
- **SegmentedColor**：程序化生成网格 + 顶点颜色
- **ColorCurve**：程序化生成网格 + 曲线采样颜色

### 单位转换

- 所有长度参数自动转换（前端米 ↔ UE5厘米）
- 使用宏：`GET_FLOAT_PARAM_WITH_UNIT_CONVERSION`, `GET_VECTOR_FROM_ARRAY_WITH_CONVERSION`
- 非长度参数（比例、数量）不转换

### 漫游实现

- 更新频率：约 60fps（0.016秒间隔）
- 位置计算：基于路径长度和时间进度
- 视角控制：自动更新相机位置和旋转

### 扩展性

- **新增路径类型**：继承 `APathTracerActor`，实现 `OnPathUpdated()`，在 `MarkManagerFactory` 中注册
- **自定义配置**：定义新的配置结构，在 Command 层添加解析方法
- **蓝图扩展**：继承任何路径 Actor，重写 `OnPathUpdated` 事件
- **漫游Actor**：通过配置 FlyActorClass、VehicleActorClass、CharacterActorClass 自定义漫游对象

---

## 版本历史

**v2.0.0** (2025-12-16) - 路径类型系统重构

- ✅ 采用组合模式设计（通用样式 + 类型专属配置）
- ✅ 新增 4 种高级路径类型：
  - `SplineMesh` - 样条网格路径
  - `Beveled` - 倒角路径
  - `SegmentedColor` - 分段着色路径
  - `ColorCurve` - 颜色曲线路径
- ✅ 扩展 `FPathStyle` 为通用样式（10个参数）
- ✅ 每种类型独立的配置结构（6-10个参数）
- ✅ Command 层支持新的 JSON 结构（`commonStyle` + `config`）
- ✅ 完整的单位转换支持
- ✅ 更新 API 文档

**v1.1.0** (2025-12-12)

- ✅ 添加 pathType 必需参数支持
- ✅ 实现路径类型注册表机制
- ✅ 添加 GetPathType 方法
- ✅ 更新 API 文档

**v1.0.0** (2025-12-11)

- ✅ 实现路径创建和管理功能
- ✅ 实现交互式路径绘制
- ✅ 实现路径漫游功能（三种模式）
- ✅ 实现漫游控制（暂停、进度设置）
- ⚠️ 贴花功能待实现

---

## 联系方式

如需了解更多功能或遇到问题，请联系 WebCore 开发团队。
