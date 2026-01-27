# PoiManager API 文档

## 概述
PoiManager负责注册并执行所有POI相关的Web命令，覆盖POI的创建、销毁、更新、聚合以及事件绑定等能力。

---

## 命令目录

### 1. CreatePoi - 创建POI

**功能描述**：批量创建POI，支持指定分组、POI类、UMG类、样式、交互配置和事件绑定。支持自定义ID和为每个POI设置不同的文本内容。

**Reset 支持**：✅ 支持 - Reset 时会销毁所有创建的 POI

#### 基础参数

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|---|---|---|---|---|
| Ids | Array[String] | 是 | - | POI ID 数组（详见 Ids 参数说明） |
| Group | String | 是 | - | 分组名称 |
| Positions | Array[Array[Float]] | 是 | - | 坐标数组 [[x,y,z], ...]，单位：米 |
| PoiClass | String | 否 | AWebCorePoiActorBase | POI Actor 类路径（完整类路径） |
| UMGClass | String | 否 | POIUMG_Standard | UMG Widget 类路径（详见 UMGClass 参数说明） |
| StyleJson | Object | 否 | {} | 样式对象（详见 StyleJson 参数说明） |
| Texts | Object | 否 | {} | 文本内容对象（详见 Texts 参数说明） |
| MergeStrategy | String | 否 | "None" | 合并策略，当Group已存在时使用 "Merge" 可合并到现有分组 |

#### Ids 参数说明

`Ids` 参数用于指定每个 POI 的唯一标识符，支持两种使用方式：

**方式一：单个ID自动扩展**

当只提供一个 ID 时，系统会自动生成后续 ID：

- 第1个POI：使用原始ID
- 第2个及之后：`{原始ID}_1`, `{原始ID}_2`, ...

```json
{
  "Ids": ["building"],
  "Positions": [[0,0,0], [100,0,0], [200,0,0]]
}
// 生成的ID: "building", "building_1", "building_2"

```

**方式二：完全自定义ID**

当提供多个 ID 时，必须与 Positions 数量相等，直接使用用户提供的 ID：

```json
{
  "Ids": ["tower_a", "tower_b", "tower_c"],
  "Positions": [[0,0,0], [100,0,0], [200,0,0]]
}
// 生成的ID: "tower_a", "tower_b", "tower_c"

```

**验证规则**：

- Ids 数量必须为 1 或等于 Positions 数量
- 如果 Ids 数量 > 1 且不等于 Positions 数量，将返回错误

#### UMGClass 参数说明

`UMGClass`参数为POI所使用的UMG类完整路径，示例：/Game/AssetLib/NSWater/POI/POI_2.POI_2_C

UMG类必须继承自插件内的`UPoiWidgetBase`类，继承后会强制要求添加一个名为InteractionBtn的Button控件

#### Texts 参数说明

`Texts` 参数用于为每个 POI 设置不同的文本内容。其结构为：

```json
{
  "控件名称1": ["文本值1", "文本值2", ...],
  "控件名称2": ["文本值1", "文本值2", ...],
  ...
}

```

**使用规则**：

1. **单值共用**：如果某个控件只提供一个文本值，所有 POI 都使用该值
2. **多值对应**：如果提供多个文本值，必须与 POI 数量相等，按索引一一对应
3. **控件名称**：必须与 UMG Widget 中的 TextBlock 控件名称完全匹配

**示例**：

```json
{
  "Texts": {
    "TitleContent": ["前海自贸大厦", "前海大厦", "南山大厦"],
    "SubTitleContent": ["1栋"]
  },
  "Positions": [[0,0,0], [100,0,0], [200,0,0]]
}
// POI 0: TitleContent="前海自贸大厦", SubTitleContent="1栋"
// POI 1: TitleContent="前海大厦", SubTitleContent="1栋"
// POI 2: TitleContent="南山大厦", SubTitleContent="1栋"

```

**验证规则**：

- 每个控件的文本数量必须为 1 或等于 POI 数量
- 如果文本数量 > 1 且不等于 POI 数量，将返回错误

**与 StyleJson 的关系**：

- `StyleJson` 定义控件的**样式**（颜色、字体大小等）
- `Texts` 定义控件的**文本内容**（每个POI可不同）
- 两者独立，可同时使用
- `Texts` 中的文本会覆盖 `StyleJson` 中同名控件的 `Text` 属性

#### 交互配置参数

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|---|---|---|---|---|
| EnableClick | Boolean | 否 | true | 是否启用点击交互 |
| EnableHover | Boolean | 否 | false | 是否启用悬停交互（hover/unhover） |

#### 事件绑定参数

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|---|---|---|---|---|
| Events | Object | 否 | {} | 事件绑定配置对象 |

**Events 对象结构**：

```json
{
  "click": [
    { "Action": "ActionName", "Params": { ... } }
  ],
  "hover": [
    { "Action": "ActionName", "Params": { ... } }
  ],
  "unhover": [
    { "Action": "ActionName", "Params": { ... } }
  ]
}

```

| 事件类型 | 说明 | 触发条件 |
|---------|------|---------|
| click | 点击事件 | 用户点击 POI 时触发（需 EnableClick=true） |
| hover | 悬停事件 | 鼠标进入 POI 时触发（需 EnableHover=true） |
| unhover | 离开事件 | 鼠标离开 POI 时触发（需 EnableHover=true） |

**调用示例**

完整参数创建（使用单ID自动扩展 + Texts）：

```json
{
  "CMD": "/poiManager/CreatePoi",
  "Data": {
    "Ids": ["building"],
    "Group": "Buildings",
    "Positions": [[100, 200, 0], [300, 400, 0]],
    "PoiClass": "/Script/WebCore.WebCorePoiActorBase",
    "UMGClass": "/Script/UMGEditor.WidgetBlueprint'/WebCore/Res/POI/UMG/POIUMG_Standard.POIUMG_Standard_C'",
    "EnableClick": true,
    "EnableHover": true,
    "Texts": {
      "TitleContent": ["前海自贸大厦", "前海大厦"],
      "SubTitleContent": ["办公楼"]
    },
    "StyleJson": {
      "IconImage": {
        "LinearColor": {"R": 1.0, "G": 1.0, "B": 1.0, "A": 1.0}
      },
      "TitleContent": {
        "FontSize": 16,
        "LinearColor": {"R": 1.0, "G": 1.0, "B": 1.0, "A": 1.0}
      }
    },
    "Events": {
      "click": [
        {
          "Action": "FocusOnPoi",
          "Params": { "Duration": 1.0 }
        }
      ],
      "hover": [
        {
          "Action": "HighlightPoi",
          "Params": { "LinearColor": {"R": 1.0, "G": 1.0, "B": 1.0, "A": 1.0} }
        }
      ]
    }
  }
}

```

使用自定义ID：

```json
{
  "CMD": "/poiManager/CreatePoi",
  "Data": {
    "Ids": ["tower_a", "tower_b", "tower_c"],
    "Group": "Towers",
    "Positions": [[0, 0, 0], [100, 0, 0], [200, 0, 0]],
    "Texts": {
      "TitleContent": ["A塔", "B塔", "C塔"]
    }
  }
}

```

禁用点击、启用悬停：

```json
{
  "CMD": "/poiManager/CreatePoi",
  "Data": {
    "Ids": ["info"],
    "Group": "InfoPoints",
    "Positions": [[50, 50, 0]],
    "EnableClick": false,
    "EnableHover": true,
    "Events": {
      "hover": [
        { "Action": "ShowTooltip", "Params": { "Text": "信息点" } }
      ],
      "unhover": [
        { "Action": "HideTooltip" }
      ]
    }
  }
}

```

---

### 2. UpdatePoi - 更新POI

**功能描述**：更新POI的样式属性，支持单个POI或整个分组的批量更新。

**Reset 支持**：❌ 不支持 - 只修改现有对象属性，不创建新对象

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|---|---|---|---|---|
| PoiIds | Array[String] | 否 | - | POI标识符数组（与Group二选一） |
| Group | String | 否 | - | 分组ID（与PoiIds二选一） |
| StyleJson | Object | 是 | - | 样式对象（详见 StyleJson 参数说明） |

**参数说明**：

- `PoiIds` 和 `Group` 必须提供其中一个
- 如果同时提供，优先使用 `PoiIds`
- `StyleJson` 为必需参数，格式与 CreatePoi 中的 StyleJson 相同

**调用示例**

单个或多个POI更新：

```json
{
  "CMD": "/poiManager/UpdatePoi",
  "Data": {
    "PoiIds": ["poi_0", "poi_1"],
    "StyleJson": {
      "IconImage": {
        "LinearColor": {"R": 1.0, "G": 0.0, "B": 0.0, "A": 1.0}
      }
    }
  }
}

```

分组批量更新：

```json
{
  "CMD": "/poiManager/UpdatePoi",
  "Data": {
    "Group": "Default",
    "StyleJson": {
      "IconImage": {
        "LinearColor": {"R": 0.0, "G": 1.0, "B": 0.0, "A": 1.0}
      }
    }
  }
}

```

---

### 3. SetAggregation - 设置聚合配置

**功能描述**：设置POI分组的聚合显示配置，使用**四叉树 + GPU 混合方案**实现高性能聚合。

**Reset 支持**：✅ 支持 - Reset 时会取消聚合并销毁聚合创建的对象（Cluster Actors）

**聚合原理**：

- **四叉树层级管理**：根据相机距离动态计算最优四叉树层级
- **GPU 并行计算**：使用 Compute Shader 并行分配 POI 到网格
- **性能优势**：相比旧方案提升 10x+，支持 10000+ POI 实时聚合

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|---|---|---|---|---|
| GroupID | String | 是 | - | 分组名称 |
| EnableAggregation | Boolean | 否 | true | 是否启用聚合 |
| AggregationDistance | Float | 否 | 1000.0 | 聚合基准距离（单位：米，默认1000米）<br>用于计算四叉树层级：<br>- 相机距离 > 基准距离 → 粗粒度聚合（全聚合）<br>- 相机距离 < 基准距离 → 细粒度聚合 |
| MinClusterSize | Integer | 否 | 4 | 最小簇大小（只有 ≥ 此值的网格才显示为聚合） |
| MaxTreeDepth | Integer | 否 | 6 | 四叉树最大深度（0-8）<br>- 层级 0 = 全聚合（整个区域1个网格）<br>- 层级 MaxTreeDepth = 最细粒度（小网格） |
| HysteresisRatio | Float | 否 | 1.2 | 滞后比率（防止相机轻微移动导致频繁更新） |
| ClusterStyleJson | Object | 否 | {} | 聚合 POI 样式对象（格式同 StyleJson） |
| ClusterActorClass | String | 否 | "" | 聚合POI的Actor类路径（完整类路径）<br>默认使用APoiClusterActor |
| ClusterWidgetClass | String | 否 | "" | 聚合POI的Widget类路径（完整类路径）<br>默认使用原始POI的Widget类 |
| VisualizerType | String | 否 | "Actor" | 可视化类型（固定为 "Actor"） |

**调用示例**

基础配置：

```json
{
  "CMD": "/poiManager/SetAggregation",
  "Data": {
    "GroupID": "Default",
    "EnableAggregation": true,
    "AggregationDistance": 300000.0,
    "MinClusterSize": 2,
    "MaxTreeDepth": 6,
    "HysteresisRatio": 1.2,
    "ClusterStyleJson": {
      "InteractionBtn": {
        "LinearColor": {"R": 1.0, "G": 0.5, "B": 0.0, "A": 1.0}
      },
      "TitleContent": {
        "Text": "聚合"
      }
    },
    "VisualizerType": "Actor"
  }
}

```

大场景配置（POI 分布很广）：

```json
{
  "CMD": "/poiManager/SetAggregation",
  "Data": {
    "GroupID": "LargeScene",
    "EnableAggregation": true,
    "AggregationDistance": 500000.0,
    "MaxTreeDepth": 8,
    "MinClusterSize": 3
  }
}

```

小场景配置（POI 分布密集）：

```json
{
  "CMD": "/poiManager/SetAggregation",
  "Data": {
    "GroupID": "SmallScene",
    "EnableAggregation": true,
    "AggregationDistance": 100000.0,
    "MaxTreeDepth": 4,
    "MinClusterSize": 2
  }
}

```

自定义聚合POI外观：

```json
{
  "CMD": "/poiManager/SetAggregation",
  "Data": {
    "GroupID": "CustomCluster",
    "EnableAggregation": true,
    "AggregationDistance": 300000.0,
    "ClusterActorClass": "/Script/WebCore.CustomClusterActor",
    "ClusterWidgetClass": "/Script/UMGEditor.WidgetBlueprint'/Game/UI/CustomClusterWidget.CustomClusterWidget_C'",
    "ClusterStyleJson": {
      "InteractionBtn": {
        "LinearColor": {"R": 1.0, "G": 0.5, "B": 0.0, "A": 1.0}
      }
    }
  }
}

```

**聚合效果说明**：

| 相机距离 | 四叉树层级 | 网格大小 | 聚合效果 |
|---------|-----------|---------|---------|
| 很远 (>1000m) | 层级 0 | 整个区域 | **所有 POI 聚合成 1 个** |
| 远 (800m) | 层级 1 | 大网格 | POI 聚合成 4 个 |
| 中等 (500m) | 层级 3 | 中网格 | POI 聚合成 16 个 |
| 较近 (300m) | 层级 5 | 小网格 | POI 聚合成 64 个 |
| 很近 (<100m) | 层级 6 | 最小网格 | 显示所有原始 POI |

**参数调优建议**：

1. **AggregationDistance（聚合基准距离）**
   - 大场景：增加到 5000m (500000.0)
   - 小场景：减少到 1000m (100000.0)
   - 作用：控制聚合的触发距离

2. **MaxTreeDepth（四叉树最大深度）**
   - 大场景：增加到 8（更细粒度）
   - 小场景：减少到 4（更粗粒度）
   - 作用：控制聚合的层级数量（层级范围为 0 到 MaxTreeDepth）

3. **MinClusterSize（最小簇大小）**
   - 性能优化：增加到 3-5
   - 显示更多：保持 4
   - 作用：过滤小簇，减少渲染开销

4. **HysteresisRatio（滞后比率）**
   - 减少更新：增加到 1.5-2.0
   - 更灵敏：保持 1.2
   - 作用：防止频繁切换

**注意事项**：

- 设置聚合配置后，系统会自动启动定时器（每0.1秒）更新聚合状态，无需手动调用更新接口
- 聚合更新会自动根据相机位置进行（不再需要相机方向参数）
- 系统固定使用**四叉树 + GPU 混合方案**，无需指定 SpatialIndexType、StrategyType、ComputeType
- 聚合 POI 会自动显示包含的 POI 数量（如 "3" 表示聚合了 3 个 POI）
- 禁用聚合（`EnableAggregation=false`）时会自动清理聚合状态并恢复所有 POI 的可见性

**隐藏参数**（保留但不推荐使用）：

| 参数名 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| SpatialIndexType | String | "QuadTree" | 空间索引类型（固定为四叉树） |
| StrategyType | String | "DistanceBased" | 聚合策略类型（固定为基于距离） |

这些参数在代码中保留以便未来扩展，但当前版本固定使用四叉树+距离策略。

**技术细节**：

- **空间索引**：O(log n) 四叉树查询
- **层级计算**：O(1) 动态网格大小
- **GPU 聚合**：O(n) 并行网格分配
- **性能提升**：10x+ 对于大量 POI

详细技术文档请参考：`WebCore/Documentation/POI_Aggregation_QuadTree_GPU.md`

---

### 4. DestroyPoi - 销毁POI

**功能描述**：销毁指定的POI，支持单个、批量或按分组销毁。

**Reset 支持**：❌ 不支持 - 销毁操作本身就是清理状态，无需恢复

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|---|---|---|---|---|
| IDs | Array[String] | 否 | - | POI标识符数组（与Group二选一） |
| Group | String | 否 | - | 分组ID（与IDs二选一） |

**参数说明**：

- `IDs` 和 `Group` 必须提供其中一个
- 如果同时提供，优先使用 `Group`
- 按分组销毁时会同时清理该分组的聚合配置和样式缓存

**调用示例**

批量销毁：

```json
{
  "CMD": "/poiManager/DestroyPoi",
  "Data": {
    "IDs": ["poi_0", "poi_1", "poi_2"]
  }
}

```

按分组销毁：

```json
{
  "CMD": "/poiManager/DestroyPoi",
  "Data": {
    "Group": "Default"
  }
}

```

**响应示例**

按分组销毁响应：

```json
{
  "StatusCode": 200,
  "Message": "分组POI销毁完成，共销毁 5 个POI"
}

```

批量销毁响应（全部成功）：

```json
{
  "StatusCode": 200,
  "Message": "所有POI批量销毁成功",
  "DestroyResult": {
    "RequestedCount": 3,
    "SuccessCount": 3,
    "FailedCount": 0
  }
}

```

批量销毁响应（部分成功）：

```json
{
  "StatusCode": 200,
  "Message": "部分POI批量销毁成功",
  "DestroyResult": {
    "RequestedCount": 3,
    "SuccessCount": 2,
    "FailedCount": 1,
    "FailedPoiIDs": ["poi_2"]
  }
}

```

批量销毁响应（全部失败）：

```json
{
  "StatusCode": 404,
  "Message": "所有POI批量销毁失败",
  "DestroyResult": {
    "RequestedCount": 3,
    "SuccessCount": 0,
    "FailedCount": 3,
    "FailedPoiIDs": ["poi_0", "poi_1", "poi_2"]
  }
}

```

---

### 5. BindPoiEvent - 绑定POI事件

**功能描述**：绑定POI的交互事件（点击、悬停等），支持前端回调函数和 Action 绑定两种方式。

**Reset 支持**：❌ 不支持 - 只修改现有对象属性，不创建新对象

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|---|---|---|---|---|
| PoiID | String | 是 | - | POI标识符 |
| EventType | String | 是 | "click" | 事件类型（click、hover、unhover） |
| CallbackFunction | String | 否 | "" | 前端回调函数名称（与 Actions 二选一或同时使用） |
| Actions | Array[Object] | 否 | `[]` | Action 绑定列表（与 CallbackFunction 二选一或同时使用） |

**参数说明**：

- `CallbackFunction` 和 `Actions` 必须提供其中一个，也可以同时使用
- 绑定事件后会自动启用对应的交互（click 启用点击，hover/unhover 启用悬停）
- 多次绑定同一事件类型会追加 Action，不会覆盖已有绑定

**Actions 数组元素结构**：

| 参数名 | 类型 | 必选 | 说明 |
|---|---|---|---|
| Action | String | 是 | Action 名称（如 "FocusOnPoi"） |
| Params | Object | 否 | Action 参数 |

**调用示例**

使用前端回调（向后兼容）：

```json
{
  "CMD": "/poiManager/BindPoiEvent",
  "Data": {
    "PoiID": "poi_0",
    "EventType": "click",
    "CallbackFunction": "onPoiClicked"
  }
}

```

使用 Action 绑定（新格式）：

```json
{
  "CMD": "/poiManager/BindPoiEvent",
  "Data": {
    "PoiID": "poi_0",
    "EventType": "click",
    "Actions": [
      {
        "Action": "FocusOnPoi",
        "Params": {
          "Duration": 1.5
        }
      }
    ]
  }
}

```

同时使用回调和 Action：

```json
{
  "CMD": "/poiManager/BindPoiEvent",
  "Data": {
    "PoiID": "poi_0",
    "EventType": "click",
    "CallbackFunction": "onPoiClicked",
    "Actions": [
      {
        "Action": "FocusOnPoi",
        "Params": {
          "Duration": 1.0
        }
      }
    ]
  }
}

```

**响应示例**

```json
{
  "StatusCode": 200,
  "Message": "POI事件绑定成功",
  "EventBinding": {
    "PoiID": "poi_0",
    "EventType": "click",
    "CallbackFunction": "onPoiClicked",
    "ActionCount": 1,
    "InteractionEnabled": true
  }
}

```

---

### 6. UnbindPoiEvent - 解绑POI事件

**功能描述**：解绑POI的交互事件，支持解绑所有绑定或指定 Action。

**Reset 支持**：❌ 不支持 - 只修改现有对象属性，不创建新对象

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|---|---|---|---|---|
| PoiID | String | 是 | - | POI标识符 |
| EventType | String | 是 | "click" | 事件类型（click、hover、unhover） |
| ActionName | String | 否 | "" | 要解绑的 Action 名称（为空则解绑该事件的所有绑定） |

**参数说明**：

- 如果 `ActionName` 为空，会解绑该事件类型的所有绑定（包括 CallbackFunction 和所有 Actions）
- 如果指定 `ActionName`，只解绑该 Action，保留其他绑定
- 当某事件类型的所有绑定都被解除后，会自动禁用对应的交互

**调用示例**

解绑所有绑定：

```json
{
  "CMD": "/poiManager/UnbindPoiEvent",
  "Data": {
    "PoiID": "poi_0",
    "EventType": "click"
  }
}

```

解绑指定 Action：

```json
{
  "CMD": "/poiManager/UnbindPoiEvent",
  "Data": {
    "PoiID": "poi_0",
    "EventType": "click",
    "ActionName": "FocusOnPoi"
  }
}

```

**响应示例**

```json
{
  "StatusCode": 200,
  "Message": "POI事件解绑成功",
  "EventUnbinding": {
    "PoiID": "poi_0",
    "EventType": "click",
    "ActionName": "FocusOnPoi",
    "InteractionDisabled": false
  }
}

```

---

## Reset 机制说明

### 什么是 Reset？

Reset 是命令的撤销机制，用于恢复到命令执行前的状态。**只有创建了新对象的命令才支持 Reset**。

### Reset 支持情况

| 命令 | Reset 支持 | Reset 行为 | 原因 |
|------|-----------|-----------|------|
| CreatePoi | ✅ 支持 | 销毁所有创建的 POI | 创建了新的 POI 对象 |
| SetAggregation | ✅ 支持 | 取消聚合并销毁聚合对象 | 创建了聚合对象（Cluster Actors） |
| UpdatePoi | ❌ 不支持 | - | 只修改现有对象属性 |
| DestroyPoi | ❌ 不支持 | - | 销毁操作本身就是清理 |
| BindPoiEvent | ❌ 不支持 | - | 只修改现有对象属性 |
| UnbindPoiEvent | ❌ 不支持 | - | 只修改现有对象属性 |

### Reset 设计原则

**核心原则**：Reset = 撤销命令创建的对象，恢复到命令执行前的状态

- **需要 Reset**：命令创建了新对象（POI、聚合对象等）
- **不需要 Reset**：命令只修改了现有对象的属性或销毁了对象

### 使用示例

```javascript
// 创建 POI（支持 Reset）
emitUIInteraction({
  CMD: "/poiManager/CreatePoi",
  Data: {
    PoiPrefix: "test",
    Group: "TestGroup",
    Positions: [[0,0,0], [100,0,0]]
  }
});

// 调用 Reset 会销毁所有创建的 POI
// 系统会自动调用 Factory->DestroyAllPois()

// 设置聚合（支持 Reset）
emitUIInteraction({
  CMD: "/poiManager/SetAggregation",
  Data: {
    GroupID: "TestGroup",
    EnableAggregation: true
  }
});

// 调用 Reset 会取消聚合并销毁聚合创建的 Cluster Actors
// 系统会自动调用 Factory->ClearAggregation(GroupID)

// 更新 POI（不支持 Reset）
emitUIInteraction({
  CMD: "/poiManager/UpdatePoi",
  Data: {
    Group: "TestGroup",
    StyleJson: {LinearColor: {R: 1.0, G: 1.0, B: 1.0, A: 1.0}}
  }
});

// 此命令不支持 Reset，因为只修改了现有对象的属性

```

---

## POI Event Action 系统

### 概述

POI Event Action 系统是一个可扩展的事件处理机制，允许在 POI 交互事件（点击、悬停等）触发时执行预定义的操作。

### 内置 Actions

#### FocusOnPoi - 聚焦到POI

将相机聚焦到 POI 位置。内部调用 `/cameraManager/setDesiredLocation` 命令。

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Duration | Float | 否 | 1.0 | 相机过渡时间（秒） |
| Zoom | Float | 否 | 50.0 | 目标点到相机的距离（米）。最终相机位置 = POI位置 - 朝向 × Zoom |

**使用示例**：

```json
{
  "CMD": "/poiManager/BindPoiEvent",
  "Data": {
    "PoiID": "poi_0",
    "EventType": "click",
    "Actions": [
      {
        "Action": "FocusOnPoi",
        "Params": {
          "Duration": 1.5,
          "Zoom": 100.0
        }
      }
    ]
  }
}

```

### 自定义 Action 开发

#### C++ 实现

1. 创建继承自 `UPoiEventAction` 的类
2. 重写 `GetActionName()` 返回唯一名称
3. 重写 `Execute()` 实现具体逻辑
4. 使用 `IMPLEMENT_POI_ACTION` 宏自动注册

```cpp
// MyCustomAction.h
#pragma once
#include "Misc/PoiEvents/PoiEventAction.h"
#include "MyCustomAction.generated.h"

UCLASS(BlueprintType, Blueprintable)
class UMyCustomAction : public UPoiEventAction
{
    GENERATED_BODY()
public:
    virtual FString GetActionName_Implementation() const override;
    virtual void Execute_Implementation(AWebCorePoiActorBase* Poi, const FJsonLibraryObject& Params) override;
};

// MyCustomAction.cpp
#include "MyCustomAction.h"
#include "Misc/PoiEvents/PoiEventActionRegistry.h"

IMPLEMENT_POI_ACTION(MyCustomAction, UMyCustomAction)

FString UMyCustomAction::GetActionName_Implementation() const
{
    return TEXT("MyCustomAction");
}

void UMyCustomAction::Execute_Implementation(AWebCorePoiActorBase* Poi, const FJsonLibraryObject& Params)
{
    // 实现自定义逻辑
    // 可以使用 ExecuteCommand() 调用其他 Web Command
    // 可以使用 SendToFrontend() 发送消息到前端
}

```

#### 蓝图实现

1. 创建继承自 `PoiEventAction` 的蓝图类
2. 重写 `GetActionName` 函数
3. 重写 `Execute` 函数
4. 通过 `RegisterActionByPath` 注册

### Action 辅助方法

在 Action 的 `Execute` 方法中可以使用以下辅助方法：

| 方法 | 说明 |
|------|------|
| `GetWorld()` | 获取当前 World 对象 |
| `ExecuteCommand(CommandPath, Params)` | 执行其他 Web Command |
| `SendToFrontend(EventType, Data)` | 发送消息到前端（通过 PixelStreaming） |

### 多 Action 绑定

一个事件可以绑定多个 Action，按数组顺序依次执行：

```json
{
  "CMD": "/poiManager/BindPoiEvent",
  "Data": {
    "PoiID": "poi_0",
    "EventType": "click",
    "Actions": [
      {
        "Action": "FocusOnPoi",
        "Params": { "Duration": 1.0 }
      },
      {
        "Action": "MyCustomAction",
        "Params": { "CustomParam": "value" }
      }
    ]
  }
}

```

---

## 错误处理

| 错误码 | 说明 | 常见原因 | 建议处理 |
|---|---|---|---|
| INVALID_PARAMETERS | 输入缺失或格式错误 | 缺少 `PoiID`、`GroupID`等 | 按文档补齐字段并检查数组长度 |
| RESOURCE_NOT_FOUND | 未找到目标Pawn/Actor | 世界未初始化或标签错误 | 在Pawn就绪后再调用 |
| DEPENDENCY_FAILED | 依赖模块未准备好 | `PoiManager` 未获取到 | 检查插件加载顺序或初始化日志 |

**错误示例**

```json
{
  "StatusCode": 400,
  "Message": "Missing required parameter: PoiID"
}

```

---

## StyleJson 参数详细说明

`StyleJson` 是一个嵌套的JSON对象，用于配置POI Widget中各个控件的样式。其结构为：

```json
{
  "ControlName1": { /* 控件1的样式配置 */ },
  "ControlName2": { /* 控件2的样式配置 */ },
  ...
}

```

### 支持的控件类型

#### 1. Button（按钮）

| 参数名 | 类型 | 说明 |
|--------|------|------|
| Url | String | 缓存中的贴图注册名称（优先使用） |
| Texture | String | 贴图资源路径（兼容旧逻辑） |
| LinearColor | Object | 颜色叠加 {R, G, B, A}，范围 0.0-1.0，应用于 Normal/Hovered/Pressed 状态 |
| Size | Object | 尺寸 {X, Y}（像素单位，仅 CanvasPanel 有效） |
| Offset | Object | 位置偏移 {X, Y}（像素单位，仅 CanvasPanel 有效） |
| Margin | Object | 边距 {Left, Top, Right, Bottom}（像素单位） |
| Alignment | Object | 对齐 {X, Y}，范围 0.0-1.0 |
| Visible | Boolean | 是否可见 |

**示例**：

```json
{
  "InteractionBtn": {
    "Url": "button_icon",
    "LinearColor": {"R": 1.0, "G": 1.0, "B": 1.0, "A": 1.0},
    "Size": {"X": 100, "Y": 50},
    "Offset": {"X": 10, "Y": 20},
    "Visible": true
  }
}

```

#### 2. TextBlock（文本）

| 参数名 | 类型 | 说明 |
|--------|------|------|
| Text | String | 文本内容 |
| FontSize | Integer | 字体大小 |
| Font | String | 字体资源路径 |
| LinearColor | Object | 文本颜色 {R, G, B, A}，范围 0.0-1.0 |
| Justification | Integer | 对齐方式：0=左对齐, 1=居中, 2=右对齐 |
| Size | Object | 尺寸 {X, Y}（像素单位，仅 CanvasPanel 有效） |
| Offset | Object | 位置偏移 {X, Y}（像素单位，仅 CanvasPanel 有效） |
| Margin | Object | 边距 {Left, Top, Right, Bottom}（像素单位） |
| Alignment | Object | 对齐 {X, Y}，范围 0.0-1.0 |
| Visible | Boolean | 是否可见 |

**示例**：

```json
{
  "TitleContent": {
    "Text": "POI标题",
    "FontSize": 24,
    "LinearColor": {"R": 1.0, "G": 1.0, "B": 1.0, "A": 1.0},
    "Justification": 1,
    "Offset": {"X": 0, "Y": -30},
    "Visible": true
  }
}

```

#### 3. Image（图片）

| 参数名 | 类型 | 说明 |
|--------|------|------|
| Url | String | 缓存中的贴图注册名称（优先使用） |
| Texture | String | 贴图资源路径（兼容旧逻辑） |
| LinearColor | Object | 颜色叠加（Tint）{R, G, B, A}，范围 0.0-1.0 |
| Size | Object | 尺寸 {X, Y}（像素单位，仅 CanvasPanel 有效） |
| Offset | Object | 位置偏移 {X, Y}（像素单位，仅 CanvasPanel 有效） |
| Margin | Object | 边距 {Left, Top, Right, Bottom}（像素单位） |
| Alignment | Object | 对齐 {X, Y}，范围 0.0-1.0 |
| Visible | Boolean | 是否可见 |

**示例**：

```json
{
  "IconImage": {
    "Url": "poi_icon",
    "LinearColor": {"R": 1.0, "G": 1.0, "B": 1.0, "A": 1.0},
    "Size": {"X": 64, "Y": 64},
    "Offset": {"X": 0, "Y": 0},
    "Visible": true
  }
}

```

### 通用样式参数（所有控件）

以下参数可应用于任何控件类型：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| LinearColor | Object | 颜色 {R, G, B, A}，范围 0.0-1.0 |
| Visible | Boolean | 是否可见 |
| Size | Object | 尺寸 {X, Y}（仅 CanvasPanel 有效） |
| Offset | Object | 位置偏移 {X, Y}（仅 CanvasPanel 有效） |
| Margin | Object | 边距 {Left, Top, Right, Bottom} |
| Alignment | Object | 对齐 {X, Y}，范围 0.0-1.0 |

### 完整示例

```json
{
    "CMD": "/poiManager/CreatePoi",
    "Data":{
      "Ids": ["building"],
      "Group": "Buildings",
      "Positions": [[100, 200, 0], [300, 400, 0]],
      "PoiClass": "/Script/WebCore.WebCorePoiActorBase",
      "UMGClass": "/Script/UMGEditor.WidgetBlueprint'/WebCore/Res/POI/UMG/POIUMG_Standard.POIUMG_Standard_C'",
      "EnableClick": true,
      "EnableHover": false,
      "Texts": {
        "TitleContent": ["前海自贸大厦", "前海大厦"]
      },
      "StyleJson": {
        "InteractionBtn": {
          "LinearColor": {"R": 1, "G": 0, "B": 0, "A": 1.0}
        },
        "TitleContent": {
          "FontSize": 16,
          "LinearColor": {"R": 1, "G": 0, "B": 1.0, "A": 1.0}
        }
      },
      "Events": {
        "click": [
          {
            "Action": "FocusOnPoi",
            "Params": { "Duration": 1.0 }
          }
        ]
    }
  }
}

```

### 样式应用规则

1. **控件名称匹配**：StyleJson 的键必须与 Widget 中的控件名称完全匹配
2. **类型自动识别**：系统会自动识别控件类型（Button/TextBlock/Image）并应用对应样式
3. **缓存优先**：贴图优先从 `WebCacheManager` 缓存中获取（通过 `Url`），如果缓存中没有则尝试直接加载（通过 `Texture`）
4. **部分更新**：只需提供需要修改的参数，未提供的参数保持原值
5. **Canvas Panel 限制**：部分布局参数（如 Size、Offset）仅在控件位于 Canvas Panel 中时有效

### 样式缓存机制

系统采用样式预编译和缓存机制，大幅提升批量创建POI的性能：

#### 缓存策略

1. **智能缓存键**：使用 `GroupID_StyleHash` 作为缓存键
   - 同一分组的不同样式不会冲突
   - 相同样式自动共享缓存
   
2. **CreatePoi 缓存**：创建POI时会缓存样式
   - 首次创建：编译StyleJson并缓存
   - 后续创建：直接使用缓存，无需重复解析JSON
   
3. **UpdatePoi 不缓存**：更新POI时临时编译样式
   - 不会修改缓存
   - 适合调试和临时修改

#### 自动清理机制

- **DestroyPoisByGroup**：销毁分组时，自动清理该分组的所有样式缓存
- **DestroyAllPois**：销毁所有POI时，自动清理所有样式缓存
- **CreatePoiCommand Reset**：撤销创建时，自动清理所有样式缓存
- **PIE 重启**：编辑器 PIE 重启时，自动清理所有缓存（包括样式缓存和类缓存）

#### 缓存优化

- **分组索引**：使用分组索引加速缓存清理，从 O(n) 优化到 O(1) 查找
- **类缓存**：POI Actor 类和 Widget 类只加载一次，后续复用
- **静态默认类**：默认 Widget 类使用静态缓存，避免重复加载

#### 性能提升

- 创建10000个相同样式的POI：性能提升约 **5-10倍**
- 调试样式时不会积累缓存：UpdatePoi 不缓存，销毁时自动清理

### 注意事项

- **颜色参数名称**：必须使用 `LinearColor`（而非 `color`），格式为 `{R, G, B, A}`
- **颜色格式**：LinearColor 使用浮点数 {0.0-1.0}，而非整数 {0-255}
- **单位**：Offset、Size、Margin 等布局参数使用像素单位
- **Size参数格式**：所有控件统一使用 `{X, Y}` 格式
- **贴图缓存**：使用 `Url` 参数前，需先通过 AssetLibrary 命令将贴图加载到缓存
- **控件名称**：确保 StyleJson 中的键与 UMG Widget 中的控件名称一致
- **Canvas Panel 依赖**：Size 和 Offset 参数仅在控件位于 Canvas Panel 中时有效
- **不支持的参数**：字体加粗/斜体、阴影效果、边框样式、动画效果等暂不支持

---

## 使用注意事项

### 基础使用

- **单位换算**：JSON中的位置与距离会自动做单位换算，保持与UE世界单位一致
- **批量创建**：`CreatePoi` 的 `Positions` 数组长度决定创建的POI数量
- **ID 生成规则**：
  - 单个ID：第1个POI使用原始ID，后续为 `{ID}_1`, `{ID}_2`, ...
  - 多个ID：必须与 Positions 数量相等，直接使用用户提供的ID
- **Texts 参数**：支持为每个POI设置不同的文本内容，单值共用，多值必须与POI数量相等
- **分组合并**：当使用 `MergeStrategy="Merge"` 时，如果 `Group` 已存在，新创建的POI会合并到现有分组中；否则会返回错误
- **自动聚合更新**：`SetAggregation` 会自动启动定时器（每0.1秒）更新聚合状态，无需手动调用更新接口
- **事件广播**：POI事件绑定后，当事件触发时会通过Pixel Streaming广播到Web端
- **批量操作**：`UpdatePoi` 和 `DestroyPoi` 都支持批量操作，可以通过数组或分组ID进行批量处理
- **事件类型**：支持的事件类型包括 `click`（点击）、`hover`（悬停）、`unhover`（取消悬停）

### Reset 机制

- **Reset 语义**：Reset 用于撤销命令创建的对象，恢复到命令执行前的状态
- **支持 Reset 的命令**：
  - `CreatePoi` - Reset 时销毁所有创建的 POI
  - `SetAggregation` - Reset 时取消聚合并销毁聚合对象
- **不支持 Reset 的命令**：
  - `UpdatePoi` - 只修改属性，不创建对象
  - `DestroyPoi` - 销毁操作本身就是清理
  - `BindPoiEvent` / `UnbindPoiEvent` - 只修改属性
- **自动调用**：Reset 通常由系统自动调用，无需手动触发

### 性能优化

- **样式缓存**：
  - CreatePoi 会缓存样式，批量创建时性能提升 5-10 倍
  - UpdatePoi 不缓存，适合调试和临时修改
  - 使用 `GroupID_StyleHash` 智能缓存键，避免冲突
- **聚合优化**：使用聚合功能可以大幅减少渲染开销，适合大量 POI 场景
- **自动清理**：销毁 POI 时自动清理样式缓存，避免内存泄漏

### 调试样式最佳实践

```javascript
// 1. 创建测试 POI
emitUIInteraction({
  CMD: "/poiManager/CreatePoi",
  Data: {
    PoiPrefix: "test",
    Group: "DebugGroup",
    Positions: [[0,0,0]],
    StyleJson: {
      IconImage: { LinearColor: {"R": 1.0, "G": 1.0, "B": 1.0, "A": 1.0} }
    }
  }
});

// 2. 调试样式 - 使用 UpdatePoi（不会缓存）
emitUIInteraction({
  CMD: "/poiManager/UpdatePoi",
  Data: {
    Group: "DebugGroup",
    StyleJson: {
      IconImage: { LinearColor: {"R": 1.0, "G": 0.0, "B": 0.0, "A": 1.0} }
    }
  }
});

// 3. 绑定点击事件 - 使用 Action
emitUIInteraction({
  CMD: "/poiManager/BindPoiEvent",
  Data: {
    PoiID: "test_0",
    EventType: "click",
    Actions: [
      { Action: "FocusOnPoi", Params: { Duration: 1.0 } }
    ]
  }
});

// 4. 调试完成 - 销毁时自动清理所有缓存
emitUIInteraction({
  CMD: "/poiManager/DestroyPoi",
  Data: { Group: "DebugGroup" }
});

```
