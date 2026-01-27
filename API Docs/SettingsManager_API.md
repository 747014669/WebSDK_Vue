# Settings Manager API 文档

## 概述

Settings Manager 负责注册并执行所有与系统设置相关的Web命令，涵盖系统单位配置、输入处理器参数调整等功能。本模块旨在提供一个统一的接口，用于从Web端控制UE中的各项设置，确保配置的持久化和一致性。

---

## 命令索引

### 通用命令

1. [getRegisteredSettingTypes](#1-getregisteredsettingtypes---获取已注册的设置类型) - 获取所有已注册的设置类型
2. [getSettings](#2-getsettings---获取指定设置) - 获取指定类型的设置
3. [getAllSettings](#3-getallsettings---获取所有设置) - 获取所有设置
4. [updateSettings](#4-updatesettings---更新完整设置) - 更新指定设置的完整配置
5. [updateSettingProperty](#5-updatesettingproperty---更新单个属性) - 更新单个属性值
6. [resetSettings](#6-resetsettings---重置设置) - 重置为默认值
7. [reloadSettings](#7-reloadsettings---重新加载设置) - 从文件重新加载
8. [saveSettings](#8-savesettings---保存设置) - 保存到文件
9. [saveAllSettings](#9-saveallsettings---保存所有设置) - 保存所有设置

### 快捷命令（推荐）

10. [getSystemSettings](#10-getsystemsettings---获取系统设置快捷方式) - 快捷获取系统设置
11. [updateSystemSettings](#11-updatesystemsettings---更新系统设置快捷方式) - 快捷更新系统设置
12. [getHandlerSettings](#12-gethandlersettings---获取handler设置快捷方式) - 快捷获取Handler设置
13. [updateHandlerSettings](#13-updatehandlersettings---更新handler设置快捷方式) - 快捷更新Handler设置
14. [getWebCoreSettings](#14-getwebcoresettings---获取webcore设置快捷方式) - 快捷获取WebCore设置
15. [updateWebCoreSettings](#15-updatewebcoresettings---更新webcore设置快捷方式) - 快捷更新WebCore设置

### 地理参考系统命令

16. [initGeoReference](#16-initgeoreference---初始化地理参考系统) - 初始化地理参考系统

---

## 支持的设置类型

### SystemSettings - 系统设置

控制系统级别的配置，主要用于单位转换。

| 参数 | 类型 | 默认值 | 取值范围 | 描述 |
|---|---|---|---|---|
| SystemUnit | String | `"Meters"` | `"Meters"`, `"Centimeters"` | 系统单位设置。影响所有长度相关参数的换算。 |

**单位换算说明**:

- `Meters`: 1米 = 100厘米（UE单位）
- `Centimeters`: 1厘米 = 1厘米（UE单位）

**配置示例**:

```json
{
  "SystemUnit": "Meters"
}

```

---

### WebCoreSettings - WebCore 统一设置

包含地理参考配置、路径类型配置和漫游 Actor 配置。

#### 地理参考配置

控制地理参考系统（GeoReferencingSystem）的配置参数，用于地理坐标转换和定位。

##### 基础配置

| 参数 | 类型 | 默认值 | 取值范围 | 描述 |
|---|---|---|---|---|
| PlanetShape | Integer | `0` | `0` (平面地球), `1` (球形地球) | 星球形状类型。影响坐标转换算法。 |
| bOriginAtPlanetCenter | Boolean | `false` | true/false | 原点是否在星球中心。仅在 `PlanetShape=1` 时有效。 |

##### 坐标系配置

| 参数 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| ProjectedCRS | String | `"EPSG:4547"` | 投影坐标系标识符。使用 EPSG 代码格式。 |
| GeographicCRS | String | `"EPSG:4490"` | 地理坐标系标识符。使用 EPSG 代码格式。 |

**常用坐标系**:

- `EPSG:4547` - CGCS2000 / 3-degree Gauss-Kruger CM 114E（中国常用）
- `EPSG:4490` - China Geodetic Coordinate System 2000（中国大地坐标系）
- `EPSG:4326` - WGS 84（全球通用）
- `EPSG:3857` - Web Mercator（Web地图常用）

##### 原点配置

| 参数 | 类型 | 默认值 | 取值范围 | 描述 |
|---|---|---|---|---|
| bOriginLocationInProjectedCRS | Boolean | `false` | true/false | 原点位置是否使用投影坐标系表示。 |
| OriginLatitude | Double | `22.516226` | -90.0 ~ 90.0 | 原点纬度（度）。 |
| OriginLongitude | Double | `113.883095` | -180.0 ~ 180.0 | 原点经度（度）。 |
| OriginAltitude | Double | `0.0` | 任意值 | 原点高度（米）。 |

##### 路径类型配置

| 参数 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| PathTypes | Array | 见下方 | 路径类型注册列表。每个条目包含 TypeName 和 ActorClassPath。 |

**默认路径类型**:

```json
{
  "PathTypes": [
    {
      "TypeName": "Default",
      "ActorClassPath": "/WebCore/Res/PathTracer/BP_DefaultTracer.BP_DefaultTracer_C"
    },
    {
      "TypeName": "SplineMesh",
      "ActorClassPath": "/WebCore/Res/PathTracer/BP_SplineMeshTracer.BP_SplineMeshTracer_C"
    },
    {
      "TypeName": "SegmentedColor",
      "ActorClassPath": "/WebCore/Res/PathTracer/BP_SegmentColorTracer.BP_SegmentColorTracer_C"
    },
    {
      "TypeName": "ColorCurve",
      "ActorClassPath": "/WebCore/Res/PathTracer/BP_ColorCurveTracer.BP_ColorCurveTracer_C"
    }
  ]
}

```

##### 漫游 Actor 配置

| 参数 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| FlyActorClassPath | String | - | 飞行模式 Actor 类路径 |
| VehicleActorClassPath | String | - | 车辆模式 Actor 类路径 |
| CharacterActorClassPath | String | - | 角色模式 Actor 类路径 |

**完整配置示例**:

```json
{
  "PlanetShape": 0,
  "bOriginAtPlanetCenter": false,
  "ProjectedCRS": "EPSG:4547",
  "GeographicCRS": "EPSG:4490",
  "bOriginLocationInProjectedCRS": false,
  "OriginLatitude": 22.516226,
  "OriginLongitude": 113.883095,
  "OriginAltitude": 0.0,
  "PathTypes": [
    {
      "TypeName": "Default",
      "ActorClassPath": "/WebCore/Res/PathTracer/BP_DefaultTracer.BP_DefaultTracer_C"
    }
  ],
  "FlyActorClassPath": "/Game/Blueprints/BP_FlyPawn.BP_FlyPawn_C",
  "VehicleActorClassPath": "/Game/Blueprints/BP_Vehicle.BP_Vehicle_C",
  "CharacterActorClassPath": "/Game/Blueprints/BP_Character.BP_Character_C"
}

```

**使用场景**:

- 设置项目的地理坐标原点
- 配置坐标系转换参数
- 支持不同地区的坐标系统
- 配置可用的路径类型
- 自定义漫游 Actor

---

### HandlerSettings - 输入处理器设置

控制相机输入处理器的行为参数，包括旋转、平移、缩放等交互配置。

#### BaseConfig - 基础配置

| 参数 | 类型 | 默认值 | 取值范围 | 描述 |
|---|---|---|---|---|
| RaycastDistance | Float | `9999999.0` | > 0 | 射线检测的最大距离（UE单位）。用于场景交互拾取。 |
| TraceChannel | String | `"ECC_Visibility"` | UE碰撞通道 | 射线检测使用的碰撞通道。 |

#### RotateConfig - 旋转配置

| 参数 | 类型 | 默认值 | 取值范围 | 描述 |
|---|---|---|---|---|
| RotationSpeed | Float | `15.0` | 0.1 - 10.0 | 旋转速度倍率。值越大，旋转越快。 |
| MaxPitchAngle | Float | `85.0` | -90.0 - 90.0 | 最大俯仰角（度）。限制相机向上旋转的角度。 |
| MinPitchAngle | Float | `-85.0` | -90.0 - 90.0 | 最小俯仰角（度）。限制相机向下旋转的角度。 |
| bInvert | Boolean | `false` | true/false | 是否反转Yaw和Pitch轴的旋转方向。 |
| bEnableCollision | Boolean | `false` | true/false | 是否启用旋转时的碰撞检测。 |
| LagSpeed | Float | `6.0` | 1.0 - 20.0 | 平滑过渡滞后速度。值越大，过渡越快。 |

#### PanConfig - 平移配置

| 参数 | 类型 | 默认值 | 取值范围 | 描述 |
|---|---|---|---|---|
| PanSpeed | Float | `0.8` | 0.1 - 10.0 | 平移速度倍率。值越大，平移越快。 |
| bInvertDirection | Boolean | `false` | true/false | 是否反转平移方向。 |
| LagSpeed | Float | `8.0` | 1.0 - 20.0 | 平滑过渡滞后速度。值越大，过渡越快。 |

#### ZoomConfig - 缩放配置

| 参数 | 类型 | 默认值 | 取值范围 | 描述 |
|---|---|---|---|---|
| ZoomSpeed | Float | `3.5` | 0.1 - 10.0 | 缩放速度倍率。值越大，缩放越快。 |
| MinDistance | Float | `50.0` | > 0 | 最小缩放距离（UE单位）。相机距离目标的最近距离。 |
| MaxDistance | Float | `950000.0` | > MinDistance | 最大缩放距离（UE单位）。相机距离目标的最远距离。 |
| LagSpeed | Float | `10.0` | 1.0 - 20.0 | 平滑过渡滞后速度。值越大，过渡越快。 |

#### BindingConfig - 输入绑定配置 (新增)

控制输入动作与Handler的绑定关系，支持动态配置相机操作方式。

**输入动作类型 (InputAction)**:

| 值 | 中文名称 | 描述 |
|---|---|---|
| 0 | 无 | 不绑定任何动作 |
| 1 | 左键轻击 | 鼠标左键单击 |
| 2 | 左键长按 | 鼠标左键按住拖动 |
| 3 | 左键双击 | 鼠标左键双击 |
| 4 | 右键轻击 | 鼠标右键单击 |
| 5 | 右键长按 | 鼠标右键按住拖动 |
| 6 | 右键双击 | 鼠标右键双击 |
| 7 | 鼠标移动 | 鼠标移动事件 |
| 8 | 鼠标滚轮 | 鼠标滚轮滚动 |

**Handler类型 (Handler)**:

| 值 | 中文名称 | 描述 |
|---|---|---|
| 0 | 无 | 不绑定Handler |
| 1 | 平移 | PanHandler - 相机平移操作 |
| 2 | 旋转 | RotateHandler - 相机旋转操作 |
| 3 | 缩放 | ZoomHandler - 相机缩放操作 |

**优先级 (Priority)**:

| 值 | 名称 | 描述 |
|---|---|---|
| 0 | Low | 低优先级 |
| 1 | Normal | 普通优先级（默认） |
| 2 | High | 高优先级 |
| 3 | Critical | 关键优先级 |

**默认绑定配置**:

| 输入动作 | Handler | 优先级 | 说明 |
|---|---|---|---|
| 左键长按 (2) | 平移 (1) | Normal (1) | 按住左键拖动进行平移 |
| 右键长按 (5) | 旋转 (2) | Normal (1) | 按住右键拖动进行旋转 |
| 鼠标滚轮 (8) | 缩放 (3) | Normal (1) | 滚动滚轮进行缩放 |

**绑定配置示例**:

```json
{
  "BindingConfig": {
    "Count": 3,
    "Binding_0": {
      "InputAction": 2,
      "Handler": 1,
      "Priority": 1
    },
    "Binding_1": {
      "InputAction": 5,
      "Handler": 2,
      "Priority": 1
    },
    "Binding_2": {
      "InputAction": 8,
      "Handler": 3,
      "Priority": 1
    }
  }
}

```

**自定义绑定示例 - 交换左右键操作**:

```json
{
  "BindingConfig": {
    "Count": 3,
    "Binding_0": {
      "InputAction": 2,
      "Handler": 2,
      "Priority": 1
    },
    "Binding_1": {
      "InputAction": 5,
      "Handler": 1,
      "Priority": 1
    },
    "Binding_2": {
      "InputAction": 8,
      "Handler": 3,
      "Priority": 1
    }
  }
}

```

上述配置将左键长按改为旋转，右键长按改为平移。

**完整配置示例**:

```json
{
  "BaseConfig": {
    "RaycastDistance": 9999999.0,
    "TraceChannel": 0
  },
  "RotateConfig": {
    "RotationSpeed": 15.0,
    "MaxPitchAngle": 85.0,
    "MinPitchAngle": -85.0,
    "bInvert": false,
    "bEnableCollision": false,
    "LagSpeed": 6.0
  },
  "PanConfig": {
    "PanSpeed": 0.8,
    "bInvertDirection": false,
    "LagSpeed": 8.0
  },
  "ZoomConfig": {
    "ZoomSpeed": 3.5,
    "MinDistance": 50.0,
    "MaxDistance": 950000.0,
    "LagSpeed": 10.0
  },
  "BindingConfig": {
    "Count": 3,
    "Binding_0": {
      "InputAction": 2,
      "Handler": 1,
      "Priority": 1
    },
    "Binding_1": {
      "InputAction": 5,
      "Handler": 2,
      "Priority": 1
    },
    "Binding_2": {
      "InputAction": 8,
      "Handler": 3,
      "Priority": 1
    }
  }
}

```

---

## 命令详解

### 1. getRegisteredSettingTypes - 获取已注册的设置类型

**功能描述**: 
获取系统中所有已注册的设置类型名称列表。这是一个非常有用的初始化命令，建议在应用启动时调用，以动态构建设置UI或验证设置类型的可用性。

**参数**:
无。

**调用示例**:

```json
{
  "CMD": "/settingsManager/getRegisteredSettingTypes",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "SettingTypes": [
    "SystemSettings",
    "HandlerSettings",
    "WebCoreSettings"
  ]
}

```

**使用场景**:

- 应用启动时获取可用设置类型
- 动态构建设置类型选择器
- 验证自定义设置是否已注册

---

### 2. getSettings - 获取指定设置

**功能描述**: 
获取指定类型的完整设置配置。返回的JSON对象包含该设置类型的所有参数及其当前值。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| SettingType | String | 是 | 设置类型名称，如 `"SystemSettings"`, `"HandlerSettings"`。 |

**调用示例**:

```json
{
  "CMD": "/settingsManager/getSettings",
  "Data": {
    "SettingType": "SystemSettings"
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "SettingType": "SystemSettings",
  "Settings": {
    "SystemUnit": "Meters"
  }
}

```

**注意点**:

- `SettingType` 必须是已注册的设置类型，否则返回 `RESOURCE_NOT_FOUND` 错误。
- 可以先调用 `getRegisteredSettingTypes` 获取可用类型列表。

---

### 3. getAllSettings - 获取所有设置

**功能描述**: 
一次性获取所有已注册设置类型的完整配置。这是最高效的批量查询方式，推荐在应用初始化时使用。

**参数**:
无。

**调用示例**:

```json
{
  "CMD": "/settingsManager/getAllSettings",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Settings": {
    "SystemSettings": {
      "SystemUnit": "Meters"
    },
    "HandlerSettings": {
      "BaseConfig": {
        "RaycastDistance": 9999999.0,
        "TraceChannel": 0
      },
      "RotateConfig": {
        "RotationSpeed": 15.0,
        "MaxPitchAngle": 85.0,
        "MinPitchAngle": -85.0,
        "bInvert": false,
        "bEnableCollision": false,
        "LagSpeed": 6.0
      },
      "PanConfig": {
        "PanSpeed": 0.8,
        "bInvertDirection": false,
        "LagSpeed": 8.0
      },
      "ZoomConfig": {
        "ZoomSpeed": 3.5,
        "MinDistance": 50.0,
        "MaxDistance": 950000.0,
        "LagSpeed": 10.0
      },
      "BindingConfig": {
        "Count": 3,
        "Binding_0": {
          "InputAction": 2,
          "Handler": 1,
          "Priority": 1
        },
        "Binding_1": {
          "InputAction": 5,
          "Handler": 2,
          "Priority": 1
        },
        "Binding_2": {
          "InputAction": 8,
          "Handler": 3,
          "Priority": 1
        }
      }
    },
    "WebCoreSettings": {
      "PlanetShape": 0,
      "bOriginAtPlanetCenter": false,
      "ProjectedCRS": "EPSG:4547",
      "GeographicCRS": "EPSG:4490",
      "bOriginLocationInProjectedCRS": false,
      "OriginLatitude": 22.516226,
      "OriginLongitude": 113.883095,
      "OriginAltitude": 0.0,
      "PathTypes": [
        {
          "TypeName": "Default",
          "ActorClassPath": "/WebCore/Res/PathTracer/BP_DefaultTracer.BP_DefaultTracer_C"
        }
      ]
    }
  }
}

```

**使用场景**:

- 应用启动时同步所有设置
- 导出完整配置
- 设置备份

---

### 4. updateSettings - 更新完整设置

**功能描述**: 
更新指定设置类型的配置。支持部分更新（只更新提供的字段），未提供的字段保持原值不变。更新后会自动保存到配置文件。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| SettingType | String | 是 | 设置类型名称。 |
| Settings | Object | 是 | 要更新的设置JSON对象。支持部分更新。 |

**调用示例**:

```json
{
  "CMD": "/settingsManager/updateSettings",
  "Data": {
    "SettingType": "HandlerSettings",
    "Settings": {
      "RotateConfig": {
        "RotationSpeed": 20.0,
        "MaxPitchAngle": 80.0
      },
      "PanConfig": {
        "PanSpeed": 1.0
      }
    }
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Message": "设置更新成功"
}

```

**特性**:

- ✅ 支持部分更新（只更新提供的字段）
- ✅ 自动保存到文件
- ✅ 支持撤销操作
- ✅ 触发设置变更事件

**注意点**:

- 只需提供要修改的字段，未提供的字段保持不变。
- 更新会立即生效并保存到文件。
- 如果提供的值超出取值范围，可能导致验证失败。

---

### 5. updateSettingProperty - 更新单个属性

**功能描述**: 
更新指定设置的单个属性值。适用于只需修改一个参数的场景，比批量更新更轻量。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| SettingType | String | 是 | 设置类型名称。 |
| PropertyPath | String | 是 | 属性路径。简单属性直接使用名称，嵌套属性使用点号分隔。 |
| PropertyValue | String | 是 | 属性值（字符串格式）。系统会自动转换为目标类型。 |

**属性路径格式**:

- 简单属性: `"SystemUnit"`
- 嵌套属性: `"RotateConfig.RotationSpeed"`

**调用示例**:

```json
{
  "CMD": "/settingsManager/updateSettingProperty",
  "Data": {
    "SettingType": "SystemSettings",
    "PropertyPath": "SystemUnit",
    "PropertyValue": "Centimeters"
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Message": "属性更新成功"
}

```

**使用场景**:

- 快速切换单个开关
- 调整单个数值参数
- 简化的UI控件绑定

---

### 6. resetSettings - 重置设置

**功能描述**: 
将指定设置重置为代码中定义的默认值。这是一个安全的恢复机制，可以在设置出现问题时快速恢复到已知的良好状态。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| SettingType | String | 是 | 设置类型名称。 |

**调用示例**:

```json
{
  "CMD": "/settingsManager/resetSettings",
  "Data": {
    "SettingType": "HandlerSettings"
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Message": "设置重置成功"
}

```

**特性**:

- ✅ 恢复到代码定义的默认值
- ✅ 自动保存到文件
- ✅ 支持撤销操作

**注意点**:

- 重置操作会覆盖所有当前值。
- 重置后的值会立即保存到文件。
- 建议在重置前提示用户确认。

---

### 7. reloadSettings - 重新加载设置

**功能描述**: 
从配置文件重新加载指定设置，放弃内存中的所有未保存修改。这对于多客户端同步或撤销未保存的修改非常有用。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| SettingType | String | 是 | 设置类型名称。 |

**调用示例**:

```json
{
  "CMD": "/settingsManager/reloadSettings",
  "Data": {
    "SettingType": "SystemSettings"
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Message": "设置重新加载成功"
}

```

**使用场景**:

- 放弃未保存的修改
- 从文件恢复设置
- 多客户端配置同步

**注意点**:

- 会丢失内存中所有未保存的修改。
- 如果配置文件不存在或损坏，将使用默认值。

---

### 8. saveSettings - 保存设置

**功能描述**: 
手动将指定设置保存到配置文件。通常情况下，`updateSettings` 和 `resetSettings` 会自动保存，此命令用于特殊场景的手动触发。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| SettingType | String | 是 | 设置类型名称。 |

**调用示例**:

```json
{
  "CMD": "/settingsManager/saveSettings",
  "Data": {
    "SettingType": "HandlerSettings"
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Message": "设置保存成功"
}

```

**注意点**:

- `updateSettings` 和 `resetSettings` 会自动保存。
- 此命令主要用于手动触发保存的场景。

---

### 9. saveAllSettings - 保存所有设置

**功能描述**: 
一次性将所有已注册的设置保存到各自的配置文件。这是最安全的批量保存方式。

**参数**:
无。

**调用示例**:

```json
{
  "CMD": "/settingsManager/saveAllSettings",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Message": "所有设置保存成功"
}

```

**使用场景**:

- 应用退出前保存所有配置
- 批量保存多个设置的修改
- 配置导出前确保数据一致性

---

### 10. getSystemSettings - 获取系统设置（快捷方式）

**功能描述**: 
快捷命令，无需指定 `SettingType` 参数，直接获取系统设置。代码更简洁，推荐使用。

**参数**:
无。

**调用示例**:

```json
{
  "CMD": "/settingsManager/getSystemSettings",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Settings": {
    "SystemUnit": "Meters"
  }
}

```

**优势**:

- 无需记住设置类型名称
- 代码更简洁
- 减少拼写错误

---

### 11. updateSystemSettings - 更新系统设置（快捷方式）

**功能描述**: 
快捷命令，无需指定 `SettingType` 参数，直接更新系统设置。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| Settings | Object | 是 | 要更新的系统设置JSON对象。 |

**调用示例**:

```json
{
  "CMD": "/settingsManager/updateSystemSettings",
  "Data": {
    "Settings": {
      "SystemUnit": "Centimeters"
    }
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Message": "设置更新成功"
}

```

---

### 12. getHandlerSettings - 获取Handler设置（快捷方式）

**功能描述**: 
快捷命令，无需指定 `SettingType` 参数，直接获取Handler设置。

**参数**:
无。

**调用示例**:

```json
{
  "CMD": "/settingsManager/getHandlerSettings",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Settings": {
    "BaseConfig": { ... },
    "RotateConfig": { ... },
    "PanConfig": { ... },
    "ZoomConfig": { ... }
  }
}

```

---

### 13. updateHandlerSettings - 更新Handler设置（快捷方式）

**功能描述**: 
快捷命令，无需指定 `SettingType` 参数，直接更新Handler设置。支持部分更新。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| Settings | Object | 是 | 要更新的Handler设置JSON对象。支持部分更新。 |

**调用示例**:

```json
{
  "CMD": "/settingsManager/updateHandlerSettings",
  "Data": {
    "Settings": {
      "RotateConfig": {
        "RotationSpeed": 20.0
      },
      "ZoomConfig": {
        "ZoomSpeed": 4.0
      }
    }
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Message": "设置更新成功"
}

```

**特性**:

- ✅ 支持部分更新
- ✅ 自动保存到文件
- ✅ 支持撤销操作

---

### 14. getWebCoreSettings - 获取WebCore设置（快捷方式）

**功能描述**: 
快捷命令，无需指定 `SettingType` 参数，直接获取WebCore设置（包含地理参考、路径类型和漫游配置）。

**参数**:
无。

**调用示例**:

```json
{
  "CMD": "/settingsManager/getWebCoreSettings",
  "Data": {}
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Settings": {
    "PlanetShape": 0,
    "bOriginAtPlanetCenter": false,
    "ProjectedCRS": "EPSG:4547",
    "GeographicCRS": "EPSG:4490",
    "bOriginLocationInProjectedCRS": false,
    "OriginLatitude": 22.516226,
    "OriginLongitude": 113.883095,
    "OriginAltitude": 0.0,
    "PathTypes": [
      {
        "TypeName": "Default",
        "ActorClassPath": "/WebCore/Res/PathTracer/BP_DefaultTracer.BP_DefaultTracer_C"
      }
    ]
  }
}

```

---

### 15. updateWebCoreSettings - 更新WebCore设置（快捷方式）

**功能描述**: 
快捷命令，无需指定 `SettingType` 参数，直接更新WebCore设置。支持部分更新。

**参数**:

| 参数 | 类型 | 必选 | 描述 |
|---|---|---|---|
| Settings | Object | 是 | 要更新的WebCore设置JSON对象。支持部分更新。 |

**调用示例**:

```json
{
  "CMD": "/settingsManager/updateWebCoreSettings",
  "Data": {
    "Settings": {
      "ProjectedCRS": "EPSG:3857",
      "GeographicCRS": "EPSG:4326",
      "OriginLatitude": 39.9042,
      "OriginLongitude": 116.4074
    }
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "Message": "设置更新成功"
}

```

**特性**:

- ✅ 支持部分更新
- ✅ 自动保存到文件
- ✅ 支持撤销操作
- ✅ 自动验证坐标范围
- ✅ 更新路径类型后自动重新加载

---

## 错误处理

| 错误码 | 描述 | 常见原因 | 建议处理 |
|---|---|---|---|
| `INVALID_PARAMETERS` | 输入参数缺失或格式错误。 | - 缺少必要参数如 `SettingType`、`Settings`。<br>- JSON格式错误。<br>- 参数值超出取值范围。 | - 核对API文档，确保所有必需参数都已提供。<br>- 验证JSON格式正确性。<br>- 检查参数值是否在有效范围内。 |
| `RESOURCE_NOT_FOUND` | 未找到指定的设置类型。 | - `SettingType` 拼写错误。<br>- 设置类型未注册。<br>- 自定义设置未正确加载。 | - 先调用 `getRegisteredSettingTypes` 获取可用类型。<br>- 检查设置类型名称拼写。<br>- 确认自定义设置已注册。 |
| `OPERATION_FAILED` | 设置操作失败。 | - 文件写入权限不足。<br>- 配置文件损坏。<br>- 设置验证失败。 | - 检查应用是否有配置目录的写权限。<br>- 尝试重置设置恢复默认值。<br>- 查看UE日志了解详细错误。 |
| `DEPENDENCY_FAILED` | 设置管理器未初始化。 | - 插件未正确加载。<br>- 初始化顺序问题。 | - 检查插件是否已启用。<br>- 查看启动日志排查初始化错误。 |

**错误返回示例**:

```json
{
  "StatusCode": 40400,
  "Message": "未找到设置类型: InvalidSettings"
}

```

---

## 使用注意事项

- **配置文件位置**: 所有设置保存在 `[ProjectDir]/Config/WebFramework/Settings.json`。
- **首次启动行为**: 
  - 如果配置文件不存在，系统会自动使用默认值并生成配置文件
  - 如果配置文件存在但损坏，系统会使用默认值覆盖并修复文件
  - 所有设置类（SystemSettings、HandlerSettings、WebCoreSettings 等）共享同一个 JSON 文件
- **自动保存**: `updateSettings`、`updateSystemSettings`、`updateHandlerSettings` 和 `resetSettings` 会自动保存到文件。
- **部分更新**: 更新命令支持部分更新，只需提供要修改的字段。
- **撤销支持**: 更新和重置命令支持撤销操作。
- **单位换算**: `SystemSettings` 的单位设置会影响所有长度相关参数的换算。
- **参数验证**: 系统会验证参数值是否在有效范围内，超出范围会导致操作失败。
- **线程安全**: 所有命令在游戏线程执行，无需担心并发问题。

---

## 典型调用流程

### 初始化流程
```json
// 1. 获取可用设置类型
{
  "CMD": "/settingsManager/getRegisteredSettingTypes",
  "Data": {}
}

// 2. 获取所有设置
{
  "CMD": "/settingsManager/getAllSettings",
  "Data": {}
}

```

### 快捷更新流程（推荐）
```json
// 使用快捷命令更新Handler设置
{
  "CMD": "/settingsManager/updateHandlerSettings",
  "Data": {
    "Settings": {
      "RotateConfig": {
        "RotationSpeed": 20.0,
        "MaxPitchAngle": 80.0
      }
    }
  }
}

```

### 通用更新流程
```json
// 使用通用命令更新任意设置
{
  "CMD": "/settingsManager/updateSettings",
  "Data": {
    "SettingType": "HandlerSettings",
    "Settings": {
      "ZoomConfig": {
        "ZoomSpeed": 4.0
      }
    }
  }
}

```

### 重置流程
```json
// 重置Handler设置为默认值
{
  "CMD": "/settingsManager/resetSettings",
  "Data": {
    "SettingType": "HandlerSettings"
  }
}

```

---

## 扩展自定义设置

### 1. 创建自定义设置类

```cpp
// MyCustomSettings.h
#pragma once

#include "CoreMinimal.h"
#include "Config/WebFrameworkSettings.h"
#include "MyCustomSettings.generated.h"

UCLASS()
class MYPROJECT_API UMyCustomSettings : public UWebFrameworkSettings
{
    GENERATED_BODY()

public:
    UMyCustomSettings();

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Custom")
    float MyFloatValue = 1.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Custom")
    FString MyStringValue = TEXT("Default");

    virtual FString GetSettingTypeName() const override 
    { 
        return TEXT("MyCustomSettings"); 
    }
};

```

### 2. 注册自定义设置

在 `SettingsManagerFactory::RegisterDefaultSettings()` 中添加：

```cpp
// 注册自定义设置
if (SettingManager->RegisterSettingsClass(UMyCustomSettings::StaticClass()))
{
    WEB_LOG_REGISTER(TEXT("注册自定义设置: MyCustomSettings"));
}

```

### 3. 前端使用

```javascript
// 获取自定义设置
const response = await emitUIInteraction({
  CMD: "/settingsManager/getSettings",
  Data: {
    SettingType: "MyCustomSettings"
  }
});

// 更新自定义设置
await emitUIInteraction({
  CMD: "/settingsManager/updateSettings",
  Data: {
    SettingType: "MyCustomSettings",
    Settings: {
      MyFloatValue: 2.5,
      MyStringValue: "Updated"
    }
  }
});

```

---

### 16. initGeoReference - 初始化地理参考系统

**功能描述**: 
初始化并配置场景中的 GeoReferencingSystem。所有参数均为可选，不提供的参数将使用 WebCoreSettings 中的当前值。该命令会更新 WebCoreSettings 配置并应用到 GeoReferencingSystem。

**参数**:

| 参数 | 类型 | 必选 | 默认值 | 描述 |
|---|---|---|---|---|
| ProjectedCRS | String | 否 | `"EPSG:4547"` | 投影坐标系标识符 |
| GeographicCRS | String | 否 | `"EPSG:4490"` | 地理坐标系标识符 |
| OriginLatitude | Double | 否 | `22.516226` | 原点纬度（-90.0 ~ 90.0） |
| OriginLongitude | Double | 否 | `113.883095` | 原点经度（-180.0 ~ 180.0） |
| OriginAltitude | Double | 否 | `0.0` | 原点高度（米） |
| PlanetShape | Integer | 否 | `0` | 星球形状（0=平面, 1=球形） |
| bOriginAtPlanetCenter | Boolean | 否 | `false` | 原点是否在星球中心 |
| bOriginLocationInProjectedCRS | Boolean | 否 | `false` | 原点是否使用投影坐标 |

**调用示例**:

使用默认设置初始化：

```json
{
  "CMD": "/settingsManager/initGeoReference",
  "Data": {}
}

```

自定义部分参数：

```json
{
  "CMD": "/settingsManager/initGeoReference",
  "Data": {
    "ProjectedCRS": "EPSG:3857",
    "GeographicCRS": "EPSG:4326",
    "OriginLatitude": 39.9042,
    "OriginLongitude": 116.4074
  }
}

```

完整配置：

```json
{
  "CMD": "/settingsManager/initGeoReference",
  "Data": {
    "ProjectedCRS": "EPSG:4547",
    "GeographicCRS": "EPSG:4490",
    "OriginLatitude": 22.516226,
    "OriginLongitude": 113.883095,
    "OriginAltitude": 0.0,
    "PlanetShape": 0,
    "bOriginAtPlanetCenter": false,
    "bOriginLocationInProjectedCRS": false
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 20000,
  "AppliedSettings": {
    "ProjectedCRS": "EPSG:3857",
    "GeographicCRS": "EPSG:4326",
    "OriginLatitude": 39.9042,
    "OriginLongitude": 116.4074,
    "OriginAltitude": 0.0,
    "PlanetShape": 0,
    "bOriginAtPlanetCenter": false,
    "bOriginLocationInProjectedCRS": false
  }
}

```

**特性**:

- ✅ 所有参数可选
- ✅ 自动保存配置到文件
- ✅ 自动创建或更新 GeoReferencingSystem
- ✅ 返回实际应用的配置

**使用场景**:

- 项目启动时初始化地理坐标系统
- 动态切换不同地区的坐标配置
- 设置项目的地理原点

**注意点**:

- 纬度必须在 [-90, 90] 范围内
- 经度必须在 [-180, 180] 范围内
- 坐标系字符串不能为空
- 如果场景中不存在 GeoReferencingSystem，会自动创建
- 使用 WebCoreSettings 而不是已废弃的 WebGeoSettings

---

## 相关文档

- [使用示例](./SettingsManager_Examples.md) - 详细的前端集成示例
- [快速参考](./SettingsManager_QuickReference.md) - 命令速查表
- [系统说明](./SettingsManager_README.md) - 完整的系统架构文档
