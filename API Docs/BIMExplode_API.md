# BIM爆炸展开 API 文档

## 概述

BIM爆炸展开功能支持多建筑同时操作，每个建筑通过 `TagPrefix` 标识。

**核心特性**：
- 首次调用自动初始化，无需手动调用初始化命令
- 支持多建筑同时操作
- 缓存机制，初始化一次后续直接使用

---

## 快速开始

### 1. 给Actor添加Tag

```
{前缀}_{楼层ID}

示例（前缀为 BuildingA）：
- BuildingA_B2  → 地下2层
- BuildingA_B1  → 地下1层
- BuildingA_1F  → 1层
- BuildingA_2F  → 2层
- BuildingA_RF  → 屋顶层
```

### 2. 直接调用（自动初始化）

```javascript
// 一行代码搞定，无需初始化，无需Delay
emitUIInteraction({
    Factory: "BIMExplode",
    Command: "SetLayerExpanded",
    TagPrefix: "BuildingA",
    bExpand: true,
    LayerSpacing: 5,
    Duration: 1.0
});
```

---

## 命令列表

### 1. SetLayerExpanded - 分层展开

**参数：**
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| TagPrefix | string | 是 | - | 建筑标识 |
| bExpand | bool | 否 | true | 是否展开 |
| LayerSpacing | float | 否 | 5.0 | 层间距（米）|
| Duration | float | 否 | 0.5 | 动画时长（秒）|

**说明：**
- 收起分层时会自动推回所有已拉出的楼层

**示例：**
```javascript
emitUIInteraction({
    Factory: "BIMExplode",
    Command: "SetLayerExpanded",
    TagPrefix: "BuildingA",
    bExpand: true,
    LayerSpacing: 5,
    Duration: 1.0
});
```

---

### 2. PullDrawer - 拉出抽屉

**参数：**
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| TagPrefix | string | 是 | - | 建筑标识 |
| FloorId | string | 是 | - | 楼层ID |
| Direction | [x, y] | 否 | [1, 0] | 拉出方向 |
| Distance | float | 否 | 10.0 | 拉出距离（米）|
| Duration | float | 否 | 0.3 | 动画时长（秒）|

**示例：**
```javascript
emitUIInteraction({
    Factory: "BIMExplode",
    Command: "PullDrawer",
    TagPrefix: "BuildingA",
    FloorId: "2F",
    Direction: [1, 0],
    Distance: 10,
    Duration: 0.5
});
```

---

### 3. PushDrawer - 收回抽屉

**参数：**
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| TagPrefix | string | 是 | - | 建筑标识 |
| FloorId | string | 否 | "" | 楼层ID（空则收回所有）|
| Duration | float | 否 | 0.3 | 动画时长（秒）|

---

### 4. SetExplodeFactor - 爆炸展开

**参数：**
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| TagPrefix | string | 是 | - | 建筑标识 |
| Factor | float | 否 | 0.0 | 爆炸系数（0=收起，1=展开）|
| Duration | float | 否 | 0.5 | 动画时长（秒）|
| Center | [x, y, z] | 否 | 自动 | 爆炸中心（米）|

---

### 5. GetFloorList - 获取楼层列表

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| TagPrefix | string | 是 | 建筑标识 |

**返回值：**
```json
{
    "TagPrefix": "BuildingA",
    "Floors": [
        { "FloorId": "B1", "FloorIndex": -1, "ActorCount": 50, "IsDrawerPulled": false },
        { "FloorId": "1F", "FloorIndex": 0, "ActorCount": 100, "IsDrawerPulled": false },
        { "FloorId": "2F", "FloorIndex": 1, "ActorCount": 80, "IsDrawerPulled": true }
    ],
    "IsLayerExpanded": true,
    "CurrentLayerSpacing": 5.0,
    "ExplodeFactor": 0.0,
    "IsAnimating": false
}
```

---

### 6. GetInitializedList - 获取已初始化的建筑列表

**参数：** 无

**返回值：**
```json
{
    "Buildings": [
        { "TagPrefix": "BuildingA", "FloorCount": 5, "IsLayerExpanded": true, "ExplodeFactor": 0.0 },
        { "TagPrefix": "BuildingB", "FloorCount": 3, "IsLayerExpanded": false, "ExplodeFactor": 0.5 }
    ],
    "Count": 2
}
```

---

### 7. Reset - 重置指定建筑

**参数：**
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| TagPrefix | string | 是 | - | 建筑标识 |
| Duration | float | 否 | 0.5 | 动画时长（秒）|

---

### 8. ResetAll - 重置所有建筑

**参数：**
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| Duration | float | 否 | 0.5 | 动画时长（秒）|

---

### 9. ClearCache - 清除指定建筑缓存

**参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| TagPrefix | string | 是 | 建筑标识 |

---

### 10. ClearAllCache - 清除所有缓存

**参数：** 无

---

### 11. FlyToFloorViewPoint - 飞到楼层观察点

**参数：**
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| TagPrefix | string | 是 | - | 建筑标识 |
| FloorId | string | 是 | - | 楼层ID |
| Duration | float | 否 | 1.0 | 飞行时长（秒）|

---

## Tag命名规则

| 格式 | 说明 | FloorIndex |
|------|------|------------|
| `{Prefix}_B{N}` | 地下N层 | -N |
| `{Prefix}_{N}F` | 地上N层 | N-1 |
| `{Prefix}_RF` | 屋顶层 | 最高层+1 |

---

## 多建筑操作示例

```javascript
// 同时操作两栋建筑
emitUIInteraction({
    Factory: "BIMExplode",
    Command: "SetLayerExpanded",
    TagPrefix: "BuildingA",
    bExpand: true,
    LayerSpacing: 5
});

emitUIInteraction({
    Factory: "BIMExplode",
    Command: "SetLayerExpanded",
    TagPrefix: "BuildingB",
    bExpand: true,
    LayerSpacing: 8
});

// 拉出 BuildingA 的 2F
emitUIInteraction({
    Factory: "BIMExplode",
    Command: "PullDrawer",
    TagPrefix: "BuildingA",
    FloorId: "2F",
    Direction: [1, 0],
    Distance: 10
});

// 爆炸 BuildingB
emitUIInteraction({
    Factory: "BIMExplode",
    Command: "SetExplodeFactor",
    TagPrefix: "BuildingB",
    Factor: 0.5
});

// 只重置 BuildingA
emitUIInteraction({
    Factory: "BIMExplode",
    Command: "Reset",
    TagPrefix: "BuildingA"
});

// 重置所有建筑
emitUIInteraction({
    Factory: "BIMExplode",
    Command: "ResetAll"
});
```
