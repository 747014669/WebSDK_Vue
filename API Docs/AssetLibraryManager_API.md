# AssetLibraryManager API 文档

## 概述

AssetLibraryManager 负责管理资源库 UI 的加载和关闭。支持动态加载 Pak 文件、显示资源库界面、按类型过滤资源和卸载资源。

**命令路径格式**: `/assetLibrary/CommandName`

**包含命令组**:

- **资源库管理** (2个): 加载资源库 UI、关闭资源库 UI

---

## 资源库命令

### 1. loadAssetLibraryUI - 加载资源库 UI

**功能描述**:
加载指定的 Pak 文件，显示资源库 UI 界面，支持按资源类型过滤显示。

**参数说明**:

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pakFilePath | String | 是 | - | Pak 文件的完整路径（例如：D:/Assets/library.pak） |
| assetType | String | 否 | "All" | 资源类型过滤：`All`, `StaticMesh`, `Material`, `Texture` |

**调用示例 - 加载所有资源**:

```json
{
  "CMD": "/assetLibrary/loadAssetLibraryUI",
  "Data": {
    "pakFilePath": "D:/Assets/building_library.pak"
  }
}

```

**调用示例 - 只显示静态网格**:

```json
{
  "CMD": "/assetLibrary/loadAssetLibraryUI",
  "Data": {
    "pakFilePath": "D:/Assets/building_library.pak",
    "assetType": "StaticMesh"
  }
}

```

**调用示例 - 只显示材质**:

```json
{
  "CMD": "/assetLibrary/loadAssetLibraryUI",
  "Data": {
    "pakFilePath": "D:/Assets/material_library.pak",
    "assetType": "Material"
  }
}

```

**返回示例**:

```json
{
  "StatusCode": 200
}

```

**资源类型说明**:

| 类型 | 说明 | 别名 |
|------|------|------|
| `All` | 显示所有资源类型 | - |
| `StaticMesh` | 只显示静态网格 | `static_mesh`, `mesh` |
| `Material` | 只显示材质 | `mat` |
| `Texture` | 只显示纹理 | `tex` |

**特性说明**:

- **Pak 挂载**: 自动挂载指定的 Pak 文件到虚拟文件系统
- **UI 显示**: 创建并显示资源库 UI Widget
- **类型过滤**: 根据 assetType 参数过滤显示的资源
- **异步加载**: 资源库 UI 异步加载 Pak 中的资源

**注意事项**:

- Pak 文件路径必须是有效的文件路径
- Pak 文件必须是有效的 UE5 Pak 格式
- 加载前会自动检查 Pak 文件是否存在
- 同一时间可以加载多个资源库 UI

---

### 2. closeAssetLibraryUI - 关闭资源库 UI

**功能描述**:
关闭指定的资源库 UI 界面，支持同时卸载关联的 Pak 文件。

**参数说明**:

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| libraryName | String | 否 | "" | 资源库名称（为空则关闭所有资源库 UI） |
| unloadPak | Boolean | 否 | false | 是否同时卸载 Pak 文件 |

**调用示例 - 关闭指定资源库**:

```json
{
  "CMD": "/assetLibrary/closeAssetLibraryUI",
  "Data": {
    "libraryName": "building_library",
    "unloadPak": true
  }
}

```

**调用示例 - 关闭所有资源库**:

```json
{
  "CMD": "/assetLibrary/closeAssetLibraryUI",
  "Data": {
    "unloadPak": true
  }
}

```

**调用示例 - 只关闭 UI，保留 Pak**:

```json
{
  "CMD": "/assetLibrary/closeAssetLibraryUI",
  "Data": {
    "libraryName": "building_library",
    "unloadPak": false
  }
}

```

**返回示例**:

```json
{
  "closedCount": 1,
  "unmountedPakCount": 1,
  "message": "成功关闭 1 个资源库界面"
}

```

**返回示例 - 未找到资源库**:

```json
{
  "closedCount": 0,
  "unmountedPakCount": 0,
  "message": "没有找到需要关闭的资源库界面"
}

```

**返回字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| closedCount | Integer | 关闭的资源库 UI 数量 |
| unmountedPakCount | Integer | 卸载的 Pak 文件数量 |
| message | String | 操作结果消息 |

**特性说明**:

- **精确关闭**: 按名称关闭指定的资源库 UI
- **全量关闭**: 不指定名称时关闭所有资源库 UI
- **Pak 卸载**: 可选择同时卸载关联的 Pak 文件
- **资源清理**: 关闭时自动清理 UI 相关资源

**注意事项**:

- 关闭 UI 后，如果不卸载 Pak，资源仍然可以访问
- 卸载 Pak 后，资源库中的资源将无法访问
- 如果有多个 UI 使用同一个 Pak，卸载时会同时卸载该 Pak

---

## 错误处理

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| INVALID_PARAMETERS | 参数验证失败 | 检查 pakFilePath 是否为非空字符串 |
| INVALID_PARAMETERS | Pak 文件路径为空 | 确保提供了有效的 Pak 文件路径 |
| EXECUTION_FAILED | Pak 文件挂载失败 | 检查 Pak 文件是否存在、格式是否正确 |
| EXECUTION_FAILED | 创建 UI Widget 失败 | 检查 UAssetLibraryWidget 类是否正确配置 |
| SERVICE_UNAVAILABLE | 无法获取必要的系统组件 | 确保游戏世界已正确初始化 |

**错误返回示例**:

```json
{
  "StatusCode": 400,
  "Message": "缺少必需参数: pakFilePath"
}

```

```json
{
  "StatusCode": 500,
  "Message": "挂载Pak失败: D:/Assets/invalid.pak"
}

```

---

## Pak 文件管理说明

### Pak 文件格式

- **格式**: UE5 Pak 文件格式
- **扩展名**: `.pak`
- **内容**: 可包含 StaticMesh、Material、Texture 等资源

### Pak 挂载/卸载

- **挂载**: 将 Pak 文件挂载到虚拟文件系统，使其中的资源可访问
- **卸载**: 从虚拟文件系统卸载 Pak 文件，释放资源
- **自动管理**: 系统自动管理 Pak 的挂载和卸载

### 资源访问

- **挂载后**: Pak 中的资源可以通过资源库 UI 访问
- **卸载后**: 资源无法访问，但 UI 仍然存在（如果未关闭）
- **重新挂载**: 可以重新加载同一个 Pak 文件

---

## 资源类型说明

### StaticMesh（静态网格）

- **用途**: 场景中的静态物体（建筑、道具等）
- **特点**: 不可动画，性能高
- **示例**: 建筑模型、树木、家具

### Material（材质）

- **用途**: 物体表面的外观定义
- **特点**: 定义颜色、纹理、反射等属性
- **示例**: 砖墙材质、金属材质、玻璃材质

### Texture（纹理）

- **用途**: 材质中使用的图像数据
- **特点**: 2D 图像，用于贴图
- **示例**: 砖块纹理、木纹纹理、金属纹理

---

## 使用注意事项

### 最佳实践

1. **Pak 准备**: 确保 Pak 文件已正确打包，包含所需资源
2. **路径检查**: 使用绝对路径或相对于游戏目录的路径
3. **类型过滤**: 根据需要选择合适的资源类型过滤
4. **及时清理**: 不需要时及时关闭 UI 和卸载 Pak，释放内存

### 性能考虑

- **Pak 大小**: 大型 Pak 文件加载时间较长
- **资源数量**: 资源数量过多会影响 UI 响应速度
- **内存占用**: 加载的资源会占用内存，建议定期卸载
- **并发加载**: 避免同时加载过多 Pak 文件

### 错误处理

- **Pak 不存在**: 检查文件路径是否正确
- **Pak 格式错误**: 确保 Pak 文件是有效的 UE5 格式
- **权限问题**: 检查文件是否有读取权限
- **磁盘空间**: 确保有足够的磁盘空间用于缓存

### 资源库 UI 配置

- **Widget 类**: 确保 UAssetLibraryWidget 类已正确实现
- **UI 样式**: 可在蓝图中自定义 UI 外观
- **交互逻辑**: 可在蓝图中实现资源选择和使用逻辑

---

## 完整使用流程示例

### 场景1: 加载并使用资源库

```json
// 1. 加载建筑资源库（显示所有资源）
{
  "CMD": "/assetLibrary/loadAssetLibraryUI",
  "Data": {
    "pakFilePath": "D:/Assets/building_library.pak"
  }
}
// 返回: {"StatusCode": 200}

// 2. 用户在 UI 中选择资源并使用

// 3. 关闭资源库 UI 并卸载 Pak
{
  "CMD": "/assetLibrary/closeAssetLibraryUI",
  "Data": {
    "unloadPak": true
  }
}
// 返回: {"closedCount": 1, "unmountedPakCount": 1, "message": "成功关闭 1 个资源库界面"}

```

### 场景2: 按类型过滤资源

```json
// 1. 加载材质库（只显示材质）
{
  "CMD": "/assetLibrary/loadAssetLibraryUI",
  "Data": {
    "pakFilePath": "D:/Assets/material_library.pak",
    "assetType": "Material"
  }
}

// 2. 用户选择材质

// 3. 关闭 UI
{
  "CMD": "/assetLibrary/closeAssetLibraryUI",
  "Data": {
    "libraryName": "material_library",
    "unloadPak": true
  }
}

```

### 场景3: 多个资源库同时打开

```json
// 1. 加载建筑资源库
{
  "CMD": "/assetLibrary/loadAssetLibraryUI",
  "Data": {
    "pakFilePath": "D:/Assets/building_library.pak",
    "assetType": "StaticMesh"
  }
}

// 2. 加载材质资源库
{
  "CMD": "/assetLibrary/loadAssetLibraryUI",
  "Data": {
    "pakFilePath": "D:/Assets/material_library.pak",
    "assetType": "Material"
  }
}

// 3. 用户在两个资源库中选择资源

// 4. 关闭所有资源库
{
  "CMD": "/assetLibrary/closeAssetLibraryUI",
  "Data": {
    "unloadPak": true
  }
}
// 返回: {"closedCount": 2, "unmountedPakCount": 2, "message": "成功关闭 2 个资源库界面"}

```

### 场景4: 保留 Pak，只关闭 UI

```json
// 1. 加载资源库
{
  "CMD": "/assetLibrary/loadAssetLibraryUI",
  "Data": {
    "pakFilePath": "D:/Assets/library.pak"
  }
}

// 2. 用户使用资源

// 3. 关闭 UI，但保留 Pak（资源仍可访问）
{
  "CMD": "/assetLibrary/closeAssetLibraryUI",
  "Data": {
    "unloadPak": false
  }
}
// 返回: {"closedCount": 1, "unmountedPakCount": 0, "message": "成功关闭 1 个资源库界面"}

// 4. 稍后再次打开资源库（无需重新加载 Pak）
{
  "CMD": "/assetLibrary/loadAssetLibraryUI",
  "Data": {
    "pakFilePath": "D:/Assets/library.pak"
  }
}

```

---

## 技术实现说明

### Pak 加载流程

1. **路径验证**: 检查 Pak 文件路径是否有效
2. **文件检查**: 验证 Pak 文件是否存在
3. **Pak 挂载**: 使用 UWebCorePakLoaderLibrary 挂载 Pak 文件
4. **UI 创建**: 创建 UAssetLibraryWidget 实例
5. **资源加载**: 异步加载 Pak 中的资源
6. **UI 显示**: 将 UI 添加到视口

### UI 架构

- **Widget 类**: UAssetLibraryWidget
- **显示方式**: 添加到视口（Viewport）
- **交互**: 支持鼠标和键盘交互
- **自定义**: 可在蓝图中扩展功能

### 资源过滤

- **类型检查**: 根据资源类型过滤显示
- **支持的类型**: StaticMesh、Material、Texture
- **默认行为**: 不指定类型时显示所有资源

### Pak 卸载流程

1. **UI 关闭**: 移除 UI Widget 从视口
2. **资源清理**: 清理 UI 相关资源
3. **Pak 卸载**: 使用 UWebCorePakLoaderLibrary 卸载 Pak
4. **内存释放**: 释放 Pak 占用的内存

---

## 版本历史

- **v1.0** - 初始版本，包含 2 个命令
  - loadAssetLibraryUI - 加载资源库 UI
  - closeAssetLibraryUI - 关闭资源库 UI

---

## 参考资料

- **命令基类**: `UCommandBase` - WebFrameWork 插件
- **工厂基类**: `UCommandFactoryBase` - WebFrameWork 插件
- **日志宏**: `.kiro/steering/logging-macros.md`
- **相关命令工厂**:
  - GlsCommandFactory - 场景和对象管理
  - CameraManager - 相机控制
  - HeatmapManager - 热力图管理
  - CacheManager - 缓存管理
